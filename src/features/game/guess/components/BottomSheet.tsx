import { X } from "lucide-react";

const BottomSheet = ({
    open,
    onClose,
    children,
    title,
}: {
    open: boolean;
    onClose: () => void;
    children: React.ReactNode;
    title: string;
}) => (
    <>
        <div
            onClick={onClose}
            className={`lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        />
        <div
            className={`lg:hidden fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl border-t-2 border-border bg-(--card-light) transition-transform duration-300 ease-out ${open ? 'translate-y-0' : 'translate-y-full'}`}
            style={{ maxHeight: '80dvh' }}
        >
            <div className="relative flex items-center justify-between px-5 pt-4 pb-2 border-b border-border">
                <span className="w-10 h-1 rounded-full bg-border absolute left-1/2 -translate-x-1/2 top-2 opacity-40" />
                <h2 className="text-lg font-bold">{title}</h2>
                <button
                    onClick={onClose}
                    className="p-1 rounded-full hover:bg-(--secondary-color) transition-colors"
                    aria-label="Fechar"
                >
                    <X size={20} />
                </button>
            </div>
            <div className="overflow-y-auto" style={{ maxHeight: 'calc(80dvh - 52px)' }}>
                {children}
            </div>
        </div>
    </>
);

export default BottomSheet;