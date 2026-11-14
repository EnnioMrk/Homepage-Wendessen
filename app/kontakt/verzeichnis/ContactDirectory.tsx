'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { normalizeLegacyImportance } from '@/lib/constants/contact-priorities';
import styles from './verzeichnis.module.css';

export interface DirectoryContact {
    id: string;
    name: string;
    emails: string[];
    phones: { type: string; value: string }[];
    addresses: string[];
    affiliations: { org: string; role: string }[];
    importance: number;
    firstOrg: string;
    firstRole: string;
}

type SortKey = 'priority' | 'name' | 'org';

const sortLabels: Record<SortKey, string> = {
    priority: 'Priorität',
    name: 'Name',
    org: 'Organisation',
};

function telHref(value: string): string {
    return `tel:${value.replace(/[^\d+]/g, '')}`;
}

function matches(needle: string, contact: DirectoryContact): boolean {
    if (contact.name.toLowerCase().includes(needle)) return true;
    if (contact.emails.some((email) => email.toLowerCase().includes(needle)))
        return true;
    if (
        contact.phones.some((phone) =>
            phone.value.toLowerCase().includes(needle),
        )
    )
        return true;
    if (
        contact.addresses.some((address) =>
            address.toLowerCase().includes(needle),
        )
    )
        return true;
    return contact.affiliations.some(
        (affiliation) =>
            affiliation.org.toLowerCase().includes(needle) ||
            affiliation.role.toLowerCase().includes(needle),
    );
}

export default function ContactDirectory({
    initial,
}: {
    initial: DirectoryContact[];
}) {
    const [query, setQuery] = useState('');
    const [organization, setOrganization] = useState('');
    const [sort, setSort] = useState<SortKey>('priority');
    const searchRef = useRef<HTMLInputElement>(null);

    const organizations = useMemo(() => {
        const set = new Set<string>();
        for (const contact of initial) {
            for (const affiliation of contact.affiliations ?? []) {
                if (affiliation.org) set.add(affiliation.org);
            }
        }
        return Array.from(set).sort((a, b) => a.localeCompare(b, 'de'));
    }, [initial]);

    const rows = useMemo(() => {
        const needle = query.trim().toLowerCase();
        const filtered = initial.filter((contact) => {
            const matchesQuery = !needle || matches(needle, contact);
            const matchesOrganization =
                !organization ||
                contact.affiliations?.some(
                    (affiliation) => affiliation.org === organization,
                );
            return matchesQuery && matchesOrganization;
        });

        return filtered.sort((a, b) => {
            if (sort === 'name') return a.name.localeCompare(b.name, 'de');
            if (sort === 'org') {
                return (
                    a.firstOrg.localeCompare(b.firstOrg, 'de') ||
                    a.name.localeCompare(b.name, 'de')
                );
            }
            return (
                normalizeLegacyImportance(b.importance) -
                    normalizeLegacyImportance(a.importance) ||
                a.name.localeCompare(b.name, 'de')
            );
        });
    }, [initial, query, organization, sort]);

    // "/" jumps to the search field, Escape clears it.
    useEffect(() => {
        const onKeyDown = (event: KeyboardEvent) => {
            const target = event.target as HTMLElement | null;
            const typing =
                target?.tagName === 'INPUT' ||
                target?.tagName === 'TEXTAREA' ||
                target?.tagName === 'SELECT' ||
                target?.isContentEditable;

            if (event.key === '/' && !typing && !event.metaKey && !event.ctrlKey) {
                event.preventDefault();
                searchRef.current?.focus();
                return;
            }

            if (
                event.key === 'Escape' &&
                target === searchRef.current &&
                query.length > 0
            ) {
                setQuery('');
            }
        };

        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [query]);

    const hasFilter = query.trim().length > 0 || organization.length > 0;

    const reset = () => {
        setQuery('');
        setOrganization('');
        setSort('priority');
        searchRef.current?.focus();
    };

    return (
        <div>
            <div className="filterbar">
                <div className="field grow">
                    <label htmlFor="dir-search">Suche</label>
                    <input
                        ref={searchRef}
                        id="dir-search"
                        className="input"
                        type="search"
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Name, E-Mail, Organisation, Rolle"
                        autoComplete="off"
                    />
                </div>
                <div className="field">
                    <label htmlFor="dir-org">Organisation</label>
                    <select
                        id="dir-org"
                        className="select"
                        value={organization}
                        onChange={(event) =>
                            setOrganization(event.target.value)
                        }
                    >
                        <option value="">Alle Organisationen</option>
                        {organizations.map((entry) => (
                            <option key={entry} value={entry}>
                                {entry}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="field">
                    <label htmlFor="dir-sort">Sortierung</label>
                    <select
                        id="dir-sort"
                        className="select"
                        value={sort}
                        onChange={(event) =>
                            setSort(event.target.value as SortKey)
                        }
                    >
                        {(Object.keys(sortLabels) as SortKey[]).map((key) => (
                            <option key={key} value={key}>
                                {sortLabels[key]}
                            </option>
                        ))}
                    </select>
                </div>
                <p className="count" aria-live="polite">
                    {rows.length} von {initial.length}
                </p>
            </div>

            <p className="muted small" style={{ marginBottom: 'var(--s3)' }}>
                Kürzel: <span className={styles.key}>/</span> springt in die
                Suche, <span className={styles.key}>Esc</span> leert sie. Die
                Priorität ist die Reihenfolge der Redaktion, keine Aussage über
                Zuständigkeit.
            </p>

            {rows.length > 0 ? (
                <div className="dir">
                    {rows.map((contact) => {
                        const priority =
                            normalizeLegacyImportance(contact.importance) + 1;
                        const hasContact =
                            contact.emails.length > 0 ||
                            contact.phones.length > 0 ||
                            contact.addresses.length > 0;

                        return (
                            <div
                                key={contact.id}
                                id={`kontakt-${contact.id}`}
                                className={`dir-person ${styles.row}`}
                            >
                                <div>
                                    <p className="dir-name">{contact.name}</p>
                                    <p className={styles.priorityMobile}>
                                        Priorität {priority}
                                    </p>
                                    <p className="dir-affil">
                                        {contact.affiliations.length > 0 ? (
                                            contact.affiliations.map(
                                                (affiliation, index) => (
                                                    <span
                                                        key={`${affiliation.org}-${index}`}
                                                        className={
                                                            styles.affiliation
                                                        }
                                                    >
                                                        {affiliation.role}
                                                        {affiliation.org
                                                            ? ` · ${affiliation.org}`
                                                            : ''}
                                                    </span>
                                                ),
                                            )
                                        ) : (
                                            <span className={styles.affiliation}>
                                                Ohne Zuordnung
                                            </span>
                                        )}
                                    </p>
                                </div>

                                <div className="dir-contacts">
                                    {contact.emails.map((email) => (
                                        <a key={email} href={`mailto:${email}`}>
                                            {email}
                                        </a>
                                    ))}
                                    {contact.phones.map((phone) => (
                                        <a
                                            key={`${phone.type}-${phone.value}`}
                                            href={telHref(phone.value)}
                                        >
                                            {phone.value}
                                            <span className="muted">
                                                {phone.type === 'mobile'
                                                    ? ' (Mobil)'
                                                    : ''}
                                            </span>
                                        </a>
                                    ))}
                                    {contact.addresses.map((address) => (
                                        <span key={address}>{address}</span>
                                    ))}
                                    {!hasContact ? (
                                        <span className="muted">
                                            Keine Kontaktdaten hinterlegt
                                        </span>
                                    ) : null}
                                </div>

                                <p className="dir-importance">
                                    Priorität {priority}
                                </p>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="empty">
                    <h3>Keine Treffer</h3>
                    <p>
                        Für „{query.trim() || organization}“ ist niemand im
                        Verzeichnis verzeichnet. Prüfen Sie die Schreibweise oder
                        setzen Sie die Filter zurück.
                    </p>
                    <button className="btn" type="button" onClick={reset}>
                        Filter zurücksetzen
                    </button>
                </div>
            )}

            <p className="muted small" style={{ marginTop: 'var(--s5)' }}>
                Die Kontakte werden von der Redaktion gepflegt. Änderungen und
                Ergänzungen gehen über das{' '}
                <Link className="link" href="/kontakt/formular">
                    Kontaktformular
                </Link>{' '}
                an den Ortsrat. Eine Person direkt erreichen:{' '}
                <Link className="link" href="/kontakt/christina-balder">
                    Christina Balder
                </Link>
                .
                {hasFilter
                    ? ' Die Auswahl ist gefiltert; die Randspalte zählt alle Einträge.'
                    : ''}
            </p>
        </div>
    );
}
