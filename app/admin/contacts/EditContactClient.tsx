'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ContactForm, { ContactData } from './components/ContactForm';
import { ArrowLeft } from '@phosphor-icons/react/dist/ssr';
import Link from 'next/link';
import LoadingSpinner from '@/app/components/ui/LoadingSpinner';

export default function EditContactClient({ contactId }: { contactId?: string }) {
    const router = useRouter();
    const [initialData, setInitialData] = useState<ContactData | undefined>(undefined);
    const [loading, setLoading] = useState(!!contactId);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (contactId) {
            fetchContact(contactId);
        }
    }, [contactId]);

    const fetchContact = async (id: string) => {
        try {
            const response = await fetch(`/api/admin/contacts/${id}`);
            if (response.ok) {
                const data = await response.json();
                if (data.contact) {
                    setInitialData(data.contact);
                } else {
                    setError('Kontakt nicht gefunden');
                }
            } else {
                setError('Fehler beim Laden des Kontakts');
            }
        } catch (error) {
            console.error('Error fetching contact:', error);
            setError('Fehler beim Laden des Kontakts');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (data: ContactData) => {
        setIsSubmitting(true);
        try {
            const url = contactId ? `/api/admin/contacts/${contactId}` : '/api/admin/contacts';
            const method = contactId ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                router.push('/admin/contacts');
                router.refresh();
            } else {
                const resData = await response.json();
                alert(resData.error || 'Fehler beim Speichern');
            }
        } catch (error) {
            console.error(error);
            alert('Fehler beim Speichern');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <LoadingSpinner centered />;
    if (error) return <div className="text-red-600 p-6">{error}</div>;

    return (
        <div className="bg-gray-50">
            <div className="mb-6">
                <Link href="/admin/contacts" className="flex items-center text-gray-600 hover:text-gray-900 mb-4 px-1">
                    <ArrowLeft size={16} className="mr-2" />
                    Zurück
                </Link>
            </div>
            <ContactForm
                initialData={initialData}
                onSubmit={handleSubmit}
                onCancel={() => router.push('/admin/contacts')}
                isSubmitting={isSubmitting}
            />
        </div>
    );
}
