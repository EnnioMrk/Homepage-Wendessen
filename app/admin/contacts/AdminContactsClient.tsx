'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash, PencilSimple, Envelope, Phone, Buildings, MagnifyingGlass, Funnel, X, CaretDown } from '@phosphor-icons/react/dist/ssr';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import PromptDialog from '@/app/components/ui/PromptDialog';

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
    canManage?: boolean; // Keep for backward compatibility if needed, though we should remove if possible
}

export default function AdminContactsClient({
    canCreate = false,
    canEdit = false,
    canDelete = false,
    canManage = false // Fallback
}: AdminContactsClientProps) {
    // If canManage is provided (old way), it overrides unless specific perms are provided
    // Ideally we migrate away from canManage. 
    // For now, let's treat specific perms as primary.
    // If the parent didn't pass specific perms (undefined), but passed canManage, we might want to infer?
    // But since we just updated the parent to pass specific perms, we can rely on them.
    // However, to be safe:
    const effectiveCanCreate = canCreate || canManage;
    const effectiveCanEdit = canEdit || canManage;
    const effectiveCanDelete = canDelete || canManage;

    const router = useRouter();
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [contactToDelete, setContactToDelete] = useState<Contact | null>(null);
    const [, setIsDeleting] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedOrg, setSelectedOrg] = useState<string>('');
    const [selectedImportance, setSelectedImportance] = useState<string>('');
    const [showFilters, setShowFilters] = useState(false);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [contactsRes, orgsRes] = await Promise.all([
                fetch('/api/admin/contacts'),
                fetch('/api/admin/organizations')
            ]);

            if (contactsRes.ok) {
                const contactsData = await contactsRes.json();
                setContacts(contactsData.contacts || []);
            } else {
                setError('Fehler beim Laden der Kontakte');
            }

            if (orgsRes.ok) {
                const orgsData = await orgsRes.json();
                setOrganizations(orgsData.organizations || []);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            setError('Fehler beim Laden der Daten');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const filteredContacts = contacts.filter(contact => {
        const query = searchQuery.toLowerCase();
        
        // Search filter
        const matchesSearch = !query || (
            contact.name.toLowerCase().includes(query) ||
            contact.emails.some(email => email.toLowerCase().includes(query)) ||
            contact.phones.some(phone => phone.value.toLowerCase().includes(query)) ||
            contact.affiliations.some(aff =>
                aff.org.toLowerCase().includes(query) || aff.role.toLowerCase().includes(query)
            )
        );

        // Organization filter
        const matchesOrg = !selectedOrg || contact.affiliations.some(aff => aff.org === selectedOrg);

        // Importance filter
        const matchesImportance = !selectedImportance || contact.importance === parseInt(selectedImportance);

        return matchesSearch && matchesOrg && matchesImportance;
    });

    const handleDelete = async (id: string) => {
        setIsDeleting(true);
        try {
            const response = await fetch(`/api/admin/contacts/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setContacts(prev => prev.filter(c => c.id !== id));
                setContactToDelete(null);
            } else {
                const data = await response.json();
                alert(data.error || 'Fehler beim Löschen');
            }
        } catch (error) {
            console.error('Error deleting contact:', error);
            alert('Fehler beim Löschen');
        } finally {
            setIsDeleting(false);
        }
    };

    const clearFilters = () => {
        setSearchQuery('');
        setSelectedOrg('');
        setSelectedImportance('');
    };

    const hasActiveFilters = searchQuery !== '' || selectedOrg !== '' || selectedImportance !== '';

    if (loading) return <LoadingSpinner centered />;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Kontaktverzeichnis</h2>
                <div className="flex space-x-3">
                    <button
                        onClick={() => router.push('/admin/organizations')}
                        className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-md flex items-center text-sm font-medium"
                    >
                        <Buildings size={16} className="mr-2" />
                        Organisationen verwalten
                    </button>
                    {effectiveCanCreate && (
                        <button
                            onClick={() => router.push('/admin/contacts/neu')}
                            className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md flex items-center text-sm font-medium"
                        >
                            <Plus size={16} className="mr-2" />
                            Neuer Kontakt
                        </button>
                    )}
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-grow">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <MagnifyingGlass className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <input
                        type="text"
                        name="search"
                        id="search"
                        className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-3 leading-5 placeholder-gray-500 focus:border-primary focus:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm text-gray-900"
                        placeholder="Suche nach Name, E-Mail, Telefon oder Organisation..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`inline-flex items-center px-4 py-2 border rounded-md text-sm font-medium transition-colors ${
                            showFilters || selectedOrg || selectedImportance
                                ? 'bg-primary-50 border-primary text-primary'
                                : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                        }`}
                    >
                        <Funnel size={18} className="mr-2" />
                        Filter
                        {(selectedOrg || selectedImportance) && (
                            <span className="ml-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                {(selectedOrg ? 1 : 0) + (selectedImportance ? 1 : 0)}
                            </span>
                        )}
                        <CaretDown
                            size={16}
                            className={`ml-2 transform transition-transform ${showFilters ? 'rotate-180' : ''}`}
                        />
                    </button>
                    {hasActiveFilters && (
                        <button
                            onClick={clearFilters}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-md text-sm font-medium hover:bg-gray-50"
                        >
                            <X size={18} className="mr-2" />
                            Zurücksetzen
                        </button>
                    )}
                </div>
            </div>

            {showFilters && (
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="org-filter" className="block text-sm font-medium text-gray-700 mb-1">
                            Organisation
                        </label>
                        <select
                            id="org-filter"
                            value={selectedOrg}
                            onChange={(e) => setSelectedOrg(e.target.value)}
                            className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-gray-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                        >
                            <option value="">Alle Organisationen</option>
                            {organizations.map((org) => (
                                <option key={org.id} value={org.title}>
                                    {org.title}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="importance-filter" className="block text-sm font-medium text-gray-700 mb-1">
                            Priorität
                        </label>
                        <select
                            id="importance-filter"
                            value={selectedImportance}
                            onChange={(e) => setSelectedImportance(e.target.value)}
                            className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-gray-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                        >
                            <option value="">Alle Prioritäten</option>
                            <option value="0">Keine Priorität (0)</option>
                            <option value="1">Niedrig (1)</option>
                            <option value="2">Mittel (2)</option>
                            <option value="3">Hoch (3)</option>
                            <option value="4">Sehr Hoch (4)</option>
                            <option value="5">Exzellent (5)</option>
                        </select>
                    </div>
                </div>
            )}

            <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                    {filteredContacts.length} {filteredContacts.length === 1 ? 'Kontakt' : 'Kontakte'} gefunden
                    {hasActiveFilters && ` (gefiltert aus ${contacts.length})`}
                </div>
            </div>

            {error && (
                <div className="bg-red-50 text-red-700 p-4 rounded-md">
                    {error}
                </div>
            )}

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                    {filteredContacts.length === 0 ? (
                        <li className="px-6 py-12 text-center text-gray-500">
                            Keine Kontakte gefunden.
                        </li>
                    ) : (
                        filteredContacts.map((contact) => (
                            <li key={contact.id} className="px-6 py-4 hover:bg-gray-50 flex items-center justify-between">
                                <div className="flex-1 min-w-0 pr-4">
                                    <div className="flex items-center justify-between mb-1">
                                        <h3 className="text-lg font-medium text-gray-900 truncate">
                                            {contact.name}
                                        </h3>
                                        {contact.importance > 0 && (
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                                Priorität: {contact.importance}
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex flex-wrap gap-y-1 gap-x-4 text-sm text-gray-500">
                                        {contact.emails.length > 0 && (
                                            <div className="flex items-center">
                                                <Envelope size={14} className="mr-1.5 text-gray-400" />
                                                <span className="truncate max-w-[200px]">{contact.emails[0]}</span>
                                                {contact.emails.length > 1 && <span className="ml-1">+{contact.emails.length - 1}</span>}
                                            </div>
                                        )}
                                        {contact.phones.length > 0 && (
                                            <div className="flex items-center">
                                                <Phone size={14} className="mr-1.5 text-gray-400" />
                                                <span className="truncate">{contact.phones[0].value}</span>
                                                {contact.phones.length > 1 && <span className="ml-1">+{contact.phones.length - 1}</span>}
                                            </div>
                                        )}
                                        {contact.affiliations.length > 0 && (
                                            <div className="flex items-center">
                                                <Buildings size={14} className="mr-1.5 text-gray-400" />
                                                <span className="truncate">{contact.affiliations[0].org}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2 ml-4">
                                    {effectiveCanEdit && (
                                        <button
                                            onClick={() => router.push(`/admin/contacts/${contact.id}`)}
                                            className="text-gray-400 hover:text-blue-600 p-2"
                                            title="Bearbeiten"
                                        >
                                            <PencilSimple size={20} />
                                        </button>
                                    )}
                                    {effectiveCanDelete && (
                                        <button
                                            onClick={() => setContactToDelete(contact)}
                                            className="text-gray-400 hover:text-red-600 p-2"
                                            title="Löschen"
                                        >
                                            <Trash size={20} />
                                        </button>
                                    )}
                                </div>
                            </li>
                        ))
                    )}
                </ul>
            </div>

            <PromptDialog
                isOpen={!!contactToDelete}
                title="Kontakt löschen?"
                description={`Möchten Sie den Kontakt "${contactToDelete?.name}" wirklich löschen?`}
                confirmText="Löschen"
                cancelText="Abbrechen"
                onConfirm={() => contactToDelete && handleDelete(contactToDelete.id)}
                onCancel={() => setContactToDelete(null)}
                accentColor="red"
            />
        </div>
    );
}
