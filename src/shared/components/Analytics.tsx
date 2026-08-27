import { useEffect } from "react"
import { useLocation } from "react-router";

declare global {
    interface Window {
      gtag: (...args: any[]) => void;
    }
  }

export const Analytics = () => {
    const location = useLocation()

    useEffect(() => {
        const GA_MEASUREMENT_ID = import.meta.env.VITE_GTAG_ID;

        if (GA_MEASUREMENT_ID && typeof window.gtag === 'function' && import.meta.env.PROD) {
            window.gtag('event', 'page_view', {
                page_title: document.title,
                page_path: location.pathname + location.search,
            });
        }
    }, [location])

  return null;
}
