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

import {
    BUTTON_COLOR_CLASSES,
    BG_GRADIENT_CLASSES,
    BORDER_CLASSES,
    TEXT_HIGHLIGHT_CLASSES,
    OVERLAY_HIGHLIGHT_CLASSES,
} from '@/lib/constants/ui';

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
    const effectiveButtonColor = BUTTON_COLOR_CLASSES[buttonColor] ? buttonColor : 'green';
    const effectiveHighlightColor = highlightColor && TEXT_HIGHLIGHT_CLASSES[highlightColor] ? highlightColor : effectiveButtonColor;
    const effectiveBackgroundColor = backgroundColor && BG_GRADIENT_CLASSES[backgroundColor] ? backgroundColor : effectiveButtonColor;

    const isHero = variant === 'hero';

    if (isTextOnly) {
        return (
            <div
                className={`group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 ${BG_GRADIENT_CLASSES[effectiveBackgroundColor]} border ${BORDER_CLASSES[effectiveBackgroundColor]} flex flex-col ${className}`}
            >
                <div className={`flex-1 flex flex-col justify-end ${compact ? 'p-6' : 'p-6 md:p-8 lg:p-10'}`}>
                    <h3 className={`font-bold text-gray-900 ${isHero ? 'text-left' : 'text-center'} ${compact ? 'text-xl mb-3' : 'text-xl md:text-2xl lg:text-3xl mb-3 md:mb-4'}`}>
                        {title}
                    </h3>
                    {subtitle && (
                        <p className={`${subtitleClassName || TEXT_HIGHLIGHT_CLASSES[effectiveHighlightColor]} font-semibold ${isHero ? 'text-left' : 'text-center'} ${compact ? 'text-sm mb-3' : 'text-sm md:text-base lg:text-lg mb-3 md:mb-4'}`}>
                            {subtitle}
                        </p>
                    )}
                    <div className={`text-gray-700 leading-relaxed ${isHero ? 'text-left' : 'text-center'} ${compact ? 'text-sm mb-6' : 'text-sm md:text-base mb-6 md:mb-8'}`}>
                        {description.split('\n').map((line, i) => (
                            <span key={i} className="block mb-1 last:mb-0">
                                {line}
                            </span>
                        ))}
                    </div>
                    <div className={isHero ? '' : 'text-center'}>
                        <a
                            href={buttonHref}
                            className={`inline-flex items-center justify-center ${BUTTON_COLOR_CLASSES[effectiveButtonColor]} text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 group/btn ${compact ? 'px-4 py-2' : 'px-4 md:px-6 lg:px-8 py-2 md:py-3 lg:py-4'}`}
                        >
                            <span className="mr-2">{buttonText}</span>
                            <ArrowRight className={`transform group-hover/btn:translate-x-1 transition-transform duration-300 ${compact ? 'w-4 h-4' : 'w-4 h-4 md:w-5 md:h-5'}`} />
                        </a>
                    </div>
                </div>
            </div>
        );
    }

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
                                    ? (subtitleClassName || OVERLAY_HIGHLIGHT_CLASSES[effectiveHighlightColor]) + (compact ? ' text-lg mb-3' : ' text-lg md:text-xl lg:text-2xl mb-4 lg:mb-6')
                                    : (subtitleClassName || OVERLAY_HIGHLIGHT_CLASSES[effectiveHighlightColor]) + (compact ? ' text-lg mb-3 text-center' : ' text-lg md:text-xl lg:text-2xl mb-3 md:mb-4 text-center')
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
                                className={`inline-flex items-center justify-center ${BUTTON_COLOR_CLASSES[effectiveButtonColor]} text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 group/btn backdrop-blur-sm ${compact ? 'px-4 py-2' : 'px-4 md:px-6 py-2 md:py-3'}`}
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
