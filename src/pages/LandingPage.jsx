import React from 'react';
import { Helmet } from 'react-helmet';
import HeroSection from '@/components/landing/HeroSection';
import SecuritySection from '@/components/landing/SecuritySection';
import ServicesSection from '@/components/landing/ServicesSection';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import AboutSection from '@/components/landing/AboutSection';
import CtaSection from '@/components/landing/CtaSection';
import LandingFooter from '@/components/landing/LandingFooter';
import LandingHeader from '@/components/landing/LandingHeader';

const LandingPage = () => {
  return (
    <>
      <Helmet>
        <title>Drex Solutions - Banca Digital Segura | Protección Anti-Fraude</title>
        <meta name="description" content="Drex Solutions - La banca digital más segura con tecnología anti-fraude avanzada, protección 24/7 y recuperación ante estafas. Tu dinero, nuestra prioridad." />
      </Helmet>
      
      <LandingHeader />
      <main>
        <HeroSection />
        <SecuritySection />
        <ServicesSection />
        <TestimonialsSection />
        <AboutSection />
        <CtaSection />
      </main>
      <LandingFooter />
    </>
  );
};

export default LandingPage;