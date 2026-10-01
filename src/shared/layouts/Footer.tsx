import useUser from '@/features/auth/hooks/useUser';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router';

export const Footer = () => {
    const { data: user } = useUser();
    return (
        <footer className="border-t-3 border-border bg-card py-6 px-6 text-center">
            <div className="max-w-md mx-auto space-y-4">
                {(user && user.isGuest || !user && (document.title !== 'Register' && document.title !== 'Login')) && <div>
                    <p className="font-heading font-black text-xl text-navy mb-3">
                        Ready to test your musical knowledge?
                    </p>
                    <Link
                        to="/auth/register"
                        className="inline-flex items-center gap-2 px-6 py-3 font-heading font-black text-sm text-white bg-sage-dark border-2 border-navy rounded-lg shadow-[3px_3px_0_var(--navy)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0_var(--navy)] transition-all"
                    >
                        Sign up and Play <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>}
                <ul className="flex gap-1 items-center text-center mx-auto pt-4 max-w-fit">
                    <li>
                        <p className="text-xs text-muted-foreground">
                            &copy; {new Date().getFullYear()} AlbumGuessnr. Made with love for music
                            lovers.
                        </p>
                    </li>
                    <li className="text-xs hover:underline">
                        <a
                            href={location.origin + '/privacyPolicy'}
                            className="text-muted-foreground"
                        >
                            Privacy Policy
                        </a>
                    </li>
                </ul>
                <p className="text-xs text-muted-foreground">contact: albumguessnr@gmail.com</p>
            </div>
        </footer>
    );
};
