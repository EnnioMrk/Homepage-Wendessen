import { Leaf, Margin, PageHead } from '@/app/components/register/Layout';
import { LegalText } from '@/app/impressum/legal-content';
import { pageToday } from '@/app/lib/page-today';

export const metadata = {
    title: 'Datenschutz',
    description:
        'Datenschutzerklärung der Website wendessen.de: Verarbeitung, Einwilligungen, Rechte, Auftragsverarbeiter und Aufsichtsbehörde.',
};

export default async function DatenschutzPage() {
    return (
        <Leaf
            margin={
                <Margin
                    date={await pageToday()}
                    label="Rechtliches"
                    note={
                        <>
                            Die Erklärung ist Teil des gemeinsamen Rechtstextes.
                            Das Impressum steht am Anfang derselben Seite.
                        </>
                    }
                />
            }
        >
            <PageHead
                kicker="Rechtliches · Datenschutz"
                title="Datenschutz"
                lede="Wie personenbezogene Daten auf dieser Website verarbeitet werden: Erfassung, Foto-Upload, Einwilligungen, Rechte und Aufsichtsbehörde. Das Impressum ist Teil desselben Dokuments."
            />

            <nav className="tabs" aria-label="Abschnitte">
                <a href="#datenschutz">Datenschutz</a>
                <a href="#impressum">Impressum</a>
                <a href="#bildrechte">Bildrechte</a>
                <a href="#sicherheit">Sicherheit</a>
                <a href="#haftung">Haftung</a>
            </nav>

            <div style={{ marginTop: 'var(--s5)' }}>
                <LegalText />
            </div>
        </Leaf>
    );
}
