import { HeroSection } from "@/components/home/hero-section"
import { StatsSection } from "@/components/home/stats-section"
import { MissionSection } from "@/components/home/mission-section"
import { ProgramsSection } from "@/components/home/programs-section"
import { HowItWorksSection } from "@/components/home/how-it-works-section"
import { BenefitsSection } from "@/components/home/benefits-section"
import { WhyChooseSection } from "@/components/home/why-choose-section"
import { TestimonialsSection } from "@/components/home/testimonials-section"
import { LogosSection } from "@/components/home/logos-section"
import { CtaSection } from "@/components/home/cta-section"

export default function HomePage() {
    return (
        <>
            <HeroSection />
            <StatsSection />
            <MissionSection />
            <ProgramsSection />
            <HowItWorksSection />
            <BenefitsSection />
            <WhyChooseSection />
            <TestimonialsSection />
            <LogosSection />
            <CtaSection />
        </>
    )
}
