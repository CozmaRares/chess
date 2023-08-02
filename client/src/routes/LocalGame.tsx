import { ReactNode, useState } from "react";
import Chess, { Move } from "../../../server/src/engine";
import ChessBoard from "../components/Chessboard";
import { CaretLeft, CaretRight, Plus, Repeat } from "../components/icons";

const LocalGame = () => {
    const [chess] = useState(Chess.load());
    const [, rerender] = useState(false);

    const makeMove = (move: Move) => {
        chess.makeMove(move);
        rerender((prev) => !prev);
    };

    const history: ReactNode[] = new Array((chess.getHistory().length + 1) >> 1);

    const chessHistory = chess.getHistory();

    let idx = 0;
    for (let i = 1; i < chessHistory.length; i += 2)
        history[idx++] = (
            <div key={idx} className="flex flex-row gap-4">
                <span>{idx}.</span>
                <span>{chessHistory[i - 1].san}</span>
                <span>{chessHistory[i].san}</span>
            </div>
        );

    if (chessHistory.length % 2)
        history[idx++] = (
            <div key={idx} className="flex flex-row gap-4">
                <span>{idx}.</span>
                <span>{chessHistory.at(-1)?.san}</span>
                <span className="w-1"></span>
            </div>
        );

    return (
        <div className="mt-4 flex flex-row gap-4 justify-center">
            <ChessBoard chess={chess} makeMove={makeMove} />
            <div className="text-white grid grid-rows-[1fr,auto]">
                <div className="bg-zinc-800 p-4 rounded-t-lg">{history}</div>
                <div className="bg-black grid grid-cols-4 gap-5 p-4 rounded-b-lg">
                    {/* TODO: */}
                    <Button title="New Game">
                        <Plus />
                    </Button>
                    <Button title="Switch Sides">
                        <Repeat />
                    </Button>
                    <Button title="Undo">
                        <CaretLeft />
                    </Button>
                    <Button title="Redo">
                        <CaretRight />
                    </Button>
                </div>
            </div>
        </div>
    );
};

const Button: React.FC<{
    children: React.ReactNode;
    title: string;
}> = ({ children, title }) => (
    <button className="relative min-w-[1rem] mt-auto bg-zinc-800 flex justify-center items-center p-2 rounded-md hover:bg-zinc-900 transition-colors group">
        <span className="absolute -top-full left-1/2 -translate-x-1/2 bg-black rounded-md py-0.5 px-2 whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity delay-100">
            {title}
        </span>
        {children}
    </button>
);

export default LocalGame;
