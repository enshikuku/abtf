"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { MenuIcon, XIcon, ChevronDownIcon, LogInIcon, LogOutIcon, UserIcon } from "lucide-react";

interface AuthUser {
  id: string;
  email: string;
  companyName: string;
  role: string;
}

function Dropdown({
  label,
  items,
  onNavigate,
}: {
  label: string;
  items: { name: string; href: string }[];
  onNavigate?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 text-deepBlue hover:text-maroon transition-colors text-sm font-medium font-inter"
      >
        {label}
        <ChevronDownIcon className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50">
          {items.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => {
                setOpen(false);
                onNavigate?.();
              }}
              className="block px-4 py-2 text-sm text-deepBlue hover:bg-gray-50 hover:text-maroon transition-colors"
            >
              {item.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileDropdowns, setMobileDropdowns] = useState<Record<string, boolean>>({});
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.user) setUser(data.user);
      })
      .catch(() => { });
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setIsMobileMenuOpen(false);
  };

  const toggleMobileDropdown = (key: string) => {
    setMobileDropdowns((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const aboutItems = [
    { name: "About the Event", href: "/about-event" },
    { name: "About the University", href: "/about-university" },
  ];

  const exhibitItems = [
    { name: "Exhibition Categories", href: "/exhibitors" },
    { name: "Booths", href: "/booths" },
    { name: "Sponsors", href: "/sponsors" },
  ];

  const registerItems = [
    { name: "Register as Exhibitor", href: "/register-exhibitor" },
    { name: "Register as Sponsor", href: "/register-sponsor" },
  ];

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? "bg-white shadow-lg py-2" : "bg-white py-4"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/branding/logo/uoe.png"
              alt="University of Eldoret"
              width={160}
              height={48}
              className="h-10 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            <Link
              href="/"
              className="text-deepBlue hover:text-maroon transition-colors text-sm font-medium font-inter"
            >
              Home
            </Link>
            <Dropdown label="About" items={aboutItems} />
            <Dropdown label="Exhibits" items={exhibitItems} />
            <Link
              href="/contact"
              className="text-deepBlue hover:text-maroon transition-colors text-sm font-medium font-inter"
            >
              Contact
            </Link>

            <div className="flex items-center gap-3 ml-2">
              {user ? (
                <>
                  <Dropdown
                    label="Register"
                    items={registerItems}
                  />
                  <span className="text-xs text-gray-500 font-inter flex items-center gap-1">
                    <UserIcon className="h-3.5 w-3.5" />
                    {user.companyName}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 text-sm text-deepBlue hover:text-maroon transition-colors font-medium font-inter"
                  >
                    <LogOutIcon className="h-4 w-4" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Dropdown
                    label="Register"
                    items={registerItems}
                  />
                  <Link
                    href="/login"
                    className="flex items-center gap-1.5 bg-maroon hover:bg-gold text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-300 font-inter"
                  >
                    <LogInIcon className="h-4 w-4" />
                    Login
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-deepBlue hover:text-maroon focus:outline-none"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <XIcon className="h-7 w-7" /> : <MenuIcon className="h-7 w-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden absolute w-full bg-white border-t border-gray-200 shadow-lg transition-all duration-300 ease-in-out ${isMobileMenuOpen ? "max-h-[80vh] opacity-100 py-4 overflow-y-auto" : "max-h-0 opacity-0 overflow-hidden py-0"
          }`}
      >
        <div className="px-4 flex flex-col">
          <Link
            href="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-deepBlue hover:text-maroon py-3 text-base font-medium font-inter border-b border-gray-100"
          >
            Home
          </Link>

          {/* Mobile About Dropdown */}
          <div className="border-b border-gray-100">
            <button
              onClick={() => toggleMobileDropdown("about")}
              className="flex items-center justify-between w-full text-deepBlue hover:text-maroon py-3 text-base font-medium font-inter"
            >
              About
              <ChevronDownIcon
                className={`h-4 w-4 transition-transform ${mobileDropdowns.about ? "rotate-180" : ""}`}
              />
            </button>
            {mobileDropdowns.about && (
              <div className="pl-4 pb-2 space-y-1">
                {aboutItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-gray-600 hover:text-maroon py-2 text-sm font-inter"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Mobile Exhibits Dropdown */}
          <div className="border-b border-gray-100">
            <button
              onClick={() => toggleMobileDropdown("exhibits")}
              className="flex items-center justify-between w-full text-deepBlue hover:text-maroon py-3 text-base font-medium font-inter"
            >
              Exhibits
              <ChevronDownIcon
                className={`h-4 w-4 transition-transform ${mobileDropdowns.exhibits ? "rotate-180" : ""}`}
              />
            </button>
            {mobileDropdowns.exhibits && (
              <div className="pl-4 pb-2 space-y-1">
                {exhibitItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-gray-600 hover:text-maroon py-2 text-sm font-inter"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link
            href="/contact"
            onClick={() => setIsMobileMenuOpen(false)}
            className="text-deepBlue hover:text-maroon py-3 text-base font-medium font-inter border-b border-gray-100"
          >
            Contact
          </Link>

          {/* Mobile Register Dropdown */}
          <div className="border-b border-gray-100">
            <button
              onClick={() => toggleMobileDropdown("register")}
              className="flex items-center justify-between w-full text-deepBlue hover:text-maroon py-3 text-base font-medium font-inter"
            >
              Register
              <ChevronDownIcon
                className={`h-4 w-4 transition-transform ${mobileDropdowns.register ? "rotate-180" : ""}`}
              />
            </button>
            {mobileDropdowns.register && (
              <div className="pl-4 pb-2 space-y-1">
                {registerItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block text-gray-600 hover:text-maroon py-2 text-sm font-inter"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Mobile Auth */}
          <div className="pt-3 space-y-2">
            {user ? (
              <>
                <div className="text-xs text-gray-500 font-inter flex items-center gap-1 py-1">
                  <UserIcon className="h-3.5 w-3.5" />
                  Signed in as {user.companyName}
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-deepBlue hover:text-maroon py-2 text-base font-medium font-inter w-full"
                >
                  <LogOutIcon className="h-4 w-4" />
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 bg-maroon hover:bg-gold text-white px-6 py-3 rounded-md font-medium transition-colors duration-300 font-inter w-full text-center"
              >
                <LogInIcon className="h-4 w-4" />
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
