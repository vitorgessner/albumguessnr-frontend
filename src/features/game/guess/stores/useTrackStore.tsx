import { create } from 'zustand';

interface ITrackStore {
    tracks: Array<string>;
    guessed: Array<{ trackId: string; name: string; isCorrect: boolean }>;
    isFinished: boolean;
    tries: number;

    incrementTries: () => void;
    resetTries: () => void;
    setTracks: (tracks: Array<string>) => void;
    addGuess: (guess: { trackId: string; name: string; isCorrect: boolean }) => void;
    resetTracksState: () => void;
    setIsFinished: (isFinished: boolean) => void;
}

const useTrackStore = create<ITrackStore>()((set) => ({
    tracks: [],
    guessed: [],
    isFinished: false,
    tries: 0,

    setTracks: (tracks) =>
        set(() => ({
            tracks: [...tracks],
        })),

    addGuess: (guess) =>
        set((state) => ({
            guessed: [...state.guessed, guess],
        })),

    resetTracksState: () =>
        set(() => ({
            guessed: [],
            remaining: 0,
            rightAnswersCount: undefined,
        })),

    setIsFinished: (isFinished) =>
        set(() => ({
            isFinished,
        })),

    incrementTries: () => set((state) => ({
        tries: state.tries + 1,
    })),

    resetTries: () => set(() => ({
        tries: 0,
    }))
}));

export default useTrackStore;
