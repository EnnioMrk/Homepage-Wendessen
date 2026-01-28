import Image from 'next/image';
import {
    ArrowSquareOut,
    MapPin,
    EnvelopeSimple,
    DeviceMobile,
    Phone,
    Briefcase,
    Clock,
} from '@phosphor-icons/react/dist/ssr';

interface ContactInfoCardProps {
    icon: React.ReactNode;
    label: string;
    value: string;
    href?: string;
    gradient: string;
    isClickable?: boolean;
}

interface CardContentProps {
    icon: React.ReactNode;
    label: string;
    value: string;
    gradient: string;
    isClickable: boolean;
}

const CardContent = ({ icon, label, value, gradient, isClickable }: CardContentProps) => (
    <div
        className={`group relative overflow-hidden rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 bg-white ${
            isClickable
                ? 'transform hover:-translate-y-2 cursor-pointer'
                : ''
        }`}
    >
        <div className="flex items-start space-x-4">
            <div
                className={`w-12 h-12 bg-gradient-to-r ${gradient} rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 flex-shrink-0`}
            >
                {icon}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                    {label}
                </p>
                <p
                    className="text-lg font-bold text-foreground group-hover:text-primary transition-colors duration-300 break-words overflow-hidden"
                    style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        wordBreak: 'break-all',
                        fontSize:
                            value.length > 25
                                ? value.length > 35
                                    ? '0.875rem'
                                    : '1rem'
                                : '1.125rem',
                    }}
                >
                    {value}
                </p>
            </div>
            {isClickable && (
                <div className="opacity-50 group-hover:opacity-100 transition-opacity duration-300 flex-shrink-0">
                    <ArrowSquareOut className="w-5 h-5 text-primary" />
                </div>
            )}
        </div>
        {/* Hover effect overlay */}
        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl"></div>
    </div>
);

export function ContactInfoCard({
    icon,
    label,
    value,
    href,
    gradient,
    isClickable = false,
}: ContactInfoCardProps) {
    if (href && isClickable) {
        return (
            <a href={href} className="block">
                <CardContent
                    icon={icon}
                    label={label}
                    value={value}
                    gradient={gradient}
                    isClickable={isClickable}
                />
            </a>
        );
    }

    return (
        <CardContent
            icon={icon}
            label={label}
            value={value}
            gradient={gradient}
            isClickable={isClickable}
        />
    );
}

interface ContactPersonCardProps {
    name: string;
    title: string;
    subtitle?: string;
    birthYear: number;
    profession: string;
    imageSrc: string;
    imageAlt: string;
    contactInfo: {
        address: string;
        phone?: string;
        mobile: string;
        email: string;
    };
}

export default function ContactPersonCard({
    name,
    title,
    subtitle,
    birthYear,
    profession,
    imageSrc,
    imageAlt,
    contactInfo,
}: ContactPersonCardProps) {
    // Use a static year to avoid hydration mismatches
    const age = 2025 - birthYear;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-r from-primary via-secondary to-primary py-20 overflow-hidden">
                <div className="absolute inset-0 bg-[url('/images/Wendessen_Luftaufnahme.jpg')] bg-cover bg-center opacity-20"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-secondary/90"></div>

                <div className="relative z-10 container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            {/* Text Content */}
                            <div className="text-center lg:text-left">
                                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4">
                                    Kontakt
                                </h1>
                                <div className="w-32 h-2 bg-gradient-to-r from-accent to-white mx-auto lg:mx-0 mb-6"></div>
                                <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                                    {name}
                                </h2>
                                <p className="text-xl text-accent-light font-semibold mb-4">
                                    {title}
                                </p>
                                {subtitle && (
                                    <p className="text-lg text-white/90 mb-6">
                                        {subtitle}
                                    </p>
                                )}
                                <div className="flex flex-col sm:flex-row gap-4 text-white/80 justify-center lg:justify-start">
                                    <div className="flex items-center space-x-2">
                                        <Briefcase className="w-5 h-5" />
                                        <span>{profession}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Clock className="w-5 h-5" />
                                        <span>
                                            {age} Jahre (geb. {birthYear})
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Profile Image */}
                            <div className="flex justify-center lg:justify-end">
                                <div className="relative">
                                    <div className="w-80 h-80 md:w-96 md:h-96 relative overflow-hidden rounded-3xl shadow-2xl border-4 border-white/20">
                                        <Image
                                            src={imageSrc}
                                            alt={imageAlt}
                                            fill
                                            className="object-cover object-center"
                                            priority
                                        />
                                    </div>
                                    {/* Decorative elements */}
                                    <div className="absolute -top-4 -left-4 w-20 h-20 border-4 border-accent/50 rounded-full animate-pulse"></div>
                                    <div className="absolute -bottom-4 -right-4 w-16 h-16 border-4 border-white/50 rounded-full animate-pulse delay-300"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contact Information Section */}
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <h3 className="text-3xl sm:text-4xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
                            Kontaktinformationen
                        </h3>
                        <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto mb-6"></div>
                        <p className="text-lg text-gray-600">
                            So erreichen Sie mich
                        </p>
                    </div>

                    <div
                        className={`grid gap-6 mb-12 ${
                            contactInfo.phone
                                ? 'grid-cols-1 lg:grid-cols-2'
                                : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
                        }`}
                    >
                        {/* Address */}
                        <ContactInfoCard
                            icon={<MapPin className="w-6 h-6 text-white" />}
                            label="Adresse"
                            value={contactInfo.address}
                            gradient="from-blue-600 to-indigo-600"
                        />

                        {/* Email */}
                        <ContactInfoCard
                            icon={
                                <EnvelopeSimple className="w-6 h-6 text-white" />
                            }
                            label="E-Mail"
                            value={contactInfo.email}
                            href={`mailto:${contactInfo.email}`}
                            gradient="from-green-600 to-emerald-600"
                            isClickable={true}
                        />

                        {/* Mobile Phone */}
                        <ContactInfoCard
                            icon={
                                <DeviceMobile className="w-6 h-6 text-white" />
                            }
                            label="Mobil (WhatsApp)"
                            value={contactInfo.mobile}
                            href={`tel:${contactInfo.mobile}`}
                            gradient="from-orange-600 to-red-600"
                            isClickable={true}
                        />

                        {/* Phone - only show if phone number exists */}
                        {contactInfo.phone && (
                            <ContactInfoCard
                                icon={<Phone className="w-6 h-6 text-white" />}
                                label="Telefon"
                                value={contactInfo.phone}
                                href={`tel:${contactInfo.phone}`}
                                gradient="from-purple-600 to-pink-600"
                                isClickable={true}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
