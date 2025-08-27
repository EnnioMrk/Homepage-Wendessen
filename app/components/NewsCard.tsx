interface NewsCardProps {
    category: string;
    title: string;
    colorClasses: {
        border: string;
        dot: string;
        hover: string;
    };
}

export default function NewsCard({ category, title, colorClasses }: NewsCardProps) {
    return (
        <div className="relative rounded-lg shadow-lg border border-gray-200 bg-white hover:shadow-xl transition-all duration-300 overflow-hidden group">
            <div className={`h-1 ${colorClasses.border}`}></div>
            <div className="p-3 md:p-4 lg:p-6">
                <div className="flex items-center mb-2 md:mb-3 lg:mb-4">
                    <div className={`w-2 h-2 ${colorClasses.dot} rounded-full mr-2 md:mr-3`}></div>
                    <span className="text-xs md:text-sm text-gray-600 font-medium">
                        {category}
                    </span>
                </div>
                <h3 className={`text-sm md:text-base lg:text-lg font-semibold text-gray-900 mb-2 md:mb-3 ${colorClasses.hover} transition-colors duration-200`}>
                    {title}
                </h3>
            </div>
        </div>
    );
}
