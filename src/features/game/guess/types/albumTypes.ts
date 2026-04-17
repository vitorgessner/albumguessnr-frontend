type Genre = {
    genre: {
        id: string,
        name: string,
    }
}

type Track = {
    id: string,
    albumId: string,
    name: string,
    normalizedName: string,
}

type Artist = {
    albumId: string;
    artistId: string;
    artist: {
        id: string;
        mbid: string;
        name: string;
        normalizedName: string;
    }
}

export type Album = {
    album: {
        cover_url: string,
        genres: Array<Genre>,
        id: string,
        mbid: string | null,
        name: string,
        normalizedArtist: string,
        normalizedName: string,
        tracks: Array<Track>,
        artists: Array<Artist>,
        year: string
    },
    albumId: string,
    lastfmIntegrationId: string,
    lastTimeListened: Date,
    timesListened: number,
    tracksListened: number,
}

export type FetchResponse = {
    status: string,
    albums: Array<Album>
}