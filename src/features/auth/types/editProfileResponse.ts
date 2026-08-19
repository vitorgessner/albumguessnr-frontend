export type AllowedData = {
    username: string,
    bio: string,
    pfp: FileList
}

export type FormDataKeys = keyof AllowedData;