import {
    Star,
    Calendar,
    Heart,
    FileText,
    Globe,
    User,
    Phone,
    EnvelopeSimple,
    Buildings,
    Clock,
} from '@phosphor-icons/react/dist/ssr';

import PageHeader from '@/app/components/PageHeader';

export const metadata = {
    title: 'Kirchengemeinde Ahlum-Atzum-Wendessen - Dorfleben',
    description:
        'Herzlich willkommen in der Kirchengemeinde Ahlum-Atzum-Wendessen. Gottesdienste, Veranstaltungen und Gemeinschaft.',
};

export default function KirchePage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
            <PageHeader
                title="Kirche"
                subtitle="Kirchengemeinde Ahlum-Atzum-Wendessen"
                icon={<Star />}
                backgroundImage="/images/Kirche.webp"
                color="purple"
            />

            {/* Main Content */}
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-5xl mx-auto">
                    {/* Welcome Section */}
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                            Herzlich Willkommen
                        </h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-blue-600 mx-auto mb-6"></div>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Wir freuen uns, Sie in unserer Kirchengemeinde
                            begrüßen zu können
                        </p>
                    </div>

                    {/* Welcome Message */}
                    <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl mb-16">
                        <div className="space-y-6 text-gray-700 leading-relaxed">
                            <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-l-4 border-purple-500 p-6 rounded-r-2xl">
                                <p className="text-lg">
                                    Für einen guten Anfang in Wendessen wünschen
                                    wir Ihnen und Ihrer Familie alles Gute und
                                    hoffen, dass Sie sich hier wohlfühlen
                                    werden.
                                </p>
                            </div>

                            <p>
                                Unsere Kirchengemeinde Ahlum-Atzum-Wendessen
                                umfasst die genannten drei Dörfer und gehört dem
                                Pfarrverband Maria von Magdala in Wolfenbüttel
                                und Sickte an.
                            </p>

                            <p>
                                Der Kirchenvorstand besteht aus gewählten und
                                berufenen Mitgliedern aller drei Orte und den in
                                der Gemeinde mit Aufgaben betreuten Pfarrern.
                            </p>

                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-500 p-6 rounded-2xl">
                                <h3 className="text-xl font-bold text-blue-700 mb-3">
                                    Unsere Seelsorger
                                </h3>
                                <p>
                                    Die Geschäftsführung hat Propst Dieter
                                    Schultz-Seitz inne. Amtshandlungen werden
                                    zur Zeit von Pfarrer Andreas Lichtblau /
                                    Salzdahlum durchgeführt. Pfarrer
                                    Schmidt-Pultke, Diakonin Silke Ehrenberg und
                                    Diakon Thomas Otte sind für den
                                    Konfirmandenunterricht verantwortlich.
                                </p>
                            </div>

                            <p>
                                In Ahlum, neben der Kirche, hat unsere
                                Kirchengemeinde die Trägerschaft über einen
                                3-gruppigen Kindergarten.
                            </p>
                        </div>
                    </div>

                    {/* Services Section */}
                    <div className="mb-16">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                                Gottesdienste & Angebote
                            </h2>
                            <div className="w-24 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 mx-auto mb-6"></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-8 rounded-3xl shadow-lg">
                                <h3 className="text-2xl font-bold text-purple-700 mb-6 flex items-center">
                                    <Calendar className="w-8 h-8 mr-3" />
                                    Sonntagsgottesdienste
                                </h3>
                                <div className="space-y-3 text-gray-700">
                                    <div className="bg-white p-4 rounded-xl border border-purple-200">
                                        <p className="font-semibold text-purple-800">
                                            Jeden Sonntag um 9:30 Uhr
                                        </p>
                                        <p className="text-sm">
                                            Reihum in den Kirchen der drei
                                            Dörfer
                                        </p>
                                    </div>
                                    <p>
                                        In der Gemeinde ist in der Regel an
                                        jedem Sonntag reihum in den Kirchen
                                        Gottesdienst. Zu den Feiertagen finden
                                        nach Möglichkeit in jedem Ort
                                        Gottesdienste statt.
                                    </p>
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-8 rounded-3xl shadow-lg">
                                <h3 className="text-2xl font-bold text-blue-700 mb-6 flex items-center">
                                    <Heart className="w-8 h-8 mr-3" />
                                    Taufen
                                </h3>
                                <div className="space-y-3 text-gray-700">
                                    <div className="bg-white p-4 rounded-xl border border-blue-200">
                                        <p className="font-semibold text-blue-800">
                                            Taufmöglichkeiten:
                                        </p>
                                        <ul className="text-sm mt-2 space-y-1">
                                            <li>• Samstags</li>
                                            <li>• Sonntags im Gottesdienst</li>
                                            <li>
                                                • Sonntags nach dem Gottesdienst
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Information Sources */}
                    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-3xl p-8 md:p-12 shadow-xl mb-16">
                        <div className="text-center mb-8">
                            <h3 className="text-3xl font-bold text-foreground mb-4">
                                Bleiben Sie informiert
                            </h3>
                            <div className="w-20 h-1 bg-gradient-to-r from-yellow-600 to-orange-600 mx-auto"></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <h4 className="text-xl font-semibold text-orange-800 mb-4 flex items-center">
                                    <FileText className="w-6 h-6 mr-3" />
                                    Gemeindebrief
                                </h4>
                                <div className="bg-white p-4 rounded-xl border border-orange-200">
                                    <p className="text-gray-700">
                                        Der Gemeindebrief erscheint viermal im
                                        Jahr und wird in jeden Haushalt
                                        verteilt. Aktuelle Informationen finden
                                        Sie auch im Schaukasten vor der Kirche.
                                    </p>
                                </div>
                            </div>

                            <div>
                                <h4 className="text-xl font-semibold text-orange-800 mb-4 flex items-center">
                                    <Globe className="w-6 h-6 mr-3" />
                                    Online
                                </h4>
                                <div className="bg-white p-4 rounded-xl border border-orange-200">
                                    <p className="text-gray-700 mb-2">
                                        Besuchen Sie uns im Internet:
                                    </p>
                                    <a
                                        href="http://www.ahlum-atzum-wendessen-evangelisch.de"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-800 underline"
                                    >
                                        www.ahlum-atzum-wendessen-evangelisch.de
                                    </a>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 text-center">
                            <div className="bg-gradient-to-r from-purple-100 to-blue-100 p-6 rounded-2xl border-2 border-purple-300">
                                <p className="text-lg text-gray-700 font-medium">
                                    Zu allen Gottesdiensten und Veranstaltungen
                                    laden wir Sie ganz herzlich ein!
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Section */}
                    <div className="text-center mb-12">
                        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                            Ansprechpartner
                        </h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-blue-600 mx-auto mb-6"></div>
                        <p className="text-lg text-gray-600">
                            Wenn Sie uns brauchen oder mitmachen wollen
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {/* Vakanzvertretung */}
                        <div className="bg-white rounded-3xl p-8 shadow-xl border-l-4 border-purple-500">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 flex-shrink-0">
                                    <User className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-foreground mb-2">
                                    Vakanzvertretung
                                </h3>
                                <p className="text-lg font-semibold text-purple-600 mb-4">
                                    Propst Dieter Schultz-Seitz
                                </p>
                                <div className="space-y-3 text-gray-600">
                                    <div className="flex items-center justify-center space-x-2">
                                        <Phone className="w-5 h-5 text-purple-500" />
                                        <a
                                            href="tel:05331972830"
                                            className="text-purple-600 hover:text-purple-800 transition-colors"
                                        >
                                            05331 / 972830
                                        </a>
                                    </div>
                                    <div className="flex items-center justify-center space-x-2">
                                        <EnvelopeSimple className="w-5 h-5 text-purple-500" />
                                        <a
                                            href="mailto:dieter.schultz-seitz@lk-bs.de"
                                            className="text-purple-600 hover:text-purple-800 transition-colors"
                                        >
                                            dieter.schultz-seitz@lk-bs.de
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Kirchenbüro */}
                        <div className="bg-white rounded-3xl p-8 shadow-xl border-l-4 border-blue-500">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 flex-shrink-0">
                                    <Buildings className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-foreground mb-2">
                                    Kirchenbüro
                                </h3>
                                <p className="text-lg font-semibold text-blue-600 mb-4">
                                    Christine Spilleke
                                </p>
                                <div className="space-y-3 text-gray-600 text-sm">
                                    <div className="bg-blue-50 p-3 rounded-lg">
                                        <p className="font-medium">
                                            Adenemer Weg 14
                                        </p>
                                        <p>38302 Wolfenbüttel / Ahlum</p>
                                    </div>
                                    <div className="flex items-center justify-center space-x-2">
                                        <Phone className="w-4 h-4 text-blue-500" />
                                        <a
                                            href="tel:0533171875"
                                            className="text-blue-600 hover:text-blue-800 transition-colors"
                                        >
                                            05331 / 71875
                                        </a>
                                    </div>
                                    <div className="flex items-center justify-center space-x-2">
                                        <Clock className="w-4 h-4 text-blue-500" />
                                        <span className="text-gray-600">
                                            Fax: 05331 / 340224
                                        </span>
                                    </div>
                                    <div className="bg-blue-50 p-3 rounded-lg">
                                        <p className="font-medium text-blue-800">
                                            Öffnungszeiten:
                                        </p>
                                        <p>Montag, Dienstag und Donnerstag</p>
                                        <p>10:00 - 12:00 Uhr</p>
                                    </div>
                                    <div className="flex items-center justify-center space-x-2">
                                        <EnvelopeSimple className="w-4 h-4 text-blue-500" />
                                        <a
                                            href="mailto:ahlum.buero@lk-bs.de"
                                            className="text-blue-600 hover:text-blue-800 transition-colors"
                                        >
                                            ahlum.buero@lk-bs.de
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Additional Info */}
                    <div className="mt-16 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-3xl p-8 shadow-lg">
                        <div className="text-center">
                            <h3 className="text-2xl font-bold text-indigo-700 mb-4">
                                Persönlicher Kontakt
                            </h3>
                            <p className="text-gray-700 leading-relaxed">
                                Außerhalb der Öffnungszeiten kann es sein, dass
                                Sie auf unseren Anrufbeantworter treffen -
                                sprechen Sie ruhig drauf, wir rufen Sie sobald
                                wie möglich zurück.
                            </p>
                            <div className="mt-6 bg-white p-4 rounded-xl border border-indigo-200">
                                <p className="text-indigo-800 font-medium">
                                    Die Mitglieder unseres Besuchskreises machen
                                    auch Besuche im Haus. Wenn wir einmal vor
                                    der Tür stehen, dann um Ihnen persönlich
                                    &quot;Guten Tag&quot; zu sagen. Wir freuen
                                    uns auf ein persönliches Kennenlernen.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Closing Statement */}
                    <div className="text-center mt-16 bg-gradient-to-r from-purple-50 to-blue-50 rounded-3xl p-8 shadow-lg">
                        <h3 className="text-3xl font-bold text-purple-700 mb-6">
                            Ihre Kirchengemeinde Ahlum-Atzum-Wendessen
                        </h3>
                        <p className="text-xl text-gray-700 font-medium">
                            Glaube verbindet - Gemeinschaft stärkt
                        </p>
                        <div className="flex justify-center mt-6">
                            <div className="flex items-center space-x-2 text-purple-600">
                                <Star className="w-6 h-6" fill="currentColor" />
                                <span className="font-semibold">
                                    Willkommen in unserer Gemeinschaft
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
