"use client";

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import SupportWidget from '../support/SupportWidget';

export default function Shell({ children }) {
  const pathname = usePathname();
  const isAdminPath = pathname?.startsWith('/admin');

  useEffect(() => {
    // Temporary debugging aid: append ?tapdebug=1 to see which element receives taps.
    // This helps detect invisible overlays blocking clicks on mobile.
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    if (params.get('tapdebug') !== '1') return;

    let lastAlertAt = 0;
    const handler = (e) => {
      const now = Date.now();
      if (now - lastAlertAt < 1200) return; // throttle
      lastAlertAt = now;

      const x = e?.clientX;
      const y = e?.clientY;
      const topEl = (typeof x === 'number' && typeof y === 'number')
        ? document.elementFromPoint(x, y)
        : null;
      const el = topEl || e.target;

      const tag = el?.tagName || '(unknown)';
      const id = el?.id ? `#${el.id}` : '';
      const cls = typeof el?.className === 'string' && el.className.trim()
        ? `.${el.className.trim().replace(/\s+/g, '.')}`
        : '';

      let extra = '';
      if (el?.getAttribute) {
        const ariaHidden = el.getAttribute('aria-hidden');
        const role = el.getAttribute('role');
        if (ariaHidden != null) extra += ` aria-hidden=${ariaHidden}`;
        if (role) extra += ` role=${role}`;
      }

      window.alert(`Tap landed on: ${tag}${id}${cls}${extra}`);
    };

    window.addEventListener('pointerdown', handler, { capture: true });
    return () => window.removeEventListener('pointerdown', handler, { capture: true });
  }, []);

  return (
    <>
      {!isAdminPath && <Navbar />}
      <main className="flex-1">{children}</main>
      {!isAdminPath && <Footer />}
      {!isAdminPath && <SupportWidget />}
    </>
  );
}
