'use client';

import { useEffect, useMemo, useState } from 'react';
import type { ChangeEvent } from 'react';
import Link from 'next/link';
import { AdminHead, Panel } from '@/app/components/admin/AdminPage';
import s from './settings.module.css';

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

const CATEGORY_ORDER = ['general', 'footer', 'contact', 'social', 'seo'];

const CATEGORY_INFO: Record<string, { label: string; note: string }> = {
    general: {
        label: 'Allgemein',
        note: 'Name und Anspruch, mit denen die Website auftritt.',
    },
    footer: {
        label: 'Fußzeile',
        note: 'Copyright und WhatsApp-Kanal am Fuß jeder Seite.',
    },
    contact: {
        label: 'Kontakt',
        note: 'Erreichbarkeit der Redaktion. Leere Felder werden nicht angezeigt.',
    },
    social: {
        label: 'Social Media',
        note: 'Verweise auf externe Kanäle. Leere Felder werden nicht verlinkt.',
    },
    seo: {
        label: 'Suchmaschinen',
        note: 'Beschreibung und Schlüsselwörter für Suchdienste.',
    },
};

function validateSetting(setting: SiteSetting): string | null {
    const value = (setting.value ?? '').trim();

    if (setting.type === 'boolean') {
        return value === 'true' || value === 'false'
            ? null
            : 'Bitte Aktiviert oder Deaktiviert wählen.';
    }

    if (!value) return null;

    if (setting.type === 'url') {
        if (!/^https?:\/\//i.test(value)) {
            return 'Bitte eine vollständige Adresse mit http:// oder https:// eintragen.';
        }
        try {
            new URL(value);
        } catch {
            return 'Diese Adresse ist nicht gültig.';
        }
    }

    if (setting.type === 'email') {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            return 'Bitte eine gültige E-Mail-Adresse eintragen.';
        }
    }

    return null;
}

export default function AdminSettings({ canEdit }: AdminSettingsProps) {
    const [settings, setSettings] = useState<SiteSetting[]>([]);
    const [originalSettings, setOriginalSettings] = useState<SiteSetting[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [reloadKey, setReloadKey] = useState(0);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            setLoading(true);
            setLoadError(null);
            try {
                const response = await fetch('/api/admin/settings');
                if (!response.ok) {
                    throw new Error(`Status ${response.status}`);
                }
                const data = (await response.json()) as {
                    settings: SiteSetting[];
                };
                if (cancelled) return;
                setSettings(data.settings);
                setOriginalSettings(data.settings.map((item) => ({ ...item })));
            } catch (error) {
                console.error('Error fetching settings:', error);
                if (!cancelled) {
                    setLoadError(
                        'Die Einstellungen konnten nicht geladen werden.'
                    );
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        load();
        return () => {
            cancelled = true;
        };
    }, [reloadKey]);

    const originalByKey = useMemo(
        () => new Map(originalSettings.map((item) => [item.key, item.value])),
        [originalSettings]
    );

    const errors = useMemo(() => {
        const map = new Map<string, string>();
        settings.forEach((setting) => {
            const message = validateSetting(setting);
            if (message) map.set(setting.key, message);
        });
        return map;
    }, [settings]);

    const changedKeys = useMemo(
        () =>
            settings
                .filter(
                    (setting) =>
                        (originalByKey.get(setting.key) ?? '') !==
                        (setting.value ?? '')
                )
                .map((setting) => setting.key),
        [settings, originalByKey]
    );

    const hasChanges = changedKeys.length > 0;
    const hasErrors = errors.size > 0;

    const categories = useMemo(() => {
        const present = [...new Set(settings.map((item) => item.category))];
        const known = CATEGORY_ORDER.filter((category) =>
            present.includes(category)
        );
        const unknown = present
            .filter((category) => !CATEGORY_ORDER.includes(category))
            .sort((a, b) => a.localeCompare(b, 'de'));
        return [...known, ...unknown];
    }, [settings]);

    function updateSetting(key: string, value: string) {
        setSuccess(null);
        setSaveError(null);
        setSettings((prev) =>
            prev.map((item) => (item.key === key ? { ...item, value } : item))
        );
    }

    function resetChanges() {
        setSettings(originalSettings.map((item) => ({ ...item })));
        setSuccess(null);
        setSaveError(null);
    }

    async function handleSave() {
        if (!canEdit || hasErrors || !hasChanges) return;

        setSaving(true);
        setSaveError(null);
        setSuccess(null);

        try {
            const response = await fetch('/api/admin/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ settings }),
            });

            if (!response.ok) {
                let message = 'Die Einstellungen konnten nicht gespeichert werden.';
                try {
                    const data = (await response.json()) as { error?: string };
                    if (data.error) message = data.error;
                } catch {
                    // Keep the German fallback when the body is not JSON.
                }
                throw new Error(message);
            }

            setOriginalSettings(settings.map((item) => ({ ...item })));
            setSuccess(
                changedKeys.length === 1
                    ? 'Eine Einstellung gespeichert.'
                    : `${changedKeys.length} Einstellungen gespeichert.`
            );
        } catch (error) {
            setSaveError(
                error instanceof Error
                    ? error.message
                    : 'Die Einstellungen konnten nicht gespeichert werden.'
            );
        } finally {
            setSaving(false);
        }
    }

    function renderControl(setting: SiteSetting) {
        const id = `setting-${setting.key}`;
        const hintId = setting.description ? `${id}-hint` : undefined;
        const invalid = errors.has(setting.key);

        if (setting.type === 'boolean') {
            const on = (setting.value ?? 'false') === 'true';
            return (
                <div className="field">
                    <div className={s.fieldHead}>
                        <span className="field-label">{setting.displayName}</span>
                        <span className={s.key}>{setting.key}</span>
                    </div>
                    <label className="check" htmlFor={id}>
                        <input
                            id={id}
                            type="checkbox"
                            checked={on}
                            disabled={!canEdit || saving}
                            aria-describedby={hintId}
                            onChange={(event) =>
                                updateSetting(
                                    setting.key,
                                    event.target.checked ? 'true' : 'false'
                                )
                            }
                        />
                        <span>{on ? 'Aktiviert' : 'Deaktiviert'}</span>
                    </label>
                    {setting.description && (
                        <p className="hint" id={hintId}>
                            {setting.description}
                        </p>
                    )}
                    {invalid && (
                        <p className="error-text">{errors.get(setting.key)}</p>
                    )}
                </div>
            );
        }

        const common = {
            id,
            value: setting.value ?? '',
            disabled: !canEdit || saving,
            'aria-invalid': invalid,
            'aria-describedby': hintId,
            onChange: (
                event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
            ) => updateSetting(setting.key, event.target.value),
        };

        return (
            <div className="field">
                <div className={s.fieldHead}>
                    <label htmlFor={id}>{setting.displayName}</label>
                    <span className={s.key}>{setting.key}</span>
                </div>

                {setting.type === 'textarea' ? (
                    <textarea
                        {...common}
                        className="textarea"
                        rows={4}
                        placeholder={setting.description ?? 'Text eingeben'}
                    />
                ) : (
                    <input
                        {...common}
                        className="input"
                        type={
                            setting.type === 'url'
                                ? 'url'
                                : setting.type === 'email'
                                  ? 'email'
                                  : 'text'
                        }
                        placeholder={
                            setting.type === 'url'
                                ? 'https://…'
                                : setting.type === 'email'
                                  ? 'name@beispiel.de'
                                  : (setting.description ?? '')
                        }
                    />
                )}

                {setting.description && (
                    <p className="hint" id={hintId}>
                        {setting.description}
                    </p>
                )}
                {invalid && (
                    <p className="error-text">{errors.get(setting.key)}</p>
                )}
            </div>
        );
    }

    return (
        <div className={s.form}>
            <AdminHead
                title="Einstellungen"
                sub="Website-Einstellungen der Dorfchronik · Änderungen am Fuß der Seite"
                actions={
                    canEdit ? (
                        <>
                            <button
                                type="button"
                                className="btn btn--quiet btn--sm"
                                onClick={resetChanges}
                                disabled={!hasChanges || saving}
                            >
                                Zurücksetzen
                            </button>
                            <button
                                type="button"
                                className="btn btn--primary btn--sm"
                                onClick={handleSave}
                                disabled={!hasChanges || hasErrors || saving}
                            >
                                {saving ? 'Speichern …' : 'Speichern'}
                            </button>
                        </>
                    ) : undefined
                }
            />

            {!canEdit && (
                <div className="notice notice--warn">
                    <strong>Nur Ansicht</strong>
                    <span>
                        Für das Speichern fehlt die Berechtigung
                        „Einstellungen bearbeiten“.
                    </span>
                </div>
            )}

            {success && (
                <div
                    className={`notice notice--ok ${s.noticeRow}`}
                    role="status"
                    aria-live="polite"
                >
                    <strong>Gespeichert</strong>
                    <span>{success}</span>
                    <button
                        type="button"
                        className="btn btn--quiet btn--sm"
                        onClick={() => setSuccess(null)}
                    >
                        Schließen
                    </button>
                </div>
            )}

            {saveError && (
                <div
                    className={`notice notice--error ${s.noticeRow}`}
                    role="alert"
                >
                    <strong>Nicht gespeichert</strong>
                    <span>{saveError}</span>
                    <button
                        type="button"
                        className="btn btn--quiet btn--sm"
                        onClick={() => setSaveError(null)}
                    >
                        Schließen
                    </button>
                </div>
            )}

            {loadError && (
                <div className={`notice notice--error ${s.noticeRow}`} role="alert">
                    <strong>Einstellungen nicht geladen</strong>
                    <span>{loadError}</span>
                    <button
                        type="button"
                        className="btn btn--sm"
                        onClick={() => setReloadKey((key) => key + 1)}
                    >
                        Erneut laden
                    </button>
                </div>
            )}

            {loading && (
                <p className="admin-empty" role="status">
                    Einstellungen werden geladen …
                </p>
            )}

            {!loading &&
                !loadError &&
                (settings.length === 0 ? (
                    <div className="admin-empty">
                        <h2>Keine Einstellungen gefunden</h2>
                        <p>
                            In der Datenbank ist kein Eintrag für die Website
                            hinterlegt.
                        </p>
                    </div>
                ) : (
                    categories.map((category) => {
                        const items = settings.filter(
                            (item) => item.category === category
                        );
                        const info = CATEGORY_INFO[category] ?? {
                            label: category,
                            note: '',
                        };

                        return (
                            <Panel
                                key={category}
                                title={info.label}
                                actions={
                                    <span className={s.panelNote}>
                                        {items.length}{' '}
                                        {items.length === 1 ? 'Feld' : 'Felder'}
                                    </span>
                                }
                            >
                                {info.note && (
                                    <p className={s.catNote}>{info.note}</p>
                                )}
                                <div className={s.fieldList}>
                                    {items.map((setting) => (
                                        <div key={setting.key}>
                                            {renderControl(setting)}
                                        </div>
                                    ))}
                                </div>
                            </Panel>
                        );
                    })
                ))}

            {!loading && !loadError && settings.length > 0 && (
                <div className={s.saveBar}>
                    <p className={s.saveNote}>
                        {hasErrors
                            ? 'Bitte zuerst die markierten Felder berichtigen.'
                            : hasChanges
                              ? `${changedKeys.length} ${
                                    changedKeys.length === 1
                                        ? 'Änderung'
                                        : 'Änderungen'
                                } noch nicht gespeichert.`
                              : 'Alle Einstellungen sind gespeichert.'}
                    </p>
                    <div className="admin-actions">
                        <Link className="btn btn--quiet" href="/admin/dashboard">
                            Zum Schreibtisch
                        </Link>
                        {canEdit && (
                            <button
                                type="button"
                                className="btn btn--primary"
                                onClick={handleSave}
                                disabled={!hasChanges || hasErrors || saving}
                            >
                                {saving ? 'Speichern …' : 'Speichern'}
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
