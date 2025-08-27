import FeatureCard from './FeatureCard';

export default function FullWidthServicesSection() {
    return (
        <div className="hidden lg:block w-full bg-gray-50">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-3 gap-8">
                    <FeatureCard
                        title="Sportangebot im Ort"
                        description="Mittendrin statt nur dabei!"
                        imageSrc="/images/Features/SV_Wendessen.JPG"
                        imageAlt="SV Wendessen Sportangebot"
                        buttonText="Mehr erfahren"
                        buttonHref="/sport"
                        buttonColor="blue"
                        className="h-96"
                    />

                    <FeatureCard
                        title="Freiwillige Feuerwehr"
                        description="Wir geben dem Roten Hahn keine Chance!"
                        imageSrc="/images/Features/Freiwillige_Feuerwehr.jpeg"
                        imageAlt="Freiwillige Feuerwehr Wendessen"
                        buttonText="Mehr erfahren"
                        buttonHref="/feuerwehr"
                        buttonColor="orange"
                        className="h-96"
                    />

                    <FeatureCard
                        title="Kleingärtner-Verein"
                        description="Erholung im Grünen!"
                        imageSrc="/images/Features/Kleingärten.jpeg"
                        imageAlt="Kleingärtner-Verein Wendessen"
                        buttonText="Mehr erfahren"
                        buttonHref="/kleingarten"
                        buttonColor="lime"
                        className="h-96"
                    />
                </div>
            </div>
        </div>
    );
}
