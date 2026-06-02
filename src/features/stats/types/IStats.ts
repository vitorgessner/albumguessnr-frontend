export interface IStats {
    id: string;
    userId: string;
    totalScore: number;
    guessedAlbums: number;
    guessedArtists: number;
    guessedDistinctAlbums: number;
    guessedGenres: number;
    guessedTracks: number;
    guessedYears: number;
    rightGuessedAlbums: number;
    rightGuessedArtist: number;
    rightGuessedGenres: number;
    rightGuessedTracks: number;
    rightGuessedYears: number;
}