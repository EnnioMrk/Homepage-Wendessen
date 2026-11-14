'use client';

import {
    useRef,
    useState,
    type ChangeEvent,
    type DragEvent,
    type FormEvent,
} from 'react';
import Image from 'next/image';
import { createPortal } from 'react-dom';
import * as exifr from 'exifr';
import { useDialog } from '@/app/impressionen/dialog';
import styles from '@/app/impressionen/impressionen.module.css';
import { formatFileSize } from '@/app/impressionen/format';

const MAX_FILE_BYTES = 10 * 1024 * 1024;

interface PhotoData {
    file: File;
    preview: string;
    description: string;
    dateTaken?: string;
    location?: string;
}

interface GalleryGroup {
    submissionGroupId: string;
    title: string;
    description?: string;
    submitterNames: string[];
    submittedAt: Date;
    totalCount: number;
}

interface AddPhotosModalProps {
    group: GalleryGroup;
    onClose: () => void;
    onSuccess: () => void;
}

function readPreview(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
    });
}

export default function AddPhotosModal({
    group,
    onClose,
    onSuccess,
}: AddPhotosModalProps) {
    const [photos, setPhotos] = useState<PhotoData[]>([]);
    const [submitterName, setSubmitterName] = useState('');
    const [submitterEmail, setSubmitterEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [progress, setProgress] = useState<{ done: number; total: number } | null>(
        null,
    );
    const [error, setError] = useState('');
    const [dragging, setDragging] = useState(false);

    const panelRef = useRef<HTMLDivElement>(null);
    useDialog(panelRef, onClose);

    async function addFiles(files: File[]) {
        if (files.length === 0) return;

        for (const file of files) {
            if (!file.type.startsWith('image/')) {
                setError(
                    `Die Datei "${file.name}" ist kein Bild. Erlaubt sind JPG, PNG und WebP.`,
                );
                return;
            }
            if (file.size > MAX_FILE_BYTES) {
                setError(
                    `Die Datei "${file.name}" ist zu groß. Höchstens 10 MB pro Foto.`,
                );
                return;
            }
        }

        setError('');
        const next: PhotoData[] = [];

        for (const file of files) {
            let dateTaken: string | undefined;
            let location: string | undefined;

            try {
                const exif = await exifr.parse(file, {
                    pick: [
                        'DateTimeOriginal',
                        'CreateDate',
                        'DateTime',
                        'GPSLatitude',
                        'GPSLongitude',
                    ],
                });

                if (exif) {
                    const exifDate =
                        exif.DateTimeOriginal ?? exif.CreateDate ?? exif.DateTime;
                    if (exifDate) {
                        dateTaken = new Date(exifDate).toISOString();
                    }
                    if (exif.GPSLatitude && exif.GPSLongitude) {
                        location = `${exif.GPSLatitude.toFixed(6)}, ${exif.GPSLongitude.toFixed(6)}`;
                    }
                }
            } catch {
                // A photo without EXIF is still a photo.
            }

            const preview = await readPreview(file);
            next.push({ file, preview, description: '', dateTaken, location });
        }

        setPhotos((current) => [...current, ...next]);
    }

    const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files ?? []);
        event.target.value = '';
        await addFiles(files);
    };

    const handleDrop = async (event: DragEvent<HTMLLabelElement>) => {
        event.preventDefault();
        setDragging(false);
        await addFiles(Array.from(event.dataTransfer.files ?? []));
    };

    const removePhoto = (index: number) => {
        setPhotos((current) => current.filter((_, i) => i !== index));
    };

    const updatePhotoDescription = (index: number, description: string) => {
        setPhotos((current) =>
            current.map((photo, i) =>
                i === index ? { ...photo, description } : photo,
            ),
        );
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setError('');

        if (photos.length === 0) {
            setError('Bitte fügen Sie mindestens ein Foto hinzu.');
            return;
        }

        if (!submitterName.trim()) {
            setError('Bitte geben Sie Ihren Namen ein.');
            return;
        }

        setIsSubmitting(true);

        try {
            for (const [index, photo] of photos.entries()) {
                setProgress({ done: index, total: photos.length });

                const response = await fetch('/api/shared-gallery/submit', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        submissionGroupId: group.submissionGroupId,
                        title: group.title,
                        description: photo.description || '',
                        submitterName,
                        submitterEmail,
                        imageData: photo.preview,
                        imageMimeType: photo.file.type,
                        imageFilename: photo.file.name,
                        dateTaken: photo.dateTaken,
                        location: photo.location,
                    }),
                });

                if (!response.ok) {
                    throw new Error('Fehler beim Hochladen');
                }
            }

            setProgress(null);
            onSuccess();
        } catch (uploadError) {
            console.error('Error submitting photos:', uploadError);
            setProgress(null);
            setError(
                'Fehler beim Hochladen der Fotos. Bitte versuchen Sie es erneut.',
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return createPortal(
        <div className={styles.dialog}>
            <div
                ref={panelRef}
                className={`${styles.dialogPanel} ${styles.dialogWide}`}
                role="dialog"
                aria-modal="true"
                aria-labelledby="add-photos-title"
            >
                <div className={styles.dialogHead}>
                    <div>
                        <h2 id="add-photos-title">Fotos ergänzen</h2>
                        <p className={styles.dialogSub}>
                            Sammlung: {group.title} · {group.totalCount} Fotos
                        </p>
                    </div>
                    <button
                        type="button"
                        className="btn btn--sm"
                        onClick={onClose}
                        aria-label="Schließen"
                        data-autofocus
                    >
                        Schließen
                    </button>
                </div>

                <form className="form-grid" onSubmit={handleSubmit}>
                    {error && (
                        <div className="notice notice--error" role="alert">
                            <strong>Nicht hochgeladen</strong>
                            <span>{error}</span>
                        </div>
                    )}

                    {progress && (
                        <div className="notice" role="status" aria-live="polite">
                            <strong>Wird hochgeladen</strong>
                            <span>
                                Foto {progress.done + 1} von {progress.total}
                            </span>
                        </div>
                    )}

                    <div className="form-row">
                        <div className="field">
                            <label htmlFor="add-name">Ihr Name *</label>
                            <input
                                className="input"
                                id="add-name"
                                type="text"
                                value={submitterName}
                                onChange={(event) =>
                                    setSubmitterName(event.target.value)
                                }
                                maxLength={255}
                                autoComplete="name"
                                required
                            />
                        </div>
                        <div className="field">
                            <label htmlFor="add-email">
                                E-Mail-Adresse (optional)
                            </label>
                            <input
                                className="input"
                                id="add-email"
                                type="email"
                                value={submitterEmail}
                                onChange={(event) =>
                                    setSubmitterEmail(event.target.value)
                                }
                                maxLength={255}
                                autoComplete="email"
                            />
                            <span className="hint">
                                Wird nicht öffentlich angezeigt, nur für
                                Rückfragen.
                            </span>
                        </div>
                    </div>

                    <div>
                        <span className="field-label">Fotos auswählen *</span>
                        <label
                            className={`dropzone ${styles.dz}`}
                            htmlFor="add-photos"
                            data-active={dragging}
                            onDragOver={(event) => {
                                event.preventDefault();
                                setDragging(true);
                            }}
                            onDragLeave={() => setDragging(false)}
                            onDrop={handleDrop}
                        >
                            <span className={styles.dropTitle}>
                                Fotos hier ablegen
                            </span>
                            <span className={styles.dropHint}>
                                JPG, PNG oder WebP · höchstens 10 MB je Foto ·
                                mehrere Dateien möglich
                            </span>
                            <span className={styles.dropLink}>
                                Dateien auswählen
                            </span>
                            <input
                                className="visually-hidden"
                                id="add-photos"
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleFileChange}
                            />
                        </label>
                    </div>

                    {photos.length > 0 && (
                        <ul className="file-list">
                            {photos.map((photo, index) => (
                                <li
                                    key={`${photo.file.name}-${index}`}
                                    className={styles.fileRow}
                                >
                                    <span className={styles.fileThumb}>
                                        <Image
                                            src={photo.preview}
                                            alt=""
                                            width={56}
                                            height={56}
                                            unoptimized
                                        />
                                    </span>
                                    <div className={styles.fileBody}>
                                        <span className={styles.fileName}>
                                            {photo.file.name}
                                        </span>
                                        <span className={styles.fileMeta}>
                                            {formatFileSize(
                                                photo.file.size,
                                            )}
                                            {photo.location
                                                ? ` · GPS ${photo.location}`
                                                : ''}
                                        </span>
                                        <div className="field">
                                            <label
                                                htmlFor={`add-desc-${index}`}
                                            >
                                                Beschreibung (optional)
                                            </label>
                                            <textarea
                                                className={`textarea ${styles.desc}`}
                                                id={`add-desc-${index}`}
                                                rows={2}
                                                value={photo.description}
                                                onChange={(event) =>
                                                    updatePhotoDescription(
                                                        index,
                                                        event.target.value,
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        className={`btn btn--quiet btn--sm ${styles.fileRemove}`}
                                        onClick={() => removePhoto(index)}
                                    >
                                        Entfernen
                                        <span className="visually-hidden">
                                            {' '}
                                            {photo.file.name}
                                        </span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}

                    <div className="form-actions">
                        <button
                            type="submit"
                            className="btn btn--primary"
                            disabled={isSubmitting || photos.length === 0}
                            aria-busy={isSubmitting}
                        >
                            {isSubmitting
                                ? 'Wird hochgeladen …'
                                : `${photos.length} ${photos.length === 1 ? 'Foto' : 'Fotos'} hinzufügen`}
                        </button>
                        <button
                            type="button"
                            className="btn"
                            onClick={onClose}
                            disabled={isSubmitting}
                        >
                            Abbrechen
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body,
    );
}
