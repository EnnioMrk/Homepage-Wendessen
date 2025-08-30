import Image from 'next/image';
import Link from 'next/link';
import { Crown, Mail } from 'lucide-react';

interface OrtsratMemberCardProps {
    name: string;
    position: string;
    party: string;
    imageSrc: string;
    imageAlt: string;
    isLeader?: boolean;
    contactSlug?: string;
}

const partyColors: { [key: string]: string } = {
    'SPD': 'from-red-600 to-red-700',
    'FDP': 'from-yellow-500 to-yellow-600',
    'CDU': 'from-gray-700 to-gray-800',
    'parteilos': 'from-gray-500 to-gray-600',
    "parteilos (aufgestellt für B'90)": 'from-green-600 to-green-700',
    'parteilos (aufgestellt für CDU)': 'from-blue-600 to-blue-700',
};

export default function OrtsratMemberCard({
    name,
    position,
    party,
    imageSrc,
    imageAlt,
    isLeader = false,
    contactSlug,
}: OrtsratMemberCardProps) {
    const partyGradient = partyColors[party] || 'from-gray-500 to-gray-600';

    const CardContent = () => (
        <div
            className={`group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 bg-white transform hover:-translate-y-2 ${
                isLeader ? 'ring-4 ring-primary/50 ring-opacity-75' : ''
            } ${contactSlug ? 'cursor-pointer' : ''}`}
        >
            {/* Leader Badge */}
            {isLeader && (
                <div className="absolute top-4 left-4 z-20">
                    <div className="bg-gradient-to-r from-primary to-accent px-3 py-1 rounded-full text-white text-xs font-bold shadow-lg">
                        <Crown className="w-3 h-3 inline-block mr-1" />
                        LEITUNG
                    </div>
                </div>
            )}

            {/* Profile Image */}
            <div className="relative h-80 overflow-hidden">
                <Image
                    src={imageSrc}
                    alt={imageAlt}
                    fill
                    className="object-cover object-center group-hover:scale-110 transition-transform duration-700"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>

                {/* Party Badge */}
                <div className="absolute top-4 right-4">
                    <div
                        className={`bg-gradient-to-r ${partyGradient} px-3 py-1 rounded-full text-white text-xs font-bold shadow-lg`}
                    >
                        {party}
                    </div>
                </div>

                {/* Contact Button - only show if contactSlug exists */}
                {contactSlug && (
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-foreground font-semibold shadow-lg flex items-center space-x-2">
                            <Mail className="w-4 h-4" />
                            <span>Kontakt</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Member Information */}
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <div className="space-y-2">
                    {/* Position */}
                    <p className="text-sm font-semibold text-accent-light uppercase tracking-wide">
                        {position}
                    </p>

                    {/* Name */}
                    <h3
                        className="text-2xl font-bold leading-tight"
                        style={{
                            textShadow:
                                '2px 2px 4px rgba(0,0,0,0.8), -1px -1px 2px rgba(0,0,0,0.8)',
                        }}
                    >
                        {name}
                    </h3>
                </div>
            </div>

            {/* Hover effect overlay */}
            <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
    );

    // Wrap in Link if contactSlug is provided
    if (contactSlug) {
        return (
            <Link href={`/kontakt/${contactSlug}`} className="block">
                <CardContent />
            </Link>
        );
    }

    return <CardContent />;
}
