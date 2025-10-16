import Image from 'next/image';
import {
    Users,
    Cross,
    Presentation,
    Brain,
    Scissors,
    MapTrifold,
    ShieldCheck,
    Heart,
    CalendarBlank,
    CurrencyDollar,
    User,
    Phone,
    MapPin,
    HandHeart,
} from '@phosphor-icons/react/dist/ssr';

export const metadata = {
    title: 'Evang. Frauenhilfe Wendessen - Dorfleben',
    description:
        'Evangelische Frauenhilfe Wendessen - Gegründet 1917. Frauen auf dem Boden christlichen Glaubens zusammenführen. Treffen jeden 3. Mittwoch im Monat.',
};

export default function FrauenhilfePage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-r from-pink-600 via-rose-500 to-fuchsia-600 py-20 overflow-hidden">
                <div className="absolute inset-0 bg-[url('/images/Vereinsleben/frauenhilfe.jpg')] bg-cover bg-center opacity-30"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-pink-600/90 to-fuchsia-600/90"></div>

                <div className="relative z-10 container mx-auto px-4 text-center">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex items-center justify-center mb-6">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-full flex items-center justify-center shadow-2xl mr-4 sm:mr-6 flex-shrink-0">
                                <Cross className="w-8 h-8 sm:w-12 sm:h-12 text-pink-600" />
                            </div>
                            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white leading-tight">
                                Evang. Frauenhilfe
                            </h1>
                        </div>
                        <div className="w-32 h-2 bg-gradient-to-r from-rose-400 to-white mx-auto mb-8"></div>
                        <p className="text-2xl md:text-3xl text-white/90 leading-relaxed max-w-3xl mx-auto">
                            Wendessen
                        </p>
                        <p className="text-xl text-rose-200 font-semibold mt-4">
                            Seit 1917 • Glaube • Gemeinschaft • Verantwortung
                        </p>

                        {/* Decorative elements - hidden on mobile */}
                        <div className="hidden md:block absolute top-10 left-10 w-20 h-20 border-2 border-white/30 rounded-full animate-pulse"></div>
                        <div className="hidden md:block absolute bottom-10 right-10 w-16 h-16 border-2 border-rose-400/50 rounded-full animate-pulse"></div>
                        <div className="hidden md:block absolute top-1/2 left-20 w-2 h-2 bg-white/40 rounded-full animate-bounce"></div>
                        <div className="hidden md:block absolute top-1/3 right-32 w-3 h-3 bg-rose-400/60 rounded-full animate-bounce delay-300"></div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-5xl mx-auto">
                    {/* Hero Image Section */}
                    <div className="text-center mb-16">
                        <div className="relative w-full h-96 md:h-[500px] rounded-3xl overflow-hidden shadow-2xl border-4 border-pink-100">
                            <Image
                                src="/images/Vereinsleben/frauenhilfe.jpg"
                                alt="Evangelische Frauenhilfe Wendessen"
                                fill
                                className="object-cover"
                                priority
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                <h2 className="text-3xl font-bold mb-2">
                                    Gegründet 28. Mai 1917
                                </h2>
                                <p className="text-lg">
                                    Über 100 Jahre christliche Frauengemeinschaft
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Introduction */}
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                            Herzlich willkommen!
                        </h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-pink-600 to-fuchsia-600 mx-auto mb-6"></div>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Frauen auf dem Boden christlichen Glaubens zusammenführen
                        </p>
                    </div>

                    {/* About Us */}
                    <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl mb-16">
                        <div className="space-y-8">
                            {/* Membership */}
                            <div className="bg-gradient-to-r from-pink-50 to-rose-50 border-l-4 border-pink-500 p-6 rounded-r-2xl">
                                <h3 className="text-xl font-semibold text-pink-800 mb-3 flex items-center">
                                    <Users className="w-6 h-6 mr-2" />
                                    Unsere Gemeinschaft
                                </h3>
                                <p className="text-lg text-pink-800 mb-3">
                                    Zur Zeit haben wir <strong>23 Mitglieder</strong>. 
                                    Der Beitrag beträgt <strong>20,00 EUR jährlich</strong>, 
                                    davon werden Beiträge an den Kreis- und Landesverband geleistet.
                                </p>
                                <p className="text-lg text-pink-800">
                                    Außerdem wird ein <strong>Patenkind in Indien</strong> unterstützt.
                                </p>
                            </div>

                            {/* Meeting Information */}
                            <div className="bg-gradient-to-r from-purple-50 to-fuchsia-50 border-l-4 border-purple-500 p-6 rounded-r-2xl">
                                <h3 className="text-xl font-semibold text-purple-800 mb-3 flex items-center">
                                    <CalendarBlank className="w-6 h-6 mr-2" />
                                    Unsere Treffen
                                </h3>
                                <p className="text-lg text-purple-800 mb-3">
                                    Monatliche Treffen finden auf dem{' '}
                                    <strong>"Hans-Meves-Hof"</strong>, Dorfstr. 19, 
                                    38300 WF-Wendessen statt.
                                </p>
                                <p className="text-lg text-purple-800 font-semibold">
                                    Jeden 3. Mittwoch im Monat um 15:00 Uhr
                                </p>
                            </div>

                            {/* Mission Statement */}
                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 p-6 rounded-r-2xl">
                                <h3 className="text-xl font-semibold text-blue-800 mb-3 flex items-center">
                                    <Heart className="w-6 h-6 mr-2" />
                                    Aus unserer Satzung
                                </h3>
                                <p className="text-lg text-blue-800 italic">
                                    "Der Verein will Frauen auf dem Boden christlichen 
                                    Glaubens zusammenführen, sie in der Nachfolge Jesu 
                                    Christi stärken und ihnen bei der Wahrnehmung ihrer 
                                    Verantwortung in Familie, Gemeinde und Gesellschaft helfen."
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Activities Section */}
                    <div className="mb-16">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                                Unsere Themen
                            </h2>
                            <div className="w-24 h-1 bg-gradient-to-r from-rose-600 to-pink-600 mx-auto mb-6"></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {/* Christian Presentations */}
                            <div className="bg-gradient-to-br from-pink-50 to-rose-50 p-8 rounded-3xl shadow-lg text-center">
                                <div className="w-16 h-16 bg-gradient-to-r from-pink-600 to-rose-600 rounded-full flex items-center justify-center mx-auto mb-6 flex-shrink-0">
                                    <Presentation className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-pink-700 mb-3">
                                    Vorträge
                                </h3>
                                <p className="text-gray-700">
                                    Vorträge zu christlichen und sozialen Themen
                                </p>
                            </div>

                            {/* Memory Training */}
                            <div className="bg-gradient-to-br from-purple-50 to-fuchsia-50 p-8 rounded-3xl shadow-lg text-center">
                                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-fuchsia-600 rounded-full flex items-center justify-center mx-auto mb-6 flex-shrink-0">
                                    <Brain className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-purple-700 mb-3">
                                    Gedächtnistraining
                                </h3>
                                <p className="text-gray-700">
                                    Geistig fit bleiben durch regelmäßiges Training
                                </p>
                            </div>

                            {/* Crafts */}
                            <div className="bg-gradient-to-br from-rose-50 to-pink-50 p-8 rounded-3xl shadow-lg text-center">
                                <div className="w-16 h-16 bg-gradient-to-r from-rose-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 flex-shrink-0">
                                    <Scissors className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-rose-700 mb-3">
                                    Basteln
                                </h3>
                                <p className="text-gray-700">
                                    Kreative Aktivitäten und handwerkliche Arbeiten
                                </p>
                            </div>

                            {/* Trips */}
                            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-8 rounded-3xl shadow-lg text-center">
                                <div className="w-16 h-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 flex-shrink-0">
                                    <MapTrifold className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-indigo-700 mb-3">
                                    Fahrten & Reiseberichte
                                </h3>
                                <p className="text-gray-700">
                                    Gemeinsame Ausflüge und spannende Reiseberichte
                                </p>
                            </div>

                            {/* Safety */}
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-3xl shadow-lg text-center">
                                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 flex-shrink-0">
                                    <ShieldCheck className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-blue-700 mb-3">
                                    Sicherheit im Alltag
                                </h3>
                                <p className="text-gray-700">
                                    Praktische Tipps für ein sicheres Leben
                                </p>
                            </div>

                            {/* Social Gathering */}
                            <div className="bg-gradient-to-br from-fuchsia-50 to-pink-50 p-8 rounded-3xl shadow-lg text-center">
                                <div className="w-16 h-16 bg-gradient-to-r from-fuchsia-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 flex-shrink-0">
                                    <Heart className="w-8 h-8 text-white" />
                                </div>
                                <h3 className="text-xl font-bold text-fuchsia-700 mb-3">
                                    Geselliges Beisammensein
                                </h3>
                                <p className="text-gray-700">
                                    Gemeinschaft und Austausch in netter Atmosphäre
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Social Commitment */}
                    <div className="bg-gradient-to-r from-rose-50 to-pink-50 rounded-3xl p-8 md:p-12 shadow-xl mb-16">
                        <div className="text-center mb-8">
                            <h3 className="text-3xl font-bold text-foreground mb-4">
                                Soziales Engagement
                            </h3>
                            <div className="w-20 h-1 bg-gradient-to-r from-rose-600 to-pink-600 mx-auto mb-6"></div>
                        </div>

                        <div className="max-w-2xl mx-auto">
                            <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
                                <div className="w-20 h-20 bg-gradient-to-r from-rose-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 flex-shrink-0">
                                    <HandHeart className="w-10 h-10 text-white" />
                                </div>
                                <h4 className="text-2xl font-semibold text-pink-800 mb-4">
                                    Patenschaft in Indien
                                </h4>
                                <p className="text-lg text-gray-700">
                                    Mit einem Teil unserer Beiträge unterstützen wir ein{' '}
                                    <strong>Patenkind in Indien</strong>. So leisten wir 
                                    einen wertvollen Beitrag für eine bessere Zukunft.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Section */}
                    <div className="text-center mb-12">
                        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                            Ansprechpartnerin
                        </h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-pink-600 to-rose-600 mx-auto mb-6"></div>
                        <p className="text-lg text-gray-600">
                            Ihre Kontaktperson für alle Fragen
                        </p>
                    </div>

                    <div className="max-w-2xl mx-auto">
                        {/* Contact Person */}
                        <div className="bg-white rounded-3xl p-8 shadow-xl border-l-4 border-pink-500">
                            <div className="text-center">
                                <div className="w-20 h-20 bg-gradient-to-r from-pink-600 to-rose-600 rounded-full flex items-center justify-center mx-auto mb-6 flex-shrink-0">
                                    <User className="w-10 h-10 text-white" />
                                </div>
                                <p className="text-sm font-semibold text-pink-600 uppercase tracking-wide mb-2">
                                    1. Vorsitzende
                                </p>
                                <h3 className="text-2xl font-bold text-foreground mb-4">
                                    Sigrid Haasner
                                </h3>
                                <div className="space-y-3">
                                    <div className="bg-gradient-to-r from-pink-50 to-rose-50 p-4 rounded-xl">
                                        <div className="flex items-center justify-center text-pink-600">
                                            <MapPin className="w-5 h-5 mr-2" />
                                            <div className="text-left">
                                                <p>Bäckergasse 1</p>
                                                <p>38300 Wolfenbüttel</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-gradient-to-r from-pink-50 to-rose-50 p-4 rounded-xl">
                                        <a
                                            href="tel:0533163531"
                                            className="flex items-center justify-center text-pink-600 hover:text-pink-700 transition-colors"
                                        >
                                            <Phone className="w-5 h-5 mr-2" />
                                            05331 / 63531
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Closing Statement */}
                    <div className="text-center mt-16 bg-gradient-to-r from-pink-50 to-rose-50 rounded-3xl p-8 shadow-lg">
                        <h3 className="text-3xl font-bold text-pink-700 mb-6">
                            Werden Sie Teil unserer Gemeinschaft!
                        </h3>
                        <p className="text-xl text-gray-700 font-medium mb-4">
                            Wir freuen uns über neue Mitglieder!
                        </p>
                        <div className="flex justify-center">
                            <div className="flex items-center space-x-2 text-pink-600">
                                <Cross className="w-6 h-6" />
                                <span className="font-semibold">
                                    Jeden 3. Mittwoch im Monat, 15:00 Uhr
                                </span>
                                <Heart className="w-6 h-6" />
                            </div>
                        </div>
                        <p className="text-gray-600 mt-4 text-sm">
                            Hans-Meves-Hof, Dorfstr. 19, 38300 WF-Wendessen
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
