export type Album = {
    album: {
        cover_url: string,
        id: string,
        mbid: string | null,
        name: string,
        normalizedArtist: string,
        normalizedName: string,
        year: Date
    },
    albumId: string,
    lastfmIntegrationId: string,
    lastTimeListened: Date,
    timesListened: number,
    tracksListened: number,
}

export type FetchResponse = {
    status: string,
    albums: [
        {
            album: {
                cover_url: string,
                id: string,
                mbid: string | null,
                name: string,
                normalizedArtist: string,
                normalizedName: string,
                year: Date
            },
            albumId: string,
            lastfmIntegrationId: string,
            lastTimeListened: Date,
            timesListened: number,
            tracksListened: number,
        }
    ]
}