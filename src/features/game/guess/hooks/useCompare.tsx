import type { UseFormResetField, UseFormSetFocus } from "react-hook-form";
import useGuessStore from "../stores/useGuessStore";
import type { GuessType } from "../types/guessTypes";
import { useQueryClient } from "@tanstack/react-query";
import useUser from "../../../auth/hooks/useUser";
import useTrackStore from "../stores/useTrackStore";
import { fuzzy } from 'fast-fuzzy';
import { WORD_REPLACEMENTS } from "../utils/removeWords";
import { useState } from "react";

const useCompare = (resetField?: UseFormResetField<GuessType>, setFocus?: UseFormSetFocus<GuessType>) => {
    const { albums, config, index, setCorrectAnswers, resetAnswers, setIsGuessed, incrementIndex } = useGuessStore();
    const { addGuess, resetTracksState, setIsFinished, guessed } = useTrackStore();
    const [tries, setTries] = useState(0);
    const currentAlbum = albums[index];
    const { data: user } = useUser();
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

    const compareGenre = (guess: string = '') => {
        const genre = currentAlbum.album.genres.filter((g) => {
            const result = getScore(g.genre.name, guess);

            const wordsQtd = getWordsQtd(g.genre.name);

            return wordsQtd <= 8 ? result > 0.97 + (Number(wordsQtd) - 2) * (0.94 - 0.97) / (8 - 2) : result > 0.94
        })

        return genre.length > 0 ? true : false;
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

        if (index >= 0) {
            addGuess({ trackId: track[0].id, name: track[0].normalizedName ?? guess.toLowerCase().trim(), isCorrect: true });
        }
        // getRightAnswers();
        if (tries >= currentAlbum.album.tracks.length - 1) setIsFinished(true);

        if (index >= 0) return index;
    }

    const compareYear = (guess: string = '') => {
        return guess.toLocaleLowerCase().trim() === currentAlbum.album.year;
    }

    const guess = (guess: {
        album: string;
        artist?: string;
        genre?: string;
        year?: string;
    }) => {
        setIsGuessed(true);

        const { album, artist, genre, year } = guess;

        const isAlbumCorrect = compareAlbum(album);
        const isArtistCorrect = compareArtist(artist);
        const isGenreCorrect = compareGenre(genre);
        const isYearCorrect = compareYear(year);

        const answers = {
            album: isAlbumCorrect,
            artist: artist !== undefined ? isArtistCorrect : undefined,
            genre: genre !== undefined ? isGenreCorrect : undefined,
            year: year !== undefined ? isYearCorrect : undefined,
            tracklist: config.tracklist ? guessed.map(g => {
                return {
                    trackId: g.trackId,
                    isCorrect: g.isCorrect,
                }
            }) : undefined
        }

        if (config.tracklist) {
            const guessedNames = new Set(guessed.map(g => g.name))
            currentAlbum.album.tracks.forEach(t => {
                if (!guessedNames.has(t.normalizedName)) {
                    answers.tracklist?.push({ trackId: t.id, isCorrect: false })
                }
            })
        }

        setCorrectAnswers(answers);

        return answers;
    }

    const reset = () => {
        setIsGuessed(false);
        setIsFinished(false);
        setTries(0)
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
            .replace(/['"`‘’“”]/g, "")
            .replace(/[.,/#!$%^*;:{}=\-_`~()|…\u2026]/g, " ")
            .replace(/[\u2010-\u2015]/g, ' '))
            .replace(/\s+/g, '')
            .replace(/[^a-zA-Z0-9]/g, '')    ; 
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

    return { currentAlbum, guess, compareTrack, reset, tries, setTries };
}

export default useCompare;