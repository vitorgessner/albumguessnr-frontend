import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import Form from "@/features/auth/components/form/Form";
import useGuessStore from "../../guess/stores/useGuessStore";
import { ChevronsRight } from 'lucide-react';

const ConfigComponent = () => {
    const [isExpanded, setIsExpanded] = useState<boolean>(true);
    const { config, setConfig } = useGuessStore();
    const { isGuessed } = useGuessStore();
    return (
        <div className="absolute left-0 top-12 bottom-0 text-(--text) w-66" 
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
        >
            <aside className={`h-full flex flex-col transition-all max-w-66 duration-400 ease-in-out -ml-60 ${isExpanded && 'translate-x-60'}`}>
                <div className='flex flex-col h-full pt-5 px-10 gap-3 text-lg bg-(--accent-secondary-color)'>
                    <h2 className="text-2xl">Guessing options</h2>
                    <Form.Label className="mt-4">
                        Guess artist: <Switch id="artist" disabled={!isGuessed} defaultChecked={config.artist} onCheckedChange={() => {
                            setConfig({ ...config, artist: !config.artist, });
                        }} />
                    </Form.Label>
                    <Form.Label>
                        Guess genre: <Switch id="genre" disabled={!isGuessed} defaultChecked={config.genre} onCheckedChange={() => setConfig({ ...config, genre: !config.genre, })} />
                    </Form.Label>
                    <Form.Label>
                        Guess year: <Switch id="year" disabled={!isGuessed} defaultChecked={config.year} onCheckedChange={() => setConfig({ ...config, year: !config.year, })} />
                    </Form.Label>
                    <Form.Label>
                        Guess tracklist: <Switch id="tracklist" disabled={!isGuessed} defaultChecked={config.tracklist} onCheckedChange={() => setConfig({ ...config, tracklist: !config.tracklist, })} />
                    </Form.Label>
                    <span className="max-w-[206px] text-base text-(--error-text) mt-3">{!isGuessed && 'You need to answer first before changing config'}</span>
                </div>
                <div className="flex h-full relative bg-(--accent-secondary-color)"><ChevronsRight size={30} className="absolute right-0 rounded-xs bg-(--accent-secondary-color)" /></div>
            </aside>
        </div>
    )
}

export default ConfigComponent