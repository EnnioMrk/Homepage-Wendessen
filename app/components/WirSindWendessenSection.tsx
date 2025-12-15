import PlaygroundsSection from './PlaygroundsSection';
import FeatureCard from './FeatureCard';
import { sql } from '@/lib/sql';

// Helper to get active layout
async function getActiveLayout() {
    try {
        const layout = await sql`
            SELECT * FROM wendessen_layouts 
            WHERE is_active = true 
            LIMIT 1
        `;
        return layout.length > 0 ? layout[0] : null;
    } catch (error) {
        console.error('Error fetching active kayout:', error);
        return null;
    }
}

export default async function WirSindWendessenSection() {
    const layout = await getActiveLayout();

    // Default fallback if no layout found (safe fallback)
    const card1 = layout?.card_1 || {
        title: "SPIELPLÄTZE IN WENDESSEN",
        subtitle: "HIER KÖNNEN KINDER SPIELEN UND TOBEN",
        description: "Wendessen bietet mehrere Spielplätze für verschiedene Altersgruppen.",
        button_text: "Zur Karte",
        button_href: "/karte?category=playground",
        theme: { highlight: 'bg-primary', background: 'bg-white', button: 'primary' }
    };

    const card2 = layout?.card_2 || {
        title: "Lesefutter in Wendessen",
        subtitle: "Bücherbus kommt jetzt auch regelmäßig!",
        description: "Wendessen hat jetzt eine Bücherzelle...",
        button_text: "Mehr erfahren",
        button_href: "/lesefutter",
        theme: { highlight: 'bg-green-500', background: 'bg-white', button: 'green' }
    };

    const card3 = layout?.card_3 || {
        title: "HERZ AM RICHTIGEN FLECK",
        subtitle: "HOSPIZ WENDESSEN",
        description: "In der Natur & in der historischen Mitte von Wendessen",
        button_text: "Mehr erfahren",
        button_href: "/hospiz",
        theme: { highlight: 'bg-red-500', background: 'bg-white', button: 'red' },
        image_url: "/images/Features/Hospiz.jpeg"
    };

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
                    {/* Replaced PlaygroundsSection with Card 1 (Hero) */}
                    <FeatureCard
                        title={card1.title}
                        subtitle={card1.subtitle}
                        description={card1.description}
                        imageSrc={card1.image_url}
                        buttonText={card1.button_text}
                        buttonHref={card1.button_href}
                        buttonColor={card1.theme.button}
                        highlightColor={card1.theme.highlight}
                        backgroundColor={card1.theme.background}
                        isTextOnly={!card1.image_url}
                        variant="hero"
                        className="min-h-[400px] lg:min-h-[500px]"
                    />

                    <FeatureCard
                        title={card2.title}
                        subtitle={card2.subtitle}
                        description={card2.description}
                        buttonText={card2.button_text}
                        buttonHref={card2.button_href}
                        buttonColor={card2.theme.button}
                        imageSrc={card2.image_url}
                        isTextOnly={!card2.image_url}
                        className="min-h-[300px]"
                    />

                    {/* ... (keep card 3 existing) */}

                    <FeatureCard
                        title={card3.title}
                        subtitle={card3.subtitle}
                        description={card3.description}
                        buttonText={card3.button_text}
                        buttonHref={card3.button_href}
                        buttonColor={card3.theme.button}
                        imageSrc={card3.image_url}
                        isTextOnly={!card3.image_url}
                        className="h-96"
                    />
                </div>

                {/* Tablet: Interesting asymmetrical layout */}
                <div className="hidden md:block lg:hidden">
                    {/* First Row: Card 1 spanning 2 columns */}
                    <div className="grid grid-cols-3 gap-6 mb-8">
                        <div className="col-span-2">
                            <FeatureCard
                                title={card1.title}
                                subtitle={card1.subtitle}
                                description={card1.description}
                                buttonText={card1.button_text}
                                buttonHref={card1.button_href}
                                buttonColor={card1.theme.button}
                                imageSrc={card1.image_url}
                                isTextOnly={!card1.image_url}
                                className="h-full min-h-[350px]"
                                variant="hero"
                            />
                        </div>

                        <FeatureCard
                            title={card2.title}
                            subtitle={card2.subtitle}
                            description={card2.description}
                            buttonText={card2.button_text}
                            buttonHref={card2.button_href}
                            buttonColor={card2.theme.button}
                            imageSrc={card2.image_url}
                            isTextOnly={!card2.image_url}
                            className="text-xs h-full min-h-[350px]"
                        />
                    </div>

                    {/* Second Row: Card 3 as a wide horizontal card */}
                    <FeatureCard
                        title={card3.title}
                        subtitle={card3.subtitle}
                        description={card3.description}
                        buttonText={card3.button_text}
                        buttonHref={card3.button_href}
                        buttonColor={card3.theme.button}
                        imageSrc={card3.image_url}
                        isTextOnly={!card3.image_url}
                        className="mb-8"
                    />
                </div>

                {/* Desktop: Original layout - 3 Cards */}
                <div className="hidden lg:block mb-16">
                    {/* Card 1 - Full Width Hero */}
                    <div className="mb-16">
                        <FeatureCard
                            title={card1.title}
                            subtitle={card1.subtitle}
                            description={card1.description}
                            buttonText={card1.button_text}
                            buttonHref={card1.button_href}
                            buttonColor={card1.theme.button}
                            imageSrc={card1.image_url}
                            isTextOnly={!card1.image_url}
                            className="min-h-[500px]"
                            variant="hero"
                        />
                    </div>

                    {/* Bottom Row: Card 2 & Card 3 Side by Side */}
                    <div className="grid grid-cols-2 gap-8">
                        <FeatureCard
                            title={card2.title}
                            subtitle={card2.subtitle}
                            description={card2.description}
                            buttonText={card2.button_text}
                            buttonHref={card2.button_href}
                            buttonColor={card2.theme.button}
                            imageSrc={card2.image_url}
                            isTextOnly={!card2.image_url}
                        />

                        <FeatureCard
                            title={card3.title}
                            subtitle={card3.subtitle}
                            description={card3.description}
                            buttonText={card3.button_text}
                            buttonHref={card3.button_href}
                            buttonColor={card3.theme.button}
                            imageSrc={card3.image_url}
                            isTextOnly={!card3.image_url}
                            className="h-96"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
