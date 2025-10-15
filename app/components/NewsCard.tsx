'use client';

import { getCategoryColorClasses } from '@/lib/news-utils';

interface NewsCardProps {
    category: string;
    title: string;
    publishedDate: Date;
}

export default function NewsCard({ category, title, publishedDate }: NewsCardProps) {
    const colors = getCategoryColorClasses(category);
    const formattedDate = publishedDate.toLocaleDateString('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });

    return (
        <div className="relative rounded-lg shadow-lg border border-gray-200 bg-white hover:shadow-xl transition-all duration-300 overflow-hidden group flex flex-col">
            <div
                className="h-1"
                style={{ backgroundColor: colors.borderColor, opacity: 0.7 }}
            ></div>
            <div className="p-3 md:p-4 lg:p-6 flex flex-col flex-grow">
                <div className="flex items-center justify-between mb-2 md:mb-3 lg:mb-4">
                    <div className="flex items-center">
                        <div
                            className="w-2 h-2 rounded-full mr-2 md:mr-3"
                            style={{
                                backgroundColor: colors.dotColor,
                                opacity: 0.7,
                            }}
                        ></div>
                        <span className="text-xs md:text-sm text-gray-600 font-medium">
                            {category}
                        </span>
                    </div>
                    <span className="text-xs md:text-sm text-gray-500">
                        {formattedDate}
                    </span>
                </div>
                <h3
                    className="text-sm md:text-base lg:text-lg font-semibold text-gray-900 mb-2 md:mb-3 transition-colors duration-200 group-hover:text-opacity-90"
                    style={
                        {
                            '--hover-color': colors.hoverColor,
                        } as React.CSSProperties & { '--hover-color': string }
                    }
                    onMouseEnter={(e) => {
                        e.currentTarget.style.color = colors.hoverColor;
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.color = '';
                    }}
                >
                    {title}
                </h3>
            </div>
        </div>
    );
}
