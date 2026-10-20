import type { GuessRow } from '../types/GuessRow';

export const calculateArrayCategories = (row: GuessRow, oldCategories: string[], isGenres: boolean) => {
    if (isGenres) {
        return calculateGenres(row, oldCategories);
    }

    return calculateDescriptors(row, oldCategories);
};

const calculateGenres = (row: GuessRow, oldCategories: string[]) => {
    if (row.genres.status === 'correct') {
        return { values: Array.from(new Set([...row.genres.values])), isCorrect: true };
    }

    if (row.genres.status === 'partial') {
        return { values: Array.from(new Set([...oldCategories, ...row.genres.values])), isCorrect: false };
    }

    return { values: [...oldCategories], isCorrect: false };
}

const calculateDescriptors = (row: GuessRow, oldCategories: string[]) => {
    if (row.descriptors.status === 'correct') {
        return { values: Array.from(new Set([...row.descriptors.values.filter((_, i) => i < 3)])), isCorrect: true };
    }

    if (row.descriptors.status === 'partial') {
        return { values: Array.from(new Set([...oldCategories, ...row.descriptors.values.filter((_, i) => i < 3)])), isCorrect: false };
    }

    return { values: [...oldCategories], isCorrect: false };    
}