export interface RecentPlayersResponse {
    status: string;
    message: string;
    players: Array<RecentPlayers>;
}

export interface RecentPlayers {
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
