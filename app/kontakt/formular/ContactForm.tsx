'use client';

import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { PaperPlaneTilt } from '@phosphor-icons/react/dist/ssr';
import SuccessPopup from '@/app/components/ui/SuccessPopup';

export default function ContactForm() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrorMessage('');
        setIsSubmitting(true);

        const formElement = event.currentTarget;
        const formData = new FormData(formElement);

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                body: formData,
            });

            const data = (await response.json()) as { error?: string };

            if (!response.ok) {
                throw new Error(
                    data.error ||
                        'Beim Senden ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.'
                );
            }

            formElement.reset();
            setShowSuccessPopup(true);
        } catch (error) {
            setErrorMessage(
                error instanceof Error
                    ? error.message
                    : 'Beim Senden ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.'
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label
                            htmlFor="vorname"
                            className="block text-sm font-bold text-gray-700 mb-2"
                        >
                            Vorname *
                        </label>
                        <input
                            type="text"
                            id="vorname"
                            name="vorname"
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors text-gray-900"
                            placeholder="Ihr Vorname"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="nachname"
                            className="block text-sm font-bold text-gray-700 mb-2"
                        >
                            Nachname *
                        </label>
                        <input
                            type="text"
                            id="nachname"
                            name="nachname"
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors text-gray-900"
                            placeholder="Ihr Nachname"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-bold text-gray-700 mb-2"
                        >
                            E-Mail-Adresse *
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors text-gray-900"
                            placeholder="ihre@email.de"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="telefon"
                            className="block text-sm font-bold text-gray-700 mb-2"
                        >
                            Telefon (optional)
                        </label>
                        <input
                            type="tel"
                            id="telefon"
                            name="telefon"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors text-gray-900"
                            placeholder="Ihre Telefonnummer"
                        />
                    </div>
                </div>

                <div>
                    <label
                        htmlFor="adresse"
                        className="block text-sm font-bold text-gray-700 mb-2"
                    >
                        Adresse (optional)
                    </label>
                    <input
                        type="text"
                        id="adresse"
                        name="adresse"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors text-gray-900"
                        placeholder="Straße und Hausnummer, PLZ Ort"
                    />
                </div>

                <div>
                    <label
                        htmlFor="betreff"
                        className="block text-sm font-bold text-gray-700 mb-2"
                    >
                        Betreff *
                    </label>
                    <select
                        id="betreff"
                        name="betreff"
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors text-gray-900"
                    >
                        <option value="">Bitte wählen Sie einen Betreff</option>
                        <option value="allgemeine-anfrage">Allgemeine Anfrage</option>
                        <option value="anregung">Anregung / Vorschlag</option>
                        <option value="beschwerde">Beschwerde</option>
                        <option value="veranstaltung">Veranstaltung</option>
                        <option value="infrastruktur">Infrastruktur / Straßen</option>
                        <option value="umwelt">Umwelt / Natur</option>
                        <option value="verkehr">Verkehr</option>
                        <option value="bauen-wohnen">Bauen & Wohnen</option>
                        <option value="vereine">Vereine / Organisationen</option>
                        <option value="sonstiges">Sonstiges</option>
                    </select>
                </div>

                <div>
                    <label
                        htmlFor="nachricht"
                        className="block text-sm font-bold text-gray-700 mb-2"
                    >
                        Ihre Nachricht *
                    </label>
                    <textarea
                        id="nachricht"
                        name="nachricht"
                        required
                        rows={6}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors resize-vertical text-gray-900"
                        placeholder="Teilen Sie uns Ihr Anliegen mit..."
                    ></textarea>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 p-6 rounded-r-2xl">
                    <div className="flex items-start space-x-3">
                        <input
                            type="checkbox"
                            id="datenschutz"
                            name="datenschutz"
                            required
                            className="mt-1 w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                        />
                        <label htmlFor="datenschutz" className="text-sm text-gray-700">
                            Ich habe die{' '}
                            <Link
                                href="/kontakt/datenschutz"
                                target="_blank"
                                className="text-blue-600 hover:text-blue-800 underline"
                            >
                                Datenschutzerklärung
                            </Link>{' '}
                            gelesen und erkläre mich mit der Verarbeitung meiner
                            personenbezogenen Daten einverstanden. *
                        </label>
                    </div>
                </div>

                <div className="text-center pt-4">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-lg rounded-full hover:from-emerald-600 hover:to-teal-600 transform hover:scale-105 transition-all duration-300 shadow-xl disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        <PaperPlaneTilt className="w-5 h-5 mr-2" />
                        {isSubmitting ? 'Wird gesendet...' : 'Nachricht senden'}
                    </button>
                </div>

                {errorMessage ? (
                    <p className="text-sm text-red-600 text-center">{errorMessage}</p>
                ) : null}

                <p className="text-sm text-gray-500 text-center">* Pflichtfelder</p>
            </form>

            <SuccessPopup
                isOpen={showSuccessPopup}
                onClose={() => setShowSuccessPopup(false)}
                message="Vielen Dank! Ihre Nachricht wurde erfolgreich versendet."
            />
        </>
    );
}
