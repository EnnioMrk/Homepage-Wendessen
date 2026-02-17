import {
    Buildings,
    MapPin,
    Wrench,
    UsersThree,
    CheckCircle,
    Clock,
    Heart,
    Calendar,
} from '@phosphor-icons/react/dist/ssr';
import PageHeader from '@/app/components/layout/PageHeader';

export const metadata = {
    title: 'Feuerwehrgerätehaus - Wohnen & Bauen in Wendessen',
    description:
        'Neues Feuerwehrgerätehaus in Wendessen am Eckgrundstück Leipziger Allee / Ahlumer Weg. Moderne Unterbringung für unsere Freiwillige Feuerwehr.',
};

export default function FeuerwehrgeraetehausPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
            {/* Hero Section */}
            <PageHeader
                title="Feuerwehrgerätehaus"
                subtitle="Neue Heimat für unsere Feuerwehr"
                icon={<Buildings />}
                backgroundImage="/images/Vereinsleben/Freiwillige_Feuerwehr.jpeg"
                color="red"
            />

            {/* Main Content */}
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-5xl mx-auto">
                    {/* Introduction Section */}
                    <div className="text-center mb-16">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                            Endlich eine neue Heimat
                        </h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-red-600 to-orange-600 mx-auto mb-6"></div>
                        <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
                            Nach vielen Jahren in unzureichender Unterbringung
                            erhält unsere Feuerwehr ein modernes Gerätehaus
                        </p>
                    </div>

                    {/* Project Overview */}
                    <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl mb-16">
                        <div className="space-y-6 text-gray-700 leading-relaxed">
                            <div className="bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 p-6 rounded-r-2xl">
                                <h3 className="text-xl font-bold text-red-800 mb-3 flex items-center">
                                    <MapPin className="w-6 h-6 mr-3" />
                                    Neues Feuerwehrgerätehaus am Eckgrundstück
                                </h3>
                                <p className="text-lg">
                                    In Wendessen entsteht auf dem Eckgrundstück
                                    Ahlumer Weg/ Leipziger Allee ein
                                    Feuerwehrhaus - das erste in der langen
                                    Geschichte der Freiwilligen Feuerwehr, die
                                    seit Jahrzehnten mehr recht als schlecht in
                                    der ehemaligen alten Schule am Kirchring
                                    untergebracht ist.
                                </p>
                            </div>

                            <p>
                                Das neue Haus wird Platz für die aktuell über 60
                                aktiven Feuerwehrleute (darunter auch die
                                Mitglieder der Kinder- und Jugendfeuerwehr)
                                sowie für zwei Fahrzeuge bieten. Vorgesehen ist
                                die Errichtung eines 2-geschossigen Gebäudes in
                                Massivbauweise mit einem Satteldach und einer
                                Photovoltaikanlage.
                            </p>

                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-500 p-6 rounded-2xl">
                                <h4 className="text-xl font-bold text-blue-700 mb-3 flex items-center">
                                    <Calendar className="w-6 h-6 mr-2" />
                                    Bauphase & Fertigstellung
                                </h4>
                                <p className="mb-2">
                                    Mit den ersten Maßnahmen (Herstellen des
                                    Grundstückes) wurde nach langer Planung im
                                    Herbst 2025 begonnen.
                                </p>
                                <p>
                                    <strong>Spatenstich:</strong> Februar 2026
                                    <br />
                                    <strong>Budget:</strong> 4,5 Millionen Euro
                                    (Stadt Wolfenbüttel)
                                    <br />
                                    <strong>Fertigstellung:</strong> 2. Quartal
                                    2027
                                </p>
                            </div>

                            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-500 p-6 rounded-r-2xl">
                                <div className="flex items-start space-x-3">
                                    <Buildings className="w-6 h-6 text-yellow-600 mt-1 flex-shrink-0" />
                                    <div>
                                        <h4 className="font-bold text-yellow-800 mb-2">
                                            Aktuelle Situation
                                        </h4>
                                        <p className="text-gray-700">
                                            Die bisherige Unterbringung in der
                                            Alten Schule entspricht seit Jahren
                                            nicht mehr den modernen
                                            Anforderungen an ein
                                            Feuerwehrgerätehaus. Der Neubau wird
                                            zeitgemäße Bedingungen für unsere
                                            ehrenamtlichen Feuerwehrleute
                                            schaffen.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Location Features */}
                    <div className="mb-16">
                        <div className="text-center mb-12">
                            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                                Standort & Vorteile
                            </h2>
                            <div className="w-24 h-1 bg-gradient-to-r from-red-600 to-orange-600 mx-auto mb-6"></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="bg-gradient-to-br from-red-50 to-orange-50 p-8 rounded-3xl shadow-lg text-center">
                                <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <MapPin className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-red-800 mb-3">
                                    Zentrale Lage
                                </h3>
                                <p className="text-gray-700">
                                    Eckgrundstück Leipziger Allee / Ahlumer Weg
                                    - optimal für schnelle Einsatzbereitschaft
                                </p>
                            </div>

                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-3xl shadow-lg text-center">
                                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Wrench className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-blue-800 mb-3">
                                    Moderne Ausstattung
                                </h3>
                                <p className="text-gray-700">
                                    Neubau nach aktuellen Standards mit
                                    zeitgemäßer Fahrzeughalle und Ausrüstung
                                </p>
                            </div>

                            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-3xl shadow-lg text-center">
                                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <UsersThree className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-green-800 mb-3">
                                    Bessere Bedingungen
                                </h3>
                                <p className="text-gray-700">
                                    Angemessene Räumlichkeiten für Training,
                                    Ausbildung und Kameradschaft
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Additional Development */}
                    <div className="mb-16">
                        <div className="text-center mb-12">
                            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                                Weitere Entwicklung
                            </h2>
                            <div className="w-24 h-1 bg-gradient-to-r from-emerald-600 to-teal-600 mx-auto mb-6"></div>
                            <p className="text-base sm:text-lg text-gray-600">
                                Zusätzliche Wohnprojekte in der Nähe
                            </p>
                        </div>

                        <div className="bg-white rounded-3xl p-8 shadow-xl">
                            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border-l-4 border-emerald-500 p-6 rounded-r-2xl">
                                <h3 className="text-xl font-bold text-emerald-800 mb-3 flex items-center">
                                    <Buildings className="w-6 h-6 mr-3" />
                                    Mehrfamilienhaus zwischen
                                    Feuerwehrgerätehaus und Hotel Gala
                                </h3>
                                <div className="space-y-4">
                                    <p className="text-lg text-gray-800">
                                        Zwischen dem künftigen
                                        Feuerwehrgerätehaus und dem ehemaligen
                                        Hotel Gala errichtet ein privater
                                        Investor aktuell ein Mehrfamilienhaus.
                                    </p>
                                    <div className="bg-white border border-emerald-200 p-4 rounded-xl">
                                        <h4 className="font-bold text-emerald-700 mb-2">
                                            Projektdetails:
                                        </h4>
                                        <ul className="space-y-1 text-gray-700">
                                            <li>
                                                • <strong>6 Wohnungen</strong> à
                                                90 Quadratmeter
                                            </li>
                                            <li>
                                                • <strong>Erste Mieter:</strong>{' '}
                                                Anfang 2024
                                            </li>
                                            <li>
                                                • <strong>Investor:</strong>{' '}
                                                Privat
                                            </li>
                                            <li>
                                                • <strong>Status:</strong>{' '}
                                                Aktuell im Bau
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="mb-16">
                        <div className="text-center mb-12">
                            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                                Zeitplan
                            </h2>
                            <div className="w-24 h-1 bg-gradient-to-r from-red-600 to-orange-600 mx-auto mb-6"></div>
                        </div>

                        <div className="bg-white rounded-3xl p-8 shadow-xl">
                            <div className="space-y-6">
                                <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-xl border-l-4 border-green-500">
                                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                        <CheckCircle className="w-4 h-4 text-white" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-green-800">
                                            2021 - Grundstückserwerb
                                        </h4>
                                        <p className="text-gray-700">
                                            Stadt Wolfenbüttel erwirbt
                                            Eckgrundstück Leipziger Allee /
                                            Ahlumer Weg
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-xl border-l-4 border-blue-500">
                                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                        <Clock className="w-4 h-4 text-white" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-blue-800">
                                            2022-2024 - Planungsphase
                                        </h4>
                                        <p className="text-gray-700">
                                            Projekt steht an 2. Stelle in der
                                            Stadtplanung nach Halchter
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4 p-4 bg-yellow-50 rounded-xl border-l-4 border-yellow-500">
                                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                                        <Wrench className="w-4 h-4 text-white" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-yellow-800">
                                            2025-2026 - Baubeginn
                                        </h4>
                                        <p className="text-gray-700">
                                            Herbst &apos;25:
                                            Grundstücksvorbereitung | Feb
                                            &apos;26: Spatenstich
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl border-l-4 border-gray-400">
                                    <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center">
                                        <Buildings className="w-4 h-4 text-white" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-700">
                                            2027 - Fertigstellung
                                        </h4>
                                        <p className="text-gray-700">
                                            Geplant für 2. Quartal 2027
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Closing Statement */}
                    <div className="text-center mt-16 bg-gradient-to-r from-red-50 to-orange-50 rounded-3xl p-8 shadow-lg">
                        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-red-700 mb-6">
                            Eine neue Ära für unsere Feuerwehr!
                        </h3>
                        <p className="text-lg sm:text-xl text-gray-700 font-medium mb-4">
                            Nach Jahren in unzureichender Unterbringung endlich
                            moderne Bedingungen für unsere Helden
                        </p>
                        <div className="flex justify-center mt-6">
                            <div className="flex items-center space-x-2 text-red-600">
                                <Heart className="w-6 h-6" />
                                <span className="font-semibold">
                                    Für die Sicherheit von Wendessen
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
