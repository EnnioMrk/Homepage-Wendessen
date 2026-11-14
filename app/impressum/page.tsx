import { Leaf, Margin, PageHead } from '@/app/components/register/Layout';
import { LegalText } from './legal-content';
import { pageToday } from '@/app/lib/page-today';

export const metadata = {
    title: 'Impressum',
    description:
        'Impressum und Datenschutzerklärung der Website wendessen.de: Herausgeber, Vertretung, Kontakt und Haftungsausschluss.',
};

export default async function ImpressumPage() {
    return (
        <Leaf
            margin={
                <Margin
                    date={await pageToday()}
                    label="Rechtliches"
                    note={
                        <>
                            Der Text steht unverändert in der bisher
                            veröffentlichten Fassung. Offene Angaben sind als
                            [Platzhalter] gekennzeichnet.
                        </>
                    }
                />
            }
        >
            <PageHead
                kicker="Rechtliches · Impressum"
                title="Impressum"
                lede="Pflichtangaben nach § 5 TMG, Vertretung, Kontakt und Haftungsausschluss. Die Datenschutzerklärung ist Teil desselben Dokuments und folgt weiter unten."
            />

            <nav className="tabs" aria-label="Abschnitte">
                <a href="#impressum">Impressum</a>
                <a href="#datenschutz">Datenschutz</a>
                <a href="#haftung">Haftung</a>
                <a href="#bildrechte">Bildrechte</a>
                <a href="#sicherheit">Sicherheit</a>
            </nav>

            <div style={{ marginTop: 'var(--s5)' }}>
                <LegalText />
            </div>
        </Leaf>
    );
}
