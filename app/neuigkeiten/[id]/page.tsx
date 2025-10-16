import { notFound } from 'next/navigation';
import { neon } from '@neondatabase/serverless';
import { ArrowLeft } from '@phosphor-icons/react/dist/ssr';
import Link from 'next/link';
import ArticleRenderer from '@/app/components/ArticleRenderer';
import { Descendant } from 'slate';

const sql = neon(process.env.DATABASE_URL!);

interface NewsArticle {
    id: string;
    title: string;
    content: string;
    category: string;
    published_date: string;
}

async function getArticle(articleId: string): Promise<NewsArticle | null> {
    try {
        const result = await sql`
            SELECT id, title, content, category, published_date
            FROM news
            WHERE article_id = ${articleId}
        `;

        if (result.length === 0) {
            return null;
        }

        return result[0] as NewsArticle;
    } catch (error) {
        console.error('Error fetching article:', error);
        return null;
    }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const article = await getArticle(id);

    if (!article) {
        return {
            title: 'Artikel nicht gefunden',
        };
    }

    return {
        title: `${article.title} - Wendessen`,
        description: article.content || 'Neuigkeiten aus Wendessen',
    };
}

export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const article = await getArticle(id);

    if (!article) {
        notFound();
    }

    let contentJson: Descendant[];
    
    // Parse content (which is now JSON)
    const contentString = typeof article.content === 'string' 
        ? article.content 
        : JSON.stringify(article.content);
    
    if (!contentString || contentString === 'null' || contentString === 'object' || contentString.trim() === '') {
        contentJson = [
            {
                type: 'paragraph',
                children: [{ text: 'Dieser Artikel hat noch keinen Inhalt.' }],
            },
        ];
    } else {
        try {
            contentJson = typeof article.content === 'string'
                ? JSON.parse(article.content)
                : article.content as Descendant[];
        } catch (error) {
            console.error('Error parsing article content:', error);
            contentJson = [
                {
                    type: 'paragraph',
                    children: [{ text: 'Fehler beim Laden des Artikels.' }],
                },
            ];
        }
    }

    const publishedDate = new Date(article.published_date);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto">
                    {/* Back Button */}
                    <Link
                        href="/"
                        className="inline-flex items-center text-gray-600 hover:text-primary mb-8 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Zurück zur Startseite
                    </Link>

                    {/* Article Header */}
                    <article className="bg-white rounded-2xl shadow-xl overflow-hidden">
                        <div className="bg-gradient-to-r from-primary to-primary-dark p-8 md:p-12">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium text-white">
                                    {article.category}
                                </span>
                                <span className="text-white/80 text-sm">
                                    {publishedDate.toLocaleDateString('de-DE', {
                                        day: '2-digit',
                                        month: 'long',
                                        year: 'numeric',
                                    })}
                                </span>
                            </div>
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
                                {article.title}
                            </h1>
                        </div>

                        {/* Article Content */}
                        <div className="p-8 md:p-12">
                            <ArticleRenderer content={contentJson} />
                        </div>
                    </article>
                </div>
            </div>
        </div>
    );
}
