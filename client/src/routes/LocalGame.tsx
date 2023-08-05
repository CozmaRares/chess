import { useState } from "react";
import Chess, { Move } from "../../../server/src/engine";
import ChessUI from "../components/ChessUI";

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
        <ChessUI
            chess={chess}
            makeMove={makeMove}
            blackPerspective={blackPerspective}
            newGame={newGame}
            switchSides={switchSides}
            undo={undo}
            redo={redo}
        />
    );
};

export default LocalGame;
