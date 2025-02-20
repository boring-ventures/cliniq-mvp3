"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Brain } from "lucide-react";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-2">
            <Brain className="h-8 w-8 text-primary" />
            <Link href="/" className="text-2xl font-bold text-primary">
              POSITIVE-Next
            </Link>
          </div>
          <nav className="hidden md:flex space-x-8">
            <Link
              href="/#features"
              className="text-foreground hover:text-primary transition-colors"
            >
              Features
            </Link>
            <Link
              href="/#about"
              className="text-foreground hover:text-primary transition-colors"
            >
              About
            </Link>
            <Link
              href="/#testimonials"
              className="text-foreground hover:text-primary transition-colors"
            >
              Testimonials
            </Link>
          </nav>
          <div className="hidden md:flex space-x-4">
            <Link
              href="/signin"
              className="text-primary hover:text-primary-foreground hover:bg-primary px-4 py-2 rounded-md transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
            >
              Sign Up
            </Link>
          </div>
          <div className="md:hidden">
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-foreground"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      {isMenuOpen && (
        <div className="md:hidden bg-background">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link
              href="/#features"
              className="block px-3 py-2 text-foreground hover:text-primary transition-colors"
            >
              Features
            </Link>
            <Link
              href="/#about"
              className="block px-3 py-2 text-foreground hover:text-primary transition-colors"
            >
              About
            </Link>
            <Link
              href="/#testimonials"
              className="block px-3 py-2 text-foreground hover:text-primary transition-colors"
            >
              Testimonials
            </Link>
            <Link
              href="/signin"
              className="block px-3 py-2 text-primary hover:text-primary-foreground hover:bg-primary rounded-md transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="block px-3 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Sign Up
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
