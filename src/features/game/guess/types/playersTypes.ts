export interface RecentPlayersResponse {
    status: string;
    message: string;
    players: Array<RecentPlayers>;
}

export interface RecentPlayers {
    id: string;
    userId: string;
    albumId: string;
    date: Date;
    totalScore: number;
    tracksHit: number;
    timeSpent: number;
    user: {
        profile: {
            avatar_url: string,
            username: string
        }
    }
}
