import Chess, { COLOR, Move } from "../../../server/src/engine";
import { useState, useEffect } from "react";
import ChessBoard from "../components/Chessboard";
import { useLocation, useNavigate } from "react-router-dom";
import useCopyToClipboard from "../utils/useCopyToClipboard";

import { socket } from "../sockets/socket";
import { CopyIcon } from "../utils/icons";
import Show from "../utils/Show";
import ErrorNorification from "../utils/ErrorNotification";
import Modal, { ModalButton } from "../utils/Modal";

const Game = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  const { id, color } =
    state != null ? state : { id: undefined, color: undefined };

  const [chess] = useState(Chess.load());
  const [game, setGame] = useState(false);
  const [, rerender] = useState(false);
  const [err, setErr] = useState<Error>();

  const makeMove = (move: Move) => socket.emit("make move", id, move);

  useEffect(() => {
    if (id == undefined || color == undefined)
      return navigate("/", {
        state: { error: "Did not receive a game ID or color." },
      });

    socket.connect();

    socket.on("connect", () => {
      socket.emit("join game", id, color);
    });

    socket.on("join error", () => {
      navigate("/", {
        state: { error: "Could not join, please try again." },
      });
    });

    socket.on("move error", (message: string) => {
      setErr(new Error(message));
    });

    socket.on("start game", () => setGame(true));

    socket.on("receive move", (move: Move) => {
      chess.makeMove(move);
      rerender((prev) => !prev);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <Show when={game} fallback={<Waiting id={id} />}>
      <ErrorNorification
        error={err?.message}
        removeError={() => setErr(undefined)}
      />
      <ChessBoard
        key={chess.getFEN()}
        chess={chess}
        makeMove={makeMove}
        blackPerspective={color === COLOR.BLACK}
        disabled={color !== chess.getTurn()}
      />
      <Show when={chess.isGameOver()}>
        <Modal overlay>
          <div className="text-center w-40 max-w-full">
            <h2 className="text-2xl mb-2">Game Over</h2>
            <h1 className="text-lg font-bold">
              {chess.isCheckMate()
                ? (chess.getTurn() == color ? "Opponent" : "You") + " won!"
                : "It's a draw!"}
            </h1>
            <div className="w-full h-[4px] rounded-b-lg bg-white mb-4"></div>
            <ModalButton onClick={() => navigate("/")}>
              Go to main page
            </ModalButton>
          </div>
        </Modal>
      </Show>
    </Show>
  );
};

const Waiting: React.FC<{
  id: string;
}> = ({ id }) => {
  const [, copyToClipboard] = useCopyToClipboard();
  const [hasCopied, setHasCopied] = useState(false);

  return (
    <div className="ml-2">
      <div className="loading text-lg">Waiting for opponent to join</div>
      <div>
        Share this ID with your friend:
        <div className="bg-gray-800 text-white p-2 rounded-md w-fit">
          <code className="mr-4">{id}</code>
          <button
            className="inline-flex flex-row gap-1 justify-center items-center border border-white p-1 text-xs rounded-md"
            onClick={() => {
              copyToClipboard(id);
              setHasCopied(true);
            }}
          >
            <CopyIcon /> {hasCopied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Game;
