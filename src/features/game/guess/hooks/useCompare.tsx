import type { UseFormResetField, UseFormSetFocus } from "react-hook-form";
import useGuessStore from "../stores/useGuessStore";
import type { GuessType } from "../types/guessTypes";

const useCompare = (resetField?: UseFormResetField<GuessType>, setFocus?: UseFormSetFocus<GuessType>) => {
    const { albums, index, setIsTitleCorrect, setIsArtistCorrect, setIsGuessed, incrementIndex, resetIndex } = useGuessStore();
    const currentAlbum = albums[index];

    const compareAlbum = (guess: string) => {
        if (guess === currentAlbum.album.normalizedName) return setIsTitleCorrect(true);
        return setIsTitleCorrect(false);
    }

    const compareArtist = (guess: string) => {
        if (guess === currentAlbum.album.normalizedArtist) return setIsArtistCorrect(true);
        return setIsArtistCorrect(false);
    }

    const reset = () => {
            setIsGuessed(false);
            if (resetField){
                resetField('album');
                resetField('artist');
            }
    
            setIsTitleCorrect(false);
            setIsArtistCorrect(false);
            if (setFocus) setFocus('album');
            if (index < 49) {
                return incrementIndex();
            }
            resetIndex();
        }

    return { compareAlbum, compareArtist, reset };
}

export default useCompare;