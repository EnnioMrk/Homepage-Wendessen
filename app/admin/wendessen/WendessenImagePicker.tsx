'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import s from './wendessen.module.css';

interface GalleryImage {
    id: string;
    url: string;
    displayName: string;
}

interface ImagePickerProps {
    onSelect: (image: { id: string; url: string; displayName: string }) => void;
    onClose: () => void;
    canUpload?: boolean;
}

export default function WendessenImagePicker({
    onSelect,
    onClose,
    canUpload = false,
}: ImagePickerProps) {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState('');
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        const dialog = dialogRef.current;
        if (dialog && !dialog.open) dialog.showModal();
    }, []);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch('/api/admin/gallery');
                if (!response.ok) {
                    throw new Error(`Status ${response.status}`);
                }
                const data = (await response.json()) as {
                    images?: GalleryImage[];
                };
                if (!cancelled) setImages(data.images ?? []);
            } catch (loadError) {
                console.error('Error fetching gallery images:', loadError);
                if (!cancelled) {
                    setError('Die Galerie konnte nicht geladen werden.');
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        load();
        return () => {
            cancelled = true;
        };
    }, []);

    const filtered = useMemo(() => {
        const needle = search.trim().toLowerCase();
        if (!needle) return images;
        return images.filter((image) =>
            image.displayName.toLowerCase().includes(needle)
        );
    }, [images, search]);

    async function upload(file: File) {
        if (!file.type.startsWith('image/')) {
            setError('Bitte eine Bilddatei auswählen.');
            return;
        }
        setUploading(true);
        setError(null);
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append(
                'displayName',
                file.name.replace(/\.[^/.]+$/, '')
            );
            const response = await fetch('/api/admin/gallery', {
                method: 'POST',
                body: formData,
            });
            if (!response.ok) {
                let message = 'Das Bild konnte nicht hochgeladen werden.';
                try {
                    const data = (await response.json()) as { error?: string };
                    if (data.error) message = data.error;
                } catch {
                    // Keep the German fallback.
                }
                throw new Error(message);
            }
            const data = (await response.json()) as {
                image?: GalleryImage;
            };
            if (data.image) {
                setImages((prev) => [data.image as GalleryImage, ...prev]);
                onSelect(data.image);
            }
        } catch (uploadError) {
            setError(
                uploadError instanceof Error
                    ? uploadError.message
                    : 'Das Bild konnte nicht hochgeladen werden.'
            );
        } finally {
            setUploading(false);
        }
    }

    return (
        <dialog
            ref={dialogRef}
            className="dialog"
            aria-labelledby="wendessen-image-title"
            onClose={onClose}
            onClick={(event) => {
                if (event.target === dialogRef.current) onClose();
            }}
        >
            <div className="dialog-head">
                <div>
                    <p className="tally">Galerie</p>
                    <h2 id="wendessen-image-title">Bild wählen</h2>
                </div>
                <button
                    type="button"
                    className="dialog-close"
                    onClick={onClose}
                    aria-label="Bildauswahl schließen"
                >
                    ×
                </button>
            </div>

            <div className="dialog-body">
                <div className={s.pickerBar}>
                    <div className="field">
                        <label htmlFor="picker-search">Suchen</label>
                        <input
                            id="picker-search"
                            className="input"
                            type="search"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Bildname"
                        />
                    </div>

                    {canUpload && (
                        <div className="field">
                            <label htmlFor="picker-upload">
                                Neues Bild hochladen
                            </label>
                            <input
                                id="picker-upload"
                                className="input"
                                type="file"
                                accept="image/*"
                                disabled={uploading}
                                onChange={(event) => {
                                    const file = event.target.files?.[0];
                                    if (file) upload(file);
                                    event.target.value = '';
                                }}
                            />
                        </div>
                    )}

                    {uploading && (
                        <p className="small muted" role="status">
                            Bild wird hochgeladen …
                        </p>
                    )}
                </div>

                {error && (
                    <div className="notice notice--error" role="alert">
                        <strong>Fehler</strong>
                        <span>{error}</span>
                    </div>
                )}

                {loading ? (
                    <p className="admin-empty" role="status">
                        Galerie wird geladen …
                    </p>
                ) : filtered.length === 0 ? (
                    <div className="admin-empty">
                        <h3>Keine Bilder gefunden</h3>
                        <p>
                            {search
                                ? 'Für diesen Suchbegriff liegt kein Bild vor.'
                                : 'Die Galerie enthält noch keine Bilder.'}
                        </p>
                    </div>
                ) : (
                    <div className={s.pickerGrid}>
                        {filtered.map((image) => (
                            <button
                                key={image.id}
                                type="button"
                                className={s.pickerTile}
                                onClick={() => onSelect(image)}
                            >
                                <Image
                                    src={image.url}
                                    alt=""
                                    width={320}
                                    height={320}
                                    unoptimized
                                />
                                <span className={s.pickerName}>
                                    {image.displayName}
                                </span>
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div className="dialog-foot">
                <button
                    type="button"
                    className="btn btn--quiet"
                    onClick={onClose}
                >
                    Abbrechen
                </button>
            </div>
        </dialog>
    );
}
