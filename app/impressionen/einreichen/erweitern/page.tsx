import type { Metadata } from 'next';
import Link from 'next/link';
import { Leaf, Margin, PageHead } from '@/app/components/register/Layout';
import AddToExistingForm from './AddToExistingForm';
import { pageToday } from '@/app/lib/page-today';

export const metadata: Metadata = {
    title: 'Fotos ergänzen',
    description:
        'Weitere Fotos zu einer bestehenden Sammlung in der Wendessener Bildergalerie hinzufügen.',
    alternates: { canonical: '/impressionen/einreichen/erweitern' },
};

export default async function AddToExistingPage() {
    return (
        <Leaf
            margin={
                <Margin
                    date={await pageToday()}
                    label="Fotos ergänzen"
                    note={
                        <>
                            Ergänzte Fotos erbt die Sammlung: Titel und
                            Einsendender bleiben, die Prüfung beginnt von vorn.
                        </>
                    }
                />
            }
        >
            <PageHead
                kicker="Register · Bilder"
                title="Fotos ergänzen"
                lede="Weitere Fotos zu einer Sammlung, die bereits im Register steht. Titel und Einsendender kommen aus der gewählten Sammlung."
                actions={
                    <Link className="btn" href="/impressionen/einreichen">
                        Neue Sammlung anlegen
                    </Link>
                }
            />

            <AddToExistingForm />
        </Leaf>
    );
}
