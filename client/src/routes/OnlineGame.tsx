import Chess, { COLOR, Move } from "../../../server/src/engine";
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useCopyToClipboard from "../hooks/useCopyToClipboard";

import { socket } from "../utils/socket";
import { CaretLeft, CaretRight, CopyIcon } from "../components/icons";
import Show from "../utils/Show";
import ErrorNorification from "../components/ErrorNotification";
import ChessUI from "../components/ChessUI";
import { removeLocationState } from "../utils/utils";
import InferProps from "../utils/InferProps";

const Game = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  const { id, color } =
    state != null ? state : { id: undefined, color: undefined };

  const [chess] = useState(Chess.load());
  const [game, setGame] = useState(false);
  const [, aux] = useState(false);
  const [err, setErr] = useState<Error>();
  const [opponentDisconnect, setOpponentDisconnect] = useState(false);

  const makeMove = (move: Move) => socket.emit("make move", id, move);
  const rerender = () => aux((prev) => !prev);

  useEffect(() => {
    if (id == undefined || color == undefined) return navigate("/");

    socket.connect();

    socket.on("connect", () => {
      socket.emit("join game", id, color);
      removeLocationState();
    });

    socket.on("connect_error", () => {
      navigate("/", {
        state: { error: "Could not join, please try again." },
      });
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
      rerender();
    });

    socket.on("opponent disconnect", () => setOpponentDisconnect(true));

    return () => {
      socket.off();
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (opponentDisconnect)
      navigate("/", {
        state: { error: "Opponent disconnected" },
      });
  }, [opponentDisconnect]);

  const buttons: Pick<InferProps<[typeof ChessUI]>, "buttons">["buttons"] = [
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
    <Show when={game} fallback={<Waiting id={id} />}>
      <ErrorNorification
        error={err?.message}
        removeError={() => setErr(undefined)}
      />
      <ChessUI
        key={chess.getFEN()}
        chess={chess}
        makeMove={makeMove}
        blackPerspective={color === COLOR.BLACK}
        disabled={color !== chess.getTurn() || chess.didUndo()}
        buttons={buttons}
      />
    </Show>
  );
};

const Waiting: React.FC<{
  id: string;
}> = ({ id }) => {
  const [{ error }, copyToClipboard] = useCopyToClipboard();
  const [hasCopied, setHasCopied] = useState(false);

  return (
    <>
      <ErrorNorification error={error == null ? undefined : error.message} />
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
    </>
  );
};

export default Game;
