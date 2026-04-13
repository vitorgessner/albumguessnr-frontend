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
    // isTitleCorrect: boolean;
    // isArtistCorrect: boolean;
    isGuessed: boolean;
    config: IConfig;
    correctAnswers: Partial<Answers>;

    setAlbums: (albums: Array<Album>) => void;
    incrementIndex: () => void;
    resetIndex: () => void;
    // setIsTitleCorrect: (val: boolean) => void;
    // setIsArtistCorrect: (val: boolean) => void;
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

    // isTitleCorrect: false,
    // isArtistCorrect: false,
    isGuessed: false,

    // setIsTitleCorrect: (val) => set(() => ({
    //     isTitleCorrect: val,
    // })),

    // setIsArtistCorrect: (val) => set(() => ({
    //     isArtistCorrect: val,
    // })),

    setIsGuessed: (val) => set(() => ({
        isGuessed: val,
    })),

    config: {
        album: true,
        artist: true,
        genre: true,
        year: true,
        tracklist: true
    },

    setConfig: (config) => set(() => ({
        config,
    })),

    correctAnswers: {
        album: false,
        artist: false,
        genre: false,
        year: false,
        tracklist: 0,
    },

    setCorrectAnswers: (correctAnswers) => set(() => ({
        correctAnswers,
    })),

    resetAnswers: () => set(() => ({
        correctAnswers: {
            album: false,
            artist: false,
            genre: false,
            year: false,
            tracklist: 0
        }
    }))
}))

export default useGuessStore;