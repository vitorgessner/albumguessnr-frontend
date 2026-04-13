import { create } from "zustand";

interface ITrackStore {
    tracks: Array<string>;
    guessed: Array<{ name: string, isCorrect: boolean }>;
    remaining: number;
    rightAnswersCount: number;
    isFinished: boolean;

    setTracks: (tracks: Array<string>) => void;
    addGuess: (guess: { name: string, isCorrect: boolean }) => void;
    setRemainig: (remaining: number) => void;
    decrementRemaining: () => void;
    getRightAnswersCount: () => void;
    resetTracksState: () => void;
    setIsFinished: (isFinished: boolean) => void;
}

const useTrackStore = create<ITrackStore>()((set) => ({
    tracks: [],
    guessed: [],
    remaining: 0,
    rightAnswersCount: 0,
    isFinished: false,

    setTracks: (tracks) => set(() => ({
        tracks: [...tracks]
    })),

    addGuess: (guess) => set((state) => ({
        guessed: [...state.guessed, guess]
    })),

    setRemainig: (remaining) => set(() => ({
        remaining
    })),

    decrementRemaining: () => set((state) => ({
        remaining: state.remaining - 1
    })),

    getRightAnswersCount: () => set((state) => ({
        rightAnswersCount: state.guessed.filter(g => g.isCorrect).length
    })),

    resetTracksState: () => set(() => ({
        guessed: [],
        remaining: 0,
        rightAnswersCount: 0,
    })),

    setIsFinished: (isFinished) => set(() => ({
        isFinished,
    }))
}));

export default useTrackStore;