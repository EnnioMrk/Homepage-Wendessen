'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';

const subjects = [
    { value: 'allgemeine-anfrage', label: 'Allgemeine Anfrage' },
    { value: 'anregung', label: 'Anregung / Vorschlag' },
    { value: 'beschwerde', label: 'Beschwerde' },
    { value: 'veranstaltung', label: 'Veranstaltung' },
    { value: 'infrastruktur', label: 'Infrastruktur / Straßen' },
    { value: 'umwelt', label: 'Umwelt / Natur' },
    { value: 'verkehr', label: 'Verkehr' },
    { value: 'bauen-wohnen', label: 'Bauen & Wohnen' },
    { value: 'vereine', label: 'Vereine / Organisationen' },
    { value: 'sonstiges', label: 'Sonstiges' },
];

const fallbackError =
    'Beim Senden ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.';

export default function ContactForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formElement = event.currentTarget;
        const formData = new FormData(formElement);

        setErrorMessage('');
        setIsSent(false);
        setIsSubmitting(true);

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                body: formData,
            });

            let data: { error?: string } = {};
            try {
                data = (await response.json()) as { error?: string };
            } catch {
                // No JSON body; fall back to the generic message.
            }

            if (!response.ok) {
                throw new Error(data.error || fallbackError);
            }

            formElement.reset();
            setIsSent(true);
        } catch (error) {
            setErrorMessage(
                error instanceof Error ? error.message : fallbackError,
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="form-grid">
            {isSent ? (
                <div className="notice notice--ok" role="status">
                    <strong>Nachricht versendet</strong>
                    <span>
                        Vielen Dank! Ihre Nachricht wurde erfolgreich an den
                        Ortsrat geschickt. Wir antworten in der Regel innerhalb
                        von 2–3 Werktagen.
                    </span>
                </div>
            ) : null}

            {errorMessage ? (
                <div className="notice notice--error" role="alert">
                    <strong>Nicht versendet</strong>
                    <span>{errorMessage}</span>
                </div>
            ) : null}

            <div className="form-row">
                <div className="field">
                    <label htmlFor="vorname">Vorname *</label>
                    <input
                        className="input"
                        type="text"
                        id="vorname"
                        name="vorname"
                        required
                        autoComplete="given-name"
                        placeholder="Ihr Vorname"
                    />
                </div>
                <div className="field">
                    <label htmlFor="nachname">Nachname *</label>
                    <input
                        className="input"
                        type="text"
                        id="nachname"
                        name="nachname"
                        required
                        autoComplete="family-name"
                        placeholder="Ihr Nachname"
                    />
                </div>
            </div>

            <div className="form-row">
                <div className="field">
                    <label htmlFor="email">E-Mail-Adresse *</label>
                    <input
                        className="input"
                        type="email"
                        id="email"
                        name="email"
                        required
                        autoComplete="email"
                        placeholder="ihre@email.de"
                    />
                </div>
                <div className="field">
                    <label htmlFor="telefon">Telefon (optional)</label>
                    <input
                        className="input"
                        type="tel"
                        id="telefon"
                        name="telefon"
                        autoComplete="tel"
                        placeholder="Ihre Telefonnummer"
                    />
                </div>
            </div>

            <div className="field">
                <label htmlFor="adresse">Adresse (optional)</label>
                <input
                    className="input"
                    type="text"
                    id="adresse"
                    name="adresse"
                    autoComplete="street-address"
                    placeholder="Straße und Hausnummer, PLZ Ort"
                />
            </div>

            <div className="field">
                <label htmlFor="betreff">Betreff *</label>
                <select
                    className="select"
                    id="betreff"
                    name="betreff"
                    required
                    defaultValue=""
                >
                    <option value="">Bitte wählen Sie einen Betreff</option>
                    {subjects.map((subject) => (
                        <option key={subject.value} value={subject.value}>
                            {subject.label}
                        </option>
                    ))}
                </select>
            </div>

            <div className="field">
                <label htmlFor="nachricht">Ihre Nachricht *</label>
                <textarea
                    className="textarea"
                    id="nachricht"
                    name="nachricht"
                    required
                    rows={6}
                    placeholder="Teilen Sie uns Ihr Anliegen mit …"
                />
            </div>

            <div className="notice">
                <label className="check" htmlFor="datenschutz">
                    <input
                        type="checkbox"
                        id="datenschutz"
                        name="datenschutz"
                        required
                    />
                    <span>
                        Ich habe die{' '}
                        <Link
                            className="link"
                            href="/datenschutz"
                            target="_blank"
                            rel="noreferrer"
                        >
                            Datenschutzerklärung
                        </Link>{' '}
                        gelesen und erkläre mich mit der Verarbeitung meiner
                        personenbezogenen Daten einverstanden. *
                    </span>
                </label>
            </div>

            <div className="form-actions">
                <button
                    type="submit"
                    className="btn btn--primary"
                    disabled={isSubmitting}
                    aria-busy={isSubmitting}
                >
                    {isSubmitting ? 'Wird gesendet …' : 'Nachricht senden'}
                </button>
                <span className="muted small">
                    * Pflichtfelder. Wir nutzen Ihre Angaben nur zur Bearbeitung
                    der Anfrage.
                </span>
            </div>
        </form>
    );
}
