import React from 'react';
import { HeroSection } from '../components/HeroSection';
import { AboutEvent } from '../components/AboutEvent';
import { AboutUniversity } from '../components/AboutUniversity';
import { ExhibitionCategories } from '../components/ExhibitionCategories';
import { BoothSelection } from '../components/BoothSelection';
import { Sponsors } from '../components/Sponsors';
import { RegistrationCTA } from '../components/RegistrationCTA';
import { EventHighlights } from '../components/EventHighlights';
export function HomePage() {
  return (
    <div>
      <HeroSection />
      <EventHighlights />
      <AboutEvent />
      <AboutUniversity />
      <ExhibitionCategories />
      <BoothSelection />
      <Sponsors />
      <RegistrationCTA />
    </div>);

}