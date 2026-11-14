import Link from 'next/link';
import { getContacts } from '@/lib/database';
import {
    Leaf,
    Margin,
    Notice,
    PageHead,
} from '@/app/components/register/Layout';
import ContactDirectory from './ContactDirectory';
import { pageToday } from '@/app/lib/page-today';

export const metadata = {
    title: 'Kontaktverzeichnis',
    description:
        'Alle Ansprechpartner in Wendessen: Ortsrat, Vereine und Institutionen, durchsuchbar nach Name, Organisation und Rolle.',
};

export default async function KontaktVerzeichnisPage() {
    let contacts: Awaited<ReturnType<typeof getContacts>> = [];
    let loadError = false;

    try {
        contacts = await getContacts();
    } catch (error) {
        console.error('Verzeichnis: Kontakte nicht geladen', error);
        loadError = true;
    }

    // Precompute flattened fields for client-side filtering.
    const initial = contacts.map((contact) => ({
        ...contact,
        firstOrg: contact.affiliations?.[0]?.org ?? '',
        firstRole: contact.affiliations?.[0]?.role ?? '',
    }));

    const organizations = new Set<string>();
    for (const contact of contacts) {
        for (const affiliation of contact.affiliations ?? []) {
            if (affiliation.org) organizations.add(affiliation.org);
        }
    }

    return (
        <Leaf
            margin={
                <Margin
                    date={await pageToday()}
                    label="Verzeichnis"
                    tallies={[
                        {
                            label: 'Ansprechpartner',
                            value: loadError ? '—' : contacts.length,
                        },
                        {
                            label: 'Organisationen',
                            value: loadError ? '—' : organizations.size,
                        },
                    ]}
                    note={
                        <>
                            Ein Eintrag nennt Name, Organisation, Rolle und die
                            hinterlegten Wege: E-Mail, Telefon, Anschrift.
                        </>
                    }
                />
            }
        >
            <PageHead
                kicker="Kontakt · Verzeichnis"
                title="Wer ist wofür zuständig"
                lede="Das vollständige Verzeichnis des Dorfes. Suchen Sie nach Name, E-Mail, Organisation oder Rolle; die Liste bleibt nach Priorität geordnet, solange kein Filter gesetzt ist."
            />

            {loadError ? (
                <Notice tone="error" title="Verzeichnis nicht geladen">
                    Die Kontakte konnten gerade nicht aus der Datenbank gelesen
                    werden. Bitte laden Sie die Seite neu; bleibt der Fehler,
                    nutzen Sie das{' '}
                    <Link className="link" href="/kontakt/formular">
                        Kontaktformular
                    </Link>
                    .
                </Notice>
            ) : (
                <ContactDirectory initial={initial} />
            )}
        </Leaf>
    );
}
