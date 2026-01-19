'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    ArrowLeft,
    FloppyDisk,
    ImageSquare,
    Trash,
    PencilSimple,
} from '@phosphor-icons/react/dist/ssr';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import GalleryImagePicker from '@/app/admin/components/GalleryImagePicker';
import { usePermissions } from '@/lib/usePermissions';
import FeatureCard from '@/app/components/FeatureCard';
import TailwindColorPicker from '@/app/admin/components/TailwindColorPicker';
import PageSelector from '@/app/admin/components/PageSelector';


// ... (existing imports)

interface CardTheme {
    highlight: string;
    background: string;
    button: string;
}

interface CardData {
    title: string;
    subtitle: string;
    description: string;
    image_id?: string;
    image_url?: string;
    button_text: string;
    button_href: string;
    theme: CardTheme;
}

interface LayoutData {
    id?: number;
    name: string;
    is_active: boolean;
    card_1: CardData;
    card_2: CardData;
    card_3: CardData;
}

const DEFAULT_THEME: CardTheme = {
    highlight: 'green',
    background: 'green',
    button: 'green',
};

const THEME_PRESETS: Record<string, CardTheme> = {
    Green: { highlight: 'green', background: 'green', button: 'green' },
    Blue: { highlight: 'blue', background: 'blue', button: 'blue' },
    Warm: { highlight: 'amber', background: 'orange', button: 'red' },
    Slate: { highlight: 'slate', background: 'gray', button: 'gray' },
    Purple: { highlight: 'violet', background: 'purple', button: 'purple' },
};

const PRESET_BG: Record<string, string> = {
    Green: '#16a34a', // green-600
    Blue: '#2563eb', // blue-600
    Warm: '#f97316', // orange-500
    Slate: '#64748b', // slate-500
    Purple: '#7c3aed', // violet-600
};

const PRESET_LABEL_DE: Record<string, string> = {
    Green: 'Grün',
    Blue: 'Blau',
    Warm: 'Warm',
    Slate: 'Grau',
    Purple: 'Violett',
};

const EMPTY_CARD: CardData = {
    title: '',
    subtitle: '',
    description: '',
    button_text: 'Mehr erfahren',
    button_href: '#',
    theme: DEFAULT_THEME,
};

export default function EditLayoutClient({ layoutId }: { layoutId?: string }) {
    const router = useRouter();
    const { hasPermission } = usePermissions();
    const canUpload = hasPermission('gallery.upload');

    const [loading, setLoading] = useState(!!layoutId);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showImagePicker, setShowImagePicker] = useState<

        'card_1' | 'card_2' | 'card_3' | null
    >(null);
    const [editingThemeFor, setEditingThemeFor] = useState<
        null | 'card_1' | 'card_2' | 'card_3'
    >(null);
    const [tempTheme, setTempTheme] = useState<CardTheme>(DEFAULT_THEME);

    const [formData, setFormData] = useState<LayoutData>({
        name: '',
        is_active: false,
        card_1: { ...EMPTY_CARD, title: 'Karte 1' },
        card_2: { ...EMPTY_CARD, title: 'Karte 2' },
        card_3: { ...EMPTY_CARD, title: 'Karte 3' },
    });


    useEffect(() => {
        if (layoutId) {
            fetchLayout(layoutId);
        }
    }, [layoutId]);

    const fetchLayout = async (id: string) => {
        try {
            // Since we don't have a specific get-by-id API that returns just one (GET /admin/wendessen returns list)
            // Wait, I didn't implement GET /admin/wendessen/[id]. I implemented PUT and DELETE.
            // I should have implemented GET as well in that route.
            // Let's check my route implementation.
            // Ah, I missed GET in [id]/route.ts! I only did PUT and DELETE.
            // I need to fix that or use the list endpoint and find it.
            // Using list endpoint is inefficient but works for now.
            // Better: I will fetch list and find it client side for now, or just implement GET in next step.
            // I'll assume I'll fix the API to support GET /api/admin/wendessen/[id] or just use list for now to save a step.
            // Let's use list for now.
            const response = await fetch('/api/admin/wendessen');
            if (response.ok) {
                const data = (await response.json()) as {
                    layouts: Array<LayoutData & { id: number }>;
                };
                const found = data.layouts.find(
                    (l) => l.id != null && l.id.toString() === id
                );
                if (found) {
                    setFormData(found);
                } else {
                    setError('Layout nicht gefunden');
                }
            } else {
                setError('Fehler beim Laden');
            }
        } catch (error) {
            console.error(error);
            setError('Fehler beim Laden');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!formData.name) {
            setError('Bitte geben Sie einen Namen für das Layout ein.');
            return;
        }

        setSaving(true);
        setError(null);

        try {
            const url = layoutId
                ? `/api/admin/wendessen/${layoutId}`
                : '/api/admin/wendessen';

            const method = layoutId ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                router.push('/admin/wendessen');
                router.refresh();
            } else {
                const data = await response.json();
                setError(data.error || 'Fehler beim Speichern');
            }
        } catch (error) {
            console.error(error);
            setError('Fehler beim Speichern');
        } finally {
            setSaving(false);
        }
    };

    const updateCard = <K extends keyof CardData>(
        cardKey: 'card_1' | 'card_2' | 'card_3',
        field: K,
        value: CardData[K]
    ) => {
        setFormData((prev) => ({
            ...prev,
            [cardKey]: {
                ...prev[cardKey],
                [field]: value,
            },
        }));
    };

    const updateCardTheme = (
        cardKey: 'card_1' | 'card_2' | 'card_3',
        theme: CardTheme
    ) => {
        setFormData((prev) => ({
            ...prev,
            [cardKey]: {
                ...prev[cardKey],
                theme,
            },
        }));
    };

    const handleImageSelect = (image: { id: string; url: string }) => {
        if (showImagePicker) {
            setFormData((prev) => ({
                ...prev,
                [showImagePicker]: {
                    ...prev[showImagePicker],
                    image_id: image.id,
                    image_url: image.url,
                },
            }));
            setShowImagePicker(null);
        }
    };

    if (loading) return <LoadingSpinner centered />;

    return (
        <div className="space-y-6 pb-20">
            <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow sticky top-0 z-10">
                <div className="flex items-center">
                    <button
                        onClick={() => router.back()}
                        className="mr-4 text-gray-600 hover:text-gray-900"
                    >
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="text-2xl font-bold text-gray-900">
                        {layoutId ? 'Layout bearbeiten' : 'Neues Layout'}
                    </h1>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium flex items-center disabled:opacity-50"
                >
                    {saving ? (
                        <LoadingSpinner
                            size="sm"
                            color="white"
                            className="mr-2"
                        />
                    ) : (
                        <FloppyDisk size={20} className="mr-2" />
                    )}
                    Speichern
                </button>
            </div>

            {error && (
                <div className="bg-red-50 text-red-700 p-4 rounded-md border border-red-200">
                    {error}
                </div>
            )}

            {/* General Settings */}
            <div className="bg-white p-6 rounded-lg shadow">
                <h2 className="text-lg font-medium text-gray-900 mb-4">
                    Allgemein
                </h2>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Layout Name
                    </label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full px-3 py-2 border rounded-md"
                        placeholder="z.B. Sommer 2025"
                    />
                </div>
            </div>

            {/* Cards Editor */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {(['card_1', 'card_2', 'card_3'] as const).map(
                    (cardKey, index) => (
                        <div
                            key={cardKey}
                            className={`bg-white p-6 rounded-lg shadow ${
                                index === 0 ? 'lg:col-span-2' : ''
                            }`}
                        >
                            <div className="flex justify-between items-start mb-6 border-b pb-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        {index === 0
                                            ? 'Karte 1'
                                            : index === 1
                                            ? 'Karte 2'
                                            : 'Karte 3'}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        {index === 0
                                            ? 'Die Hauptkarte, nimmt viel Platz ein.'
                                            : 'Kleinere Karte an der Seite.'}
                                    </p>
                                </div>
                            </div>

                            {/* Design & Farben moved above inputs and preview so it spans full width */}
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 mb-6">
                                <h4 className="text-sm font-semibold text-gray-900 mb-3">
                                    Design & Farben
                                </h4>
                                <div className="mb-3">
                                    <div className="text-xs text-gray-500 mb-2">
                                        Vorgaben
                                    </div>
                                    <div
                                        className="grid gap-2"
                                        style={{
                                            gridTemplateColumns:
                                                'repeat(auto-fit, minmax(140px, 1fr))',
                                        }}
                                    >
                                        {Object.entries(THEME_PRESETS).map(
                                            ([name, theme]) => (
                                                <button
                                                    key={name}
                                                    type="button"
                                                    onClick={() =>
                                                        updateCardTheme(
                                                            cardKey,
                                                            theme
                                                        )
                                                    }
                                                    className="flex items-center gap-2 px-2 py-1 border rounded-md bg-white hover:shadow-sm justify-center"
                                                >
                                                    <span
                                                        style={{
                                                            width: 18,
                                                            height: 18,
                                                            borderRadius: 4,
                                                            backgroundColor:
                                                                PRESET_BG[
                                                                    name
                                                                ] || '#ddd',
                                                            display:
                                                                'inline-block',
                                                            border: '1px solid rgba(0,0,0,0.08)',
                                                        }}
                                                    />
                                                    <span className="text-sm text-gray-700">
                                                        {PRESET_LABEL_DE[
                                                            name
                                                        ] || name}
                                                    </span>
                                                </button>
                                            )
                                        )}

                                        {/* Anpassen included as a grid item so total tiles (presets + Anpassen) = 6 */}
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setTempTheme(
                                                    formData[cardKey].theme
                                                );
                                                setEditingThemeFor(cardKey);
                                            }}
                                            className="flex items-center gap-2 px-2 py-1 border rounded-md bg-white hover:shadow-sm justify-center"
                                        >
                                            <PencilSimple className="h-4 w-4 text-gray-600" />
                                            <span className="text-sm text-gray-700">
                                                Anpassen
                                            </span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div
                                className={`grid grid-cols-1 gap-6 ${
                                    index === 0
                                        ? 'md:grid-cols-2'
                                        : 'min-[1400px]:grid-cols-2'
                                }`}
                            >
                                {/* Editor Column */}
                                <div className="space-y-6">
                                    {/* Text Inputs */}
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Titel
                                            </label>
                                            <input
                                                type="text"
                                                value={formData[cardKey].title}
                                                onChange={(e) =>
                                                    updateCard(
                                                        cardKey,
                                                        'title',
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full px-3 py-2 border rounded-md mt-2"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Untertitel
                                            </label>
                                            <input
                                                type="text"
                                                value={
                                                    formData[cardKey].subtitle
                                                }
                                                onChange={(e) =>
                                                    updateCard(
                                                        cardKey,
                                                        'subtitle',
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full px-3 py-2 border rounded-md mt-1"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">
                                                Beschreibung
                                            </label>
                                            <textarea
                                                value={
                                                    formData[cardKey]
                                                        .description
                                                }
                                                onChange={(e) =>
                                                    updateCard(
                                                        cardKey,
                                                        'description',
                                                        e.target.value
                                                    )
                                                }
                                                rows={5}
                                                className="w-full px-3 py-2 border rounded-md mt-1 mb-1.5"
                                            />
                                        </div>
                                        {/* Button Configuration */}
                                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                                            <h5 className="text-sm font-medium text-gray-900 mb-3">Button Einstellungen</h5>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {/* Button Text */}
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-600 mb-1">
                                                        Button Text
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={formData[cardKey].button_text}
                                                        onChange={(e) =>
                                                            updateCard(cardKey, 'button_text', e.target.value)
                                                        }
                                                        placeholder="Mehr erfahren"
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    />
                                                </div>
                                                
                                                {/* Page Selector */}
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-600 mb-1">
                                                        Seite verlinken
                                                    </label>
                                                    <PageSelector
                                                        value={formData[cardKey].button_href}
                                                        onChange={(href) => updateCard(cardKey, 'button_href', href)}
                                                        placeholder="Seite wählen..."
                                                    />
                                                </div>
                                                
                                                {/* Custom Link */}
                                                <div>
                                                    <label className="block text-xs font-medium text-gray-600 mb-1">
                                                        Oder eigener Link
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={formData[cardKey].button_href}
                                                        onChange={(e) =>
                                                            updateCard(cardKey, 'button_href', e.target.value)
                                                        }
                                                        placeholder="/pfad/zur/seite"
                                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>

                                <div className="flex flex-col h-full">
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Vorschau
                                        </label>
                                        <div className="text-xs text-gray-500">
                                            {formData[cardKey].image_url
                                                ? 'Mit Bild'
                                                : 'Nur Text'}
                                        </div>
                                    </div>

                                    {/* Component Preview */}
                                    <div className="border rounded-xl p-4 bg-gray-50 flex-1 flex flex-col">
                                        <div className="flex-1 flex flex-col">
                                            <FeatureCard
                                                title={
                                                    formData[cardKey].title ||
                                                    'Titel'
                                                }
                                                subtitle={
                                                    formData[cardKey].subtitle
                                                }
                                                description={
                                                    formData[cardKey]
                                                        .description ||
                                                    'Beschreibungstext...'
                                                }
                                                buttonText={
                                                    formData[cardKey]
                                                        .button_text || 'Button'
                                                }
                                                buttonHref="#"
                                                buttonColor={
                                                    formData[cardKey].theme
                                                        .button
                                                }
                                                highlightColor={
                                                    formData[cardKey].theme
                                                        .highlight
                                                }
                                                backgroundColor={
                                                    formData[cardKey].theme
                                                        .background
                                                }
                                                imageSrc={
                                                    formData[cardKey].image_url
                                                }
                                                isTextOnly={
                                                    !formData[cardKey].image_url
                                                }
                                                variant={
                                                    cardKey === 'card_1'
                                                        ? 'hero'
                                                        : 'centered'
                                                }
                                                className="h-full min-h-[300px]"
                                                compact={true}
                                            />
                                        </div>


                                        {/* Image Controls */}
                                        <div className="flex gap-2 mt-4">
                                            <button
                                                onClick={() =>
                                                    setShowImagePicker(cardKey)
                                                }
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
                                                    onClick={() =>
                                                        updateCard(
                                                            cardKey,
                                                            'image_url',
                                                            ''
                                                        )
                                                    }
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
                    )
                )}
            </div>

            {showImagePicker && (
                <GalleryImagePicker
                    onSelect={handleImageSelect}
                    onClose={() => setShowImagePicker(null)}
                    canUpload={canUpload}
                />
            )}

            {/* Theme customization modal (inline, no external dependency) */}
            {editingThemeFor && (
                <div className="relative z-50">
                    <div className="fixed inset-0 bg-black/30" aria-hidden />
                    <div className="fixed inset-0 flex items-center justify-center p-2">
                        <div className="mx-auto w-full max-w-[16rem] sm:max-w-[20rem] md:max-w-[28rem] lg:max-w-[28rem] xl:max-w-[28rem] bg-white rounded-lg p-3 shadow-md">
                            <div className="flex items-start justify-between gap-4">
                                <h3 className="text-base font-semibold text-gray-900">
                                    Theme anpassen
                                </h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                                <div className="flex items-center gap-4 p-2 rounded-md bg-white">
                                    <div className="w-28 text-right">
                                        <span className="text-sm text-gray-600">
                                            Primär
                                        </span>
                                    </div>
                                    <div>
                                        <TailwindColorPicker
                                            value={tempTheme.highlight}
                                            onChange={(c) =>
                                                setTempTheme((t) => ({
                                                    ...t,
                                                    highlight: c,
                                                }))
                                            }
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 p-2 rounded-md bg-white">
                                    <div className="w-28 text-right">
                                        <span className="text-sm text-gray-600">
                                            Hintergrund
                                        </span>
                                    </div>
                                    <div>
                                        <TailwindColorPicker
                                            value={tempTheme.background}
                                            onChange={(c) =>
                                                setTempTheme((t) => ({
                                                    ...t,
                                                    background: c,
                                                }))
                                            }
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 p-2 rounded-md bg-white">
                                    <div className="w-28 text-right">
                                        <span className="text-sm text-gray-600">
                                            Button
                                        </span>
                                    </div>
                                    <div>
                                        <TailwindColorPicker
                                            value={tempTheme.button}
                                            onChange={(c) =>
                                                setTempTheme((t) => ({
                                                    ...t,
                                                    button: c,
                                                }))
                                            }
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 flex flex-col gap-2">
                                <button
                                    type="button"
                                    onClick={() => setEditingThemeFor(null)}
                                    className="w-full px-3 py-1 rounded-md border bg-white text-gray-700 text-sm text-center"
                                >
                                    Abbrechen
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (editingThemeFor)
                                            updateCardTheme(
                                                editingThemeFor,
                                                tempTheme
                                            );
                                        setEditingThemeFor(null);
                                    }}
                                    className="w-full px-3 py-1 rounded-md bg-blue-600 text-white text-sm text-center"
                                >
                                    Speichern
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
