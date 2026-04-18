import { create } from "zustand";
import type { Album } from "../types/albumTypes";

interface IConfig {
    album: boolean,
    artist: boolean,
    genre: boolean,
    year: boolean,
    tracklist: boolean,
}

type Answers = Omit<IConfig, 'tracklist'> & {
    tracklist: number
}

interface IGuessStore {
    albums: Array<Album>;
    index: number;
    isGuessed: boolean;
    config: IConfig;
    correctAnswers: Partial<Answers>;

    setAlbums: (albums: Array<Album>) => void;
    incrementIndex: () => void;
    resetIndex: () => void;
    setIsGuessed: (val: boolean) => void;
    setConfig: (config: IConfig) => void;
    setCorrectAnswers: (correctAnswers: Partial<Answers>) => void;
    resetAnswers: () => void;
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

    isGuessed: false,

    setIsGuessed: (val) => set(() => ({
        isGuessed: val,
    })),

    config: {
        album: true,
        artist: true,
        genre: false,
        year: false,
        tracklist: false
    },

    setConfig: (config) => set(() => ({
        config,
    })),

    correctAnswers: {},

    setCorrectAnswers: (correctAnswers) => set(() => ({
        correctAnswers,
    })),

    resetAnswers: () => set(() => ({
        correctAnswers: {}
    }))
}))

export default useGuessStore;