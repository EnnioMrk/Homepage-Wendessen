import type { Metadata } from 'next';
import Link from 'next/link';
import {
    Empty,
    Leaf,
    Margin,
    Notice,
    PageHead,
} from '@/app/components/register/Layout';
import { getArchivedNews, getArchiveItems } from '@/lib/database';
import ArchiveClient from './ArchiveClient';
import { pageToday } from '@/app/lib/page-today';

export const metadata: Metadata = {
    title: 'Dorfarchiv',
    description:
        'Das Archiv von Wendessen: ältere Nachrichten, Dokumente und Berichte, durchsuchbar nach Titel, Text, Kategorie und Verfasser.',
};

export default async function ArchivPage() {
    const [itemsResult, newsResult] = await Promise.allSettled([
        getArchiveItems(),
        getArchivedNews(),
    ]);

    const archiveItems =
        itemsResult.status === 'fulfilled' ? itemsResult.value : [];
    const archivedNews =
        newsResult.status === 'fulfilled' ? newsResult.value : [];

    const newsFailed = newsResult.status === 'rejected';
    const documentsFailed = itemsResult.status === 'rejected';

    if (newsFailed) {
        console.error('Archiv: Nachrichten nicht geladen', newsResult.reason);
    }
    if (documentsFailed) {
        console.error('Archiv: Dokumente nicht geladen', itemsResult.reason);
    }

    const isEmpty = archiveItems.length === 0 && archivedNews.length === 0;

    return (
        <Leaf
            margin={
                <Margin
                    date={await pageToday()}
                    label="Archiv"
                    tallies={[
                        {
                            label: 'Nachrichten',
                            value: newsFailed ? '–' : archivedNews.length,
                        },
                        {
                            label: 'Dokumente',
                            value: documentsFailed ? '–' : archiveItems.length,
                        },
                        { label: 'Bericht 2023', value: 1 },
                    ]}
                    note={
                        <>
                            Die Reihenfolge folgt dem Datum, nicht der
                            Wichtigkeit. Jeder Eintrag nennt seine Art.
                        </>
                    }
                />
            }
        >
            <PageHead
                kicker="Dorfleben · Archiv"
                title="Dorfarchiv"
                lede="Was früher im Dorf zu lesen war: ältere Nachrichten, hinterlegte Dokumente und die Jahresberichte des Ortsbürgermeisters, geordnet nach Zeitpunkt und Art."
            />

            {(newsFailed || documentsFailed) && (
                <div style={{ marginBottom: 'var(--s4)' }}>
                    <Notice
                        tone={isEmpty ? 'error' : 'warn'}
                        title="Archiv nicht vollständig geladen"
                    >
                        {newsFailed
                            ? 'Die älteren Nachrichten konnten gerade nicht aus der Datenbank gelesen werden.'
                            : ''}{' '}
                        {documentsFailed
                            ? 'Die Dokumente konnten gerade nicht aus der Datenbank gelesen werden.'
                            : ''}{' '}
                        Was bereits geladen ist, steht trotzdem bereit.{' '}
                        <Link className="link" href="/dorfleben/archiv">
                            Seite neu laden
                        </Link>
                    </Notice>
                </div>
            )}

            {isEmpty ? (
                <Empty
                    title={
                        newsFailed || documentsFailed
                            ? 'Archiv nicht geladen'
                            : 'Noch keine Archiveinträge'
                    }
                    action={
                        <Link className="btn" href="/dorfleben/archiv">
                            Seite neu laden
                        </Link>
                    }
                >
                    {newsFailed || documentsFailed
                        ? 'Die Datenbank war gerade nicht erreichbar. Bitte laden Sie die Seite noch einmal.'
                        : 'Das Archiv wird derzeit aufgebaut. Sobald ältere Nachrichten oder Dokumente vorliegen, stehen sie an dieser Stelle.'}
                </Empty>
            ) : (
                <ArchiveClient
                    archiveItems={archiveItems}
                    archivedNews={archivedNews}
                />
            )}
        </Leaf>
    );
}
