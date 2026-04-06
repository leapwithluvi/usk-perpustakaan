import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Komponen untuk mereset posisi scroll ke atas setiap kali rute berubah
 * dan mematikan fitur scroll restoration bawaan browser.
 */
export function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Matikan fitur scroll restoration bawaan browser
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    // Reset posisi scroll ke paling atas
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
