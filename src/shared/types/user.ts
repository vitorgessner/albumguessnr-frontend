export interface IMeResponse {
    user: {
        createdAt: Date;
        email: string;
        emailVerified: true;
        id: string;
        totalScore: number;
        profile: {
            avatar_url: string;
            bio: string;
            id: string;
            updatedAt: Date;
            userId: string;
            username: string;
        },
        lastfmIntegrationId: string,
        lastfmIntegration: {
            id: string,
            lastfmUsername: string,
            lastSyncedAt: Date,
        }
    } | undefined;
}

export interface IUser {
    createdAt: Date;
    email: string;
    emailVerified: true;
    id: string;
    totalScore: number;
    profile: {
        avatar_url: string;
        bio: string;
        id: string;
        updatedAt: Date;
        userId: string;
        username: string;
    },
    lastfmIntegrationId: string,
    lastfmIntegration: {
        id: string,
        lastfmUsername: string,
        lastSyncedAt: Date,
    }
}

export interface IUserWithUsername {
    createdAt: Date;
    email: string;
    emailVerified: true;
    id: string;
    profile: {
        username: string;
    },
}

export interface IUserWithProfileAndLastfmIntegration {
    createdAt: Date;
    email: string;
    emailVerified: true;
    id: string;
    profile: {
        avatar_url: string;
        bio: string;
        id: string;
        updatedAt: Date;
        userId: string;
        username: string;
    },
    lastfmIntegrationId: string,
    lastfmIntegration: {
        id: string,
        lastfmUsername: string,
        lastSyncedAt: Date,
    }
}