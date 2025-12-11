import BackgroundElements from '@/app/components/layout/BackgroundElements';
import NewsSection from '@/app/components/news/NewsSection';
import HeroTitle from '@/app/components/HeroTitle';
import EventsSection from '@/app/components/events/EventsSection';
import WirSindWendessenSection from './components/WirSindWendessenSection';
import FullWidthServicesSection from './components/FullWidthServicesSection';
import HomeBanner from './components/HomeBanner';

// Revalidate the homepage every hour, or when manually triggered
export const revalidate = 3600;

export default function Home() {
    return (
        <div className="min-h-screen py-6 px-4 relative">
            <HomeBanner />
            <BackgroundElements />

            {/* CONTENT CONTAINER - CENTERED IN VIEWPORT */}
            <div className="max-w-7xl mx-auto min-h-[80vh] flex flex-col relative z-10">
                <div className="w-full">
                    <NewsSection />
                    <HeroTitle />
                    <EventsSection />
                    <WirSindWendessenSection />
                </div>
            </div>

            <FullWidthServicesSection />
        </div>
    );
}
