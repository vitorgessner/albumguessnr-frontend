import useUser from '../hooks/useUser';
import { X } from 'lucide-react';

export const ConnectLastfm = () => {
    const { data: user } = useUser();

    const lastfmAccount = user?.accounts.find((a) => a.provider === 'lastfm');

    const connectLastfm = async () => {
        window.location.href = import.meta.env.VITE_API_URL + '/login/lastfm';
    };

    const disconnectLastfm = async () => {

    }

    return (
        <>
            {!lastfmAccount && (
                <button onClick={connectLastfm} className="providerButton white-component">
                    <img src="../../src/assets/lastfm.png" className="w-6 h-6" />
                    Connect Lastfm
                </button>
            )}

            {lastfmAccount && (
                <button
                    onClick={disconnectLastfm}
                    className="providerButton lastfm-component flex gap-1 items-center text-white"
                >
                    <X size={30}/>
                    {lastfmAccount?.displayUsername} on Lastfm
                </button>
            )}
        </>
    );
};
