'use client';

import { useCallback, useMemo, useState, useEffect } from 'react';
import isHotkey from 'is-hotkey';
import { createEditor, Descendant, Editor, Transforms, Element as SlateElement } from 'slate';
import { Slate, Editable, withReact, RenderElementProps, RenderLeafProps } from 'slate-react';
import { withHistory } from 'slate-history';
import {
    TextB,
    TextItalic,
    TextUnderline,
    TextHOne,
    TextHTwo,
    ListBullets,
    ListNumbers,
    Link as LinkIcon,
    Image as ImageIcon,
    X,
} from '@phosphor-icons/react';
import Image from 'next/image';

// Type definitions for Slate
// ImageElement type is not used directly here.
type CustomElement = SlateElement & Record<string, unknown>;

interface GalleryImage {
    id: number;
    filename: string;
    originalName: string;
    displayName: string;
    url: string;
    size: number;
    mimeType: string;
    uploadedAt: string;
}

interface EnhancedRichTextEditorProps {
    value: Descendant[];
    onChange: (value: Descendant[]) => void;
    placeholder?: string;
}

const HOTKEYS: Record<string, string> = {
    'mod+b': 'bold',
    'mod+i': 'italic',
    'mod+u': 'underline',
};

const LIST_TYPES = ['numbered-list', 'bulleted-list'];

export default function EnhancedRichTextEditor({ value, onChange, placeholder = 'Artikel-Inhalt hier schreiben...' }: EnhancedRichTextEditorProps) {
    const editor = useMemo(() => {
        const e = withHistory(withReact(createEditor()));
        if (!e.children || e.children.length === 0) {
            e.children = value && value.length > 0 ? value : [{ type: 'paragraph', children: [{ text: '' }] }];
        }
        return e;
    }, [value]);
    
    const [showLinkInput, setShowLinkInput] = useState(false);
    const [linkUrl, setLinkUrl] = useState('');
    const [showGalleryModal, setShowGalleryModal] = useState(false);
    const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
    const [loadingGallery, setLoadingGallery] = useState(false);
    const [gallerySearch, setGallerySearch] = useState('');

    const fetchGalleryImages = async () => {
        setLoadingGallery(true);
        try {
            const response = await fetch('/api/admin/gallery');
            if (response.ok) {
                const data = await response.json();
                setGalleryImages(data.images || []);
            }
        } catch (error) {
            console.error('Error fetching gallery images:', error);
        } finally {
            setLoadingGallery(false);
        }
    };

    useEffect(() => {
        if (showGalleryModal) {
            fetchGalleryImages();
        }
    }, [showGalleryModal]);

    const filteredImages = galleryImages.filter(img => 
        img.displayName.toLowerCase().includes(gallerySearch.toLowerCase()) ||
        img.originalName.toLowerCase().includes(gallerySearch.toLowerCase())
    );

    const renderElement = useCallback((props: RenderElementProps) => {
        const element = props.element as CustomElement;
        
        switch (element.type) {
            case 'heading-one':
                return <h1 className="text-3xl font-bold mb-4" {...props.attributes}>{props.children}</h1>;
            case 'heading-two':
                return <h2 className="text-2xl font-semibold mb-3" {...props.attributes}>{props.children}</h2>;
            case 'bulleted-list':
                return <ul className="list-disc list-inside mb-4" {...props.attributes}>{props.children}</ul>;
            case 'numbered-list':
                return <ol className="list-decimal list-inside mb-4" {...props.attributes}>{props.children}</ol>;
            case 'list-item':
                return <li className="mb-1" {...props.attributes}>{props.children}</li>;
            case 'link':
                return (
                    <a
                        href={element.url}
                        className="text-primary underline hover:text-primary-dark"
                        {...props.attributes}
                    >
                        {props.children}
                    </a>
                );
            case 'image':
                return (
                    <div {...props.attributes} contentEditable={false} className="my-4">
                        <div className="relative inline-block max-w-full">
                            <Image
                                src={element.url}
                                alt={element.alt || 'Bild'}
                                width={800}
                                height={600}
                                className="rounded-lg shadow-md max-w-full h-auto"
                                style={{ objectFit: 'contain' }}
                            />
                            {element.alt && (
                                <p className="text-sm text-gray-600 text-center mt-2 italic">
                                    {element.alt}
                                </p>
                            )}
                        </div>
                        {props.children}
                    </div>
                );
            default:
                return <p className="mb-4" {...props.attributes}>{props.children}</p>;
        }
    }, []);

    const renderLeaf = useCallback((props: RenderLeafProps) => {
        let children = <span {...props.attributes}>{props.children}</span>;
        
        if (props.leaf.bold) {
            children = <strong>{children}</strong>;
        }
        if (props.leaf.italic) {
            children = <em>{children}</em>;
        }
        if (props.leaf.underline) {
            children = <u>{children}</u>;
        }

        return children;
    }, []);

    const toggleMark = (format: string) => {
        const isActive = isMarkActive(editor, format);
        if (isActive) {
            Editor.removeMark(editor, format);
        } else {
            Editor.addMark(editor, format, true);
        }
    };

    const toggleBlock = (format: string) => {
        const isActive = isBlockActive(editor, format);
        const isList = LIST_TYPES.includes(format);

        Transforms.unwrapNodes(editor, {
            match: n => !Editor.isEditor(n) && SlateElement.isElement(n) && LIST_TYPES.includes(((n as CustomElement).type as string) || ''),
            split: true,
        });

        const newProperties: Partial<SlateElement> = {
            type: isActive ? 'paragraph' : (isList ? 'list-item' : format) as string,
        };
        Transforms.setNodes<SlateElement>(editor, newProperties);

        if (!isActive && isList) {
            const block: CustomElement = { type: format as 'numbered-list' | 'bulleted-list', children: [] } as CustomElement;
            Transforms.wrapNodes(editor, block as SlateElement);
        }
    };

    const insertLink = () => {
        if (!linkUrl) return;
        
        const { selection } = editor;
        const isCollapsed = selection && selection.anchor.offset === selection.focus.offset;

        if (isCollapsed) {
            const link: CustomElement = { type: 'link', url: linkUrl, children: [{ text: linkUrl }] } as CustomElement;
            Transforms.insertNodes(editor, link as SlateElement);
        } else {
            Transforms.wrapNodes(
                editor,
                { type: 'link', url: linkUrl, children: [] } as CustomElement,
                { split: true }
            );
        }
        
        setLinkUrl('');
        setShowLinkInput(false);
    };

    const insertImage = (url: string, alt: string) => {
        const image: CustomElement = { type: 'image', url, alt, children: [{ text: '' }] } as CustomElement;
        
        Transforms.insertNodes(editor, image);
        Transforms.insertNodes(editor, { type: 'paragraph', children: [{ text: '' }] } as SlateElement);
        
        setShowGalleryModal(false);
        setGallerySearch('');
    };

    const isMarkActive = (editor: Editor, format: string) => {
        const marks = Editor.marks(editor);
        return marks ? marks[format as keyof typeof marks] === true : false;
    };

    const isBlockActive = (editor: Editor, format: string) => {
        const { selection } = editor;
        if (!selection) return false;

        const [match] = Array.from(
            Editor.nodes(editor, {
                at: Editor.unhangRange(editor, selection),
                match: n => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === format,
            })
        );

        return !!match;
    };

    const ToolbarButton = ({ active, onMouseDown, children, title }: { active: boolean; onMouseDown: () => void; children: React.ReactNode; title: string }) => (
        <button
            type="button"
            onMouseDown={(e) => {
                e.preventDefault();
                onMouseDown();
            }}
            className={`p-2 rounded hover:bg-gray-200 transition-colors ${
                active ? 'bg-gray-300 text-primary' : 'text-gray-700'
            }`}
            title={title}
        >
            {children}
        </button>
    );

    return (
        <>
            <div className="border border-gray-300 overflow-hidden h-full flex flex-col">
                <div className="bg-gray-50 border-b border-gray-300 p-2 flex flex-wrap gap-1 flex-shrink-0">
                    <ToolbarButton
                        active={isMarkActive(editor, 'bold')}
                        onMouseDown={() => toggleMark('bold')}
                        title="Fett (Strg+B)"
                    >
                        <TextB className="w-5 h-5" weight="bold" />
                    </ToolbarButton>
                    <ToolbarButton
                        active={isMarkActive(editor, 'italic')}
                        onMouseDown={() => toggleMark('italic')}
                        title="Kursiv (Strg+I)"
                    >
                        <TextItalic className="w-5 h-5" />
                    </ToolbarButton>
                    <ToolbarButton
                        active={isMarkActive(editor, 'underline')}
                        onMouseDown={() => toggleMark('underline')}
                        title="Unterstrichen (Strg+U)"
                    >
                        <TextUnderline className="w-5 h-5" />
                    </ToolbarButton>

                    <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

                    <ToolbarButton
                        active={isBlockActive(editor, 'heading-one')}
                        onMouseDown={() => toggleBlock('heading-one')}
                        title="Überschrift 1"
                    >
                        <TextHOne className="w-5 h-5" />
                    </ToolbarButton>
                    <ToolbarButton
                        active={isBlockActive(editor, 'heading-two')}
                        onMouseDown={() => toggleBlock('heading-two')}
                        title="Überschrift 2"
                    >
                        <TextHTwo className="w-5 h-5" />
                    </ToolbarButton>

                    <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

                    <ToolbarButton
                        active={isBlockActive(editor, 'bulleted-list')}
                        onMouseDown={() => toggleBlock('bulleted-list')}
                        title="Aufzählungsliste"
                    >
                        <ListBullets className="w-5 h-5" />
                    </ToolbarButton>
                    <ToolbarButton
                        active={isBlockActive(editor, 'numbered-list')}
                        onMouseDown={() => toggleBlock('numbered-list')}
                        title="Nummerierte Liste"
                    >
                        <ListNumbers className="w-5 h-5" />
                    </ToolbarButton>

                    <div className="w-px h-6 bg-gray-300 mx-1 self-center" />

                    <button
                        type="button"
                        onMouseDown={(e) => {
                            e.preventDefault();
                            setShowLinkInput(!showLinkInput);
                        }}
                        className="p-2 rounded hover:bg-gray-200 transition-colors text-gray-700"
                        title="Link einfügen"
                    >
                        <LinkIcon className="w-5 h-5" />
                    </button>

                    <button
                        type="button"
                        onMouseDown={(e) => {
                            e.preventDefault();
                            setShowGalleryModal(true);
                        }}
                        className="p-2 rounded hover:bg-gray-200 transition-colors text-gray-700"
                        title="Bild aus Galerie einfügen"
                    >
                        <ImageIcon className="w-5 h-5" />
                    </button>

                    {showLinkInput && (
                        <div className="flex items-center gap-2 ml-2">
                            <input
                                type="url"
                                value={linkUrl}
                                onChange={(e) => setLinkUrl(e.target.value)}
                                placeholder="https://..."
                                className="px-2 py-1 border border-gray-300 rounded text-sm w-64 text-gray-900"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        insertLink();
                                    }
                                }}
                            />
                            <button
                                type="button"
                                onClick={insertLink}
                                className="px-3 py-1 bg-primary text-white rounded text-sm hover:bg-primary-dark"
                            >
                                OK
                            </button>
                        </div>
                    )}
                </div>

                <Slate editor={editor} initialValue={value} onChange={onChange}>
                    <Editable
                        renderElement={renderElement}
                        renderLeaf={renderLeaf}
                        placeholder={placeholder}
                        className="p-4 h-full focus:outline-none text-gray-900 overflow-y-auto overflow-x-hidden break-words"
                        onKeyDown={(event) => {
                            for (const hotkey in HOTKEYS) {
                                if (isHotkey(hotkey, event as unknown as KeyboardEvent)) {
                                    event.preventDefault();
                                    const mark = HOTKEYS[hotkey];
                                    toggleMark(mark);
                                }
                            }
                        }}
                    />
                </Slate>
            </div>

            {/* Gallery Modal */}
            {showGalleryModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[9999]">
                    <div className="bg-white rounded-lg p-6 max-w-5xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">Bild aus Galerie wählen</h2>
                            <button
                                onClick={() => {
                                    setShowGalleryModal(false);
                                    setGallerySearch('');
                                }}
                                className="p-2 text-gray-600 hover:bg-gray-100 rounded-md"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="mb-4">
                            <input
                                type="text"
                                value={gallerySearch}
                                onChange={(e) => setGallerySearch(e.target.value)}
                                placeholder="Bilder durchsuchen..."
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900"
                            />
                        </div>

                        {loadingGallery ? (
                            <div className="flex items-center justify-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                            </div>
                        ) : filteredImages.length === 0 ? (
                            <div className="text-center py-12">
                                <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-600">
                                    {gallerySearch ? 'Keine Bilder gefunden' : 'Keine Bilder in der Galerie'}
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {filteredImages.map((image) => (
                                    <button
                                        key={image.id}
                                        type="button"
                                        onClick={() => insertImage(image.url, image.displayName)}
                                        className="group relative aspect-square overflow-hidden rounded-lg border-2 border-gray-200 hover:border-primary transition-colors"
                                    >
                                        <Image
                                            src={image.url}
                                            alt={image.displayName}
                                            fill
                                            className="object-cover"
                                        />
                                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity flex items-center justify-center">
                                            <span className="text-white opacity-0 group-hover:opacity-100 text-sm font-medium px-2 text-center">
                                                {image.displayName}
                                            </span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}

// Simple hotkey checker
function isHotkey(hotkey: string, event: KeyboardEvent): boolean {
    const keys = hotkey.split('+');
    const modKey = keys[0] === 'mod';
    const key = keys[keys.length - 1];
    
    if (modKey && (event.ctrlKey || event.metaKey)) {
        return event.key.toLowerCase() === key.toLowerCase();
    }
    
    return false;
}
