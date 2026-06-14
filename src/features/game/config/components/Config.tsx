import { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import Form from '@/features/auth/components/form/Form';
import useGuessStore from '../../guess/stores/useGuessStore';
import { ChevronsLeft, ChevronsRight } from 'lucide-react';

const ConfigComponent = ({ inSheet }: { inSheet?: boolean }) => {
    const { isGuessed } = useGuessStore();
    const { config, setConfig } = useGuessStore();
    const [isPinned, setIsPinned] = useState<boolean>(false);
    const [isHovered, setIsHovered] = useState<boolean>(false);
    const [prevIsGuessed, setPrevIsGuessed] = useState<boolean>(isGuessed);
    const isExpanded = isPinned || isHovered;

    if (prevIsGuessed !== isGuessed) {
        setPrevIsGuessed(isGuessed);
        if (isGuessed) setIsPinned(true);
        if (!isGuessed) setIsPinned(false);
    }

    if (inSheet) {
        return (
            <div className="flex flex-col px-6 py-4 gap-3 text-lg">
                <h2 className="text-2xl">Guessing options</h2>
                <Form.Label className="mt-2 w-full">
                    <div className="flex flex-row items-center justify-between w-full">
                        Guess artist:
                        <Switch
                            id="artist"
                            disabled={!isGuessed}
                            defaultChecked={config.artist}
                            onCheckedChange={() => setConfig({ ...config, artist: !config.artist })}
                        />
                    </div>
                </Form.Label>
                <Form.Label className="w-full">
                    <div className="flex flex-row items-center justify-between w-full">
                        Guess genre:
                        <Switch
                            id="genre"
                            disabled={!isGuessed}
                            defaultChecked={config.genre}
                            onCheckedChange={() => setConfig({ ...config, genre: !config.genre })}
                        />
                    </div>
                </Form.Label>
                <Form.Label className="w-full">
                    <div className="flex flex-row items-center justify-between w-full">
                        Guess year:
                        <Switch
                            id="year"
                            disabled={!isGuessed}
                            defaultChecked={config.year}
                            onCheckedChange={() => setConfig({ ...config, year: !config.year })}
                        />
                    </div>
                </Form.Label>
                <Form.Label className="w-full">
                    <div className="flex flex-row items-center justify-between w-full">
                        Guess tracklist:
                        <Switch
                            id="tracklist"
                            disabled={!isGuessed}
                            defaultChecked={config.tracklist}
                            onCheckedChange={() =>
                                setConfig({ ...config, tracklist: !config.tracklist })
                            }
                        />
                    </div>
                </Form.Label>
                <span className="text-base text-(--error-text) mt-1">
                    {!isGuessed && 'You need to answer first before changing config'}
                </span>
            </div>
        );
    }

    return (
        <div
            className="fixed lg:absolute left-0 lg:top-12 bottom-0 z-9 min-w-dvw w-full lg:min-w-fit lg:w-fit lg:pr-60 text-(--text) bg-(--card-light) lg:bg-transparent"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <aside
                className={`flex flex-col left-0 ${!isGuessed ? '-mb-70' : '-mb-58'} pb-10 h-full min-w-dvw w-full lg:w-fit lg:min-w-fit lg:-ml-60 transition-all max-w-66 bg-(--card-light) border-t-2 border-border lg:bg-(--card-light) duration-400 ease-in-out translate-x-5 ${isHovered && `lg:translate-x-60`} ${isExpanded && `xl:translate-x-60 lg:translate-x-5`}`}
            >
                <div className="flex flex-col mx-auto pt-3 px-5 gap-3 text-lg bg-(--card-light) lg:bg-(--card-light) border-border">
                    <h2 className="text-2xl">Guessing options</h2>
                    <Form.Label className="mt-4 w-full">
                        <div className="flex flex-row items-center justify-between w-full">
                            Guess artist:
                            <Switch
                                id="artist"
                                disabled={!isGuessed}
                                defaultChecked={config.artist}
                                onCheckedChange={() =>
                                    setConfig({ ...config, artist: !config.artist })
                                }
                            />
                        </div>
                    </Form.Label>
                    <Form.Label className="w-full">
                        <div className="flex flex-row items-center justify-between w-full">
                            Guess genre:
                            <Switch
                                id="genre"
                                disabled={!isGuessed}
                                defaultChecked={config.genre}
                                onCheckedChange={() =>
                                    setConfig({ ...config, genre: !config.genre })
                                }
                            />
                        </div>
                    </Form.Label>
                    <Form.Label className="w-full">
                        <div className="flex flex-row items-center justify-between w-full">
                            Guess year:
                            <Switch
                                id="year"
                                disabled={!isGuessed}
                                defaultChecked={config.year}
                                onCheckedChange={() => setConfig({ ...config, year: !config.year })}
                            />
                        </div>
                    </Form.Label>
                    <Form.Label className="w-full">
                        <div className="flex flex-row items-center justify-between w-full">
                            Guess tracklist:
                            <Switch
                                id="tracklist"
                                disabled={!isGuessed}
                                defaultChecked={config.tracklist}
                                onCheckedChange={() =>
                                    setConfig({ ...config, tracklist: !config.tracklist })
                                }
                            />
                        </div>
                    </Form.Label>
                    <span className="max-w-[206px] text-base text-(--error-text) mt-3">
                        {!isGuessed && 'You need to answer first before changing config'}
                    </span>
                </div>
                <div className="flex h-full relative bg-(--card-light) rounded-md">
                    {!isExpanded ? (
                        <ChevronsRight
                            size={30}
                            className="lg:absolute h-20 w-8 -right-7 rounded-xs bg-(--card-light) hidden lg:block cursor-pointer"
                        />
                    ) : (
                        <ChevronsLeft
                            size={30}
                            className="lg:absolute h-20 w-8 -right-7 rounded-xs bg-(--card-light) hidden lg:block cursor-pointer"
                            onClick={() => {
                                setIsPinned(false);
                                setIsHovered(false);
                            }}
                        />
                    )}
                </div>
            </aside>
        </div>
    );
};

export default ConfigComponent;
