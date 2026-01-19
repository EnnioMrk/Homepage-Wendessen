import PageHeader from '@/app/components/layout/PageHeader';
import { Users, UserCircle } from '@phosphor-icons/react/dist/ssr';

import { REDAKTIONSTEAM_KERNTEAM, REDAKTIONSTEAM_BEREICHSVERANTWORTLICHE, TeamMember } from '@/lib/constants/members';

const kernteam = REDAKTIONSTEAM_KERNTEAM;
const bereichsverantwortliche = REDAKTIONSTEAM_BEREICHSVERANTWORTLICHE;

function TeamCard({ member }: { member: TeamMember }) {
    const isPlaceholder = member.name === 'N.N.';

    return (
        <div
            className={`bg-white rounded-lg shadow-md p-4 border ${
                isPlaceholder
                    ? 'border-dashed border-gray-300'
                    : 'border-gray-200'
            }`}
        >
            <div className="flex items-center gap-3">
                <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        isPlaceholder ? 'bg-gray-100' : 'bg-primary/10'
                    }`}
                >
                    <UserCircle
                        size={24}
                        className={
                            isPlaceholder ? 'text-gray-400' : 'text-primary'
                        }
                        weight="fill"
                    />
                </div>
                <div>
                    <p
                        className={`font-medium ${
                            isPlaceholder
                                ? 'text-gray-400 italic'
                                : 'text-gray-900'
                        }`}
                    >
                        {member.name}
                    </p>
                    <p className="text-sm text-gray-600">
                        {member.area ? `${member.area}` : member.role}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function RedaktionsteamPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-background-secondary">
            <PageHeader
                title="Redaktionsteam"
                subtitle="Die Menschen hinter der Website"
                icon={<Users size={48} />}
            />

            <div className="container mx-auto px-4 py-12">
                {/* Introduction */}
                <div className="max-w-3xl mx-auto mb-12">
                    <p className="text-gray-700 text-lg leading-relaxed">
                        Unsere Website wird von einem engagierten Team aus
                        Wendesser Bürgerinnen und Bürgern gepflegt. Das Kernteam
                        kümmert sich um die allgemeine Gestaltung und Inhalte,
                        während die Bereichsverantwortlichen die Termine und
                        Neuigkeiten für ihre jeweiligen Vereine und
                        Institutionen eigenständig eintragen.
                    </p>
                </div>

                {/* Kernteam */}
                <div className="max-w-4xl mx-auto mb-12">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <span className="w-1 h-6 bg-primary rounded-full"></span>
                        Kernteam
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {kernteam.map((member) => (
                            <TeamCard key={member.name} member={member} />
                        ))}
                    </div>
                </div>

                {/* Bereichsverantwortliche */}
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <span className="w-1 h-6 bg-primary rounded-full"></span>
                        Bereichsverantwortliche
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Die Bereichsverantwortlichen pflegen eigenständig die
                        Termine und Nachrichten für ihre Vereine und
                        Institutionen.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {bereichsverantwortliche.map((member, index) => (
                            <TeamCard
                                key={`${member.area}-${index}`}
                                member={member}
                            />
                        ))}
                    </div>
                </div>

                {/* Call to Action */}
                <div className="max-w-3xl mx-auto mt-12 p-6 bg-primary/5 rounded-lg border border-primary/20">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Möchten Sie mithelfen?
                    </h3>
                    <p className="text-gray-700">
                        Wenn Sie Interesse haben, als Verantwortliche/r für
                        Ihren Verein oder Ihre Institution Termine und
                        Neuigkeiten auf unserer Website zu veröffentlichen,
                        melden Sie sich gerne bei einem Mitglied des Kernteams.
                    </p>
                </div>
            </div>
        </div>
    );
}
