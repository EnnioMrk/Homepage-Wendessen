import Link from 'next/link';
import {
    Leaf,
    Margin,
    PageHead,
    SectionHead,
} from '@/app/components/register/Layout';
import { pageToday } from '@/app/lib/page-today';

export const metadata = {
    title: 'Feuerwehr-Portal Wendessen',
    description:
        'Die zwei Bereiche der Feuerwehr Wendessen: Freiwillige Feuerwehr mit Einsatzabteilung und Jugendfeuerwehr.',
};

export default async function FeuerwehrPortalPage() {
    const today = await pageToday();

    return (
        <Leaf
            margin={
                <Margin
                    date={today}
                    label="Feuerwehr"
                    tallies={[{ label: 'Bereiche', value: 2 }]}
                    note={
                        <>
                            Beide Bereiche sind auf eigenen Seiten verzeichnet.
                        </>
                    }
                />
            }
        >
            <p className="small" style={{ marginBottom: 'var(--s4)' }}>
                <Link className="link-quiet" href="/dorfleben">
                    Dorfleben
                </Link>{' '}
                <span className="muted">/ Vereine / Feuerwehr</span>
            </p>

            <PageHead
                title="Feuerwehr-Portal"
                lede="Die zwei Bereiche der Feuerwehr Wendessen."
            />

            <section aria-labelledby="bereiche">
                <SectionHead title="Bereiche" id="bereiche" />
                <div className="dir">
                    <Link
                        className="dir-person"
                        href="/dorfleben/vereine/feuerwehr/einsatzabteilung"
                    >
                        <span className="dir-name">Freiwillige Feuerwehr</span>
                        <span className="dir-contacts">
                            Einsatzabteilung mit Dienst mittwochs um 18:30 Uhr.
                        </span>
                        <span className="dir-importance">Aktiv</span>
                    </Link>
                    <Link
                        className="dir-person"
                        href="/dorfleben/vereine/jugendfeuerwehr"
                    >
                        <span className="dir-name">Jugendfeuerwehr</span>
                        <span className="dir-contacts">
                            Für Kinder und Jugendliche von 10 bis 16 Jahren,
                            montags von 18:00 bis 19:30 Uhr.
                        </span>
                        <span className="dir-importance">Nachwuchs</span>
                    </Link>
                </div>
            </section>

            <p className="block">
                <Link className="arrow-link" href="/dorfleben/vereine/feuerwehr">
                    Zur Übersicht der Feuerwehr
                </Link>
            </p>
        </Leaf>
    );
}
