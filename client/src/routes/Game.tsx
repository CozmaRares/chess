import Chess, { Move } from "../../../server/src/chess/engine";
import { useState } from "react";
import ChessBoard from "../components/Chessboard";

const App = () => {
  const [chess] = useState(Chess.load());
  const [, setUpdate] = useState(false);

  const sendMove = (move: Move) => {
    chess.makeMove(move);
  };

  return (
    <>
      <ChessBoard key={chess.getFEN()} chess={chess} sendMove={sendMove} />
      <button
        onClick={() => {
          chess.undo();
          setUpdate((prev) => !prev);
        }}
      >
        undo
      </button>
    </>
  );
};

export default App;
