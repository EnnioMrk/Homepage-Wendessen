import type { Metadata } from 'next';
import Link from 'next/link';
import { Leaf, Margin, Notice, PageHead } from '@/app/components/register/Layout';
import SharedGallerySubmissionForm from './SharedGallerySubmissionForm';
import { pageToday } from '@/app/lib/page-today';

export const metadata: Metadata = {
    title: 'Fotos einreichen',
    description:
        'Fotos aus Wendessen für die Galerie einreichen: eine Sammlung mit Titel, Aufnahmedatum und Beschreibungen, geprüft vor der Veröffentlichung.',
    alternates: { canonical: '/impressionen/einreichen' },
    openGraph: {
        type: 'website',
        title: 'Fotos einreichen · Wendessen',
        description:
            'Fotos aus Wendessen für die Impressionen im Register einreichen.',
    },
};

export default async function ImpressionenEinreichenPage() {
    return (
        <Leaf
            margin={
                <Margin
                    date={await pageToday()}
                    label="Fotos einreichen"
                    note={
                        <>
                            Eine Einreichung ist eine Sammlung. Titel und
                            Aufnahmedatum gelten für alle Fotos darin.
                        </>
                    }
                />
            }
        >
            <PageHead
                kicker="Register · Bilder"
                title="Fotos einreichen"
                lede="Fotos aus Wendessen für die Galerie im Register. Sie legen eine Sammlung an: einen Titel, ein Aufnahmedatum und beliebig viele Fotos mit eigener Beschreibung."
                actions={
                    <Link
                        className="btn"
                        href="/impressionen/einreichen/erweitern"
                    >
                        Zu bestehender Sammlung hinzufügen
                    </Link>
                }
            />

            <ol className="steps" aria-label="Ablauf der Einreichung">
                <li className="step">
                    <strong>Schritt 1</strong>
                    Fotos wählen
                </li>
                <li className="step">
                    <strong>Schritt 2</strong>
                    Titel und Datum
                </li>
                <li className="step">
                    <strong>Schritt 3</strong>
                    Prüfung
                </li>
                <li className="step">
                    <strong>Schritt 4</strong>
                    Freigabe
                </li>
            </ol>

            <Notice tone="info" title="Rechte und abgebildete Personen">
                Bitte stellen Sie sicher, dass Sie die Rechte an den
                hochgeladenen Fotos besitzen und dass keine Personen ohne deren
                Zustimmung abgebildet sind.
            </Notice>

            <div style={{ marginTop: 'var(--s5)' }}>
                <SharedGallerySubmissionForm />
            </div>
        </Leaf>
    );
}
