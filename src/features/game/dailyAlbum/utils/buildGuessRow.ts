import type { AlbumCandidate } from "../types/AlbumCandidate";
import type { DailyAlbum } from "../types/DailyAlbum";
import type { GuessRow } from "../types/GuessRow";
import { compareArray, compareRanking, compareRating, compareYear } from "./compareFunctions";

export function buildGuessRow(guessed: AlbumCandidate, daily: DailyAlbum): GuessRow {
    const targetArtistIds = daily.album.artists.map(a => a.artist.id).filter((_, i) => i < 3)
    const targetGenreIds = daily.album.genres.map(g => g.genre.id).filter((_, i) => i < 3)
    const guessedArtistIds = guessed.artists.map(a => a.artist.id).filter((_, i) => i < 3)
    const guessedGenreIds = guessed.genres.map(g => g.genre.id).filter((_, i) => i < 3)
    const targetDescriptors = daily.album.descriptors.filter((_, i) => i < 3)
    const guessedDescriptors = guessed.descriptors.filter((_, i) => i < 3)
    

    return {
        album: guessed,
        year: compareYear(guessed.year, daily.album.year),
        artists: compareArray(guessedArtistIds, targetArtistIds),
        genres: compareArray(guessedGenreIds, targetGenreIds),
        rymRating: compareRating(guessed.rymRating, daily.album.rymRating),
        rymRanking: compareRanking(guessed.rymRanking, daily.album.rymRanking),
        descriptors: compareArray(guessedDescriptors, targetDescriptors),
    };
}