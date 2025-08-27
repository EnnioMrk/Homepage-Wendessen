import Image from 'next/image';

interface FeatureCardProps {
    title: string;
    subtitle?: string;
    description: string;
    imageSrc?: string;
    imageAlt?: string;
    buttonText: string;
    buttonHref: string;
    buttonColor:
        | 'green'
        | 'red'
        | 'blue'
        | 'orange'
        | 'lime'
        | 'pink'
        | 'indigo'
        | 'emerald';
    isTextOnly?: boolean;
    className?: string;
}

const buttonColorClasses = {
    green: 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700',
    red: 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700',
    blue: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700',
    orange: 'bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700',
    lime: 'bg-gradient-to-r from-green-600 to-lime-600 hover:from-green-700 hover:to-lime-700',
    pink: 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700',
    indigo: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700',
    emerald:
        'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700',
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
    isTextOnly = false,
    className = '',
}: FeatureCardProps) {
    if (isTextOnly) {
        return (
            <div
                className={`group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 border border-green-100 ${className}`}
            >
                <div className="p-6 md:p-8 lg:p-10 h-full flex flex-col justify-center">
                    <h3 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-3 md:mb-4 text-center">
                        {title}
                    </h3>
                    {subtitle && (
                        <p className="text-sm md:text-base lg:text-lg text-green-700 font-semibold mb-3 md:mb-4 text-center">
                            {subtitle}
                        </p>
                    )}
                    <p className="text-sm md:text-base text-gray-700 leading-relaxed text-center mb-6 md:mb-8">
                        {description}
                    </p>
                    <div className="text-center">
                        <a
                            href={buttonHref}
                            className={`inline-flex items-center justify-center px-4 md:px-6 lg:px-8 py-2 md:py-3 lg:py-4 ${buttonColorClasses[buttonColor]} text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 group/btn`}
                        >
                            <span className="mr-2">{buttonText}</span>
                            <svg
                                className="w-4 h-4 md:w-5 md:h-5 transform group-hover/btn:translate-x-1 transition-transform duration-300"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                                />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            className={`group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 bg-white ${className}`}
        >
            <div className="relative h-64 md:h-80 lg:h-96 overflow-hidden">
                {imageSrc && (
                    <Image
                        src={imageSrc}
                        alt={imageAlt || title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent"></div>
                <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-end text-white">
                    <h3
                        className="text-xl md:text-2xl lg:text-3xl font-bold mb-3 md:mb-4 leading-tight drop-shadow-lg"
                        style={{
                            textShadow:
                                '1px 1px 2px rgba(0,0,0,0.8), -1px -1px 2px rgba(0,0,0,0.8), 1px -1px 2px rgba(0,0,0,0.8), -1px 1px 2px rgba(0,0,0,0.8)',
                        }}
                    >
                        {title}
                    </h3>
                    {subtitle && (
                        <p className="text-lg md:text-xl lg:text-2xl text-red-200 font-semibold mb-3 md:mb-4 drop-shadow-md">
                            {subtitle}
                        </p>
                    )}
                    <p className="text-sm md:text-base lg:text-lg leading-relaxed drop-shadow-md opacity-90 mb-4 md:mb-6">
                        {description}
                    </p>
                    <div>
                        <a
                            href={buttonHref}
                            className={`inline-flex items-center justify-center px-4 md:px-6 py-2 md:py-3 ${buttonColorClasses[buttonColor]} text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 group/btn backdrop-blur-sm`}
                        >
                            <span className="mr-2">{buttonText}</span>
                            <svg
                                className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform duration-300"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                                />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
