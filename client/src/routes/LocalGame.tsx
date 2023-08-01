import { ReactNode, useState } from "react";
import Chess, { Move } from "../../../server/src/engine";
import ChessBoard from "../components/Chessboard";
import { CaretRight, Plus, Repeat } from "../utils/icons";

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
                    <Button>
                        <Plus />
                    </Button>
                    <Button>
                        <Repeat />
                    </Button>
                    <Button className="rotate-180">
                        <CaretRight />
                    </Button>
                    <Button>
                        <CaretRight />
                    </Button>
                </div>
            </div>
        </div>
    );
};

const Button: React.FC<{ children: React.ReactNode; className?: string }> = ({
    children,
    className,
}) => (
    <button
        className={
            "min-w-[1rem] mt-auto bg-zinc-800 flex justify-center items-center p-2 rounded-md " +
            (className ?? "")
        }
    >
        {children}
    </button>
);

export default LocalGame;
