'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Descendant } from 'slate';
import Link from 'next/link';
import EnhancedRichTextEditor from '@/app/components/EnhancedRichTextEditor';
import ArticleRenderer from '@/app/components/news/ArticleRenderer';
import { AdminHead, Panel } from '@/app/components/admin/AdminPage';
import { dateLong } from '@/app/lib/register-format';
import styles from '../news.module.css';

const getInitialEditorValue = (): Descendant[] => [
    {
        type: 'paragraph',
        children: [{ text: '' }],
    },
];

const CATEGORY_OPTIONS = [
    'Bildung',
    'Gemeinschaft',
    'Feuerwehr',
    'Digital',
    'Sport',
    'Kultur',
    'Verwaltung',
];

export default function CreateNewsForm() {
    const router = useRouter();
    const [mode, setMode] = useState<'edit' | 'preview'>('edit');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [articleContent, setArticleContent] = useState<Descendant[]>(
        getInitialEditorValue(),
    );

    const canPublish = Boolean(title.trim() && category);

    const handlePublish = async () => {
        if (!canPublish) {
            setError('Bitte Titel und Rubrik angeben.');
            setMode('edit');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/admin/news', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: title.trim(),
                    content: null,
                    category: category,
                    contentJson: JSON.stringify(articleContent),
                }),
            });

            if (response.ok) {
                router.push('/admin/news');
                router.refresh();
            } else {
                const data = await response.json().catch(() => null);
                setError(data?.error || 'Fehler beim Veröffentlichen');
            }
        } catch (publishError) {
            console.error('Publishing error:', publishError);
            setError('Netzwerkfehler beim Veröffentlichen');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <AdminHead
                title="Neue Nachricht"
                sub="Eintrag im Register der Nachrichten"
                actions={
                    <>
                        <Link className="btn btn--quiet" href="/admin/news">
                            Abbrechen
                        </Link>
                        <button
                            type="button"
                            className="btn btn--quiet"
                            onClick={() =>
                                setMode(mode === 'preview' ? 'edit' : 'preview')
                            }
                        >
                            {mode === 'preview'
                                ? 'Zurück zum Schreiben'
                                : 'Vorschau'}
                        </button>
                        <button
                            type="button"
                            className="btn btn--primary"
                            onClick={handlePublish}
                            disabled={isLoading || !canPublish}
                        >
                            {isLoading ? 'Wird veröffentlicht …' : 'Veröffentlichen'}
                        </button>
                    </>
                }
            />

            {error && (
                <div
                    className="notice notice--error"
                    role="alert"
                    style={{ marginBottom: 'var(--s4)' }}
                >
                    <strong>Nicht veröffentlicht</strong>
                    <span>{error}</span>
                </div>
            )}

            <form
                onSubmit={(event) => {
                    event.preventDefault();
                    handlePublish();
                }}
            >
                <div hidden={mode === 'preview'}>
                    <Panel title="Eintrag">
                        <p
                            className="small muted"
                            style={{ marginBottom: 'var(--s3)' }}
                        >
                            Beide Angaben sind Pflicht. Der Artikel erscheint
                            nach dem Veröffentlichen auf der Startseite.
                        </p>
                        <div className="form-grid">
                            <div className="field">
                                <label htmlFor="create-news-title">
                                    Titel *
                                </label>
                                <input
                                    id="create-news-title"
                                    className="input"
                                    type="text"
                                    value={title}
                                    onChange={(event) =>
                                        setTitle(event.target.value)
                                    }
                                    maxLength={255}
                                    required
                                    placeholder="z.B. Neues Feuerwehrhaus geplant"
                                />
                            </div>
                            <div className="field">
                                <label htmlFor="create-news-category">
                                    Rubrik *
                                </label>
                                <select
                                    id="create-news-category"
                                    className="select"
                                    value={category}
                                    onChange={(event) =>
                                        setCategory(event.target.value)
                                    }
                                    required
                                >
                                    <option value="">Rubrik wählen</option>
                                    {CATEGORY_OPTIONS.map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </Panel>

                    <div style={{ marginTop: 'var(--s5)' }}>
                        <Panel title="Artikel">
                            <p className="small muted">
                                Der vollständige Text mit Überschriften,
                                Listen und Bildern.
                            </p>
                            <div
                                className={styles.editorFrame}
                                style={{ marginTop: 'var(--s3)' }}
                            >
                                <EnhancedRichTextEditor
                                    value={articleContent}
                                    onChange={setArticleContent}
                                    placeholder="Schreiben Sie hier Ihren vollständigen Artikel …"
                                />
                            </div>
                        </Panel>
                    </div>
                </div>
            </form>

            {mode === 'preview' && (
                <div className="panel">
                    <div className="panel-head">
                        <h2>Vorschau</h2>
                        <span className="small muted">
                            {dateLong(new Date())}
                        </span>
                    </div>
                    <div className="panel-body">
                        <div className={styles.articleHead}>
                            <span className={styles.rubric}>{category}</span>
                            <h2 className={styles.articleTitle}>{title}</h2>
                            <div className={styles.articleMeta}>
                                <span>{dateLong(new Date())}</span>
                            </div>
                        </div>
                        <div className="prose">
                            <ArticleRenderer content={articleContent} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
