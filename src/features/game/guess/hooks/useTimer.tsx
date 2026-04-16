import { useCallback, useRef, useState } from "react";

const useTimer = () => {
    const [seconds, setSeconds] = useState(0);
    const timeRef = useRef<number>(null);

    const startTimer = useCallback(() => {
        if (!timeRef.current) {
            timeRef.current = setInterval(() => {
                setSeconds((prev) => prev + 1);
            }, 1000)
        }

        return () => {
            if (timeRef.current) {
                clearInterval(timeRef.current);
                setSeconds(0);
                timeRef.current = null;
            }
        }
    }, [setSeconds, timeRef])

    const pauseTimer = useCallback(() => {
        if (timeRef.current) {
            clearInterval(timeRef.current);
            timeRef.current = null;
        }
    }, [timeRef])

    const clearTimer = useCallback(() => {
        setSeconds(0);
    }, [setSeconds])

    return { startTimer, pauseTimer, clearTimer, seconds };
}

export default useTimer;