'use client';

import React, { useCallback, useMemo, useState, useEffect } from 'react';
import isHotkey from 'is-hotkey';
import {
    createEditor,
    Descendant,
    Editor,
    Transforms,
    Element as SlateElement,
} from 'slate';
import {
    Slate,
    Editable,
    withReact,
    RenderElementProps,
    RenderLeafProps,
    ReactEditor,
} from 'slate-react';
import { withHistory } from 'slate-history';
import Image from 'next/image';
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
    PencilSimple,
    Trash,
} from '@phosphor-icons/react';

type GalleryImage = {
    id: number;
    filename: string;
    originalName: string;
    displayName: string;
    url: string;
    size: number;
    mimeType: string;
    uploadedAt: string;
};

type ImageSize = 'small' | 'medium' | 'large' | 'full';
type ImagePosition = 'left' | 'center' | 'right';

type ImageElement = {
    type: 'image';
    url: string;
    alt?: string;
    imageSize?: ImageSize;
    position?: ImagePosition;
    textFlow?: boolean;
    children: Descendant[];
};
type CustomElement =
    | { type: 'paragraph'; children: Descendant[] }
    | { type: 'heading-one'; children: Descendant[] }
    | { type: 'heading-two'; children: Descendant[] }
    | { type: 'bulleted-list'; children: Descendant[] }
    | { type: 'numbered-list'; children: Descendant[] }
    | { type: 'list-item'; children: Descendant[] }
    | { type: 'link'; url: string; children: Descendant[] }
    | ImageElement;
// CustomText intentionally omitted - Slate's Descendant[] is used for content typing

interface Props {
    value: Descendant[];
    onChange: (v: Descendant[]) => void;
    placeholder?: string;
}
const HOTKEYS: Record<string, string> = {
    'mod+b': 'bold',
    'mod+i': 'italic',
    'mod+u': 'underline',
};
const LIST_TYPES = ['numbered-list', 'bulleted-list'];

export default function EnhancedRichTextEditor({
    value,
    onChange,
    placeholder = 'Artikel-Inhalt hier schreiben...',
}: Props) {
    const editor = useMemo<Editor>(
        () => withHistory(withReact(createEditor() as unknown as Editor)),
        []
    );

    useEffect(() => {
        // ensure editor has initial children when value is empty
        if (!editor.children || editor.children.length === 0)
            editor.children =
                value && value.length > 0
                    ? value
                    : [{ type: 'paragraph', children: [{ text: '' }] }];
    }, [value, editor]);

    const [showLinkInput, setShowLinkInput] = useState(false);
    const [linkUrl, setLinkUrl] = useState('');
    const [showGalleryModal, setShowGalleryModal] = useState(false);
    const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
    const [loadingGallery, setLoadingGallery] = useState(false);
    const [gallerySearch, setGallerySearch] = useState('');
    const [selectedGalleryImage, setSelectedGalleryImage] =
        useState<GalleryImage | null>(null);
    const [imageSize, setImageSize] = useState<ImageSize>('medium');
    const [imagePosition, setImagePosition] = useState<ImagePosition>('center');
    const [imageTextFlow, setImageTextFlow] = useState<boolean>(false);
    const [editingImagePath, setEditingImagePath] = useState<number[] | null>(
        null
    );
    const [editingImageElement, setEditingImageElement] =
        useState<ImageElement | null>(null);

    const fetchGalleryImages = useCallback(async () => {
        setLoadingGallery(true);
        try {
            const res = await fetch('/api/admin/gallery');
            if (res.ok) {
                const data = await res.json();
                setGalleryImages(data.images || []);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoadingGallery(false);
        }
    }, []);

    useEffect(() => {
        if (showGalleryModal) fetchGalleryImages();
    }, [showGalleryModal, fetchGalleryImages]);

    const filteredImages = galleryImages.filter(
        (i) =>
            i.displayName.toLowerCase().includes(gallerySearch.toLowerCase()) ||
            i.originalName.toLowerCase().includes(gallerySearch.toLowerCase())
    );

    const renderElement = useCallback(
        (props: RenderElementProps) => {
            const el = props.element as CustomElement;
            switch (el.type) {
                case 'heading-one':
                    return (
                        <h1
                            {...props.attributes}
                            className="text-3xl font-bold mb-4"
                        >
                            {props.children}
                        </h1>
                    );
                case 'heading-two':
                    return (
                        <h2
                            {...props.attributes}
                            className="text-2xl font-semibold mb-3"
                        >
                            {props.children}
                        </h2>
                    );
                case 'bulleted-list':
                    return (
                        <ul
                            {...props.attributes}
                            className="list-disc list-inside mb-4"
                        >
                            {props.children}
                        </ul>
                    );
                case 'numbered-list':
                    return (
                        <ol
                            {...props.attributes}
                            className="list-decimal list-inside mb-4"
                        >
                            {props.children}
                        </ol>
                    );
                case 'list-item':
                    return (
                        <li {...props.attributes} className="mb-1">
                            {props.children}
                        </li>
                    );
                case 'link': {
                    const maybe = el as { url?: unknown };
                    const href =
                        typeof maybe.url === 'string' ? maybe.url : '#';
                    return (
                        <a
                            {...props.attributes}
                            href={href}
                            className="text-primary underline hover:text-primary-dark"
                        >
                            {props.children}
                        </a>
                    );
                }
                case 'image': {
                    const img = el as ImageElement;
                    const size = img.imageSize || 'medium';
                    const pos = img.position || 'center';
                    const textFlow = img.textFlow ?? false;

                    const sizeClasses: Record<ImageSize, string> = {
                        small: 'max-w-[200px]',
                        medium: 'max-w-[400px]',
                        large: 'max-w-[600px]',
                        full: 'max-w-full',
                    };

                    const getAlignmentClass = (position: ImagePosition) => {
                        if (position === 'left') return 'text-left';
                        if (position === 'right') return 'text-right';
                        return 'text-center';
                    };

                    const getFloatClasses = (position: ImagePosition) => {
                        if (position === 'left') return 'float-left mr-4 mb-2';
                        if (position === 'right')
                            return 'float-right ml-4 mb-2';
                        return '';
                    };

                    const handleEditImage = (e: React.MouseEvent) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const path = ReactEditor.findPath(
                            editor,
                            props.element
                        );
                        setEditingImagePath(path);
                        setEditingImageElement(img);
                        setImageSize(img.imageSize || 'medium');
                        setImagePosition(img.position || 'center');
                        setImageTextFlow(img.textFlow ?? false);
                    };

                    const handleDeleteImage = (e: React.MouseEvent) => {
                        e.preventDefault();
                        e.stopPropagation();
                        const path = ReactEditor.findPath(
                            editor,
                            props.element
                        );
                        Transforms.removeNodes(editor, { at: path });
                    };

                    if (textFlow && pos !== 'center') {
                        // Text flows around image
                        return (
                            <div
                                {...props.attributes}
                                contentEditable={false}
                                className={`group relative ${
                                    sizeClasses[size]
                                } ${getFloatClasses(pos)}`}
                            >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={img.url}
                                    alt={img.alt || 'Bild'}
                                    className="rounded-lg shadow-md w-full h-auto"
                                />
                                {/* Edit/Delete overlay */}
                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                    <button
                                        type="button"
                                        onClick={handleEditImage}
                                        className="p-1.5 bg-white rounded-full shadow-md hover:bg-gray-100 text-gray-700"
                                        title="Bild bearbeiten"
                                    >
                                        <PencilSimple className="w-4 h-4" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleDeleteImage}
                                        className="p-1.5 bg-white rounded-full shadow-md hover:bg-red-50 text-red-600"
                                        title="Bild entfernen"
                                    >
                                        <Trash className="w-4 h-4" />
                                    </button>
                                </div>
                                {props.children}
                            </div>
                        );
                    }

                    // Image on its own line with alignment
                    return (
                        <div
                            {...props.attributes}
                            contentEditable={false}
                            className={`my-4 clear-both ${getAlignmentClass(
                                pos
                            )}`}
                        >
                            <div
                                className={`relative inline-block ${sizeClasses[size]} group`}
                            >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={img.url}
                                    alt={img.alt || 'Bild'}
                                    className="rounded-lg shadow-md w-full h-auto"
                                />
                                {img.alt && (
                                    <p className="text-sm text-gray-600 text-center mt-2 italic">
                                        {img.alt}
                                    </p>
                                )}
                                {/* Edit/Delete overlay */}
                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                    <button
                                        type="button"
                                        onClick={handleEditImage}
                                        className="p-1.5 bg-white rounded-full shadow-md hover:bg-gray-100 text-gray-700"
                                        title="Bild bearbeiten"
                                    >
                                        <PencilSimple className="w-4 h-4" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleDeleteImage}
                                        className="p-1.5 bg-white rounded-full shadow-md hover:bg-red-50 text-red-600"
                                        title="Bild entfernen"
                                    >
                                        <Trash className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            {props.children}
                        </div>
                    );
                }
                default:
                    return (
                        <p {...props.attributes} className="mb-4">
                            {props.children}
                        </p>
                    );
            }
        },
        [editor]
    );

    const renderLeaf = useCallback((props: RenderLeafProps) => {
        let children = <span {...props.attributes}>{props.children}</span>;
        if (props.leaf.bold) children = <strong>{children}</strong>;
        if (props.leaf.italic) children = <em>{children}</em>;
        if (props.leaf.underline) children = <u>{children}</u>;
        return children;
    }, []);

    const isMarkActive = (ed: Editor, format: string) => {
        const marks = Editor.marks(ed) as Record<string, unknown> | null;
        return !!marks && marks[format] === true;
    };
    const toggleMark = (format: string) => {
        const isActive = isMarkActive(editor, format);
        if (isActive) Editor.removeMark(editor, format);
        else Editor.addMark(editor, format, true);
    };

    const isBlockActive = (ed: Editor, format: string) => {
        const { selection } = ed;
        if (!selection) return false;
        const [match] = Array.from(
            Editor.nodes(ed, {
                at: Editor.unhangRange(ed, selection),
                match: (n) =>
                    !Editor.isEditor(n) &&
                    SlateElement.isElement(n) &&
                    (n as SlateElement).type === format,
            })
        );
        return !!match;
    };

    const toggleBlock = (format: string) => {
        const isActive = isBlockActive(editor, format);
        const isList = LIST_TYPES.includes(format);
        Transforms.unwrapNodes(editor, {
            match: (n) =>
                !Editor.isEditor(n) &&
                SlateElement.isElement(n) &&
                LIST_TYPES.includes(((n as SlateElement).type as string) || ''),
            split: true,
        });
        const possible = [
            'paragraph',
            'heading-one',
            'heading-two',
            'bulleted-list',
            'numbered-list',
            'list-item',
            'link',
            'image',
        ];
        const formatStr = String(format);
        const chosen = isActive
            ? 'paragraph'
            : isList
            ? 'list-item'
            : possible.includes(formatStr)
            ? formatStr
            : 'paragraph';
        const newProps = { type: chosen as CustomElement['type'] };
        Transforms.setNodes(
            editor,
            newProps as unknown as Partial<SlateElement>
        );
        if (!isActive && isList) {
            const block: CustomElement = {
                type: format as 'numbered-list' | 'bulleted-list',
                children: [],
            } as CustomElement;
            Transforms.wrapNodes(editor, block as unknown as SlateElement);
        }
    };

    const insertLink = (url: string) => {
        if (!url) return;
        const selection = editor.selection;
        const isCollapsed =
            !selection ||
            (selection.anchor &&
                selection.focus &&
                selection.anchor.path === selection.focus.path &&
                selection.anchor.offset === selection.focus.offset);
        const linkEl: CustomElement = {
            type: 'link',
            url,
            children: [{ text: url }],
        } as CustomElement;
        const linkWrap: CustomElement = {
            type: 'link',
            url,
            children: [],
        } as CustomElement;
        if (isCollapsed)
            Transforms.insertNodes(editor, linkEl as unknown as SlateElement);
        else
            Transforms.wrapNodes(editor, linkWrap as unknown as SlateElement, {
                split: true,
            });
    };

    const insertImage = (
        url: string,
        alt?: string,
        size: ImageSize = 'medium',
        position: ImagePosition = 'center',
        textFlow: boolean = false
    ) => {
        const image: ImageElement = {
            type: 'image',
            url,
            alt,
            imageSize: size,
            position,
            textFlow,
            children: [{ text: '' }],
        };
        Transforms.insertNodes(editor, image as unknown as SlateElement);
        const para: CustomElement = {
            type: 'paragraph',
            children: [{ text: '' }],
        } as CustomElement;
        Transforms.insertNodes(editor, para as unknown as SlateElement);
        setShowGalleryModal(false);
        setGallerySearch('');
        setSelectedGalleryImage(null);
        setImageSize('medium');
        setImagePosition('center');
        setImageTextFlow(false);
    };

    const updateImage = (
        path: number[],
        size: ImageSize,
        position: ImagePosition,
        textFlow: boolean
    ) => {
        Transforms.setNodes(
            editor,
            { imageSize: size, position, textFlow } as Partial<SlateElement>,
            { at: path }
        );
        setEditingImagePath(null);
        setEditingImageElement(null);
        setImageSize('medium');
        setImagePosition('center');
        setImageTextFlow(false);
    };

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
                                        insertLink(linkUrl);
                                        setShowLinkInput(false);
                                        setLinkUrl('');
                                    }
                                }}
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    insertLink(linkUrl);
                                    setShowLinkInput(false);
                                    setLinkUrl('');
                                }}
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
                                if (
                                    isHotkey(
                                        hotkey,
                                        event as unknown as KeyboardEvent
                                    )
                                ) {
                                    event.preventDefault();
                                    const mark = HOTKEYS[hotkey];
                                    toggleMark(mark);
                                }
                            }
                        }}
                    />
                </Slate>
            </div>

            {showGalleryModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[9999]">
                    <div className="bg-white rounded-lg p-6 max-w-5xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">
                                {selectedGalleryImage
                                    ? 'Bildoptionen'
                                    : 'Bild aus Galerie wählen'}
                            </h2>
                            <button
                                onClick={() => {
                                    setShowGalleryModal(false);
                                    setGallerySearch('');
                                    setSelectedGalleryImage(null);
                                    setImageSize('medium');
                                    setImagePosition('center');
                                }}
                                className="p-2 text-gray-600 hover:bg-gray-100 rounded-md"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {selectedGalleryImage ? (
                            /* Image Options View */
                            <div className="space-y-6">
                                {/* Back button */}
                                <button
                                    type="button"
                                    onClick={() =>
                                        setSelectedGalleryImage(null)
                                    }
                                    className="text-sm text-gray-600 hover:text-gray-900 flex items-center gap-1"
                                >
                                    ← Zurück zur Galerie
                                </button>

                                {/* Preview */}
                                <div className="bg-gray-100 rounded-lg p-4">
                                    <p className="text-sm text-gray-600 mb-3 font-medium">
                                        Vorschau:
                                    </p>
                                    <div
                                        className={`${
                                            imagePosition === 'left'
                                                ? 'text-left'
                                                : imagePosition === 'right'
                                                ? 'text-right'
                                                : 'text-center'
                                        }`}
                                    >
                                        <div
                                            className={`inline-block ${
                                                imageSize === 'small'
                                                    ? 'max-w-[150px]'
                                                    : imageSize === 'medium'
                                                    ? 'max-w-[250px]'
                                                    : imageSize === 'large'
                                                    ? 'max-w-[350px]'
                                                    : 'max-w-full'
                                            }`}
                                        >
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={selectedGalleryImage.url}
                                                alt={
                                                    selectedGalleryImage.displayName
                                                }
                                                className="rounded-lg shadow-md w-full h-auto"
                                            />
                                        </div>
                                    </div>
                                    {imagePosition !== 'center' && (
                                        <p className="text-xs text-gray-500 mt-2 italic">
                                            Bei Links/Rechts-Ausrichtung kann
                                            Text neben dem Bild fließen.
                                        </p>
                                    )}
                                </div>

                                {/* Size Selection */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Bildgröße
                                    </label>
                                    <div className="grid grid-cols-4 gap-2">
                                        {[
                                            {
                                                value: 'small',
                                                label: 'Klein',
                                                desc: '200px',
                                            },
                                            {
                                                value: 'medium',
                                                label: 'Mittel',
                                                desc: '400px',
                                            },
                                            {
                                                value: 'large',
                                                label: 'Groß',
                                                desc: '600px',
                                            },
                                            {
                                                value: 'full',
                                                label: 'Volle Breite',
                                                desc: '100%',
                                            },
                                        ].map((option) => (
                                            <button
                                                key={option.value}
                                                type="button"
                                                onClick={() =>
                                                    setImageSize(
                                                        option.value as ImageSize
                                                    )
                                                }
                                                className={`px-3 py-2 rounded-lg border-2 text-sm font-medium transition-colors ${
                                                    imageSize === option.value
                                                        ? 'border-primary bg-primary/10 text-primary'
                                                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                                                }`}
                                            >
                                                <div>{option.label}</div>
                                                <div className="text-xs text-gray-500">
                                                    {option.desc}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Position Selection */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Position
                                    </label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {[
                                            {
                                                value: 'left',
                                                label: 'Links',
                                                desc: 'Linksbündig',
                                            },
                                            {
                                                value: 'center',
                                                label: 'Zentriert',
                                                desc: 'Mittig',
                                            },
                                            {
                                                value: 'right',
                                                label: 'Rechts',
                                                desc: 'Rechtsbündig',
                                            },
                                        ].map((option) => (
                                            <button
                                                key={option.value}
                                                type="button"
                                                onClick={() =>
                                                    setImagePosition(
                                                        option.value as ImagePosition
                                                    )
                                                }
                                                className={`px-3 py-2 rounded-lg border-2 text-sm font-medium transition-colors ${
                                                    imagePosition ===
                                                    option.value
                                                        ? 'border-primary bg-primary/10 text-primary'
                                                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                                                }`}
                                            >
                                                <div>{option.label}</div>
                                                <div className="text-xs text-gray-500">
                                                    {option.desc}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Text Flow Toggle */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Textumfluss
                                    </label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setImageTextFlow(false)
                                            }
                                            className={`px-3 py-2 rounded-lg border-2 text-sm font-medium transition-colors ${
                                                !imageTextFlow
                                                    ? 'border-primary bg-primary/10 text-primary'
                                                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                                            }`}
                                        >
                                            <div>Eigene Zeile</div>
                                            <div className="text-xs text-gray-500">
                                                Text beginnt darunter
                                            </div>
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setImageTextFlow(true)
                                            }
                                            disabled={
                                                imagePosition === 'center'
                                            }
                                            className={`px-3 py-2 rounded-lg border-2 text-sm font-medium transition-colors ${
                                                imageTextFlow &&
                                                imagePosition !== 'center'
                                                    ? 'border-primary bg-primary/10 text-primary'
                                                    : imagePosition === 'center'
                                                    ? 'border-gray-100 text-gray-400 cursor-not-allowed'
                                                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                                            }`}
                                        >
                                            <div>Text daneben</div>
                                            <div className="text-xs text-gray-500">
                                                {imagePosition === 'center'
                                                    ? 'Nur bei Links/Rechts'
                                                    : 'Text fließt um das Bild'}
                                            </div>
                                        </button>
                                    </div>
                                </div>

                                {/* Insert Button */}
                                <div className="flex justify-end gap-3 pt-4 border-t">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setSelectedGalleryImage(null)
                                        }
                                        className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium"
                                    >
                                        Abbrechen
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            insertImage(
                                                selectedGalleryImage.url,
                                                selectedGalleryImage.displayName,
                                                imageSize,
                                                imagePosition,
                                                imageTextFlow &&
                                                    imagePosition !== 'center'
                                            )
                                        }
                                        className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark"
                                    >
                                        Bild einfügen
                                    </button>
                                </div>
                            </div>
                        ) : (
                            /* Gallery Grid View */
                            <>
                                <div className="mb-4">
                                    <input
                                        type="text"
                                        value={gallerySearch}
                                        onChange={(e) =>
                                            setGallerySearch(e.target.value)
                                        }
                                        placeholder="Bilder durchsuchen..."
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-gray-900"
                                    />
                                </div>

                                {loadingGallery ? (
                                    <div className="flex items-center justify-center py-12">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
                                    </div>
                                ) : filteredImages.length === 0 ? (
                                    <div className="text-center py-12">
                                        <ImageIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-600">
                                            {gallerySearch
                                                ? 'Keine Bilder gefunden'
                                                : 'Keine Bilder in der Galerie'}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                        {filteredImages.map((image) => (
                                            <button
                                                key={image.id}
                                                type="button"
                                                onClick={() =>
                                                    setSelectedGalleryImage(
                                                        image
                                                    )
                                                }
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
                            </>
                        )}
                    </div>
                </div>
            )}

            {/* Edit Image Modal */}
            {editingImagePath && editingImageElement && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[9999]">
                    <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-900">
                                Bild bearbeiten
                            </h2>
                            <button
                                onClick={() => {
                                    setEditingImagePath(null);
                                    setEditingImageElement(null);
                                    setImageSize('medium');
                                    setImagePosition('center');
                                    setImageTextFlow(false);
                                }}
                                className="p-2 text-gray-600 hover:bg-gray-100 rounded-md"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="space-y-6">
                            {/* Preview */}
                            <div className="bg-gray-100 rounded-lg p-4">
                                <p className="text-sm text-gray-600 mb-3 font-medium">
                                    Vorschau:
                                </p>
                                <div
                                    className={`${
                                        imagePosition === 'left'
                                            ? 'text-left'
                                            : imagePosition === 'right'
                                            ? 'text-right'
                                            : 'text-center'
                                    }`}
                                >
                                    <div
                                        className={`inline-block ${
                                            imageSize === 'small'
                                                ? 'max-w-[150px]'
                                                : imageSize === 'medium'
                                                ? 'max-w-[250px]'
                                                : imageSize === 'large'
                                                ? 'max-w-[350px]'
                                                : 'max-w-full'
                                        }`}
                                    >
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={editingImageElement.url}
                                            alt={
                                                editingImageElement.alt ||
                                                'Bild'
                                            }
                                            className="rounded-lg shadow-md w-full h-auto"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Size Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Bildgröße
                                </label>
                                <div className="grid grid-cols-4 gap-2">
                                    {[
                                        {
                                            value: 'small',
                                            label: 'Klein',
                                            desc: '200px',
                                        },
                                        {
                                            value: 'medium',
                                            label: 'Mittel',
                                            desc: '400px',
                                        },
                                        {
                                            value: 'large',
                                            label: 'Groß',
                                            desc: '600px',
                                        },
                                        {
                                            value: 'full',
                                            label: 'Volle Breite',
                                            desc: '100%',
                                        },
                                    ].map((option) => (
                                        <button
                                            key={option.value}
                                            type="button"
                                            onClick={() =>
                                                setImageSize(
                                                    option.value as ImageSize
                                                )
                                            }
                                            className={`px-3 py-2 rounded-lg border-2 text-sm font-medium transition-colors ${
                                                imageSize === option.value
                                                    ? 'border-primary bg-primary/10 text-primary'
                                                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                                            }`}
                                        >
                                            <div>{option.label}</div>
                                            <div className="text-xs text-gray-500">
                                                {option.desc}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Position Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Position
                                </label>
                                <div className="grid grid-cols-3 gap-2">
                                    {[
                                        {
                                            value: 'left',
                                            label: 'Links',
                                            desc: 'Linksbündig',
                                        },
                                        {
                                            value: 'center',
                                            label: 'Zentriert',
                                            desc: 'Mittig',
                                        },
                                        {
                                            value: 'right',
                                            label: 'Rechts',
                                            desc: 'Rechtsbündig',
                                        },
                                    ].map((option) => (
                                        <button
                                            key={option.value}
                                            type="button"
                                            onClick={() =>
                                                setImagePosition(
                                                    option.value as ImagePosition
                                                )
                                            }
                                            className={`px-3 py-2 rounded-lg border-2 text-sm font-medium transition-colors ${
                                                imagePosition === option.value
                                                    ? 'border-primary bg-primary/10 text-primary'
                                                    : 'border-gray-200 hover:border-gray-300 text-gray-700'
                                            }`}
                                        >
                                            <div>{option.label}</div>
                                            <div className="text-xs text-gray-500">
                                                {option.desc}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Text Flow Toggle */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Textumfluss
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setImageTextFlow(false)}
                                        className={`px-3 py-2 rounded-lg border-2 text-sm font-medium transition-colors ${
                                            !imageTextFlow
                                                ? 'border-primary bg-primary/10 text-primary'
                                                : 'border-gray-200 hover:border-gray-300 text-gray-700'
                                        }`}
                                    >
                                        <div>Eigene Zeile</div>
                                        <div className="text-xs text-gray-500">
                                            Text beginnt darunter
                                        </div>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setImageTextFlow(true)}
                                        disabled={imagePosition === 'center'}
                                        className={`px-3 py-2 rounded-lg border-2 text-sm font-medium transition-colors ${
                                            imageTextFlow &&
                                            imagePosition !== 'center'
                                                ? 'border-primary bg-primary/10 text-primary'
                                                : imagePosition === 'center'
                                                ? 'border-gray-100 text-gray-400 cursor-not-allowed'
                                                : 'border-gray-200 hover:border-gray-300 text-gray-700'
                                        }`}
                                    >
                                        <div>Text daneben</div>
                                        <div className="text-xs text-gray-500">
                                            {imagePosition === 'center'
                                                ? 'Nur bei Links/Rechts'
                                                : 'Text fließt um das Bild'}
                                        </div>
                                    </button>
                                </div>
                            </div>

                            {/* Save Button */}
                            <div className="flex justify-end gap-3 pt-4 border-t">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditingImagePath(null);
                                        setEditingImageElement(null);
                                        setImageSize('medium');
                                        setImagePosition('center');
                                        setImageTextFlow(false);
                                    }}
                                    className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium"
                                >
                                    Abbrechen
                                </button>
                                <button
                                    type="button"
                                    onClick={() =>
                                        updateImage(
                                            editingImagePath,
                                            imageSize,
                                            imagePosition,
                                            imageTextFlow &&
                                                imagePosition !== 'center'
                                        )
                                    }
                                    className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark"
                                >
                                    Änderungen speichern
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

function ToolbarButton({
    active,
    onMouseDown,
    children,
    title,
}: {
    active: boolean;
    onMouseDown: () => void;
    children: React.ReactNode;
    title: string;
}) {
    return (
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
}
