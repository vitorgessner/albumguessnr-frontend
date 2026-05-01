import { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import Form from '@/features/auth/components/form/Form';
import useGuessStore from '../../guess/stores/useGuessStore';
import { ChevronsRight } from 'lucide-react';

const ConfigComponent = () => {
    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const { config, setConfig } = useGuessStore();
    const { isGuessed } = useGuessStore();
    return (
        <div
            className="fixed lg:absolute left-0 lg:top-12 bottom-0 z-9 min-w-dvw w-full lg:min-w-fit lg:w-fit lg:pr-60 text-(--text) bg-(--card-light) lg:bg-transparent"
            onMouseEnter={() => setIsExpanded(true)}
            onMouseLeave={() => setIsExpanded(false)}
        >
            <aside
                className={`flex flex-col left-0 ${!isGuessed ? '-mb-70' : '-mb-58'} pb-10 h-full min-w-dvw w-full lg:w-fit lg:min-w-fit lg:-ml-60 transition-all max-w-66 bg-(--card-light) border-t-2 border-border lg:bg-(--card-light) duration-400 ease-in-out ${isExpanded && (`lg:translate-x-60 lg:translate-y-0 ${!isGuessed ? '-translate-y-70' : '-translate-y-50' }`)}`}
            >
                <div
                    className={`flex flex-col mx-auto pt-3 px-10 gap-3 text-lg bg-(--card-light) lg:bg-(--card-light) border-border`}
                >
                    <h2 className="text-2xl">Guessing options</h2>
                    <Form.Label className="mt-4 w-full">
                        <div className="flex flex-row items-center justify-between w-full">
                            Guess artist:
                            <Switch
                                id="artist"
                                disabled={!isGuessed}
                                defaultChecked={config.artist}
                                onCheckedChange={() => {
                                    setConfig({ ...config, artist: !config.artist });
                                }}
                            />
                        </div>
                    </Form.Label>
                    <Form.Label className='w-full'>
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
                    <Form.Label className='w-full'>
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
                    <Form.Label className='w-full'>
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
                <div className="flex h-full relative bg-(--card-light)">
                    <ChevronsRight
                        size={30}
                        className="lg:absolute right-0 rounded-xs bg-(--card-light) hidden lg:block"
                    />
                </div>
            </aside>
        </div>
    );
};

export default ConfigComponent;
