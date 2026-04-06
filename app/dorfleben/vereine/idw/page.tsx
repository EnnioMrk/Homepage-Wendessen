import { UsersThree, CalendarBlank, UserPlus } from '@phosphor-icons/react/dist/ssr';
import PageHeader from '@/app/components/layout/PageHeader';
import OrganizationContacts from '@/app/components/OrganizationContacts';

export const metadata = {
    title: 'IDW - Initiative Dorfgemeinschaft Wendessen e.V. - Dorfleben',
    description:
        'Die IDW ist der Dachverein für die ortsansässigen Vereine in Wendessen und stärkt mit gemeinsamen Veranstaltungen das Dorfleben.',
};

export default async function IDWPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
            <PageHeader
                title="IDW"
                subtitle="Initiative Dorfgemeinschaft Wendessen e.V."
                icon={<UsersThree />}
                color="blue"
            />

            <div className="container mx-auto px-4 py-16">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                            Gemeinsam für Wendessen
                        </h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-cyan-600 to-blue-600 mx-auto mb-6"></div>
                    </div>

                    <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl mb-16">
                        <div className="bg-gradient-to-r from-cyan-50 to-blue-50 border-l-4 border-cyan-500 p-6 rounded-r-2xl">
                            <p className="text-lg text-gray-700 leading-relaxed">
                                Die IDW (&bdquo;Initiative Dorfgemeinschaft Wendessen e.V.&ldquo;) ist der Dachverein für alle ortsansässigen Vereine, die das Dorfleben in Wendessen beleben und die Nachbarschaft zusammenbringen.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                        <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-8 rounded-3xl shadow-lg">
                            <h3 className="text-2xl font-bold text-orange-700 mb-6 flex items-center">
                                <CalendarBlank className="w-8 h-8 mr-3" />
                                Veranstaltungen
                            </h3>
                            <p className="text-gray-700 leading-relaxed">
                                Gemeinsam werden Veranstaltungen geplant und durchgeführt wie z.B. das jährliche Kinderfest oder der Laternenumzug.
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-8 rounded-3xl shadow-lg">
                            <h3 className="text-2xl font-bold text-emerald-700 mb-6 flex items-center">
                                <UserPlus className="w-8 h-8 mr-3" />
                                Bürgermitgliedschaft
                            </h3>
                            <p className="text-gray-700 leading-relaxed">
                                Neben den Vereinen können sich seit 2025 auch Interessierte und engagierte Wendesser als Bürgermitglied im Verein einbringen.
                            </p>
                        </div>
                    </div>

                    <div className="text-center bg-gradient-to-r from-cyan-50 to-blue-50 rounded-3xl p-8 shadow-lg">
                        <h3 className="text-3xl font-bold text-cyan-700 mb-4">
                            Dorfleben lebt von Gemeinschaft
                        </h3>
                        <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                            Die IDW bringt Vereine und engagierte Wendesser zusammen &ndash; für ein aktives Miteinander im Dorf.
                        </p>
                    </div>

                    <div className="mt-16 sm:mt-24">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
                                Ansprechpartner
                            </h2>
                            <div className="w-20 h-1 bg-cyan-600 mx-auto mb-8"></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 max-w-5xl mx-auto px-4">
                            <OrganizationContacts
                                organizationId="idw"
                                colorClassName="text-cyan-600"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
