import type { CellStatus } from "../types/CellStatus";
import type { Direction } from "../types/Direction";

export function compareYear(guessed: string | null, target: string | null): { status: CellStatus; direction: Direction } {
    if (!guessed || !target) return { status: 'wrong', direction: null };
    const guessedInt = parseInt(guessed), targetInt = parseInt(target);
    if (guessedInt === targetInt) return { status: 'correct', direction: null };
    return { status: 'wrong', direction: guessedInt < targetInt ? 'up' : 'down' };
}

export function compareRanking(guessed: number | null, target: number | null): { status: CellStatus; direction: Direction } {
    if (guessed === null || target === null) return { status: 'wrong', direction: null };
    if (guessed === target) return { status: 'correct', direction: null };
    return { status: 'wrong', direction: Number(guessed) < Number(target) ? 'up' : 'down' };
}

export function compareRating(guessed: number | null, target: number | null): { status: CellStatus; direction: Direction } {
    if (guessed === null || target === null) return { status: 'wrong', direction: null };
    if (guessed === target) return { status: 'correct', direction: null };
    return { status: 'wrong', direction: Number(guessed) < Number(target) ? 'up' : 'down' };
}

export function compareArray(guessedIds: string[], targetIds: string[]): { status: CellStatus } {
    const correct = guessedIds.filter(id => targetIds.includes(id));
    if (correct.length === 0) return { status: 'wrong' };
    if (correct.length === targetIds.length && guessedIds.length === targetIds.length) return { status: 'correct' };
    return { status: 'partial' };
}