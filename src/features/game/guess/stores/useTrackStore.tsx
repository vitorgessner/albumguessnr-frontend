import { create } from "zustand";

interface ITrackStore {
    tracks: Array<string>;
    guessed: Array<{ trackId: string, name: string, isCorrect: boolean }>;
    // rightAnswers: Array<{ trackId: string, isCorrect: boolean }>;
    isFinished: boolean;

    setTracks: (tracks: Array<string>) => void;
    addGuess: (guess: { trackId: string, name: string, isCorrect: boolean }) => void;
    // getRightAnswers: () => void;
    resetTracksState: () => void;
    setIsFinished: (isFinished: boolean) => void;
}

const useTrackStore = create<ITrackStore>()((set) => ({
    tracks: [],
    guessed: [],
    // rightAnswers: [],
    isFinished: false,

    setTracks: (tracks) => set(() => ({
        tracks: [...tracks]
    })),

    addGuess: (guess) => set((state) => ({
        guessed: [...state.guessed, guess]
    })),

    // getRightAnswers: () => set((state) => ({
    //     rightAnswers: state.guessed.filter(g => g.isCorrect)
    // })),

    resetTracksState: () => set(() => ({
        guessed: [],
        remaining: 0,
        rightAnswersCount: undefined,
    })),

    setIsFinished: (isFinished) => set(() => ({
        isFinished,
    }))
}));

export default useTrackStore;