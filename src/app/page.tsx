import { BackgroundVideo } from '@/components/BackgroundVideo';
import { Navbar } from '@/components/Navbar';
import { HeroSection } from '@/components/HeroSection';
import { AboutSection } from '@/components/AboutSection';
import { NewsPreview } from '@/components/NewsPreview';
import { DashboardPreview } from '@/components/DashboardPreview';
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

      {/* Page sections */}
      <HeroSection />
      <AboutSection />
      <NewsPreview />
      <DashboardPreview />
      <ContactSection />
    </div>
  );
}
