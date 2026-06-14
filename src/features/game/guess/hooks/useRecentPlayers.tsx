import axios from "@/shared/utils/axios"
import { useQuery } from "@tanstack/react-query"
import type { RecentPlayersResponse } from "../types/playersTypes"

export const useRecentPlayers = () => {
    const { data, isPending, error } = useQuery({
        queryKey: ['recent'],
        queryFn: () => axios.get<RecentPlayersResponse>('/guess/recently').then(res => res.data.players),
    })

    return { data, isPending, error }
}
