import OrtsratMemberCard from '../../../components/OrtsratMemberCard';

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
        isLeader: true,
        contactSlug: 'andreas-rink',
    },
    {
        name: 'Christina Balder',
        position: 'stellv. Ortsbürgermeisterin',
        party: 'FDP',
        imageSrc: '/images/Ortsrat/Christina_Balder.jpg',
        imageAlt: 'Christina Balder - stellvertretende Ortsbürgermeisterin',
        isLeader: true,
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
    // Separate leaders from regular members
    const leaders = ortsratMembers.filter((member) => member.isLeader);
    const regularMembers = ortsratMembers.filter((member) => !member.isLeader);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-r from-primary via-secondary to-primary py-20 overflow-hidden">
                <div className="absolute inset-0 bg-[url('/images/Wendessen_Luftaufnahme.jpg')] bg-cover bg-center opacity-20"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-secondary/90"></div>

                <div className="relative z-10 container mx-auto px-4 text-center">
                    <div className="max-w-4xl mx-auto">
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
                            Ortsrat
                        </h1>
                        <div className="w-32 h-2 bg-gradient-to-r from-accent to-white mx-auto mb-8"></div>
                        <p className="text-xl md:text-2xl text-white/90 leading-relaxed max-w-3xl mx-auto">
                            Lernen Sie die Menschen kennen, die sich für unser
                            Wendessen einsetzen
                        </p>

                        {/* Decorative elements */}
                        <div className="absolute top-10 left-10 w-20 h-20 border-2 border-white/30 rounded-full animate-pulse"></div>
                        <div className="absolute bottom-10 right-10 w-16 h-16 border-2 border-accent/50 rounded-full animate-pulse"></div>
                        <div className="absolute top-1/2 left-20 w-2 h-2 bg-white/40 rounded-full animate-bounce"></div>
                        <div className="absolute top-1/3 right-32 w-3 h-3 bg-accent/60 rounded-full animate-bounce delay-300"></div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-16">
                {/* Leadership Section */}
                <div className="mb-20">
                    <div className="text-center mb-12">
                        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                            Ortsleitung
                        </h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto mb-6"></div>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Die Führung unserer Gemeinde
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {leaders.map((member) => (
                            <OrtsratMemberCard
                                key={member.name}
                                name={member.name}
                                position={member.position}
                                party={member.party}
                                imageSrc={member.imageSrc}
                                imageAlt={member.imageAlt}
                                isLeader={member.isLeader}
                                contactSlug={member.contactSlug}
                            />
                        ))}
                    </div>
                </div>

                {/* Regular Members Section */}
                <div>
                    <div className="text-center mb-12">
                        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                            Ortsratsmitglieder
                        </h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-secondary to-accent mx-auto mb-6"></div>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Unsere engagierten Vertreter aus der Gemeinschaft
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                        {regularMembers.map((member) => (
                            <OrtsratMemberCard
                                key={member.name}
                                name={member.name}
                                position={member.position}
                                party={member.party}
                                imageSrc={member.imageSrc}
                                imageAlt={member.imageAlt}
                                isLeader={member.isLeader}
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
                                    <svg
                                        className="w-8 h-8 text-white"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                        />
                                    </svg>
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
                                    <svg
                                        className="w-8 h-8 text-white"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                        />
                                    </svg>
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
                                    <svg
                                        className="w-8 h-8 text-white"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M13 10V3L4 14h7v7l9-11h-7z"
                                        />
                                    </svg>
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
