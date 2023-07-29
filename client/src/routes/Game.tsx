import Chess, { COLOR, Move } from "../../../server/src/engine";
import { useState, useEffect } from "react";
import ChessBoard from "../components/Chessboard";
import { useLocation, useNavigate } from "react-router-dom";
import useCopyToClipboard from "../utils/useCopyToClipboard";

import { socket } from "../sockets/socket";
import { CopyIcon } from "../utils/icons";
import Show from "../utils/Show";

const Game = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  const { id, color } =
    state != null ? state : { id: undefined, color: undefined };

  const [chess] = useState(Chess.load());
  const [game, setGame] = useState(false);

  const makeMove = (move: Move) => {
    socket.emit("make move", id, move);
    chess.makeMove(move);
  };

  useEffect(() => {
    console.log({ id, color });

    if (id == undefined || color == undefined)
      return navigate("/", {
        state: { error: "Did not receive a game ID or color." },
      });

    socket.connect();

    socket.on("connect", () => {
      console.log("Connected to socket", socket.id);
      socket.emit("join game", id, color);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected");
    });

    socket.on("join error", () => {
      socket.disconnect();
      navigate("/", {
        state: { error: "Could not join, please try again." },
      });
    });

    socket.on("start game", () => setGame(true));

    // TODO: board doesn't rerender
    socket.on("receive move", (move: Move) => {
      chess.makeMove(move);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <Show when={game} fallback={<Waiting id={id} />}>
      <ChessBoard
        key={chess.getFEN()}
        chess={chess}
        makeMove={makeMove}
        blackPerspective={color === COLOR.BLACK}
      />
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
