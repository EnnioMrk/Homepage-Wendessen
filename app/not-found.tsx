import Link from 'next/link';
import { Leaf, PageHead, SectionHead } from '@/app/components/register/Layout';

export const metadata = {
    title: 'Seite nicht gefunden',
    description:
        'Diese Adresse führt zu keinem Eintrag im Register von Wendessen.',
};

const places = [
    {
        label: 'Termine',
        note: 'Was ansteht: Termine, Sitzungen und Veranstaltungen.',
        href: '/was-steht-an',
    },
    {
        label: 'Nachrichten',
        note: 'Was zuletzt im Register verzeichnet wurde.',
        href: '/neuigkeiten',
    },
    {
        label: 'Dorfleben',
        note: 'Ortsrat, Vereine, Institutionen, Karte und Wetter.',
        href: '/dorfleben',
    },
    {
        label: 'Kontakt',
        note: 'Ansprechpartner, Formular, Redaktion und Rechtliches.',
        href: '/kontakt',
    },
];

export default function NotFound() {
    return (
        <Leaf full>
            <PageHead
                kicker="Register · 404"
                title="Diese Seite steht nicht im Register"
                lede="Die Adresse führt zu keinem Eintrag. Vielleicht wurde sie umbenannt, oder der Eintrag ist noch nicht verzeichnet."
            />

            <section aria-labelledby="weiter">
                <SectionHead title="Weiter im Register" id="weiter" />
                <div className="club-index">
                    {places.map((place, index) => (
                        <Link
                            key={place.href}
                            href={place.href}
                            className="club-line"
                        >
                            <span className="club-num">
                                {String(index + 1).padStart(2, '0')}
                            </span>
                            <span className="club-name">{place.label}</span>
                            <span className="club-desc">{place.note}</span>
                        </Link>
                    ))}
                </div>
            </section>

            <div className="pill-row" style={{ marginTop: 'var(--s5)' }}>
                <Link className="btn btn--primary" href="/">
                    Zur Startseite
                </Link>
                <Link className="btn btn--quiet" href="/suche">
                    Im Register suchen
                </Link>
            </div>

            <p className="muted small" style={{ marginTop: 'var(--s6)' }}>
                Wenn Sie einem Link aus dem Register gefolgt sind, melden Sie die
                Stelle bitte über das{' '}
                <Link className="link" href="/kontakt/formular">
                    Kontaktformular
                </Link>
                .
            </p>
        </Leaf>
    );
}
