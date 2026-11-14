import { Notice } from '@/app/components/register/Layout';
import ArticleRenderer from './ArticleRenderer';
import { parseStoredContent } from './content';
import styles from './article-body.module.css';

/**
 * Renders a stored article body in whichever shape the row holds: Slate
 * nodes, a legacy HTML fragment, or plain text. Empty and broken rows get a
 * ruled notice instead of a blank column.
 */
export function ArticleBody({ content }: { content: unknown }) {
    const parsed = parseStoredContent(content);

    if (parsed.kind === 'empty') {
        return (
            <Notice tone="info" title="Noch kein Inhalt">
                Dieser Artikel hat noch keinen Inhalt.
            </Notice>
        );
    }

    if (parsed.kind === 'invalid') {
        return (
            <Notice tone="error" title="Inhalt nicht lesbar">
                Fehler beim Laden des Artikels.
            </Notice>
        );
    }

    if (parsed.kind === 'html') {
        return (
            <div
                className="prose"
                // Sanitised from the store's allowlist in content.ts.
                dangerouslySetInnerHTML={{ __html: parsed.html }}
            />
        );
    }

    if (parsed.kind === 'text') {
        const paragraphs = parsed.text
            .split(/\n{2,}/)
            .map((part) => part.trim())
            .filter(Boolean);

        return (
            <div className="prose">
                {paragraphs.map((paragraph, index) => (
                    <p key={index} className={styles.plainText}>
                        {paragraph}
                    </p>
                ))}
            </div>
        );
    }

    return <ArticleRenderer content={parsed.nodes} />;
}
