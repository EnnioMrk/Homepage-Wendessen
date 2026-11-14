'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Descendant } from 'slate';
import Link from 'next/link';
import EnhancedRichTextEditor from '@/app/components/EnhancedRichTextEditor';
import ArticleRenderer from '@/app/components/news/ArticleRenderer';
import { AdminHead, Panel } from '@/app/components/admin/AdminPage';
import { dateLong, dateShort } from '@/app/lib/register-format';
import styles from '../../news.module.css';

const initialEditorValue: Descendant[] = [
    {
        type: 'paragraph',
        children: [{ text: '' }],
    },
];

interface NewsArticle {
    id: string;
    title: string;
    content: string;
    category: string;
    publishedDate: string;
    contentJson?: string;
    articleId: string;
}

const CATEGORY_OPTIONS = [
    'Bildung',
    'Gemeinschaft',
    'Feuerwehr',
    'Digital',
    'Sport',
    'Kultur',
    'Verwaltung',
];

export default function EditNewsForm() {
    const router = useRouter();
    const routeParams = useParams<{ id: string }>();
    const id = routeParams?.id;
    const [mode, setMode] = useState<'edit' | 'preview'>('edit');
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [newsArticle, setNewsArticle] = useState<NewsArticle | null>(null);

    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [articleContent, setArticleContent] =
        useState<Descendant[]>(initialEditorValue);
    const [reloadToken, setReloadToken] = useState(0);

    useEffect(() => {
        let mounted = true;
        if (!id) {
            return;
        }

        (async () => {
            try {
                setIsLoading(true);
                setLoadError(null);
                const response = await fetch(`/api/admin/news/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    const article = data.news;

                    if (!mounted) return;

                    setNewsArticle(article);
                    setTitle(article.title);
                    setCategory(article.category);

                    if (article.contentJson) {
                        const content =
                            typeof article.contentJson === 'string'
                                ? JSON.parse(article.contentJson)
                                : article.contentJson;
                        if (Array.isArray(content)) {
                            setArticleContent(content);
                        }
                    }
                } else if (mounted) {
                    setLoadError('Artikel nicht gefunden');
                }
            } catch (fetchError) {
                console.error('Fetch error:', fetchError);
                if (mounted) setLoadError('Fehler beim Laden des Artikels');
            } finally {
                if (mounted) setIsLoading(false);
            }
        })();

        return () => {
            mounted = false;
        };
    }, [id, reloadToken]);

    const handleUpdate = async () => {
        if (!title.trim() || !category) {
            setError('Bitte Titel und Rubrik angeben.');
            return;
        }
        setIsSaving(true);
        setError(null);

        try {
            const response = await fetch(`/api/admin/news/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: title.trim(),
                    category: category,
                    contentJson: JSON.stringify(articleContent),
                }),
            });

            if (response.ok) {
                router.push('/admin/news');
                router.refresh();
            } else {
                const data = await response.json().catch(() => null);
                setError(data?.error || 'Fehler beim Aktualisieren');
            }
        } catch (updateError) {
            console.error('Update error:', updateError);
            setError('Netzwerkfehler beim Aktualisieren');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div>
                <AdminHead
                    title="Nachricht bearbeiten"
                    sub="Register der Nachrichten"
                />
                <div className="panel">
                    <div className="panel-body">
                        <p className="muted">Lade Artikel …</p>
                    </div>
                </div>
            </div>
        );
    }

    if (loadError && !newsArticle) {
        return (
            <div>
                <AdminHead
                    title="Nachricht bearbeiten"
                    sub="Register der Nachrichten"
                />
                <div className="notice notice--error" role="alert">
                    <strong>Artikel nicht geladen</strong>
                    <span>{loadError}</span>
                </div>
                <div
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 'var(--s2)',
                        marginTop: 'var(--s4)',
                    }}
                >
                    <button
                        type="button"
                        className="btn btn--primary"
                        onClick={() => setReloadToken((value) => value + 1)}
                    >
                        Erneut laden
                    </button>
                    <Link className="btn btn--quiet" href="/admin/news">
                        Zurück zur Übersicht
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div>
            <AdminHead
                title="Nachricht bearbeiten"
                sub={
                    newsArticle
                        ? `${dateShort(new Date(newsArticle.publishedDate))} · ${newsArticle.category}`
                        : 'Register der Nachrichten'
                }
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
                            onClick={handleUpdate}
                            disabled={
                                isSaving || !title.trim() || !category
                            }
                        >
                            {isSaving ? 'Speichern …' : 'Speichern'}
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
                    <strong>Nicht gespeichert</strong>
                    <span>{error}</span>
                </div>
            )}

            <form
                onSubmit={(event) => {
                    event.preventDefault();
                    handleUpdate();
                }}
            >
                <div hidden={mode === 'preview'}>
                    <Panel title="Eintrag">
                        <div className="form-grid">
                            <div className="field">
                                <label htmlFor="edit-news-title">
                                    Titel *
                                </label>
                                <input
                                    id="edit-news-title"
                                    className="input"
                                    type="text"
                                    value={title}
                                    onChange={(event) =>
                                        setTitle(event.target.value)
                                    }
                                    maxLength={255}
                                    required
                                />
                            </div>
                            <div className="field">
                                <label htmlFor="edit-news-category">
                                    Rubrik *
                                </label>
                                <select
                                    id="edit-news-category"
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
                            {newsArticle
                                ? dateLong(
                                      new Date(newsArticle.publishedDate),
                                  )
                                : dateLong(new Date())}
                        </span>
                    </div>
                    <div className="panel-body">
                        <div className={styles.articleHead}>
                            <span className={styles.rubric}>{category}</span>
                            <h2 className={styles.articleTitle}>{title}</h2>
                            <div className={styles.articleMeta}>
                                <span>
                                    {newsArticle
                                        ? dateLong(
                                              new Date(
                                                  newsArticle.publishedDate,
                                              ),
                                          )
                                        : dateLong(new Date())}
                                </span>
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
