import {
    House,
    Clock,
    Plant,
    Heart,
    UsersThree,
} from '@phosphor-icons/react/dist/ssr';
import PageHeader from '@/app/components/layout/PageHeader';
import ContentImage from '@/app/components/ContentImage';
import OrganizationContacts from '@/app/components/OrganizationContacts';

export const metadata = {
    title: 'Hospiz im Gutspark - Institutionen',
    description:
        'Hospiz im Gutspark in Wendessen – Geborgenheit an einem geschichtsträchtigen Ort. Stationäre Versorgung und Begleitung.',
};

export default function HospizInstitutionPage() {
    return (
        <div className="min-h-screen bg-slate-50">
            <PageHeader
                title="Hospiz im Gutspark"
                icon={<House />}
                backgroundImage="/images/Hospiz.jpg"
                color="red" // Using a warm color scheme
            />

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8 sm:py-12 md:py-16">
                <div className="max-w-5xl mx-auto space-y-12 sm:space-y-16">

                    {/* Introduction */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 md:p-12">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                                Geborgenheit an einem geschichtsträchtigen Ort
                            </h2>
                            <div className="w-20 h-1 bg-red-500 mx-auto rounded-full"></div>
                        </div>
                        <div className="prose prose-lg text-gray-700 mx-auto leading-relaxed">
                            <p>
                                In Sichtweite der Kirche St. Georg – gleich hinter der historischen Gutsmauer – erhebt sich ein viergeschossiger Bau: das <strong>HospizZentrum Wolfenbüttel</strong>. Neben dem stationären „Hospiz im Gutspark“ hat hier der Hospizverein seine Räume.
                            </p>
                            <p>
                                Der weiße Außenputz und das rote Ziegeldach heben sich deutlich vom Grau der Mauer ab. Einzig die Gebäudeform und das große grüne Tor an der Westfront erinnern an die Geschichte des Hauses.
                            </p>
                            <ContentImage
                                src="/images/Hospiz.jpg"
                                alt="Hospiz im Gutspark"
                                caption="Das Hospiz im Gutspark in Wendessen"
                                className="mb-0"
                            />
                        </div>
                    </div>


                    {/* Timeline Section */}
                    <div>
                        <div className="text-center mb-10">
                            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
                                <Clock className="w-8 h-8 text-red-600" />
                                Vom Rittergut zum HospizZentrum
                            </h2>
                            <p className="text-gray-600">Eine Reise durch die Jahrhunderte (1660 - 2024)</p>
                        </div>

                        <div className="relative border-l-4 border-red-200 ml-4 sm:ml-6 md:mx-auto md:max-w-3xl pl-6 sm:pl-8 md:pl-0">
                            {/* Timeline Items */}
                            <TimelineItem
                                year="1660"
                                title="Erste Erwähnung"
                                text="Das „Rittergut Wendessen“ wird erstmals erwähnt."
                            />
                            <TimelineItem
                                year="1860"
                                title="Familie Seeliger"
                                text="Familie Seeliger erwirbt das Gut und betreibt hier Landwirtschaft."
                            />
                            <TimelineItem
                                year="1944"
                                title="Zerstörung & Wiederaufbau"
                                text="Im Januar wird das Gutshaus durch den Bombenabwurf auf die nahegelegene Bahnlinie zerstört. Nach dem Krieg wird es wieder aufgebaut. Daher stehen nur die Gutsmauer und der Gewölbekeller unter Denkmalschutz."
                            />
                            <TimelineItem
                                year="2001"
                                title="Verkauf an die Stadt"
                                text="Familie Seeliger verkauft das Gut an die Stadt Wolfenbüttel. Sie nutzt ihr Wohnrecht bis 2017."
                            />
                            <TimelineItem
                                year="2017"
                                title="Leerstand"
                                text="Das Gutshaus steht leer, unbeheizt und ohne Perspektive für die zukünftige Nutzung."
                            />
                            <TimelineItem
                                year="2020"
                                title="Erbbaurecht für den Hospizverein"
                                text="Die Stadt übergibt das Haus im Erbbaurecht für 90 Jahre an den Hospizverein Wolfenbüttel – zur ausschließlichen Nutzung als HospizZentrum."
                            />
                            <TimelineItem
                                year="2024"
                                title="Eröffnung"
                                text="Die umfangreichen Umbauarbeiten werden ausschließlich durch Spenden und Fördermittel finanziert. Am 16. Juni wird der Bau seiner Bestimmung übergeben. Der Hospizverein Wolfenbüttel eröffnet das „Hospiz im Gutspark“."
                            />
                        </div>
                    </div>

                    {/* Das Hospiz im Gutspark Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-8 shadow-sm border border-red-100">
                            <h3 className="text-xl font-bold text-red-900 mb-4 flex items-center gap-2">
                                <Heart className="w-6 h-6 text-red-600" weight="fill" />
                                Liebevolle Versorgung
                            </h3>
                            <p className="text-gray-800 leading-relaxed">
                                Das Hospiz kann zehn Gäste aufnehmen – Menschen mit einer lebensverkürzenden Erkrankung, die absehbar zum Tod führen wird. Sie werden hier von Fachkräften medizinisch und pflegerisch versorgt und liebevoll umsorgt.
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 shadow-sm border border-green-100">
                            <h3 className="text-xl font-bold text-green-900 mb-4 flex items-center gap-2">
                                <Plant className="w-6 h-6 text-green-600" weight="fill" />
                                Atmosphäre & Umgebung
                            </h3>
                            <p className="text-gray-800 leading-relaxed">
                                Die Gäste und ihre An- und Zugehörigen schätzen die Lage des Hauses am Rande des Gutsparks mit seinen hohen Bäumen. Der schön angelegte Hospizgarten und die beiden Terrassen laden zum Verweilen ein. Mit dem Umbau ist es gelungen, bei aller notwendigen Funktionalität eine wohnliche Atmosphäre zu schaffen, die der Historie des Ortes gerecht wird.
                            </p>
                        </div>
                    </div>

                    {/* Footer Info */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex items-center justify-center text-center">
                        <div className="max-w-2xl">
                            <UsersThree className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                            <p className="text-lg text-gray-600 font-medium">
                                Mit over 30 Mitarbeitenden in Pflege, Hauswirtschaft und Verwaltung ist das Hospiz der größte Arbeitgeber von Wendessen.
                            </p>
                        </div>
                    </div>

                    {/* Contact Section */}
                    <div className="mt-16 sm:mt-24 md:mt-32">
                        <div className="text-center mb-12 md:mb-20">
                            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">
                                Ihre Ansprechpartner
                            </h2>
                            <div className="w-20 h-1 bg-red-600 mx-auto mb-8"></div>
                            <p className="text-base md:text-lg text-slate-600 max-w-2xl mx-auto px-4 leading-relaxed">
                                Haben Sie Fragen zum Hospiz im Gutspark oder möchten Sie uns kennenlernen? 
                                Unsere Ansprechpartner sind gerne für Sie da.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 max-w-5xl mx-auto px-4">
                            <OrganizationContacts organization="hospiz-institution-wolfenbuettel" colorClassName="text-red-600" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function TimelineItem({ year, title, text }: { year: string, title: string, text: string }) {
    return (
        <div className="relative md:ml-6 pb-6 md:pb-8">

            {/* Dot on the line */}
            <div className="absolute -left-[35px] md:-left-[43px] top-0 flex items-center justify-center w-8 h-8 rounded-full bg-red-100 border-4 border-white shadow-sm ring-2 ring-red-500">
                <div className="w-2.5 h-2.5 rounded-full bg-red-600"></div>
            </div>

            <div className="flex flex-col md:flex-row md:items-start gap-2 md:gap-6">
                <div className="flex-shrink-0">
                    <span className="inline-block px-3 py-1 bg-red-600 text-white text-sm font-bold rounded-full shadow-sm">
                        {year}
                    </span>
                </div>
                <div className="mt-1">
                    <h4 className="text-lg font-bold text-gray-900 mb-2">{title}</h4>
                    <p className="text-gray-700 leading-relaxed text-base">
                        {text}
                    </p>
                </div>
            </div>
        </div>
    );
}
