'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import PortraitDialog from '@/app/dorfleben/wir-wendesser/portrait-dialog';
import styles from '@/app/dorfleben/wir-wendesser/portrait.module.css';

const MIN_STORY = 50;
const MAX_BYTES = 5 * 1024 * 1024;

interface PortraitSubmissionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export default function PortraitSubmissionModal({
    isOpen,
    onClose,
    onSuccess,
}: PortraitSubmissionModalProps) {
    const [submitting, setSubmitting] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [name, setName] = useState('');
    const [story, setStory] = useState('');
    const [email, setEmail] = useState('');
    const [consent, setConsent] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);

    const clearFile = () => {
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
        setSelectedFile(null);
        if (fileRef.current) fileRef.current.value = '';
    };

    const reset = () => {
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
        setSelectedFile(null);
        setName('');
        setStory('');
        setEmail('');
        setConsent(false);
        setMessage(null);
        if (fileRef.current) fileRef.current.value = '';
    };

    const handleClose = () => {
        if (submitting) return;
        reset();
        onClose();
    };

    const handleFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(null);
        const file = event.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            setMessage('Bitte wählen Sie eine Bilddatei aus.');
            event.target.value = '';
            return;
        }

        if (file.size > MAX_BYTES) {
            setMessage(
                'Die Datei ist zu groß. Erlaubt sind höchstens 5 MB.',
            );
            event.target.value = '';
            return;
        }

        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!selectedFile) {
            setMessage('Bitte wählen Sie ein Foto aus.');
            fileRef.current?.focus();
            return;
        }
        if (!name.trim()) {
            setMessage('Bitte nennen Sie Ihren Namen.');
            document.getElementById('portrait-name')?.focus();
            return;
        }
        if (story.trim().length < MIN_STORY) {
            setMessage(
                `Ihre Geschichte muss mindestens ${MIN_STORY} Zeichen haben.`,
            );
            document.getElementById('portrait-story')?.focus();
            return;
        }
        if (!consent) {
            setMessage(
                'Bitte bestätigen Sie die Einwilligung zur Veröffentlichung.',
            );
            document.getElementById('portrait-consent')?.focus();
            return;
        }

        setSubmitting(true);
        setMessage(null);

        try {
            const formData = new FormData();
            formData.append('image', selectedFile);
            formData.append('name', name.trim());
            formData.append('description', story.trim());
            formData.append('email', email.trim());

            const response = await fetch('/api/portraits', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                let serverMessage = 'Die Einreichung konnte nicht gesendet werden.';
                try {
                    const errorData = (await response.json()) as {
                        message?: string;
                    };
                    if (errorData.message) serverMessage = errorData.message;
                } catch {
                    // Keep the generic message when the body is not JSON.
                }
                setMessage(serverMessage);
                return;
            }

            reset();
            onSuccess?.();
        } catch (cause) {
            console.error('Porträt: Einreichung fehlgeschlagen', cause);
            setMessage(
                'Die Einreichung konnte nicht gesendet werden. Bitte versuchen Sie es später noch einmal.',
            );
        } finally {
            setSubmitting(false);
        }
    };

    const storyLength = story.trim().length;
    const storyInvalid = storyLength > 0 && storyLength < MIN_STORY;

    return (
        <PortraitDialog open={isOpen} onClose={handleClose} title="Portrait einreichen">
            <form className="form-card" onSubmit={handleSubmit} noValidate>
                <p className="small muted">
                    Teilen Sie Ihre Geschichte mit der Dorfgemeinschaft. Wir
                    prüfen jede Einreichung, bevor sie hier erscheint.
                </p>

                {message && (
                    <div
                        className="notice notice--error"
                        role="alert"
                        style={{ marginTop: 'var(--s3)' }}
                    >
                        <strong>Einreichung nicht gesendet</strong>
                        <span>{message}</span>
                    </div>
                )}

                <div className="form-grid" style={{ marginTop: 'var(--s4)' }}>
                    <div className="field">
                        <label htmlFor="portrait-photo">Ihr Foto *</label>
                        <input
                            ref={fileRef}
                            id="portrait-photo"
                            className="input"
                            type="file"
                            accept="image/*"
                            onChange={handleFile}
                            disabled={submitting}
                            aria-describedby="portrait-photo-hint"
                        />
                        <p className="hint" id="portrait-photo-hint">
                            JPG, PNG, WebP oder GIF bis 5 MB.
                        </p>
                        {previewUrl && (
                            <div className={styles.previewActions}>
                                <div
                                    className={styles.preview}
                                    role="img"
                                    aria-label="Vorschau des gewählten Fotos"
                                    style={{
                                        backgroundImage: `url(${previewUrl})`,
                                    }}
                                />
                                <button
                                    type="button"
                                    className="btn btn--quiet btn--sm"
                                    onClick={clearFile}
                                    disabled={submitting}
                                >
                                    Foto entfernen
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="field">
                        <label htmlFor="portrait-name">Ihr Name *</label>
                        <input
                            id="portrait-name"
                            className="input"
                            type="text"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                            placeholder="Wie sollen wir Sie nennen?"
                            autoComplete="name"
                            disabled={submitting}
                        />
                    </div>

                    <div className="field">
                        <label htmlFor="portrait-story">
                            Ihre Geschichte *
                        </label>
                        <textarea
                            id="portrait-story"
                            className="textarea"
                            value={story}
                            onChange={(event) => setStory(event.target.value)}
                            placeholder="Erzählen Sie uns etwas über sich, was Sie bewegt, was Sie sich wünschen …"
                            disabled={submitting}
                            aria-invalid={storyInvalid}
                            aria-describedby="portrait-story-hint"
                        />
                        <p
                            className={styles.counter}
                            id="portrait-story-hint"
                            data-invalid={storyInvalid}
                        >
                            {storyLength} von mindestens {MIN_STORY} Zeichen
                            {storyInvalid
                                ? ` – noch ${MIN_STORY - storyLength}`
                                : ''}
                        </p>
                    </div>

                    <div className="field">
                        <label htmlFor="portrait-email">
                            E-Mail (optional)
                        </label>
                        <input
                            id="portrait-email"
                            className="input"
                            type="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            placeholder="Für Rückfragen"
                            autoComplete="email"
                            disabled={submitting}
                            aria-describedby="portrait-email-hint"
                        />
                        <p className="hint" id="portrait-email-hint">
                            Die E-Mail wird nicht veröffentlicht und nur für
                            Rückfragen verwendet.
                        </p>
                    </div>

                    <label className="check" htmlFor="portrait-consent">
                        <input
                            id="portrait-consent"
                            type="checkbox"
                            checked={consent}
                            onChange={(event) =>
                                setConsent(event.target.checked)
                            }
                            disabled={submitting}
                        />
                        <span>
                            <strong>
                                Einwilligung zur Veröffentlichung *
                            </strong>
                            <br />
                            Ich habe die{' '}
                            <Link
                                className="link"
                                href="/datenschutz"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                rechtlichen Hinweise
                            </Link>{' '}
                            gelesen und bestätige, dass ich alle Rechte am Bild
                            besitze und die Zustimmung aller abgebildeten
                            Personen für die Veröffentlichung auf dieser
                            Webseite habe.
                        </span>
                    </label>

                    <p className={styles.legal}>
                        Ein Rechtsanspruch auf Veröffentlichung des Beitrages
                        besteht nicht.
                    </p>
                </div>

                <div className="form-actions">
                    <button
                        type="submit"
                        className="btn btn--primary"
                        disabled={submitting}
                    >
                        {submitting ? 'Wird gesendet …' : 'Portrait einreichen'}
                    </button>
                    <button
                        type="button"
                        className="btn btn--quiet"
                        onClick={handleClose}
                        disabled={submitting}
                    >
                        Abbrechen
                    </button>
                </div>
            </form>
        </PortraitDialog>
    );
}
