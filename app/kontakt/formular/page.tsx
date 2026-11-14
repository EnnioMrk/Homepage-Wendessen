import Link from 'next/link';
import {
    Leaf,
    Margin,
    Notice,
    PageHead,
    SectionHead,
} from '@/app/components/register/Layout';
import ContactForm from './ContactForm';
import { pageToday } from '@/app/lib/page-today';

export const metadata = {
    title: 'Kontaktformular',
    description:
        'Nachricht an den Ortsrat Wendessen: Kontaktformular mit Pflichtfeldern und Datenschutz-Einwilligung.',
};

export default async function KontaktformularPage() {
    return (
        <Leaf
            margin={
                <Margin
                    date={await pageToday()}
                    label="Kontaktformular"
                    tallies={[
                        { label: 'Pflichtfelder', value: 6 },
                        { label: 'Zuständig', value: 'Ortsrat' },
                    ]}
                    note={
                        <>
                            Das Formular verschickt eine E-Mail an den Ortsrat.
                            Es gibt keine automatische Bestätigung an die
                            angegebene Adresse.
                        </>
                    }
                />
            }
        >
            <PageHead
                kicker="Kontakt · Formular"
                title="Schreiben Sie uns"
                lede="Fragen, Anregungen und Hinweise an den Ortsrat. Alle Pflichtfelder sind gekennzeichnet; ohne Einwilligung in die Datenverarbeitung wird nichts versendet."
            />

            <div className="form-card">
                <h2>Nachricht an den Ortsrat</h2>
                <ContactForm />
            </div>

            <section className="block" aria-labelledby="direkt">
                <SectionHead title="Ohne Formular" id="direkt" />
                <p className="muted small" style={{ marginTop: 'var(--s3)' }}>
                    Dringende Anliegen gehen schneller über das Telefon. Für
                    alles andere bleibt das Formular der Weg, der beim Ortsrat
                    ankommt.
                </p>
                <dl className="kv" style={{ marginTop: 'var(--s4)' }}>
                    <dt>Telefon</dt>
                    <dd>
                        <a className="link" href="tel:05331859860">
                            05331 – 859860
                        </a>
                    </dd>
                    <dt>E-Mail</dt>
                    <dd>
                        <a className="link" href="mailto:info@wendessen.de">
                            info@wendessen.de
                        </a>
                    </dd>
                    <dt>Anschrift</dt>
                    <dd>
                        Ortsrat Wendessen
                        <br />
                        Lindenblick 12
                        <br />
                        38300 Wolfenbüttel – Wendessen
                    </dd>
                    <dt>Verzeichnis</dt>
                    <dd>
                        <Link className="link" href="/kontakt/verzeichnis">
                            Ansprechpartner nach Organisation suchen
                        </Link>
                    </dd>
                </dl>
            </section>

            <section className="block" aria-labelledby="hinweis">
                <SectionHead title="Zum Datenschutz" id="hinweis" />
                <Notice tone="info" title="Ihre Angaben">
                    Name, E-Mail-Adresse und Nachricht werden zur Bearbeitung
                    Ihrer Anfrage per E-Mail an den Ortsrat geschickt. Die
                    Einwilligung können Sie jederzeit widerrufen; die Angaben
                    dazu stehen in der{' '}
                    <Link className="link" href="/datenschutz">
                        Datenschutzerklärung
                    </Link>
                    .
                </Notice>
            </section>
        </Leaf>
    );
}
