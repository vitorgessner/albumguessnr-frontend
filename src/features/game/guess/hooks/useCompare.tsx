import type { UseFormResetField, UseFormSetFocus } from "react-hook-form";
import useGuessStore from "../stores/useGuessStore";
import type { GuessType } from "../types/guessTypes";
import { useQueryClient } from "@tanstack/react-query";
import useUser from "../../../auth/hooks/useUser";
import useTrackStore from "../stores/useTrackStore";
import { fuzzy } from 'fast-fuzzy';
import { WORD_REPLACEMENTS } from "../utils/removeWords";
// import Fuse from 'fuse.js';

const useCompare = (resetField: UseFormResetField<GuessType>, setFocus: UseFormSetFocus<GuessType>) => {
    const { albums, config, index, setCorrectAnswers, resetAnswers, setIsGuessed, incrementIndex } = useGuessStore();
    const { addGuess, getRightAnswersCount, rightAnswersCount, resetTracksState, setIsFinished, guessed } = useTrackStore();
    const currentAlbum = albums[index];
    const { user } = useUser();
    const queryClient = useQueryClient();

    const compareAlbum = (guess: string = '') => {
        const result = getScore(currentAlbum.album.normalizedName, guess);

        const wordsQtd = getWordsQtd(currentAlbum.album.normalizedName);

        return wordsQtd <= 8 ? result > 0.97 + (Number(wordsQtd) - 2) * (0.94 - 0.97) / (8 - 2) : result > 0.94
    }

    const compareArtist = (guess: string = '') => {
        const artist = currentAlbum.album.artists.filter((a) => {
            const result = getScore(a.artist.normalizedName, guess);

            const wordsQtd = getWordsQtd(a.artist.normalizedName);

            return wordsQtd <= 8 ? result > 0.97 + (Number(wordsQtd) - 2) * (0.94 - 0.97) / (8 - 2) : result > 0.94
        })

        return artist.length > 0 ? true : false;
    }

    const compareTag = (guess: string = '') => {
        const tag = currentAlbum.album.genres.filter((g) => {
            const result = getScore(g.genre.name, guess);

            const wordsQtd = getWordsQtd(g.genre.name);

            return wordsQtd <= 8 ? result > 0.97 + (Number(wordsQtd) - 2) * (0.94 - 0.97) / (8 - 2) : result > 0.94
        })

        return tag.length > 0 ? true : false;
    }

    const compareTrack = (guess: string = '') => {
        const track = currentAlbum.album.tracks.filter((t) => {
            const isGuessed = guessed.findIndex((g) => g.name === t.normalizedName && g.isCorrect)
            if (isGuessed !== -1) return null;

            const result = getScore(t.normalizedName, guess) > getScoreWithoutSpaces(t.normalizedName, guess)
                ? getScore(t.normalizedName, guess) : getScoreWithoutSpaces(t.normalizedName, guess);

            const wordsQtd = getWordsQtd(t.normalizedName);

            return wordsQtd <= 8 ? result > 0.97 + (Number(wordsQtd) - 2) * (0.94 - 0.97) / (8 - 2) : result > 0.94;
        })

        const index = currentAlbum.album.tracks.findIndex((t) => t.normalizedName === track[0]?.normalizedName) ?? -1;

        addGuess({ name: track[0]?.normalizedName ?? guess.toLowerCase().trim(), isCorrect: index >= 0 ? true : false });
        getRightAnswersCount();
        if (guessed.length >= currentAlbum.album.tracks.length - 1) setIsFinished(true);

        if (index >= 0) return index;
    }

    const compareYear = (guess: string = '') => {
        return guess.toLocaleLowerCase().trim() === currentAlbum.album.year;
    }

    const guess = (guess: {
        album: string;
        artist?: string;
        tag?: string;
        year?: string;
    }) => {
        setIsGuessed(true);

        const { album, artist, tag, year } = guess;

        const isAlbumCorrect = compareAlbum(album);
        const isArtistCorrect = compareArtist(artist);
        const isTagCorrect = compareTag(tag);
        const isYearCorrect = compareYear(year);

        if (config.tracklist) getRightAnswersCount();

        setCorrectAnswers({
            album: isAlbumCorrect,
            artist: artist !== undefined ? isArtistCorrect : undefined,
            genre: artist !== undefined ? isTagCorrect : undefined,
            year: artist !== undefined ? isYearCorrect : undefined,
            tracklist: config.tracklist ? rightAnswersCount : undefined
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

    const normalizeData = (data: string) => {
        return applyReplacements(data
            .toLowerCase()
            .trim()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/'`"]/g, "")
            .replace(/[.,/#!$%^*;:{}=\-_`'"/|~()]/g, " ")
            .replace(/[\u2010-\u2015]/g, ' '))
    }

    const applyReplacements = (data: string) => {
        return WORD_REPLACEMENTS.reduce((acc, [regex, replacement]) => {
            return acc.replace(regex, replacement);
        }, data);
    }

    const getScore = (data: string, guess: string) => {
        const result = fuzzy(
            normalizeData(data),
            normalizeData(guess), {
            ignoreCase: true,
            ignoreSymbols: true,
            normalizeWhitespace: true,
        });

        return result;
    }

    const getScoreWithoutSpaces = (data: string, guess: string) => {
        const result = fuzzy(
            normalizeData(data).replace(/\s/g, ''),
            normalizeData(guess).replace(/\s/g, ''), {
            ignoreCase: true,
            ignoreSymbols: true,
            normalizeWhitespace: true,
        });

        return result;
    }

    const getWordsQtd = (data: string) => {
        return data
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[.,/#!$%^&*;:{}=\-_`'"/|~()]/g, " ")
            .split(' ').length;
    }

    return { currentAlbum, guess, compareTrack, reset };
}

export default useCompare;