import Image from 'next/image';
import Link from 'next/link';
import {
    Leaf,
    Margin,
    PageHead,
    SectionHead,
} from '@/app/components/register/Layout';
import { pageToday } from '@/app/lib/page-today';

export const metadata = {
    title: 'Feuerwehr Wendessen – Übersicht',
    description:
        'Übersicht über die Feuerwehr in Wendessen: die Freiwillige Feuerwehr mit ihrer Einsatzabteilung und die Jugendfeuerwehr.',
};

export default async function FeuerwehrOverviewPage() {
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
                            Beide Bereiche teilen sich das Feuerwehrgerätehaus
                            im alten Dorfkern, Kirchring / Schustergasse.
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
                title="Feuerwehr Wendessen"
                lede="Zwei Bereiche, ein Gerätehaus: die Einsatzabteilung für den Dienst am Dorf und die Jugendfeuerwehr für Kinder und Jugendliche."
            />

            <div className="club-head">
                <div>
                    <p className="feature-lead">
                        Die Freiwillige Feuerwehr Wendessen ist Teil der
                        Feuerwehr Wolfenbüttel im Ortsteil Wendessen. Sie rückt
                        aus, wenn Menschen, Tiere oder Sachwerte in Not geraten,
                        und bildet ihren Nachwuchs in der eigenen
                        Jugendfeuerwehr aus.
                    </p>
                    <dl className="club-facts">
                        <div className="club-fact">
                            <dt>Standort</dt>
                            <dd>
                                Feuerwehrgerätehaus, Kirchring / Schustergasse
                            </dd>
                        </div>
                        <div className="club-fact">
                            <dt>Einsatzabteilung</dt>
                            <dd>Dienst mittwochs um 18:30 Uhr</dd>
                        </div>
                        <div className="club-fact">
                            <dt>Jugendfeuerwehr</dt>
                            <dd>Dienst montags von 18:00 bis 19:30 Uhr</dd>
                        </div>
                    </dl>
                </div>
                <Image
                    src="/images/Vereinsleben/freiwillige-feuerwehr.jpg"
                    alt="Freiwillige Feuerwehr Wendessen"
                    width={520}
                    height={360}
                    sizes="260px"
                    priority
                />
            </div>

            <section aria-labelledby="bereiche">
                <SectionHead title="Die zwei Bereiche" id="bereiche" />
                <div className="dir">
                    <Link
                        className="dir-person"
                        href="/dorfleben/vereine/feuerwehr/einsatzabteilung"
                    >
                        <span className="dir-name">Einsatzabteilung</span>
                        <span className="dir-contacts">
                            Retten, Löschen, Bergen, Schützen. Dienst mittwochs
                            um 18:30 Uhr im Gerätehaus, Gäste sind willkommen.
                        </span>
                        <span className="dir-importance">Aktiv</span>
                    </Link>
                    <Link
                        className="dir-person"
                        href="/dorfleben/vereine/jugendfeuerwehr"
                    >
                        <span className="dir-name">Jugendfeuerwehr</span>
                        <span className="dir-contacts">
                            Für Kinder und Jugendliche von 10 bis 16 Jahren.
                            Dienst montags von 18:00 bis 19:30 Uhr im Jugendraum
                            des Gerätehauses.
                        </span>
                        <span className="dir-importance">Nachwuchs</span>
                    </Link>
                </div>
            </section>

            <p className="block">
                <Link
                    className="arrow-link"
                    href="/dorfleben/vereine/feuerwehr/einsatzabteilung"
                >
                    Zur Einsatzabteilung
                </Link>
            </p>
        </Leaf>
    );
}
