'use client';

import { useState } from 'react';
import { Descendant } from 'slate';
import EnhancedRichTextEditor from './EnhancedRichTextEditor';

interface NewsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    title?: string;
}

const initialEditorValue: Descendant[] = [
    {
        type: 'paragraph',
        children: [{ text: '' }],
    },
];

export default function NewsModal({
    isOpen,
    onClose,
    onSuccess,
    title = 'Neue Nachricht hinzufügen',
}: NewsModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [articleContent, setArticleContent] = useState<Descendant[]>(initialEditorValue);
    const [newsTitle, setNewsTitle] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);
        const newsData = {
            title: formData.get('title'),
            content: formData.get('content'),
            category: formData.get('category'),
            contentJson: JSON.stringify(articleContent),
        };

        try {
            const response = await fetch('/api/admin/news', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newsData),
            });

            if (response.ok) {
                onClose();
                if (onSuccess) {
                    onSuccess();
                }
                // Reset form
                (e.target as HTMLFormElement).reset();
                setNewsTitle('');
                setArticleContent(initialEditorValue);
            } else {
                console.error('Failed to create news');
            }
        } catch (error) {
            console.error('Error creating news:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center">
                <div
                    className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                    onClick={onClose}
                ></div>

                <div className="relative inline-block align-middle bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                    <form onSubmit={handleSubmit}>
                        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">
                                {title}
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <input
                                        name="title"
                                        type="text"
                                        placeholder="Titel"
                                        required
                                        disabled={isLoading}
                                        value={newsTitle}
                                        onChange={(e) => setNewsTitle(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 text-gray-900"
                                    />
                                </div>

                                <div>
                                    <textarea
                                        name="content"
                                        placeholder="Kurzbeschreibung (wird auf der Startseite angezeigt)"
                                        rows={3}
                                        required
                                        disabled={isLoading}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 text-gray-900"
                                    />
                                </div>

                                <div>
                                    <select
                                        name="category"
                                        required
                                        disabled={isLoading}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white disabled:bg-gray-100 text-gray-900"
                                    >
                                        <option value="">Kategorie wählen</option>
                                        <option value="Bildung">Bildung</option>
                                        <option value="Gemeinschaft">Gemeinschaft</option>
                                        <option value="Feuerwehr">Feuerwehr</option>
                                        <option value="Digital">Digital</option>
                                        <option value="Sport">Sport</option>
                                        <option value="Kultur">Kultur</option>
                                        <option value="Verwaltung">Verwaltung</option>
                                    </select>
                                </div>

                                <div className="border-t border-gray-200 pt-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Artikel-Inhalt
                                    </label>
                                        <EnhancedRichTextEditor
                                            value={articleContent}
                                            onChange={setArticleContent}
                                            placeholder="Schreiben Sie hier den vollständigen Artikel..."
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Erstelle...' : 'Erstellen'}
                            </button>
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={isLoading}
                                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
                            >
                                Abbrechen
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
