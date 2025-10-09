import Image from 'next/image';
import {
    Heart,
    Buildings,
    Check,
    Globe,
    MapPin,
    FileText,
    Clock,
} from '@phosphor-icons/react/dist/ssr';

export const metadata = {
    title: 'Hospiz - Wohnen & Bauen in Wendessen',
    description:
        'Hospiz des Hospizvereins Wolfenbüttel im alten Gutshaus Wendessen. Um- und Ausbau des historischen Gebäudes für 10 Hospizgäste.',
};

export default function HospizPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 py-20 overflow-hidden">
                <div className="absolute inset-0 bg-[url('/images/Features/Hospiz.jpeg')] bg-cover bg-center opacity-30"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/90 to-blue-600/90"></div>

                <div className="relative z-10 container mx-auto px-4 text-center">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex items-center justify-center mb-6 gap-4 sm:gap-6">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full flex items-center justify-center shadow-2xl flex-shrink-0">
                                <Heart className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-purple-600" />
                            </div>
                            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white">
                                Hospiz
                            </h1>
                        </div>
                        <div className="w-32 h-2 bg-gradient-to-r from-yellow-400 to-white mx-auto mb-8"></div>
                        <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white/90 leading-relaxed max-w-3xl mx-auto">
                            Neues Zuhause im alten Gutshaus
                        </p>
                        <p className="text-base sm:text-lg md:text-xl text-yellow-200 font-semibold mt-4">
                            Hospizverein Wolfenbüttel • Historisches Gutshaus •
                            Ab 2024
                        </p>

                        {/* Decorative elements */}
                        <div className="hidden md:block absolute top-10 left-10 w-20 h-20 border-2 border-white/30 rounded-full animate-pulse"></div>
                        <div className="hidden md:block absolute bottom-10 right-10 w-16 h-16 border-2 border-yellow-400/50 rounded-full animate-pulse"></div>
                        <div className="hidden md:block absolute top-1/2 left-20 w-2 h-2 bg-white/40 rounded-full animate-bounce"></div>
                        <div className="hidden md:block absolute top-1/3 right-32 w-3 h-3 bg-yellow-400/60 rounded-full animate-bounce delay-300"></div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-5xl mx-auto">
                    {/* Introduction Section */}
                    <div className="text-center mb-16">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                            Ein Ort der Würde und Geborgenheit
                        </h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-blue-600 mx-auto mb-6"></div>
                        <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
                            Das historische Gutshaus wird zu einem modernen
                            Hospiz für Menschen in ihrer letzten Lebensphase
                        </p>
                    </div>

                    {/* Hospiz Image */}
                    <div className="mb-16">
                        <div className="bg-white rounded-3xl p-8 shadow-xl">
                            <div className="relative w-full mb-8">
                                <Image
                                    src="/images/Hospiz_Bau.webp"
                                    alt="Hospiz Bau - Altes Gutshaus Wendessen wird zum Hospiz umgebaut"
                                    width={1200}
                                    height={800}
                                    className="w-full h-auto rounded-2xl shadow-lg"
                                    priority
                                />
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2">
                                    <span className="text-sm font-medium text-gray-700">
                                        Hospiz im Bau
                                    </span>
                                </div>
                            </div>

                            <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-l-4 border-purple-500 p-6 rounded-r-2xl">
                                <h3 className="text-xl font-bold text-purple-800 mb-3 flex items-center">
                                    <Buildings className="w-6 h-6 mr-3" />
                                    Hospiz des Hospizvereins Wolfenbüttel
                                </h3>
                                <p className="text-lg text-gray-800 font-medium">
                                    Menschen, die aufgrund ihrer Symptome in
                                    ihrer vertrauten Umgebung nicht mehr
                                    versorgt werden können, finden künftig im
                                    Hospiz des Hospizvereins Wolfenbüttel ein
                                    neues Zuhause.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Project Details */}
                    <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl mb-16">
                        <div className="space-y-6 text-gray-700 leading-relaxed">
                            <p>
                                Zu diesem Zweck wird das alte Gutshaus im
                                Zentrum Wendessens um- und ausgebaut. Die großen
                                Terrassen und der Hausgarten können für
                                Aufenthalte der Hospizgäste genutzt werden. Für
                                Parkplätze gibt es eine ausreichend große
                                Fläche. Die Bushaltestelle ist in der Nähe.
                            </p>

                            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-500 p-6 rounded-2xl">
                                <h4 className="text-xl font-bold text-green-700 mb-3 flex items-center">
                                    <Buildings className="w-6 h-6 mr-2" />
                                    Ausstattung & Lage
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p>
                                            <strong>Kapazität:</strong> 10
                                            Hospizgäste
                                        </p>
                                        <p>
                                            <strong>Außenanlagen:</strong> Große
                                            Terrassen
                                        </p>
                                        <p>
                                            <strong>Garten:</strong> Hausgarten
                                            für Aufenthalte
                                        </p>
                                    </div>
                                    <div>
                                        <p>
                                            <strong>Parkplätze:</strong>{' '}
                                            Ausreichend große Fläche
                                        </p>
                                        <p>
                                            <strong>ÖPNV:</strong>{' '}
                                            Bushaltestelle in der Nähe
                                        </p>
                                        <p>
                                            <strong>Betrieb ab:</strong>{' '}
                                            Anfang/Mitte 2024
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Historical Background */}
                    <div className="mb-16">
                        <div className="text-center mb-12">
                            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                                Geschichte des Gutshauses
                            </h2>
                            <div className="w-24 h-1 bg-gradient-to-r from-amber-600 to-yellow-600 mx-auto mb-6"></div>
                            <p className="text-base sm:text-lg text-gray-600">
                                Über 360 Jahre Geschichte werden zu neuem Leben
                                erweckt
                            </p>
                        </div>

                        <div className="bg-white rounded-3xl p-8 shadow-xl">
                            <div className="space-y-6">
                                <div className="flex items-center space-x-4 p-4 bg-amber-50 rounded-xl border-l-4 border-amber-500">
                                    <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                                        1660
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-amber-800">
                                            Ursprüngliche Anlage
                                        </h4>
                                        <p className="text-gray-700">
                                            Das Gut wurde um 1660 angelegt
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4 p-4 bg-red-50 rounded-xl border-l-4 border-red-500">
                                    <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                                        1944
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-red-800">
                                            Kriegszerstörung & Wiederaufbau
                                        </h4>
                                        <p className="text-gray-700">
                                            Im Januar 1944 wurde das Haus durch
                                            Bomben zerstört und nach dem Krieg
                                            wiederaufgebaut
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-xl border-l-4 border-blue-500">
                                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                                        2001
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-blue-800">
                                            Eigentümerwechsel
                                        </h4>
                                        <p className="text-gray-700">
                                            Bis 2001 befand es sich im Besitz
                                            der Familie Seeliger, danach der
                                            Stadt Wolfenbüttel
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl border-l-4 border-gray-400">
                                    <div className="w-12 h-12 bg-gray-400 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                                        2017
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-700">
                                            Leerstand
                                        </h4>
                                        <p className="text-gray-700">
                                            Seit 2017 stand das Gutshaus leer,
                                            ohne Perspektive für die zukünftige
                                            Nutzung
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4 p-4 bg-purple-50 rounded-xl border-l-4 border-purple-500">
                                    <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                                        <Check className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-purple-800">
                                            Neue Perspektive -
                                            Erbbaurechtsvertrag
                                        </h4>
                                        <p className="text-gray-700">
                                            Mit dem Erbbaurechtsvertrag zwischen
                                            der Stadt Wolfenbüttel wurde die
                                            langfristige Nutzung ausschließlich
                                            als HospizZentrum festgeschrieben
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Features */}
                    <div className="mb-16">
                        <div className="text-center mb-12">
                            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                                Hospiz-Ausstattung
                            </h2>
                            <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-blue-600 mx-auto mb-6"></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-8 rounded-3xl shadow-lg text-center">
                                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Heart className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-purple-800 mb-3">
                                    Würdevolle Betreuung
                                </h3>
                                <p className="text-gray-700">
                                    10 Gäste können dauerhaft betreut und
                                    versorgt werden
                                </p>
                            </div>

                            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-3xl shadow-lg text-center">
                                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Globe className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-green-800 mb-3">
                                    Naturnahe Umgebung
                                </h3>
                                <p className="text-gray-700">
                                    Große Terrassen und Hausgarten für
                                    Aufenthalte im Freien
                                </p>
                            </div>

                            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-8 rounded-3xl shadow-lg text-center">
                                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <MapPin className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-blue-800 mb-3">
                                    Zentrale Lage
                                </h3>
                                <p className="text-gray-700">
                                    Im Zentrum Wendessens mit Bushaltestelle und
                                    Parkplätzen
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Legal Framework */}
                    <div className="mb-16">
                        <div className="bg-white rounded-3xl p-8 shadow-xl">
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 p-6 rounded-r-2xl">
                                <h3 className="text-xl font-bold text-blue-800 mb-3 flex items-center">
                                    <FileText className="w-6 h-6 mr-3" />
                                    Rechtliche Grundlage
                                </h3>
                                <p className="text-lg text-gray-800 font-medium">
                                    Mit dem Erbbaurechtsvertrag zwischen der
                                    Stadt Wolfenbüttel wurde die langfristige
                                    Nutzung ausschließlich als HospizZentrum
                                    festgeschrieben.
                                </p>
                                <div className="mt-4 bg-white border border-blue-200 p-4 rounded-xl">
                                    <p className="text-sm text-gray-700">
                                        <strong>Vertragspartner:</strong> Stadt
                                        Wolfenbüttel & Hospizverein Wolfenbüttel
                                        <br />
                                        <strong>Nutzung:</strong> Ausschließlich
                                        als HospizZentrum
                                        <br />
                                        <strong>Laufzeit:</strong> Langfristig
                                        über Erbbaurecht gesichert
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="mb-16">
                        <div className="text-center mb-12">
                            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                                Projektverlauf
                            </h2>
                            <div className="w-24 h-1 bg-gradient-to-r from-purple-600 to-blue-600 mx-auto mb-6"></div>
                        </div>

                        <div className="bg-white rounded-3xl p-8 shadow-xl">
                            <div className="space-y-6">
                                <div className="flex items-center space-x-4 p-4 bg-purple-50 rounded-xl border-l-4 border-purple-500">
                                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                                        <Check className="w-4 h-4 text-white" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-purple-800">
                                            Erbbaurechtsvertrag
                                        </h4>
                                        <p className="text-gray-700">
                                            Langfristige Nutzung als
                                            HospizZentrum vertraglich gesichert
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-xl border-l-4 border-blue-500">
                                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                        <Clock className="w-4 h-4 text-white" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-blue-800">
                                            2022-2024 - Umbauarbeiten
                                        </h4>
                                        <p className="text-gray-700">
                                            Um- und Ausbau des historischen
                                            Gutshauses zum modernen Hospiz
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-xl border-l-4 border-green-500">
                                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                        <Check className="w-4 h-4 text-white" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-green-800">
                                            Anfang/Mitte 2024 - Eröffnung
                                        </h4>
                                        <p className="text-gray-700">
                                            Hospiz nimmt Betrieb auf - 10 Gäste
                                            können betreut werden
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Closing Statement */}
                    <div className="text-center mt-16 bg-gradient-to-r from-purple-50 to-blue-50 rounded-3xl p-8 shadow-lg">
                        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-purple-700 mb-6">
                            Neues Leben für historische Mauern
                        </h3>
                        <p className="text-lg sm:text-xl text-gray-700 font-medium mb-4">
                            Das alte Gutshaus wird zu einem Ort der Würde,
                            Geborgenheit und professionellen Betreuung
                        </p>
                        <div className="flex justify-center mt-6">
                            <div className="flex items-center space-x-2 text-purple-600">
                                <Heart className="w-6 h-6" />
                                <span className="font-semibold">
                                    Hospizverein Wolfenbüttel
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
