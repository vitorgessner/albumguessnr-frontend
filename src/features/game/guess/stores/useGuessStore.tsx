import { create } from "zustand";
import type { Album } from "../types/albumTypes";

interface IGuessStore {
    albums: Array<Album>;
    index: number;
    isTitleCorrect: boolean;
    isArtistCorrect: boolean;
    isGuessed: boolean;

    setAlbums: (albums: Array<Album>) => void;
    incrementIndex: () => void;
    resetIndex: () => void;
    setIsTitleCorrect: (val: boolean) => void;
    setIsArtistCorrect: (val: boolean) => void;
    setIsGuessed: (val: boolean) => void;
}

const useGuessStore = create<IGuessStore>()((set) => ({
    albums: [],

    setAlbums: (albums) => set(() => ({
        albums,
    })),

    index: 0,

    incrementIndex: () => set((state) => ({
        index: state.index + 1,
    })),

    resetIndex: () => set(() => ({
        index: 0,
    })),

    isTitleCorrect: false,
    isArtistCorrect: false,
    isGuessed: false,

    setIsTitleCorrect: (val) => set(() => ({
        isTitleCorrect: val,
    })),

    setIsArtistCorrect: (val) => set(() => ({
        isArtistCorrect: val,
    })),

    setIsGuessed: (val) => set(() => ({
        isGuessed: val,
    })),
}))

export default useGuessStore;