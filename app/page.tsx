'use client';

import Image from 'next/image';
import { useEffect, useRef } from 'react';

export default function Home() {
    const rectangleRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            if (rectangleRef.current) {
                // Parallax factor - 0.5 means the element scrolls at half the speed of normal content
                const parallaxFactor = 0.5;
                const scrollPosition = window.scrollY;
                const translateY = scrollPosition * (1 - parallaxFactor);

                rectangleRef.current.style.transform = `translate(-50%, calc(-50% + ${translateY}px)) rotate(12deg)`;
            }
        };

        // Add scroll event listener
        window.addEventListener('scroll', handleScroll);

        // Initial position
        handleScroll();

        // Cleanup
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div className="min-h-screen py-6 px-4 relative">
            {/* BACKGROUND ELEMENTS */}
            <div
                className="absolute inset-0 overflow-hidden"
                style={{ zIndex: -1, pointerEvents: 'none' }}
            >
                {/* Parallax scrolling rotated rectangle */}
                <div
                    ref={rectangleRef}
                    className="absolute bg-gradient-to-r from-primary/40 to-primary-light/50"
                    style={{
                        width: '200vw',
                        height: '18vh',
                        top: 'calc(30vh - 5vh)',
                        left: '50%',
                        transform: 'translate(-50%, -50%) rotate(12deg)',
                        zIndex: -2,
                        willChange: 'transform' /* Performance optimization */,
                        boxShadow: '0 4px 30px rgba(127, 176, 105, 0.2)',
                    }}
                ></div>

                {/* Subtle background pattern */}
                <div
                    className="absolute inset-0 opacity-[0.08]"
                    style={{
                        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(75, 85, 99, 0.4) 1px, transparent 0)`,
                        backgroundSize: '30px 30px',
                    }}
                ></div>
            </div>

            {/* CONTENT CONTAINER - CENTERED IN VIEWPORT */}
            <div className="max-w-7xl mx-auto min-h-[80vh] flex flex-col relative z-10">
                <div className="w-full">
                    {/* News Section */}
                    <div className="mb-16 mt-8">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
                            {/* News Card 1 */}
                            <div className="relative rounded-lg shadow-lg border border-gray-200 bg-white hover:shadow-xl transition-all duration-300 overflow-hidden group">
                                <div className="h-1 bg-amber-500/70"></div>
                                <div className="p-3 md:p-4 lg:p-6">
                                    <div className="flex items-center mb-2 md:mb-3 lg:mb-4">
                                        <div className="w-2 h-2 bg-amber-500/70 rounded-full mr-2 md:mr-3"></div>
                                        <span className="text-xs md:text-sm text-gray-600 font-medium">
                                            Bildung
                                        </span>
                                    </div>
                                    <h3 className="text-sm md:text-base lg:text-lg font-semibold text-gray-900 mb-2 md:mb-3 group-hover:text-amber-500 transition-colors duration-200">
                                        Bücherbus hält wieder im Ort
                                    </h3>
                                </div>
                            </div>

                            {/* News Card 2 */}
                            <div className="relative rounded-lg shadow-lg border border-gray-200 bg-white hover:shadow-xl transition-all duration-300 overflow-hidden group">
                                <div className="h-1 bg-green-600/70"></div>
                                <div className="p-3 md:p-4 lg:p-6">
                                    <div className="flex items-center mb-2 md:mb-3 lg:mb-4">
                                        <div className="w-2 h-2 bg-green-600/70 rounded-full mr-2 md:mr-3"></div>
                                        <span className="text-xs md:text-sm text-gray-600 font-medium">
                                            Gemeinschaft
                                        </span>
                                    </div>
                                    <h3 className="text-sm md:text-base lg:text-lg font-semibold text-gray-900 mb-2 md:mb-3 group-hover:text-green-600 transition-colors duration-200">
                                        Bücherzelle für Jung und Alt
                                    </h3>
                                </div>
                            </div>

                            {/* News Card 3 */}
                            <div className="relative rounded-lg shadow-lg border border-gray-200 bg-white hover:shadow-xl transition-all duration-300 overflow-hidden group">
                                <div className="h-1 bg-red-600/70"></div>
                                <div className="p-3 md:p-4 lg:p-6">
                                    <div className="flex items-center mb-2 md:mb-3 lg:mb-4">
                                        <div className="w-2 h-2 bg-red-600/70 rounded-full mr-2 md:mr-3"></div>
                                        <span className="text-xs md:text-sm text-gray-600 font-medium">
                                            Feuerwehr
                                        </span>
                                    </div>
                                    <h3 className="text-sm md:text-base lg:text-lg font-semibold text-gray-900 mb-2 md:mb-3 group-hover:text-red-600 transition-colors duration-200">
                                        Feuerwehr für Kinder gründet sich
                                    </h3>
                                </div>
                            </div>

                            {/* News Card 4 */}
                            <div className="relative rounded-lg shadow-lg border border-gray-200 bg-white hover:shadow-xl transition-all duration-300 overflow-hidden group">
                                <div className="h-1 bg-indigo-500/70"></div>
                                <div className="p-3 md:p-4 lg:p-6">
                                    <div className="flex items-center mb-2 md:mb-3 lg:mb-4">
                                        <div className="w-2 h-2 bg-indigo-500/70 rounded-full mr-2 md:mr-3"></div>
                                        <span className="text-xs md:text-sm text-gray-600 font-medium">
                                            Digital
                                        </span>
                                    </div>
                                    <h3 className="text-sm md:text-base lg:text-lg font-semibold text-gray-900 mb-2 md:mb-3 group-hover:text-indigo-500 transition-colors duration-200">
                                        Neue Webseite ist online
                                    </h3>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stylish Title with Text Stroke */}
                    <div className="flex flex-col items-center justify-center mb-20 py-10 mt-auto">
                        <div className="relative max-w-full text-center">
                            {/* Text shadow/stroke effect to make it visible on any background */}
                            <h1
                                className="text-3xl sm:text-4xl md:text-5xl font-black tracking-wider px-4 sm:px-6 md:px-8 py-3 md:py-4 text-white text-center"
                                style={{
                                    textShadow: `
                                        1px 0 0 #333,
                                        -1px 0 0 #333,
                                        0 1px 0 #333,
                                        0 -1px 0 #333,
                                        1px 1px 0 #333,
                                        -1px -1px 0 #333,
                                        1px -1px 0 #333,
                                        -1px 1px 0 #333,
                                        2px 2px 4px rgba(0,0,0,0.5)
                                    `,
                                }}
                            >
                                WENDESSEN,
                                <br className="sm:hidden" />{' '}
                                WAS&nbsp;DENN&nbsp;SONST?
                            </h1>
                        </div>
                    </div>

                    {/* Upcoming Events Section */}
                    <div className="mb-32 mt-auto">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Event 1 - Jugendfeuerwehr */}
                            <div className="group relative overflow-hidden rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2">
                                <div className="relative h-64 overflow-hidden">
                                    <Image
                                        src="/images/Jugendfeuerwehr.jpeg"
                                        alt="Jugendfeuerwehr Wendessen"
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/10"></div>
                                    <div className="absolute top-4 right-4">
                                        <div className="bg-secondary text-white px-3 py-1 rounded-full text-sm font-semibold">
                                            30.09.2023
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                    <h3 className="text-xl font-bold mb-2 group-hover:text-accent transition-colors duration-300 drop-shadow-lg">
                                        Jugendfeuerwehr
                                    </h3>
                                    <p className="text-sm opacity-90 mb-1 drop-shadow-md">
                                        Wendessen
                                    </p>
                                    <p className="text-lg font-semibold text-primary drop-shadow-lg">
                                        Jubiläum &ldquo;45 Jahre&rdquo;
                                    </p>
                                </div>
                            </div>

                            {/* Event 2 - Gitarren Konzert */}
                            <div className="group relative overflow-hidden rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2">
                                <div className="relative h-64 overflow-hidden">
                                    <Image
                                        src="/images/Gitarrenkonzert.jpeg"
                                        alt="Gitarren Konzert"
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/10"></div>
                                    <div className="absolute top-4 right-4">
                                        <div className="bg-secondary text-white px-3 py-1 rounded-full text-sm font-semibold">
                                            15.10.2023
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                    <h3 className="text-xl font-bold mb-2 group-hover:text-accent transition-colors duration-300 drop-shadow-lg">
                                        Gitarren-Konzert
                                    </h3>
                                    <p className="text-sm opacity-90 mb-1 drop-shadow-md">
                                        Kirche St. Georg
                                    </p>
                                    <p className="text-lg font-semibold text-primary drop-shadow-lg">
                                        Beginn 20:00 Uhr
                                    </p>
                                </div>
                            </div>

                            {/* Event 3 - Bücherbus */}
                            <div className="group relative overflow-hidden rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 transform hover:-translate-y-2">
                                <div className="relative h-64 overflow-hidden">
                                    <Image
                                        src="/images/Bücherbus.jpeg"
                                        alt="Bücherbus"
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/10"></div>
                                    <div className="absolute top-4 right-4">
                                        <div className="bg-secondary text-white px-3 py-1 rounded-full text-sm font-semibold">
                                            18.10.2023
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                    <h3 className="text-xl font-bold mb-2 group-hover:text-accent transition-colors duration-300 drop-shadow-lg">
                                        Bücherbus
                                    </h3>
                                    <p className="text-sm opacity-90 mb-1 drop-shadow-md">
                                        Spritzenhaus
                                    </p>
                                    <p className="text-lg font-semibold text-primary drop-shadow-lg">
                                        18:30 bis 19:00 Uhr
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* WIR SIND WENDESSEN Section */}
                    <div className="mb-16">
                        {/* Section Title */}
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                                WIR SIND WENDESSEN
                            </h2>
                            <div className="w-24 h-1 bg-gradient-to-r from-primary to-accent mx-auto"></div>
                        </div>

                        {/* Revamped Content Layout with Interesting Tablet Design */}
                        <div className="space-y-16">
                            {/* Mobile: Stacked layout */}
                            <div className="block md:hidden space-y-8">
                                {/* Spielplätze - Mobile */}
                                <div className="group relative overflow-hidden rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 bg-white">
                                    <div className="relative min-h-[400px] overflow-hidden">
                                        <Image
                                            src="/images/Spielplatz.jpg"
                                            alt="Spielplatz Wendessen"
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent"></div>
                                        <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                                            <h3
                                                className="text-2xl font-bold mb-4 leading-tight drop-shadow-lg"
                                                style={{
                                                    textShadow:
                                                        '1px 1px 2px rgba(0,0,0,0.8), -1px -1px 2px rgba(0,0,0,0.8), 1px -1px 2px rgba(0,0,0,0.8), -1px 1px 2px rgba(0,0,0,0.8)',
                                                }}
                                            >
                                                3 Spielplätze im Ort!
                                            </h3>
                                            <p className="text-lg font-semibold mb-4 text-amber-200 drop-shadow-md">
                                                Die Attraktivität für Kinder &
                                                Familien steht im Fokus.
                                            </p>
                                            <p className="text-sm mb-4 leading-relaxed drop-shadow-md opacity-90">
                                                Unser Ort bietet eine große
                                                Vielfalt für Kinder &
                                                Jugendliche auf seinen drei
                                                Spielplätzen, welche im Ort
                                                verteilt sind.
                                            </p>
                                            <p className="text-sm font-medium drop-shadow-md">
                                                Auf der ersten Doppelseilbahn in
                                                Wendessen können Kinder nun um
                                                die Wette fahren.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Lesefutter - Mobile */}
                                <div className="group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 border border-green-100">
                                    <div className="p-6 h-full flex flex-col justify-center">
                                        <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
                                            Lesefutter in Wendessen
                                        </h3>
                                        <p className="text-sm text-green-700 font-semibold mb-3 text-center">
                                            Bücherbus kommt jetzt auch
                                            regelmäßig!
                                        </p>
                                        <p className="text-sm text-gray-700 leading-relaxed text-center mb-6">
                                            Wendessen hat jetzt eine
                                            Bücherzelle, die mit einer üppigen
                                            &ldquo;Erstausstattung&rdquo;
                                            versehen wurde. Und es gibt eine
                                            weitere gute Nachricht für
                                            Leseratten.
                                        </p>
                                        <div className="text-center">
                                            <a
                                                href="/lesefutter"
                                                className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 hover:from-green-700 hover:to-emerald-700 group/btn"
                                            >
                                                <span className="mr-2">
                                                    Mehr erfahren
                                                </span>
                                                <svg
                                                    className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform duration-300"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                                                    />
                                                </svg>
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                {/* Hospiz - Mobile */}
                                <div className="group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 bg-white">
                                    <div className="relative h-64 overflow-hidden">
                                        <Image
                                            src="/images/Hospiz.jpeg"
                                            alt="Hospiz Wendessen"
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent"></div>
                                        <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                                            <h3
                                                className="text-xl font-bold mb-3 drop-shadow-lg"
                                                style={{
                                                    textShadow:
                                                        '1px 1px 2px rgba(0,0,0,0.8), -1px -1px 2px rgba(0,0,0,0.8), 1px -1px 2px rgba(0,0,0,0.8), -1px 1px 2px rgba(0,0,0,0.8)',
                                                }}
                                            >
                                                HERZ AM RICHTIGEN FLECK
                                            </h3>
                                            <p className="text-lg text-red-200 font-semibold mb-3 drop-shadow-md">
                                                HOSPIZ WENDESSEN
                                            </p>
                                            <p className="text-sm leading-relaxed drop-shadow-md opacity-90 mb-4">
                                                In der Natur & in der
                                                historischen Mitte von Wendessen
                                            </p>
                                            <div>
                                                <a
                                                    href="/hospiz"
                                                    className="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-red-600 to-pink-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 hover:from-red-700 hover:to-pink-700 group/btn backdrop-blur-sm"
                                                >
                                                    <span className="mr-2">
                                                        Mehr erfahren
                                                    </span>
                                                    <svg
                                                        className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform duration-300"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                                                        />
                                                    </svg>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* SV Wendessen - Sportangebot */}
                                <div className="group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 bg-white">
                                    <div className="relative h-80 overflow-hidden">
                                        <Image
                                            src="/images/SV_Wendessen.JPG"
                                            alt="SV Wendessen Sportangebot"
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent"></div>
                                        <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                                            <h3
                                                className="text-2xl font-bold mb-4 leading-tight drop-shadow-lg"
                                                style={{
                                                    textShadow:
                                                        '1px 1px 2px rgba(0,0,0,0.8), -1px -1px 2px rgba(0,0,0,0.8), 1px -1px 2px rgba(0,0,0,0.8), -1px 1px 2px rgba(0,0,0,0.8)',
                                                }}
                                            >
                                                Sportangebot im Ort
                                            </h3>
                                            <p className="text-sm mb-4 leading-relaxed drop-shadow-md opacity-90">
                                                Mittendrin statt nur dabei!
                                            </p>
                                            <div>
                                                <a
                                                    href="/sport"
                                                    className="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 hover:from-blue-700 hover:to-indigo-700 group/btn backdrop-blur-sm"
                                                >
                                                    <span className="mr-2">
                                                        Mehr erfahren
                                                    </span>
                                                    <svg
                                                        className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform duration-300"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                                                        />
                                                    </svg>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Freiwillige Feuerwehr */}
                                <div className="group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 bg-white">
                                    <div className="relative h-80 overflow-hidden">
                                        <Image
                                            src="/images/Freiwillige_Feuerwehr.jpeg"
                                            alt="Freiwillige Feuerwehr Wendessen"
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent"></div>
                                        <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                                            <h3
                                                className="text-2xl font-bold mb-4 leading-tight drop-shadow-lg"
                                                style={{
                                                    textShadow:
                                                        '1px 1px 2px rgba(0,0,0,0.8), -1px -1px 2px rgba(0,0,0,0.8), 1px -1px 2px rgba(0,0,0,0.8), -1px 1px 2px rgba(0,0,0,0.8)',
                                                }}
                                            >
                                                Freiwillige Feuerwehr
                                            </h3>
                                            <p className="text-sm mb-4 leading-relaxed drop-shadow-md opacity-90">
                                                Wir geben dem Roten Hahn keine
                                                Chance!
                                            </p>
                                            <div>
                                                <a
                                                    href="/feuerwehr"
                                                    className="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-red-600 to-orange-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 hover:from-red-700 hover:to-orange-700 group/btn backdrop-blur-sm"
                                                >
                                                    <span className="mr-2">
                                                        Mehr erfahren
                                                    </span>
                                                    <svg
                                                        className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform duration-300"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                                                        />
                                                    </svg>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Kleingärtner-Verein */}
                                <div className="group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 bg-white">
                                    <div className="relative h-80 overflow-hidden">
                                        <Image
                                            src="/images/Kleingärten.jpeg"
                                            alt="Kleingärtner-Verein Wendessen"
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent"></div>
                                        <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                                            <h3
                                                className="text-2xl font-bold mb-4 leading-tight drop-shadow-lg"
                                                style={{
                                                    textShadow:
                                                        '1px 1px 2px rgba(0,0,0,0.8), -1px -1px 2px rgba(0,0,0,0.8), 1px -1px 2px rgba(0,0,0,0.8), -1px 1px 2px rgba(0,0,0,0.8)',
                                                }}
                                            >
                                                Kleingärtner-Verein
                                            </h3>
                                            <p className="text-sm mb-4 leading-relaxed drop-shadow-md opacity-90">
                                                Erholung im Grünen!
                                            </p>
                                            <div>
                                                <a
                                                    href="/kleingarten"
                                                    className="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-green-600 to-lime-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 hover:from-green-700 hover:to-lime-700 group/btn backdrop-blur-sm"
                                                >
                                                    <span className="mr-2">
                                                        Mehr erfahren
                                                    </span>
                                                    <svg
                                                        className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform duration-300"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                                                        />
                                                    </svg>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Tablet: Interesting asymmetrical layout */}
                            <div className="hidden md:block lg:hidden">
                                {/* First Row: Spielplätze spanning 2 columns */}
                                <div className="grid grid-cols-3 gap-6 mb-8">
                                    <div className="col-span-2 group relative overflow-hidden rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 bg-white">
                                        <div className="relative min-h-[350px] overflow-hidden">
                                            <Image
                                                src="/images/Spielplatz.jpg"
                                                alt="Spielplatz Wendessen"
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-700"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent"></div>
                                            <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
                                                <div className="max-w-md">
                                                    <h3
                                                        className="text-3xl font-bold mb-4 leading-tight drop-shadow-lg"
                                                        style={{
                                                            textShadow:
                                                                '1px 1px 2px rgba(0,0,0,0.8), -1px -1px 2px rgba(0,0,0,0.8), 1px -1px 2px rgba(0,0,0,0.8), -1px 1px 2px rgba(0,0,0,0.8)',
                                                        }}
                                                    >
                                                        3 Spielplätze im Ort!
                                                    </h3>
                                                    <p className="text-lg font-semibold mb-4 text-amber-200 drop-shadow-md">
                                                        Die Attraktivität für
                                                        Kinder & Familien steht
                                                        im Fokus.
                                                    </p>
                                                    <p className="text-sm mb-4 leading-relaxed drop-shadow-md opacity-90">
                                                        Unser Ort bietet eine
                                                        große Vielfalt für
                                                        Kinder & Jugendliche auf
                                                        seinen drei
                                                        Spielplätzen, welche im
                                                        Ort verteilt sind.
                                                    </p>
                                                    <p className="text-sm font-medium drop-shadow-md">
                                                        Auf der ersten
                                                        Doppelseilbahn in
                                                        Wendessen können Kinder
                                                        nun um die Wette fahren.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Lesefutter - Small card on the right */}
                                    <div className="group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 border border-green-100">
                                        <div className="p-6 h-full flex flex-col justify-center">
                                            <h3 className="text-xl font-bold text-gray-900 mb-3 text-center">
                                                Lesefutter in Wendessen
                                            </h3>
                                            <p className="text-sm text-green-700 font-semibold mb-3 text-center">
                                                Bücherbus kommt jetzt auch
                                                regelmäßig!
                                            </p>
                                            <p className="text-xs text-gray-700 leading-relaxed text-center mb-4">
                                                Wendessen hat jetzt eine
                                                Bücherzelle, die mit einer
                                                üppigen
                                                &ldquo;Erstausstattung&rdquo;
                                                versehen wurde. Und es gibt eine
                                                weitere gute Nachricht für
                                                Leseratten.
                                            </p>
                                            <div className="text-center">
                                                <a
                                                    href="/lesefutter"
                                                    className="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 hover:from-green-700 hover:to-emerald-700 group/btn text-sm"
                                                >
                                                    <span className="mr-1">
                                                        Mehr erfahren
                                                    </span>
                                                    <svg
                                                        className="w-3 h-3 transform group-hover/btn:translate-x-1 transition-transform duration-300"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                                                        />
                                                    </svg>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Second Row: Hospiz as a wide horizontal card */}
                                <div className="group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 bg-white">
                                    <div className="relative h-64 overflow-hidden">
                                        <Image
                                            src="/images/Hospiz.jpeg"
                                            alt="Hospiz Wendessen"
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/70 to-transparent"></div>
                                        <div className="absolute inset-0 p-8 flex items-center">
                                            <div className="max-w-lg text-white">
                                                <h3
                                                    className="text-2xl font-bold mb-4 drop-shadow-lg"
                                                    style={{
                                                        textShadow:
                                                            '1px 1px 2px rgba(0,0,0,0.8), -1px -1px 2px rgba(0,0,0,0.8), 1px -1px 2px rgba(0,0,0,0.8), -1px 1px 2px rgba(0,0,0,0.8)',
                                                    }}
                                                >
                                                    HERZ AM RICHTIGEN FLECK
                                                </h3>
                                                <p className="text-xl text-red-200 font-semibold mb-4 drop-shadow-md">
                                                    HOSPIZ WENDESSEN
                                                </p>
                                                <p className="text-base leading-relaxed drop-shadow-md opacity-90 mb-6">
                                                    In der Natur & in der
                                                    historischen Mitte von
                                                    Wendessen
                                                </p>
                                                <div>
                                                    <a
                                                        href="/hospiz"
                                                        className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 hover:from-red-700 hover:to-pink-700 group/btn backdrop-blur-sm"
                                                    >
                                                        <span className="mr-2">
                                                            Mehr erfahren
                                                        </span>
                                                        <svg
                                                            className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform duration-300"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M17 8l4 4m0 0l-4 4m4-4H3"
                                                            />
                                                        </svg>
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Third Row: Three cards side by side */}
                                <div className="grid grid-cols-3 gap-6 mt-8">
                                    {/* SV Wendessen - Sportangebot */}
                                    <div className="group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 bg-white h-80">
                                        <div className="relative h-full overflow-hidden">
                                            <Image
                                                src="/images/SV_Wendessen.JPG"
                                                alt="SV Wendessen Sportangebot"
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-700"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent"></div>
                                            <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                                                <h3
                                                    className="text-2xl font-bold mb-3 drop-shadow-lg"
                                                    style={{
                                                        textShadow:
                                                            '1px 1px 2px rgba(0,0,0,0.8), -1px -1px 2px rgba(0,0,0,0.8), 1px -1px 2px rgba(0,0,0,0.8), -1px 1px 2px rgba(0,0,0,0.8)',
                                                    }}
                                                >
                                                    Sportangebot im Ort
                                                </h3>
                                                <p className="text-sm leading-relaxed drop-shadow-md opacity-90 mb-4">
                                                    Mittendrin statt nur dabei!
                                                </p>
                                                <div>
                                                    <a
                                                        href="/sport"
                                                        className="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 hover:from-blue-700 hover:to-indigo-700 group/btn backdrop-blur-sm"
                                                    >
                                                        <span className="mr-2 text-sm">
                                                            Mehr erfahren
                                                        </span>
                                                        <svg
                                                            className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform duration-300"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M17 8l4 4m0 0l-4 4m4-4H3"
                                                            />
                                                        </svg>
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Freiwillige Feuerwehr */}
                                    <div className="group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 bg-white h-80">
                                        <div className="relative h-full overflow-hidden">
                                            <Image
                                                src="/images/Freiwillige_Feuerwehr.jpeg"
                                                alt="Freiwillige Feuerwehr Wendessen"
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-700"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent"></div>
                                            <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                                                <h3
                                                    className="text-2xl font-bold mb-3 drop-shadow-lg"
                                                    style={{
                                                        textShadow:
                                                            '1px 1px 2px rgba(0,0,0,0.8), -1px -1px 2px rgba(0,0,0,0.8), 1px -1px 2px rgba(0,0,0,0.8), -1px 1px 2px rgba(0,0,0,0.8)',
                                                    }}
                                                >
                                                    Freiwillige Feuerwehr
                                                </h3>
                                                <p className="text-sm leading-relaxed drop-shadow-md opacity-90 mb-4">
                                                    Wir geben dem Roten Hahn
                                                    keine Chance!
                                                </p>
                                                <div>
                                                    <a
                                                        href="/feuerwehr"
                                                        className="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-red-600 to-orange-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 hover:from-red-700 hover:to-orange-700 group/btn backdrop-blur-sm"
                                                    >
                                                        <span className="mr-2 text-sm">
                                                            Mehr erfahren
                                                        </span>
                                                        <svg
                                                            className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform duration-300"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M17 8l4 4m0 0l-4 4m4-4H3"
                                                            />
                                                        </svg>
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Kleingärtner-Verein */}
                                    <div className="group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 bg-white h-80">
                                        <div className="relative h-full overflow-hidden">
                                            <Image
                                                src="/images/Kleingärten.jpeg"
                                                alt="Kleingärtner-Verein Wendessen"
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-700"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent"></div>
                                            <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                                                <h3
                                                    className="text-2xl font-bold mb-3 drop-shadow-lg"
                                                    style={{
                                                        textShadow:
                                                            '1px 1px 2px rgba(0,0,0,0.8), -1px -1px 2px rgba(0,0,0,0.8), 1px -1px 2px rgba(0,0,0,0.8), -1px 1px 2px rgba(0,0,0,0.8)',
                                                    }}
                                                >
                                                    Kleingärtner-Verein
                                                </h3>
                                                <p className="text-sm leading-relaxed drop-shadow-md opacity-90 mb-4">
                                                    Erholung im Grünen!
                                                </p>
                                                <div>
                                                    <a
                                                        href="/kleingarten"
                                                        className="inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-green-600 to-lime-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 hover:from-green-700 hover:to-lime-700 group/btn backdrop-blur-sm"
                                                    >
                                                        <span className="mr-2 text-sm">
                                                            Mehr erfahren
                                                        </span>
                                                        <svg
                                                            className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform duration-300"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M17 8l4 4m0 0l-4 4m4-4H3"
                                                            />
                                                        </svg>
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Desktop: Original layout */}
                            <div className="hidden lg:block mb-16">
                                {/* Spielplätze - Full Width Hero with Text Overlay */}
                                <div className="group relative overflow-hidden rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 bg-white mb-16">
                                    <div className="relative min-h-[500px] overflow-hidden">
                                        <Image
                                            src="/images/Spielplatz.jpg"
                                            alt="Spielplatz Wendessen"
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent"></div>
                                        <div className="absolute inset-0 p-12 flex flex-col justify-end text-white">
                                            <div className="max-w-3xl">
                                                <h3
                                                    className="text-5xl font-bold mb-6 leading-tight drop-shadow-lg"
                                                    style={{
                                                        textShadow:
                                                            '1px 1px 2px rgba(0,0,0,0.8), -1px -1px 2px rgba(0,0,0,0.8), 1px -1px 2px rgba(0,0,0,0.8), -1px 1px 2px rgba(0,0,0,0.8)',
                                                    }}
                                                >
                                                    3 Spielplätze im Ort!
                                                </h3>
                                                <p className="text-2xl font-semibold mb-6 text-amber-200 drop-shadow-md">
                                                    Die Attraktivität für Kinder
                                                    & Familien steht im Fokus.
                                                </p>
                                                <p className="text-xl mb-6 leading-relaxed drop-shadow-md opacity-90">
                                                    Unser Ort bietet eine große
                                                    Vielfalt für Kinder &
                                                    Jugendliche auf seinen drei
                                                    Spielplätzen, welche im Ort
                                                    verteilt sind.
                                                </p>
                                                <p className="text-xl font-medium drop-shadow-md">
                                                    Auf der ersten
                                                    Doppelseilbahn in Wendessen
                                                    können Kinder nun um die
                                                    Wette fahren.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Bottom Row: Lesefutter & Hospiz Side by Side */}
                                <div className="grid grid-cols-2 gap-8">
                                    {/* Lesefutter - Text Only */}
                                    <div className="group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 border border-green-100">
                                        <div className="p-10 h-full flex flex-col justify-center">
                                            <h3 className="text-3xl font-bold text-gray-900 mb-4 text-center">
                                                Lesefutter in Wendessen
                                            </h3>
                                            <p className="text-lg text-green-700 font-semibold mb-4 text-center">
                                                Bücherbus kommt jetzt auch
                                                regelmäßig!
                                            </p>
                                            <p className="text-gray-700 leading-relaxed text-center mb-8">
                                                Wendessen hat jetzt eine
                                                Bücherzelle, die mit einer
                                                üppigen
                                                &ldquo;Erstausstattung&rdquo;
                                                versehen wurde. Und es gibt eine
                                                weitere gute Nachricht für
                                                Leseratten.
                                            </p>
                                            <div className="text-center">
                                                <a
                                                    href="/lesefutter"
                                                    className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 hover:from-green-700 hover:to-emerald-700 group/btn"
                                                >
                                                    <span className="mr-2">
                                                        Mehr erfahren
                                                    </span>
                                                    <svg
                                                        className="w-5 h-5 transform group-hover/btn:translate-x-1 transition-transform duration-300"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                                                        />
                                                    </svg>
                                                </a>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Hospiz - With Text Overlay */}
                                    <div className="group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 bg-white">
                                        <div className="relative h-96 overflow-hidden">
                                            <Image
                                                src="/images/Hospiz.jpeg"
                                                alt="Hospiz Wendessen"
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-700"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent"></div>
                                            <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
                                                <h3
                                                    className="text-3xl font-bold mb-4 drop-shadow-lg"
                                                    style={{
                                                        textShadow:
                                                            '1px 1px 2px rgba(0,0,0,0.8), -1px -1px 2px rgba(0,0,0,0.8), 1px -1px 2px rgba(0,0,0,0.8), -1px 1px 2px rgba(0,0,0,0.8)',
                                                    }}
                                                >
                                                    HERZ AM RICHTIGEN FLECK
                                                </h3>
                                                <p className="text-2xl text-red-200 font-semibold mb-4 drop-shadow-md">
                                                    HOSPIZ WENDESSEN
                                                </p>
                                                <p className="text-lg leading-relaxed drop-shadow-md opacity-90 mb-6">
                                                    In der Natur & in der
                                                    historischen Mitte von
                                                    Wendessen
                                                </p>
                                                <div>
                                                    <a
                                                        href="/hospiz"
                                                        className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 hover:from-red-700 hover:to-pink-700 group/btn backdrop-blur-sm"
                                                    >
                                                        <span className="mr-2">
                                                            Mehr erfahren
                                                        </span>
                                                        <svg
                                                            className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform duration-300"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                        >
                                                            <path
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                strokeWidth={2}
                                                                d="M17 8l4 4m0 0l-4 4m4-4H3"
                                                            />
                                                        </svg>
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Full Width Three Cards Section - Only on Desktop */}
            <div className="hidden lg:block w-full bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-3 gap-8">
                        {/* SV Wendessen - Sportangebot */}
                        <div className="group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 bg-white">
                            <div className="relative h-96 overflow-hidden">
                                <Image
                                    src="/images/SV_Wendessen.JPG"
                                    alt="SV Wendessen Sportangebot"
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-b from-black/95 via-black/70 to-transparent"></div>
                                <div className="absolute inset-0 p-8 flex flex-col justify-between text-white text-center">
                                    <div>
                                        <h3
                                            className="text-3xl font-bold mb-4 drop-shadow-lg"
                                            style={{
                                                textShadow:
                                                    '1px 1px 2px rgba(0,0,0,0.8), -1px -1px 2px rgba(0,0,0,0.8), 1px -1px 2px rgba(0,0,0,0.8), -1px 1px 2px rgba(0,0,0,0.8)',
                                            }}
                                        >
                                            Sportangebot im Ort
                                        </h3>
                                        <p className="text-lg leading-relaxed drop-shadow-md opacity-90">
                                            Mittendrin statt nur dabei!
                                        </p>
                                    </div>
                                    <div className="pb-4">
                                        <a
                                            href="/sport"
                                            className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 hover:from-blue-700 hover:to-indigo-700 group/btn backdrop-blur-sm"
                                        >
                                            <span className="mr-2">
                                                Mehr erfahren
                                            </span>
                                            <svg
                                                className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform duration-300"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                                                />
                                            </svg>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Freiwillige Feuerwehr */}
                        <div className="group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 bg-white">
                            <div className="relative h-96 overflow-hidden">
                                <Image
                                    src="/images/Freiwillige_Feuerwehr.jpeg"
                                    alt="Freiwillige Feuerwehr Wendessen"
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-b from-black/95 via-black/70 to-transparent"></div>
                                <div className="absolute inset-0 p-8 flex flex-col justify-between text-white text-center">
                                    <div>
                                        <h3
                                            className="text-3xl font-bold mb-4 drop-shadow-lg"
                                            style={{
                                                textShadow:
                                                    '1px 1px 2px rgba(0,0,0,0.8), -1px -1px 2px rgba(0,0,0,0.8), 1px -1px 2px rgba(0,0,0,0.8), -1px 1px 2px rgba(0,0,0,0.8)',
                                            }}
                                        >
                                            Freiwillige Feuerwehr
                                        </h3>
                                        <p className="text-lg leading-relaxed drop-shadow-md opacity-90">
                                            Wir geben dem Roten Hahn keine
                                            Chance!
                                        </p>
                                    </div>
                                    <div className="pb-4">
                                        <a
                                            href="/feuerwehr"
                                            className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 hover:from-red-700 hover:to-orange-700 group/btn backdrop-blur-sm"
                                        >
                                            <span className="mr-2">
                                                Mehr erfahren
                                            </span>
                                            <svg
                                                className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform duration-300"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                                                />
                                            </svg>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Kleingärtner-Verein */}
                        <div className="group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 bg-white">
                            <div className="relative h-96 overflow-hidden">
                                <Image
                                    src="/images/Kleingärten.jpeg"
                                    alt="Kleingärtner-Verein Wendessen"
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-b from-black/95 via-black/70 to-transparent"></div>
                                <div className="absolute inset-0 p-8 flex flex-col justify-between text-white text-center">
                                    <div>
                                        <h3
                                            className="text-3xl font-bold mb-4 drop-shadow-lg"
                                            style={{
                                                textShadow:
                                                    '1px 1px 2px rgba(0,0,0,0.8), -1px -1px 2px rgba(0,0,0,0.8), 1px -1px 2px rgba(0,0,0,0.8), -1px 1px 2px rgba(0,0,0,0.8)',
                                            }}
                                        >
                                            Kleingärtner-Verein
                                        </h3>
                                        <p className="text-lg leading-relaxed drop-shadow-md opacity-90">
                                            Erholung im Grünen!
                                        </p>
                                    </div>
                                    <div className="pb-4">
                                        <a
                                            href="/kleingarten"
                                            className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-green-600 to-lime-600 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 hover:from-green-700 hover:to-lime-700 group/btn backdrop-blur-sm"
                                        >
                                            <span className="mr-2">
                                                Mehr erfahren
                                            </span>
                                            <svg
                                                className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform duration-300"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                                                />
                                            </svg>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
