'use client';

import Link from 'next/link';
import { Language } from '@/i18n/config';
import { translations } from '@/i18n/translations';

interface FooterProps {
  lang: Language;
}

export default function Footer({ lang }: FooterProps) {
  const t = translations[lang];

  const links = [
    { label: t.docs, href: '/docs' },
    { label: t.security, href: '/security' },
    { label: t.accessibility, href: '/accessibility' },
    { label: t.privacyPolicy, href: '/privacy' },
    { label: t.termsOfService, href: '/terms' },
  ];

  return (
    <footer className="bg-[#0a1f3d] text-white py-12 border-t-4 border-[#16357a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-[#d4af37] to-[#27487f] rounded-lg flex items-center justify-center">
                <span className="text-[#0a1f3d] font-bold text-sm">Q</span>
              </div>
              <span className="font-bold text-lg">QalNet</span>
            </div>
            <p className="text-white/60 text-sm">{t.madeWith}</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">{t.documentation}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/docs" className="text-white/60 hover:text-[#d4af37] transition-colors">
                  {t.docs}
                </Link>
              </li>
              <li>
                <Link href="/architecture" className="text-white/60 hover:text-[#d4af37] transition-colors">
                  {t.architecture}
                </Link>
              </li>
              <li>
                <Link href="/roadmap" className="text-white/60 hover:text-[#d4af37] transition-colors">
                  {t.roadmap}
                </Link>
              </li>
            </ul>
          </div>

          {/* Security & Compliance */}
          <div>
            <h3 className="font-semibold mb-4">{t.security}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/security" className="text-white/60 hover:text-[#d4af37] transition-colors">
                  {t.security}
                </Link>
              </li>
              <li>
                <Link href="/accessibility" className="text-white/60 hover:text-[#d4af37] transition-colors">
                  {t.accessibility}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-white/60 hover:text-[#d4af37] transition-colors">
                  {t.privacyPolicy}
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4">{t.support}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/faq" className="text-white/60 hover:text-[#d4af37] transition-colors">
                  {t.faq}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-white/60 hover:text-[#d4af37] transition-colors">
                  {t.contactUs}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#16357a] pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-white/60 text-sm">{t.copyright}</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="text-white/60 hover:text-[#d4af37] transition-colors">
              Twitter
            </a>
            <a href="#" className="text-white/60 hover:text-[#d4af37] transition-colors">
              GitHub
            </a>
            <a href="#" className="text-white/60 hover:text-[#d4af37] transition-colors">
              LinkedIn
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
