import { ReactNode, useEffect, useRef } from "react";
import Chess from "../../../server/src/engine";

const History: React.FC<{
    chess: Chess;
    buttons?: Array<{ onClick: () => void; title: string; icon: ReactNode }>;
}> = ({ chess, buttons }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const historyRef = useRef<HTMLDivElement>(null);

    const { currentPosition, history: moveHistory } = chess.getHistory();

    useEffect(() => {
        // HACK: couldn't find any other way for ChessBoard and History to have the same height
        setTimeout(() => {
            const chessboard = document.querySelector(
                "#chessboard"
            ) as HTMLDivElement;
            const { height } = chessboard.getBoundingClientRect();
            const containerDiv = containerRef.current as HTMLDivElement;
            containerDiv.style.setProperty("max-height", `${height}px`);
        }, 100);

        const historyDiv = historyRef.current as HTMLDivElement;
        historyDiv.scrollTop = historyDiv.scrollHeight;
    }, [moveHistory.length]);

    const history: ReactNode[] = [];

    moveHistory.forEach(({ san }, idx) => {
        const fullMove = (idx >> 1) + 1;
        const current = idx == currentPosition ? "bg-gray-500/80" : "";

        if (idx % 2 == 0)
            history.push(
                <span key={idx} className="px-2 py-1">
                    {fullMove}.
                </span>
            );

        history.push(
            <span key={idx + san} className="py-1">
                <span className={`inline-block h-full w-2/3 rounded-md ${current}`}>
                    {san}
                </span>
            </span>
        );
    });

    if (history.length % 3) history.push(<span key="__history-last__"></span>);

    return (
        <div
            ref={containerRef}
            className="bg-zinc-800 rounded-lg text-white hidden md:grid grid-rows-[auto,1fr,auto]"
        >
            <div className="text-xl text-center my-1 mx-4 border-b">History</div>
            <div
                ref={historyRef}
                className="p-4 min-w-[13rem] h-fit max-h-full overflow-y-scroll overflow-x-hidden grid grid-cols-[auto,1fr,1fr] gap-y-2 text-center [&>:nth-child(3n)]:rounded-r-md [&>:nth-child(3n-2)]:rounded-l-md [&>:not(:nth-child(3n-2))]:font-bold [&>:nth-child(6n)]:bg-zinc-600 [&>:nth-child(6n-1)]:bg-zinc-600 [&>:nth-child(6n-2)]:bg-zinc-600"
            >
                {history}
            </div>
            <div className="bg-black grid auto-cols-fr grid-flow-col gap-5 p-4 rounded-b-lg empty:hidden">
                {buttons?.map(({ onClick, title, icon }) => (
                    <Button key={title} title={title} onClick={onClick}>
                        {icon}
                    </Button>
                ))}
            </div>
        </div>
    );
};

const Button: React.FC<{
    children: React.ReactNode;
    title: string;
    disabled?: boolean;
    onClick: () => void;
}> = ({ children, title, disabled, onClick }) => (
    <button
        className="relative min-w-[1rem] mt-auto bg-zinc-800 flex justify-center items-center p-2 rounded-md hover:bg-zinc-900 transition-colors group capitalize"
        onClick={onClick}
        disabled={disabled}
    >
        <span className="absolute -top-full left-1/2 -translate-x-1/2 bg-black rounded-md py-0.5 px-2 whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity delay-100">
            {title}
        </span>
        {children}
    </button>
);

export default History;
