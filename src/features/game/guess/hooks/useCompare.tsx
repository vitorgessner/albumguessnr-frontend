import type { UseFormResetField, UseFormSetFocus } from "react-hook-form";
import useGuessStore from "../stores/useGuessStore";
import type { GuessType } from "../types/guessTypes";
import { useQueryClient } from "@tanstack/react-query";
import useUser from "../../../auth/hooks/useUser";

const useCompare = (resetField: UseFormResetField<GuessType>, setFocus: UseFormSetFocus<GuessType>) => {
    const { albums, index, setIsTitleCorrect, setIsArtistCorrect, setIsGuessed, incrementIndex } = useGuessStore();
    const currentAlbum = albums[index];
    const { user } = useUser();
    const queryClient = useQueryClient();

    const compareAlbum = (guess: string = '') => {
        if (guess.toLowerCase().trim() === currentAlbum.album.normalizedName) return setIsTitleCorrect(true);
        return setIsTitleCorrect(false);
    }

    const compareArtist = (guess: string = '') => {
        if (guess.toLowerCase().trim() === currentAlbum.album.normalizedArtist) return setIsArtistCorrect(true);
        return setIsArtistCorrect(false);
    }

    const reset = () => {
        setIsGuessed(false);
        if (resetField) {
            resetField('album');
            resetField('artist');
        }

        setIsTitleCorrect(false);
        setIsArtistCorrect(false);
        if (setFocus) setFocus('album');
        if (index < albums.length - 1) {
            return incrementIndex();
        }
        queryClient.invalidateQueries({ queryKey: ['albums', user?.lastfmIntegration.lastfmUsername] })
    }

    return { currentAlbum, compareAlbum, compareArtist, reset };
}

export default useCompare;