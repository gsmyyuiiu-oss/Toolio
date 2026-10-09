import React from 'react';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { SeoManager } from '../seo/SeoManager';
import { ShieldCheck, Mail, FileText, CheckCircle2, Sliders, Cookie } from 'lucide-react';
import { useAds } from '../ads/AdProvider';

interface LegalPageProps {
  pageId: string;
  onNavigateHome: () => void;
}

export const LegalPage: React.FC<LegalPageProps> = ({ pageId, onNavigateHome }) => {
  const { consent, updateConsent, setIsSettingsOpen } = useAds();

  const titles: Record<string, string> = {
    'privacy-policy': 'Privacy Policy',
    terms: 'Terms of Service',
    'cookie-policy': 'Cookie Policy',
    disclaimer: 'Disclaimer',
    about: 'About Toolio',
    contact: 'Contact Us',
  };

  const currentTitle = titles[pageId] || 'Policy';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      <SeoManager
        title={`${currentTitle} — Toolio Online Tools`}
        description={`Read the official ${currentTitle} for Toolio. Free, privacy-first universal utility platform.`}
        canonicalPath={`/${pageId}`}
      />

      <Breadcrumb
        items={[
          { label: 'Home', onClick: onNavigateHome },
          { label: currentTitle },
        ]}
      />

      <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-6 text-sm text-slate-700 dark:text-slate-300 leading-relaxed shadow-xs">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white">
          {currentTitle}
        </h1>

        {pageId === 'privacy-policy' && (
          <div className="space-y-4">
            <p>
              Last Updated: October 2026. At <strong>Toolio</strong>, your privacy is our foundational product principle. Unlike other utility platforms, Toolio is architected so that all core file manipulations, calculations, image compressions, and developer transforms occur <strong>locally inside your browser engine</strong>.
            </p>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white pt-2">
              1. Information We Do NOT Collect
            </h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>We never upload, inspect, or store your photos, PDFs, or files.</li>
              <li>We never ask for your email address, passwords, or credit card info.</li>
              <li>We do not record private text snippets, code blocks, or calculation numbers.</li>
            </ul>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white pt-2">
              2. Browser Storage (localStorage)
            </h3>
            <p>
              We only use your browser’s local storage to save your user preferences (such as selected language, dark/light theme, pinned favorite tools, and recent tool shortcuts). This data never leaves your device.
            </p>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white pt-2">
              3. Advertising &amp; Third-Party Services
            </h3>
            <p>
              Toolio displays polite, non-intrusive advertisements to keep all utilities completely free without requiring accounts or user subscriptions. Advertisers may use standard anonymous cookies to deliver relevant ads in accordance with industry standards.
            </p>

            <div className="mt-4 p-4 rounded-2xl bg-indigo-50/50 dark:bg-slate-800/60 border border-indigo-100 dark:border-slate-700 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                    Advertising &amp; Cookie Consent Management
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Current Status: <span className="font-bold text-indigo-600 dark:text-indigo-400 capitalize">{consent === 'granted' ? 'Personalized Advertising Permitted' : consent === 'denied' ? 'Non-Essential Advertising Blocked' : 'Default / Pending'}</span>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsSettingsOpen(true)}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors cursor-pointer"
                  >
                    Manage Choices
                  </button>
                  {consent === 'granted' && (
                    <button
                      type="button"
                      onClick={() => updateConsent('denied')}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
                    >
                      Withdraw Consent
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {pageId === 'terms' && (
          <div className="space-y-4">
            <p>
              By accessing and using <strong>Toolio</strong> (toolio.pages.dev), you agree to comply with and be bound by these Terms of Service.
            </p>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white pt-2">
              1. Free Usage
            </h3>
            <p>
              All online tools provided on Toolio are free for both personal and commercial use without requiring registration or subscription fees.
            </p>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white pt-2">
              2. Acceptable Use
            </h3>
            <p>
              You agree not to attempt to disrupt, exploit, or launch denial-of-service attacks against our platform or automated edge infrastructure.
            </p>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white pt-2">
              3. Disclaimer of Warranties
            </h3>
            <p>
              All tools and calculated results are provided "as is" without warranty of any kind. You should verify important financial, medical, or tax calculations before making critical decisions.
            </p>
          </div>
        )}

        {pageId === 'cookie-policy' && (
          <div className="space-y-4">
            <p>
              This Cookie Policy explains how Toolio uses browser storage technologies.
            </p>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white pt-2">
              1. Essential Preferences
            </h3>
            <p>
              We store your selected theme (light/dark) and language preferences in browser localStorage. These are essential for providing a seamless interface.
            </p>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white pt-2">
              2. Third-Party Advertising Cookies
            </h3>
            <p>
              Advertising partners serve non-intrusive advertisements to help keep all utilities free. You can customize your cookie consent or withdraw consent for personalized advertising at any time below.
            </p>

            <div className="mt-4 p-4 rounded-2xl bg-indigo-50/50 dark:bg-slate-800/60 border border-indigo-100 dark:border-slate-700 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                    Manage Your Cookie Preferences
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Current Status: <span className="font-bold text-indigo-600 dark:text-indigo-400 capitalize">{consent === 'granted' ? 'Personalized Advertising Permitted' : consent === 'denied' ? 'Non-Essential Advertising Blocked' : 'Default / Pending'}</span>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsSettingsOpen(true)}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition-colors cursor-pointer"
                  >
                    Change Preferences
                  </button>
                  {consent === 'granted' && (
                    <button
                      type="button"
                      onClick={() => updateConsent('denied')}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
                    >
                      Withdraw Consent
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {pageId === 'disclaimer' && (
          <div className="space-y-4">
            <p>
              The calculators, converters, and tools available on Toolio are intended for informational, educational, and productivity purposes only.
            </p>
            <p>
              While we strive for absolute mathematical precision, Toolio is not a licensed financial advisor, medical professional, or tax authority. For high-stakes legal, medical, or accounting matters, always consult a licensed professional.
            </p>
          </div>
        )}

        {pageId === 'about' && (
          <div className="space-y-4">
            <p>
              <strong>Toolio</strong> was built to solve a simple problem: the internet needed a clean, ultra-fast, and trustworthy toolbox where anyone can quickly solve everyday digital problems without jumping through paywalls, registrations, or shady download traps.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <h4 className="font-bold text-slate-900 dark:text-white mb-1">200+ Free Tools</h4>
                <p className="text-xs text-slate-500">From percentage calculators and QR code generators to image compressors and developer utilities.</p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <h4 className="font-bold text-slate-900 dark:text-white mb-1">Global &amp; Fast</h4>
                <p className="text-xs text-slate-500">Accessible in 100+ languages, hosted globally on edge networks, and built with modern React &amp; TypeScript.</p>
              </div>
            </div>
          </div>
        )}

        {pageId === 'contact' && (
          <div className="space-y-4">
            <p>
              Have a tool suggestion, found a bug, or want to partner with us? We'd love to hear from you!
            </p>
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-3">
              <Mail className="w-5 h-5 text-indigo-500" />
              <div>
                <span className="text-xs text-slate-500 block">Official Support Email:</span>
                <span className="font-mono font-bold text-slate-900 dark:text-white text-sm">ayushkumarm716@gmail.com</span>
              </div>
            </div>
            <p className="text-xs text-slate-400">
              We usually reply within 24–48 business hours.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
