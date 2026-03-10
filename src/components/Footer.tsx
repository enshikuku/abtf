import React from 'react';
import {
  GraduationCapIcon,
  MailIcon,
  PhoneIcon,
  MapPinIcon } from
'lucide-react';
import { useRouter } from './RouterContext';
export function Footer() {
  const { navigateTo } = useRouter();
  const handleLinkClick = (
  e: React.MouseEvent<HTMLAnchorElement>,
  page: string) =>
  {
    e.preventDefault();
    navigateTo(page);
  };
  return (
    <footer id="contact" className="bg-deepBlue text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="lg:col-span-1">
            <div
              className="flex items-center gap-3 mb-6 cursor-pointer"
              onClick={() => navigateTo('home')}>

              <div className="bg-white p-2 rounded-full">
                <GraduationCapIcon className="h-6 w-6 text-deepBlue" />
              </div>
              <div className="flex flex-col">
                <span className="text-white font-poppins font-bold text-lg leading-tight">
                  University of Eldoret
                </span>
                <span className="text-gold font-poppins font-semibold text-sm leading-tight">
                  Agri-Business Trade Fair
                </span>
              </div>
            </div>
            <p className="text-gray-400 font-inter text-sm leading-relaxed mb-6">
              Transforming agriculture through innovation, research, and
              practical solutions for sustainable development.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold font-poppins mb-6 text-white">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  onClick={(e) => handleLinkClick(e, 'home')}
                  className="text-white hover:text-gold transition-colors font-inter text-sm">

                  Home
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={(e) => handleLinkClick(e, 'home')}
                  className="text-white hover:text-gold transition-colors font-inter text-sm">

                  About Event
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={(e) => handleLinkClick(e, 'booth-selection')}
                  className="text-white hover:text-gold transition-colors font-inter text-sm">

                  Booth Selection
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={(e) => handleLinkClick(e, 'contact')}
                  className="text-white hover:text-gold transition-colors font-inter text-sm">

                  Contact
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold font-poppins mb-6 text-white">
              Registration
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="#"
                  onClick={(e) => handleLinkClick(e, 'exhibitor-registration')}
                  className="text-white hover:text-gold transition-colors font-inter text-sm">

                  Register as Exhibitor
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={(e) => handleLinkClick(e, 'sponsor-registration')}
                  className="text-white hover:text-gold transition-colors font-inter text-sm">

                  Become a Sponsor
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-bold font-poppins mb-6 text-white">
              Contact Us
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPinIcon className="h-5 w-5 text-gold mr-3 mt-0.5 flex-shrink-0" />
                <span className="text-gray-400 font-inter text-sm">
                  University of Eldoret, Main Campus
                  <br />
                  P.O. Box 1125-30100
                  <br />
                  Eldoret, Kenya
                </span>
              </li>
              <li className="flex items-center">
                <PhoneIcon className="h-5 w-5 text-gold mr-3 flex-shrink-0" />
                <span className="text-gray-400 font-inter text-sm">
                  +254 (0) 123 456 789
                </span>
              </li>
              <li className="flex items-center">
                <MailIcon className="h-5 w-5 text-gold mr-3 flex-shrink-0" />
                <a
                  href="mailto:tradefair@uoeld.ac.ke"
                  className="text-white hover:text-gold transition-colors font-inter text-sm">

                  tradefair@uoeld.ac.ke
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 font-inter text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} University of Eldoret –
            Agri-Business Trade Fair. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>);

}