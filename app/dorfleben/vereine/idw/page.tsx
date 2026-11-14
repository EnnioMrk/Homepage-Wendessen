import Link from 'next/link';
import {
    Leaf,
    Margin,
    PageHead,
    SectionHead,
} from '@/app/components/register/Layout';
import { pageToday } from '@/app/lib/page-today';
import { ClubContacts } from '../_components/ClubContacts';

export const metadata = {
    title: 'IDW – Initiative Dorfgemeinschaft Wendessen e.V.',
    description:
        'Die IDW ist der Dachverein für die ortsansässigen Vereine in Wendessen und stärkt mit gemeinsamen Veranstaltungen das Dorfleben.',
};

export default async function IDWPage() {
    const today = await pageToday();

    return (
        <Leaf
            margin={
                <Margin
                    date={today}
                    label="IDW"
                    tallies={[
                        { label: 'Bürgermitgliedschaft', value: 'seit 2025' },
                    ]}
                    note={
                        <>
                            Die IDW plant Veranstaltungen gemeinsam mit den
                            Wendesser Vereinen. Seit 2025 können sich auch
                            Einzelpersonen als Bürgermitglied einbringen.
                        </>
                    }
                />
            }
        >
            <p className="small" style={{ marginBottom: 'var(--s4)' }}>
                <Link className="link-quiet" href="/dorfleben">
                    Dorfleben
                </Link>{' '}
                <span className="muted">/ Vereine / IDW</span>
            </p>

            <PageHead
                title="IDW"
                lede="Initiative Dorfgemeinschaft Wendessen e.V. – der Dachverein für alle ortsansässigen Vereine."
            />

            <section aria-labelledby="verein">
                <SectionHead title="Gemeinsam für Wendessen" id="verein" />
                <div className="prose" style={{ marginTop: 'var(--s4)' }}>
                    <p>
                        Die IDW („Initiative Dorfgemeinschaft Wendessen e.V.“)
                        ist der Dachverein für alle ortsansässigen Vereine, die
                        das Dorfleben in Wendessen beleben und die Nachbarschaft
                        zusammenbringen.
                    </p>
                    <p>
                        Die IDW bringt Vereine und engagierte Wendesser zusammen
                        – für ein aktives Miteinander im Dorf.
                    </p>
                </div>
            </section>

            <section className="block" aria-labelledby="aufgaben">
                <SectionHead title="Aufgaben" id="aufgaben" />
                <table className="data">
                    <thead>
                        <tr>
                            <th scope="col">Bereich</th>
                            <th scope="col">Was die IDW tut</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <strong>Veranstaltungen</strong>
                            </td>
                            <td>
                                Gemeinsam werden Veranstaltungen geplant und
                                durchgeführt wie z.B. das jährliche Kinderfest
                                oder der Laternenumzug.
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <strong>Bürgermitgliedschaft</strong>
                            </td>
                            <td>
                                Neben den Vereinen können sich seit 2025 auch
                                Interessierte und engagierte Wendesser als
                                Bürgermitglied im Verein einbringen.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </section>

            <ClubContacts organizationId="idw" />

            <p className="block">
                <Link className="arrow-link" href="/dorfleben">
                    Zurück zum Dorfleben
                </Link>
            </p>
        </Leaf>
    );
}
