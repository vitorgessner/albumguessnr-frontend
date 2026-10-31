import type { GuessRow } from '../types/GuessRow';

export const calculatePeriod = (row: GuessRow, oldPeriod: string) => {
    if (row.year.status === 'correct') {
        return { value: row.year.value ?? 'all-time', isCorrect: true }; 
    }

    if (oldPeriod === 'all-time') {
        return calculateWhenOldPeriodIsAllTime(row);
    }

    if (row.year.direction === 'down') {
        return calculateWhenYearIsLower(row, oldPeriod);
    }

    if (row.year.direction === 'up') {
        return calculateWhenYearIsHigher(row, oldPeriod);
    }

    return { value: oldPeriod, isCorrect: false };
};

const calculateWhenOldPeriodIsAllTime = (row: GuessRow) => {
    if (row.year.direction === 'down') {
        const year = Number(row.year.value) - 1;
        return { value: `1959-${String(year)}`, isCorrect: false };
    }

    const year = Number(row.year.value) + 1;
    return { value: `${String(year)}-2022`, isCorrect: false };
};

const calculateWhenYearIsLower = (row: GuessRow, oldPeriod: string) => {
    const [lowerYear, higherYear] = oldPeriod.split('-');

    if (Number(row.year.value) <= Number(higherYear)) {
        const year = Number(row.year.value) - 1;
        return { value: `${lowerYear}-${String(year)}`, isCorrect: false };
    }

    return { value: oldPeriod, isCorrect: false };
}

const calculateWhenYearIsHigher = (row: GuessRow, oldPeriod: string) => {
    const [lowerYear, higherYear] = oldPeriod.split('-');

    if (Number(row.year.value) < Number(lowerYear)) {
        return { value: oldPeriod, isCorrect: false };
    }

    const year = Number(row.year.value) + 1;
    return { value: `${year}-${higherYear}`, isCorrect: false };
}