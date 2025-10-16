'use client';

import { useCallback, useMemo, useState } from 'react';
import { createEditor, Descendant, Editor, Transforms, Element as SlateElement, BaseEditor } from 'slate';
import { Slate, Editable, withReact, ReactEditor, RenderElementProps, RenderLeafProps } from 'slate-react';
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
} from '@phosphor-icons/react';

// Type definitions for Slate
type CustomElement = 
    | { type: 'paragraph'; children: CustomText[] }
    | { type: 'heading-one'; children: CustomText[] }
    | { type: 'heading-two'; children: CustomText[] }
    | { type: 'bulleted-list'; children: CustomElement[] }
    | { type: 'numbered-list'; children: CustomElement[] }
    | { type: 'list-item'; children: CustomText[] }
    | { type: 'link'; url: string; children: CustomText[] };

type CustomText = {
    text: string;
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
};

declare module 'slate' {
    interface CustomTypes {
        Editor: BaseEditor & ReactEditor;
        Element: CustomElement;
        Text: CustomText;
    }
}

interface RichTextEditorProps {
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

export default function RichTextEditor({ value, onChange, placeholder = 'Artikel-Inhalt hier schreiben...' }: RichTextEditorProps) {
    const editor = useMemo(() => {
        const e = withHistory(withReact(createEditor()));
        // Ensure editor has valid initial content
        if (!e.children || e.children.length === 0) {
            e.children = value && value.length > 0 ? value : [{ type: 'paragraph', children: [{ text: '' }] }];
        }
        return e;
    }, []);
    const [showLinkInput, setShowLinkInput] = useState(false);
    const [linkUrl, setLinkUrl] = useState('');

    const renderElement = useCallback((props: RenderElementProps) => {
        switch (props.element.type) {
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
                        href={props.element.url}
                        className="text-primary underline hover:text-primary-dark"
                        {...props.attributes}
                    >
                        {props.children}
                    </a>
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
            match: n => !Editor.isEditor(n) && SlateElement.isElement(n) && LIST_TYPES.includes(n.type),
            split: true,
        });

        const newProperties: Partial<SlateElement> = {
            type: isActive ? 'paragraph' : (isList ? 'list-item' : format) as CustomElement['type'],
        };
        Transforms.setNodes<SlateElement>(editor, newProperties);

        if (!isActive && isList) {
            const block: CustomElement = { type: format as 'numbered-list' | 'bulleted-list', children: [] };
            Transforms.wrapNodes(editor, block);
        }
    };

    const insertLink = () => {
        if (!linkUrl) return;
        
        const { selection } = editor;
        const isCollapsed = selection && selection.anchor.offset === selection.focus.offset;
        
        if (isCollapsed) {
            const link: CustomElement = {
                type: 'link',
                url: linkUrl,
                children: [{ text: linkUrl }],
            };
            Transforms.insertNodes(editor, link);
        } else {
            Transforms.wrapNodes(
                editor,
                { type: 'link', url: linkUrl, children: [] },
                { split: true }
            );
        }
        
        setLinkUrl('');
        setShowLinkInput(false);
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
