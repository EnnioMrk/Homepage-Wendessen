'use client';

import { ReactNode } from 'react';

interface PageHeaderProps {
    title: string;
    subtitle?: string;
    icon?: ReactNode;
    /**
     * Primary color for the header
     * Can be a Tailwind color class like 'emerald' or 'blue'
     * Defaults to 'primary'
     */
    color?: string;
    /**
     * Optional background image URL
     * Will be displayed with opacity overlay
     */
    backgroundImage?: string;
    /**
     * Custom background color (Tailwind class)
     * Overrides the color prop if provided
     */
    backgroundColor?: string;
    /**
     * Icon color (Tailwind class)
     * Defaults to 'text-white'
     */
    iconColor?: string;
    /**
     * Title text color (Tailwind class)
     * Defaults to 'text-white'
     */
    titleColor?: string;
    /**
     * Subtitle text color (Tailwind class)
     * Defaults to 'text-white/90'
     */
    subtitleColor?: string;
    /**
     * Divider color (Tailwind class)
     * Defaults to 'bg-white/30'
     */
    dividerColor?: string;
}

export default function PageHeader({
    title,
    subtitle,
    icon,
    color = 'slate',
    backgroundImage,
    backgroundColor,
    iconColor = 'text-white',
    titleColor = 'text-white',
    subtitleColor = 'text-white/90',
    dividerColor = 'bg-white/30',
}: PageHeaderProps) {
    // Map color names to specific Tailwind classes
    const colorMap: Record<string, { bg: string; accent: string }> = {
        primary: { bg: 'bg-primary', accent: 'from-primary to-secondary' },
        emerald: {
            bg: 'bg-emerald-700',
            accent: 'from-emerald-600 to-teal-600',
        },
        blue: { bg: 'bg-blue-700', accent: 'from-blue-600 to-indigo-600' },
        green: { bg: 'bg-green-700', accent: 'from-green-600 to-emerald-600' },
        red: { bg: 'bg-red-700', accent: 'from-red-600 to-orange-600' },
        purple: {
            bg: 'bg-purple-700',
            accent: 'from-purple-600 to-indigo-600',
        },
        indigo: {
            bg: 'bg-indigo-700',
            accent: 'from-indigo-600 to-purple-600',
        },
        slate: { bg: 'bg-slate-700', accent: 'from-slate-600 to-gray-700' },
        orange: { bg: 'bg-orange-700', accent: 'from-orange-600 to-red-600' },
        pink: { bg: 'bg-pink-700', accent: 'from-pink-600 to-rose-600' },
        amber: { bg: 'bg-amber-700', accent: 'from-amber-600 to-yellow-600' },
    };

    const colors = colorMap[color] || colorMap.slate;
    const bgColor = backgroundColor || colors.bg;

    return (
        <div className={`relative ${bgColor} py-16 overflow-hidden`}>
            {/* Background Image */}
            {backgroundImage && (
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-20"
                    style={{ backgroundImage: `url('${backgroundImage}')` }}
                />
            )}

            {/* Solid overlay - no gradient */}
            <div className={`absolute inset-0 ${bgColor} opacity-95`} />

            {/* Subtle pattern overlay */}
            <div
                className="absolute inset-0 opacity-10"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}
            />

            {/* Content */}
            <div className="relative z-10 container mx-auto px-4 text-center">
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center justify-center gap-4 mb-4">
                        {icon && (
                            <div
                                className={`${iconColor} [&>svg]:w-12 [&>svg]:h-12 md:[&>svg]:w-14 md:[&>svg]:h-14`}
                            >
                                {icon}
                            </div>
                        )}
                        <h1
                            className={`text-4xl md:text-5xl lg:text-6xl font-bold ${titleColor}`}
                        >
                            {title}
                        </h1>
                    </div>
                    {subtitle && (
                        <>
                            <div
                                className={`w-32 h-1 ${dividerColor} mx-auto mb-6 rounded-full`}
                            />
                            <p
                                className={`${subtitleColor} text-lg max-w-2xl mx-auto leading-relaxed`}
                            >
                                {subtitle}
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
