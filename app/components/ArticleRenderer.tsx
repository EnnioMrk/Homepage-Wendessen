'use client';

import { Descendant } from 'slate';
import Image from 'next/image';

interface ArticleRendererProps {
    content: Descendant[];
}

export default function ArticleRenderer({ content }: ArticleRendererProps) {
    const renderNode = (node: Descendant, index: number): React.ReactNode => {
        if ('text' in node) {
            let text: React.ReactNode = node.text;
            
            if (node.bold) {
                text = <strong>{text}</strong>;
            }
            if (node.italic) {
                text = <em>{text}</em>;
            }
            if (node.underline) {
                text = <u>{text}</u>;
            }
            
            return <span key={index}>{text}</span>;
        }

        const element = node as { type: string; children: Descendant[]; url?: string };
        const children = element.children.map((child, idx) => renderNode(child, idx));

        switch (element.type) {
            case 'heading-one':
                return (
                    <h1 key={index} className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">
                        {children}
                    </h1>
                );
            case 'heading-two':
                return (
                    <h2 key={index} className="text-2xl md:text-3xl font-semibold mb-4 text-gray-900">
                        {children}
                    </h2>
                );
            case 'bulleted-list':
                return (
                    <ul key={index} className="list-disc list-outside ml-6 mb-6 space-y-2">
                        {children}
                    </ul>
                );
            case 'numbered-list':
                return (
                    <ol key={index} className="list-decimal list-outside ml-6 mb-6 space-y-2">
                        {children}
                    </ol>
                );
            case 'list-item':
                return (
                    <li key={index} className="text-gray-700 leading-relaxed">
                        {children}
                    </li>
                );
            case 'link':
                return (
                    <a
                        key={index}
                        href={element.url}
                        className="text-primary underline hover:text-primary-dark transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {children}
                    </a>
                );
            case 'image':
                const imageElement = element as { type: 'image'; url: string; alt?: string; children: Descendant[] };
                return (
                    <div key={index} className="my-6">
                        <div className="relative w-full" style={{ maxWidth: '800px', margin: '0 auto' }}>
                            <Image
                                src={imageElement.url}
                                alt={imageElement.alt || 'Bild'}
                                width={800}
                                height={600}
                                className="rounded-lg shadow-md w-full h-auto"
                                style={{ objectFit: 'contain' }}
                            />
                            {imageElement.alt && (
                                <p className="text-sm text-gray-600 text-center mt-2 italic">
                                    {imageElement.alt}
                                </p>
                            )}
                        </div>
                    </div>
                );
            default:
                return (
                    <p key={index} className="text-gray-700 mb-4 leading-relaxed">
                        {children}
                    </p>
                );
        }
    };

    return (
        <div className="prose prose-lg max-w-none">
            {content.map((node, index) => renderNode(node, index))}
        </div>
    );
}
