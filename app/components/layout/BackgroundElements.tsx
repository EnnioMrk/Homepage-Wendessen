'use client';

import { useEffect, useRef } from 'react';

export default function BackgroundElements() {
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
        <div
            className="absolute inset-0 overflow-hidden"
            style={{ zIndex: -1, pointerEvents: 'none' }}
        >
            {/* Parallax scrolling rotated rectangle */}
            <div
                ref={rectangleRef}
                className="absolute"
                style={{
                    background:
                        'linear-gradient(135deg, rgba(24, 157, 73, 0.5) 0%, rgba(16, 120, 55, 0.55) 50%, rgba(12, 95, 43, 0.6) 100%)',
                    width: '200vw',
                    height: '18vh',
                    top: 'calc(30vh - 5vh)',
                    left: '50%',
                    transform: 'translate(-50%, -50%) rotate(12deg)',
                    zIndex: -2,
                    willChange: 'transform' /* Performance optimization */,
                    boxShadow:
                        '0 4px 30px rgba(24, 157, 73, 0.3), 0 8px 60px rgba(12, 95, 43, 0.2)',
                }}
            ></div>

            {/* Subtle background pattern */}
            <div
                className="absolute inset-0 opacity-[0.06]"
                style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, rgba(24, 157, 73, 0.4) 1px, transparent 0)`,
                    backgroundSize: '30px 30px',
                }}
            ></div>
        </div>
    );
}
