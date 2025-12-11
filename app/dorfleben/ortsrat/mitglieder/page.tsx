import OrtsratMemberCard from '../../../components/OrtsratMemberCard';
import {
    UsersThree,
    Buildings,
    Lightning,
} from '@phosphor-icons/react/dist/ssr';
import PageHeader from '@/app/components/layout/PageHeader';

export const metadata = {
    title: 'Ortsratsmitglieder - Dorfleben Wendessen',
    description:
        'Lernen Sie die Mitglieder unseres Ortsrates kennen - Ihre Vertreter vor Ort',
};

const ortsratMembers = [
    {
        name: 'Andreas Rink',
        position: 'Ortsbürgermeister',
        party: 'SPD',
        imageSrc: '/images/Ortsrat/Andreas_Rink.JPG',
        imageAlt: 'Andreas Rink - Ortsbürgermeister',
        contactSlug: 'andreas-rink',
    },
    {
        name: 'Christina Balder',
        position: 'stellv. Ortsbürgermeisterin',
        party: 'FDP',
        imageSrc: '/images/Ortsrat/Christina_Balder.jpg',
        imageAlt: 'Christina Balder - stellvertretende Ortsbürgermeisterin',
        contactSlug: 'christina-balder',
    },
    {
        name: 'Renate Hübner',
        position: 'Ortsratsmitglied',
        party: 'CDU',
        imageSrc: '/images/Ortsrat/Renate_Hübner.jpg',
        imageAlt: 'Renate Hübner - Ortsratsmitglied',
        contactSlug: 'renate-huebner',
    },
    {
        name: 'Klaus-Martin Jungkurth',
        position: 'Ortsratsmitglied',
        party: 'parteilos',
        imageSrc: '/images/Ortsrat/Klaus-Martin_Jungkurth.JPG',
        imageAlt: 'Klaus-Martin Jungkurth - Ortsratsmitglied',
        contactSlug: 'klaus-martin-jungkurth',
    },
    {
        name: 'Reiner Asche',
        position: 'Ortsratsmitglied',
        party: 'SPD',
        imageSrc: '/images/Ortsrat/Reiner_Asche.JPG',
        imageAlt: 'Reiner Asche - Ortsratsmitglied',
        contactSlug: 'reiner-asche',
    },
    {
        name: 'Femmke Brandl',
        position: 'Ortsratsmitglied',
        party: "parteilos (aufgestellt für B'90)",
        imageSrc: '/images/Ortsrat/Femmke_Brandl.jpeg',
        imageAlt: 'Femmke Brandl - Ortsratsmitglied',
        contactSlug: 'femmke-brandl',
    },
    {
        name: 'Marc Both',
        position: 'Ortsratsmitglied',
        party: 'parteilos (aufgestellt für CDU)',
        imageSrc: '/images/Ortsrat/Marc_Both.JPG',
        imageAlt: 'Marc Both - Ortsratsmitglied',
        contactSlug: 'marc-both',
    },
];

export default function OrtsratMitgliederPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
            <PageHeader
                title="Ortsrat"
                subtitle="Lernen Sie die Menschen kennen, die sich für unser Wendessen einsetzen"
                icon={<UsersThree />}
                backgroundImage="/images/Wendessen_Luftaufnahme.jpg"
                color="primary"
            />

            {/* Main Content */}
            <div className="container mx-auto px-4 py-16">
                {/* All Members Section */}
                <div className="mb-20">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {ortsratMembers.map((member) => (
                            <OrtsratMemberCard
                                key={member.name}
                                name={member.name}
                                position={member.position}
                                party={member.party}
                                imageSrc={member.imageSrc}
                                imageAlt={member.imageAlt}
                                contactSlug={member.contactSlug}
                            />
                        ))}
                    </div>
                </div>

                {/* Information Section */}
                <div className="mt-20 bg-gradient-to-r from-slate-50 to-gray-50 rounded-3xl p-8 md:p-12 shadow-lg">
                    <div className="max-w-4xl mx-auto text-center">
                        <h3 className="text-3xl font-bold text-foreground mb-6">
                            Demokratie vor Ort
                        </h3>
                        <p className="text-lg text-gray-700 leading-relaxed mb-8">
                            Unser Ortsrat vertritt die Interessen der
                            Bürgerinnen und Bürger von Wendessen. Die Mitglieder
                            engagieren sich ehrenamtlich für die Belange unserer
                            Gemeinde und sorgen dafür, dass Wendessen ein
                            lebens- und liebenswerter Ort bleibt.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                            <div className="text-center">
                                <div className="w-16 h-16 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4">
                                    <UsersThree className="w-8 h-8 text-white" />
                                </div>
                                <h4 className="text-xl font-semibold text-foreground mb-2">
                                    Bürgernähe
                                </h4>
                                <p className="text-gray-600">
                                    Direkte Ansprechpartner für alle Anliegen
                                    der Gemeinde
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="w-16 h-16 bg-gradient-to-r from-secondary to-primary rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Buildings className="w-8 h-8 text-white" />
                                </div>
                                <h4 className="text-xl font-semibold text-foreground mb-2">
                                    Gemeindeleben
                                </h4>
                                <p className="text-gray-600">
                                    Förderung von Vereinen, Veranstaltungen und
                                    Zusammenhalt
                                </p>
                            </div>

                            <div className="text-center">
                                <div className="w-16 h-16 bg-gradient-to-r from-accent to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Lightning className="w-8 h-8 text-white" />
                                </div>
                                <h4 className="text-xl font-semibold text-foreground mb-2">
                                    Zukunft gestalten
                                </h4>
                                <p className="text-gray-600">
                                    Planung und Entwicklung für ein lebenswertes
                                    Wendessen
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
