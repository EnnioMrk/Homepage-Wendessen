import Image from 'next/image';

export const metadata = {
    title: 'Jugendfeuerwehr Wendessen - Vereine',
    description: 'Die Jugendfeuerwehr Wendessen - Spaß, Action und feuerwehrtechnisches Wissen für Kinder und Jugendliche von 10 bis 16 Jahren',
};

export default function JugendfeuerwehrPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-r from-orange-600 via-red-500 to-pink-600 py-20 overflow-hidden">
                <div className="absolute inset-0 bg-[url('/images/Events/Jugendfeuerwehr.jpeg')] bg-cover bg-center opacity-30"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-orange-600/90 to-pink-600/90"></div>
                
                <div className="relative z-10 container mx-auto px-4 text-center">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex items-center justify-center mb-6">
                            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl mr-6">
                                <svg className="w-12 h-12 text-orange-600" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z"/>
                                </svg>
                            </div>
                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white">
                                Jugendfeuerwehr
                            </h1>
                        </div>
                        <div className="w-32 h-2 bg-gradient-to-r from-yellow-400 to-white mx-auto mb-8"></div>
                        <p className="text-2xl md:text-3xl text-white/90 leading-relaxed max-w-3xl mx-auto">
                            Wendessen
                        </p>
                        <p className="text-xl text-yellow-200 font-semibold mt-4">
                            Spaß • Action • Gemeinschaft • Feuerwehrtechnik
                        </p>
                        
                        {/* Decorative elements */}
                        <div className="absolute top-10 left-10 w-20 h-20 border-2 border-white/30 rounded-full animate-pulse"></div>
                        <div className="absolute bottom-10 right-10 w-16 h-16 border-2 border-yellow-400/50 rounded-full animate-pulse"></div>
                        <div className="absolute top-1/2 left-20 w-2 h-2 bg-white/40 rounded-full animate-bounce"></div>
                        <div className="absolute top-1/3 right-32 w-3 h-3 bg-yellow-400/60 rounded-full animate-bounce delay-300"></div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-5xl mx-auto">
                    {/* Hero Image Section */}
                    <div className="text-center mb-16">
                        <div className="relative w-full h-96 md:h-[500px] rounded-3xl overflow-hidden shadow-2xl border-4 border-orange-100">
                            <Image
                                src="/images/Events/Jugendfeuerwehr.jpeg"
                                alt="Jugendfeuerwehr Wendessen in Aktion"
                                fill
                                className="object-cover"
                                priority
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                                <h2 className="text-3xl font-bold mb-2">
                                    Über 25 Jahre Jugendfeuerwehr
                                </h2>
                                <p className="text-lg">
                                    Jungen und Mädchen von 10 bis 16 Jahren lernen gemeinsam
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Welcome Section */}
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                            Hallo Kinder & Jugendliche!
                        </h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-orange-600 to-pink-600 mx-auto mb-6"></div>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Willkommen in eurem neuen Zuhause Wendessen!
                        </p>
                    </div>

                    {/* Welcome Message */}
                    <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl mb-16">
                        <div className="space-y-6 text-gray-700 leading-relaxed">
                            <div className="bg-gradient-to-r from-orange-50 to-pink-50 border-l-4 border-orange-500 p-6 rounded-r-2xl">
                                <p className="text-lg">
                                    <strong>Hallo</strong> all den Kindern und Jugendlichen, die mit Ihren Eltern hier bei uns in Wendessen ein neues Zuhause gefunden haben. Damit Ihr wisst, was in unserem Dorf so los ist und was ihr so machen könnt, möchten wir uns kurz vorstellen.
                                </p>
                            </div>

                            <p className="text-lg">
                                Wir sind die <strong>Jugendgruppe der Freiwilligen Feuerwehr Wolfenbüttel im Ortsteil Wendessen</strong> und mittlerweile gibt es unsere Jugendfeuerwehr schon <strong>über 25 Jahre</strong>.
                            </p>

                            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-500 p-8 rounded-2xl">
                                <h3 className="text-2xl font-bold text-blue-700 mb-4 flex items-center">
                                    <svg className="w-8 h-8 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    Wer kann mitmachen?
                                </h3>
                                <p className="text-lg">
                                    Bei uns gibt es <strong>Jungen und Mädchen im Alter von 10 bis 16 Jahren</strong>.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Activities and Schedule */}
                    <div className="mb-16">
                        <div className="text-center mb-12">
                            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                                Was wir machen
                            </h2>
                            <div className="w-24 h-1 bg-gradient-to-r from-red-600 to-orange-600 mx-auto mb-6"></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Schedule */}
                            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-3xl shadow-lg">
                                <h3 className="text-2xl font-bold text-green-700 mb-6 flex items-center">
                                    <svg className="w-8 h-8 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    Unsere Dienstzeiten
                                </h3>
                                <p className="text-gray-700 mb-4">
                                    Jeden Montag treffen wir uns in unserem Jugendraum zum &quot;Dienst&quot;.
                                </p>
                                <div className="bg-white p-6 rounded-xl border border-green-200">
                                    <p className="font-semibold text-green-800 text-lg">
                                        Jeden Montag
                                    </p>
                                    <p className="text-green-600 text-xl font-bold">
                                        18:00 - 19:30 Uhr
                                    </p>
                                    <p className="text-gray-600 mt-2">
                                        im Jugendraum des Feuerwehrgerätehauses
                                    </p>
                                </div>
                            </div>

                            {/* Activities */}
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-3xl shadow-lg">
                                <h3 className="text-2xl font-bold text-blue-700 mb-6 flex items-center">
                                    <svg className="w-8 h-8 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                    Action & Spaß
                                </h3>
                                <ul className="space-y-3 text-gray-700">
                                    <li className="flex items-start">
                                        <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 mt-2"></span>
                                        <span>Feuerwehrtechnisches Wissen erlernen und üben</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="w-2 h-2 bg-indigo-500 rounded-full mr-3 mt-2"></span>
                                        <span>Wettpaddeln auf dem Fümmelsee</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="w-2 h-2 bg-purple-500 rounded-full mr-3 mt-2"></span>
                                        <span>Oder-Camp Abenteuer</span>
                                    </li>
                                    <li className="flex items-start">
                                        <span className="w-2 h-2 bg-pink-500 rounded-full mr-3 mt-2"></span>
                                        <span>Leistungsfahrten und Wettbewerbe</span>
                                    </li>
                                </ul>
                                <div className="bg-white p-4 rounded-xl border border-blue-200 mt-4">
                                    <p className="font-semibold text-blue-800">
                                        Auf jeden Fall haben wir immer Spaß zusammen! 🎉
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Team Section */}
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-3xl p-8 md:p-12 shadow-xl mb-16">
                        <div className="text-center mb-8">
                            <h3 className="text-3xl font-bold text-foreground mb-4">
                                Unser Team
                            </h3>
                            <div className="w-20 h-1 bg-gradient-to-r from-purple-600 to-pink-600 mx-auto mb-4"></div>
                            <p className="text-gray-600">
                                Gemeinsam mit unserem Jugendfeuerwehrwart und Betreuern
                            </p>
                        </div>

                        <div className="text-center text-gray-700">
                            <p className="text-lg mb-6">
                                Gemeinsam mit unserem <strong>Jugendfeuerwehrwart Cornelius Witte</strong>, seinem <strong>Stellvertreter Frederick Witte</strong> sowie unseren Betreuern eignen wir uns durch Erlernen und Üben feuerwehrtechnisches Wissen an.
                            </p>
                        </div>
                    </div>

                    {/* Join Us Section */}
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                            Mach mit!
                        </h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-orange-600 to-red-600 mx-auto mb-6"></div>
                    </div>

                    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-3xl p-8 md:p-12 shadow-xl mb-16">
                        <div className="text-center">
                            <div className="w-24 h-24 bg-gradient-to-r from-orange-600 to-red-600 rounded-full flex items-center justify-center mx-auto mb-8">
                                <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                                </svg>
                            </div>
                            
                            <h3 className="text-3xl font-bold text-orange-700 mb-6">
                                Bist Du zwischen 10 und 16 Jahren alt?
                            </h3>
                            
                            <div className="space-y-6 text-gray-700 text-lg">
                                <p>
                                    Wenn Du zwischen <strong>10 und 16 Jahren alt</strong> bist und gern bei uns mitmachen möchtest, dann melde Dich doch bei uns!
                                </p>
                                
                                <div className="bg-white p-6 rounded-2xl border-2 border-orange-200">
                                    <h4 className="font-semibold text-orange-800 mb-2 flex items-center justify-center">
                                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        Wo du uns findest:
                                    </h4>
                                    <p className="text-orange-700">
                                        Das Feuerwehr-Gerätehaus findest Du <strong>mitten im Dorf gegenüber dem Spielplatz</strong>.
                                    </p>
                                </div>
                                
                                <p>
                                    Wenn Du neugierig geworden bist kannst Du uns auch gerne einmal im Internet unter{' '}
                                    <a href="http://www.jf-wendessen.jimdo.com" target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:text-orange-700 font-semibold underline">
                                        www.jf-wendessen.jimdo.com
                                    </a>{' '}
                                    besuchen oder Du wendest Dich direkt an die Jugendwarte Cornelius und Frederick Witte.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Section */}
                    <div className="text-center mb-12">
                        <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
                            Ansprechpartner
                        </h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-orange-600 to-red-600 mx-auto mb-6"></div>
                        <p className="text-lg text-gray-600">
                            Unsere Jugendwarte sind für euch da
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Jugendfeuerwehrwart */}
                        <div className="bg-white rounded-3xl p-8 shadow-xl border-l-4 border-orange-500">
                            <div className="text-center">
                                <div className="w-20 h-20 bg-gradient-to-r from-orange-600 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <p className="text-sm font-semibold text-orange-600 uppercase tracking-wide mb-2">
                                    Jugendfeuerwehrwart
                                </p>
                                <h3 className="text-2xl font-bold text-foreground mb-4">
                                    Christoph Ruprecht
                                </h3>
                                <div className="space-y-3">
                                    <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-xl">
                                        <a href="tel:053319358049" className="flex items-center justify-center text-orange-600 hover:text-orange-700 transition-colors">
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                            05331 / 935849
                                        </a>
                                    </div>
                                    <div className="bg-gradient-to-r from-orange-50 to-red-50 p-4 rounded-xl">
                                        <a href="tel:015170168231" className="flex items-center justify-center text-orange-600 hover:text-orange-700 transition-colors">
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                            </svg>
                                            0151 / 70168231
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Stellvertretender Jugendfeuerwehrwart */}
                        <div className="bg-white rounded-3xl p-8 shadow-xl border-l-4 border-red-500">
                            <div className="text-center">
                                <div className="w-20 h-20 bg-gradient-to-r from-red-600 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <p className="text-sm font-semibold text-red-600 uppercase tracking-wide mb-2">
                                    stellv. Jugendfeuerwehrwart
                                </p>
                                <h3 className="text-2xl font-bold text-foreground mb-4">
                                    Frederick Witte
                                </h3>
                                <div className="space-y-3">
                                    <div className="bg-gradient-to-r from-red-50 to-pink-50 p-4 rounded-xl">
                                        <a href="tel:0533164618" className="flex items-center justify-center text-red-600 hover:text-red-700 transition-colors">
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                            05331 / 64618
                                        </a>
                                    </div>
                                    <div className="bg-gradient-to-r from-red-50 to-pink-50 p-4 rounded-xl">
                                        <a href="tel:015775767067" className="flex items-center justify-center text-red-600 hover:text-red-700 transition-colors">
                                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                            </svg>
                                            01577 / 5767067
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Closing Statement */}
                    <div className="text-center mt-16 bg-gradient-to-r from-orange-50 to-red-50 rounded-3xl p-8 shadow-lg">
                        <h3 className="text-3xl font-bold text-orange-700 mb-6">
                            Wir freuen uns auf Dich! 🚒
                        </h3>
                        <p className="text-xl text-gray-700 font-medium mb-4">
                            Deine Jugendfeuerwehr Wendessen
                        </p>
                        <div className="flex justify-center">
                            <div className="flex items-center space-x-2 text-orange-600">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z"/>
                                </svg>
                                <span className="font-semibold">
                                    Über 25 Jahre Jugendfeuerwehr
                                </span>
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2L13.09 8.26L22 9L13.09 9.74L12 16L10.91 9.74L2 9L10.91 8.26L12 2Z"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}