export type Category = 'album' | 'artist' | 'genre' | 'year' | 'tracklist' | undefined;

export const CATEGORIES: { label: string; value: Category }[] = [
    { label: 'All', value: undefined },
    { label: 'Title', value: 'album' },
    { label: 'Artist', value: 'artist' },
    { label: 'Genre', value: 'genre' },
    { label: 'Year', value: 'year' },
    { label: 'Tracks', value: 'tracklist' },
];
