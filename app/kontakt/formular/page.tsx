import Link from 'next/link';
import {
    Phone,
    MapPin,
    Clock,
    Heart,
    EnvelopeSimple,
    PaperPlaneTilt,
} from '@phosphor-icons/react/dist/ssr';

export const metadata = {
    title: 'Kontaktformular - Wendessen',
    description:
        'Kontaktieren Sie den Ortsrat Wendessen über unser Kontaktformular. Wir freuen uns auf Ihre Nachricht, Anregungen und Fragen.',
};

export default function KontaktformularPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 py-16 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/95 to-cyan-600/95"></div>

                <div className="relative z-10 container mx-auto px-4 text-center">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex items-center justify-center mb-6">
                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-xl mr-4">
                                <EnvelopeSimple className="w-8 h-8 text-emerald-600" />
                            </div>
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
                                Kontaktformular
                            </h1>
                        </div>
                        <div className="w-32 h-2 bg-gradient-to-r from-yellow-400 to-white mx-auto mb-6"></div>
                        <p className="text-xl text-white/90 leading-relaxed max-w-2xl mx-auto">
                            Ihre Meinung ist uns wichtig
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto">
                    {/* Introduction */}
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-bold text-foreground mb-6">
                            Schreiben Sie uns
                        </h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-emerald-600 to-teal-600 mx-auto mb-8"></div>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                            Haben Sie Fragen, Anregungen oder Wünsche? Der
                            Ortsrat Wendessen freut sich auf Ihre Nachricht. Wir
                            werden uns schnellstmöglich bei Ihnen melden.
                        </p>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl mb-12">
                        <form className="space-y-8">
                            {/* Personal Information */}
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
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
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
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                                        placeholder="Ihr Nachname"
                                    />
                                </div>
                            </div>

                            {/* Contact Information */}
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
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
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
                                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                                        placeholder="Ihre Telefonnummer"
                                    />
                                </div>
                            </div>

                            {/* Address */}
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
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                                    placeholder="Straße und Hausnummer, PLZ Ort"
                                />
                            </div>

                            {/* Subject */}
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
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
                                >
                                    <option value="">
                                        Bitte wählen Sie einen Betreff
                                    </option>
                                    <option value="allgemeine-anfrage">
                                        Allgemeine Anfrage
                                    </option>
                                    <option value="anregung">
                                        Anregung / Vorschlag
                                    </option>
                                    <option value="beschwerde">
                                        Beschwerde
                                    </option>
                                    <option value="veranstaltung">
                                        Veranstaltung
                                    </option>
                                    <option value="infrastruktur">
                                        Infrastruktur / Straßen
                                    </option>
                                    <option value="umwelt">
                                        Umwelt / Natur
                                    </option>
                                    <option value="verkehr">Verkehr</option>
                                    <option value="bauen-wohnen">
                                        Bauen & Wohnen
                                    </option>
                                    <option value="vereine">
                                        Vereine / Organisationen
                                    </option>
                                    <option value="sonstiges">Sonstiges</option>
                                </select>
                            </div>

                            {/* Message */}
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
                                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors resize-vertical"
                                    placeholder="Teilen Sie uns Ihr Anliegen mit..."
                                ></textarea>
                            </div>

                            {/* Privacy Notice */}
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 p-6 rounded-r-2xl">
                                <div className="flex items-start space-x-3">
                                    <input
                                        type="checkbox"
                                        id="datenschutz"
                                        name="datenschutz"
                                        required
                                        className="mt-1 w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                                    />
                                    <label
                                        htmlFor="datenschutz"
                                        className="text-sm text-gray-700"
                                    >
                                        Ich habe die{' '}
                                        <Link
                                            href="/kontakt/datenschutz"
                                            target="_blank"
                                            className="text-blue-600 hover:text-blue-800 underline"
                                        >
                                            Datenschutzerklärung
                                        </Link>{' '}
                                        gelesen und erkläre mich mit der
                                        Verarbeitung meiner personenbezogenen
                                        Daten einverstanden. *
                                    </label>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className="text-center pt-4">
                                <button
                                    type="submit"
                                    className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-bold text-lg rounded-full hover:from-emerald-600 hover:to-teal-600 transform hover:scale-105 transition-all duration-300 shadow-xl"
                                >
                                    <PaperPlaneTilt className="w-5 h-5 mr-2" />
                                    Nachricht senden
                                </button>
                            </div>

                            {/* Required Fields Note */}
                            <p className="text-sm text-gray-500 text-center">
                                * Pflichtfelder
                            </p>
                        </form>
                    </div>

                    {/* Alternative Contact Methods */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                        {/* Direct Contact */}
                        <div className="bg-white rounded-3xl p-8 shadow-xl">
                            <div className="text-center mb-6">
                                <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Phone className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-emerald-800 mb-2">
                                    Direkter Kontakt
                                </h3>
                            </div>
                            <div className="space-y-3 text-gray-700">
                                <div className="flex items-center space-x-3">
                                    <Phone className="w-5 h-5 text-emerald-500" />
                                    <a
                                        href="tel:053317107733"
                                        className="text-emerald-600 hover:text-emerald-800 transition-colors"
                                    >
                                        05331 - 7107733
                                    </a>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <EnvelopeSimple className="w-5 h-5 text-emerald-500" />
                                    <EnvelopeSimple className="w-5 h-5 text-emerald-500" />
                                    <PaperPlaneTilt className="w-5 h-5 mr-2" />
                                    <a
                                        href="mailto:info@wendessen.de"
                                        className="text-emerald-600 hover:text-emerald-800 transition-colors"
                                    >
                                        info@wendessen.de
                                    </a>
                                </div>
                                <div className="flex items-start space-x-3">
                                    <MapPin className="w-5 h-5 text-emerald-500 mt-1" />
                                    <div>
                                        <p>Am Gute 2 R</p>
                                        <p>38300 Wolfenbüttel - Wendessen</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Opening Hours / Response Time */}
                        <div className="bg-white rounded-3xl p-8 shadow-xl">
                            <div className="text-center mb-6">
                                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Clock className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-2xl font-bold text-blue-800 mb-2">
                                    Antwortzeit
                                </h3>
                            </div>
                            <div className="space-y-4 text-gray-700">
                                <div className="bg-blue-50 p-4 rounded-xl">
                                    <p className="font-semibold text-blue-800 mb-2">
                                        Formular & E-Mail:
                                    </p>
                                    <p>
                                        Wir antworten in der Regel innerhalb von
                                        2-3 Werktagen
                                    </p>
                                </div>
                                <div className="bg-green-50 p-4 rounded-xl">
                                    <p className="font-semibold text-green-800 mb-2">
                                        Dringende Anliegen:
                                    </p>
                                    <p>
                                        Bitte rufen Sie uns direkt an oder
                                        wenden Sie sich an ein Ortsratsmitglied
                                    </p>
                                </div>
                                <div className="bg-yellow-50 p-4 rounded-xl">
                                    <p className="font-semibold text-yellow-800 mb-2">
                                        Ortsratssitzungen:
                                    </p>
                                    <p>
                                        Öffentliche Termine finden Sie unter
                                        &quot;Termine&quot;
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Thank You Note */}
                    <div className="text-center bg-gradient-to-r from-emerald-50 to-teal-50 rounded-3xl p-8 shadow-lg">
                        <h3 className="text-3xl font-bold text-emerald-700 mb-6">
                            Vielen Dank für Ihr Interesse!
                        </h3>
                        <p className="text-xl text-gray-700 font-medium mb-4">
                            Ihre Meinung und Ihre Anregungen helfen uns dabei,
                            Wendessen noch lebenswerter zu gestalten.
                        </p>
                        <div className="flex justify-center mt-6">
                            <div className="flex items-center space-x-2 text-emerald-600">
                                <Heart className="w-6 h-6" />
                                <span className="font-semibold">
                                    Gemeinsam gestalten wir die Zukunft von
                                    Wendessen
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
