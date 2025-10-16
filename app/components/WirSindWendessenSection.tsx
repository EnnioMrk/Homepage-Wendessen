import PlaygroundsSection from './PlaygroundsSection';
import FeatureCard from './FeatureCard';

export default function WirSindWendessenSection() {
    return (
        <div className="mb-16">
            {/* Section Title */}
            <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                    DAS IST WENDESSEN
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
