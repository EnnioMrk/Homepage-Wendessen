'use client';

import {
    useState,
    type ChangeEvent,
    type DragEvent,
    type FormEvent,
} from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import exifr from 'exifr';
import styles from '../impressionen.module.css';
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

export default function SharedGallerySubmissionForm() {
    const router = useRouter();
    const [commonData, setCommonData] = useState({
        generalTitle: '',
        submitterName: '',
        submitterEmail: '',
    });
    const [photos, setPhotos] = useState<PhotoData[]>([]);
    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState<{ done: number; total: number } | null>(
        null,
    );
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [hasConsent, setHasConsent] = useState(false);
    const [socialConsent, setSocialConsent] = useState(false);
    const [collectionDateStart, setCollectionDateStart] = useState('');
    const [collectionDateEnd, setCollectionDateEnd] = useState('');
    const [hasDateRange, setHasDateRange] = useState(false);
    const [dragging, setDragging] = useState(false);

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

        if (!commonData.generalTitle.trim()) {
            setError('Bitte geben Sie einen Titel ein.');
            return;
        }

        if (photos.length === 0) {
            setError('Bitte wählen Sie mindestens ein Foto aus.');
            return;
        }

        if (!hasConsent) {
            setError('Bitte stimmen Sie den Bedingungen zu, um fortzufahren.');
            return;
        }

        if (!commonData.submitterName.trim()) {
            setError('Bitte geben Sie Ihren Namen an.');
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

        setLoading(true);
        setError(null);

        try {
            const groupId = `sub_${Date.now()}_${Math.random()
                .toString(36)
                .slice(2, 11)}`;

            for (const [index, photo] of photos.entries()) {
                setProgress({ done: index, total: photos.length });

                const response = await fetch('/api/shared-gallery/submit', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        submissionGroupId: groupId,
                        title: commonData.generalTitle.trim(),
                        description: photo.description.trim() || undefined,
                        submitterName:
                            commonData.submitterName.trim() || undefined,
                        submitterEmail:
                            commonData.submitterEmail.trim() || undefined,
                        imageData: photo.preview,
                        imageMimeType: photo.file.type,
                        imageFilename: photo.file.name,
                        dateTaken: collectionDateTaken?.toISOString(),
                        dateTakenRangeEnd:
                            hasDateRange && collectionDateRangeEnd
                                ? collectionDateRangeEnd.toISOString()
                                : undefined,
                        location: photo.location,
                        socialConsent: socialConsent,
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
                    setLoading(false);
                    return;
                }
            }

            setProgress(null);
            setSuccess(true);
            setPhotos([]);
            setCommonData({
                generalTitle: '',
                submitterName: '',
                submitterEmail: '',
            });
            setHasConsent(false);
            setSocialConsent(false);
            setCollectionDateStart('');
            setCollectionDateEnd('');
            setHasDateRange(false);
        } catch (submitError) {
            console.error('Submission error:', submitError);
            setProgress(null);
            setError('Fehler beim Einreichen der Fotos.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="form-card">
                <h2>Einreichung eingegangen</h2>
                <div className="notice notice--ok" role="status">
                    <strong>Vielen Dank</strong>
                    <span>
                        Ihre Fotos wurden eingereicht und werden geprüft. Nach
                        der Freigabe erscheinen sie in der Galerie unter
                        Impressionen.
                    </span>
                </div>
                <div className="form-actions">
                    <button
                        type="button"
                        className="btn btn--primary"
                        onClick={() => setSuccess(false)}
                    >
                        Weitere Fotos einreichen
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

    const canSubmit =
        !loading &&
        photos.length > 0 &&
        Boolean(commonData.generalTitle.trim()) &&
        hasConsent &&
        Boolean(commonData.submitterName.trim());

    return (
        <form onSubmit={handleSubmit}>
            <div className={`${styles.formStack}`}>
                {error && (
                    <div className="notice notice--error" role="alert">
                        <strong>Nicht eingereicht</strong>
                        <span>{error}</span>
                    </div>
                )}

                {progress && (
                    <div className="notice" role="status" aria-live="polite">
                        <strong>Wird eingereicht</strong>
                        <span>
                            Foto {progress.done + 1} von {progress.total}
                        </span>
                    </div>
                )}

                <div className="form-card">
                    <h2>Titel und Aufnahmedatum</h2>
                    <div className="form-grid">
                        <div className="field">
                            <label htmlFor="sg-title">
                                Titel der Sammlung{' '}
                                <span className={styles.req}>*</span>
                            </label>
                            <input
                                className="input"
                                id="sg-title"
                                type="text"
                                value={commonData.generalTitle}
                                onChange={(event) =>
                                    setCommonData({
                                        ...commonData,
                                        generalTitle: event.target.value,
                                    })
                                }
                                placeholder="Zum Beispiel: Dorffest, Winterlandschaft"
                                maxLength={255}
                                required
                                aria-describedby="sg-title-hint"
                            />
                            <span className="hint" id="sg-title-hint">
                                Der Titel gilt für alle Fotos dieser
                                Einreichung. Höchstens 255 Zeichen.
                            </span>
                        </div>

                        <div className="field">
                            <label htmlFor="sg-date">
                                Aufnahmedatum der Sammlung (optional)
                            </label>
                            <input
                                className="input"
                                id="sg-date"
                                type="date"
                                value={collectionDateStart}
                                onChange={(event) =>
                                    setCollectionDateStart(event.target.value)
                                }
                                aria-describedby="sg-date-hint"
                            />
                            <span className="hint" id="sg-date-hint">
                                Wird jedem Foto dieser Einreichung als
                                Aufnahmedatum mitgegeben.
                            </span>
                        </div>

                        <label className="check" htmlFor="sg-range">
                            <input
                                id="sg-range"
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
                                    Für Fotos, die an mehreren Tagen aufgenommen
                                    wurden.
                                </span>
                            </span>
                        </label>

                        {hasDateRange && (
                            <div className="field">
                                <label htmlFor="sg-date-end">
                                    Enddatum{' '}
                                    <span className={styles.req}>*</span>
                                </label>
                                <input
                                    className="input"
                                    id="sg-date-end"
                                    type="date"
                                    value={collectionDateEnd}
                                    onChange={(event) =>
                                        setCollectionDateEnd(event.target.value)
                                    }
                                    min={collectionDateStart || undefined}
                                />
                            </div>
                        )}
                    </div>
                </div>

                <div className="form-card">
                    <h2>Fotos</h2>
                    <div>
                        <span className="field-label">
                            Fotos auswählen{' '}
                            <span className={styles.req}>*</span>
                        </span>
                        <label
                            className={`dropzone ${styles.dz}`}
                            htmlFor="sg-photos"
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
                                id="sg-photos"
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
                                                htmlFor={`sg-desc-${index}`}
                                            >
                                                Beschreibung (optional)
                                            </label>
                                            <textarea
                                                className={`textarea ${styles.desc}`}
                                                id={`sg-desc-${index}`}
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
                                                    (_, i) => i !== index,
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
                </div>

                <div className="form-card">
                    <h2>Ihre Angaben und Einwilligung</h2>
                    <div className="form-grid">
                        <div className="form-row">
                            <div className="field">
                                <label htmlFor="sg-name">
                                    Ihr Name{' '}
                                    <span className={styles.req}>*</span>
                                </label>
                                <input
                                    className="input"
                                    id="sg-name"
                                    type="text"
                                    value={commonData.submitterName}
                                    onChange={(event) =>
                                        setCommonData({
                                            ...commonData,
                                            submitterName: event.target.value,
                                        })
                                    }
                                    maxLength={255}
                                    autoComplete="name"
                                    required
                                    aria-describedby="sg-name-hint"
                                />
                                <span className="hint" id="sg-name-hint">
                                    Wird in der Galerie bei den Fotos genannt,
                                    wenn sie freigegeben werden.
                                </span>
                            </div>
                            <div className="field">
                                <label htmlFor="sg-email">
                                    E-Mail-Adresse (optional)
                                </label>
                                <input
                                    className="input"
                                    id="sg-email"
                                    type="email"
                                    value={commonData.submitterEmail}
                                    onChange={(event) =>
                                        setCommonData({
                                            ...commonData,
                                            submitterEmail: event.target.value,
                                        })
                                    }
                                    maxLength={255}
                                    autoComplete="email"
                                    aria-describedby="sg-email-hint"
                                />
                                <span className="hint" id="sg-email-hint">
                                    Wird nicht öffentlich angezeigt, nur für
                                    Rückfragen.
                                </span>
                            </div>
                        </div>

                        <label className="check" htmlFor="sg-consent">
                            <input
                                id="sg-consent"
                                type="checkbox"
                                checked={hasConsent}
                                onChange={(event) =>
                                    setHasConsent(event.target.checked)
                                }
                                required
                            />
                            <span>
                                <strong>
                                    Einwilligung zur Veröffentlichung{' '}
                                    <span className={styles.req}>*</span>
                                </strong>
                                <span className={styles.hintBlock}>
                                    Ich habe die{' '}
                                    <Link
                                        className="link"
                                        href="/datenschutz"
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        rechtlichen Hinweise
                                    </Link>{' '}
                                    gelesen und bestätige, dass ich alle Rechte
                                    an den Bildern besitze und die Zustimmung
                                    aller abgebildeten Personen für die
                                    Veröffentlichung auf dieser Webseite habe.
                                </span>
                            </span>
                        </label>

                        <label className="check" htmlFor="sg-social">
                            <input
                                id="sg-social"
                                type="checkbox"
                                checked={socialConsent}
                                onChange={(event) =>
                                    setSocialConsent(event.target.checked)
                                }
                            />
                            <span>
                                <strong>
                                    Freiwillige Einwilligung für Social Media
                                </strong>
                                <span className={styles.hintBlock}>
                                    Ich bin damit einverstanden, dass die Bilder
                                    zusätzlich auf den offiziellen
                                    Social-Media-Kanälen des Dorfes geteilt
                                    werden dürfen. Mir sind die{' '}
                                    <Link
                                        className="link"
                                        href="/datenschutz#social-risks"
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        besonderen Risiken
                                    </Link>{' '}
                                    bewusst.
                                </span>
                            </span>
                        </label>
                    </div>

                    <div className="form-actions">
                        <button
                            type="submit"
                            className="btn btn--primary"
                            disabled={!canSubmit}
                            aria-busy={loading}
                        >
                            {loading
                                ? 'Wird eingereicht …'
                                : photos.length === 1
                                  ? 'Foto einreichen'
                                  : `${photos.length} Fotos einreichen`}
                        </button>
                        <Link className="btn" href="/impressionen">
                            Abbrechen
                        </Link>
                        <span className="small muted">
                            Pflichtfelder sind mit * gekennzeichnet.
                        </span>
                    </div>
                </div>
            </div>
        </form>
    );
}
