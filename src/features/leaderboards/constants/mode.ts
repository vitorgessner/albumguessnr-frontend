export type Mode = 'accuracy' | undefined

export const MODE: { label: string; value: Mode }[] = [
    { label: 'Points', value: undefined },
    { label: 'Accuracy', value: 'accuracy' },
];
