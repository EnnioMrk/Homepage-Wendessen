import Link from 'next/link';
import { Leaf, Margin, PageHead } from '@/app/components/register/Layout';
import { pageToday } from '@/app/lib/page-today';

export const metadata = {
    title: 'Wohnen & Bauen',
    description:
        'Bauvorhaben in Wendessen: das Neubaugebiet an der Leipziger Allee und das neue Feuerwehrgerätehaus. Planung, Baufortschritt und Unterlagen.',
};

const PROJECTS = [
    {
        kicker: 'Baugebiet',
        title: 'Neubaugebiet Leipziger Allee',
        href: '/wohnen-bauen/neubaugebiet',
        note: 'Rund 29.000 m² zwischen Leipziger Allee und Feldrand: etwa 30 Häuser und 35 Wohnungen, dazu der „Zuckerring“ als Erschließung.',
        facts: [
            ['Fläche', 'rund 29.000 m²'],
            ['Wohnen', 'etwa 30 Häuser, etwa 35 Wohnungen'],
            ['Anbindung', 'Regio-Bahn ab 2028/29, P+R und B+R'],
        ],
    },
    {
        kicker: 'Bauvorhaben',
        title: 'Feuerwehrgerätehaus',
        href: '/wohnen-bauen/feuerwehrgeraetehaus',
        note: 'Das neue Gerätehaus für die Freiwillige Feuerwehr Wendessen: Planung, Standort und Baufortschritt.',
        facts: [
            ['Vorhaben', 'Neubau Feuerwehrgerätehaus'],
            ['Träger', 'Stadt Wolfenbüttel'],
            ['Stand', 'Planung und Bau dokumentiert'],
        ],
    },
];

export default async function WohnenBauenPage() {
    return (
        <Leaf
            margin={
                <Margin
                    date={await pageToday()}
                    tallies={[
                        { label: 'Vorhaben', value: PROJECTS.length },
                        { label: 'Baugebiet', value: '1' },
                        { label: 'Gerätehaus', value: '1' },
                    ]}
                    label="Bauen"
                    note={
                        <>
                            Unterlagen und Bilder stammen von der Stadt
                            Wolfenbüttel und den Vorhabenträgern.
                        </>
                    }
                />
            }
        >
            <PageHead
                kicker="Wohnen & Bauen"
                title="Was in Wendessen gebaut wird"
                lede="Zwei Vorhaben prägen das Dorf in diesen Jahren: das neue Wohngebiet an der Leipziger Allee und das neue Gerätehaus der Feuerwehr. Beide werden hier mit Planung, Stand und Bildern dokumentiert."
            />

            <div className="grid-2">
                {PROJECTS.map((project) => (
                    <Link
                        key={project.href}
                        href={project.href}
                        className="dossier"
                        style={{ padding: 'var(--s5)' }}
                    >
                        <span className="dossier-kicker">{project.kicker}</span>
                        <span className="dossier-title">{project.title}</span>
                        <span className="dossier-note">{project.note}</span>
                        <dl className="club-facts" style={{ marginTop: 'var(--s3)' }}>
                            {project.facts.map(([label, value]) => (
                                <div className="club-fact" key={label}>
                                    <dt>{label}</dt>
                                    <dd>{value}</dd>
                                </div>
                            ))}
                        </dl>
                        <span className="arrow-link" style={{ marginTop: 'var(--s3)' }}>
                            Zum Vorhaben
                        </span>
                    </Link>
                ))}
            </div>

            <section className="block">
                <div className="notice">
                    <strong>Hinweis</strong>
                    <span>
                        Fragen zu Grundstücken und Bauanträgen beantwortet die
                        Stadt Wolfenbüttel. Die Ansprechpartner stehen auf den
                        Seiten der jeweiligen Vorhaben.
                    </span>
                </div>
            </section>
        </Leaf>
    );
}
