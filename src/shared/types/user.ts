export interface IUser {
    id: string;
    emailVerified: true;
    createdAt: Date;
    mainAccountId: string | null;
    userStats: IStats;
    profile: IProfile;
    accounts: Array<IAccount>;
}

export interface IStats {
    id: string;
        userId: string;
        totalScore: number;
        guessedAlbums: number;
        guessedDistinctAlbums: number;
        rightGuessedAlbums: number;
        guessedArtists: number;
        rightGuessedArtist: number;
        guessedGenres: number;
        rightGuessedGenres: number;
        guessedYears: number;
        rightGuessedYears: number;
        guessedTracks: number;
        rightGuessedTracks: number;
}

export interface IProfile {
    avatar_url: string;
        bio: string;
        id: string;
        updatedAt: Date;
        userId: string;
        username: string;
        displayUsername: string;
}

export interface IAccount {
    id: string;
    userId: string;
    provider: string;
    providerAccountId: string;
    accessToken: string | null;
    refreshToken: string | null;
    expiresAt: Date | null;
    username: string;
    displayUsername: string;
    lastSyncedAt: Date | null;
    syncCursor: number;
    syncStatus: SyncStatus;
    syncingTimestamp: Date | null;
}

type SyncStatus = 'IDLE' | 'SYNCING' | 'SUCCESS' | 'SUCCEEDWITHFAILURE' | 'FAILED';
