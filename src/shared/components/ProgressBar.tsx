import { Progress } from '@/components/ui/progress'
import { useSyncStatusStore } from '@/features/game/guess/stores/useSyncStatusStore'

export const ProgressBar = () => {
    const { status, albumsCount} = useSyncStatusStore();

    const syncing = status === 'SYNCING';
    const progress = albumsCount ? Math.min(100, (albumsCount / 150) * 100) : 0;

    return (
        syncing && <div id='progress-footer' className='relative flex justify-center items-end text-base text-center h-dvh pt-2'>
            <Progress value={progress} className='h-4 w-full text-base animate-pulse'></Progress>
            <p className={`absolute -bottom-[2px] text-navy text-sm font-bold font-heading`}>Syncing albums {Math.round(progress)}%</p>
        </div>
    )
}
