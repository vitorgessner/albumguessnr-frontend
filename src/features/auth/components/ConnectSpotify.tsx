import axios from '@/shared/utils/axios';
import useUser from '../hooks/useUser';
import { X } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

export const ConnectSpotify = () => {
    const queryClient = useQueryClient();

    const { data: user } = useUser();

    const spotifyAccount = user?.accounts.find((a) => a.provider === 'spotify');

    const connectSpotify = async () => {
        window.location.href = import.meta.env.VITE_API_URL + '/login/spotify';
        await queryClient.invalidateQueries({ queryKey: ['user'] });
    };

    const disconnectSpotify = async () => {
        await axios.delete('/provider/spotify');
        await queryClient.invalidateQueries({ queryKey: ['user'] });
    }

    return (
        <>
            {!spotifyAccount && (
                <button onClick={connectSpotify} className="providerButton">
                    <img src="../../src/assets/spotify.png" className="w-6 h-6" />
                    Connect Spotify
                </button>
            )}
            {spotifyAccount && 
                <button onClick={disconnectSpotify} className='providerButton spotify-component bg-[#1DD05D] flex gap-1 items-center text-white'>
                    <X size={30}/>
                    {spotifyAccount.displayUsername} on Spotify
                </button>}
        </>
    );
};
