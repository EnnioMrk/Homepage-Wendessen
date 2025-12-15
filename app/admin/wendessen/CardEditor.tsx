'use client';

import React from 'react';
import { PencilSimple, ImageSquare, Trash } from '@phosphor-icons/react';
import TailwindColorPicker from '@/app/admin/components/TailwindColorPicker';
import FeatureCard from '@/app/components/FeatureCard';

interface CardEditorProps {
    cardKey: 'card_1' | 'card_2' | 'card_3';
    index: number;
    formData: any;
    updateCard: (cardKey: 'card_1'|'card_2'|'card_3', field: string, value: any) => void;
    updateCardTheme: (cardKey: 'card_1'|'card_2'|'card_3', theme: any) => void;
    setShowImagePicker: (v: 'card_1'|'card_2'|'card_3'|null) => void;
}

export default function CardEditor({ cardKey, index, formData, updateCard, updateCardTheme, setShowImagePicker }: CardEditorProps) {
    return (
        <div className={'bg-white p-6 rounded-lg shadow ' + (index === 0 ? 'lg:col-span-2' : '')}>
            <div className="flex justify-between items-start mb-6 border-b pb-4">
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                        {index === 0 ? 'Karte 1' : index === 1 ? 'Karte 2' : 'Karte 3'}
                    </h3>
                    <p className="text-sm text-gray-500">
                        {index === 0 ? 'Die Hauptkarte, nimmt viel Platz ein.' : 'Kleinere Karte an der Seite.'}
                    </p>
                </div>
            </div>

            <div className={'grid grid-cols-1 gap-6 ' + (index === 0 ? 'md:grid-cols-2' : 'min-[1400px]:grid-cols-2')}>
                <div className="space-y-6">
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <h4 className="text-sm font-semibold text-gray-900 mb-3">Design & Farben</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-gray-100 shadow-sm">
                                <span className="text-sm text-gray-600 font-medium">Primärfarbe</span>
                                <TailwindColorPicker
                                    value={formData[cardKey].theme.highlight}
                                    onChange={(color) => updateCardTheme(cardKey, { ...formData[cardKey].theme, highlight: color })}
                                />
                            </div>

                            <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-gray-100 shadow-sm">
                                <span className="text-sm text-gray-600 font-medium">Hintergrund</span>
                                <TailwindColorPicker
                                    value={formData[cardKey].theme.background}
                                    onChange={(color) => updateCardTheme(cardKey, { ...formData[cardKey].theme, background: color })}
                                />
                            </div>

                            <div className="flex items-center justify-between p-2 bg-white rounded-lg border border-gray-100 shadow-sm">
                                <span className="text-sm text-gray-600 font-medium">Button</span>
                                <TailwindColorPicker
                                    value={formData[cardKey].theme.button}
                                    onChange={(color) => updateCardTheme(cardKey, { ...formData[cardKey].theme, button: color })}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Titel</label>
                            <input
                                type="text"
                                value={formData[cardKey].title}
                                onChange={(e) => updateCard(cardKey, 'title', e.target.value)}
                                className="w-full px-3 py-2 border rounded-md mt-1"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Untertitel</label>
                            <input
                                type="text"
                                value={formData[cardKey].subtitle}
                                onChange={(e) => updateCard(cardKey, 'subtitle', e.target.value)}
                                className="w-full px-3 py-2 border rounded-md mt-1"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Beschreibung</label>
                            <textarea
                                value={formData[cardKey].description}
                                onChange={(e) => updateCard(cardKey, 'description', e.target.value)}
                                rows={3}
                                className="w-full px-3 py-2 border rounded-md mt-1"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Button Text</label>
                                <input
                                    type="text"
                                    value={formData[cardKey].button_text}
                                    onChange={(e) => updateCard(cardKey, 'button_text', e.target.value)}
                                    className="w-full px-3 py-2 border rounded-md mt-1"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Button Link</label>
                                <input
                                    type="text"
                                    value={formData[cardKey].button_href}
                                    onChange={(e) => updateCard(cardKey, 'button_href', e.target.value)}
                                    className="w-full px-3 py-2 border rounded-md mt-1"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-medium text-gray-700">Vorschau</label>
                            <div className="text-xs text-gray-500">
                                {formData[cardKey].image_url ? 'Mit Bild' : 'Nur Text'}
                            </div>
                        </div>

                        <div className="border rounded-xl p-4 bg-gray-50">
                            <FeatureCard
                                title={formData[cardKey].title || 'Titel'}
                                subtitle={formData[cardKey].subtitle}
                                description={formData[cardKey].description || 'Beschreibungstext...'}
                                buttonText={formData[cardKey].button_text || 'Button'}
                                buttonHref="#"
                                buttonColor={formData[cardKey].theme.button}
                                highlightColor={formData[cardKey].theme.highlight}
                                backgroundColor={formData[cardKey].theme.background}
                                imageSrc={formData[cardKey].image_url}
                                isTextOnly={!formData[cardKey].image_url}
                                variant={cardKey === 'card_1' ? 'hero' : 'centered'}
                                className="min-h-[300px]"
                                compact={true}
                            />
                        </div>

                        <div className="flex gap-2 mt-4">
                            <button
                                onClick={() => setShowImagePicker(cardKey)}
                                className="flex-1 flex items-center justify-center px-4 py-2 border border-blue-300 shadow-sm text-sm font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100"
                            >
                                {formData[cardKey].image_url ? (
                                    <>
                                        <PencilSimple className="mr-2 h-4 w-4" />
                                        Bild ändern
                                    </>
                                ) : (
                                    <>
                                        <ImageSquare className="mr-2 h-4 w-4" />
                                        Bild auswählen
                                    </>
                                )}
                            </button>
                            {formData[cardKey].image_url && (
                                <button
                                    onClick={() => updateCard(cardKey, 'image_url', '')}
                                    className="flex items-center justify-center px-4 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100"
                                    title="Bild entfernen"
                                >
                                    <Trash className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
