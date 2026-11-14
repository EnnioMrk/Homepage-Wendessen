'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { Empty } from '@/app/components/register/Layout';
import PortraitSubmissionModal from '@/app/components/PortraitSubmissionModal';
import PortraitDialog from '@/app/dorfleben/wir-wendesser/portrait-dialog';
import styles from '@/app/dorfleben/wir-wendesser/portrait.module.css';

interface ApprovedPortrait {
    id: number | string;
    name: string;
    description: string;
    imageUrl: string;
    submittedAt: string;
}

export default function WirWendesserContent() {
    const [portraits, setPortraits] = useState<ApprovedPortrait[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState(false);
    const [selected, setSelected] = useState<ApprovedPortrait | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [success, setSuccess] = useState(false);

    const loadPortraits = useCallback(async () => {
        setLoading(true);
        setLoadError(false);

        try {
            const response = await fetch('/api/portraits/approved');
            if (!response.ok) {
                throw new Error(`Status ${response.status}`);
            }

            const data: unknown = await response.json();
            if (!Array.isArray(data)) {
                throw new Error('Antwort war keine Liste');
            }

            setPortraits(data as ApprovedPortrait[]);
        } catch (cause) {
            console.error('Porträts: Liste nicht geladen', cause);
            setLoadError(true);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        void loadPortraits();
    }, [loadPortraits]);

    return (
        <div>
            <div className={styles.toolbar} style={{ marginTop: 'var(--s3)' }}>
                <p className="small muted" aria-live="polite">
                    {loading
                        ? 'Porträts werden geladen …'
                        : loadError
                          ? 'Porträts konnten nicht geladen werden'
                          : `${portraits.length} ${
                                portraits.length === 1
                                    ? 'Porträt'
                                    : 'Porträts'
                            } verzeichnet`}
                </p>
                <button
                    type="button"
                    className="btn btn--primary"
                    onClick={() => {
                        setSuccess(false);
                        setShowForm(true);
                    }}
                >
                    Portrait einreichen
                </button>
            </div>

            {success && (
                <div
                    className="notice notice--ok"
                    role="status"
                    style={{ marginTop: 'var(--s4)' }}
                >
                    <strong>Vielen Dank für Ihre Einreichung!</strong>
                    <span>
                        Wir prüfen das Portrait und melden uns bei Ihnen. Ein
                        Rechtsanspruch auf Veröffentlichung besteht nicht.
                    </span>
                </div>
            )}

            <div style={{ marginTop: 'var(--s4)' }}>
                {loading ? (
                    <div className={styles.list} aria-busy="true">
                        <div className="skeleton" style={{ height: 180 }} />
                        <div className="skeleton" style={{ height: 180 }} />
                        <p className="small muted">Porträts werden geladen …</p>
                    </div>
                ) : loadError ? (
                    <div className="notice notice--error" role="alert">
                        <strong>Porträts nicht geladen</strong>
                        <span>
                            Die Porträts konnten gerade nicht abgerufen werden.
                            Bitte versuchen Sie es noch einmal.
                        </span>
                        <div style={{ marginTop: 'var(--s2)' }}>
                            <button
                                type="button"
                                className="btn btn--sm"
                                onClick={() => {
                                    void loadPortraits();
                                }}
                            >
                                Erneut laden
                            </button>
                        </div>
                    </div>
                ) : portraits.length === 0 ? (
                    <Empty
                        title="Die ersten Portraits befinden sich in Vorbereitung."
                        action={
                            <button
                                type="button"
                                className="btn"
                                onClick={() => {
                                    setSuccess(false);
                                    setShowForm(true);
                                }}
                            >
                                Portrait einreichen
                            </button>
                        }
                    >
                        Sobald Einreichungen geprüft sind, stehen die
                        Geschichten unserer Mitbürgerinnen und Mitbürger hier.
                    </Empty>
                ) : (
                    <div className={styles.list}>
                        {portraits.map((portrait) => (
                            <article
                                key={portrait.id}
                                className="person-card person-card--plate"
                            >
                                <Image
                                    src={portrait.imageUrl}
                                    alt={`Porträt von ${portrait.name}`}
                                    width={160}
                                    height={160}
                                />
                                <div style={{ minWidth: 0 }}>
                                    <p className="person-role">Porträt</p>
                                    <h3
                                        style={{
                                            fontSize: 'var(--lead)',
                                            lineHeight: 1.25,
                                            overflowWrap: 'anywhere',
                                        }}
                                    >
                                        {portrait.name}
                                    </h3>
                                    <p className={styles.excerpt}>
                                        {portrait.description}
                                    </p>
                                    <button
                                        type="button"
                                        className={`btn btn--quiet btn--sm ${styles.cardAction}`}
                                        onClick={() =>
                                            setSelected(portrait)
                                        }
                                    >
                                        Ganze Geschichte lesen
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </div>

            <p className="small muted" style={{ marginTop: 'var(--s4)' }}>
                Hinweis zur Klarstellung: Ein Rechtsanspruch auf
                Veröffentlichung des Beitrages besteht nicht. Eingereichte
                E-Mail-Adressen werden nicht veröffentlicht.
            </p>

            <PortraitDialog
                open={selected !== null}
                onClose={() => setSelected(null)}
                title={selected?.name ?? 'Porträt'}
            >
                {selected && (
                    <div>
                        <Image
                            className={styles.dialogImage}
                            src={selected.imageUrl}
                            alt={`Porträt von ${selected.name}`}
                            width={260}
                            height={260}
                            loading="eager"
                        />
                        <div className="prose">
                            {selected.description
                                .split(/\n+/)
                                .map((paragraph) => paragraph.trim())
                                .filter(Boolean)
                                .map((paragraph, index) => (
                                    <p key={index}>{paragraph}</p>
                                ))}
                        </div>
                    </div>
                )}
            </PortraitDialog>

            <PortraitSubmissionModal
                isOpen={showForm}
                onClose={() => setShowForm(false)}
                onSuccess={() => {
                    setShowForm(false);
                    setSuccess(true);
                }}
            />
        </div>
    );
}
