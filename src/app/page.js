import Carousel from "@/components/Carousel";
import Hero from "@/components/Hero";
import ServicesGrid from "@/components/ServicesGrid";

export default function Home() {
    return (
        <>
        {/* BANNER */}
        <Hero />
        
        {/* SERVIÇOS */}
        <ServicesGrid />

        {/* CAROUSEL */}
        <Carousel />
        </>
    );
}