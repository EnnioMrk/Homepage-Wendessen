import type { Metadata } from 'next';
import Link from 'next/link';
import { Empty, Leaf, PageHead } from '@/app/components/register/Layout';

export const metadata: Metadata = {
    title: 'Eintrag nicht gefunden',
    robots: { index: false, follow: false },
};

export default function NewsNotFound() {
    return (
        <Leaf>
            <PageHead
                kicker="Register · Nachrichten"
                title="Eintrag nicht gefunden"
                lede="Unter dieser Adresse steht kein Eintrag im Register."
            />
            <Empty
                title="Kein Eintrag unter dieser Nummer"
                action={
                    <Link className="btn" href="/neuigkeiten">
                        Alle Nachrichten
                    </Link>
                }
            >
                Die Nachricht oder Rubrik wurde nicht verzeichnet, oder ihre
                Nummer stimmt nicht mehr. Das Verzeichnis aller Meldungen führt
                weiter.
            </Empty>
        </Leaf>
    );
}
