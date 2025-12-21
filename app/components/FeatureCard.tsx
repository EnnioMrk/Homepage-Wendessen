import Image from 'next/image';
import { ArrowRight } from '@phosphor-icons/react/dist/ssr';

interface FeatureCardProps {
    title: string;
    subtitle?: string;
    description: string;
    imageSrc?: string;
    imageAlt?: string;
    buttonText: string;
    buttonHref: string;
    buttonColor: string;
    highlightColor?: string;
    backgroundColor?: string;
    subtitleClassName?: string;
    isTextOnly?: boolean;
    className?: string;
    variant?: 'centered' | 'hero';
    compact?: boolean;
}

const buttonColorClasses: Record<string, string> = {
    slate: 'bg-gradient-to-r from-slate-600 to-gray-600 hover:from-slate-700 hover:to-gray-700',
    gray: 'bg-gradient-to-r from-gray-600 to-zinc-600 hover:from-gray-700 hover:to-zinc-700',
    zinc: 'bg-gradient-to-r from-zinc-600 to-neutral-600 hover:from-zinc-700 hover:to-neutral-700',
    neutral: 'bg-gradient-to-r from-neutral-600 to-stone-600 hover:from-neutral-700 hover:to-stone-700',
    stone: 'bg-gradient-to-r from-stone-600 to-slate-600 hover:from-stone-700 hover:to-slate-700',
    red: 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700',
    orange: 'bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700',
    amber: 'bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-700 hover:to-yellow-700',
    yellow: 'bg-gradient-to-r from-yellow-500 to-orange-400 hover:from-yellow-600 hover:to-orange-500',
    lime: 'bg-gradient-to-r from-lime-600 to-green-600 hover:from-lime-700 hover:to-green-700',
    green: 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700',
    emerald: 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700',
    teal: 'bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700',
    cyan: 'bg-gradient-to-r from-cyan-600 to-sky-600 hover:from-cyan-700 hover:to-sky-700',
    sky: 'bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700',
    blue: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700',
    indigo: 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700',
    violet: 'bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700',
    purple: 'bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700',
    fuchsia: 'bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-700 hover:to-pink-700',
    pink: 'bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700',
    rose: 'bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-700 hover:to-red-700',
};

// Text-only background gradients
const bgGradientClasses: Record<string, string> = {
    slate: 'bg-gradient-to-br from-slate-50 via-gray-50 to-zinc-50',
    gray: 'bg-gradient-to-br from-gray-50 via-zinc-50 to-neutral-50',
    zinc: 'bg-gradient-to-br from-zinc-50 via-neutral-50 to-stone-50',
    neutral: 'bg-gradient-to-br from-neutral-50 via-stone-50 to-slate-50',
    stone: 'bg-gradient-to-br from-stone-50 via-slate-50 to-gray-50',
    red: 'bg-gradient-to-br from-red-50 via-orange-50 to-amber-50',
    orange: 'bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50',
    amber: 'bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50',
    yellow: 'bg-gradient-to-br from-yellow-50 via-orange-50 to-amber-50',
    lime: 'bg-gradient-to-br from-lime-50 via-green-50 to-emerald-50',
    green: 'bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50',
    emerald: 'bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50',
    teal: 'bg-gradient-to-br from-teal-50 via-cyan-50 to-sky-50',
    cyan: 'bg-gradient-to-br from-cyan-50 via-sky-50 to-blue-50',
    sky: 'bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50',
    blue: 'bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-50',
    indigo: 'bg-gradient-to-br from-indigo-50 via-violet-50 to-purple-50',
    violet: 'bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50',
    purple: 'bg-gradient-to-br from-purple-50 via-fuchsia-50 to-pink-50',
    fuchsia: 'bg-gradient-to-br from-fuchsia-50 via-pink-50 to-rose-50',
    pink: 'bg-gradient-to-br from-pink-50 via-rose-50 to-red-50',
    rose: 'bg-gradient-to-br from-rose-50 via-red-50 to-orange-50',
};

// Text-only border colors
const borderClasses: Record<string, string> = {
    slate: 'border-slate-100',
    gray: 'border-gray-100',
    zinc: 'border-zinc-100',
    neutral: 'border-neutral-100',
    stone: 'border-stone-100',
    red: 'border-red-100',
    orange: 'border-orange-100',
    amber: 'border-amber-100',
    yellow: 'border-yellow-100',
    lime: 'border-lime-100',
    green: 'border-green-100',
    emerald: 'border-emerald-100',
    teal: 'border-teal-100',
    cyan: 'border-cyan-100',
    sky: 'border-sky-100',
    blue: 'border-blue-100',
    indigo: 'border-indigo-100',
    violet: 'border-violet-100',
    purple: 'border-purple-100',
    fuchsia: 'border-fuchsia-100',
    pink: 'border-pink-100',
    rose: 'border-rose-100',
};

// Text-only highlight text color
const textHighlightClasses: Record<string, string> = {
    slate: 'text-slate-700',
    gray: 'text-gray-700',
    zinc: 'text-zinc-700',
    neutral: 'text-neutral-700',
    stone: 'text-stone-700',
    red: 'text-red-700',
    orange: 'text-orange-700',
    amber: 'text-amber-700',
    yellow: 'text-yellow-700',
    lime: 'text-lime-700',
    green: 'text-green-700',
    emerald: 'text-emerald-700',
    teal: 'text-teal-700',
    cyan: 'text-cyan-700',
    sky: 'text-sky-700',
    blue: 'text-blue-700',
    indigo: 'text-indigo-700',
    violet: 'text-violet-700',
    purple: 'text-purple-700',
    fuchsia: 'text-fuchsia-700',
    pink: 'text-pink-700',
    rose: 'text-rose-700',
};

// Image overlay highlight text color (Subtitle) - Lighter variants for dark backgrounds
const overlayHighlightClasses: Record<string, string> = {
    slate: 'text-slate-200',
    gray: 'text-gray-200',
    zinc: 'text-zinc-200',
    neutral: 'text-neutral-200',
    stone: 'text-stone-200',
    red: 'text-red-200',
    orange: 'text-orange-200',
    amber: 'text-amber-200',
    yellow: 'text-yellow-200',
    lime: 'text-lime-200',
    green: 'text-green-200',
    emerald: 'text-emerald-200',
    teal: 'text-teal-200',
    cyan: 'text-cyan-200',
    sky: 'text-sky-200',
    blue: 'text-blue-200',
    indigo: 'text-indigo-200',
    violet: 'text-violet-200',
    purple: 'text-purple-200',
    fuchsia: 'text-fuchsia-200',
    pink: 'text-pink-200',
    rose: 'text-rose-200',
};

export default function FeatureCard({
    title,
    subtitle,
    description,
    imageSrc,
    imageAlt,
    buttonText,
    buttonHref,
    buttonColor,
    highlightColor,
    backgroundColor,
    isTextOnly = false,
    className = '',
    variant = 'centered',
    compact = false,
    subtitleClassName,
}: FeatureCardProps) {
    // Determine effective colors with fallbacks
    const effectiveButtonColor = buttonColorClasses[buttonColor] ? buttonColor : 'green';
    const effectiveHighlightColor = highlightColor && textHighlightClasses[highlightColor] ? highlightColor : effectiveButtonColor;
    const effectiveBackgroundColor = backgroundColor && bgGradientClasses[backgroundColor] ? backgroundColor : effectiveButtonColor;

    if (isTextOnly) {
        return (
            <div
                className={`group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 ${bgGradientClasses[effectiveBackgroundColor]} border ${borderClasses[effectiveBackgroundColor]} flex flex-col ${className}`}
            >
                <div className={`flex-1 flex flex-col justify-center ${compact ? 'p-6' : 'p-6 md:p-8 lg:p-10'}`}>
                    <h3 className={`font-bold text-gray-900 text-center ${compact ? 'text-xl mb-3' : 'text-xl md:text-2xl lg:text-3xl mb-3 md:mb-4'}`}>
                        {title}
                    </h3>
                    {subtitle && (
                        <p className={`${subtitleClassName || textHighlightClasses[effectiveHighlightColor]} font-semibold text-center ${compact ? 'text-sm mb-3' : 'text-sm md:text-base lg:text-lg mb-3 md:mb-4'}`}>
                            {subtitle}
                        </p>
                    )}
                    <div className={`text-gray-700 leading-relaxed text-center ${compact ? 'text-sm mb-6' : 'text-sm md:text-base mb-6 md:mb-8'}`}>
                        {description.split('\n').map((line, i) => (
                            <span key={i} className="block mb-1 last:mb-0">
                                {line}
                            </span>
                        ))}
                    </div>
                    <div className="text-center">
                        <a
                            href={buttonHref}
                            className={`inline-flex items-center justify-center ${buttonColorClasses[effectiveButtonColor]} text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 group/btn ${compact ? 'px-4 py-2' : 'px-4 md:px-6 lg:px-8 py-2 md:py-3 lg:py-4'}`}
                        >
                            <span className="mr-2">{buttonText}</span>
                            <ArrowRight className={`transform group-hover/btn:translate-x-1 transition-transform duration-300 ${compact ? 'w-4 h-4' : 'w-4 h-4 md:w-5 md:h-5'}`} />
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    const isHero = variant === 'hero';

    return (
        <div
            className={`group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 bg-white flex flex-col ${className}`}
        >
            <div className="relative w-full flex-1 overflow-hidden">
                {imageSrc && (
                    <Image
                        src={imageSrc}
                        alt={imageAlt || title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent"></div>
                <div className={`absolute inset-0 flex flex-col justify-end text-white ${compact ? 'p-6' : 'p-6 md:p-8 lg:p-12'}`}>
                    <div className={`${isHero && !compact ? 'max-w-md lg:max-w-3xl' : ''}`}>
                        <h3
                            className={`font-bold leading-tight drop-shadow-lg ${isHero
                                ? compact
                                    ? 'text-2xl mb-3'
                                    : 'text-2xl md:text-3xl lg:text-5xl lg:mb-6'
                                : compact
                                    ? 'text-xl text-center mb-3'
                                    : 'text-xl md:text-2xl lg:text-3xl text-center mb-3 md:mb-4'
                                }`}
                            style={{
                                textShadow:
                                    '1px 1px 2px rgba(0,0,0,0.8), -1px -1px 2px rgba(0,0,0,0.8), 1px -1px 2px rgba(0,0,0,0.8), -1px 1px 2px rgba(0,0,0,0.8)',
                            }}
                        >
                            {title}
                        </h3>
                        {subtitle && (
                            <p
                                className={`font-semibold drop-shadow-md ${isHero
                                    ? (subtitleClassName || overlayHighlightClasses[effectiveHighlightColor]) + (compact ? ' text-lg mb-3' : ' text-lg md:text-xl lg:text-2xl mb-4 lg:mb-6')
                                    : (subtitleClassName || overlayHighlightClasses[effectiveHighlightColor]) + (compact ? ' text-lg mb-3 text-center' : ' text-lg md:text-xl lg:text-2xl mb-3 md:mb-4 text-center')
                                    }`}
                            >
                                {subtitle}
                            </p>
                        )}
                        <div
                            className={`leading-relaxed drop-shadow-md opacity-90 ${isHero
                                ? compact ? 'text-sm mb-4' : 'text-sm md:text-base lg:text-xl mb-4 lg:mb-6'
                                : `text-center ${compact ? 'text-sm mb-4' : 'text-sm md:text-base lg:text-lg mb-4 md:mb-6'}`
                                }`}
                        >
                            {description.split('\n').map((line, i) => (
                                <span key={i} className="block mb-1 last:mb-0">
                                    {line}
                                </span>
                            ))}
                        </div>
                        <div className={`${isHero ? '' : 'text-center'}`}>
                            <a
                                href={buttonHref}
                                className={`inline-flex items-center justify-center ${buttonColorClasses[effectiveButtonColor]} text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 group/btn backdrop-blur-sm ${compact ? 'px-4 py-2' : 'px-4 md:px-6 py-2 md:py-3'}`}
                            >
                                <span className="mr-2">{buttonText}</span>
                                <ArrowRight className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform duration-300" />
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
