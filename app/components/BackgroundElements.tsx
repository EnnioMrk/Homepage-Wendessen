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
    );
}
