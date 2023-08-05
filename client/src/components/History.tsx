import { ReactNode, useEffect, useRef } from "react";
import Chess from "../../../server/src/engine";
import { CaretLeft, CaretRight, Plus, Repeat } from "../components/icons";

const History: React.FC<{
    chess: Chess;
    newGame?: () => void;
    switchSides?: () => void;
    undo?: () => void;
    redo?: () => void;
}> = ({ chess, newGame, switchSides, undo, redo }) => {
    const historyRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const div = historyRef.current as HTMLDivElement;
        if (div) div.scrollTop = div.scrollHeight;
    }, [chess.getHistory().length]);

    const history: ReactNode[] = [];

    chess.getHistory().forEach(({ san }, idx) => {
        const idk = (idx >> 1) + 1;
        const bg = idk % 2 == 0 ? "bg-zinc-600" : "";

        if (idx % 2 == 0)
            history.push(
                <span key={idx} className={`px-2 ${bg}`}>
                    {idk}.
                </span>
            );

        history.push(
            <span key={idx + san} className={bg}>
                {san}
            </span>
        );
    });

    if (history.length % 3)
        history.push(
            <span
                key="__history-last__"
                className={((history.length + 1) / 3) % 2 == 0 ? "bg-zinc-600" : ""}
            ></span>
        );

    return (
        <div className="bg-zinc-800 rounded-lg text-white grid grid-rows-[auto,1fr,auto]">
            <div className="text-xl text-center my-1 mx-4 border-b ">History</div>
            <div
                ref={historyRef}
                className="p-4 min-w-[13rem] h-fit max-h-full overflow-scroll grid grid-cols-[auto,1fr,1fr] gap-y-2 text-center [&>:nth-child(3n)]:rounded-r-md [&>:nth-child(3n-2)]:rounded-l-md"
            >
                {history}
            </div>
            <div className="bg-black grid auto-cols-fr grid-flow-col gap-5 p-4 rounded-b-lg empty:hidden">
                {newGame && (
                    <Button title="New Game" onClick={newGame}>
                        <Plus />
                    </Button>
                )}
                {switchSides && (
                    <Button title="Switch Sides" onClick={switchSides}>
                        <Repeat />
                    </Button>
                )}
                {undo && (
                    <Button title="Undo" onClick={undo}>
                        <CaretLeft />
                    </Button>
                )}
                {redo && (
                    <Button title="Redo" onClick={redo}>
                        <CaretRight />
                    </Button>
                )}
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
        className="relative min-w-[1rem] mt-auto bg-zinc-800 flex justify-center items-center p-2 rounded-md hover:bg-zinc-900 transition-colors group"
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