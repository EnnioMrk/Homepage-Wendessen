'use client';

import { useEffect, useId, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AdminHead, Panel } from '@/app/components/admin/AdminPage';
import { usePermissions } from '@/lib/usePermissions';
import {
    DORFLEBEN_NAV,
    WOHNEN_BAUEN_NAV,
    KONTAKT_NAV,
    type NavItem,
} from '@/lib/constants/navigation';
import WendessenImagePicker from './WendessenImagePicker';
import s from './wendessen.module.css';

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
    name: string;
    is_active: boolean;
    card_1: CardData;
    card_2: CardData;
    card_3: CardData;
}

type CardKey = 'card_1' | 'card_2' | 'card_3';
type ThemeSlot = keyof CardTheme;

const DEFAULT_THEME: CardTheme = {
    highlight: 'green',
    background: 'green',
    button: 'green',
};

const COLOR_NAMES = [
    'slate',
    'gray',
    'zinc',
    'neutral',
    'stone',
    'red',
    'orange',
    'amber',
    'yellow',
    'lime',
    'green',
    'emerald',
    'teal',
    'cyan',
    'sky',
    'blue',
    'indigo',
    'violet',
    'purple',
    'fuchsia',
    'pink',
    'rose',
];

const THEME_PRESETS: { label: string; theme: CardTheme }[] = [
    { label: 'Grün', theme: { highlight: 'green', background: 'green', button: 'green' } },
    { label: 'Blau', theme: { highlight: 'blue', background: 'blue', button: 'blue' } },
    { label: 'Warm', theme: { highlight: 'amber', background: 'orange', button: 'red' } },
    { label: 'Grau', theme: { highlight: 'slate', background: 'gray', button: 'gray' } },
    { label: 'Violett', theme: { highlight: 'violet', background: 'purple', button: 'purple' } },
];

const EMPTY_CARD = (index: number): CardData => ({
    title: `Karte ${index}`,
    subtitle: '',
    description: '',
    button_text: 'Mehr erfahren',
    button_href: '#',
    theme: { ...DEFAULT_THEME },
});

function normalizeCard(value: unknown, index: number): CardData {
    const card = (value ?? {}) as Partial<CardData>;
    const theme = (card.theme ?? {}) as Partial<CardTheme>;
    return {
        title: typeof card.title === 'string' ? card.title : `Karte ${index}`,
        subtitle: typeof card.subtitle === 'string' ? card.subtitle : '',
        description:
            typeof card.description === 'string' ? card.description : '',
        image_id:
            typeof card.image_id === 'string' ? card.image_id : undefined,
        image_url:
            typeof card.image_url === 'string' && card.image_url
                ? card.image_url
                : undefined,
        button_text:
            typeof card.button_text === 'string' ? card.button_text : '',
        button_href:
            typeof card.button_href === 'string' ? card.button_href : '',
        theme: {
            highlight:
                typeof theme.highlight === 'string'
                    ? theme.highlight
                    : DEFAULT_THEME.highlight,
            background:
                typeof theme.background === 'string'
                    ? theme.background
                    : DEFAULT_THEME.background,
            button:
                typeof theme.button === 'string'
                    ? theme.button
                    : DEFAULT_THEME.button,
        },
    };
}

function flattenNav(items: NavItem[]): { title: string; href: string }[] {
    const links: { title: string; href: string }[] = [];
    items.forEach((item) => {
        if (item.href) links.push({ title: item.title, href: item.href });
        if (item.items) links.push(...flattenNav(item.items));
    });
    return links;
}

const PAGE_GROUPS = [
    {
        label: 'Hauptseiten',
        items: [
            { title: 'Startseite', href: '/' },
            { title: 'Was steht an?', href: '/was-steht-an' },
            { title: 'Geschichte', href: '/geschichte' },
            { title: 'Impressionen', href: '/impressionen' },
        ],
    },
    { label: 'Dorfleben', items: flattenNav(DORFLEBEN_NAV) },
    { label: 'Wohnen & Bauen', items: flattenNav(WOHNEN_BAUEN_NAV) },
    { label: 'Kontakt', items: flattenNav(KONTAKT_NAV) },
];

const CARD_INFO: Record<CardKey, { number: number; kind: string }> = {
    card_1: { number: 1, kind: 'Hauptkarte, nimmt viel Platz ein' },
    card_2: { number: 2, kind: 'Kleinere Karte an der Seite' },
    card_3: { number: 3, kind: 'Kleinere Karte an der Seite' },
};

const EMPTY_LAYOUT: LayoutData = {
    name: '',
    is_active: false,
    card_1: EMPTY_CARD(1),
    card_2: EMPTY_CARD(2),
    card_3: EMPTY_CARD(3),
};

export default function EditLayoutClient({
    layoutId: initialLayoutId,
}: {
    layoutId?: string;
}) {
    const { hasPermission } = usePermissions();
    const canUpload = hasPermission('gallery.upload');
    const fieldsetId = useId();

    const [layoutId, setLayoutId] = useState<string | undefined>(
        initialLayoutId
    );
    const [formData, setFormData] = useState<LayoutData>(EMPTY_LAYOUT);
    const [loading, setLoading] = useState(Boolean(initialLayoutId));
    const [loadError, setLoadError] = useState<string | null>(null);
    const [formError, setFormError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [reloadKey, setReloadKey] = useState(0);
    const [pickerFor, setPickerFor] = useState<CardKey | null>(null);

    useEffect(() => {
        if (!initialLayoutId) return;
        let cancelled = false;

        async function load() {
            setLoading(true);
            setLoadError(null);
            try {
                const response = await fetch('/api/admin/wendessen');
                if (!response.ok) {
                    throw new Error(`Status ${response.status}`);
                }
                const data = (await response.json()) as {
                    layouts?: Array<LayoutData & { id: number }>;
                };
                const found = (data.layouts ?? []).find(
                    (layout) => String(layout.id) === String(initialLayoutId)
                );
                if (!found) {
                    throw new Error('Layout nicht gefunden.');
                }
                if (cancelled) return;
                setFormData({
                    name: found.name ?? '',
                    is_active: Boolean(found.is_active),
                    card_1: normalizeCard(found.card_1, 1),
                    card_2: normalizeCard(found.card_2, 2),
                    card_3: normalizeCard(found.card_3, 3),
                });
            } catch (error) {
                console.error('Error loading layout:', error);
                if (!cancelled) {
                    setLoadError(
                        error instanceof Error
                            ? error.message
                            : 'Das Layout konnte nicht geladen werden.'
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
    }, [initialLayoutId, reloadKey]);

    const allPageLinks = useMemo(
        () => PAGE_GROUPS.flatMap((group) => group.items),
        []
    );

    function updateCard<K extends keyof CardData>(
        cardKey: CardKey,
        field: K,
        value: CardData[K]
    ) {
        setSuccess(null);
        setFormData((prev) => ({
            ...prev,
            [cardKey]: { ...prev[cardKey], [field]: value },
        }));
    }

    function updateTheme(cardKey: CardKey, slot: ThemeSlot, value: string) {
        setSuccess(null);
        setFormData((prev) => ({
            ...prev,
            [cardKey]: {
                ...prev[cardKey],
                theme: { ...prev[cardKey].theme, [slot]: value },
            },
        }));
    }

    async function save() {
        if (saving) return;
        if (!formData.name.trim()) {
            setFormError('Bitte einen Namen für das Layout eintragen.');
            return;
        }

        setSaving(true);
        setFormError(null);
        setSuccess(null);

        try {
            const response = await fetch(
                layoutId
                    ? `/api/admin/wendessen/${layoutId}`
                    : '/api/admin/wendessen',
                {
                    method: layoutId ? 'PUT' : 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: formData.name.trim(),
                        card_1: formData.card_1,
                        card_2: formData.card_2,
                        card_3: formData.card_3,
                    }),
                }
            );

            if (!response.ok) {
                let message = 'Das Layout konnte nicht gespeichert werden.';
                try {
                    const data = (await response.json()) as { error?: string };
                    if (data.error) message = data.error;
                } catch {
                    // Keep the German fallback.
                }
                throw new Error(message);
            }

            const data = (await response.json()) as {
                layout?: { id: number; is_active?: boolean };
            };

            if (!layoutId && data.layout?.id) {
                setLayoutId(String(data.layout.id));
            }
            if (typeof data.layout?.is_active === 'boolean') {
                setFormData((prev) => ({
                    ...prev,
                    is_active: data.layout?.is_active ?? prev.is_active,
                }));
            }

            setSuccess(
                layoutId
                    ? 'Layout gespeichert.'
                    : 'Layout angelegt. Weitere Speicherungen ändern dieses Layout.'
            );
        } catch (error) {
            setFormError(
                error instanceof Error
                    ? error.message
                    : 'Das Layout konnte nicht gespeichert werden.'
            );
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <div>
                <AdminHead title="Layout bearbeiten" />
                <p className="admin-empty" role="status">
                    Layout wird geladen …
                </p>
            </div>
        );
    }

    if (loadError) {
        return (
            <div>
                <AdminHead title="Layout bearbeiten" />
                <div className="notice notice--error" role="alert">
                    <strong>Nicht geladen</strong>
                    <span>{loadError}</span>
                    <button
                        type="button"
                        className="btn btn--sm"
                        onClick={() => setReloadKey((key) => key + 1)}
                    >
                        Erneut laden
                    </button>
                </div>
                <p style={{ marginTop: 'var(--s4)' }}>
                    <Link className="btn btn--quiet" href="/admin/wendessen">
                        Zur Übersicht
                    </Link>
                </p>
            </div>
        );
    }

    return (
        <div className={s.form}>
            <AdminHead
                title={layoutId ? 'Layout bearbeiten' : 'Neues Layout'}
                sub="Drei Karten für „Aus dem Dorf“ · Änderungen werden erst mit dem Speichern übernommen"
                actions={
                    <>
                        <Link
                            className="btn btn--quiet btn--sm"
                            href="/admin/wendessen"
                        >
                            Zur Übersicht
                        </Link>
                        <button
                            type="button"
                            className="btn btn--primary btn--sm"
                            onClick={save}
                            disabled={saving}
                        >
                            {saving ? 'Speichern …' : 'Speichern'}
                        </button>
                    </>
                }
            />

            {success && (
                <div className="notice notice--ok" role="status">
                    <strong>Gespeichert</strong>
                    <span>{success}</span>
                    {layoutId && (
                        <span className="admin-actions">
                            <Link
                                className="btn btn--quiet btn--sm"
                                href="/admin/wendessen"
                            >
                                Zur Übersicht
                            </Link>
                        </span>
                    )}
                </div>
            )}

            {formError && (
                <div className="notice notice--error" role="alert">
                    <strong>Nicht gespeichert</strong>
                    <span>{formError}</span>
                </div>
            )}

            <Panel title="Allgemein">
                <div className="form-row">
                    <div className="field">
                        <label htmlFor="layout-name">Layout-Name</label>
                        <input
                            id="layout-name"
                            className="input"
                            type="text"
                            value={formData.name}
                            onChange={(event) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    name: event.target.value,
                                }))
                            }
                            placeholder="z. B. Sommer 2026"
                            maxLength={120}
                            required
                        />
                        <p className="hint">
                            Nur für die Redaktion sichtbar, nicht auf der
                            Startseite.
                        </p>
                    </div>
                    <div className="field">
                        <span className="field-label">Status</span>
                        <p>
                            {formData.is_active ? (
                                <span className="stamp stamp--decided">
                                    Aktives Layout
                                </span>
                            ) : (
                                <span className="stamp stamp--draft">
                                    Inaktiv
                                </span>
                            )}
                        </p>
                        <p className="hint">
                            Aktiviert wird ein Layout in der Übersicht. Es kann
                            immer nur eines aktiv sein.
                        </p>
                    </div>
                </div>
            </Panel>

            {(['card_1', 'card_2', 'card_3'] as const).map((cardKey) => {
                const card = formData[cardKey];
                const info = CARD_INFO[cardKey];
                const base = `${fieldsetId}-${cardKey}`;
                const knownHref = allPageLinks.some(
                    (link) => link.href === card.button_href
                );

                return (
                    <fieldset key={cardKey} className={s.card}>
                        <legend>
                            Karte {info.number} — {info.kind}
                        </legend>

                        <div className={s.cardGrid}>
                            <div className={s.fields}>
                                <div className="field">
                                    <label htmlFor={`${base}-title`}>
                                        Titel
                                    </label>
                                    <input
                                        id={`${base}-title`}
                                        className="input"
                                        type="text"
                                        value={card.title}
                                        onChange={(event) =>
                                            updateCard(
                                                cardKey,
                                                'title',
                                                event.target.value
                                            )
                                        }
                                    />
                                </div>

                                <div className="field">
                                    <label htmlFor={`${base}-subtitle`}>
                                        Untertitel
                                    </label>
                                    <input
                                        id={`${base}-subtitle`}
                                        className="input"
                                        type="text"
                                        value={card.subtitle}
                                        onChange={(event) =>
                                            updateCard(
                                                cardKey,
                                                'subtitle',
                                                event.target.value
                                            )
                                        }
                                    />
                                </div>

                                <div className="field">
                                    <label htmlFor={`${base}-description`}>
                                        Beschreibung
                                    </label>
                                    <textarea
                                        id={`${base}-description`}
                                        className="textarea"
                                        value={card.description}
                                        onChange={(event) =>
                                            updateCard(
                                                cardKey,
                                                'description',
                                                event.target.value
                                            )
                                        }
                                        maxLength={350}
                                        rows={5}
                                    />
                                    <p className={s.counter}>
                                        {card.description.length} / 350 Zeichen
                                    </p>
                                </div>

                                <div className={s.buttonBlock}>
                                    <div className={s.buttonHead}>
                                        <h4>Schaltfläche</h4>
                                        <button
                                            type="button"
                                            className="btn btn--quiet btn--sm"
                                            onClick={() => {
                                                updateCard(
                                                    cardKey,
                                                    'button_text',
                                                    ''
                                                );
                                                updateCard(
                                                    cardKey,
                                                    'button_href',
                                                    ''
                                                );
                                            }}
                                        >
                                            Kein Button
                                        </button>
                                    </div>

                                    <div className="form-row">
                                        <div className="field">
                                            <label htmlFor={`${base}-button-text`}>
                                                Button-Text
                                            </label>
                                            <input
                                                id={`${base}-button-text`}
                                                className="input"
                                                type="text"
                                                value={card.button_text}
                                                onChange={(event) =>
                                                    updateCard(
                                                        cardKey,
                                                        'button_text',
                                                        event.target.value
                                                    )
                                                }
                                                placeholder="Mehr erfahren"
                                            />
                                        </div>

                                        <div className="field">
                                            <label htmlFor={`${base}-button-page`}>
                                                Seite verlinken
                                            </label>
                                            <select
                                                id={`${base}-button-page`}
                                                className="select"
                                                value={
                                                    knownHref
                                                        ? card.button_href
                                                        : ''
                                                }
                                                onChange={(event) => {
                                                    if (event.target.value) {
                                                        updateCard(
                                                            cardKey,
                                                            'button_href',
                                                            event.target.value
                                                        );
                                                    }
                                                }}
                                            >
                                                <option value="">
                                                    — eigener Link darunter —
                                                </option>
                                                {PAGE_GROUPS.map((group) => (
                                                    <optgroup
                                                        key={group.label}
                                                        label={group.label}
                                                    >
                                                        {group.items.map(
                                                            (link) => (
                                                                <option
                                                                    key={
                                                                        link.href
                                                                    }
                                                                    value={
                                                                        link.href
                                                                    }
                                                                >
                                                                    {link.title}
                                                                </option>
                                                            )
                                                        )}
                                                    </optgroup>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="field">
                                        <label htmlFor={`${base}-button-href`}>
                                            Oder eigener Link
                                        </label>
                                        <input
                                            id={`${base}-button-href`}
                                            className="input"
                                            type="text"
                                            value={card.button_href}
                                            onChange={(event) =>
                                                updateCard(
                                                    cardKey,
                                                    'button_href',
                                                    event.target.value
                                                )
                                            }
                                            placeholder="/pfad/zur/seite"
                                        />
                                        <p className="hint">
                                            Wenn Text oder Link leer sind, wird
                                            keine Schaltfläche angezeigt.
                                        </p>
                                    </div>
                                </div>

                                <div className={s.themeBlock}>
                                    <div className={s.buttonHead}>
                                        <h4>Farben · Altbestand</h4>
                                        <span className="stamp stamp--draft">
                                            wird nicht dargestellt
                                        </span>
                                    </div>
                                    <p>
                                        Die aktuelle Gestaltung der Startseite
                                        liest diese Farbwerte nicht mehr. Die
                                        gespeicherten Werte bleiben erhalten,
                                        damit ältere Layouts nicht verändert
                                        werden. Änderungen hier haben keine
                                        sichtbare Wirkung.
                                    </p>

                                    <div className={s.presets}>
                                        {THEME_PRESETS.map((preset) => (
                                            <button
                                                key={preset.label}
                                                type="button"
                                                className="btn btn--quiet btn--sm"
                                                onClick={() => {
                                                    setSuccess(null);
                                                    setFormData((prev) => ({
                                                        ...prev,
                                                        [cardKey]: {
                                                            ...prev[cardKey],
                                                            theme: {
                                                                ...preset.theme,
                                                            },
                                                        },
                                                    }));
                                                }}
                                            >
                                                {preset.label}
                                            </button>
                                        ))}
                                    </div>

                                    <div className={s.themeGrid}>
                                        {(
                                            [
                                                ['highlight', 'Primär'],
                                                ['background', 'Hintergrund'],
                                                ['button', 'Button'],
                                            ] as const
                                        ).map(([slot, label]) => {
                                            const value = card.theme[slot];
                                            const options =
                                                COLOR_NAMES.includes(value)
                                                    ? COLOR_NAMES
                                                    : [value, ...COLOR_NAMES];

                                            return (
                                                <div
                                                    className="field"
                                                    key={slot}
                                                >
                                                    <label
                                                        htmlFor={`${base}-theme-${slot}`}
                                                    >
                                                        {label}
                                                    </label>
                                                    <select
                                                        id={`${base}-theme-${slot}`}
                                                        className="select"
                                                        value={value}
                                                        onChange={(event) =>
                                                            updateTheme(
                                                                cardKey,
                                                                slot,
                                                                event.target
                                                                    .value
                                                            )
                                                        }
                                                    >
                                                        {options.map(
                                                            (option) => (
                                                                <option
                                                                    key={option}
                                                                    value={
                                                                        option
                                                                    }
                                                                >
                                                                    {option}
                                                                </option>
                                                            )
                                                        )}
                                                    </select>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            <div className={s.previewCol}>
                                <h3 className={s.previewLabel}>
                                    Vorschau der Startseite
                                </h3>
                                <div className={s.previewCard}>
                                    <div className="dossier dossier--card">
                                        {card.image_url && (
                                            <Image
                                                src={card.image_url}
                                                alt=""
                                                width={640}
                                                height={360}
                                                unoptimized
                                            />
                                        )}
                                        <span className="dossier-kicker">
                                            {card.subtitle || 'Dorfwissen'}
                                        </span>
                                        <span className="dossier-title">
                                            {card.title || 'Ohne Titel'}
                                        </span>
                                        {card.description && (
                                            <span className="dossier-note">
                                                {card.description}
                                            </span>
                                        )}
                                        {card.button_text &&
                                            card.button_href && (
                                                <span className="arrow-link">
                                                    {card.button_text}
                                                </span>
                                            )}
                                    </div>
                                </div>

                                <div className={s.imageBlock}>
                                    <div className={s.imageFrame}>
                                        {card.image_url ? (
                                            <Image
                                                src={card.image_url}
                                                alt={`Bild der Karte ${info.number}`}
                                                width={640}
                                                height={360}
                                                unoptimized
                                            />
                                        ) : (
                                            <span>Kein Bild gewählt</span>
                                        )}
                                    </div>
                                    <div className="admin-actions">
                                        <button
                                            type="button"
                                            className="btn btn--quiet btn--sm"
                                            onClick={() => setPickerFor(cardKey)}
                                        >
                                            {card.image_url
                                                ? 'Bild ändern'
                                                : 'Bild wählen'}
                                        </button>
                                        {card.image_url && (
                                            <button
                                                type="button"
                                                className="btn btn--danger btn--sm"
                                                onClick={() => {
                                                    updateCard(
                                                        cardKey,
                                                        'image_url',
                                                        undefined
                                                    );
                                                    updateCard(
                                                        cardKey,
                                                        'image_id',
                                                        undefined
                                                    );
                                                }}
                                            >
                                                Bild entfernen
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </fieldset>
                );
            })}

            <div className={s.saveBar}>
                <p className="hint">
                    {layoutId
                        ? 'Änderungen an diesem Layout werden nach dem Speichern für die Startseite übernommen.'
                        : 'Das neue Layout ist zunächst inaktiv.'}
                </p>
                <span className="admin-actions">
                    <Link
                        className="btn btn--quiet"
                        href="/admin/wendessen"
                    >
                        Zur Übersicht
                    </Link>
                    <button
                        type="button"
                        className="btn btn--primary"
                        onClick={save}
                        disabled={saving}
                    >
                        {saving ? 'Speichern …' : 'Speichern'}
                    </button>
                </span>
            </div>

            {pickerFor && (
                <WendessenImagePicker
                    canUpload={canUpload}
                    onClose={() => setPickerFor(null)}
                    onSelect={(image) => {
                        updateCard(pickerFor, 'image_id', image.id);
                        updateCard(pickerFor, 'image_url', image.url);
                        setPickerFor(null);
                    }}
                />
            )}
        </div>
    );
}
