'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AdminHead } from '@/app/components/admin/AdminPage';
import ContactForm, { ContactData } from './components/ContactForm';

export default function EditContactClient({
    contactId,
}: {
    contactId?: string;
}) {
    const router = useRouter();
    const [initialData, setInitialData] = useState<ContactData | undefined>(
        undefined,
    );
    const [loading, setLoading] = useState(!!contactId);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const fetchContact = useCallback(async (id: string) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`/api/admin/contacts/${id}`);
            if (response.ok) {
                const data = await response.json();
                if (data.contact) {
                    setInitialData(data.contact);
                } else {
                    setError('Der Kontakt wurde nicht gefunden.');
                }
            } else {
                setError('Der Kontakt konnte nicht geladen werden.');
            }
        } catch (fetchError) {
            console.error('Error fetching contact:', fetchError);
            setError('Der Kontakt konnte nicht geladen werden.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (contactId) {
            fetchContact(contactId);
        }
    }, [contactId, fetchContact]);

    const handleSubmit = async (data: ContactData) => {
        setIsSubmitting(true);
        setSubmitError(null);
        try {
            const url = contactId
                ? `/api/admin/contacts/${contactId}`
                : '/api/admin/contacts';
            const method = contactId ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                router.push('/admin/contacts?hinweis=gespeichert');
                router.refresh();
            } else {
                const resData = await response.json().catch(() => ({}));
                setSubmitError(
                    resData.error ||
                        'Der Kontakt konnte nicht gespeichert werden.',
                );
            }
        } catch (saveError) {
            console.error(saveError);
            setSubmitError('Der Kontakt konnte nicht gespeichert werden.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const title = contactId ? 'Kontakt bearbeiten' : 'Neuer Kontakt';
    const sub = contactId
        ? 'Eintrag im Kontaktverzeichnis ändern'
        : 'Eintrag im Kontaktverzeichnis anlegen';

    if (loading) {
        return (
            <div>
                <AdminHead title={title} sub={sub} />
                <div className="panel">
                    <div className="panel-body">
                        <p className="muted">Kontakt wird geladen …</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <AdminHead title={title} sub={sub} />
                <div className="notice notice--error" role="alert">
                    <strong>Kontakt nicht geladen</strong>
                    <span>{error}</span>
                </div>
                <div
                    style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 'var(--s2)',
                        marginTop: 'var(--s4)',
                    }}
                >
                    {contactId && (
                        <button
                            type="button"
                            className="btn btn--primary"
                            onClick={() => fetchContact(contactId)}
                        >
                            Erneut laden
                        </button>
                    )}
                    <Link className="btn btn--quiet" href="/admin/contacts">
                        Zurück zum Verzeichnis
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div>
            <AdminHead
                title={title}
                sub={sub}
                actions={
                    <Link className="btn btn--sm" href="/admin/contacts">
                        Zurück zum Verzeichnis
                    </Link>
                }
            />

            {submitError && (
                <div
                    className="notice notice--error"
                    role="alert"
                    style={{ marginBottom: 'var(--s4)' }}
                >
                    <strong>Nicht gespeichert</strong>
                    <span>{submitError}</span>
                </div>
            )}

            <ContactForm
                initialData={initialData}
                onSubmit={handleSubmit}
                onCancel={() => router.push('/admin/contacts')}
                isSubmitting={isSubmitting}
            />
        </div>
    );
}
