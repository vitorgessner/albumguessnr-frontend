import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import FriendsLeaderboard from './FriendsLeaderboard';

const ProfileSkeleton = () => {
    return (
        <main className="min-h-dvh h-full py-4 pb-16 lg:w-fit lg:mx-auto lg:h-full lg:min-h-dvh">
            <div className="flex flex-col lg:flex-row justify-center gap-8">
                <section className="grow h-full z-1 order-1 lg:order-2 text-center">
                    <article className="w-fit mx-auto p-3 px-7 bg-(--card-light) border-2 border-border rounded-lg">
                        <Skeleton
                            width={150}
                            height={150}
                            className="mx-auto rounded-full size-37.5 object-cover object-center mb-2"
                            circle
                        />
                        <Skeleton
                            width={260}
                            className="text-3xl font-bold"
                        />
                        <Skeleton
                            width={260}
                            className="text-xs mb-2"
                        />
                        <Skeleton
                            width={292}
                            height={94.5}
                            className=" h-full rounded-3xl px-3 pt-5 pb-1"
                        />
                        <Skeleton
                            width={180}
                            className="flex justify-center items-center mt-2 text-xl"
                        />
                        <Skeleton width={130} />
                        <Skeleton width={130} />
                    </article>
                </section>
                <section className="order-2 lg:order-1 mx-auto lg:mx-0">
                    <article className="max-h-99 px-2 pb-1 text-center bg-(--card-light) border-2 border-border overflow-scroll rounded-lg">
                        <h2 className="sticky top-0 py-2 text-2xl font-bold bg-(--card-light)">
                            <Skeleton />
                        </h2>
                        <ul className="flex flex-wrap w-75">
                            {Array.from({ length: 48 }).map((_,i) => {
                                return (
                                    <li key={i} className="text-3xl py-1 achievements">
                                        <Skeleton width={35} height={35} circle/>
                                    </li>
                                );
                            })}
                        </ul>
                    </article>
                </section>
                <section className="order-3 mx-auto lg:mx-0">
                    <FriendsLeaderboard />
                </section>
            </div>
            {/* <h2 className="m-4 text-2xl text-center font-bold">Favorite albums</h2>
            <article className="order-4 flex flex-row flex-wrap mx-8 justify-center items-center gap-3 h-fit">
                {Array.from({ length: 4 }).map(() => {
                    return (
                        <div
                            className={`flex size-39 lg:size-55 overflow-hidden rounded-sm border-2 border-border`}
                        >
                            <img
                                src="../../src/assets/the now now and never.jpg"
                                className=""
                                alt=""
                            />
                        </div>
                    );
                })}
            </article> */}
        </main>
    );
};

export default ProfileSkeleton;
