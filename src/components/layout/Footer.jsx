import React from 'react';
import { Link } from 'react-router-dom';
import { Github, Twitter, Linkedin, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-luxury-cream-100 dark:bg-luxury-purple-900 border-t border-luxury-cream-200/60 dark:border-luxury-purple-800/80 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Logo & Description */}
          <div className="flex flex-col gap-4 md:col-span-1">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-luxury-purple-700 flex items-center justify-center text-white font-bold text-sm">
                SR
              </div>
              <span className="font-serif text-lg font-bold tracking-tight text-luxury-purple-950 dark:text-white">
                SheRise<span className="text-luxury-purple-500 font-sans font-bold">.AI</span>
              </span>
            </Link>
            <p className="text-sm font-sans leading-relaxed text-luxury-purple-800/70 dark:text-luxury-cream-100/60">
              AI-Powered Career Intelligence Platform empowering women in STEM to discover, transition, and grow in their dream technology fields.
            </p>
          </div>

          {/* Column 2 - Platform Modules */}
          <div>
            <h4 className="text-xs font-bold tracking-widest uppercase text-luxury-purple-900 dark:text-luxury-peach mb-4 font-sans">
              Platform Features
            </h4>
            <ul className="flex flex-col gap-2.5 text-sm font-medium">
              <li>
                <span className="text-luxury-purple-800/70 dark:text-luxury-cream-100/60 hover:text-luxury-purple-600 dark:hover:text-luxury-peach cursor-pointer transition-colors">
                  AI Career Roadmaps
                </span>
              </li>
              <li>
                <span className="text-luxury-purple-800/70 dark:text-luxury-cream-100/60 hover:text-luxury-purple-600 dark:hover:text-luxury-peach cursor-pointer transition-colors">
                  Skill-Gap Analysis
                </span>
              </li>
              <li>
                <span className="text-luxury-purple-800/70 dark:text-luxury-cream-100/60 hover:text-luxury-purple-600 dark:hover:text-luxury-peach cursor-pointer transition-colors">
                  Opportunity Hub
                </span>
              </li>
              <li>
                <span className="text-luxury-purple-800/70 dark:text-luxury-cream-100/60 hover:text-luxury-purple-600 dark:hover:text-luxury-peach cursor-pointer transition-colors">
                  AI Interview Coach
                </span>
              </li>
            </ul>
          </div>

          {/* Column 3 - STEM Resources */}
          <div>
            <h4 className="text-xs font-bold tracking-widest uppercase text-luxury-purple-900 dark:text-luxury-peach mb-4 font-sans">
              STEM Resources
            </h4>
            <ul className="flex flex-col gap-2.5 text-sm font-medium">
              <li>
                <span className="text-luxury-purple-800/70 dark:text-luxury-cream-100/60 hover:text-luxury-purple-600 dark:hover:text-luxury-peach cursor-pointer transition-colors">
                  STEM Scholarships
                </span>
              </li>
              <li>
                <span className="text-luxury-purple-800/70 dark:text-luxury-cream-100/60 hover:text-luxury-purple-600 dark:hover:text-luxury-peach cursor-pointer transition-colors">
                  Women Hackathons
                </span>
              </li>
              <li>
                <span className="text-luxury-purple-800/70 dark:text-luxury-cream-100/60 hover:text-luxury-purple-600 dark:hover:text-luxury-peach cursor-pointer transition-colors">
                  Mentorship Programs
                </span>
              </li>
            </ul>
          </div>

          {/* Column 4 - Connect */}
          <div>
            <h4 className="text-xs font-bold tracking-widest uppercase text-luxury-purple-900 dark:text-luxury-peach mb-4 font-sans">
              Connect With Us
            </h4>
            <div className="flex gap-4 mb-4">
              <a
                href="#"
                className="w-9 h-9 rounded-xl bg-luxury-cream-200 hover:bg-luxury-cream-300 dark:bg-luxury-purple-800 dark:hover:bg-luxury-purple-700 text-luxury-purple-900 dark:text-luxury-cream-100 flex items-center justify-center transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={16} />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-xl bg-luxury-cream-200 hover:bg-luxury-cream-300 dark:bg-luxury-purple-800 dark:hover:bg-luxury-purple-700 text-luxury-purple-900 dark:text-luxury-cream-100 flex items-center justify-center transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin size={16} />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-xl bg-luxury-cream-200 hover:bg-luxury-cream-300 dark:bg-luxury-purple-800 dark:hover:bg-luxury-purple-700 text-luxury-purple-900 dark:text-luxury-cream-100 flex items-center justify-center transition-colors"
                aria-label="GitHub"
              >
                <Github size={16} />
              </a>
            </div>
            <p className="text-xs font-medium text-luxury-purple-800/60 dark:text-luxury-cream-100/50">
              Vibe2Vision 2026 Hackathon
            </p>
          </div>
        </div>

        <hr className="border-luxury-cream-200/50 dark:border-luxury-purple-850/80 my-10" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-medium text-luxury-purple-800/60 dark:text-luxury-cream-100/55">
          <span>&copy; {new Date().getFullYear()} SheRise AI. All rights reserved.</span>
          <span className="flex items-center gap-1">
            Made with <Heart size={12} className="text-red-400 fill-red-400 animate-pulse" /> by Team YuktiNexus
          </span>
        </div>
      </div>
    </footer>
  );
};
