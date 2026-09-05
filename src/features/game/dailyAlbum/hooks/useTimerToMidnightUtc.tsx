import { useEffect, useState } from 'react';

const calculateTimeLeft = () => {
    const now = new Date();

    const target = new Date(
        Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1, 0, 0, 0, 0)
    );

    const difference = target.getTime() - now.getTime();

    if (difference <= 0) {
        return '00:00:00';
    }

    const hours = Math.floor(difference / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    return [
        String(hours).padStart(2, '0'),
        String(minutes).padStart(2, '0'),
        String(seconds).padStart(2, '0'),
    ].join(':');
};

export const useTimerToMidnightUtc = () => {
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        const intervalId = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);

    return timeLeft || '00:00:00';
};
