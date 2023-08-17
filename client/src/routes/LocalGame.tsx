import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Chess, { Move } from "../../../server/src/engine";
import ChessUI from "../components/ChessUI";
import {
    ArrowLeft,
    CaretLeft,
    CaretRight,
    Plus,
    Repeat,
} from "../components/icons";
import InferProps from "../utils/InferProps";

const LocalGame = () => {
    const [chess, setChess] = useState(Chess.load());
    const [blackPerspective, setBlackPerspective] = useState(false);
    const [, aux] = useState(false);
    const navigate = useNavigate();

    const rerender = () => aux((prev) => !prev);

    const makeMove = (move: Move) => {
        if (chess.didUndo()) chess.undoMoves();

        chess.makeMove(move);
        rerender();
    };

    const buttons: Pick<InferProps<[typeof ChessUI]>, "buttons">["buttons"] = [
        {
            onClick: () => navigate("/"),
            title: "to main page",
            icon: <ArrowLeft />,
        },
        {
            onClick: () => setChess(Chess.load()),
            title: "new game",
            icon: <Plus />,
        },
        {
            onClick: () => setBlackPerspective((prev) => !prev),
            title: "switch sides",
            icon: <Repeat />,
        },
        {
            onClick: () => {
                chess.undo();
                rerender();
            },
            title: "undo",
            icon: <CaretLeft />,
        },
        {
            onClick: () => {
                chess.redo();
                rerender();
            },
            title: "redo",
            icon: <CaretRight />,
        },
    ];

    return (
        <ChessUI
            chess={chess}
            makeMove={makeMove}
            blackPerspective={blackPerspective}
            buttons={buttons}
        />
    );
};

export default LocalGame;
