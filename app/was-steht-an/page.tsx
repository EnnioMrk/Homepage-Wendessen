import Link from 'next/link';
import { getEvents, type CalendarEvent } from '@/lib/database';
import { Leaf, Margin, PageHead, Notice } from '@/app/components/register/Layout';
import { dateLong } from '@/app/lib/register-format';
import { pageToday } from '@/app/lib/page-today';
import CalendarLeaf from './CalendarLeaf';

export const metadata = {
    title: 'Was steht an',
    description:
        'Der Terminkalender des Dorfes Wendessen: Sitzungen, Feste, Sport, Kultur und Hinweise der Vereine, mit Monatsansicht, Agenda und Absagen.',
};

export default async function WasStehtAnPage() {
    let events: CalendarEvent[] = [];
    let loadError = false;

    try {
        events = await getEvents();
    } catch (error) {
        console.error(
            'Terminkalender: Termine konnten nicht geladen werden',
            error,
        );
        loadError = true;
    }

    const today = await pageToday();
    const lede =
        'Der Terminkalender des Dorfes: Sitzungen, Feste, Sport und Kultur, dazu Hinweise aus den Vereinen. Abgesagte Einträge bleiben stehen und sind gekennzeichnet.';

    if (loadError) {
        return (
            <Leaf margin={<Margin date={today} label="Register · Termine" />}>
                <PageHead
                    kicker={`Register · Termine · ${dateLong(today)}`}
                    title="Was steht an"
                    lede={lede}
                />
                <Notice
                    tone="error"
                    title="Die Termine konnten nicht geladen werden."
                >
                    Das Register hat nicht geantwortet.{' '}
                    <Link className="link" href="/was-steht-an">
                        Erneut versuchen
                    </Link>
                </Notice>
            </Leaf>
        );
    }

    return <CalendarLeaf initialEvents={events} today={today} />;
}
