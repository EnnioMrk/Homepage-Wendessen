'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import FeatureCard from './FeatureCard';
import { vereineData } from '@/lib/vereine-data';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

export default function VereineCarousel() {
    // Create multiple copies for infinite effect
    const slides = Array.from({ length: 3 }, (_, cycle) =>
        vereineData.map((verein, index) => ({
            ...verein,
            key: `${verein.id}-${cycle}-${index}`,
        }))
    ).flat();

    return (
        <div className="relative w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] bg-gray-50 py-8 md:py-12 lg:py-16 overflow-hidden">
            <div className="text-center mb-8 md:mb-10 lg:mb-12 px-4 md:px-6 lg:px-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                    Unsere Vereine
                </h2>
                <p className="text-base md:text-lg text-gray-600">
                    Entdecken Sie das vielfältige Vereinsleben in Wendessen
                </p>
            </div>

            <div className="relative w-full overflow-hidden">
                <Swiper
                    modules={[Autoplay, Navigation, Pagination]}
                    grabCursor={true}
                    centeredSlides={true}
                    loop={true}
                    slidesPerView="auto"
                    spaceBetween={16}
                    breakpoints={{
                        640: {
                            spaceBetween: 20,
                        },
                        768: {
                            spaceBetween: 24,
                        },
                        1024: {
                            spaceBetween: 32,
                        },
                    }}
                    initialSlide={Math.floor(slides.length / 2) + 1}
                    autoplay={{
                        delay: 3000,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true,
                    }}
                    navigation={{
                        nextEl: '.swiper-button-next-custom',
                        prevEl: '.swiper-button-prev-custom',
                        enabled: true,
                    }}
                    pagination={{
                        el: '.swiper-pagination-custom',
                        clickable: true,
                        bulletClass: 'swiper-pagination-bullet-custom',
                        bulletActiveClass:
                            'swiper-pagination-bullet-active-custom',
                    }}
                    speed={800}
                    className="swiper-carousel !pb-16 !overflow-visible [&_.swiper-button-next]:!hidden [&_.swiper-button-prev]:!hidden"
                    style={{
                        paddingTop: '2rem',
                        paddingBottom: '4rem',
                    }}
                >
                    {slides.map((verein) => (
                        <SwiperSlide
                            key={verein.key}
                            className="!w-72 sm:!w-80 !h-auto"
                            style={{ width: '288px' }}
                        >
                            <div className="relative group cursor-pointer isolate">
                                <FeatureCard
                                    title={verein.title}
                                    description={verein.description}
                                    imageSrc={verein.imageSrc}
                                    imageAlt={verein.imageAlt}
                                    buttonText={verein.buttonText}
                                    buttonHref={verein.buttonHref}
                                    buttonColor={verein.buttonColor}
                                    className="h-80 sm:h-96 transition-transform duration-300 group-hover:scale-105"
                                />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>

                {/* Custom Navigation Buttons - Centered on card images */}
                <button className="swiper-button-prev-custom absolute left-2 md:left-4 top-[calc(50%-2rem)] -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 bg-white rounded-full shadow-xl hover:shadow-2xl flex items-center justify-center text-gray-800 hover:text-primary transition-all duration-300 hover:scale-110 border-2 border-gray-200 hover:border-primary">
                    <svg
                        width="11"
                        height="18"
                        viewBox="0 0 11 20"
                        fill="none"
                        className="rotate-180 md:w-[13px] md:h-[22px]"
                    >
                        <path
                            d="M0.38296 20.0762C0.111788 19.805 0.111788 19.3654 0.38296 19.0942L9.19758 10.2796L0.38296 1.46497C0.111788 1.19379 0.111788 0.754138 0.38296 0.482966C0.654131 0.211794 1.09379 0.211794 1.36496 0.482966L10.4341 9.55214C10.8359 9.9539 10.8359 10.6053 10.4341 11.007L1.36496 20.0762C1.09379 20.3474 0.654131 20.3474 0.38296 20.0762Z"
                            fill="currentColor"
                        />
                    </svg>
                </button>

                <button className="swiper-button-next-custom absolute right-2 md:right-4 top-[calc(50%-2rem)] -translate-y-1/2 z-10 w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 bg-white rounded-full shadow-xl hover:shadow-2xl flex items-center justify-center text-gray-800 hover:text-primary transition-all duration-300 hover:scale-110 border-2 border-gray-200 hover:border-primary">
                    <svg
                        width="11"
                        height="18"
                        viewBox="0 0 11 20"
                        fill="none"
                        className="md:w-[13px] md:h-[22px]"
                    >
                        <path
                            d="M0.38296 20.0762C0.111788 19.805 0.111788 19.3654 0.38296 19.0942L9.19758 10.2796L0.38296 1.46497C0.111788 1.19379 0.111788 0.754138 0.38296 0.482966C0.654131 0.211794 1.09379 0.211794 1.36496 0.482966L10.4341 9.55214C10.8359 9.9539 10.8359 10.6053 10.4341 11.007L1.36496 20.0762C1.09379 20.3474 0.654131 20.3474 0.38296 20.0762Z"
                            fill="currentColor"
                        />
                    </svg>
                </button>

                {/* Custom Pagination */}
                <div className="swiper-pagination-custom flex justify-center mt-6 md:mt-8 space-x-2"></div>
            </div>

            <style jsx>{`
                .swiper-carousel {
                    isolation: isolate;
                }

                .swiper-carousel .swiper-slide {
                    isolation: isolate;
                }

                /* Hide default Swiper navigation buttons */
                .swiper-carousel :global(.swiper-button-next),
                .swiper-carousel :global(.swiper-button-prev) {
                    display: none !important;
                }

                /* Hide default Swiper pagination */
                .swiper-carousel :global(.swiper-pagination) {
                    display: none !important;
                }

                .swiper-pagination-bullet-custom {
                    width: 12px;
                    height: 12px;
                    background: rgba(0, 0, 0, 0.3);
                    border-radius: 50%;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .swiper-pagination-bullet-active-custom {
                    background: #374151;
                    transform: scale(1.2);
                }

                /* Prevent button artifacts */
                .swiper-button-prev-custom,
                .swiper-button-next-custom {
                    isolation: isolate;
                    z-index: 1000;
                }

                .swiper-button-prev-custom::before,
                .swiper-button-prev-custom::after,
                .swiper-button-next-custom::before,
                .swiper-button-next-custom::after {
                    display: none;
                }
            `}</style>
        </div>
    );
}
