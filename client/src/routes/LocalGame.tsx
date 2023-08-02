import { useState } from "react";
import Chess, { Move } from "../../../server/src/engine";
import ChessBoard from "../components/Chessboard";
import History from "../components/History";

const LocalGame = () => {
    const [chess, setChess] = useState(Chess.load());
    const [blackPerspective, setBlackPerspective] = useState(false);
    const [, aux] = useState(false);

    const rerender = () => aux((prev) => !prev);

    const makeMove = (move: Move) => {
        chess.makeMove(move);
        rerender();
    };

    const newGame = () => setChess(Chess.load());
    const switchSides = () => setBlackPerspective((prev) => !prev);
    const undo = () => {
        chess.undo();
        rerender();
    };
    const redo = () => {
        chess.redo();
        rerender();
    };

    return (
        <div className="mt-4 flex flex-row gap-4 justify-center">
            <ChessBoard
                chess={chess}
                makeMove={makeMove}
                blackPerspective={blackPerspective}
            />
            <History
                chess={chess}
                newGame={newGame}
                switchSides={switchSides}
                undo={undo}
                redo={redo}
            />
        </div>
    );
};

export default LocalGame;
