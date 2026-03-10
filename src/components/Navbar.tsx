import React, { useEffect, useState } from 'react';
import { MenuIcon, XIcon, GraduationCapIcon } from 'lucide-react';
import { useRouter } from './RouterContext';
export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { currentPage, navigateTo } = useRouter();
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const navLinks = [
  {
    name: 'Home',
    href: '#home',
    page: 'home'
  },
  {
    name: 'About Event',
    href: '#about-event',
    page: 'home'
  },
  {
    name: 'About University',
    href: '#about-university',
    page: 'home'
  },
  {
    name: 'Exhibition Categories',
    href: '#exhibitors',
    page: 'home'
  },
  {
    name: 'Booths',
    href: '#',
    page: 'booth-selection'
  },
  {
    name: 'Sponsors',
    href: '#sponsors',
    page: 'home'
  },
  {
    name: 'Register',
    href: '#',
    page: 'exhibitor-registration'
  },
  {
    name: 'Contact',
    href: '#',
    page: 'contact'
  }];

  const handleNavClick = (
  e: React.MouseEvent<HTMLAnchorElement>,
  href: string,
  page: string) =>
  {
    e.preventDefault();
    if (page && page !== currentPage) {
      navigateTo(page);
    }
    if (href.startsWith('#') && href !== '#') {
      if (currentPage !== 'home') {
        setTimeout(() => {
          const element = document.querySelector(href);
          if (element)
          element.scrollIntoView({
            behavior: 'smooth'
          });
        }, 100);
      } else {
        const element = document.querySelector(href);
        if (element)
        element.scrollIntoView({
          behavior: 'smooth'
        });
      }
    }
    setIsMobileMenuOpen(false);
  };
  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-deepBlue shadow-lg py-3' : 'bg-deepBlue py-5'}`}>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo and Title */}
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigateTo('home')}>

            <div className="bg-white p-2 rounded-full">
              <GraduationCapIcon className="h-6 w-6 text-deepBlue" />
            </div>
            <div className="flex flex-col">
              <span className="text-white font-poppins font-bold text-lg leading-tight hidden sm:block">
                University of Eldoret
              </span>
              <span className="text-gold font-poppins font-semibold text-sm sm:text-base leading-tight">
                Agri-Business Trade Fair
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            <ul className="flex space-x-6">
              {navLinks.map((link) =>
              <li key={link.name}>
                  <a
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href, link.page)}
                  className="text-white hover:text-gold transition-colors text-sm font-medium font-inter">

                    {link.name}
                  </a>
                </li>
              )}
            </ul>
            <button
              onClick={() => navigateTo('exhibitor-registration')}
              className="bg-maroon hover:bg-gold text-white px-6 py-2 rounded-md font-medium transition-colors duration-300 font-inter">

              Register Now
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white hover:text-gold focus:outline-none"
              aria-label="Toggle mobile menu">

              {isMobileMenuOpen ?
              <XIcon className="h-7 w-7" /> :

              <MenuIcon className="h-7 w-7" />
              }
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden absolute w-full bg-deepBlue border-t border-white/10 transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'max-h-screen opacity-100 py-4' : 'max-h-0 opacity-0 overflow-hidden py-0'}`}>

        <div className="px-4 space-y-3 flex flex-col">
          {navLinks.map((link) =>
          <a
            key={link.name}
            href={link.href}
            onClick={(e) => handleNavClick(e, link.href, link.page)}
            className="text-white hover:text-gold block py-2 text-base font-medium font-inter border-b border-white/5">

              {link.name}
            </a>
          )}
          <button
            onClick={() => {
              navigateTo('exhibitor-registration');
              setIsMobileMenuOpen(false);
            }}
            className="bg-maroon hover:bg-gold text-white px-6 py-3 rounded-md font-medium transition-colors duration-300 font-inter w-full mt-4">

            Register Now
          </button>
        </div>
      </div>
    </nav>);

}