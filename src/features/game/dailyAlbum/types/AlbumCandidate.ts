export interface AlbumCandidate {
    id: string;
    mbid: string | null;
    name: string;
    normalizedName: string;
    normalizedArtist: string;
    year: string | null;
    cover_url: string;
    rymRating: number | null;
    rymRanking: number | null;
    descriptors: string[];
    artists: ({
        artist: {
            mbid: string | null;
            id: string;
            name: string;
            normalizedName: string;
        };
    })[];
    genres: ({ 
        genre: {
            id: string;
            name: string;
        };
    })[];
}