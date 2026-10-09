import AffiliationMarquee from "@/components/site/AffiliationMarquee";
import ApplicationsSection from "@/components/site/ApplicationsSection";
import BrainViewport from "@/components/site/BrainViewport";
import ContactFooter from "@/components/site/ContactFooter";
import Hero from "@/components/site/Hero";
import MarketSection from "@/components/site/MarketSection";
import PipelineSection from "@/components/site/PipelineSection";
import ProblemSection from "@/components/site/ProblemSection";
import ProductSection from "@/components/site/ProductSection";
import RoadmapSection from "@/components/site/RoadmapSection";
import SiteNav from "@/components/site/SiteNav";
import TeamSection from "@/components/site/TeamSection";
import VisionSection from "@/components/site/VisionSection";

export default function Home() {
  return (
    <div className="min-h-screen bg-ink text-paper">
      <SiteNav />
      <main>
        <Hero />
        <BrainViewport />
        <AffiliationMarquee />
        <ProblemSection />
        <VisionSection />
        <ProductSection />
        <PipelineSection />
        <MarketSection />
        <ApplicationsSection />
        <RoadmapSection />
        <TeamSection />
      </main>
      <ContactFooter />
    </div>
  );
}
