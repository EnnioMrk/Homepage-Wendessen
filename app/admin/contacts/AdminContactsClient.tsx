'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { AdminHead } from '@/app/components/admin/AdminPage';
import ConfirmDialog from './components/ConfirmDialog';
import styles from './contacts.module.css';
import {
    CONTACT_PRIORITY_STOPS,
    getContactPriorityStop,
    normalizeLegacyImportance,
} from '@/lib/constants/contact-priorities';

interface Contact {
    id: string;
    name: string;
    emails: string[];
    phones: { type: string; value: string }[];
    addresses: string[];
    affiliations: { org: string; role: string }[];
    importance: number;
}

interface Organization {
    id: string;
    title: string;
}

interface AdminContactsClientProps {
    canCreate?: boolean;
    canEdit?: boolean;
    canDelete?: boolean;
}

type SortKey = 'name' | 'priority' | 'org';

const SORT_LABELS: Record<SortKey, string> = {
    name: 'Name A–Z',
    priority: 'Priorität, hoch zuerst',
    org: 'Organisation A–Z',
};

export default function AdminContactsClient({
    canCreate = false,
    canEdit = false,
    canDelete = false,
}: AdminContactsClientProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [notice, setNotice] = useState<string | null>(null);
    const savedNotice =
        searchParams.get('hinweis') === 'gespeichert'
            ? 'Der Kontakt wurde gespeichert.'
            : null;
    const [contactToDelete, setContactToDelete] = useState<Contact | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedOrg, setSelectedOrg] = useState('');
    const [selectedImportance, setSelectedImportance] = useState('');
    const [sort, setSort] = useState<SortKey>('name');

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [contactsRes, orgsRes] = await Promise.all([
                fetch('/api/admin/contacts'),
                fetch('/api/admin/organizations'),
            ]);

            if (contactsRes.ok) {
                const contactsData = await contactsRes.json();
                setContacts(
                    (contactsData.contacts || []).map((contact: Contact) => ({
                        ...contact,
                        importance: normalizeLegacyImportance(
                            contact.importance,
                        ),
                    })),
                );
            } else {
                setError('Fehler beim Laden der Kontakte');
            }

            if (orgsRes.ok) {
                const orgsData = await orgsRes.json();
                setOrganizations(orgsData.organizations || []);
            }
        } catch (fetchError) {
            console.error('Error fetching data:', fetchError);
            setError('Die Kontakte konnten nicht geladen werden.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const filteredContacts = useMemo(() => {
        const query = searchQuery.toLowerCase();

        const filtered = contacts.filter((contact) => {
            const matchesSearch =
                !query ||
                contact.name.toLowerCase().includes(query) ||
                contact.emails.some((email) =>
                    email.toLowerCase().includes(query),
                ) ||
                contact.phones.some((phone) =>
                    phone.value.toLowerCase().includes(query),
                ) ||
                contact.addresses.some((address) =>
                    address.toLowerCase().includes(query),
                ) ||
                contact.affiliations.some(
                    (aff) =>
                        aff.org.toLowerCase().includes(query) ||
                        aff.role.toLowerCase().includes(query),
                );

            const matchesOrg =
                !selectedOrg ||
                contact.affiliations.some((aff) => aff.org === selectedOrg);

            const matchesImportance =
                !selectedImportance ||
                contact.importance === parseInt(selectedImportance, 10);

            return matchesSearch && matchesOrg && matchesImportance;
        });

        return [...filtered].sort((a, b) => {
            if (sort === 'priority') {
                return (
                    b.importance - a.importance ||
                    a.name.localeCompare(b.name, 'de')
                );
            }
            if (sort === 'org') {
                const aOrg = a.affiliations[0]?.org ?? '\uffff';
                const bOrg = b.affiliations[0]?.org ?? '\uffff';
                return (
                    aOrg.localeCompare(bOrg, 'de') ||
                    a.name.localeCompare(b.name, 'de')
                );
            }
            return a.name.localeCompare(b.name, 'de');
        });
    }, [contacts, searchQuery, selectedOrg, selectedImportance, sort]);

    const handleDelete = async (id: string) => {
        setIsDeleting(true);
        try {
            const response = await fetch(`/api/admin/contacts/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setContacts((prev) =>
                    prev.filter((contact) => contact.id !== id),
                );
                setNotice(
                    `Der Kontakt „${contactToDelete?.name ?? ''}“ wurde gelöscht.`,
                );
                setContactToDelete(null);
            } else {
                const data = await response.json();
                setError(data.error || 'Fehler beim Löschen des Kontakts');
            }
        } catch (deleteError) {
            console.error('Error deleting contact:', deleteError);
            setError('Der Kontakt konnte nicht gelöscht werden.');
        } finally {
            setIsDeleting(false);
        }
    };

    const clearFilters = () => {
        setSearchQuery('');
        setSelectedOrg('');
        setSelectedImportance('');
        setSort('name');
    };

    const openContact = (id: string) => {
        router.push(`/admin/contacts/${id}`);
    };

    const hasActiveFilters =
        searchQuery !== '' ||
        selectedOrg !== '' ||
        selectedImportance !== '' ||
        sort !== 'name';

    const head = (
        <AdminHead
            title="Kontakte"
            sub={
                <span>Ansprechpartner, Adressen und Vereinsfunktionen</span>
            }
            actions={
                <>
                    <Link className="btn btn--sm" href="/admin/organizations">
                        Organisationen
                    </Link>
                    {canCreate && (
                        <Link
                            className="btn btn--sm btn--primary"
                            href="/admin/contacts/neu"
                        >
                            Neuer Kontakt
                        </Link>
                    )}
                </>
            }
        />
    );

    if (loading) {
        return (
            <div>
                {head}
                <div className="panel">
                    <div className="panel-body">
                        <p className="muted">Kontakte werden geladen …</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            {head}

            {(notice ?? savedNotice) && (
                <div className="notice notice--ok" role="status">
                    <strong>Gespeichert</strong>
                    <span>{notice ?? savedNotice}</span>
                </div>
            )}

            {error && (
                <div className="notice notice--error" role="alert">
                    <strong>Kontakte nicht vollständig verfügbar</strong>
                    <span>{error}</span>
                    <span>
                        <button
                            type="button"
                            className="btn btn--sm btn--quiet"
                            onClick={fetchData}
                        >
                            Erneut laden
                        </button>
                    </span>
                </div>
            )}

            <div className="admin-filter">
                <div className="field" style={{ flex: '1 1 240px' }}>
                    <label htmlFor="contact-search">Suche</label>
                    <input
                        className="input"
                        id="contact-search"
                        type="search"
                        placeholder="Name, E-Mail, Telefon, Verein"
                        value={searchQuery}
                        onChange={(event) =>
                            setSearchQuery(event.target.value)
                        }
                    />
                </div>
                <div className="field">
                    <label htmlFor="contact-org">Organisation</label>
                    <select
                        className="select"
                        id="contact-org"
                        value={selectedOrg}
                        onChange={(event) =>
                            setSelectedOrg(event.target.value)
                        }
                    >
                        <option value="">Alle Organisationen</option>
                        {organizations.map((org) => (
                            <option key={org.id} value={org.title}>
                                {org.title}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="field">
                    <label htmlFor="contact-importance">Priorität</label>
                    <select
                        className="select"
                        id="contact-importance"
                        value={selectedImportance}
                        onChange={(event) =>
                            setSelectedImportance(event.target.value)
                        }
                    >
                        <option value="">Alle Prioritäten</option>
                        {[...CONTACT_PRIORITY_STOPS]
                            .sort((a, b) => b.value - a.value)
                            .map((stop) => (
                                <option key={stop.value} value={stop.value}>
                                    {stop.value + 1} · {stop.label}
                                </option>
                            ))}
                    </select>
                </div>
                <div className="field">
                    <label htmlFor="contact-sort">Sortierung</label>
                    <select
                        className="select"
                        id="contact-sort"
                        value={sort}
                        onChange={(event) =>
                            setSort(event.target.value as SortKey)
                        }
                    >
                        {(Object.keys(SORT_LABELS) as SortKey[]).map((key) => (
                            <option key={key} value={key}>
                                {SORT_LABELS[key]}
                            </option>
                        ))}
                    </select>
                </div>
                {hasActiveFilters && (
                    <button
                        type="button"
                        className="btn btn--sm btn--quiet"
                        onClick={clearFilters}
                    >
                        Zurücksetzen
                    </button>
                )}
            </div>

            <p className={styles.sub} role="status">
                {filteredContacts.length === contacts.length
                    ? `${contacts.length} Kontakte`
                    : `${filteredContacts.length} von ${contacts.length} Kontakten`}
                {hasActiveFilters ? ' · gefiltert' : ''}
            </p>

            {filteredContacts.length === 0 ? (
                contacts.length === 0 ? (
                    <div className="admin-empty">
                        <p>Noch kein Kontakt im Verzeichnis.</p>
                        {canCreate && (
                            <Link
                                className="btn btn--sm btn--primary"
                                href="/admin/contacts/neu"
                            >
                                Ersten Kontakt anlegen
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="admin-empty">
                        <p>Kein Kontakt passt zu diesen Filtern.</p>
                        <button
                            type="button"
                            className="btn btn--sm btn--quiet"
                            onClick={clearFilters}
                        >
                            Filter zurücksetzen
                        </button>
                    </div>
                )
            ) : (
                <div className={styles.scroll}>
                    <table className={`data ${styles.table}`} aria-label="Kontaktverzeichnis">
                        <thead>
                            <tr>
                                <th scope="col">Name</th>
                                <th scope="col" className={styles.colOrg}>
                                    Organisation
                                </th>
                                <th scope="col" className={styles.colContact}>
                                    Kontakt
                                </th>
                                <th scope="col" className={styles.colPrio}>
                                    Priorität
                                </th>
                                {(canEdit || canDelete) && (
                                    <th scope="col" className="right">
                                        Aktionen
                                    </th>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredContacts.map((contact) => {
                                const firstEmail = contact.emails[0];
                                const firstPhone = contact.phones[0];
                                const stop = getContactPriorityStop(
                                    contact.importance,
                                );
                                const extraContacts =
                                    contact.emails.length +
                                    contact.phones.length -
                                    (firstEmail ? 1 : 0) -
                                    (firstPhone ? 1 : 0);
                                return (
                                    <tr key={contact.id}>
                                        <td>
                                            <div className={styles.nameCell}>
                                                <span
                                                    className={styles.nameMain}
                                                >
                                                    {contact.name}
                                                </span>
                                                <span
                                                    className={`${styles.inlineMeta} ${styles.orgInline}`}
                                                >
                                                    {contact.affiliations.length >
                                                    0
                                                        ? contact.affiliations
                                                              .map(
                                                                  (aff) =>
                                                                      aff.role
                                                                          ? `${aff.org} · ${aff.role}`
                                                                          : aff.org,
                                                              )
                                                              .join(' / ')
                                                        : 'Keine Organisation'}
                                                </span>
                                                <span
                                                    className={`${styles.inlineMeta} ${styles.contactInline}`}
                                                >
                                                    {firstEmail ? (
                                                        <span>
                                                            {firstEmail}
                                                        </span>
                                                    ) : null}
                                                    {firstPhone ? (
                                                        <span>
                                                            {firstPhone.value}
                                                        </span>
                                                    ) : null}
                                                    <span>
                                                        Priorität{' '}
                                                        {contact.importance + 1} ·{' '}
                                                        {stop.label}
                                                    </span>
                                                </span>
                                            </div>
                                        </td>
                                        <td className={styles.colOrg}>
                                            {contact.affiliations.length ===
                                            0 ? (
                                                <span
                                                    className={
                                                        styles.cellEmpty
                                                    }
                                                >
                                                    —
                                                </span>
                                            ) : (
                                                <div
                                                    className={styles.orgCell}
                                                >
                                                    {contact.affiliations.map(
                                                        (aff, index) => (
                                                            <span key={index}>
                                                                {aff.org}
                                                                {aff.role ? (
                                                                    <span
                                                                        className={
                                                                            styles.orgRole
                                                                        }
                                                                    >
                                                                        {' '}
                                                                        ·{' '}
                                                                        {
                                                                            aff.role
                                                                        }
                                                                    </span>
                                                                ) : null}
                                                            </span>
                                                        ),
                                                    )}
                                                </div>
                                            )}
                                        </td>
                                        <td className={styles.colContact}>
                                            {!firstEmail && !firstPhone ? (
                                                <span
                                                    className={
                                                        styles.cellEmpty
                                                    }
                                                >
                                                    —
                                                </span>
                                            ) : (
                                                <div
                                                    className={
                                                        styles.contactCell
                                                    }
                                                >
                                                    {firstEmail && (
                                                        <span
                                                            className={
                                                                styles.contactLine
                                                            }
                                                        >
                                                            <span
                                                                className={
                                                                    styles.contactType
                                                                }
                                                            >
                                                                E-Mail
                                                            </span>
                                                            <span>
                                                                {firstEmail}
                                                            </span>
                                                        </span>
                                                    )}
                                                    {firstPhone && (
                                                        <span
                                                            className={
                                                                styles.contactLine
                                                            }
                                                        >
                                                            <span
                                                                className={
                                                                    styles.contactType
                                                                }
                                                            >
                                                                {firstPhone.type}
                                                            </span>
                                                            <span>
                                                                {
                                                                    firstPhone.value
                                                                }
                                                            </span>
                                                        </span>
                                                    )}
                                                    {extraContacts > 0 && (
                                                        <span
                                                            className={
                                                                styles.sub
                                                            }
                                                        >
                                                            +{extraContacts}{' '}
                                                            {extraContacts === 1
                                                                ? 'weiterer Eintrag'
                                                                : 'weitere Einträge'}
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </td>
                                        <td className={styles.colPrio}>
                                            <span className={styles.prio}>
                                                <span className={styles.num}>
                                                    {contact.importance + 1}
                                                </span>
                                                <span className={styles.sub}>
                                                    {stop.label}
                                                </span>
                                            </span>
                                        </td>
                                        {(canEdit || canDelete) && (
                                            <td className="right">
                                                <div className={styles.actions}>
                                                    {canEdit && (
                                                        <button
                                                            type="button"
                                                            className="btn btn--sm btn--quiet"
                                                            onClick={() =>
                                                                openContact(
                                                                    contact.id,
                                                                )
                                                            }
                                                        >
                                                            Bearbeiten
                                                        </button>
                                                    )}
                                                    {canDelete && (
                                                        <button
                                                            type="button"
                                                            className="btn btn--sm btn--danger"
                                                            onClick={() =>
                                                                setContactToDelete(
                                                                    contact,
                                                                )
                                                            }
                                                        >
                                                            Löschen
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        )}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            <ConfirmDialog
                open={!!contactToDelete}
                title="Kontakt löschen?"
                description={`Der Kontakt „${contactToDelete?.name ?? ''}“ wird aus dem Verzeichnis entfernt. Diese Aktion kann nicht rückgängig gemacht werden.`}
                confirmLabel="Kontakt löschen"
                danger
                busy={isDeleting}
                onConfirm={() =>
                    contactToDelete && handleDelete(contactToDelete.id)
                }
                onCancel={() => setContactToDelete(null)}
            />
        </div>
    );
}
