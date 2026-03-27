import { BackgroundVideo } from '@/components/BackgroundVideo';
import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { AboutSection } from '@/components/AboutSection';
import { InterdependencyGraph } from '@/components/InterdependencyGraph';
import { NewsPreview } from '@/components/NewsPreview'; 
import { ContactSection } from '@/components/ContactSection';

export default function HomePage() {
  return (
    <div
      className="relative min-h-screen overflow-x-hidden font-inter text-foreground bg-background"
    >
      {/* Animated background */}
      <BackgroundVideo />

      {/* Top navigation */}
      <Navbar />

      {/* Page sections wrapper to ensure they are above the background */}
      <main className="relative z-10">
        <HeroSection />
        <AboutSection />
        
        {/* New AI Interdependency Matrix */}
        <InterdependencyGraph />

        <NewsPreview /> 
        <ContactSection />
      </main>
    </div>
  );
}
