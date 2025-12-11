import { getContacts } from '@/lib/database';
import ContactDirectory from './ContactDirectory';
import PageHeader from '@/app/components/layout/PageHeader';
import { AddressBook } from '@phosphor-icons/react/dist/ssr';

export const metadata = {
    title: 'Kontaktverzeichnis - Wendessen',
    description:
        'Alle Ansprechpartner in Wendessen – durchsuchen, sortieren und filtern.',
};

export default async function KontaktVerzeichnisPage() {
    const contacts = await getContacts();

    // Precompute flattened fields for client-side filtering
    const initial = contacts.map((c) => ({
        ...c,
        firstOrg: c.affiliations?.[0]?.org ?? '',
        firstRole: c.affiliations?.[0]?.role ?? '',
        // importance is already included from the database
    }));

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
            <PageHeader
                title="Kontaktverzeichnis"
                subtitle="Finden Sie die richtigen Ansprechpartner in Wendessen – schnell und übersichtlich."
                icon={<AddressBook />}
                color="emerald"
                backgroundImage="/images/Wendessen_Luftaufnahme.jpg"
            />

            {/* Controls + List */}
            <div className="container mx-auto px-4 py-10">
                <ContactDirectory initial={initial} />
            </div>
        </div>
    );
}
