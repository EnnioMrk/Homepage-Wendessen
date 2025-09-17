import { getContacts } from '@/lib/database';
import ContactDirectory from './ContactDirectory';

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
    }));

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
            {/* Hero */}
            <div className="relative bg-gradient-to-r from-emerald-700 via-teal-600 to-blue-700 py-16 overflow-hidden">
                <div className="absolute inset-0 bg-[url('/images/Wendessen_Luftaufnahme.jpg')] bg-cover bg-center opacity-20"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-700/90 to-blue-700/90"></div>
                <div className="relative z-10 container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                        Kontaktverzeichnis
                    </h1>
                    <div className="w-32 h-2 bg-gradient-to-r from-yellow-300 to-white mx-auto mb-6"></div>
                    <p className="text-white/90 text-lg max-w-2xl mx-auto">
                        Finden Sie die richtigen Ansprechpartner in Wendessen –
                        schnell und übersichtlich.
                    </p>
                </div>
            </div>

            {/* Controls + List */}
            <div className="container mx-auto px-4 py-10">
                <ContactDirectory initial={initial} />
            </div>
        </div>
    );
}
