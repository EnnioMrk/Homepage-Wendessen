'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { AdminHead, Panel } from '@/app/components/admin/AdminPage';
import ConfirmDialog from '@/app/admin/contacts/components/ConfirmDialog';
import styles from './organizations.module.css';

interface Organization {
    id: string;
    title: string;
    alt_title: string | null;
    description: string | null;
}

const EMPTY_FORM = { id: '', title: '', alt_title: '', description: '' };

export default function AdminOrganizationsClient() {
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [notice, setNotice] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [editingOrg, setEditingOrg] = useState<Organization | null>(null);
    const [deleteCandidate, setDeleteCandidate] = useState<Organization | null>(
        null,
    );
    const [isDeleting, setIsDeleting] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

    const [formData, setFormData] = useState(EMPTY_FORM);

    const fetchOrganizations = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/admin/organizations');
            if (response.ok) {
                const data = await response.json();
                setOrganizations(data.organizations || []);
            } else {
                setError('Fehler beim Laden der Organisationen');
            }
        } catch (fetchError) {
            console.error('Error fetching organizations:', fetchError);
            setError('Die Organisationen konnten nicht geladen werden.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchOrganizations();
    }, [fetchOrganizations]);

    const filteredOrgs = useMemo(() => {
        const query = searchQuery.toLowerCase();
        return organizations
            .filter(
                (org) =>
                    !query ||
                    org.title.toLowerCase().includes(query) ||
                    (org.alt_title ?? '').toLowerCase().includes(query) ||
                    (org.description ?? '').toLowerCase().includes(query) ||
                    org.id.toLowerCase().includes(query),
            )
            .sort((a, b) => a.title.localeCompare(b.title, 'de'));
    }, [organizations, searchQuery]);

    const openEditor = (org?: Organization) => {
        setFormError(null);
        setNotice(null);
        if (org) {
            setEditingOrg(org);
            setFormData({
                id: org.id,
                title: org.title,
                alt_title: org.alt_title || '',
                description: org.description || '',
            });
        } else {
            setEditingOrg(null);
            setFormData(EMPTY_FORM);
        }
        setIsEditorOpen(true);
    };

    const closeEditor = () => {
        setIsEditorOpen(false);
        setEditingOrg(null);
        setFormData(EMPTY_FORM);
        setFormError(null);
    };

    const handleSave = async (event: React.FormEvent) => {
        event.preventDefault();

        if (!formData.title.trim() || !formData.id.trim()) {
            setFormError('Titel und Kennung sind erforderlich.');
            return;
        }

        setIsSaving(true);
        setFormError(null);
        try {
            const url = editingOrg
                ? `/api/admin/organizations/${editingOrg.id}`
                : '/api/admin/organizations';
            const method = editingOrg ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                await fetchOrganizations();
                setNotice(
                    editingOrg
                        ? `Die Organisation „${formData.title}“ wurde gespeichert.`
                        : `Die Organisation „${formData.title}“ wurde angelegt.`,
                );
                closeEditor();
            } else {
                const data = await response.json().catch(() => ({}));
                setFormError(
                    data.error || 'Die Organisation konnte nicht gespeichert werden.',
                );
            }
        } catch (saveError) {
            console.error('Error saving organization:', saveError);
            setFormError('Die Organisation konnte nicht gespeichert werden.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        setIsDeleting(true);
        try {
            const response = await fetch(`/api/admin/organizations/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setOrganizations((prev) => prev.filter((o) => o.id !== id));
                setNotice(
                    `Die Organisation „${deleteCandidate?.title ?? ''}“ wurde gelöscht.`,
                );
                setDeleteCandidate(null);
            } else {
                const data = await response.json().catch(() => ({}));
                setError(data.error || 'Fehler beim Löschen');
            }
        } catch (deleteError) {
            console.error('Error deleting organization:', deleteError);
            setError('Die Organisation konnte nicht gelöscht werden.');
        } finally {
            setIsDeleting(false);
        }
    };

    const handleTitleChange = (value: string) => {
        if (!editingOrg) {
            const slug = value
                .toLowerCase()
                .replace(/ä/g, 'ae')
                .replace(/ö/g, 'oe')
                .replace(/ü/g, 'ue')
                .replace(/ß/g, 'ss')
                .replace(/[^a-z0-9 -]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-');
            setFormData((prev) => ({ ...prev, title: value, id: slug }));
        } else {
            setFormData((prev) => ({ ...prev, title: value }));
        }
    };

    if (loading) {
        return (
            <div>
                <AdminHead
                    title="Organisationen"
                    sub="Vereine und Institutionen im Verzeichnis"
                />
                <div className="panel">
                    <div className="panel-body">
                        <p className="muted">Organisationen werden geladen …</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            <AdminHead
                title="Organisationen"
                sub="Vereine und Institutionen im Verzeichnis"
                actions={
                    <>
                        <Link className="btn btn--sm" href="/admin/contacts">
                            Zu den Kontakten
                        </Link>
                        <button
                            type="button"
                            className="btn btn--sm btn--primary"
                            onClick={() => openEditor()}
                        >
                            Neue Organisation
                        </button>
                    </>
                }
            />

            {notice && (
                <div className="notice notice--ok" role="status">
                    <strong>Gespeichert</strong>
                    <span>{notice}</span>
                </div>
            )}

            {error && (
                <div className="notice notice--error" role="alert">
                    <strong>Organisationen nicht geladen</strong>
                    <span>{error}</span>
                    <span>
                        <button
                            type="button"
                            className="btn btn--sm btn--quiet"
                            onClick={fetchOrganizations}
                        >
                            Erneut laden
                        </button>
                    </span>
                </div>
            )}

            {isEditorOpen && (
                <Panel
                    title={
                        editingOrg
                            ? `Organisation bearbeiten · ${editingOrg.title}`
                            : 'Neue Organisation'
                    }
                    actions={
                        <button
                            type="button"
                            className="btn btn--sm btn--quiet"
                            onClick={closeEditor}
                        >
                            Schließen
                        </button>
                    }
                >
                    <form onSubmit={handleSave}>
                        {formError && (
                            <div
                                className="notice notice--error"
                                role="alert"
                                style={{ marginBottom: 'var(--s4)' }}
                            >
                                <strong>Nicht gespeichert</strong>
                                <span>{formError}</span>
                            </div>
                        )}

                        <div className="form-grid">
                            <div className="form-row">
                                <div className="field">
                                    <label htmlFor="org-title">Titel *</label>
                                    <input
                                        className="input"
                                        id="org-title"
                                        type="text"
                                        required
                                        value={formData.title}
                                        onChange={(event) =>
                                            handleTitleChange(
                                                event.target.value,
                                            )
                                        }
                                    />
                                </div>
                                <div className="field">
                                    <label htmlFor="org-id">
                                        Kennung (Slug) *
                                    </label>
                                    <input
                                        className="input"
                                        id="org-id"
                                        type="text"
                                        required
                                        disabled={!!editingOrg}
                                        value={formData.id}
                                        onChange={(event) =>
                                            setFormData((prev) => ({
                                                ...prev,
                                                id: event.target.value,
                                            }))
                                        }
                                    />
                                    <p className="hint">
                                        {editingOrg
                                            ? 'Die Kennung kann nach dem Anlegen nicht mehr geändert werden.'
                                            : 'Wird aus dem Titel gebildet und kann angepasst werden.'}
                                    </p>
                                </div>
                            </div>

                            <div className="field">
                                <label htmlFor="org-alt">
                                    Alternativer Titel (Kurzform)
                                </label>
                                <input
                                    className="input"
                                    id="org-alt"
                                    type="text"
                                    value={formData.alt_title}
                                    onChange={(event) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            alt_title: event.target.value,
                                        }))
                                    }
                                />
                            </div>

                            <div className="field">
                                <label htmlFor="org-description">
                                    Beschreibung
                                </label>
                                <textarea
                                    className="textarea"
                                    id="org-description"
                                    rows={4}
                                    value={formData.description}
                                    onChange={(event) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            description: event.target.value,
                                        }))
                                    }
                                />
                            </div>
                        </div>

                        <div className={styles.formFoot}>
                            <button
                                type="button"
                                className="btn btn--quiet"
                                onClick={closeEditor}
                            >
                                Abbrechen
                            </button>
                            <button
                                type="submit"
                                className="btn btn--primary"
                                disabled={isSaving}
                            >
                                {isSaving ? 'Speichern …' : 'Speichern'}
                            </button>
                        </div>
                    </form>
                </Panel>
            )}

            <div className="admin-filter" style={{ marginTop: isEditorOpen ? 'var(--s5)' : undefined }}>
                <div className="field" style={{ flex: '1 1 260px' }}>
                    <label htmlFor="org-search">Suche</label>
                    <input
                        className="input"
                        id="org-search"
                        type="search"
                        placeholder="Titel, Kurzform, Kennung"
                        value={searchQuery}
                        onChange={(event) =>
                            setSearchQuery(event.target.value)
                        }
                    />
                </div>
                {searchQuery && (
                    <button
                        type="button"
                        className="btn btn--sm btn--quiet"
                        onClick={() => setSearchQuery('')}
                    >
                        Zurücksetzen
                    </button>
                )}
            </div>

            <p className={styles.sub} role="status">
                {filteredOrgs.length === organizations.length
                    ? `${organizations.length} Organisationen`
                    : `${filteredOrgs.length} von ${organizations.length} Organisationen`}
            </p>

            {filteredOrgs.length === 0 ? (
                organizations.length === 0 ? (
                    <div className="admin-empty">
                        <p>Noch keine Organisation verzeichnet.</p>
                        <button
                            type="button"
                            className="btn btn--sm btn--primary"
                            onClick={() => openEditor()}
                        >
                            Erste Organisation anlegen
                        </button>
                    </div>
                ) : (
                    <div className="admin-empty">
                        <p>Keine Organisation passt zu dieser Suche.</p>
                        <button
                            type="button"
                            className="btn btn--sm btn--quiet"
                            onClick={() => setSearchQuery('')}
                        >
                            Suche zurücksetzen
                        </button>
                    </div>
                )
            ) : (
                <div className={styles.scroll}>
                    <table
                        className={`data ${styles.table}`}
                        aria-label="Organisationen"
                    >
                        <thead>
                            <tr>
                                <th scope="col">Organisation</th>
                                <th scope="col" className={styles.colSlug}>
                                    Kennung
                                </th>
                                <th scope="col" className={styles.colAlt}>
                                    Alternativer Titel
                                </th>
                                <th scope="col" className="right">
                                    Aktionen
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrgs.map((org) => (
                                <tr key={org.id}>
                                    <td>
                                        <div className={styles.orgCell}>
                                            <span className={styles.orgTitle}>
                                                {org.title}
                                            </span>
                                            {org.description ? (
                                                <span className={styles.desc}>
                                                    {org.description}
                                                </span>
                                            ) : null}
                                            <span
                                                className={`${styles.inlineMeta} ${styles.altInline}`}
                                            >
                                                {org.alt_title
                                                    ? `Auch: ${org.alt_title}`
                                                    : 'Kein alternativer Titel'}
                                                {` · Kennung: ${org.id}`}
                                            </span>
                                        </div>
                                    </td>
                                    <td className={styles.colSlug}>
                                        <span className={styles.slug}>
                                            {org.id}
                                        </span>
                                    </td>
                                    <td className={styles.colAlt}>
                                        {org.alt_title ? (
                                            <span className={styles.slug}>
                                                {org.alt_title}
                                            </span>
                                        ) : (
                                            <span className={styles.sub}>—</span>
                                        )}
                                    </td>
                                    <td className="right">
                                        <div className={styles.actions}>
                                            <button
                                                type="button"
                                                className="btn btn--sm btn--quiet"
                                                onClick={() => openEditor(org)}
                                            >
                                                Bearbeiten
                                            </button>
                                            <button
                                                type="button"
                                                className="btn btn--sm btn--danger"
                                                onClick={() =>
                                                    setDeleteCandidate(org)
                                                }
                                            >
                                                Löschen
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <ConfirmDialog
                open={!!deleteCandidate}
                title="Organisation löschen?"
                description={`Die Organisation „${deleteCandidate?.title ?? ''}“ wird entfernt. Kontakte, die ihr zugeordnet sind, behalten den Namen als Text, verlieren aber die Verknüpfung.`}
                confirmLabel="Organisation löschen"
                danger
                busy={isDeleting}
                onConfirm={() =>
                    deleteCandidate && handleDelete(deleteCandidate.id)
                }
                onCancel={() => setDeleteCandidate(null)}
            />
        </div>
    );
}
