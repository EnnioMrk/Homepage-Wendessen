'use client';

import {
    useEffect,
    useState,
    type ChangeEvent,
    type DragEvent,
    type FormEvent,
} from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import exifr from 'exifr';
import { Empty, Notice, SectionHead } from '@/app/components/register/Layout';
import styles from '../../impressionen.module.css';
import { formatFileSize } from '@/app/impressionen/format';

const MAX_FILE_BYTES = 10 * 1024 * 1024;

interface PhotoData {
    file: File;
    preview: string;
    description: string;
    location?: string;
}

function parseDateInputToDate(dateValue: string): Date | undefined {
    if (!dateValue) return undefined;

    const [year, month, day] = dateValue.split('-').map(Number);

    if (!year || !month || !day) return undefined;

    return new Date(year, month - 1, day, 12, 0, 0);
}

function readPreview(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
    });
}

interface SubmissionGroup {
    submissionGroupId: string;
    title: string;
    description?: string;
    submitterName?: string;
    totalCount: number;
}

export default function AddToExistingForm() {
    const router = useRouter();
    const [groups, setGroups] = useState<SubmissionGroup[]>([]);
    const [selectedGroupId, setSelectedGroupId] = useState('');
    const [photos, setPhotos] = useState<PhotoData[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [progress, setProgress] = useState<{ done: number; total: number } | null>(
        null,
    );
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [collectionDateStart, setCollectionDateStart] = useState('');
    const [collectionDateEnd, setCollectionDateEnd] = useState('');
    const [hasDateRange, setHasDateRange] = useState(false);
    const [dragging, setDragging] = useState(false);

    async function loadGroups() {
        setLoading(true);
        setLoadError(false);

        try {
            const response = await fetch('/api/shared-gallery/my-groups');
            if (!response.ok) throw new Error('groups failed');
            const data = (await response.json()) as {
                groups?: SubmissionGroup[];
            };
            setGroups(data.groups ?? []);
        } catch (loadFailure) {
            console.error('Error fetching groups:', loadFailure);
            setLoadError(true);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        void loadGroups();
        // Runs once: the list is fetched again only through the retry button.
    }, []);

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

        setError(null);
        const next: PhotoData[] = [];

        for (const file of files) {
            let location: string | undefined;

            try {
                const exifData = await exifr.parse(file, {
                    pick: ['GPSLatitude', 'GPSLongitude'],
                });

                if (exifData?.GPSLatitude && exifData?.GPSLongitude) {
                    location = `${exifData.GPSLatitude.toFixed(6)}, ${exifData.GPSLongitude.toFixed(6)}`;
                }
            } catch {
                // A photo without GPS data is still a photo.
            }

            const preview = await readPreview(file);
            next.push({ file, preview, description: '', location });
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

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!selectedGroupId) {
            setError('Bitte wählen Sie eine Sammlung aus.');
            return;
        }

        if (photos.length === 0) {
            setError('Bitte fügen Sie mindestens ein Foto hinzu.');
            return;
        }

        if (hasDateRange) {
            if (!collectionDateStart || !collectionDateEnd) {
                setError(
                    'Bitte geben Sie für den Zeitraum ein Start- und Enddatum an.',
                );
                return;
            }

            if (collectionDateEnd < collectionDateStart) {
                setError('Das Enddatum darf nicht vor dem Startdatum liegen.');
                return;
            }
        }

        const collectionDateTaken = parseDateInputToDate(collectionDateStart);
        const collectionDateRangeEnd = parseDateInputToDate(collectionDateEnd);

        setSubmitting(true);
        setError(null);

        try {
            const selectedGroup = groups.find(
                (group) => group.submissionGroupId === selectedGroupId,
            );
            if (!selectedGroup) throw new Error('Gruppe nicht gefunden');

            for (const [index, photo] of photos.entries()) {
                setProgress({ done: index, total: photos.length });

                const response = await fetch('/api/shared-gallery/submit', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        submissionGroupId: selectedGroupId,
                        title: selectedGroup.title,
                        description: photo.description.trim() || undefined,
                        submitterName: selectedGroup.submitterName,
                        imageData: photo.preview,
                        imageMimeType: photo.file.type,
                        imageFilename: photo.file.name,
                        dateTaken: collectionDateTaken?.toISOString(),
                        dateTakenRangeEnd:
                            hasDateRange && collectionDateRangeEnd
                                ? collectionDateRangeEnd.toISOString()
                                : undefined,
                        location: photo.location,
                    }),
                });

                if (!response.ok) {
                    let message = `Fehler beim Hochladen von Foto ${index + 1}`;
                    try {
                        const errorData = (await response.json()) as {
                            error?: string;
                        };
                        if (errorData.error) message = errorData.error;
                    } catch {
                        // No JSON body; keep the German fallback.
                    }
                    setError(message);
                    setProgress(null);
                    setSubmitting(false);
                    return;
                }
            }

            setProgress(null);
            setSuccess(true);
            setPhotos([]);
            setSelectedGroupId('');
            setCollectionDateStart('');
            setCollectionDateEnd('');
            setHasDateRange(false);
        } catch (submitError) {
            console.error('Submission error:', submitError);
            setProgress(null);
            setError('Fehler beim Hinzufügen der Fotos.');
        } finally {
            setSubmitting(false);
        }
    };

    if (success) {
        return (
            <div className="form-card">
                <h2>Fotos ergänzt</h2>
                <div className="notice notice--ok" role="status">
                    <strong>Vielen Dank</strong>
                    <span>
                        Ihre zusätzlichen Fotos wurden eingereicht und werden
                        geprüft.
                    </span>
                </div>
                <div className="form-actions">
                    <button
                        type="button"
                        className="btn btn--primary"
                        onClick={() => setSuccess(false)}
                    >
                        Weitere Fotos hinzufügen
                    </button>
                    <button
                        type="button"
                        className="btn"
                        onClick={() => router.push('/impressionen')}
                    >
                        Zur Galerie
                    </button>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="form-card">
                <h2>Sammlung wählen</h2>
                <div className="notice" role="status" aria-live="polite">
                    <strong>Wird geladen</strong>
                    <span>Die Sammlungen im Register werden gelesen …</span>
                </div>
            </div>
        );
    }

    if (loadError) {
        return (
            <div className="form-card">
                <h2>Sammlung wählen</h2>
                <Notice tone="error" title="Sammlungen nicht geladen">
                    Die Liste der Sammlungen ist gerade nicht erreichbar.
                </Notice>
                <div className="form-actions">
                    <button
                        type="button"
                        className="btn btn--primary"
                        onClick={() => void loadGroups()}
                    >
                        Erneut laden
                    </button>
                    <Link className="btn" href="/impressionen/einreichen">
                        Neue Sammlung anlegen
                    </Link>
                </div>
            </div>
        );
    }

    if (groups.length === 0) {
        return (
            <section aria-labelledby="sammlung-waehlen">
                <SectionHead title="Sammlung wählen" id="sammlung-waehlen" />
                <Empty
                    title="Keine Sammlung gefunden"
                    action={
                        <Link
                            className="btn btn--primary"
                            href="/impressionen/einreichen"
                        >
                            Neue Sammlung anlegen
                        </Link>
                    }
                >
                    Es steht noch keine Sammlung im Register, zu der Fotos
                    ergänzt werden könnten. Legen Sie zuerst eine Einreichung
                    an.
                </Empty>
            </section>
        );
    }

    const canSubmit = !submitting && photos.length > 0 && Boolean(selectedGroupId);

    return (
        <>
            <p>
                <Link
                    className="arrow-link"
                    href="/impressionen/einreichen"
                >
                    Zurück zur neuen Sammlung
                </Link>
            </p>

            <form onSubmit={handleSubmit} style={{ marginTop: 'var(--s4)' }}>
                <div className={styles.formStack}>
                    {error && (
                        <div className="notice notice--error" role="alert">
                            <strong>Nicht hinzugefügt</strong>
                            <span>{error}</span>
                        </div>
                    )}

                    {progress && (
                        <div className="notice" role="status" aria-live="polite">
                            <strong>Wird übertragen</strong>
                            <span>
                                Foto {progress.done + 1} von {progress.total}
                            </span>
                        </div>
                    )}

                    <div className="form-card">
                        <h2>Sammlung und Aufnahmedatum</h2>
                        <div className="form-grid">
                            <div className="field">
                                <label htmlFor="ex-group">
                                    Sammlung{' '}
                                    <span className={styles.req}>*</span>
                                </label>
                                <select
                                    className="select"
                                    id="ex-group"
                                    value={selectedGroupId}
                                    onChange={(event) =>
                                        setSelectedGroupId(event.target.value)
                                    }
                                    required
                                    aria-describedby="ex-group-hint"
                                >
                                    <option value="">Bitte wählen</option>
                                    {groups.map((group) => (
                                        <option
                                            key={group.submissionGroupId}
                                            value={group.submissionGroupId}
                                        >
                                            {group.title} ({group.totalCount}{' '}
                                            {group.totalCount === 1
                                                ? 'Foto'
                                                : 'Fotos'}
                                            )
                                        </option>
                                    ))}
                                </select>
                                <span className="hint" id="ex-group-hint">
                                    Die Liste zeigt alle Sammlungen, die
                                    derzeit im Register stehen — nicht nur
                                    eigene Einreichungen.
                                </span>
                            </div>

                            <div className="field">
                                <label htmlFor="ex-date">
                                    Aufnahmedatum (optional)
                                </label>
                                <input
                                    className="input"
                                    id="ex-date"
                                    type="date"
                                    value={collectionDateStart}
                                    onChange={(event) =>
                                        setCollectionDateStart(
                                            event.target.value,
                                        )
                                    }
                                    aria-describedby="ex-date-hint"
                                />
                                <span className="hint" id="ex-date-hint">
                                    Gilt für die neu hinzugefügten Fotos.
                                </span>
                            </div>

                            <label className="check" htmlFor="ex-range">
                                <input
                                    id="ex-range"
                                    type="checkbox"
                                    checked={hasDateRange}
                                    onChange={(event) => {
                                        const checked = event.target.checked;
                                        setHasDateRange(checked);
                                        if (!checked) setCollectionDateEnd('');
                                    }}
                                />
                                <span>
                                    Zeitraum statt eines einzelnen Tages
                                    <span className={styles.hintBlock}>
                                        Für Fotos, die an mehreren Tagen
                                        aufgenommen wurden.
                                    </span>
                                </span>
                            </label>

                            {hasDateRange && (
                                <div className="field">
                                    <label htmlFor="ex-date-end">
                                        Enddatum{' '}
                                        <span className={styles.req}>*</span>
                                    </label>
                                    <input
                                        className="input"
                                        id="ex-date-end"
                                        type="date"
                                        value={collectionDateEnd}
                                        onChange={(event) =>
                                            setCollectionDateEnd(
                                                event.target.value,
                                            )
                                        }
                                        min={collectionDateStart || undefined}
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="form-card">
                        <h2>Neue Fotos</h2>
                        <div>
                            <span className="field-label">
                                Neue Fotos hinzufügen{' '}
                                <span className={styles.req}>*</span>
                            </span>
                            <label
                                className={`dropzone ${styles.dz}`}
                                htmlFor="ex-photos"
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
                                    JPG, PNG oder WebP · höchstens 10 MB je Foto
                                    · mehrere Dateien möglich
                                </span>
                                <span className={styles.dropLink}>
                                    Dateien auswählen
                                </span>
                                <input
                                    className="visually-hidden"
                                    id="ex-photos"
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
                                            <span
                                                className={styles.fileName}
                                            >
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
                                                    htmlFor={`ex-desc-${index}`}
                                                >
                                                    Beschreibung (optional)
                                                </label>
                                                <textarea
                                                    className={`textarea ${styles.desc}`}
                                                    id={`ex-desc-${index}`}
                                                    rows={2}
                                                    value={photo.description}
                                                    onChange={(event) =>
                                                        setPhotos((current) =>
                                                            current.map(
                                                                (item, i) =>
                                                                    i === index
                                                                        ? {
                                                                              ...item,
                                                                              description:
                                                                                  event
                                                                                      .target
                                                                                      .value,
                                                                          }
                                                                        : item,
                                                            ),
                                                        )
                                                    }
                                                />
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            className={`btn btn--quiet btn--sm ${styles.fileRemove}`}
                                            onClick={() =>
                                                setPhotos((current) =>
                                                    current.filter(
                                                        (_, i) =>
                                                            i !== index,
                                                    ),
                                                )
                                            }
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
                                disabled={!canSubmit}
                                aria-busy={submitting}
                            >
                                {submitting
                                    ? 'Wird hinzugefügt …'
                                    : photos.length === 1
                                      ? 'Foto hinzufügen'
                                      : `${photos.length} Fotos hinzufügen`}
                            </button>
                            <Link className="btn" href="/impressionen">
                                Abbrechen
                            </Link>
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
}
