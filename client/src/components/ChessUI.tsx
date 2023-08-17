import { useNavigate } from "react-router-dom";
import { COLOR } from "../../../server/src/engine";
import InferProps from "../utils/InferProps";
import Show from "../utils/Show";
import ChessBoard from "./Chessboard";
import History from "./History";
import Modal, { ModalButton } from "./Modal";
import { useState } from "react";

const ChessUI: React.FC<InferProps<[typeof ChessBoard, typeof History]>> = (
  props
) => {
  const [showModal, setShowModal] = useState(true);
  const navigate = useNavigate();
  const chess = props.chess;
  const currentChess = chess.getCurrentBoardPosition();

  return (
    <>
      <div className="w-screen h-screen flex items-center justify-center">
        <div className="m-4 flex flex-row gap-4">
          <ChessBoard
            key={`${props.blackPerspective}` + currentChess.getFEN()}
            {...props}
            chess={currentChess}
            disabled={(props.disabled ?? false) || chess.isGameOver()}
          />
          <History {...props} />
        </div>
      </div>
      <Show when={showModal && chess.isGameOver()}>
        <Modal enableOverlay>
          <div className="text-center w-50 max-w-full">
            <h2 className="text-2xl mb-2">Game Over</h2>
            <h1 className="text-lg font-bold">
              {chess.isCheckMate()
                ? (chess.getTurn() == COLOR.WHITE ? "Black" : "White") + " won!"
                : "It's a draw!"}
            </h1>
            <div className="w-full h-[4px] rounded-b-lg bg-white mb-4"></div>
            <ModalButton onClick={() => navigate("/")}>
              Go to main page
            </ModalButton>
            <ModalButton onClick={() => setShowModal(false)}>Close</ModalButton>
          </div>
        </Modal>
      </Show>
    </>
  );
};

export default ChessUI;
