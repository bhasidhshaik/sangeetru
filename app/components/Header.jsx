"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import logo from "@/public/Assests/logo-bw.jpg";
import { FiMenu, FiX } from "react-icons/fi";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { link: "/", text: "Home" },
    { link: "/submit", text: "Submit" },
    { link: "/history", text: "History" },
  ];

  return (
    <header className="bg-white p-4 border-b border-gray-200 z-50 relative">
      <div className="flex justify-between items-center max-w-[1200px] mx-auto">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/">
            <Image
              draggable={false}
              src={logo}
              alt="SangeeTru"
              width={150}
              height={100}
              priority
            />
          </Link>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:block">
          <ul className="flex items-center gap-x-8">
            {navLinks.map((link) => (
              <li key={link.link}>
                <Link
                  href={link.link}
                  className="text-gray-700 font-medium hover:text-blue-600 transition-colors"
                >
                  {link.text}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Mobile Hamburger */}
        <div className="md:hidden">
          <button
            onClick={() => setIsMenuOpen(true)}
            className="text-2xl text-gray-800"
            aria-label="Open Menu"
          >
            <FiMenu />
          </button>
        </div>
      </div>

      {/* Fullscreen Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-white z-50 flex flex-col items-end p-6 transition-all duration-300">
          <button
            onClick={() => setIsMenuOpen(false)}
            className="text-3xl text-gray-700 mb-6"
            aria-label="Close Menu"
          >
            <FiX />
          </button>

          <ul className="w-full text-right space-y-6 text-lg pr-4 flex flex-col justify-center items-center">
            {navLinks.map((link) => (
              <li key={link.link}>
                <Link
                  href={link.link}
                  className="text-gray-800 hover:text-blue-600 font-medium transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.text}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;
