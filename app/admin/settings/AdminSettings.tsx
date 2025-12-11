'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    ArrowLeft,
    Gear,
    FloppyDisk,
    Globe,
    Chat,
    Envelope,
    MagnifyingGlass,
    ShareNetwork,
    Check,
    X,
    SpinnerGap,
} from '@phosphor-icons/react';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';

interface SiteSetting {
    id: number;
    key: string;
    value: string | null;
    displayName: string;
    description: string | null;
    type: string;
    category: string;
}

interface AdminSettingsProps {
    canEdit: boolean;
}

const categoryConfig: Record<
    string,
    { label: string; icon: React.ElementType; color: string }
> = {
    general: { label: 'Allgemein', icon: Globe, color: 'blue' },
    footer: { label: 'Footer', icon: Chat, color: 'green' },
    contact: { label: 'Kontakt', icon: Envelope, color: 'purple' },
    social: { label: 'Social Media', icon: ShareNetwork, color: 'pink' },
    seo: { label: 'SEO', icon: MagnifyingGlass, color: 'orange' },
};

export default function AdminSettings({ canEdit }: AdminSettingsProps) {
    const [settings, setSettings] = useState<SiteSetting[]>([]);
    const [originalSettings, setOriginalSettings] = useState<SiteSetting[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [activeCategory, setActiveCategory] = useState<string>('general');

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const response = await fetch('/api/admin/settings');
            if (response.ok) {
                const data = await response.json();
                setSettings(data.settings);
                setOriginalSettings(JSON.parse(JSON.stringify(data.settings)));
            } else {
                setError('Fehler beim Laden der Einstellungen');
            }
        } catch (err) {
            console.error('Error fetching settings:', err);
            setError('Fehler beim Laden der Einstellungen');
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        setError(null);
        setSuccess(false);

        try {
            const response = await fetch('/api/admin/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ settings }),
            });

            if (response.ok) {
                setSuccess(true);
                setOriginalSettings(JSON.parse(JSON.stringify(settings)));
                setTimeout(() => setSuccess(false), 3000);
            } else {
                const data = await response.json();
                setError(data.error || 'Fehler beim Speichern');
            }
        } catch (err) {
            console.error('Error saving settings:', err);
            setError('Fehler beim Speichern der Einstellungen');
        } finally {
            setSaving(false);
        }
    };

    const handleReset = () => {
        setSettings(JSON.parse(JSON.stringify(originalSettings)));
    };

    const updateSetting = (key: string, value: string) => {
        setSettings((prev) =>
            prev.map((s) => (s.key === key ? { ...s, value } : s))
        );
    };

    const hasChanges =
        JSON.stringify(settings) !== JSON.stringify(originalSettings);

    const categories = [...new Set(settings.map((s) => s.category))];

    const filteredSettings = settings.filter(
        (s) => s.category === activeCategory
    );

    const renderInput = (setting: SiteSetting) => {
        const baseInputClass =
            'w-full px-3 py-2.5 border-0 border-b-2 border-gray-200 bg-transparent text-gray-900 placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-0 transition-colors disabled:text-gray-400 disabled:border-gray-100';

        switch (setting.type) {
            case 'boolean':
                return (
                    <label className="relative inline-flex items-center cursor-pointer group">
                        <input
                            type="checkbox"
                            checked={setting.value === 'true'}
                            onChange={(e) =>
                                updateSetting(
                                    setting.key,
                                    e.target.checked ? 'true' : 'false'
                                )
                            }
                            disabled={!canEdit}
                            className="sr-only peer"
                        />
                        <div className="w-12 h-6 bg-gray-200 rounded-full peer peer-checked:bg-primary peer-disabled:opacity-50 transition-colors relative">
                            <div
                                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${
                                    setting.value === 'true'
                                        ? 'translate-x-6'
                                        : 'translate-x-0'
                                }`}
                            />
                        </div>
                        <span className="ml-3 text-sm text-gray-600">
                            {setting.value === 'true'
                                ? 'Aktiviert'
                                : 'Deaktiviert'}
                        </span>
                    </label>
                );
            case 'textarea':
                return (
                    <textarea
                        value={setting.value || ''}
                        onChange={(e) =>
                            updateSetting(setting.key, e.target.value)
                        }
                        disabled={!canEdit}
                        rows={3}
                        className={`${baseInputClass} resize-none`}
                        placeholder={setting.description || 'Text eingeben...'}
                    />
                );
            case 'url':
                return (
                    <input
                        type="url"
                        value={setting.value || ''}
                        onChange={(e) =>
                            updateSetting(setting.key, e.target.value)
                        }
                        disabled={!canEdit}
                        className={baseInputClass}
                        placeholder="https://..."
                    />
                );
            case 'email':
                return (
                    <input
                        type="email"
                        value={setting.value || ''}
                        onChange={(e) =>
                            updateSetting(setting.key, e.target.value)
                        }
                        disabled={!canEdit}
                        className={baseInputClass}
                        placeholder="beispiel@email.de"
                    />
                );
            default:
                return (
                    <input
                        type="text"
                        value={setting.value || ''}
                        onChange={(e) =>
                            updateSetting(setting.key, e.target.value)
                        }
                        disabled={!canEdit}
                        className={baseInputClass}
                        placeholder={setting.description || ''}
                    />
                );
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <LoadingSpinner size="lg" text="Lade Einstellungen..." />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <Link
                                href="/admin/dashboard"
                                className="mr-4 p-2 text-gray-600 hover:text-gray-900"
                            >
                                <ArrowLeft className="w-6 h-6" />
                            </Link>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                                    <Gear className="w-8 h-8 mr-3 text-gray-600" />
                                    Website Einstellungen
                                </h1>
                                <p className="text-sm text-gray-600 mt-1">
                                    Allgemeine Einstellungen für die Website
                                    verwalten
                                </p>
                            </div>
                        </div>

                        {canEdit && (
                            <div className="flex items-center gap-3">
                                {hasChanges && (
                                    <button
                                        onClick={handleReset}
                                        className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
                                    >
                                        Zurücksetzen
                                    </button>
                                )}
                                <button
                                    onClick={handleSave}
                                    disabled={saving || !hasChanges}
                                    className="flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                                >
                                    {saving ? (
                                        <>
                                            <SpinnerGap className="w-5 h-5 animate-spin" />
                                            Speichern...
                                        </>
                                    ) : (
                                        <>
                                            <FloppyDisk className="w-5 h-5" />
                                            Speichern
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                {/* Success/Error Messages */}
                {success && (
                    <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 flex items-center">
                        <Check className="w-5 h-5 text-green-600 mr-3" />
                        <p className="text-green-800">
                            Einstellungen erfolgreich gespeichert!
                        </p>
                    </div>
                )}

                {error && (
                    <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-between">
                        <div className="flex items-center">
                            <X className="w-5 h-5 text-red-600 mr-3" />
                            <p className="text-red-800">{error}</p>
                        </div>
                        <button
                            onClick={() => setError(null)}
                            className="text-red-600 hover:text-red-800"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                )}

                {/* Category Tabs - Minimalistic */}
                <div className="flex flex-wrap items-center mb-6 border-b border-gray-200">
                    {categories.map((cat, index) => {
                        const config = categoryConfig[cat] || {
                            label: cat,
                            icon: Gear,
                            color: 'gray',
                        };
                        const Icon = config.icon;
                        const isActive = activeCategory === cat;

                        return (
                            <div key={cat} className="flex items-center">
                                {index > 0 && (
                                    <div className="h-6 w-px bg-gray-300 mx-1" />
                                )}
                                <button
                                    onClick={() => setActiveCategory(cat)}
                                    className={`flex items-center gap-2 px-5 py-3 text-base font-medium border-b-2 -mb-px transition-colors ${
                                        isActive
                                            ? 'border-primary text-primary'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    <Icon className="w-5 h-5" />
                                    <span>{config.label}</span>
                                </button>
                            </div>
                        );
                    })}
                </div>

                {/* Settings Content */}
                <div className="bg-white rounded-xl shadow-sm">
                    <div className="p-6 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900">
                            {categoryConfig[activeCategory]?.label ||
                                activeCategory}
                        </h2>
                        <p className="text-sm text-gray-600 mt-1">
                            {activeCategory === 'general' &&
                                'Grundlegende Einstellungen der Website'}
                            {activeCategory === 'footer' &&
                                'Einstellungen für den Footer-Bereich'}
                            {activeCategory === 'contact' &&
                                'Kontaktinformationen'}
                            {activeCategory === 'social' &&
                                'Social Media Verlinkungen'}
                            {activeCategory === 'seo' &&
                                'Suchmaschinenoptimierung'}
                        </p>
                    </div>

                    <div className="p-6 space-y-6">
                        {filteredSettings.map((setting) => (
                            <div key={setting.id} className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    {setting.displayName}
                                </label>
                                {renderInput(setting)}
                                {setting.description &&
                                    setting.type !== 'boolean' && (
                                        <p className="text-xs text-gray-500">
                                            {setting.description}
                                        </p>
                                    )}
                            </div>
                        ))}

                        {filteredSettings.length === 0 && (
                            <p className="text-gray-500 text-center py-8">
                                Keine Einstellungen in dieser Kategorie
                            </p>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
