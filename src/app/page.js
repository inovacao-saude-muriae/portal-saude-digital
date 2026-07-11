import Hero from "@/components/Hero";
import ServiceSection from "@/components/ServiceSection";
import Carousel from "@/components/Carousel";
import NewsSection from "@/components/NewsSection";
import EventSection from "@/components/EventSection";

export default function Home() {
    return (
        <>
        {/* BANNER */}
        <Hero />
        
        {/* SERVIÇOS */}
        <ServiceSection />

        {/* CAROUSEL */}
        <Carousel />

        {/* NEWS */}
        <NewsSection />

        {/* eventos */}
        <EventSection />

        </>
    );
}