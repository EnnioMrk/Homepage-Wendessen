import {
    Target,
    Info,
    ChartBar,
    Lightning,
    Clock,
    Crown,
    Trophy,
    Warning,
    UsersThree,
    Egg,
    BowlFood,
    CalendarCheck,
} from '@phosphor-icons/react/dist/ssr';
import PageHeader from '@/app/components/layout/PageHeader';
import ContactCardFetcher from '@/app/components/ContactCardFetcher';

export const metadata = {
    title: 'Schützenverein Wendessen e.V. - Dorfleben',
    description:
        'Schützenverein Wendessen e.V. - Sportliche Heimat für über 50 Mitglieder. Schießsport für Kinder, Jugendliche, Frauen und Männer.',
};

export default async function SchuetzenvereinsPage() {
    return (
        <div className="min-h-screen bg-slate-50 pb-24">
            <PageHeader title="Schützenverein" icon={<Target />} color="red" />

            {/* Main Content Container */}
            <div className="container mx-auto px-4 max-w-6xl mt-8 relative z-10">
                
                {/* Intro / Hero Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 md:p-12 mb-8">
                    <div className="grid md:grid-cols-3 gap-12 items-start">
                        <div className="md:col-span-2 space-y-6">
                            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-red-50 text-red-700 text-sm font-medium rounded-full">
                                <UsersThree className="w-4 h-4" />
                                <span>Über 50 Mitglieder</span>
                            </div>
                            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                                Sportliche Heimat für Jung und Alt
                            </h2>
                            <p className="text-lg text-slate-600 leading-relaxed">
                                Unser <strong>Schützenverein Wendessen e.V.</strong> ist mehr als nur ein Name. 
                                Bei uns können Kinder, Jugendliche, Frauen und Männer den Schießsport ausüben 
                                – allein, zu zweit oder mit der ganzen Familie.
                            </p>
                            
                            {/* Construction Notice - Integrated */}
                            <div className="bg-orange-50 border-l-2 border-orange-500 p-4 mt-6 rounded-r-lg">
                                <div className="flex items-start">
                                    <Info className="w-5 h-5 text-orange-600 mt-0.5 mr-3 flex-shrink-0" />
                                    <div>
                                        <h3 className="font-semibold text-orange-900 text-sm mb-1">
                                            Website im Umbau
                                        </h3>
                                        <p className="text-orange-800 text-sm">
                                            Unsere Website wird derzeit überarbeitet. Alle wichtigen Informationen 
                                            finden Sie dennoch hier auf dieser Seite.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Quick Facts / Side Panel */}
                        <div className="bg-slate-50 rounded-xl p-6 border border-slate-100 h-full">
                            <h4 className="font-bold text-slate-900 mb-4 flex items-center">
                                <Clock className="w-5 h-5 mr-2 text-slate-500" />
                                Schießabende
                            </h4>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center pb-3 border-b border-slate-200 last:border-0 last:pb-0">
                                    <span className="font-medium text-slate-700">Mittwochs</span>
                                    <span className="text-slate-600 font-mono">18:00 - 21:00</span>
                                </div>
                                <div className="flex justify-between items-center pb-3 border-b border-slate-200 last:border-0 last:pb-0">
                                    <span className="font-medium text-slate-700">Freitags</span>
                                    <span className="text-slate-600 font-mono">18:00 - 21:00</span>
                                </div>
                            </div>
                            
                            <div className="mt-8 pt-6 border-t border-slate-200">
                                <p className="text-sm text-slate-500 mb-2">Wir freuen uns auf Sie!</p>
                                <p className="text-sm font-medium text-slate-900">
                                    Interessierte Bürger sind jederzeit herzlich willkommen.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Facilities Section */}
                <div className="mb-12">
                    <div className="flex items-center mb-8">
                         <h3 className="text-2xl font-bold text-slate-900 mr-4">Unsere Ausstattung</h3>
                         <div className="h-px bg-slate-200 flex-grow"></div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* KK & SpoPi */}
                        <div className="group bg-white p-8 rounded-xl border border-slate-200 hover:border-red-200 transition-colors shadow-sm hover:shadow-md">
                            <div className="w-12 h-12 bg-red-50 text-red-600 rounded-lg flex items-center justify-center mb-6 group-hover:bg-red-600 group-hover:text-white transition-colors">
                                <ChartBar className="w-6 h-6" />
                            </div>
                            <h4 className="text-xl font-bold text-slate-900 mb-2">Elektronische Auswertung</h4>
                            <div className="flex flex-col space-y-2 text-slate-600 mb-4">
                                <span className="font-medium text-slate-900">KK und SpoPi</span>
                                <span>2 Stände auf 50/25 m Distanz</span>
                            </div>
                        </div>

                        {/* Luftgewehr */}
                        <div className="group bg-white p-8 rounded-xl border border-slate-200 hover:border-blue-200 transition-colors shadow-sm hover:shadow-md">
                            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                <Lightning className="w-6 h-6" />
                            </div>
                            <h4 className="text-xl font-bold text-slate-900 mb-2">Infrarotauswertung</h4>
                            <div className="flex flex-col space-y-2 text-slate-600 mb-4">
                                <span className="font-medium text-slate-900">Luftgewehr</span>
                                <span>2 Stände mit moderner Technik</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Grid: Youth & Events */}
                <div className="grid lg:grid-cols-12 gap-8 mb-16">
                    
                    {/* Left Col: Youth (4 cols) */}
                    <div className="lg:col-span-4 space-y-6">
                         <div className="bg-slate-900 text-white rounded-xl p-8 h-full flex flex-col relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-10">
                                <Target className="w-32 h-32" />
                            </div>
                            
                            <h3 className="text-2xl font-bold mb-4 relative z-10">Jugendabteilung</h3>
                            <p className="text-slate-300 mb-8 relative z-10 leading-relaxed">
                                Ein wichtiger Bestandteil unseres Vereins. Für Jugendliche von 9-17 Jahren bieten wir 
                                neben Luftgewehr und Luftpistole auch viele Freizeitaktivitäten.
                            </p>

                            <div className="mt-auto relative z-10 space-y-6">
                                <div className="bg-slate-800/50 p-4 rounded-lg backdrop-blur-sm border border-slate-700">
                                    <div className="flex items-center text-red-400 font-bold mb-1">
                                        <Lightning className="w-4 h-4 mr-2" />
                                        <span>Neu: Infrarotanlage</span>
                                    </div>
                                    <p className="text-sm text-slate-400">
                                        Schon ab 6 Jahren möglich, da völlig ohne Munition.
                                    </p>
                                </div>

                                <div className="bg-red-900/30 border border-red-900/50 p-4 rounded-lg">
                                    <div className="flex items-start text-red-200">
                                        <Warning className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0" />
                                        <span className="text-sm">
                                            Derzeit kann leider kein Training für Jugendliche angeboten werden.
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Col: Events (8 cols) */}
                    <div className="lg:col-span-8">
                        <div className="flex items-center mb-6">
                            <CalendarCheck className="w-6 h-6 text-slate-400 mr-3" />
                            <h3 className="text-2xl font-bold text-slate-900">Veranstaltungen</h3>
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                            {/* Card 1 */}
                            <div className="bg-white p-6 rounded-xl border border-slate-200 hover:border-slate-300 transition-all">
                                <div className="flex items-start justify-between mb-4">
                                     <h4 className="font-bold text-slate-900">Ostereierschießen</h4>
                                     <Egg className="w-5 h-5 text-yellow-500" />
                                </div>
                                <p className="text-sm text-slate-500">
                                    Traditionelles Frühjahrs-Event für die ganze Familie.
                                </p>
                            </div>

                            {/* Card 2 */}
                            <div className="bg-white p-6 rounded-xl border border-slate-200 hover:border-slate-300 transition-all">
                                <div className="flex items-start justify-between mb-4">
                                     <h4 className="font-bold text-slate-900">Königsschießen</h4>
                                     <Crown className="w-5 h-5 text-purple-600" />
                                </div>
                                <p className="text-sm text-slate-500">
                                    Das Highlight des Jahres mit großer Königsproklamation.
                                </p>
                            </div>

                            {/* Card 3 */}
                            <div className="bg-white p-6 rounded-xl border border-slate-200 hover:border-slate-300 transition-all">
                                <div className="flex items-start justify-between mb-4">
                                     <h4 className="font-bold text-slate-900">Pokal- und Mannschaft</h4>
                                     <Trophy className="w-5 h-5 text-blue-600" />
                                </div>
                                <p className="text-sm text-slate-500">
                                    Wettkampf und Teamgeist stehen hier im Vordergrund.
                                </p>
                            </div>

                            {/* Card 4 */}
                            <div className="bg-white p-6 rounded-xl border border-slate-200 hover:border-slate-300 transition-all">
                                <div className="flex items-start justify-between mb-4">
                                     <h4 className="font-bold text-slate-900">Schweineschießen</h4>
                                     <BowlFood className="w-5 h-5 text-green-600" />
                                </div>
                                <p className="text-sm text-slate-500">
                                    Geselliges Schießen mit kulinarischem Höhepunkt.
                                </p>
                            </div>
                        </div>

                        {/* Public Info */}
                        <div className="mt-6 bg-red-50 rounded-xl p-6 border border-red-100 flex flex-col md:flex-row md:items-center gap-6">
                            <div className="flex-1">
                                <h4 className="font-bold text-red-900 flex items-center mb-2">
                                    <UsersThree className="w-5 h-5 mr-2" />
                                    Für alle Dorfbürger
                                </h4>
                                <p className="text-sm text-red-800/80 mb-3">
                                    An diesen Veranstaltungen können alle Bürger unseres Dorfes teilnehmen.
                                    Highlight: Der Volkskönig und die Volkskönigin sind für ein Jahr kostenfreie Mitglieder.
                                </p>
                                <div className="inline-flex items-center text-xs font-medium text-amber-700 bg-amber-50 px-3 py-1.5 rounded-md border border-amber-200/50">
                                    <Info className="w-3.5 h-3.5 mr-1.5" />
                                    Königinnen und Königen entstehen keine Kosten.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact Section */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 md:p-12 text-center md:text-left">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                        <div>
                             <h2 className="text-2xl font-bold text-slate-900 mb-2">Fragen zum Verein?</h2>
                             <p className="text-slate-600">Unser Vorstand steht Ihnen gerne zur Verfügung.</p>
                        </div>
                        <div className="w-full md:w-auto min-w-[300px]">
                             <ContactCardFetcher
                                name="Lothar Lange"
                                fallbackRole="Schriftführer"
                                colorClassName="text-red-600"
                            />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
