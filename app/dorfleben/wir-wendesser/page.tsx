import {
    Leaf,
    Margin,
    PageHead,
    SectionHead,
} from '@/app/components/register/Layout';
import { pageToday } from '@/app/lib/page-today';
import WirWendesserContent from '@/app/components/WirWendesserContent';

export const metadata = {
    title: 'Wir Wendesser – Porträts aus der Dorfgemeinschaft',
    description:
        'Menschen aus Wendessen erzählen: Porträts von Mitbürgerinnen und Mitbürgern, die das Dorf tragen. Eigene Porträts können eingereicht werden.',
};

export default async function WirWendesserPage() {
    return (
        <Leaf
            margin={
                <Margin
                    date={await pageToday()}
                    label="Menschen"
                    note={
                        <>
                            Die Porträts erscheinen nach Prüfung durch die
                            Redaktion.
                        </>
                    }
                />
            }
        >
            <PageHead
                kicker="Dorfleben · Menschen"
                title="Wir Wendesser"
                lede="Wendessen ist kein Ort, sondern die Menschen, die hier wohnen, arbeiten und sich kümmern. Einige von ihnen stellen sich hier vor."
            />

            <div className="prose">
                <p>
                    Wendessen ist in den letzten Jahrzehnten durch drei
                    Baugebiete kontinuierlich gewachsen, aktuell (Stand: Januar
                    2026) leben rund 1100 Menschen hier. Und wenn alles läuft wie
                    seit Jahren geplant, werden wir bald noch mehr sein – das
                    neue Baugebiet an der Leipziger Allee, wo früher die alte
                    Zuckerfabrik stand, wird Platz für über 100 Neu-Wendesser
                    bieten.
                </p>
                <p>
                    <strong>Einige</strong> unserer Mitbürgerinnen und
                    Mitbürger wollen wir an dieser Stelle mit Kurzportraits
                    vorstellen, als Gesichter unserer Gemeinschaft. Ohne
                    Anspruch auf Vollständigkeit oder darauf, repräsentativ zu
                    sein, versteht sich.
                </p>
                <p>
                    <strong>
                        Wer sind sie, was machen sie, was bewegt sie, was
                        wünschen sie sich?
                    </strong>
                </p>
            </div>

            <section className="block" aria-labelledby="portraits">
                <SectionHead title="Porträts" id="portraits" />
                <WirWendesserContent />
            </section>
        </Leaf>
    );
}
