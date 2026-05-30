export type Period = 'daily' | 'weekly' | 'monthly' | undefined;

export const PERIODS: { label: string; value: Period }[] = [
    { label: 'All', value: undefined },
    { label: 'Daily', value: 'daily' },
    { label: 'Weekly', value: 'weekly' },
    { label: 'Monthly', value: 'monthly' },
];
