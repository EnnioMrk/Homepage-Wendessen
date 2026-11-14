import type { Metadata } from 'next';
import Link from 'next/link';
import {
    Leaf,
    Margin,
    PageHead,
    SectionHead,
} from '@/app/components/register/Layout';
import WendessenMap from './WendessenMap';
import { pageToday } from '@/app/lib/page-today';

export const metadata: Metadata = {
    title: 'Karte – Dorfleben',
    description:
        'Die interaktive Karte von Wendessen: Straßen, Hausnummern, Parkplätze, Spielplätze und die Orte des Dorfes. Grundkarte von OpenStreetMap.',
};

const HINWEISE: [string, React.ReactNode][] = [
    [
        'Ausschnitt',
        'Die Karte ist auf Wendessen begrenzt und lässt sich nicht aus dem Ort herausziehen. Ziehen verschiebt den Ausschnitt, Mausrad oder die Tasten + und − zoomen.',
    ],
    [
        'Hausnummern',
        'Hausnummern erscheinen ab einer Zoomstufe von etwa 17 und werden mit dem Ausschnitt deutlicher.',
    ],
    [
        'Orte',
        'Parkplätze, Spielplätze und weitere Orte – Gastronomie, Läden, Sehenswürdigkeiten – stammen aus OpenStreetMap. Sitzbänke erscheinen erst ab einer Zoomstufe von etwa 18,25.',
    ],
    [
        'Quellen',
        <>
            Grundkarte: © OpenStreetMap-Mitwirkende. Ortsdaten:
            OpenStreetMap, abgefragt über die Overpass-API. Beim Öffnen der
            Karte werden Kacheln und Ortsdaten von diesen fremden Servern
            geladen; siehe{' '}
            <Link className="link" href="/datenschutz">
                Datenschutz
            </Link>
            .
        </>,
    ],
];

export default async function KartePage() {
    return (
        <Leaf
            margin={
                <Margin
                    date={await pageToday()}
                    label="Karte"
                    note={
                        <>
                            Die Karte ist ein Ausschnitt aus OpenStreetMap,
                            kein amtlicher Lageplan.
                        </>
                    }
                />
            }
        >
            <PageHead
                kicker="Dorfleben · Karte"
                title="Wendessen auf der Karte"
                lede="Der Ort mit Straßen, Hausnummern und den Stellen, an denen man parkt, spielt oder einkehrt. Die Karte bleibt auf Wendessen beschränkt."
            />

            <WendessenMap />

            <section className="block" aria-labelledby="hinweise">
                <SectionHead title="Hinweise zur Karte" id="hinweise" />
                <dl className="kv" style={{ marginTop: 'var(--s3)' }}>
                    {HINWEISE.map(([label, value]) => (
                        <div key={label} style={{ display: 'contents' }}>
                            <dt>{label}</dt>
                            <dd>{value}</dd>
                        </div>
                    ))}
                </dl>
                <p className="small muted" style={{ marginTop: 'var(--s4)' }}>
                    Fehlt ein Ort oder stimmt eine Angabe nicht, hilft ein
                    Hinweis über das{' '}
                    <Link className="link" href="/kontakt/formular">
                        Kontaktformular
                    </Link>
                    . Die Daten werden direkt in OpenStreetMap gepflegt.
                </p>
            </section>
        </Leaf>
    );
}
