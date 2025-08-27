export default function HeroTitle() {
    return (
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
                    <br className="sm:hidden" /> WAS&nbsp;DENN&nbsp;SONST?
                </h1>
            </div>
        </div>
    );
}
