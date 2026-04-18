import { create } from "zustand";

interface ITrackStore {
    tracks: Array<string>;
    guessed: Array<{ name: string, isCorrect: boolean }>;
    rightAnswersCount: number | undefined;
    isFinished: boolean;

    setTracks: (tracks: Array<string>) => void;
    addGuess: (guess: { name: string, isCorrect: boolean }) => void;
    getRightAnswersCount: () => void;
    resetTracksState: () => void;
    setIsFinished: (isFinished: boolean) => void;
}

const useTrackStore = create<ITrackStore>()((set) => ({
    tracks: [],
    guessed: [],
    rightAnswersCount: undefined,
    isFinished: false,

    setTracks: (tracks) => set(() => ({
        tracks: [...tracks]
    })),

    addGuess: (guess) => set((state) => ({
        guessed: [...state.guessed, guess]
    })),

    getRightAnswersCount: () => set((state) => ({
        rightAnswersCount: state.guessed.filter(g => g.isCorrect).length ?? 0
    })),

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