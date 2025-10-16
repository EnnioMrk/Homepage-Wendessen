import { getRecentNews, NewsItem } from '@/lib/database';
import NewsCard from './NewsCard';

export default async function NewsSection() {
    let newsItems: NewsItem[];

    try {
        newsItems = await getRecentNews(4);
    } catch (error) {
        console.error('Failed to fetch news:', error);
        // Fallback to empty array if database fails
        newsItems = [];
    }

    return (
        <div className="mb-16 mt-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
                {newsItems.map((item) => (
                    <NewsCard
                        key={item.id}
                        category={item.category}
                        title={item.title}
                        publishedDate={item.publishedDate}
                        articleId={item.articleId}
                    />
                ))}
            </div>
        </div>
    );
}
