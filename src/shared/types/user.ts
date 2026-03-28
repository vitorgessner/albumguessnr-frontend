export interface IMeResponse {
    user: {
        createdAt: Date;
        email: string;
        emailVerifies: true;
        id: string;
        profile: {
            avatar_url: string;
            bio: string;
            id: string;
            updatedAt: Date;
            userId: string;
            username: string;
        }
    } | undefined;
}

export interface IUserWithProfile {
    createdAt: Date;
    email: string;
    emailVerifies: true;
    id: string;
    profile: {
        avatar_url: string;
        bio: string;
        id: string;
        updatedAt: Date;
        userId: string;
        username: string;
    }
}