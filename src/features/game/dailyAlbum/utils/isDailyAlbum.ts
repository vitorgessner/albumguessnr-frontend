import type { GuessRow } from '../types/GuessRow';

export const isDailyAlbum = (row: GuessRow) => {
    return (
        row.artists.status === 'correct' &&
        row.descriptors.status === 'correct' &&
        row.genres.status === 'correct' &&
        row.rymRanking.status === 'correct' &&
        row.rymRating.status === 'correct' &&
        row.year.status === 'correct'
    );
};
