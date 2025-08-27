'use client';

import { useEffect } from 'react';

export default function HomeBanner() {
    useEffect(() => {
        // Add banner to the very top of the page, above the navbar
        const banner = document.createElement('div');
        banner.className =
            'w-full bg-background flex justify-center border-b border-border homepage-banner';
        banner.style.order = '-1';

        const img = document.createElement('img');
        img.src = '/images/Banner.jpg';
        img.alt = 'Willkommen in Wendessen';
        img.className =
            'w-full h-auto object-cover max-h-[220px] md:max-h-[275px] shadow-md rounded-b-lg';
        img.style.width = '100%';
        img.style.height = 'auto';

        banner.appendChild(img);

        // Insert banner at the very beginning of the body's flex container
        const flexContainer = document.querySelector('body > div');
        if (flexContainer) {
            flexContainer.insertBefore(banner, flexContainer.firstChild);
        }

        // Cleanup function
        return () => {
            const existingBanner = document.querySelector('.homepage-banner');
            if (existingBanner) {
                existingBanner.remove();
            }
        };
    }, []);

    return null; // This component doesn't render anything directly
}
