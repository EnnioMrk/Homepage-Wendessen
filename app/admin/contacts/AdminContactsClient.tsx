'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trash, PencilSimple, Envelope, Phone, Buildings } from '@phosphor-icons/react/dist/ssr';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';
import PromptDialog from '@/app/components/ui/PromptDialog';

interface Contact {
    id: string;
    name: string;
    emails: string[];
    phones: { type: string; value: string }[];
    addresses: string[];
    affiliations: { org: string; role: string }[];
    sources: string[];
    importance: number;
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
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [contactToDelete, setContactToDelete] = useState<Contact | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        fetchContacts();
    }, []);

    const fetchContacts = async () => {
        try {
            const response = await fetch('/api/admin/contacts');
            if (response.ok) {
                const data = await response.json();
                setContacts(data.contacts || []);
            } else {
                setError('Fehler beim Laden der Kontakte');
            }
        } catch (error) {
            console.error('Error fetching contacts:', error);
            setError('Fehler beim Laden der Kontakte');
        } finally {
            setLoading(false);
        }
    };

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

    if (loading) return <LoadingSpinner centered />;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Kontaktverzeichnis</h2>
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

            {error && (
                <div className="bg-red-50 text-red-700 p-4 rounded-md">
                    {error}
                </div>
            )}

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                    {contacts.length === 0 ? (
                        <li className="px-6 py-12 text-center text-gray-500">
                            Keine Kontakte vorhanden.
                        </li>
                    ) : (
                        contacts.map((contact) => (
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
