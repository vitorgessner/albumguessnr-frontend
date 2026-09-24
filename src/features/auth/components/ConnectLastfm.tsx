import axios from '@/shared/utils/axios';
import useUser from '../hooks/useUser';
import { X } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

export const ConnectLastfm = ({ mainAccountId }: { mainAccountId?: string | null }) => {
    const { data: user } = useUser();
    const queryClient = useQueryClient();

    const lastfmAccount = user?.accounts.find((a) => a.provider === 'lastfm');

    const connectLastfm = async () => {
        window.location.href = import.meta.env.VITE_API_URL + '/login/lastfm';
        await queryClient.invalidateQueries({ queryKey: ['user'] });
    };

    const disconnectLastfm = async () => {
        await axios.delete('/provider/lastfm');
        await queryClient.invalidateQueries({ queryKey: ['user'] });
    };

    return (
        <>
            {!lastfmAccount && (
                <button onClick={connectLastfm} className="providerButton white-component">
                    <img src="../../src/assets/lastfm.png" className="w-6 h-6" />
                    Connect Lastfm
                </button>
            )}

            {lastfmAccount &&
                (lastfmAccount.id === mainAccountId ? (
                    <div className="flex flex-col gap-2">
                        <button
                            onClick={disconnectLastfm}
                            className="relative providerButton lastfm-component flex gap-1 items-center text-white"
                        >
                            <X size={30} />
                            {lastfmAccount?.displayUsername} on Lastfm
                            <span className="absolute right-1 bottom-0 text-xs text-[#5b0c0c] font-normal">
                                main provider
                            </span>
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-2">
                        <button
                            onClick={disconnectLastfm}
                            className="providerButton lastfm-component flex gap-1 items-center text-white"
                        >
                            <X size={30} />
                            {lastfmAccount?.displayUsername} on Lastfm
                        </button>
                    </div>
                ))}
        </>
    );
};
