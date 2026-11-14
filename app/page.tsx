import Link from 'next/link';
import Image from 'next/image';
import { getUpcomingEvents, getRecentNews } from '@/lib/database';
import { getActiveWendessenLayout } from '@/lib/database/wendessen';
import { getRegisterCounts } from '@/lib/database/counts';
import { ASSOCIATIONS } from '@/lib/constants/associations';
import { Leaf, Margin, SectionHead, Empty } from '@/app/components/register/Layout';
import { Entry } from '@/app/components/register/Entry';
import {
    dateShort,
    yearOf,
} from '@/app/lib/register-format';
import { pageToday } from '@/app/lib/page-today';

export const metadata = {
    title: { absolute: 'Wendessen — Dorfchronik und Register' },
    description:
        'Was in Wendessen ansteht, was zuletzt verzeichnet wurde und wer das Dorf trägt: Termine, Nachrichten, Vereine, Menschen und Geschichte.',
};

export default async function Home() {
    let events: Awaited<ReturnType<typeof getUpcomingEvents>> = [];
    let news: Awaited<ReturnType<typeof getRecentNews>> = [];
    let dorfwissen: Awaited<ReturnType<typeof getActiveWendessenLayout>> = null;
    let counts: Awaited<ReturnType<typeof getRegisterCounts>> = {
        events: 0,
        news: 0,
        contacts: 0,
        clubs: 0,
    };

    try {
        [events, news, dorfwissen, counts] = await Promise.all([
            getUpcomingEvents(5),
            getRecentNews(4),
            getActiveWendessenLayout(),
            getRegisterCounts(),
        ]);
    } catch (error) {
        console.error('Startseite: Daten konnten nicht geladen werden', error);
    }

    const today = await pageToday();

    return (
        <Leaf
            margin={
                <Margin
                    date={today}
                    tallies={[
                        {
                            label: 'Termine',
                            value: counts.events,
                            href: '/was-steht-an',
                        },
                        {
                            label: 'Vereine',
                            value: ASSOCIATIONS.length,
                            href: '/dorfleben',
                        },
                        {
                            label: 'Nachrichten',
                            value: counts.news,
                            href: '/neuigkeiten',
                        },
                        {
                            label: 'Kontakte',
                            value: counts.contacts,
                            href: '/kontakt/verzeichnis',
                        },
                    ]}
                    note={
                        <>
                            Das Register wird von Ortsrat, Vereinen und
                            Redaktionsteam geführt. Einträge tragen Datum und
                            Nummer.
                        </>
                    }
                />
            }
        >
            <header className="page-head">
                <p className="kicker">Wendessen · Register</p>
                <h1>Was steht an</h1>
                <p className="lede">
                    Die nächsten Einträge im Register des Dorfes. Jeder Eintrag
                    sagt, wann, wo und in welchem Zustand — abgesagte Termine
                    bleiben stehen.
                </p>
            </header>

            <section aria-labelledby="termine">
                <SectionHead
                    title="Termine"
                    id="termine"
                    more="/was-steht-an"
                    moreLabel="Alle Termine"
                />
                {events.length > 0 ? (
                    <div className="entries">
                        {events.map((event) => (
                            <Entry
                                key={event.id}
                                date={event.start}
                                endDate={event.end}
                                title={event.title}
                                href={`/was-steht-an?event=${event.id}`}
                                meta={[
                                    event.location,
                                    event.organizer,
                                ]}
                                description={event.description}
                                state={event.isCancelled ? 'cancelled' : 'open'}
                                number={event.id}
                            />
                        ))}
                    </div>
                ) : (
                    <Empty
                        title="Keine Termine verzeichnet"
                        action={
                            <Link className="btn" href="/was-steht-an">
                                Zum Kalender
                            </Link>
                        }
                    >
                        Für die nächsten Wochen liegt noch kein Termin vor.
                    </Empty>
                )}
            </section>

            <section className="block" aria-labelledby="nachrichten">
                <SectionHead
                    title="Aus dem Register"
                    id="nachrichten"
                    more="/neuigkeiten"
                    moreLabel="Alle Nachrichten"
                />
                {news.length > 0 ? (
                    <div className="entries">
                        {news.map((item) => (
                            <Entry
                                key={item.id}
                                date={item.publishedDate}
                                title={item.title}
                                href={`/neuigkeiten/${item.articleId}`}
                                meta={[item.category]}
                                state={item.isPinned ? 'decided' : 'open'}
                                stamp={item.isPinned ? 'Angeheftet' : undefined}
                                number={item.id}
                                showClock={false}
                                timeText={String(yearOf(item.publishedDate))}
                            />
                        ))}
                    </div>
                ) : (
                    <Empty title="Noch keine Nachricht">
                        Die Redaktion hat den ersten Beitrag noch nicht
                        verzeichnet.
                    </Empty>
                )}
            </section>

            {dorfwissen && (
                <section className="block" aria-labelledby="dorfwissen">
                    <SectionHead
                        title="Aus dem Dorf"
                        id="dorfwissen"
                        more="/dorfleben"
                        moreLabel="Dorfleben"
                    />
                    <div className="grid-3" style={{ marginTop: 'var(--s4)' }}>
                        {dorfwissen.cards.map((card) => {
                            const body = (
                                <>
                                    {card.imageUrl && (
                                        <Image
                                            src={card.imageUrl}
                                            alt=""
                                            width={640}
                                            height={360}
                                            sizes="(max-width: 900px) 100vw, 33vw"
                                        />
                                    )}
                                    <span className="dossier-kicker">
                                        {card.subtitle || 'Dorfwissen'}
                                    </span>
                                    <span className="dossier-title">
                                        {card.title}
                                    </span>
                                    {card.description && (
                                        <span className="dossier-note">
                                            {card.description}
                                        </span>
                                    )}
                                    {card.buttonHref && card.buttonText ? (
                                        <span className="arrow-link">
                                            {card.buttonText}
                                        </span>
                                    ) : null}
                                </>
                            );
                            return card.buttonHref ? (
                                <Link
                                    key={card.title}
                                    href={card.buttonHref}
                                    className="dossier dossier--card"
                                >
                                    {body}
                                </Link>
                            ) : (
                                <div
                                    key={card.title}
                                    className="dossier dossier--card"
                                >
                                    {body}
                                </div>
                            );
                        })}
                    </div>
                </section>
            )}

            <section className="block" aria-labelledby="vereine">
                <SectionHead
                    title="Vereine und Institutionen"
                    id="vereine"
                    more="/dorfleben"
                    moreLabel="Dorfleben"
                />
                <div className="club-index">
                    {ASSOCIATIONS.map((club, index) => (
                        <Link
                            key={club.id}
                            href={club.buttonHref}
                            className="club-line"
                        >
                            <span className="club-num">
                                {String(index + 1).padStart(2, '0')}
                            </span>
                            <span className="club-name">{club.title}</span>
                            <span className="club-desc">{club.description}</span>
                        </Link>
                    ))}
                </div>
            </section>

            <section className="block" aria-labelledby="dorf">
                <SectionHead title="Das Dorf" id="dorf" more="/geschichte" moreLabel="Geschichte" />
                <div className="feature-split">
                    <figure className="figure">
                        <Image
                            src="/images/wendessen-luftaufnahme.jpg"
                            alt="Wendessen aus der Luft"
                            width={1920}
                            height={1164}
                            sizes="(max-width: 900px) 100vw, 55vw"
                        />
                        <figcaption>
                            <span>Wendessen, Luftaufnahme</span>
                            <span>Ortsmitte</span>
                        </figcaption>
                    </figure>
                    <div>
                        <p className="feature-lead">
                            Wendessen gehört zu Wolfenbüttel und ist seit 1170
                            als <em>Winedissen</em> verzeichnet. Die Wehrkirche
                            St.&nbsp;Georg, die Vereine, die Spritzenhaus-Initiative
                            und die Neubaugebiete stehen in derselben Chronik.
                        </p>
                        <p style={{ marginTop: 'var(--s4)' }} className="muted small">
                            Über 850 Jahre Geschichte, ein Ort für alle: Spielplätze,
                            Bücherei, Vereine, Hospiz und Nachbarschaft.
                        </p>
                        <div className="pill-row" style={{ marginTop: 'var(--s5)' }}>
                            <Link className="btn btn--quiet btn--sm" href="/geschichte">
                                Zur Chronik
                            </Link>
                            <Link className="btn btn--quiet btn--sm" href="/dorfleben/ortsrat/mitglieder">
                                Ortsrat
                            </Link>
                            <Link className="btn btn--quiet btn--sm" href="/dorfleben/karte">
                                Karte
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            <section className="block" aria-labelledby="menschen">
                <SectionHead
                    title="Wir Wendesser"
                    id="menschen"
                    more="/dorfleben/wir-wendesser"
                    moreLabel="Alle Porträts"
                />
                <div className="feature-split feature-split--reverse">
                    <div>
                        <p className="feature-lead">
                            Das Dorf sind die Menschen, die hier wohnen, arbeiten,
                            trainieren, feiern und sich kümmern. Im Register stehen
                            ihre Namen und ihre Geschichten.
                        </p>
                        <p className="muted small" style={{ marginTop: 'var(--s4)' }}>
                            Porträts erscheinen nach Prüfung durch die Redaktion.
                            Jede Person entscheidet selbst, was veröffentlicht wird.
                        </p>
                        <div className="pill-row" style={{ marginTop: 'var(--s5)' }}>
                            <Link className="btn btn--primary btn--sm" href="/dorfleben/wir-wendesser">
                                Porträt einreichen
                            </Link>
                            <Link className="btn btn--quiet btn--sm" href="/impressionen">
                                Impressionen
                            </Link>
                        </div>
                    </div>
                    <div className="figure figure--note">
                        <p className="margin-label">Register</p>
                        <p>
                            <strong>Einträge bleiben auffindbar.</strong> Ein
                            Porträt, ein Termin, ein Verein: alles hängt an einer
                            Nummer und einem Datum, nicht an einer Kampagne.
                        </p>
                        <p className="muted small" style={{ marginTop: 'var(--s3)' }}>
                            Stand: {dateShort(today)}
                        </p>
                    </div>
                </div>
            </section>

            <section className="block" aria-labelledby="bauen">
                <SectionHead title="Wohnen & Bauen" id="bauen" more="/wohnen-bauen" moreLabel="Alle Vorhaben" />
                <div className="grid-2">
                    <Link href="/wohnen-bauen/neubaugebiet" className="dossier">
                        <span className="dossier-kicker">Baugebiet</span>
                        <span className="dossier-title">
                            Neubaugebiet Leipziger Allee
                        </span>
                        <span className="dossier-note">
                            Planung, Baufortschritt und Unterlagen zum neuen
                            Wohngebiet.
                        </span>
                    </Link>
                    <Link href="/wohnen-bauen/feuerwehrgeraetehaus" className="dossier">
                        <span className="dossier-kicker">Bauvorhaben</span>
                        <span className="dossier-title">Feuerwehrgerätehaus</span>
                        <span className="dossier-note">
                            Planung und Baufortschritt des neuen Gerätehauses.
                        </span>
                    </Link>
                </div>
            </section>
        </Leaf>
    );
}
