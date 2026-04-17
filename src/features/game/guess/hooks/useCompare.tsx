import type { UseFormResetField, UseFormSetFocus } from "react-hook-form";
import useGuessStore from "../stores/useGuessStore";
import type { GuessType } from "../types/guessTypes";
import { useQueryClient } from "@tanstack/react-query";
import useUser from "../../../auth/hooks/useUser";
import useTrackStore from "../stores/useTrackStore";

const useCompare = (resetField: UseFormResetField<GuessType>, setFocus: UseFormSetFocus<GuessType>) => {
    const { albums, index, setCorrectAnswers, resetAnswers, setIsGuessed, incrementIndex } = useGuessStore();
    const { addGuess, getRightAnswersCount, rightAnswersCount, resetTracksState, setIsFinished, guessed } = useTrackStore();
    const currentAlbum = albums[index];
    const { user } = useUser();
    const queryClient = useQueryClient();

    const compareAlbum = (guess: string = '') => {
        return guess.toLowerCase().trim() === currentAlbum.album.normalizedName
    }

    const compareArtist = (guess: string = '') => {
        const artist = currentAlbum.album.artists.filter((a) => {
            return a.artist.normalizedName.replace(/[\u2010\u2011\u2012\u2013\u2014\u2015]/g, "-") === guess.toLowerCase().trim()
    })
        return artist.length > 0 ? true : false;
    }

    const compareTag = (guess: string = '') => {
        const tag = currentAlbum.album.genres.filter(genre => genre.genre.name === guess.toLowerCase().trim());

        return tag.length > 0 ? true : false;
    }

    const compareTrack = (guess: string = '') => {
        if (guessed.length >= currentAlbum.album.tracks.length) return setIsFinished(true);
        const tracks = currentAlbum.album.tracks.map(track => track.normalizedName);

        const includes = tracks.includes(guess.toLowerCase().trim());

        addGuess({ name: guess.toLowerCase().trim(), isCorrect: includes ? true : false  });
    }

    const compareYear = (guess: string = '') => {
        return guess.toLocaleLowerCase().trim() === currentAlbum.album.year;
    }

    const guess = (album: string, artist: string, tag: string, year: string) => {
        setIsGuessed(true);
        const isAlbumCorrect = compareAlbum(album);
        const isArtistCorrect = compareArtist(artist);
        const isTagCorrect = compareTag(tag);
        const isYearCorrect = compareYear(year);

        getRightAnswersCount();

        setCorrectAnswers({
            album: isAlbumCorrect,
            artist: isArtistCorrect,
            genre: isTagCorrect,
            year: isYearCorrect,
            tracklist: rightAnswersCount
        })
    }

    const reset = () => {
        setIsGuessed(false);
        setIsFinished(false);
        if (resetField) {
            resetField('album');
            resetField('artist');
            resetField('genre')
            resetField('year')
        }

        resetAnswers();
        resetTracksState();
        if (setFocus) setFocus('album');
        if (index < albums.length - 1) {
            return incrementIndex();
        }
        queryClient.invalidateQueries({ queryKey: ['albums', user?.lastfmIntegration.lastfmUsername] })
    }

    return { currentAlbum, guess, compareTrack, reset };
}

export default useCompare;