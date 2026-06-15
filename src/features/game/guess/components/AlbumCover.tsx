import { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';

const AlbumCover = ({
    src,
    isGuessed,
    onLoadingChange,
    startTimer,
    clearTimer,
}: {
    src: string;
    isGuessed: boolean;
    onLoadingChange: (loaded: boolean) => void;
    startTimer: React.Dispatch<React.SetStateAction<void>>;
    clearTimer: React.Dispatch<React.SetStateAction<void>>;
}) => {
    const [isImageLoaded, setIsImageLoaded] = useState(false);

    const handleChange = (loaded: boolean) => {
        setIsImageLoaded(loaded);
        onLoadingChange(loaded);
    };

    useEffect(() => {
        if (isImageLoaded || !src) {
            clearTimer();
            startTimer();
        }
    }, [startTimer, clearTimer, isImageLoaded, src]);
    
    return (
        <div className="relative flex justify-center overflow-hidden mx-auto w-full rounded-sm lg:w-fit lg:max-w-fit border-2 border-border">
            {!isImageLoaded && (
                <div>
                    <div className="lg:hidden block">
                        <Skeleton width={220} height={220} className="p-1" />
                    </div>
                    <div className="hidden lg:block h-md:hidden">
                        <Skeleton width={220} height={220} className="p-1" />
                    </div>
                    <div className="hidden h-md:block">
                        <Skeleton width={279} height={279} className="p-1" />
                    </div>
                </div>
            )}
            <img
                src={src || `${import.meta.env.VITE_SUPABASE_STORAGE}/svgviewer-output.svg`}
                onLoad={() => handleChange(true)}
                onError={() => handleChange(true)}
                alt=""
                onContextMenu={(e) => e.preventDefault()}
                draggable={false}
                className={`${!isImageLoaded && 'hidden'} size-full w-full min-w-58 lg:min-w-58 lg:h-md:min-w-62 max-w-58 lg:max-w-58 lg:h-md:max-w-62 transition-opacity duration-300
                    ${!isImageLoaded ? 'opacity-0' : 'opacity-100'}
                    ${isGuessed || !src ? '' : 'blur-md'}`}
            />
        </div>
    );
};

export default AlbumCover;
