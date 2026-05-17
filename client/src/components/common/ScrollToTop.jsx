import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// On route change: jump to top (instant — smooth scroll mid-navigation feels
// jarring because the new page hasn't mounted yet).
// If the URL carries a #hash, scroll to that element smoothly after paint so
// the sticky header offset (scroll-padding-top in index.css) is respected.
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      // Wait one frame for the destination page/section to render.
      requestAnimationFrame(() => {
        const el = document.querySelector(hash);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        else window.scrollTo({ top: 0, behavior: 'instant' });
      });
      return;
    }
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;
