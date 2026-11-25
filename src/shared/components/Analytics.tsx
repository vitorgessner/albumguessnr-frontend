import { useEffect } from "react"
import { useLocation } from "react-router";

declare global {
    interface Window {
      gtag: (...args: any[]) => void;
    }
  }

const SENSITIVE_PATH_PATTERNS = [
    /^\/auth\/passwordChange(?:\/|$)/,
    /^\/verify(?:\/|$)/,
];

const SENSITIVE_QUERY_PARAMETERS = new Set([
    'token',
    'passwordResetToken',
    'password',
    'code',
    'access_token',
    'id_token',
    'api_key',
    'key',
    'secret',
    'authorization',
]);

const getSafeAnalyticsPath = (pathname: string, search: string): string | null => {
    if (SENSITIVE_PATH_PATTERNS.some((pattern) => pattern.test(pathname))) {
        return null;
    }

    const searchParams = new URLSearchParams(search);
    SENSITIVE_QUERY_PARAMETERS.forEach((parameter) => searchParams.delete(parameter));

    const safeSearch = searchParams.toString();
    return safeSearch ? `${pathname}?${safeSearch}` : pathname;
};

export const Analytics = () => {
    const location = useLocation()

    useEffect(() => {
        const GA_MEASUREMENT_ID = import.meta.env.VITE_GTAG_ID;

        if (GA_MEASUREMENT_ID && typeof window.gtag === 'function' && import.meta.env.PROD) {
            const safePath = getSafeAnalyticsPath(location.pathname, location.search);

            if (safePath) {
                window.gtag('event', 'page_view', {
                    page_title: document.title,
                    page_path: safePath,
                });
            }
        }
    }, [location])

  return null;
}
