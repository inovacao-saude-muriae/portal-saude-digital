import Carousel from "@/components/Carousel";
import Hero from "@/components/Hero";
import News from "@/components/SectionNews";
import ServicesGrid from "@/components/ServicesSection";

export default function Home() {
    return (
        <>
        {/* BANNER */}
        <Hero />
        
        {/* SERVIÇOS */}
        <ServicesGrid />

        {/* CAROUSEL */}
        <Carousel />

        {/* NEWS */}
        <News />

        {/* eventos */}

        </>
    );
}