'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import Image from 'next/image';
import { usePermissions } from '@/lib/usePermissions';
import { AdminHead, Panel } from '@/app/components/admin/AdminPage';
import { dateShort } from '@/app/lib/register-format';
import styles from './gallery.module.css';

interface GalleryImage {
    id: string;
    filename: string;
    originalName: string;
    displayName: string;
    url: string;
    size: number;
    mimeType: string;
    uploadedAt: string;
}

const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const absoluteUrl = (url: string) => {
    if (typeof window === 'undefined') return url;
    try {
        return new URL(url, window.location.origin).toString();
    } catch {
        return url;
    }
};

function useOverlay(open: boolean, onClose: () => void) {
    const ref = useRef<HTMLDivElement>(null);
    const closeRef = useRef(onClose);

    useEffect(() => {
        closeRef.current = onClose;
    }, [onClose]);

    useEffect(() => {
        if (!open) return;
        const element = ref.current;
        if (!element) return;

        const previouslyFocused = document.activeElement as HTMLElement | null;
        const focusable = () =>
            Array.from(
                element.querySelectorAll<HTMLElement>(
                    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
                ),
            ).filter((node) => node.offsetParent !== null);

        focusable()[0]?.focus();

        const handleKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                event.stopPropagation();
                closeRef.current();
                return;
            }
            if (event.key !== 'Tab') return;
            const items = focusable();
            if (items.length === 0) return;
            const first = items[0];
            const last = items[items.length - 1];
            if (event.shiftKey && document.activeElement === first) {
                event.preventDefault();
                last.focus();
            } else if (!event.shiftKey && document.activeElement === last) {
                event.preventDefault();
                first.focus();
            }
        };

        document.addEventListener('keydown', handleKey);
        return () => {
            document.removeEventListener('keydown', handleKey);
            previouslyFocused?.focus();
        };
    }, [open]);

    return ref;
}

export default function AdminGallery() {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { hasPermission } = usePermissions();

    const canUpload = hasPermission('gallery.upload');
    const canEdit = hasPermission('gallery.edit');
    const canDelete = hasPermission('gallery.delete');

    const [images, setImages] = useState<GalleryImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState<string>('date');
    const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(
        null,
    );
    const [isRenaming, setIsRenaming] = useState(false);
    const [isRenamingLoading, setIsRenamingLoading] = useState(false);
    const [newName, setNewName] = useState('');
    const [uploadName, setUploadName] = useState('');
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [flash, setFlash] = useState<string | null>(null);
    const [imageToDelete, setImageToDelete] = useState<GalleryImage | null>(
        null,
    );
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        fetchImages();
    }, []);

    useEffect(() => {
        if (!flash) return;
        const timer = window.setTimeout(() => setFlash(null), 4000);
        return () => window.clearTimeout(timer);
    }, [flash]);

    const fetchImages = async (showLoading = false) => {
        if (showLoading) setLoading(true);
        try {
            const response = await fetch('/api/admin/gallery');
            if (response.ok) {
                const data = await response.json();
                setImages(data.images || []);
                setError(null);
            } else {
                setError('Fehler beim Laden der Bilder');
            }
        } catch (fetchError) {
            console.error('Error fetching images:', fetchError);
            setError('Fehler beim Laden der Bilder');
        } finally {
            setLoading(false);
        }
    };

    const resetUpload = () => {
        setShowUploadModal(false);
        setSelectedFiles([]);
        setUploadName('');
    };

    const handleFileSelect = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const files = Array.from(event.target.files || []);
        event.target.value = '';
        if (files.length === 0) return;

        for (const file of files) {
            if (!file.type.startsWith('image/')) {
                setError('Bitte wählen Sie nur Bilddateien aus');
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                setError(
                    `Die Datei "${file.name}" ist zu groß. Maximum: 5 MB`,
                );
                return;
            }
        }

        setSelectedFiles(files);
        if (files.length === 1) {
            setUploadName(files[0].name.replace(/\.[^/.]+$/, ''));
        } else {
            setUploadName('');
        }
        setError(null);
        setShowUploadModal(true);
    };

    const handleUpload = async () => {
        if (selectedFiles.length === 0) {
            setError('Bitte wählen Sie mindestens eine Datei aus');
            return;
        }

        if (selectedFiles.length === 1 && !uploadName.trim()) {
            setError('Bitte geben Sie einen Namen für das Bild ein');
            return;
        }

        setUploading(true);
        setError(null);

        try {
            const uploadedImages: GalleryImage[] = [];

            for (let i = 0; i < selectedFiles.length; i++) {
                const file = selectedFiles[i];
                const formData = new FormData();
                formData.append('file', file);

                const displayName =
                    selectedFiles.length === 1
                        ? uploadName.trim()
                        : file.name.replace(/\.[^/.]+$/, '');

                formData.append('displayName', displayName);

                const response = await fetch('/api/admin/gallery', {
                    method: 'POST',
                    body: formData,
                });

                if (response.ok) {
                    const data = await response.json();
                    uploadedImages.push(data.image);
                } else {
                    const errorData = await response.json().catch(() => null);
                    setError(
                        errorData?.error ||
                            `Fehler beim Hochladen von ${file.name}`,
                    );
                    setUploading(false);
                    return;
                }
            }

            setImages((prev) => [...uploadedImages, ...prev]);
            resetUpload();
            setFlash(
                uploadedImages.length === 1
                    ? 'Bild hochgeladen.'
                    : `${uploadedImages.length} Bilder hochgeladen.`,
            );
        } catch (uploadError) {
            console.error('Upload error:', uploadError);
            setError('Fehler beim Hochladen der Bilder');
        } finally {
            setUploading(false);
        }
    };

    const handleRename = async (imageId: string, newDisplayName: string) => {
        if (!newDisplayName.trim()) {
            setError('Der Name darf nicht leer sein');
            return;
        }

        setIsRenamingLoading(true);
        try {
            const response = await fetch(`/api/admin/gallery/${imageId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ displayName: newDisplayName.trim() }),
            });

            if (response.ok) {
                const data = await response.json();
                setImages((prev) =>
                    prev.map((img) => (img.id === imageId ? data.image : img)),
                );
                setIsRenaming(false);
                setSelectedImage(null);
                setFlash('Bild umbenannt.');
            } else {
                const errorData = await response.json().catch(() => null);
                setError(errorData?.error || 'Fehler beim Umbenennen');
            }
        } catch (renameError) {
            console.error('Rename error:', renameError);
            setError('Fehler beim Umbenennen des Bildes');
        } finally {
            setIsRenamingLoading(false);
        }
    };

    const handleDelete = async (imageId: string) => {
        setIsDeleting(true);
        try {
            const response = await fetch(`/api/admin/gallery/${imageId}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setImages((prev) => prev.filter((img) => img.id !== imageId));
                setSelectedImage(null);
                setImageToDelete(null);
                setFlash('Bild gelöscht.');
            } else {
                const errorData = await response.json().catch(() => null);
                setError(errorData?.error || 'Fehler beim Löschen');
            }
        } catch (deleteError) {
            console.error('Delete error:', deleteError);
            setError('Fehler beim Löschen des Bildes');
        } finally {
            setIsDeleting(false);
        }
    };

    const copyLink = async (image: GalleryImage) => {
        const text = absoluteUrl(image.url);
        try {
            if (navigator.clipboard?.writeText) {
                await navigator.clipboard.writeText(text);
                setFlash('Bildlink kopiert.');
                return;
            }
            throw new Error('clipboard unavailable');
        } catch {
            try {
                const area = document.createElement('textarea');
                area.value = text;
                area.setAttribute('readonly', '');
                area.style.position = 'fixed';
                area.style.opacity = '0';
                document.body.appendChild(area);
                area.select();
                document.execCommand('copy');
                document.body.removeChild(area);
                setFlash('Bildlink kopiert.');
            } catch {
                setError(
                    'Der Link konnte nicht kopiert werden. Öffnen Sie das Bild und kopieren Sie die Adresse aus der Vorschau.',
                );
            }
        }
    };

    const sortedAndFilteredImages = images
        .filter((image) => {
            const matchesSearch =
                image.displayName
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                image.originalName
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase());
            return matchesSearch;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case 'name':
                    return a.displayName
                        .toLowerCase()
                        .localeCompare(b.displayName.toLowerCase());
                case 'date':
                    return (
                        new Date(b.uploadedAt).getTime() -
                        new Date(a.uploadedAt).getTime()
                    );
                case 'updated':
                    return (
                        new Date(b.uploadedAt).getTime() -
                        new Date(a.uploadedAt).getTime()
                    );
                default:
                    return 0;
            }
        });

    const previewUrls = useMemo(
        () => selectedFiles.map((file) => URL.createObjectURL(file)),
        [selectedFiles],
    );

    const previewRef = useOverlay(selectedImage !== null && !isRenaming, () =>
        setSelectedImage(null),
    );
    const renameRef = useOverlay(selectedImage !== null && isRenaming, () => {
        setIsRenaming(false);
        setSelectedImage(null);
    });
    const uploadRef = useOverlay(showUploadModal, resetUpload);
    const deleteRef = useOverlay(imageToDelete !== null, () =>
        setImageToDelete(null),
    );

    return (
        <div>
            <AdminHead
                title="Bilder"
                sub={
                    loading
                        ? 'Galerie der Redaktion'
                        : `${images.length} ${
                              images.length === 1 ? 'Bild' : 'Bilder'
                          } in der Galerie`
                }
                actions={
                    canUpload ? (
                        <button
                            type="button"
                            className="btn btn--primary"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            Bilder hochladen
                        </button>
                    ) : null
                }
            />

            {flash && (
                <div className="notice notice--ok" role="status">
                    <strong>Gespeichert</strong>
                    <span>{flash}</span>
                </div>
            )}

            {error && (
                <div className="notice notice--error" role="alert">
                    <strong>Nicht abgeschlossen</strong>
                    <span>{error}</span>
                    <div
                        style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 'var(--s2)',
                            marginTop: 'var(--s2)',
                        }}
                    >
                        <button
                            type="button"
                            className="btn btn--sm btn--quiet"
                            onClick={() => fetchImages(true)}
                        >
                            Erneut laden
                        </button>
                        <button
                            type="button"
                            className="btn btn--sm btn--quiet"
                            onClick={() => setError(null)}
                        >
                            Hinweis schließen
                        </button>
                    </div>
                </div>
            )}

            {canUpload && (
                <div className={styles.uploadPanel}>
                    <Panel title="Hochladen">
                        <div className={styles.uploadRow}>
                            <div className="field">
                                <span className="field-label">
                                    Bilddateien
                                </span>
                                <div className={styles.uploadControl}>
                                    <label
                                        className="btn btn--quiet"
                                        htmlFor="gallery-file-input"
                                    >
                                        Dateien wählen
                                    </label>
                                    <input
                                        ref={fileInputRef}
                                        id="gallery-file-input"
                                        className="visually-hidden"
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleFileSelect}
                                    />
                                    <span className="hint">
                                        Mehrfachauswahl möglich. JPG, PNG oder
                                        WebP, maximal 5 MB je Datei. Beim
                                        Hochladen wird in WebP umgewandelt.
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Panel>
                </div>
            )}

            <div className="filterbar">
                <div className="field grow">
                    <label htmlFor="gallery-search">Suche</label>
                    <input
                        id="gallery-search"
                        className="input"
                        type="search"
                        value={searchTerm}
                        onChange={(event) =>
                            setSearchTerm(event.target.value)
                        }
                        placeholder="Name oder Originaldatei …"
                    />
                </div>
                <div className="field">
                    <label htmlFor="gallery-sort">Sortierung</label>
                    <select
                        id="gallery-sort"
                        className="select"
                        value={sortBy}
                        onChange={(event) => setSortBy(event.target.value)}
                    >
                        <option value="date">Nach Datum</option>
                        <option value="name">Nach Name</option>
                        <option value="updated">Nach Aktualisierung</option>
                    </select>
                </div>
                <p className="count">
                    {sortedAndFilteredImages.length} von {images.length} Bildern
                </p>
            </div>

            {loading ? (
                <div className="panel">
                    <div className="panel-body">
                        <p className="muted">Lade Bilder …</p>
                    </div>
                </div>
            ) : sortedAndFilteredImages.length === 0 ? (
                <div className="empty">
                    <h3>
                        {images.length === 0
                            ? 'Noch kein Bild in der Galerie'
                            : 'Kein Bild gefunden'}
                    </h3>
                    <p>
                        {images.length === 0
                            ? 'Die Galerie ist leer. Geladene Bilder stehen anschließend in Terminen, Nachrichten und auf Dorfseiten zur Auswahl.'
                            : 'Die Suche ergab keinen Treffer. Setzen Sie den Suchbegriff zurück oder wählen Sie eine andere Sortierung.'}
                    </p>
                    {images.length === 0 && canUpload && (
                        <button
                            type="button"
                            className="btn btn--primary"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            Erstes Bild hochladen
                        </button>
                    )}
                </div>
            ) : (
                <div className="plates">
                    {sortedAndFilteredImages.map((image) => (
                        <figure key={image.id} className={styles.cell}>
                            <button
                                type="button"
                                className={styles.thumb}
                                onClick={() => setSelectedImage(image)}
                            >
                                <Image
                                    src={image.url}
                                    alt={image.displayName}
                                    fill
                                    sizes="(max-width: 640px) 45vw, (max-width: 1024px) 25vw, 200px"
                                />
                            </button>
                            <figcaption className={styles.caption}>
                                <span className={styles.captionName}>
                                    {image.displayName}
                                </span>
                                <span className={styles.captionMeta}>
                                    <span>{formatFileSize(image.size)}</span>
                                    <span>
                                        {dateShort(new Date(image.uploadedAt))}
                                    </span>
                                </span>
                            </figcaption>
                            <div className={styles.cellActions}>
                                <button
                                    type="button"
                                    className="btn btn--sm btn--quiet"
                                    onClick={() => setSelectedImage(image)}
                                >
                                    Ansehen
                                </button>
                                {canDelete ? (
                                    <button
                                        type="button"
                                        className="btn btn--sm btn--danger"
                                        onClick={() =>
                                            setImageToDelete(image)
                                        }
                                    >
                                        Löschen
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        className="btn btn--sm btn--quiet"
                                        onClick={() => copyLink(image)}
                                    >
                                        Link
                                    </button>
                                )}
                            </div>
                        </figure>
                    ))}
                </div>
            )}

            {selectedImage && !isRenaming && (
                <div
                    className={styles.overlay}
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget)
                            setSelectedImage(null);
                    }}
                >
                    <div
                        ref={previewRef}
                        className={`dialog ${styles.dialogWide}`}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="gallery-preview-title"
                    >
                        <div className="dialog-head">
                            <div>
                                <p className="small muted">Bild</p>
                                <h2 id="gallery-preview-title">
                                    {selectedImage.displayName}
                                </h2>
                            </div>
                            <button
                                type="button"
                                className="dialog-close"
                                onClick={() => setSelectedImage(null)}
                                aria-label="Vorschau schließen"
                            >
                                ×
                            </button>
                        </div>
                        <div className="dialog-body">
                            <div className={styles.previewFrame}>
                                <Image
                                    src={selectedImage.url}
                                    alt={selectedImage.displayName}
                                    fill
                                    sizes="(max-width: 900px) 92vw, 820px"
                                />
                            </div>
                            <dl className="kv">
                                <dt>Originalname</dt>
                                <dd>{selectedImage.originalName}</dd>
                                <dt>Dateigröße</dt>
                                <dd>{formatFileSize(selectedImage.size)}</dd>
                                <dt>Typ</dt>
                                <dd>{selectedImage.mimeType}</dd>
                                <dt>Hochgeladen</dt>
                                <dd>
                                    {dateShort(
                                        new Date(selectedImage.uploadedAt),
                                    )}
                                </dd>
                            </dl>
                        </div>
                        <div className={`dialog-foot ${styles.footSticky}`}>
                            {canDelete && (
                                <button
                                    type="button"
                                    className="btn btn--danger"
                                    onClick={() => {
                                        const target = selectedImage;
                                        setSelectedImage(null);
                                        setImageToDelete(target);
                                    }}
                                >
                                    Löschen
                                </button>
                            )}
                            {canEdit && (
                                <button
                                    type="button"
                                    className="btn btn--quiet"
                                    onClick={() => {
                                        setNewName(selectedImage.displayName);
                                        setIsRenaming(true);
                                    }}
                                >
                                    Umbenennen
                                </button>
                            )}
                            <button
                                type="button"
                                className="btn btn--quiet"
                                onClick={() => copyLink(selectedImage)}
                            >
                                Link kopieren
                            </button>
                            <a
                                className="btn btn--quiet"
                                href={selectedImage.url}
                                download={selectedImage.displayName}
                            >
                                Herunterladen
                            </a>
                            <button
                                type="button"
                                className="btn btn--quiet"
                                onClick={() => setSelectedImage(null)}
                            >
                                Schließen
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {selectedImage && isRenaming && (
                <div
                    className={styles.overlay}
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) {
                            setIsRenaming(false);
                            setSelectedImage(null);
                        }
                    }}
                >
                    <div
                        ref={renameRef}
                        className="dialog"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="gallery-rename-title"
                    >
                        <div className="dialog-head">
                            <h2 id="gallery-rename-title">Bild umbenennen</h2>
                            <button
                                type="button"
                                className="dialog-close"
                                onClick={() => {
                                    setIsRenaming(false);
                                    setSelectedImage(null);
                                }}
                                aria-label="Dialog schließen"
                            >
                                ×
                            </button>
                        </div>
                        <div className="dialog-body">
                            <div className="field">
                                <label htmlFor="gallery-new-name">
                                    Neuer Name
                                </label>
                                <input
                                    id="gallery-new-name"
                                    className="input"
                                    type="text"
                                    value={newName}
                                    onChange={(event) =>
                                        setNewName(event.target.value)
                                    }
                                    autoFocus
                                />
                            </div>
                        </div>
                        <div className={`dialog-foot ${styles.footSticky}`}>
                            <button
                                type="button"
                                className="btn btn--quiet"
                                onClick={() => {
                                    setIsRenaming(false);
                                    setSelectedImage(null);
                                }}
                            >
                                Abbrechen
                            </button>
                            <button
                                type="button"
                                className="btn btn--primary"
                                onClick={() =>
                                    handleRename(selectedImage.id, newName)
                                }
                                disabled={isRenamingLoading}
                            >
                                {isRenamingLoading
                                    ? 'Speichern …'
                                    : 'Namen speichern'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showUploadModal && (
                <div
                    className={styles.overlay}
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget)
                            resetUpload();
                    }}
                >
                    <div
                        ref={uploadRef}
                        className={`dialog ${styles.dialogWide}`}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="gallery-upload-title"
                    >
                        <div className="dialog-head">
                            <h2 id="gallery-upload-title">
                                {selectedFiles.length === 1
                                    ? 'Bild hochladen'
                                    : `${selectedFiles.length} Bilder hochladen`}
                            </h2>
                            <button
                                type="button"
                                className="dialog-close"
                                onClick={resetUpload}
                                aria-label="Dialog schließen"
                            >
                                ×
                            </button>
                        </div>
                        <div className="dialog-body">
                            {error && (
                                <div
                                    className="notice notice--error"
                                    role="alert"
                                    style={{ marginBottom: 'var(--s4)' }}
                                >
                                    <strong>Nicht hochgeladen</strong>
                                    <span>{error}</span>
                                </div>
                            )}

                            {selectedFiles.length === 1 ? (
                                <div className={styles.uploadSingle}>
                                    <Image
                                        src={previewUrls[0]}
                                        alt={`Vorschau von ${selectedFiles[0].name}`}
                                        fill
                                        unoptimized
                                        sizes="820px"
                                    />
                                </div>
                            ) : (
                                <div className={styles.uploadPreviews}>
                                    {selectedFiles.map((file, index) => (
                                        <div
                                            key={`${file.name}-${index}`}
                                            className={styles.uploadPreview}
                                        >
                                            <Image
                                                src={previewUrls[index]}
                                                alt={`Vorschau von ${file.name}`}
                                                fill
                                                unoptimized
                                                sizes="160px"
                                            />
                                            <span
                                                className={
                                                    styles.uploadFileName
                                                }
                                            >
                                                {file.name}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {selectedFiles.length === 1 && (
                                <div className="field">
                                    <label htmlFor="gallery-upload-name">
                                        Bildname *
                                    </label>
                                    <input
                                        id="gallery-upload-name"
                                        className="input"
                                        type="text"
                                        value={uploadName}
                                        onChange={(event) =>
                                            setUploadName(event.target.value)
                                        }
                                        autoFocus
                                    />
                                </div>
                            )}

                            {selectedFiles.length > 1 && (
                                <div className="notice">
                                    <strong>Mehrere Dateien</strong>
                                    <span>
                                        Bei mehreren Bildern werden die
                                        ursprünglichen Dateinamen als
                                        Bildnamen verwendet.
                                    </span>
                                </div>
                            )}

                            <p className={styles.hint}>
                                {selectedFiles.length === 1
                                    ? 'Maximal 5 MB. Das Bild wird beim Hochladen in WebP umgewandelt.'
                                    : `${selectedFiles.length} Dateien, je maximal 5 MB.`}
                            </p>
                        </div>
                        <div className={`dialog-foot ${styles.footSticky}`}>
                            <button
                                type="button"
                                className="btn btn--quiet"
                                onClick={resetUpload}
                                disabled={uploading}
                            >
                                Abbrechen
                            </button>
                            <button
                                type="button"
                                className="btn btn--primary"
                                onClick={handleUpload}
                                disabled={
                                    uploading ||
                                    (selectedFiles.length === 1 &&
                                        !uploadName.trim()) ||
                                    selectedFiles.length === 0
                                }
                            >
                                {uploading
                                    ? 'Hochladen …'
                                    : selectedFiles.length === 1
                                      ? 'Hochladen'
                                      : `${selectedFiles.length} Bilder hochladen`}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {imageToDelete && (
                <div
                    className={styles.overlay}
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget)
                            setImageToDelete(null);
                    }}
                >
                    <div
                        ref={deleteRef}
                        className="dialog"
                        role="alertdialog"
                        aria-modal="true"
                        aria-labelledby="gallery-delete-title"
                    >
                        <div className="dialog-head">
                            <h2 id="gallery-delete-title">Bild löschen</h2>
                            <button
                                type="button"
                                className="dialog-close"
                                onClick={() => setImageToDelete(null)}
                                aria-label="Dialog schließen"
                            >
                                ×
                            </button>
                        </div>
                        <div className="dialog-body">
                            <div className="notice notice--warn">
                                <strong>{imageToDelete.displayName}</strong>
                                <span>
                                    Bild und Datei werden entfernt. Diese
                                    Aktion kann nicht rückgängig gemacht
                                    werden.
                                </span>
                            </div>
                        </div>
                        <div className={`dialog-foot ${styles.footSticky}`}>
                            <button
                                type="button"
                                className="btn btn--quiet"
                                onClick={() => setImageToDelete(null)}
                            >
                                Abbrechen
                            </button>
                            <button
                                type="button"
                                className="btn btn--danger"
                                onClick={() => handleDelete(imageToDelete.id)}
                                disabled={isDeleting}
                            >
                                {isDeleting
                                    ? 'Löschen …'
                                    : 'Endgültig löschen'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
