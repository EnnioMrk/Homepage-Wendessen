import PlaygroundsSection from './PlaygroundsSection';
import FeatureCard from './FeatureCard';

export default function WirSindWendessenSection() {
    return (
        <div className="mb-16">
            {/* Section Title */}
            <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                    WIR SIND WENDESSEN
                </h2>
                <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto"></div>
            </div>

            {/* Revamped Content Layout with Responsive Design */}
            <div className="space-y-16">
                {/* Mobile: Stacked layout */}
                <div className="block md:hidden space-y-8">
                    <PlaygroundsSection />

                    <FeatureCard
                        title="Lesefutter in Wendessen"
                        subtitle="Bücherbus kommt jetzt auch regelmäßig!"
                        description="Wendessen hat jetzt eine Bücherzelle, die mit einer üppigen Erstausstattung versehen wurde. Und es gibt eine weitere gute Nachricht für Leseratten."
                        buttonText="Mehr erfahren"
                        buttonHref="/lesefutter"
                        buttonColor="green"
                        isTextOnly={true}
                    />

                    <FeatureCard
                        title="HERZ AM RICHTIGEN FLECK"
                        subtitle="HOSPIZ WENDESSEN"
                        description="In der Natur & in der historischen Mitte von Wendessen"
                        imageSrc="/images/Features/Hospiz.jpeg"
                        imageAlt="Hospiz Wendessen"
                        buttonText="Mehr erfahren"
                        buttonHref="/hospiz"
                        buttonColor="red"
                    />

                    <FeatureCard
                        title="Sportangebot im Ort"
                        description="Mittendrin statt nur dabei!"
                        imageSrc="/images/Features/SV_Wendessen.JPG"
                        imageAlt="SV Wendessen Sportangebot"
                        buttonText="Mehr erfahren"
                        buttonHref="/sport"
                        buttonColor="blue"
                    />

                    <FeatureCard
                        title="Freiwillige Feuerwehr"
                        description="Wir geben dem Roten Hahn keine Chance!"
                        imageSrc="/images/Features/Freiwillige_Feuerwehr.jpeg"
                        imageAlt="Freiwillige Feuerwehr Wendessen"
                        buttonText="Mehr erfahren"
                        buttonHref="/feuerwehr"
                        buttonColor="orange"
                    />

                    <FeatureCard
                        title="Kleingärtner-Verein"
                        description="Erholung im Grünen!"
                        imageSrc="/images/Features/Kleingärten.jpeg"
                        imageAlt="Kleingärtner-Verein Wendessen"
                        buttonText="Mehr erfahren"
                        buttonHref="/kleingarten"
                        buttonColor="lime"
                    />
                </div>

                {/* Tablet: Interesting asymmetrical layout */}
                <div className="hidden md:block lg:hidden">
                    {/* First Row: Spielplätze spanning 2 columns */}
                    <div className="grid grid-cols-3 gap-6 mb-8">
                        <div className="col-span-2">
                            <PlaygroundsSection />
                        </div>

                        <FeatureCard
                            title="Lesefutter in Wendessen"
                            subtitle="Bücherbus kommt jetzt auch regelmäßig!"
                            description="Wendessen hat jetzt eine Bücherzelle, die mit einer üppigen Erstausstattung versehen wurde. Und es gibt eine weitere gute Nachricht für Leseratten."
                            buttonText="Mehr erfahren"
                            buttonHref="/lesefutter"
                            buttonColor="green"
                            isTextOnly={true}
                            className="text-xs"
                        />
                    </div>

                    {/* Second Row: Hospiz as a wide horizontal card */}
                    <FeatureCard
                        title="HERZ AM RICHTIGEN FLECK"
                        subtitle="HOSPIZ WENDESSEN"
                        description="In der Natur & in der historischen Mitte von Wendessen"
                        imageSrc="/images/Features/Hospiz.jpeg"
                        imageAlt="Hospiz Wendessen"
                        buttonText="Mehr erfahren"
                        buttonHref="/hospiz"
                        buttonColor="red"
                        className="mb-8"
                    />

                    {/* Third Row: Three cards side by side */}
                    <div className="grid grid-cols-3 gap-6">
                        <FeatureCard
                            title="Sportangebot im Ort"
                            description="Mittendrin statt nur dabei!"
                            imageSrc="/images/Features/SV_Wendessen.JPG"
                            imageAlt="SV Wendessen Sportangebot"
                            buttonText="Mehr erfahren"
                            buttonHref="/sport"
                            buttonColor="blue"
                            className="h-80"
                        />

                        <FeatureCard
                            title="Freiwillige Feuerwehr"
                            description="Wir geben dem Roten Hahn keine Chance!"
                            imageSrc="/images/Features/Freiwillige_Feuerwehr.jpeg"
                            imageAlt="Freiwillige Feuerwehr Wendessen"
                            buttonText="Mehr erfahren"
                            buttonHref="/feuerwehr"
                            buttonColor="orange"
                            className="h-80"
                        />

                        <FeatureCard
                            title="Kleingärtner-Verein"
                            description="Erholung im Grünen!"
                            imageSrc="/images/Features/Kleingärten.jpeg"
                            imageAlt="Kleingärtner-Verein Wendessen"
                            buttonText="Mehr erfahren"
                            buttonHref="/kleingarten"
                            buttonColor="lime"
                            className="h-80"
                        />
                    </div>
                </div>

                {/* Desktop: Original layout */}
                <div className="hidden lg:block mb-16">
                    {/* Spielplätze - Full Width Hero */}
                    <div className="mb-16">
                        <PlaygroundsSection />
                    </div>

                    {/* Bottom Row: Lesefutter & Hospiz Side by Side */}
                    <div className="grid grid-cols-2 gap-8">
                        <FeatureCard
                            title="Lesefutter in Wendessen"
                            subtitle="Bücherbus kommt jetzt auch regelmäßig!"
                            description="Wendessen hat jetzt eine Bücherzelle, die mit einer üppigen Erstausstattung versehen wurde. Und es gibt eine weitere gute Nachricht für Leseratten."
                            buttonText="Mehr erfahren"
                            buttonHref="/lesefutter"
                            buttonColor="green"
                            isTextOnly={true}
                        />

                        <FeatureCard
                            title="HERZ AM RICHTIGEN FLECK"
                            subtitle="HOSPIZ WENDESSEN"
                            description="In der Natur & in der historischen Mitte von Wendessen"
                            imageSrc="/images/Features/Hospiz.jpeg"
                            imageAlt="Hospiz Wendessen"
                            buttonText="Mehr erfahren"
                            buttonHref="/hospiz"
                            buttonColor="red"
                            className="h-96"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
