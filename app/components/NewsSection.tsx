import NewsCard from './NewsCard';

export default function NewsSection() {
    const newsItems = [
        {
            category: 'Bildung',
            title: 'Bücherbus hält wieder im Ort',
            colorClasses: {
                border: 'bg-amber-500/70',
                dot: 'bg-amber-500/70',
                hover: 'group-hover:text-amber-500',
            },
        },
        {
            category: 'Gemeinschaft',
            title: 'Bücherzelle für Jung und Alt',
            colorClasses: {
                border: 'bg-green-600/70',
                dot: 'bg-green-600/70',
                hover: 'group-hover:text-green-600',
            },
        },
        {
            category: 'Feuerwehr',
            title: 'Feuerwehr für Kinder gründet sich',
            colorClasses: {
                border: 'bg-red-600/70',
                dot: 'bg-red-600/70',
                hover: 'group-hover:text-red-600',
            },
        },
        {
            category: 'Digital',
            title: 'Neue Webseite ist online',
            colorClasses: {
                border: 'bg-indigo-500/70',
                dot: 'bg-indigo-500/70',
                hover: 'group-hover:text-indigo-500',
            },
        },
    ];

    return (
        <div className="mb-16 mt-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
                {newsItems.map((item, index) => (
                    <NewsCard
                        key={index}
                        category={item.category}
                        title={item.title}
                        colorClasses={item.colorClasses}
                    />
                ))}
            </div>
        </div>
    );
}
