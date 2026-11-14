import type { Metadata } from 'next';
import { Leaf, Margin, PageHead } from '@/app/components/register/Layout';
import WetterBoard from './WetterBoard';
import { pageToday } from '@/app/lib/page-today';

export const metadata: Metadata = {
    title: 'Wetterstation – Dorfleben',
    description:
        'Die Messwerte der Wendesser Wetterstation: Temperatur, Luftfeuchte, Wind, Luftdruck, Sonnenstrahlung und Niederschlag, alle fünf Minuten aktualisiert, mit Vorhersage.',
};

export default async function WetterPage() {
    return (
        <Leaf
            margin={
                <Margin
                    date={await pageToday()}
                    label="Wetter"
                    note={
                        <>
                            Die Werte misst die Wetterstation in Wendessen. Es
                            sind Messwerte der Station, keine amtliche
                            Warnlage.
                        </>
                    }
                />
            }
        >
            <PageHead
                kicker="Dorfleben · Wetter"
                title="Wetterstation Wendessen"
                lede="Was die Station am Ort misst: Temperatur, Feuchte, Wind, Druck, Sonne und Regen. Die Werte werden laufend ergänzt, die Vorhersage gilt ohne Gewähr."
            />
            <WetterBoard />
        </Leaf>
    );
}
