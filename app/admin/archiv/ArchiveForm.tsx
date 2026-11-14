'use client';

import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import Link from 'next/link';
import type { Descendant } from 'slate';
import { AdminHead, Panel } from '@/app/components/admin/AdminPage';
import EnhancedRichTextEditor from '@/app/components/EnhancedRichTextEditor';
import ArticleRenderer from '@/app/components/news/ArticleRenderer';
import { dateLong } from '@/app/lib/register-format';
import s from './archiv.module.css';

interface ArchiveItem {
    id: number;
    title: string;
    author?: string;
    category?: string;
    created_date?: string;
    content: string;
    created_at: string;
    updated_at: string;
}

type Step = 'details' | 'content' | 'preview';

const EMPTY_CONTENT: Descendant[] = [
    { type: 'paragraph', children: [{ text: '' }] },
];

function toEditorValue(raw: string): Descendant[] {
    try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
            return parsed as Descendant[];
        }
    } catch {
        // Plain text is converted below.
    }

    const paragraphs = raw
        .split(/\n{2,}/)
        .map((paragraph) => paragraph.trim())
        .filter(Boolean);

    if (paragraphs.length === 0) return EMPTY_CONTENT;

    return paragraphs.map((paragraph) => ({
        type: 'paragraph',
        children: [{ text: paragraph }],
    }));
}

export default function ArchiveForm({ itemId }: { itemId?: string }) {
    const [step, setStep] = useState<Step>('details');
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [category, setCategory] = useState('');
    const [createdDate, setCreatedDate] = useState('');
    const [content, setContent] = useState<Descendant[]>(EMPTY_CONTENT);
    const [loading, setLoading] = useState(Boolean(itemId));
    const [loadError, setLoadError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [saved, setSaved] = useState(false);
    const [savedId, setSavedId] = useState<number | null>(null);
    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        if (!itemId) return;
        let cancelled = false;

        async function load() {
            setLoading(true);
            setLoadError(null);
            try {
                const response = await fetch(`/api/archive/${itemId}`);
                if (!response.ok) {
                    throw new Error(`Status ${response.status}`);
                }
                const data = (await response.json()) as ArchiveItem;
                if (cancelled) return;
                setTitle(data.title ?? '');
                setAuthor(data.author ?? '');
                setCategory(data.category ?? '');
                setCreatedDate(
                    data.created_date ? data.created_date.slice(0, 10) : ''
                );
                setContent(toEditorValue(data.content ?? ''));
            } catch (error) {
                console.error('Error loading archive item:', error);
                if (!cancelled) {
                    setLoadError(
                        'Der Archiveintrag konnte nicht geladen werden.'
                    );
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        load();
        return () => {
            cancelled = true;
        };
    }, [itemId, reloadKey]);

    function continueToContent(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!title.trim()) return;
        setStep('content');
        setSaveError(null);
    }

    async function publish() {
        if (!title.trim() || saving) return;

        setSaving(true);
        setSaveError(null);

        try {
            const response = await fetch(
                itemId ? `/api/archive/${itemId}` : '/api/archive',
                {
                    method: itemId ? 'PUT' : 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        title: title.trim(),
                        author: author.trim() || undefined,
                        category: category.trim() || undefined,
                        created_date: createdDate || undefined,
                        content: JSON.stringify(content),
                    }),
                }
            );

            if (!response.ok) {
                let message = itemId
                    ? 'Die Änderungen konnten nicht gespeichert werden.'
                    : 'Der Eintrag konnte nicht veröffentlicht werden.';
                try {
                    const data = (await response.json()) as { error?: string };
                    if (data.error) message = data.error;
                } catch {
                    // Keep the German fallback.
                }
                throw new Error(message);
            }

            const data = (await response.json()) as ArchiveItem;
            setSaved(true);
            setSavedId(data.id ?? null);
        } catch (error) {
            setSaveError(
                error instanceof Error
                    ? error.message
                    : 'Der Eintrag konnte nicht gespeichert werden.'
            );
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <div>
                <AdminHead
                    title={itemId ? 'Archiveintrag bearbeiten' : 'Neuer Archiveintrag'}
                />
                <p className="admin-empty" role="status">
                    Archiveintrag wird geladen …
                </p>
            </div>
        );
    }

    if (loadError) {
        return (
            <div>
                <AdminHead
                    title={itemId ? 'Archiveintrag bearbeiten' : 'Neuer Archiveintrag'}
                />
                <div className="notice notice--error" role="alert">
                    <strong>Nicht geladen</strong>
                    <span>{loadError}</span>
                    <button
                        type="button"
                        className="btn btn--sm"
                        onClick={() => setReloadKey((key) => key + 1)}
                    >
                        Erneut laden
                    </button>
                </div>
                <p style={{ marginTop: 'var(--s4)' }}>
                    <Link className="btn btn--quiet" href="/admin/archiv">
                        Zurück zum Archiv
                    </Link>
                </p>
            </div>
        );
    }

    const heading = itemId
        ? 'Archiveintrag bearbeiten'
        : 'Neuer Archiveintrag';

    if (step === 'details') {
        return (
            <div>
                <AdminHead
                    title={heading}
                    sub="Erster Schritt von drei · Angaben zum Dokument"
                />

                <form className={s.form} onSubmit={continueToContent}>
                    <Panel title="Angaben">
                        <div className="form-grid">
                            <div className="field">
                                <label htmlFor="archive-title">
                                    Titel (Pflicht)
                                </label>
                                <input
                                    id="archive-title"
                                    className="input"
                                    type="text"
                                    value={title}
                                    onChange={(event) =>
                                        setTitle(event.target.value)
                                    }
                                    maxLength={255}
                                    required
                                    autoFocus
                                    placeholder="z. B. Chronik des Jahres 1950"
                                />
                            </div>

                            <div className="form-row">
                                <div className="field">
                                    <label htmlFor="archive-author">
                                        Autor (optional)
                                    </label>
                                    <input
                                        id="archive-author"
                                        className="input"
                                        type="text"
                                        value={author}
                                        onChange={(event) =>
                                            setAuthor(event.target.value)
                                        }
                                        placeholder="z. B. Max Mustermann"
                                    />
                                </div>

                                <div className="field">
                                    <label htmlFor="archive-doc-category">
                                        Kategorie (optional)
                                    </label>
                                    <input
                                        id="archive-doc-category"
                                        className="input"
                                        type="text"
                                        value={category}
                                        onChange={(event) =>
                                            setCategory(event.target.value)
                                        }
                                        placeholder="z. B. Chronik, Brief, Bericht"
                                    />
                                </div>
                            </div>

                            <div className="field">
                                <label htmlFor="archive-created-date">
                                    Dokumentdatum (optional)
                                </label>
                                <input
                                    id="archive-created-date"
                                    className="input"
                                    type="date"
                                    value={createdDate}
                                    onChange={(event) =>
                                        setCreatedDate(event.target.value)
                                    }
                                />
                                <p className="hint">
                                    Das ursprüngliche Datum des Dokuments,
                                    falls bekannt.
                                </p>
                            </div>
                        </div>
                    </Panel>

                    <div className={s.stepRow}>
                        <Link className="btn btn--quiet" href="/admin/archiv">
                            Abbrechen
                        </Link>
                        <button
                            type="submit"
                            className="btn btn--primary"
                            disabled={!title.trim()}
                        >
                            Weiter zum Inhalt
                        </button>
                    </div>
                </form>
            </div>
        );
    }

    if (step === 'content') {
        return (
            <div>
                <AdminHead
                    title={title || heading}
                    sub="Zweiter Schritt von drei · Inhalt schreiben"
                    actions={
                        <button
                            type="button"
                            className="btn btn--primary btn--sm"
                            onClick={() => {
                                setSaveError(null);
                                setStep('preview');
                            }}
                        >
                            Vorschau
                        </button>
                    }
                />

                <div className={s.editor}>
                    <EnhancedRichTextEditor
                        value={content}
                        onChange={setContent}
                        placeholder="Inhalt des Archiveintrags …"
                    />
                </div>

                <div className={s.stepRow}>
                    <button
                        type="button"
                        className="btn btn--quiet"
                        onClick={() => setStep('details')}
                    >
                        Zurück zu den Angaben
                    </button>
                    <Link className="btn btn--quiet" href="/admin/archiv">
                        Abbrechen
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div>
            <AdminHead
                title="Vorschau"
                sub={`Dritter Schritt von drei · ${
                    itemId ? 'Änderungen prüfen' : 'Eintrag veröffentlichen'
                }`}
                actions={
                    <>
                        <button
                            type="button"
                            className="btn btn--quiet btn--sm"
                            onClick={() => setStep('content')}
                            disabled={saving}
                        >
                            Zurück zum Inhalt
                        </button>
                        {!saved && (
                            <button
                                type="button"
                                className="btn btn--primary btn--sm"
                                onClick={publish}
                                disabled={saving}
                            >
                                {saving
                                    ? 'Speichern …'
                                    : itemId
                                      ? 'Änderungen speichern'
                                      : 'Jetzt veröffentlichen'}
                            </button>
                        )}
                    </>
                }
            />

            {saved && (
                <div className="notice notice--ok" role="status">
                    <strong>Gespeichert</strong>
                    <span>
                        Der Archiveintrag „{title}“ ist im Dorfarchiv
                        verzeichnet.
                    </span>
                    <span className="admin-actions">
                        <Link className="btn btn--quiet btn--sm" href="/admin/archiv">
                            Zum Archiv
                        </Link>
                        {!itemId && (
                            <Link
                                className="btn btn--sm"
                                href="/admin/archiv/erstellen"
                            >
                                Neuen Eintrag anlegen
                            </Link>
                        )}
                    </span>
                </div>
            )}

            {saveError && (
                <div className="notice notice--error" role="alert">
                    <strong>Nicht gespeichert</strong>
                    <span>{saveError}</span>
                </div>
            )}

            <article className={s.preview}>
                <header className={s.previewHead}>
                    <p className={s.previewKicker}>
                        {category || 'Dorfarchiv'}
                    </p>
                    <h2 className={s.previewTitle}>{title || 'Ohne Titel'}</h2>
                    <p className={s.previewMeta}>
                        {author && <span>von {author}</span>}
                        {createdDate && (
                            <span>{dateLong(new Date(createdDate))}</span>
                        )}
                    </p>
                </header>
                <div className="prose">
                    <ArticleRenderer content={content} />
                </div>
            </article>

            <p style={{ marginTop: 'var(--s4)' }}>
                <Link className="btn btn--quiet btn--sm" href="/admin/archiv">
                    Zurück zum Archiv
                </Link>
                {savedId && (
                    <span className="muted" style={{ marginLeft: 'var(--s3)' }}>
                        Eintrag Nr. {savedId}
                    </span>
                )}
            </p>
        </div>
    );
}
