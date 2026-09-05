import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { NotebookText } from 'lucide-react';

export const Header = ({ totalGuessesCount }: { totalGuessesCount: number | undefined }) => {
    const word = totalGuessesCount === 1 ? 'person' : 'people';
    return (
        <div className="text-center">
            <h1 className="flex justify-center items-center gap-1 relative w-fit mx-auto font-heading font-black text-3xl text-navy tracking-tight">
                Daily Album
                <Dialog>
                    <DialogTrigger>
                        <NotebookText />
                    </DialogTrigger>
                    <DialogContent>
                        <DialogTitle className="font-heading font-black text-xl text-center">
                            Updates
                        </DialogTitle>
                        <DialogDescription className="text-navy">
                            <ul>
                                <li>
                                    Currently all daily album data comes from a dataset of the most popular albums in RateYourMusic based in 2022. The plan is to update that soon.
                                </li>
                            </ul>
                        </DialogDescription>
                    </DialogContent>
                </Dialog>
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
                <span className="font-bold text-terra-dark">
                    {totalGuessesCount || 0} {word}{' '}
                </span>
                guessed today
            </p>
        </div>
    );
};
