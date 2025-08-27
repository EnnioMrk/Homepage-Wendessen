import Image from 'next/image';

export default function PlaygroundsSection() {
    return (
        <div className="group relative overflow-hidden rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 bg-white">
            <div className="relative min-h-[400px] lg:min-h-[500px] overflow-hidden">
                <Image
                    src="/images/Features/Spielplatz.jpg"
                    alt="Spielplatz Wendessen"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent"></div>
                <div className="absolute inset-0 p-6 md:p-8 lg:p-12 flex flex-col justify-end text-white">
                    <div className="max-w-md lg:max-w-3xl">
                        <h3
                            className="text-2xl md:text-3xl lg:text-5xl font-bold mb-4 lg:mb-6 leading-tight drop-shadow-lg"
                            style={{
                                textShadow:
                                    '1px 1px 2px rgba(0,0,0,0.8), -1px -1px 2px rgba(0,0,0,0.8), 1px -1px 2px rgba(0,0,0,0.8), -1px 1px 2px rgba(0,0,0,0.8)',
                            }}
                        >
                            3 Spielplätze im Ort!
                        </h3>
                        <p className="text-lg md:text-xl lg:text-2xl font-semibold mb-4 lg:mb-6 text-amber-200 drop-shadow-md">
                            Die Attraktivität für Kinder & Familien steht im
                            Fokus.
                        </p>
                        <p className="text-sm md:text-base lg:text-xl mb-4 lg:mb-6 leading-relaxed drop-shadow-md opacity-90">
                            Unser Ort bietet eine große Vielfalt für Kinder &
                            Jugendliche auf seinen drei Spielplätzen, welche im
                            Ort verteilt sind.
                        </p>
                        <p className="text-sm md:text-base lg:text-xl font-medium drop-shadow-md">
                            Auf der ersten Doppelseilbahn in Wendessen können
                            Kinder nun um die Wette fahren.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
