import type { Metadata } from 'next';
import Link from 'next/link';
import { getApprovedSharedGalleryGroups } from '@/lib/database';
import {
    Empty,
    Leaf,
    Margin,
    Notice,
    PageHead,
    SectionHead,
} from '@/app/components/register/Layout';
import GalleryGrid from '@/app/components/GalleryGrid';
import { pageToday } from '@/app/lib/page-today';

export const metadata: Metadata = {
    title: 'Impressionen',
    description:
        'Die Bildergalerie aus Wendessen: freigegebene Fotosammlungen, nach Sammlung, Einsendenden und Datum geordnet.',
    alternates: { canonical: '/impressionen' },
    openGraph: {
        type: 'website',
        title: 'Impressionen · Wendessen',
        description:
            'Bilder aus Wendessen, wie sie ins Register eingetragen wurden.',
    },
};

export default async function ImpressionenPage() {
    let groups: Awaited<
        ReturnType<typeof getApprovedSharedGalleryGroups>
    > | null = null;

    try {
        groups = await getApprovedSharedGalleryGroups();
    } catch (error) {
        console.error('Failed to fetch approved photo groups:', error);
    }

    const photoCount =
        groups?.reduce((total, group) => total + group.totalCount, 0) ?? 0;

    return (
        <Leaf
            margin={
                <Margin
                    date={await pageToday()}
                    label="Bilder"
                    tallies={
                        groups
                            ? [
                                  {
                                      label: 'Sammlungen',
                                      value: groups.length,
                                      href: '/impressionen',
                                  },
                                  { label: 'Fotos', value: photoCount },
                              ]
                            : undefined
                    }
                    note={
                        <>
                            Jede Sammlung ist ein Eintrag mit Titel, Datum und
                            Einsendenden. Einzelne Fotos lassen sich in der
                            Bildansicht groß ansehen.
                        </>
                    }
                />
            }
        >
            <PageHead
                kicker="Register · Bilder"
                title="Impressionen"
                lede="Fotos aus Wendessen, nach Sammlungen geordnet — so, wie sie eingereicht und freigegeben wurden."
                actions={
                    <Link
                        className="btn btn--primary"
                        href="/impressionen/einreichen"
                    >
                        Foto einreichen
                    </Link>
                }
            />

            {groups === null ? (
                <Notice tone="error" title="Bilder konnten nicht geladen werden">
                    Das Register ist gerade nicht erreichbar.{' '}
                    <Link className="link" href="/impressionen">
                        Erneut laden
                    </Link>
                </Notice>
            ) : groups.length > 0 ? (
                <GalleryGrid groups={groups} />
            ) : (
                <section aria-labelledby="sammlungen">
                    <SectionHead title="Sammlungen" id="sammlungen" />
                    <Empty
                        title="Noch keine Bilder im Register"
                        action={
                            <Link
                                className="btn btn--primary"
                                href="/impressionen/einreichen"
                            >
                                Erstes Foto einreichen
                            </Link>
                        }
                    >
                        Für die Galerie liegt noch keine freigegebene Sammlung
                        vor.
                    </Empty>
                </section>
            )}
        </Leaf>
    );
}
