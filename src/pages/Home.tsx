import { Hero } from "@/components/home/Hero";
import { Differentials } from "@/components/home/Differentials";
import { HowItWorks } from "@/components/home/HowItWorks";
import { FeaturedCourses } from "@/components/home/FeaturedCourses";
import { MaterialsSection } from "@/components/home/MaterialsSection";
import { SocialProof } from "@/components/home/SocialProof";

export function Home() {
    return (
        <div className="animate-fade-in">
            <Hero />
            <Differentials />
            <FeaturedCourses />
            <HowItWorks />
            <MaterialsSection />
            <SocialProof />
        </div>
    );
}
