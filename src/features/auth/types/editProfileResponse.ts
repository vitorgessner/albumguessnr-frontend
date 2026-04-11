export type AllowedData = {
    username: string,
    lastfmUsername: string,
    bio: string,
    pfp: FileList
}

export type FormDataKeys = keyof AllowedData;