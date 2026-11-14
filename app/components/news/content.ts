import type { Descendant } from 'slate';
import type { NewsItem } from '@/lib/database';

/**
 * Content handling for stored news articles.
 *
 * Rows written by the Slate editor hold a JSON array of Slate nodes. Older
 * rows may still hold plain text or a legacy HTML fragment, so the parser
 * keeps all three shapes working and never throws on broken JSON.
 */

export type ParsedArticleContent =
    | { kind: 'slate'; nodes: Descendant[] }
    | { kind: 'html'; html: string }
    | { kind: 'text'; text: string }
    | { kind: 'empty' }
    | { kind: 'invalid' };

const EMPTY_SENTINELS = new Set(['', 'null', 'object']);

const HTML_HINT =
    /<(p|div|h[1-6]|ul|ol|li|br|strong|em|a|img|blockquote|figure|figcaption)\b[^>]*>/i;

const ALLOWED_TAGS = new Set([
    'p',
    'br',
    'h2',
    'h3',
    'h4',
    'ul',
    'ol',
    'li',
    'strong',
    'b',
    'em',
    'i',
    'u',
    'a',
    'blockquote',
    'figure',
    'figcaption',
    'img',
    'hr',
    'code',
    'pre',
]);

const VOID_TAGS = new Set(['br', 'hr', 'img']);

const TAG_TOKEN = /<\/?([a-zA-Z][a-zA-Z0-9]*)((?:"[^"]*"|'[^']*'|[^>"'])*)>/g;

const ATTRIBUTE_TOKEN =
    /([a-zA-Z_:][-a-zA-Z0-9_:.]*)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'>=`]+))/g;

function escapeText(value: string): string {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

function escapeAttribute(value: string): string {
    return escapeText(value).replace(/"/g, '&quot;');
}

function readAttributes(source: string): Record<string, string> {
    const attributes: Record<string, string> = {};
    let match: RegExpExecArray | null;
    ATTRIBUTE_TOKEN.lastIndex = 0;
    while ((match = ATTRIBUTE_TOKEN.exec(source))) {
        attributes[match[1].toLowerCase()] = match[2] ?? match[3] ?? match[4] ?? '';
    }
    return attributes;
}

function safeUrl(value: string, image = false): string | null {
    const url = value.trim();
    if (!url) return null;
    if (/^https?:\/\//i.test(url)) return url;
    // A single leading slash is a local path; "//host" is protocol-relative.
    if (/^\/(?!\/)/.test(url)) return url;
    if (!image && /^mailto:/i.test(url)) return url;
    if (!image && url.startsWith('#')) return url;
    return null;
}

/**
 * Rebuilds a stored HTML fragment from a small allowlist. Text is escaped and
 * tags are written by this function, so no stored attribute or event handler
 * reaches the page. Used only for legacy rows; Slate rows bypass it entirely.
 */
export function sanitizeArticleHtml(input: string): string {
    let html = '';
    let cursor = 0;
    TAG_TOKEN.lastIndex = 0;

    let match: RegExpExecArray | null;
    while ((match = TAG_TOKEN.exec(input))) {
        const [raw, rawName, rawAttributes] = match;
        html += escapeText(input.slice(cursor, match.index));
        cursor = match.index + raw.length;

        const name = rawName.toLowerCase();
        if (!ALLOWED_TAGS.has(name)) continue;

        if (raw.startsWith('</')) {
            if (!VOID_TAGS.has(name)) html += `</${name}>`;
            continue;
        }

        const attributes = readAttributes(rawAttributes);

        if (name === 'img') {
            const src = safeUrl(attributes.src ?? '', true);
            if (!src) continue;
            const alt = attributes.alt
                ? ` alt="${escapeAttribute(attributes.alt)}"`
                : ' alt=""';
            html += `<img src="${escapeAttribute(src)}"${alt} />`;
            continue;
        }

        if (name === 'a') {
            const href = safeUrl(attributes.href ?? '');
            html += href
                ? `<a href="${escapeAttribute(href)}" rel="noopener noreferrer">`
                : '<a>';
            continue;
        }

        html += `<${name}>`;
    }

    html += escapeText(input.slice(cursor));
    return html;
}

function isSlateNodes(value: unknown): value is Descendant[] {
    return (
        Array.isArray(value) &&
        value.length > 0 &&
        value.every((node) => node !== null && typeof node === 'object')
    );
}

function parseJson(raw: string): unknown {
    try {
        return JSON.parse(raw);
    } catch {
        return undefined;
    }
}

/** Turns whatever the database holds into a renderable shape. */
export function parseStoredContent(raw: unknown): ParsedArticleContent {
    if (raw === null || raw === undefined) return { kind: 'empty' };

    if (typeof raw === 'object') {
        if (Array.isArray(raw)) {
            return raw.length === 0
                ? { kind: 'empty' }
                : { kind: 'slate', nodes: raw as Descendant[] };
        }
        const children = (raw as { children?: unknown }).children;
        if (Array.isArray(children) && children.length > 0) {
            return { kind: 'slate', nodes: children as Descendant[] };
        }
        return { kind: 'empty' };
    }

    if (typeof raw !== 'string') return { kind: 'empty' };

    const value = raw.trim();
    if (EMPTY_SENTINELS.has(value)) return { kind: 'empty' };

    if (value.startsWith('[') || value.startsWith('{')) {
        const parsed = parseJson(value);
        if (parsed === undefined) return { kind: 'invalid' };
        if (isSlateNodes(parsed)) return { kind: 'slate', nodes: parsed };
        const children = (parsed as { children?: unknown } | null)?.children;
        if (Array.isArray(children) && children.length > 0) {
            return { kind: 'slate', nodes: children as Descendant[] };
        }
        return { kind: 'empty' };
    }

    if (HTML_HINT.test(value)) {
        return { kind: 'html', html: sanitizeArticleHtml(value) };
    }

    return { kind: 'text', text: value };
}

const HTML_ENTITIES: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&apos;': "'",
    '&nbsp;': ' ',
};

function decodeEntities(value: string): string {
    return value.replace(/&[a-z#0-9]+;/gi, (entity) => {
        return HTML_ENTITIES[entity.toLowerCase()] ?? entity;
    });
}

const INLINE_JOIN_TYPES = new Set([
    'paragraph',
    'heading-one',
    'heading-two',
    'heading-three',
    'heading-four',
    'link',
    'list-item',
    'quote',
    'blockquote',
]);

function slateText(node: unknown): string {
    if (!node || typeof node !== 'object') return '';
    const element = node as {
        type?: string;
        text?: unknown;
        children?: unknown;
    };
    if (typeof element.text === 'string') return element.text;
    if (!Array.isArray(element.children)) return '';

    // Leaves inside a paragraph keep their own spacing; blocks get a break.
    const separator =
        element.type && !INLINE_JOIN_TYPES.has(element.type) ? ' ' : '';
    return element.children.map(slateText).join(separator);
}

/** Plain text of an article body, without markup. */
export function plainTextFromContent(raw: unknown): string {
    const parsed = parseStoredContent(raw);

    if (parsed.kind === 'slate') {
        return parsed.nodes
            .map(slateText)
            .join(' ')
            .replace(/\s+/g, ' ')
            .trim();
    }

    if (parsed.kind === 'html') {
        return decodeEntities(parsed.html.replace(/<[^>]*>/g, ' '))
            .replace(/\s+/g, ' ')
            .trim();
    }

    if (parsed.kind === 'text') {
        return parsed.text.replace(/\s+/g, ' ').trim();
    }

    return '';
}

/** First sentences of the body, cut at a word boundary. */
export function excerptOf(raw: unknown, maxLength = 220): string {
    const text = plainTextFromContent(raw);
    if (!text) return '';
    if (text.length <= maxLength) return text;

    const cut = text.slice(0, maxLength);
    const lastSpace = cut.lastIndexOf(' ');
    const body = lastSpace > maxLength * 0.6 ? cut.slice(0, lastSpace) : cut;
    return `${body.replace(/[,;:.\s]+$/, '')} …`;
}

/** Pinned entries first (their editor order), then newest first. */
export function sortNews(items: NewsItem[]): NewsItem[] {
    return [...items].sort((a, b) => {
        if (Boolean(a.isPinned) !== Boolean(b.isPinned)) {
            return a.isPinned ? -1 : 1;
        }

        if (a.isPinned && b.isPinned) {
            const orderA = a.pinnedOrder ?? 0;
            const orderB = b.pinnedOrder ?? 0;
            if (orderA !== orderB) return orderA - orderB;
            return (b.pinnedAt?.getTime() ?? 0) - (a.pinnedAt?.getTime() ?? 0);
        }

        return b.publishedDate.getTime() - a.publishedDate.getTime();
    });
}

export function newsCategories(items: NewsItem[]): string[] {
    return Array.from(new Set(items.map((item) => item.category))).sort(
        (a, b) => a.localeCompare(b, 'de'),
    );
}
