'use client';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
    EnvelopeSimple,
    Phone,
    MagnifyingGlass,
    Funnel,
    SortAscending,
    SortDescending,
    Buildings,
    User,
    MapPin,
    UsersThree,
    X,
    DeviceMobile,
} from '@phosphor-icons/react/dist/ssr';

type SortKey = 'vorname' | 'name' | 'org' | 'role';

type FlatContact = {
    id: string;
    name: string;
    emails: string[];
    phones: { type: string; value: string }[];
    addresses: string[];
    affiliations: { org: string; role: string }[];
    firstOrg: string;
    firstRole: string;
    importance: number;
};

function Badge({
    children,
    variant = 'default',
}: {
    children: React.ReactNode;
    variant?: 'default' | 'secondary';
}) {
    const baseClasses =
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium';
    const variantClasses =
        variant === 'secondary'
            ? 'bg-blue-50 text-blue-700 border border-blue-200'
            : 'bg-emerald-50 text-emerald-700 border border-emerald-200';

    return (
        <span className={`${baseClasses} ${variantClasses}`}>{children}</span>
    );
}

// Helper functions for name sorting
function getFirstName(fullName: string): string {
    const parts = fullName.trim().split(' ');
    return parts[0] || '';
}

function getLastName(fullName: string): string {
    const parts = fullName.trim().split(' ');
    return parts[parts.length - 1] || '';
}

// Contact Modal Component
function ContactModal({
    contact,
    isOpen,
    onClose,
}: {
    contact: FlatContact | null;
    isOpen: boolean;
    onClose: () => void;
}) {
    if (!isOpen || !contact) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-3xl">
                    <div className="flex items-start justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">
                                {contact.name}
                            </h2>
                            {contact.affiliations?.[0]?.role && (
                                <p className="text-emerald-700 font-medium mt-1">
                                    {contact.affiliations[0].role}
                                </p>
                            )}
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            aria-label="Schließen"
                        >
                            <X className="w-6 h-6 text-gray-500" />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Organizations */}
                    {contact.affiliations.length > 0 && (
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                                <Buildings className="w-5 h-5 mr-2 text-emerald-600" />
                                Organisationen
                            </h3>
                            <div className="space-y-2">
                                {contact.affiliations.map((aff, idx) => (
                                    <div
                                        key={idx}
                                        className="bg-gray-50 rounded-lg p-3"
                                    >
                                        <div className="font-medium text-gray-900">
                                            {aff.org}
                                        </div>
                                        <div className="text-sm text-emerald-700">
                                            {aff.role}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Contact Information */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">
                            Kontaktinformationen
                        </h3>
                        <div className="space-y-3">
                            {/* Emails */}
                            {contact.emails.length > 0 && (
                                <div>
                                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                                        E-Mail-Adressen
                                    </h4>
                                    <div className="space-y-2">
                                        {contact.emails.map((email, idx) => (
                                            <a
                                                key={idx}
                                                href={`mailto:${email}`}
                                                className="flex items-center text-blue-700 hover:text-blue-900 hover:underline transition-colors"
                                            >
                                                <EnvelopeSimple className="w-4 h-4 mr-2 flex-shrink-0" />
                                                <span>{email}</span>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Phones */}
                            {contact.phones.length > 0 && (
                                <div>
                                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                                        Telefonnummern
                                    </h4>
                                    <div className="space-y-2">
                                        {contact.phones.map((phone, idx) => (
                                            <a
                                                key={idx}
                                                href={`tel:${phone.value}`}
                                                className="flex items-center text-blue-700 hover:text-blue-900 hover:underline transition-colors"
                                            >
                                                {phone.type === 'mobile' ? (
                                                    <DeviceMobile className="w-4 h-4 mr-2 flex-shrink-0" />
                                                ) : (
                                                    <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                                                )}
                                                <span>{phone.value}</span>
                                                <span className="ml-2 text-xs text-gray-500 capitalize">
                                                    ({phone.type})
                                                </span>
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Addresses */}
                            {contact.addresses.length > 0 && (
                                <div>
                                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                                        Adressen
                                    </h4>
                                    <div className="space-y-2">
                                        {contact.addresses.map(
                                            (address, idx) => (
                                                <div
                                                    key={idx}
                                                    className="flex items-start text-gray-600"
                                                >
                                                    <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-gray-400" />
                                                    <span className="text-sm leading-relaxed">
                                                        {address}
                                                    </span>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

function ContactCard({
    name,
    emails,
    phones,
    affiliations,
    addresses,
    onClick,
}: {
    name: string;
    emails: string[];
    phones: { type: string; value: string }[];
    affiliations: { org: string; role: string }[];
    addresses: string[];
    onClick: () => void;
}) {
    const firstEmail = emails?.[0];
    const firstPhone = phones?.[0];
    const firstAff = affiliations?.[0];
    const hasMultipleRoles = affiliations.length > 1;

    return (
        <div
            onClick={onClick}
            className="group bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg hover:border-emerald-300 transition-all duration-300 overflow-hidden cursor-pointer h-full flex flex-col"
        >
            <div className="p-6 flex-1 flex flex-col">
                {/* Header */}
                <div className="mb-3">
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-emerald-700 transition-colors mb-2">
                        {name}
                    </h3>
                    <div className="flex flex-wrap gap-1">
                        {firstAff?.role && <Badge>{firstAff.role}</Badge>}
                        {hasMultipleRoles && (
                            <Badge variant="secondary">
                                +{affiliations.length - 1} mehr
                            </Badge>
                        )}
                    </div>
                </div>

                {/* Organization */}
                {firstAff?.org && (
                    <div className="flex items-center text-sm text-gray-600 mb-4">
                        <Buildings className="w-4 h-4 mr-2 text-emerald-600 flex-shrink-0" />
                        <span className="truncate">{firstAff.org}</span>
                    </div>
                )}

                {/* Contact Methods */}
                <div className="space-y-2 mb-4">
                    {firstEmail && (
                        <a
                            href={`mailto:${firstEmail}`}
                            className="flex items-center text-blue-700 hover:text-blue-900 hover:underline transition-colors group/link"
                        >
                            <EnvelopeSimple className="w-4 h-4 mr-2 flex-shrink-0" />
                            <span className="truncate text-sm">
                                {firstEmail}
                            </span>
                        </a>
                    )}
                    {firstPhone && (
                        <a
                            href={`tel:${firstPhone.value}`}
                            className="flex items-center text-blue-700 hover:text-blue-900 hover:underline transition-colors group/link"
                        >
                            <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                            <span className="text-sm">{firstPhone.value}</span>
                            {firstPhone.type !== 'phone' && (
                                <span className="ml-1 text-xs text-gray-500">
                                    ({firstPhone.type})
                                </span>
                            )}
                        </a>
                    )}
                    {addresses?.[0] && (
                        <div className="flex items-start text-sm text-gray-600">
                            <MapPin className="w-4 h-4 mr-2 mt-0.5 flex-shrink-0 text-gray-400" />
                            <span className="text-xs leading-relaxed">
                                {addresses[0]}
                            </span>
                        </div>
                    )}
                </div>

                {/* Additional Info */}
                {(emails.length > 1 || phones.length > 1) && (
                    <div className="text-xs text-gray-500 flex items-center mt-auto pt-2">
                        <UsersThree className="w-3 h-3 mr-1" />
                        {emails.length > 1 && `${emails.length} E-Mails`}
                        {emails.length > 1 && phones.length > 1 && ' • '}
                        {phones.length > 1 && `${phones.length} Telefonnummern`}
                    </div>
                )}
            </div>
        </div>
    );
}

export default function ContactDirectory({
    initial,
}: {
    initial: FlatContact[];
}) {
    const [q, setQ] = useState('');
    const [orgFilter, setOrgFilter] = useState<string>('');
    const [sortKey, setSortKey] = useState<SortKey>('role');
    const [asc, setAsc] = useState(false);
    const [selectedContact, setSelectedContact] = useState<FlatContact | null>(
        null
    );
    const [isModalOpen, setIsModalOpen] = useState(false);

    const allOrgs = useMemo(() => {
        const set = new Set<string>();
        initial.forEach((c) =>
            c.affiliations?.forEach((a) => a.org && set.add(a.org))
        );
        return Array.from(set).sort();
    }, [initial]);

    const filtered = useMemo(() => {
        const needle = q.trim().toLowerCase();
        const arr = initial.filter((c) => {
            const matchesQ =
                !needle ||
                c.name.toLowerCase().includes(needle) ||
                c.emails?.some((e) => e.toLowerCase().includes(needle)) ||
                c.phones?.some((p) => p.value.toLowerCase().includes(needle)) ||
                c.affiliations?.some(
                    (a) =>
                        a.org.toLowerCase().includes(needle) ||
                        a.role.toLowerCase().includes(needle)
                );
            const matchesOrg =
                !orgFilter || c.affiliations?.some((a) => a.org === orgFilter);
            return matchesQ && matchesOrg;
        });

        arr.sort((a, b) => {
            if (sortKey === 'role') {
                // Secret importance-based sorting (higher importance = higher in list)
                return asc
                    ? a.importance - b.importance
                    : b.importance - a.importance;
            }

            const ak =
                sortKey === 'vorname'
                    ? getFirstName(a.name)
                    : sortKey === 'name'
                        ? getLastName(a.name)
                        : a.firstOrg; // org sorting
            const bk =
                sortKey === 'vorname'
                    ? getFirstName(b.name)
                    : sortKey === 'name'
                        ? getLastName(b.name)
                        : b.firstOrg;
            return asc ? ak.localeCompare(bk) : bk.localeCompare(ak);
        });
        return arr;
    }, [initial, q, orgFilter, sortKey, asc]);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (
                e.key === '/' &&
                (e.target as HTMLElement)?.tagName !== 'INPUT'
            ) {
                e.preventDefault();
                const el = document.getElementById(
                    'dir-search'
                ) as HTMLInputElement | null;
                el?.focus();
            }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, []);

    return (
        <div className="max-w-7xl mx-auto">
            {/* Controls */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2 block h-5">
                            Suche
                        </label>
                        <div className="relative">
                            <MagnifyingGlass className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                id="dir-search"
                                value={q}
                                onChange={(e) => setQ(e.target.value)}
                                placeholder="Name, E-Mail, Organisation, Rolle… (Drücke /)"
                                className="w-full h-12 pl-10 pr-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors text-gray-900"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2 block h-5">
                            Organisation
                        </label>
                        <div className="relative">
                            <Funnel className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <select
                                value={orgFilter}
                                onChange={(e) => setOrgFilter(e.target.value)}
                                className="w-full h-12 pl-10 pr-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white transition-colors appearance-none text-gray-900"
                            >
                                <option value="">Alle Organisationen</option>
                                {allOrgs.map((o) => (
                                    <option key={o} value={o}>
                                        {o}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <label className="text-sm font-semibold text-gray-700 mb-2 block h-5">
                            Sortierung
                        </label>
                        <div className="flex gap-2 h-12">
                            <select
                                value={sortKey}
                                onChange={(e) =>
                                    setSortKey(e.target.value as SortKey)
                                }
                                className="flex-1 h-full pl-3 pr-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white transition-colors appearance-none text-gray-900"
                            >
                                <option value="vorname">Vorname</option>
                                <option value="name">Name</option>
                                <option value="org">Organisation</option>
                                <option value="role">Rolle</option>
                            </select>
                            <button
                                onClick={() => setAsc(!asc)}
                                className="inline-flex items-center justify-center w-12 h-full rounded-xl border border-gray-300 hover:bg-emerald-50 hover:border-emerald-300 transition-colors"
                                aria-label={
                                    asc
                                        ? 'Aufsteigend sortieren'
                                        : 'Absteigend sortieren'
                                }
                                title={
                                    asc
                                        ? 'Aktuell: Aufsteigend'
                                        : 'Aktuell: Absteigend'
                                }
                            >
                                {asc ? (
                                    <SortAscending className="w-5 h-5 text-emerald-700" />
                                ) : (
                                    <SortDescending className="w-5 h-5 text-emerald-700" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filtered.map((c) => (
                    <ContactCard
                        key={c.id}
                        name={c.name}
                        emails={c.emails}
                        phones={c.phones}
                        affiliations={c.affiliations}
                        addresses={c.addresses}
                        onClick={() => {
                            setSelectedContact(c);
                            setIsModalOpen(true);
                        }}
                    />
                ))}
                {filtered.length === 0 && (
                    <div className="col-span-full text-center text-gray-600 bg-white border-2 border-dashed border-gray-300 rounded-2xl py-16">
                        <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">
                            Keine Kontakte gefunden
                        </h3>
                        <p className="text-gray-500">
                            Versuchen Sie einen anderen Suchbegriff oder setzen
                            Sie die Filter zurück.
                        </p>
                        {(q || orgFilter) && (
                            <button
                                onClick={() => {
                                    setQ('');
                                    setOrgFilter('');
                                }}
                                className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                            >
                                Filter zurücksetzen
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Footer Info */}
            <div className="mt-12 text-center text-sm text-gray-500">
                <p>
                    Die Kontakte werden regelmäßig aktualisiert.
                </p>
                <p className="mt-1">
                    Bei Änderungen oder Ergänzungen wenden Sie sich bitte an den{' '}
                    <Link
                        href="/kontakt/andreas-rink"
                        className="text-emerald-600 hover:text-emerald-700 underline"
                    >
                        Ortsbürgermeister
                    </Link>
                    .
                </p>
            </div>

            {/* Contact Modal */}
            <ContactModal
                contact={selectedContact}
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedContact(null);
                }}
            />
        </div>
    );
}
