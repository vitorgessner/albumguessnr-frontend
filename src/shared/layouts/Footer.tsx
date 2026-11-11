import useUser from '@/features/auth/hooks/useUser';
import { ArrowRight, Heart } from 'lucide-react';
import { Link } from 'react-router';

export const Footer = () => {
    const { data: user } = useUser();
    return (
        <footer className={`border-t-3 border-border bg-card py-2 px-2 text-center ${document.title === 'Guess' ? 'mb-14' : 'mb-0'} lg:mb-0`}>
            <div className="max-w-md mx-auto space-y-4">
                {(!user && (document.title !== 'Register' && document.title !== 'Login')) && <div>
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
                <ul className="flex flex-col items-center text-center mx-auto pt-4 max-w-fit">
                    <div className='flex gap-3 border-b-2 pb-3'>
                        <li>
                            <p className="text-xs text-muted-foreground">
                                &copy; {new Date().getFullYear()} AlbumGuessnr. Made with <Heart className='inline' size={14} fill='var(--terra)' stroke='var(--terra)'/> for music
                                lovers.
                            </p>
                        </li>
                        <li className="text-xs hover:underline">
                            <a
                                href={location.origin + '/privacyPolicy'}
                                className="text-black underline"
                            >
                                Privacy Policy
                            </a>
                        </li>
                    </div>
                    <div className='border-b-2 w-full py-3'>
                        <li className="text-xs hover:underline text-muted-foreground">
                            Listen history: <a href="https://www.last.fm" target='_blank' className="text-black underline">Powered by AudioScrobbler</a>
                        </li>
                        <li className="text-xs hover:underline text-muted-foreground">
                            Album data: <a href="https://musicbrainz.org/" target='_blank' className="text-black underline">MusicBrainz</a>
                        </li>
                        <li className="text-xs hover:underline text-muted-foreground">
                            Covers: <a href="https://coverartarchive.org/" target='_blank' className="text-black underline">Cover Art Archive</a>
                        </li>
                    </div>
                    <li className="text-xs hover:underline flex gap-1 text-muted-foreground pt-3">
                        Contact: <p className="text-xs text-black"> albumguessnr@gmail.com</p>
                    </li>
                    
                </ul>
            </div>
        </footer>
    );
};
