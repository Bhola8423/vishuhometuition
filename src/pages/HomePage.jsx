import React from 'react';
import HeroSection from '../components/home/HeroSection';
import TrustStatsSection from '../components/home/TrustStatsSection';
import TeacherRegistrationSection from '../components/home/TeacherRegistrationSection';
import StudentRegistrationSection from '../components/home/StudentRegistrationSection';
import HowItWorksSection from '../components/home/HowItWorksSection';
import FeeStructureSection from '../components/home/FeeStructureSection';
import TestimonialsSection from '../components/home/TestimonialsSection';
import FounderVisionSection from '../components/home/FounderVisionSection';
import FAQSection from '../components/home/FAQSection';

export default function HomePage({ onOpenStatusModal }) {
  return (

    <main>
      {/* <Header onOpenStatusModal={() => setIsStatusModalOpen(true)} /> */}
      <HeroSection />
      <TrustStatsSection />
      <TeacherRegistrationSection />
      <StudentRegistrationSection />
      <HowItWorksSection />
      <FeeStructureSection />
      <TestimonialsSection />
      <FounderVisionSection />
      <FAQSection />
    </main>
  );
}

