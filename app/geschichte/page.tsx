import { BookOpen } from '@phosphor-icons/react/dist/ssr';
import Image from 'next/image';
import PageHeader from '@/app/components/layout/PageHeader';

export const metadata = {
    title: 'Geschichte - Wendessen',
    description:
        'Die Geschichte von Wendessen - Von der ersten urkundlichen Erwähnung 1170 als Winedissen bis heute. Chronik eines Dorfes mit über 850 Jahren Geschichte.',
};

export default function GeschichtePage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
            {/* Hero Section */}
            <PageHeader
                title="Geschichte"
                subtitle="850+ Jahre Wendessen — Von Winedissen zu Wendessen (1170 bis heute)"
                icon={<BookOpen />}
                backgroundImage="/images/Wendessen_Luftaufnahme.jpg"
                color="amber"
            />

            {/* Main Content */}
            <div className="container mx-auto px-4 py-20">
                <div className="max-w-6xl mx-auto">
                    {/* Introduction */}
                    <div className="text-center mb-20">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
                            Eine Reise durch die Zeit
                        </h2>
                        <div className="w-32 h-2 bg-gradient-to-r from-amber-600 to-orange-600 mx-auto mb-8"></div>
                        <p className="text-lg sm:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
                            Entdecken Sie die faszinierende Geschichte unseres
                            Dorfes - von der ersten urkundlichen Erwähnung bis
                            zur Gegenwart
                        </p>
                    </div>

                    {/* Name Evolution */}
                    <div className="mb-20">
                        <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-4xl p-10 shadow-2xl border-l-8 border-amber-500">
                            <div className="text-center mb-12">
                                <h3 className="text-4xl font-bold text-amber-800 mb-4">
                                    Die Entwicklung des Ortsnamens
                                </h3>
                                <div className="w-24 h-1 bg-amber-600 mx-auto mb-6"></div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
                                    <div className="text-3xl font-bold text-amber-700 mb-2">
                                        Winedissen
                                    </div>
                                    <div className="text-xl font-semibold text-gray-800">
                                        1170
                                    </div>
                                    <div className="text-sm text-gray-600 mt-2">
                                        Erste urkundliche Erwähnung
                                    </div>
                                </div>
                                <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
                                    <div className="text-3xl font-bold text-amber-700 mb-2">
                                        Winethissem
                                    </div>
                                    <div className="text-xl font-semibold text-gray-800">
                                        um 1200
                                    </div>
                                </div>
                                <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
                                    <div className="text-3xl font-bold text-amber-700 mb-2">
                                        Wenethessen
                                    </div>
                                    <div className="text-xl font-semibold text-gray-800">
                                        1292
                                    </div>
                                </div>
                                <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
                                    <div className="text-3xl font-bold text-amber-700 mb-2">
                                        Wendessem
                                    </div>
                                    <div className="text-xl font-semibold text-gray-800">
                                        um 1300
                                    </div>
                                </div>
                                <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
                                    <div className="text-3xl font-bold text-amber-700 mb-2">
                                        Wendessum
                                    </div>
                                    <div className="text-xl font-semibold text-gray-800">
                                        1358
                                    </div>
                                </div>
                                <div className="bg-white p-6 rounded-2xl shadow-lg text-center border-4 border-amber-400">
                                    <div className="text-3xl font-bold text-amber-700 mb-2">
                                        Wendessen
                                    </div>
                                    <div className="text-xl font-semibold text-gray-800">
                                        ab 1350
                                    </div>
                                    <div className="text-sm text-amber-600 mt-2 font-medium">
                                        bis heute
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Historical Timeline */}
                    <div className="mb-20">
                        <div className="text-center mb-16">
                            <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6">
                                Historische Ereignisse
                            </h3>
                            <div className="w-32 h-2 bg-gradient-to-r from-amber-600 to-orange-600 mx-auto mb-8"></div>
                            <p className="text-base sm:text-lg text-gray-600">
                                Die wichtigsten Meilensteine in der Geschichte
                                Wendessens
                            </p>
                        </div>{' '}
                        <div className="space-y-8">
                            {/* 1218 - Patronatsrechte */}
                            <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6 bg-white rounded-3xl p-6 sm:p-8 shadow-xl">
                                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 mx-auto sm:mx-0">
                                    1218
                                </div>
                                <div className="text-center sm:text-left">
                                    <h4 className="text-xl sm:text-2xl font-bold text-blue-800 mb-3">
                                        Kaiserliche Schenkung
                                    </h4>
                                    <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                                        Am 12. Mai 1218 schenkte Kaiser Otto IV.
                                        dem Stift St. Blasii zu Braunschweig die
                                        Patronatsrechte, unter anderem auch über
                                        Wendessen.
                                    </p>
                                </div>
                            </div>

                            {/* Wars and Destruction */}
                            <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6 bg-white rounded-3xl p-6 sm:p-8 shadow-xl">
                                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-red-500 to-red-700 rounded-full flex items-center justify-center text-white font-bold text-xs flex-shrink-0 mx-auto sm:mx-0">
                                    1493-1627
                                </div>
                                <div className="text-center sm:text-left">
                                    <h4 className="text-xl sm:text-2xl font-bold text-red-800 mb-3">
                                        Kriege und Zerstörung
                                    </h4>
                                    <div className="space-y-3 text-gray-700">
                                        <p>
                                            <strong>1493:</strong> Wendessen
                                            wurde von den Braunschweigern
                                            geplündert
                                        </p>
                                        <p>
                                            <strong>1542:</strong> Im
                                            Schmalkaldischen Krieg wurde das
                                            Pfarrhaus von den Schmalkalden
                                            zerstört
                                        </p>
                                        <p>
                                            <strong>19. Juni 1550:</strong>{' '}
                                            Überfall der Stadt Braunschweig auf
                                            Wendessen
                                        </p>
                                        <p>
                                            <strong>1627:</strong> Das Dorf wird
                                            im 30-jährigen Krieg von den Dänen
                                            zerstört und niedergebrannt
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Gut Geschichte */}
                            <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6 bg-white rounded-3xl p-6 sm:p-8 shadow-xl">
                                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 mx-auto sm:mx-0">
                                    1660
                                </div>
                                <div className="text-center sm:text-left">
                                    <h4 className="text-xl sm:text-2xl font-bold text-green-800 mb-3">
                                        Das Gut Wendessen
                                    </h4>
                                    <div className="bg-green-50 p-4 rounded-xl">
                                        <p className="text-lg text-gray-700 mb-3">
                                            <strong>1660:</strong> Das Gut wurde
                                            gebaut
                                        </p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                                            <div>
                                                <p>
                                                    <strong>1736:</strong>{' '}
                                                    Fürstliches Kammergut
                                                </p>
                                                <p>
                                                    <strong>1772:</strong> Kauf
                                                    durch Amtsrat Müller
                                                </p>
                                            </div>
                                            <div>
                                                <p>
                                                    <strong>1864-2001:</strong>{' '}
                                                    Besitz Familie Seeliger
                                                </p>
                                                <p>
                                                    <strong>Heute:</strong>{' '}
                                                    Hospizzentrum Wendessen
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Wendesser Berg */}
                            <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6 bg-white rounded-3xl p-6 sm:p-8 shadow-xl">
                                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-purple-500 to-purple-700 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 mx-auto sm:mx-0">
                                    1759
                                </div>
                                <div className="text-center sm:text-left">
                                    <h4 className="text-xl sm:text-2xl font-bold text-purple-800 mb-3">
                                        Wendesser Berg
                                    </h4>
                                    <div className="space-y-2 text-gray-700">
                                        <p>
                                            <strong>1759:</strong> Die
                                            Wolfenbütteler Gerichtsstätte wurde
                                            auf den Wendesser Berg verlegt
                                        </p>
                                        <p>
                                            <strong>1762:</strong> Bau der
                                            Schanze auf dem Wendesser Berg
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Eisenbahn und Industrie */}
                            <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6 bg-white rounded-3xl p-6 sm:p-8 shadow-xl">
                                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-gray-600 to-gray-800 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 mx-auto sm:mx-0">
                                    1843
                                </div>
                                <div className="text-center sm:text-left">
                                    <h4 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3">
                                        Eisenbahn und Industrie
                                    </h4>
                                    <div className="bg-gray-50 p-4 rounded-xl space-y-3 text-gray-700">
                                        <p>
                                            <strong>1843:</strong>{' '}
                                            Eisenbahnanschluss an der Strecke
                                            Braunschweig-Helmstedt
                                        </p>
                                        <p>
                                            <strong>1857:</strong> Errichtung
                                            der Zuckerfabrik (betrieben bis
                                            1957)
                                        </p>
                                        <p>
                                            <strong>1957:</strong> Ende der Zuckerfabrik
                                        </p>
                                        <div className="bg-blue-100 p-3 rounded-lg">
                                            <p className="text-blue-800">
                                                <strong>Heute:</strong> Bebauung des Geländes mitEin- und Mehrfamilienhäusern geplant, Wiederinbetriebnahme des Bahnhaltepunktes vorgesehen.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* WWII */}
                            <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6 bg-white rounded-3xl p-6 sm:p-8 shadow-xl border-l-4 border-red-500">
                                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-red-600 to-red-800 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 mx-auto sm:mx-0">
                                    1944
                                </div>
                                <div className="text-center sm:text-left">
                                    <h4 className="text-xl sm:text-2xl font-bold text-red-800 mb-3">
                                        Luftangriff vom 14. Januar 1944
                                    </h4>
                                    <div className="bg-red-50 p-4 rounded-xl">
                                        <p className="text-lg text-gray-800 mb-3">
                                            Bei einem Luftangriff wurden nicht
                                            nur das Rittergut und die aus dem
                                            12. Jahrhundert stammende Kirche
                                            zerstört, sondern auch verschiedene
                                            Wohnhäuser, Scheunen und Ställe.
                                        </p>
                                        <div className="bg-red-100 p-3 rounded-lg border-l-4 border-red-400">
                                            <p className="text-red-800 font-semibold">
                                                Durch einen Volltreffer auf
                                                einen haltenden Zug kam es zu
                                                einer hohen Zahl an zivilen
                                                Opfern: 36 Menschen starben.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Population Development */}
                    <div className="mb-20">
                        <div className="text-center mb-16">
                            <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-6">
                                Bevölkerungsentwicklung
                            </h3>
                            <div className="w-32 h-2 bg-gradient-to-r from-teal-600 to-cyan-600 mx-auto mb-8"></div>
                            <p className="text-base sm:text-lg text-gray-600">
                                Die Entwicklung der Einwohnerzahl von Wendessen
                            </p>
                        </div>

                        <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-4xl p-10 shadow-2xl">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                                <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
                                    <div className="text-3xl font-bold text-teal-700 mb-2">
                                        75
                                    </div>
                                    <div className="text-lg font-semibold text-gray-800">
                                        1663
                                    </div>
                                    <div className="text-xs text-gray-600 mt-1">
                                        ohne Kinder unter 14
                                    </div>
                                </div>
                                <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
                                    <div className="text-3xl font-bold text-teal-700 mb-2">
                                        200
                                    </div>
                                    <div className="text-lg font-semibold text-gray-800">
                                        1756
                                    </div>
                                </div>
                                <div className="bg-white p-6 rounded-2xl shadow-lg text-center border-2 border-red-300">
                                    <div className="text-2xl font-bold text-red-700 mb-2">
                                        Cholera
                                    </div>
                                    <div className="text-sm text-gray-800">
                                        1855: 5 Tote
                                    </div>
                                    <div className="text-sm text-gray-800">
                                        1859: 10 Tote
                                    </div>
                                </div>
                                <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
                                    <div className="text-3xl font-bold text-teal-700 mb-2">
                                        750
                                    </div>
                                    <div className="text-lg font-semibold text-gray-800">
                                        Mitte 2005
                                    </div>
                                </div>
                                <div className="bg-white p-6 rounded-2xl shadow-lg text-center border-4 border-teal-400">
                                    <div className="text-3xl font-bold text-teal-700 mb-2">
                                        1100
                                    </div>
                                    <div className="text-lg font-semibold text-gray-800">
                                        2026
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Closing Statement */}
                    <div className="text-center bg-gradient-to-r from-amber-50 to-orange-50 rounded-4xl p-12 shadow-2xl">
                        <div className="max-w-4xl mx-auto">
                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-amber-800 leading-tight mb-6">
                                Über 850 Jahre lebendige Geschichte
                            </h1>
                            <p className="text-lg sm:text-xl text-gray-700 leading-relaxed mb-8">
                                Von Winedissen zu Wendessen - unser Dorf hat Kriesen und
                                Kriege überstanden, sich gewandelt und ist
                                gewachsen. Heute blicken wir stolz auf über 850
                                Jahre Geschichte zurück und schauen optimistisch
                                in die Zukunft.
                            </p>
                            <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-4 mb-8">
                                <div className="flex items-center space-x-2 text-amber-600">
                                    <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0" />
                                    <span className="text-lg sm:text-xl md:text-2xl font-bold text-center sm:text-left">
                                        Wendessen - Tradition trifft Zukunft
                                    </span>
                                </div>
                            </div>

                            <div className="flex justify-center mb-10">
                                <div className="relative w-32 h-40 sm:w-40 sm:h-48">
                                    <Image
                                        src="/images/Wappen.png"
                                        alt="Wappen von Wendessen"
                                        fill
                                        className="object-contain drop-shadow-2xl"
                                        priority
                                    />
                                </div>
                            </div>

                            <div className="max-w-3xl mx-auto text-center mb-12 space-y-4">
                                <p className="text-base sm:text-lg text-gray-700 leading-relaxed italic">
                                    Der Name Wendessen bedeutet „Heim im Weidezaun“. Er wird im Wappen durch den grünen Flechtzaun, der zudem auf die Landwirtschaft als wichtigen Wirtschaftszweig verweist, versinnbildlicht.
                                </p>
                                <p className="text-base sm:text-lg text-gray-700 leading-relaxed italic">
                                    Die Wehrkirche von Wendessen ist St. Georg geweiht. Als Sinnbild der Kirche erscheint das heraldische Attribut des Schutzpatrons, das rote Kreuz auf silbernem Grund.
                                </p>
                            </div>
                            
                            <div className="bg-white p-6 rounded-2xl shadow-lg mt-8">
                                <p className="text-base sm:text-lg text-gray-600">
                                    <strong className="text-amber-700">
                                        Ortsheimatpfleger:
                                    </strong>{' '}
                                    Erich Isensee
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
