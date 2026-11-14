import Image from 'next/image';
import Link from 'next/link';
import {
    Leaf,
    Margin,
    PageHead,
    SectionHead,
} from '@/app/components/register/Layout';
import { pageToday } from '@/app/lib/page-today';
import styles from '../../vereine/_components/facts.module.css';

export const metadata = {
    title: 'Kirchengemeinde Ahlum-Atzum-Wendessen',
    description:
        'Herzlich willkommen in der Kirchengemeinde Ahlum-Atzum-Wendessen. Gottesdienste sonntags um 9:30 Uhr, Taufen, Gemeindebrief und das Kirchenbüro in Ahlum.',
};

export default async function KirchePage() {
    const today = await pageToday();

    return (
        <Leaf
            margin={
                <Margin
                    date={today}
                    label="Kirchengemeinde"
                    tallies={[
                        { label: 'Dörfer', value: 3 },
                        { label: 'Gottesdienst', value: 'So 9:30' },
                    ]}
                    note={
                        <>
                            Die Kirchengemeinde umfasst Ahlum, Atzum und
                            Wendessen und gehört dem Pfarrverband Maria von
                            Magdala in Wolfenbüttel und Sickte an.
                        </>
                    }
                />
            }
        >
            <p className="small" style={{ marginBottom: 'var(--s4)' }}>
                <Link className="link-quiet" href="/dorfleben">
                    Dorfleben
                </Link>{' '}
                <span className="muted">/ Institutionen / Kirche</span>
            </p>

            <PageHead
                kicker="Dorfleben · Institutionen"
                title="Kirchengemeinde Ahlum-Atzum-Wendessen"
                lede="Gottesdienste, Taufen und Gemeinschaft – und mit der St. Georg Kirche eine der ältesten Kirchen Wolfenbüttels."
            />

            <div className="club-head">
                <div>
                    <p className="feature-lead">
                        Für einen guten Anfang in Wendessen wünschen wir Ihnen und
                        Ihrer Familie alles Gute und hoffen, dass Sie sich hier
                        wohlfühlen werden.
                    </p>
                    <dl className="club-facts">
                        <div className="club-fact">
                            <dt>Gemeinden</dt>
                            <dd>Ahlum, Atzum und Wendessen</dd>
                        </div>
                        <div className="club-fact">
                            <dt>Pfarrverband</dt>
                            <dd>
                                Maria von Magdala in Wolfenbüttel und Sickte
                            </dd>
                        </div>
                        <div className="club-fact">
                            <dt>Gottesdienst</dt>
                            <dd>jeden Sonntag um 9:30 Uhr, reihum</dd>
                        </div>
                        <div className="club-fact">
                            <dt>Kirchenbüro</dt>
                            <dd>
                                Adenemer Weg 14, Ahlum, Montag, Dienstag und
                                Donnerstag von 10:00 bis 12:00 Uhr
                            </dd>
                        </div>
                    </dl>
                </div>
                <figure className="figure">
                    <Image
                        src="/images/Vereinsleben/kirche.webp"
                        alt="St. Georg Kirche Wendessen"
                        width={520}
                        height={360}
                        sizes="260px"
                    />
                    <figcaption>
                        <span>St. Georg</span>
                        <span>Wendessen</span>
                    </figcaption>
                </figure>
            </div>

            <section aria-labelledby="gemeinde">
                <SectionHead title="Herzlich willkommen" id="gemeinde" />
                <div className="prose" style={{ marginTop: 'var(--s4)' }}>
                    <p>
                        Unsere Kirchengemeinde Ahlum-Atzum-Wendessen umfasst die
                        genannten drei Dörfer und gehört dem Pfarrverband Maria
                        von Magdala in Wolfenbüttel und Sickte an.
                    </p>
                    <p>
                        Der Kirchenvorstand besteht aus gewählten und berufenen
                        Mitgliedern aller drei Orte und den in der Gemeinde mit
                        Aufgaben betreuten Pfarrern.
                    </p>
                    <h3>Unsere Seelsorger</h3>
                    <p>
                        Die Geschäftsführung hat Propst Dieter Schultz-Seitz inne.
                        Amtshandlungen werden zur Zeit von Pfarrer Andreas
                        Lichtblau / Salzdahlum durchgeführt. Pfarrer
                        Schmidt-Pultke, Diakonin Silke Ehrenberg und Diakon Thomas
                        Otte sind für den Konfirmandenunterricht verantwortlich.
                    </p>
                    <p>
                        In Ahlum, neben der Kirche, hat unsere Kirchengemeinde die
                        Trägerschaft über einen 3-gruppigen Kindergarten.
                    </p>
                </div>
            </section>

            <section className="block" aria-labelledby="gottesdienste">
                <SectionHead
                    title="Gottesdienste & Angebote"
                    id="gottesdienste"
                />
                <table className="data">
                    <thead>
                        <tr>
                            <th scope="col">Angebot</th>
                            <th scope="col">Zeit und Ort</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <strong>Sonntagsgottesdienste</strong>
                            </td>
                            <td>
                                Jeden Sonntag um 9:30 Uhr, reihum in den Kirchen
                                der drei Dörfer
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <strong>Taufen</strong>
                            </td>
                            <td>
                                Samstags, sonntags im Gottesdienst oder sonntags
                                nach dem Gottesdienst
                            </td>
                        </tr>
                    </tbody>
                </table>
                <div
                    className="prose"
                    style={{ marginTop: 'var(--s4)' }}
                >
                    <p>
                        In der Gemeinde ist in der Regel an jedem Sonntag reihum
                        in den Kirchen Gottesdienst. Zu den Feiertagen finden nach
                        Möglichkeit in jedem Ort Gottesdienste statt.
                    </p>
                </div>
            </section>

            <section className="block" aria-labelledby="information">
                <SectionHead title="Bleiben Sie informiert" id="information" />
                <div className="prose" style={{ marginTop: 'var(--s4)' }}>
                    <p>
                        Der Gemeindebrief erscheint viermal im Jahr und wird in
                        jeden Haushalt verteilt. Aktuelle Informationen finden Sie
                        auch im Schaukasten vor der Kirche.
                    </p>
                    <p>
                        Besuchen Sie uns im Internet:{' '}
                        <a
                            href="http://www.ahlum-atzum-wendessen-evangelisch.de"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            www.ahlum-atzum-wendessen-evangelisch.de
                        </a>
                    </p>
                    <p>
                        Zu allen Gottesdiensten und Veranstaltungen laden wir Sie
                        ganz herzlich ein!
                    </p>
                </div>
            </section>

            <section className="block" aria-labelledby="ansprechpartner">
                <SectionHead title="Ansprechpartner" id="ansprechpartner" />
                <p className="small muted" style={{ marginBottom: 'var(--s3)' }}>
                    Wenn Sie uns brauchen oder mitmachen wollen.
                </p>
                <div className="grid-2">
                    <div className="person-card">
                        <p className="person-role">Vakanzvertretung</p>
                        <h3>Propst Dieter Schultz-Seitz</h3>
                        <dl className={styles.facts}>
                            <dt>Telefon</dt>
                            <dd>
                                <a className="link" href="tel:05331972830">
                                    05331 / 972830
                                </a>
                            </dd>
                            <dt>E-Mail</dt>
                            <dd>
                                <a
                                    className="link"
                                    href="mailto:dieter.schultz-seitz@lk-bs.de"
                                >
                                    dieter.schultz-seitz@lk-bs.de
                                </a>
                            </dd>
                        </dl>
                    </div>
                    <div className="person-card">
                        <p className="person-role">Kirchenbüro</p>
                        <h3>Christine Spilleke</h3>
                        <dl className={styles.facts}>
                            <dt>Adresse</dt>
                            <dd>
                                Adenemer Weg 14
                                <br />
                                38302 Wolfenbüttel / Ahlum
                            </dd>
                            <dt>Telefon</dt>
                            <dd>
                                <a className="link" href="tel:0533171875">
                                    05331 / 71875
                                </a>
                            </dd>
                            <dt>Fax</dt>
                            <dd>05331 / 340224</dd>
                            <dt>Öffnungszeiten</dt>
                            <dd>
                                Montag, Dienstag und Donnerstag
                                <br />
                                10:00 – 12:00 Uhr
                            </dd>
                            <dt>E-Mail</dt>
                            <dd>
                                <a
                                    className="link"
                                    href="mailto:ahlum.buero@lk-bs.de"
                                >
                                    ahlum.buero@lk-bs.de
                                </a>
                            </dd>
                        </dl>
                    </div>
                </div>
            </section>

            <section className="block" aria-labelledby="kontakt">
                <SectionHead title="Persönlicher Kontakt" id="kontakt" />
                <div className="prose" style={{ marginTop: 'var(--s4)' }}>
                    <p>
                        Außerhalb der Öffnungszeiten kann es sein, dass Sie auf
                        unseren Anrufbeantworter treffen – sprechen Sie ruhig
                        drauf, wir rufen Sie sobald wie möglich zurück.
                    </p>
                    <p>
                        Die Mitglieder unseres Besuchskreises machen auch Besuche
                        im Haus. Wenn wir einmal vor der Tür stehen, dann um Ihnen
                        persönlich „Guten Tag“ zu sagen. Wir freuen uns auf ein
                        persönliches Kennenlernen.
                    </p>
                    <p>
                        Ihre Kirchengemeinde Ahlum-Atzum-Wendessen – Glaube
                        verbindet, Gemeinschaft stärkt.
                    </p>
                </div>
            </section>

            <p className="block">
                <Link
                    className="arrow-link"
                    href="/dorfleben/vereine/kirchbauverein"
                >
                    Zum Kirchbauverein St. Georg
                </Link>
            </p>
        </Leaf>
    );
}
