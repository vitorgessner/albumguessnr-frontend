import { create } from "zustand";

interface IScoringStore {
    isNewBestScore: boolean;
    setIsNewBestScore: (isNewBestScore: boolean) => void
}

const useScoringStore = create<IScoringStore>()((set) => ({
    isNewBestScore: false,

    setIsNewBestScore: (isNewBestScore) => set(() => ({ isNewBestScore }))
}))

export default useScoringStore;