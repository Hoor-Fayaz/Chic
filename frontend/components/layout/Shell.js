"use client";

import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import SupportWidget from '../support/SupportWidget';

export default function Shell({ children }) {
  const pathname = usePathname();
  const isAdminPath = pathname?.startsWith('/admin');

  const tapDebugEnabled = useMemo(() => {
    if (typeof window === 'undefined') return false;
    try {
      return new URLSearchParams(window.location.search).get('tapdebug') === '1';
    } catch {
      return false;
    }
  }, []);

  const [tapDebugText, setTapDebugText] = useState('');

  useEffect(() => {
    if (!tapDebugEnabled) return;

    let lastOutlined = null;
    let lastAt = 0;

    const handler = (e) => {
      const now = Date.now();
      if (now - lastAt < 150) return; // reduce spam
      lastAt = now;

      const x = e?.clientX;
      const y = e?.clientY;
      const el = (typeof x === 'number' && typeof y === 'number')
        ? document.elementFromPoint(x, y)
        : e.target;

      if (!el) return;

      const tag = el.tagName || '(unknown)';
      const id = el.id ? `#${el.id}` : '';
      const cls = typeof el.className === 'string' && el.className.trim()
        ? `.${el.className.trim().replace(/\s+/g, '.')}`
        : '';

      let extra = '';
      if (el.getAttribute) {
        const ariaHidden = el.getAttribute('aria-hidden');
        const role = el.getAttribute('role');
        if (ariaHidden != null) extra += ` aria-hidden=${ariaHidden}`;
        if (role) extra += ` role=${role}`;
      }

      setTapDebugText(`${tag}${id}${cls}${extra}`);

      if (lastOutlined && lastOutlined !== el) {
        lastOutlined.style.outline = '';
        lastOutlined.style.outlineOffset = '';
      }
      el.style.outline = '3px solid rgba(255,0,0,0.9)';
      el.style.outlineOffset = '2px';
      lastOutlined = el;
    };

    window.addEventListener('pointerdown', handler, { capture: true });
    return () => {
      window.removeEventListener('pointerdown', handler, { capture: true });
      if (lastOutlined) {
        lastOutlined.style.outline = '';
        lastOutlined.style.outlineOffset = '';
      }
    };
  }, [tapDebugEnabled]);

  return (
    <>
      {tapDebugEnabled && (
        <div className="fixed top-0 left-0 right-0 z-[10000] bg-red-600 text-white text-[11px] font-mono px-3 py-2">
          Tap debug: {tapDebugText || '(tap anywhere)'}
        </div>
      )}
      {!isAdminPath && <Navbar />}
      <main className="flex-1">{children}</main>
      {!isAdminPath && <Footer />}
      {!isAdminPath && <SupportWidget />}
    </>
  );
}
