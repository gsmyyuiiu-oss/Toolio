import React from 'react';
import {
  Wrench,
  ShieldCheck,
  Zap,
  Globe2,
  Lock,
  Heart,
} from 'lucide-react';
import { TOOL_CATEGORIES } from '../../data/categories';
import { useTranslation } from '../../i18n/useTranslation';

interface FooterProps {
  onNavigateCategory: (slug: string) => void;
  onNavigateLegal: (page: string) => void;
  onNavigateHome: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigateCategory,
  onNavigateLegal,
  onNavigateHome,
}) => {
  const { t } = useTranslation();

  return (
    <footer id="footer" className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 text-sm mt-16 transition-colors">
      {/* Top Value Badges Bar */}
      <div className="border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-left">
            <div className="flex items-center gap-3 p-2 rounded-xl bg-white/60 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-800/60">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200 truncate">
                  100% Client-Side Privacy
                </h4>
                <p className="text-[11px] text-slate-500">
                  Files processed in browser. Never stored.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2 rounded-xl bg-white/60 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-800/60">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200 truncate">
                  Zero Signup Barrier
                </h4>
                <p className="text-[11px] text-slate-500">
                  No account, credit card, or paywall.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2 rounded-xl bg-white/60 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-800/60">
              <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                <Globe2 className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200 truncate">
                  100+ Global Languages
                </h4>
                <p className="text-[11px] text-slate-500">
                  Localized for worldwide accessibility.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2 rounded-xl bg-white/60 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-800/60">
              <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h4 className="font-bold text-xs sm:text-sm text-slate-800 dark:text-slate-200 truncate">
                  Sub-Second Speed
                </h4>
                <p className="text-[11px] text-slate-500">
                  Instant reactivity with Web Workers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand info */}
          <div className="col-span-1 sm:col-span-2 space-y-4">
            <button
              type="button"
              onClick={onNavigateHome}
              className="flex items-center gap-2.5 text-left group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
                <Wrench className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-xl text-slate-900 dark:text-white">
                Toolio
              </span>
            </button>
            <p className="text-xs sm:text-sm leading-relaxed text-slate-500 dark:text-slate-400 max-w-sm">
              Toolio is a universal online utility toolbox designed for speed, simplicity, and complete user privacy. 
              Search, open a tool, complete your task, copy your result, and leave.
            </p>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                All Systems Operational
              </span>
              <span>•</span>
              <span>Client-Side Privacy Edge Ready</span>
            </div>
          </div>

          {/* Category columns for internal linking */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-3">
              Categories
            </h4>
            <ul className="space-y-2 text-xs">
              {TOOL_CATEGORIES.slice(0, 6).map((cat) => (
                <li key={cat.id}>
                  <button
                    type="button"
                    onClick={() => onNavigateCategory(cat.slug)}
                    className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-left"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-3">
              More Categories
            </h4>
            <ul className="space-y-2 text-xs">
              {TOOL_CATEGORIES.slice(6, 12).map((cat) => (
                <li key={cat.id}>
                  <button
                    type="button"
                    onClick={() => onNavigateCategory(cat.slug)}
                    className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-left"
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal and Webmaster */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-3">
              Legal &amp; Webmaster
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateLegal('privacy-policy')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  {t.legalPrivacy}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateLegal('terms')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  {t.legalTerms}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateLegal('cookie-policy')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  {t.legalCookies}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateLegal('disclaimer')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  {t.legalDisclaimer}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateLegal('about')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  {t.aboutToolio}
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigateLegal('contact')}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                >
                  {t.contact}
                </button>
              </li>
              <li>
                <a
                  href="/sitemap.xml"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors inline-flex items-center gap-1"
                >
                  <span>Sitemap (XML)</span>
                </a>
              </li>
              <li>
                <a
                  href="/robots.txt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors inline-flex items-center gap-1"
                >
                  <span>Robots.txt</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-12 pt-6 border-t border-slate-100 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 text-center sm:text-left">
          <p className="break-words">© {new Date().getFullYear()} Toolio. Built for maximum speed and privacy. All rights reserved.</p>
          <p className="flex items-center gap-1 text-center sm:text-right">
            <span>Free online utilities powered by in-browser Web APIs</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
