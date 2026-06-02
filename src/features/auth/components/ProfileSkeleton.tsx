import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const ProfileSkeleton = () => {
    return (
        <main className="min-h-dvh py-6 pb-20 px-4">
            <div className="max-w-5xl mx-auto flex flex-col profile-grid gap-4">
                <section className="order-1 lg:order-2 min-w-0 w-full">
                    <article className="w-82 mx-auto flex flex-col gap-4 p-5 text-center bg-(--card-light) border-2 border-border rounded-xl shadow-[3px_3px_0_var(--border)]">
                        <div className='flex flex-col'>
                            <div className="flex flex-col items-center gap-2 text-center">
                                <Skeleton circle width={108} height={108} />
                                <div className="min-w-0 w-full flex flex-col items-center gap-1">
                                    <Skeleton width={120} height={28} />
                                    <Skeleton width={140} height={14} />
                                </div>
                            </div>

                            <Skeleton height={57} borderRadius={8} />
                        </div>

                        <div className="flex flex-col gap-[14px]">
                            <div className="grid grid-cols-3 gap-2">
                                {Array.from({ length: 3 }).map((_, i) => (
                                    <Skeleton key={i} height={73} borderRadius={8} />
                                ))}
                            </div>
                            <Skeleton width={185} height={14} className="mx-auto" />
                        </div>
                    </article>
                </section>

                <section className="order-2 lg:order-1 min-w-0 w-full h-full min-h-103">
                    <article className="max-h-103 flex flex-col bg-(--card-light) border-2 border-border rounded-xl shadow-[3px_3px_0_var(--border)] overflow-hidden h-full min-h-full">
                        <div className="shrink-0 py-3 px-5 border-b-2 border-border">
                            <Skeleton width={120} height={24} />
                        </div>
                        <div className="overflow-y-auto">
                            <ul className="grid grid-cols-6 p-3 gap-1">
                                {Array.from({ length: 48 }).map((_, i) => (
                                    <li key={i} className="py-1.5 flex items-center justify-center">
                                        <Skeleton circle width={28} height={28} />
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </article>
                </section>
            </div>
        </main>
    );
};

export default ProfileSkeleton;
