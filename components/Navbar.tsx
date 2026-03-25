"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MenuIcon, XIcon, LogInIcon, LogOutIcon, LayoutDashboardIcon } from "lucide-react";

interface AuthUser {
  id: string;
  email: string;
  companyName: string;
  role: string;
}

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
    window.location.href = "/";
  };

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
            {!user && (
              <>
                <Link
                  href="/"
                  className="text-deepBlue hover:text-maroon transition-colors text-sm font-medium font-inter"
                >
                  Home
                </Link>
                <Link
                  href="/about-event"
                  className="text-deepBlue hover:text-maroon transition-colors text-sm font-medium font-inter"
                >
                  About Event
                </Link>
                <Link
                  href="/about-university"
                  className="text-deepBlue hover:text-maroon transition-colors text-sm font-medium font-inter"
                >
                  About University
                </Link>
                <Link
                  href="/exhibitors"
                  className="text-deepBlue hover:text-maroon transition-colors text-sm font-medium font-inter"
                >
                  Exhibitors
                </Link>
                <Link
                  href="/sponsors"
                  className="text-deepBlue hover:text-maroon transition-colors text-sm font-medium font-inter"
                >
                  Sponsors
                </Link>
                <Link
                  href="/contact"
                  className="text-deepBlue hover:text-maroon transition-colors text-sm font-medium font-inter"
                >
                  Contact
                </Link>
                <Link
                  href="/attendee-registration"
                  className="text-deepBlue hover:text-maroon transition-colors text-sm font-medium font-inter"
                >
                  Attendees
                </Link>
                <Link
                  href="/feedback"
                  className="text-deepBlue hover:text-maroon transition-colors text-sm font-medium font-inter"
                >
                  Feedback
                </Link>
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 bg-maroon hover:bg-gold text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-300 font-inter"
                >
                  <LogInIcon className="h-4 w-4" />
                  Login
                </Link>
              </>
            )}

            {user && user.role !== "ADMIN" && (
              <>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-1.5 text-deepBlue hover:text-maroon transition-colors text-sm font-medium font-inter"
                >
                  <LayoutDashboardIcon className="h-4 w-4" />
                  Dashboard
                </Link>
                <Link
                  href="/booths"
                  className="text-deepBlue hover:text-maroon transition-colors text-sm font-medium font-inter"
                >
                  Reserve Booths
                </Link>
                <Link
                  href="/invoice-preview"
                  className="text-deepBlue hover:text-maroon transition-colors text-sm font-medium font-inter"
                >
                  Invoice
                </Link>
                <Link
                  href="/contact"
                  className="text-deepBlue hover:text-maroon transition-colors text-sm font-medium font-inter"
                >
                  Contact
                </Link>
                <Link
                  href="/feedback"
                  className="text-deepBlue hover:text-maroon transition-colors text-sm font-medium font-inter"
                >
                  Feedback
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-sm text-deepBlue hover:text-maroon transition-colors font-medium font-inter"
                >
                  <LogOutIcon className="h-4 w-4" />
                  Logout
                </button>
              </>
            )}

            {user && user.role === "ADMIN" && (
              <>
                <Link
                  href="/admin"
                  className="flex items-center gap-1.5 text-maroon hover:text-gold transition-colors text-sm font-bold font-inter"
                >
                  <LayoutDashboardIcon className="h-4 w-4" />
                  Admin Dashboard
                </Link>
                <Link
                  href="/admin/booths"
                  className="text-deepBlue hover:text-maroon transition-colors text-sm font-medium font-inter"
                >
                  Booths
                </Link>
                <Link
                  href="/admin/reservations"
                  className="text-deepBlue hover:text-maroon transition-colors text-sm font-medium font-inter"
                >
                  Reservations
                </Link>
                <Link
                  href="/admin/payments"
                  className="text-deepBlue hover:text-maroon transition-colors text-sm font-medium font-inter"
                >
                  Payments
                </Link>
                <Link
                  href="/admin/reports"
                  className="text-deepBlue hover:text-maroon transition-colors text-sm font-medium font-inter"
                >
                  Reports
                </Link>
                <Link
                  href="/admin/exhibitors"
                  className="text-deepBlue hover:text-maroon transition-colors text-sm font-medium font-inter"
                >
                  Exhibitors
                </Link>
                <Link
                  href="/admin/sponsors"
                  className="text-deepBlue hover:text-maroon transition-colors text-sm font-medium font-inter"
                >
                  Sponsors
                </Link>
                <Link
                  href="/admin/invoices"
                  className="text-deepBlue hover:text-maroon transition-colors text-sm font-medium font-inter"
                >
                  Invoices
                </Link>
                <Link
                  href="/admin/users"
                  className="text-deepBlue hover:text-maroon transition-colors text-sm font-medium font-inter"
                >
                  Users
                </Link>
                <Link
                  href="/admin/attendees"
                  className="text-deepBlue hover:text-maroon transition-colors text-sm font-medium font-inter"
                >
                  Attendees
                </Link>
                <Link
                  href="/admin/feedback"
                  className="text-deepBlue hover:text-maroon transition-colors text-sm font-medium font-inter"
                >
                  Feedback
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-sm text-deepBlue hover:text-maroon transition-colors font-medium font-inter"
                >
                  <LogOutIcon className="h-4 w-4" />
                  Logout
                </button>
              </>
            )}
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
          {/* PUBLIC VISITOR */}
          {!user && (
            <>
              <Link
                href="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-deepBlue hover:text-maroon py-3 text-base font-medium font-inter border-b border-gray-100"
              >
                Home
              </Link>
              <Link
                href="/about-event"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-deepBlue hover:text-maroon py-3 text-base font-medium font-inter border-b border-gray-100"
              >
                About Event
              </Link>
              <Link
                href="/about-university"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-deepBlue hover:text-maroon py-3 text-base font-medium font-inter border-b border-gray-100"
              >
                About University
              </Link>
              <Link
                href="/exhibitors"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-deepBlue hover:text-maroon py-3 text-base font-medium font-inter border-b border-gray-100"
              >
                Exhibitors
              </Link>
              <Link
                href="/sponsors"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-deepBlue hover:text-maroon py-3 text-base font-medium font-inter border-b border-gray-100"
              >
                Sponsors
              </Link>
              <Link
                href="/contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-deepBlue hover:text-maroon py-3 text-base font-medium font-inter border-b border-gray-100"
              >
                Contact
              </Link>
              <Link
                href="/attendee-registration"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-deepBlue hover:text-maroon py-3 text-base font-medium font-inter border-b border-gray-100"
              >
                Attendees
              </Link>
              <Link
                href="/feedback"
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-deepBlue hover:text-maroon py-3 text-base font-medium font-inter border-b border-gray-100"
              >
                Feedback
              </Link>
              <div className="pt-3">
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 bg-maroon hover:bg-gold text-white px-6 py-3 rounded-md font-medium transition-colors duration-300 font-inter w-full text-center"
                >
                  <LogInIcon className="h-4 w-4" />
                  Login
                </Link>
              </div>
            </>
          )}

          {/* AUTHENTICATED USER (EXHIBITOR / SPONSOR) */}
          {user && user.role !== "ADMIN" && (
            <div className="space-y-1">
              <Link
                href="/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-deepBlue hover:text-maroon py-3 text-base font-medium font-inter border-b border-gray-100"
              >
                Dashboard
              </Link>
              <Link
                href="/booths"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-deepBlue hover:text-maroon py-3 text-base font-medium font-inter border-b border-gray-100"
              >
                Reserve Booths
              </Link>
              <Link
                href="/invoice-preview"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-deepBlue hover:text-maroon py-3 text-base font-medium font-inter border-b border-gray-100"
              >
                Invoice
              </Link>
              <Link
                href="/contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-deepBlue hover:text-maroon py-3 text-base font-medium font-inter border-b border-gray-100"
              >
                Contact
              </Link>
              <Link
                href="/feedback"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-deepBlue hover:text-maroon py-3 text-base font-medium font-inter border-b border-gray-100"
              >
                Feedback
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-deepBlue hover:text-maroon py-3 text-base font-medium font-inter w-full"
              >
                <LogOutIcon className="h-4 w-4" />
                Logout
              </button>
            </div>
          )}

          {/* ADMIN */}
          {user && user.role === "ADMIN" && (
            <div className="space-y-1">
              <Link
                href="/admin"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-maroon hover:text-gold py-3 text-base font-bold font-inter border-b border-gray-100"
              >
                Admin Dashboard
              </Link>
              <Link
                href="/admin/booths"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-deepBlue hover:text-maroon py-3 text-base font-medium font-inter border-b border-gray-100"
              >
                Booths
              </Link>
              <Link
                href="/admin/reservations"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-deepBlue hover:text-maroon py-3 text-base font-medium font-inter border-b border-gray-100"
              >
                Reservations
              </Link>
              <Link
                href="/admin/payments"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-deepBlue hover:text-maroon py-3 text-base font-medium font-inter border-b border-gray-100"
              >
                Payments
              </Link>
              <Link
                href="/admin/reports"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-deepBlue hover:text-maroon py-3 text-base font-medium font-inter border-b border-gray-100"
              >
                Reports
              </Link>
              <Link
                href="/admin/exhibitors"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-deepBlue hover:text-maroon py-3 text-base font-medium font-inter border-b border-gray-100"
              >
                Exhibitors
              </Link>
              <Link
                href="/admin/sponsors"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-deepBlue hover:text-maroon py-3 text-base font-medium font-inter border-b border-gray-100"
              >
                Sponsors
              </Link>
              <Link
                href="/admin/invoices"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-deepBlue hover:text-maroon py-3 text-base font-medium font-inter border-b border-gray-100"
              >
                Invoices
              </Link>
              <Link
                href="/admin/users"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-deepBlue hover:text-maroon py-3 text-base font-medium font-inter border-b border-gray-100"
              >
                Users
              </Link>
              <Link
                href="/admin/attendees"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-deepBlue hover:text-maroon py-3 text-base font-medium font-inter border-b border-gray-100"
              >
                Attendees
              </Link>
              <Link
                href="/admin/feedback"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-deepBlue hover:text-maroon py-3 text-base font-medium font-inter border-b border-gray-100"
              >
                Feedback
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-deepBlue hover:text-maroon py-3 text-base font-medium font-inter w-full"
              >
                <LogOutIcon className="h-4 w-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
