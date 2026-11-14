'use client';

import { useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { isMinioUrl } from '@/lib/utils/blob-utils-client';
import { dateLong, dateShort, plural } from '@/app/lib/register-format';
import ImageLightbox from './ImageLightbox';
import AddPhotosModal from './AddPhotosModal';
import { useDialog } from '@/app/impressionen/dialog';
import styles from '@/app/impressionen/impressionen.module.css';

export interface GalleryImage {
    id: string;
    imageUrl: string;
    description?: string;
    dateTaken?: Date;
    location?: string;
}

export interface GalleryGroup {
    submissionGroupId: string;
    title: string;
    description?: string;
    submitterNames: string[];
    images: GalleryImage[];
    submittedAt: Date;
    totalCount: number;
}

interface GalleryGridProps {
    groups: GalleryGroup[];
}

function AuthorsDialog({
    group,
    onClose,
}: {
    group: GalleryGroup;
    onClose: () => void;
}) {
    const panelRef = useRef<HTMLDivElement>(null);
    useDialog(panelRef, onClose);

    return (
        <div className={styles.dialog}>
            <div
                ref={panelRef}
                className={styles.dialogPanel}
                role="dialog"
                aria-modal="true"
                aria-labelledby="authors-title"
            >
                <div className={styles.dialogHead}>
                    <div>
                        <h2 id="authors-title">Eingereicht von</h2>
                        <p className={styles.dialogSub}>{group.title}</p>
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
                <ul className={styles.nameList}>
                    {group.submitterNames.filter(Boolean).map((name) => (
                        <li key={name}>{name}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default function GalleryGrid({ groups }: GalleryGridProps) {
    const [viewer, setViewer] = useState<{ groupId: string; index: number } | null>(
        null,
    );
    const [addPhotosGroup, setAddPhotosGroup] =
        useState<GalleryGroup | null>(null);
    const [authorsGroupId, setAuthorsGroupId] = useState<string | null>(null);

    const authorsGroup = useMemo(
        () => groups.find((group) => group.submissionGroupId === authorsGroupId),
        [authorsGroupId, groups],
    );

    const viewerGroup = viewer
        ? groups.find((group) => group.submissionGroupId === viewer.groupId)
        : undefined;

    return (
        <>
            {groups.map((group) => {
                const names = group.submitterNames.filter(Boolean);
                const extraNames = names.length > 1 ? names.length - 1 : 0;
                const groupKey = group.submissionGroupId;
                const headingId = `gruppe-${groupKey}`;

                return (
                    <section
                        key={groupKey}
                        className="gallery-group"
                        aria-labelledby={headingId}
                    >
                        <div className="gallery-group-head">
                            <div>
                                <h2 id={headingId}>{group.title}</h2>
                                <p className={`gallery-meta ${styles.metaRow}`}>
                                    <span className={styles.metaItem}>
                                        {group.totalCount}{' '}
                                        {plural(
                                            group.totalCount,
                                            'Foto',
                                            'Fotos',
                                        )}
                                    </span>
                                    {names.length > 0 && (
                                        <span className={styles.metaItem}>
                                            {names[0]}
                                            {extraNames > 0 && (
                                                <>
                                                    {' · '}
                                                    <button
                                                        type="button"
                                                        className={
                                                            styles.moreNames
                                                        }
                                                        onClick={() =>
                                                            setAuthorsGroupId(
                                                                groupKey,
                                                            )
                                                        }
                                                    >
                                                        +{extraNames} mehr
                                                    </button>
                                                </>
                                            )}
                                        </span>
                                    )}
                                    <span className={styles.metaItem}>
                                        {dateLong(new Date(group.submittedAt))}
                                    </span>
                                </p>
                            </div>
                            <button
                                type="button"
                                className="btn btn--sm"
                                onClick={() => setAddPhotosGroup(group)}
                            >
                                Ergänzen
                            </button>
                        </div>

                        <ul className={styles.plates}>
                            {group.images.map((photo, index) => {
                                const description = photo.description?.trim();
                                return (
                                    <li key={photo.id}>
                                        <button
                                            type="button"
                                            className={styles.plate}
                                            onClick={() =>
                                                setViewer({
                                                    groupId: groupKey,
                                                    index,
                                                })
                                            }
                                            aria-label={`${
                                                description || group.title
                                            } — Foto ${index + 1} von ${
                                                group.images.length
                                            } in der Bildansicht öffnen`}
                                        >
                                            <span className={styles.plateImage}>
                                                <Image
                                                    src={photo.imageUrl}
                                                    alt=""
                                                    fill
                                                    sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 210px"
                                                    unoptimized={isMinioUrl(
                                                        photo.imageUrl,
                                                    )}
                                                />
                                            </span>
                                            <span
                                                className={styles.plateCaption}
                                            >
                                                <span className={styles.plateDate}>
                                                    {dateShort(
                                                        new Date(
                                                            photo.dateTaken ??
                                                                group.submittedAt,
                                                        ),
                                                    )}
                                                </span>
                                                {description && (
                                                    <span
                                                        className={
                                                            styles.plateText
                                                        }
                                                    >
                                                        {description}
                                                    </span>
                                                )}
                                            </span>
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    </section>
                );
            })}

            {viewer && viewerGroup && viewerGroup.images[viewer.index] && (
                <ImageLightbox
                    images={viewerGroup.images}
                    index={viewer.index}
                    title={viewerGroup.title}
                    submitterName={viewerGroup.submitterNames[0]}
                    submittedAt={new Date(viewerGroup.submittedAt)}
                    onIndexChange={(index) =>
                        setViewer((current) =>
                            current ? { ...current, index } : current,
                        )
                    }
                    onClose={() => setViewer(null)}
                />
            )}

            {addPhotosGroup && (
                <AddPhotosModal
                    group={addPhotosGroup}
                    onClose={() => setAddPhotosGroup(null)}
                    onSuccess={() => {
                        setAddPhotosGroup(null);
                        window.location.reload();
                    }}
                />
            )}

            {authorsGroup && (
                <AuthorsDialog
                    group={authorsGroup}
                    onClose={() => setAuthorsGroupId(null)}
                />
            )}
        </>
    );
}
