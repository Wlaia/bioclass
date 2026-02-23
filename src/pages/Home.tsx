import { Hero } from "@/components/home/Hero";

import { UpcomingCourse } from "@/components/home/UpcomingCourse";



export function Home() {
    return (
        <div className="animate-fade-in">
            <Hero />
            <UpcomingCourse />
        </div>
    );
}
