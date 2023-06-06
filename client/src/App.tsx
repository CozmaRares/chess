import wp from "./assets/pieces/wp.png";
import wn from "./assets/pieces/wn.png";
import wb from "./assets/pieces/wb.png";
import wr from "./assets/pieces/wr.png";
import wq from "./assets/pieces/wq.png";
import wk from "./assets/pieces/wk.png";

import bp from "./assets/pieces/bp.png";
import bn from "./assets/pieces/bn.png";
import bb from "./assets/pieces/bb.png";
import br from "./assets/pieces/br.png";
import bq from "./assets/pieces/bq.png";
import bk from "./assets/pieces/bk.png";

import Chess, {
  squareColor,
  COLOR,
  Piece,
  PieceType,
  Color,
  algebraic,
  file,
  rank,
  FILE,
  RANK,
  squareIndex,
  Move,
  MOVE_FLAGS,
} from "../../server/src/chess/engine";
import { MouseEventHandler, useState } from "react";
import Show from "./utils/Show";

const PIECES: Record<Color, Record<PieceType, string>> = {
  w: { p: wp, n: wn, b: wb, r: wr, q: wq, k: wk },
  b: { p: bp, n: bn, b: bb, r: br, q: bq, k: bk },
};

function getKeyByValue(object: Record<string, any>, value: any) {
  return Object.keys(object).find((key) => object[key] === value);
}

export default function App() {
  const [chess] = useState(Chess.load());

  const sendMove = (move: Move) => {
    chess.makeMove(move);
    console.clear();
    chess.getMoves().forEach((move) =>
      console.log({
        ...move,
        flags: getKeyByValue(MOVE_FLAGS, move.flags) ?? move.flags,
      })
    );
  };

  return <ChessBoard chess={chess} sendMove={sendMove} />;
}
const ChessBoard: React.FC<{
  chess: Chess;
  sendMove: (move: Move) => void;
  blackPerspective?: boolean;
}> = ({ chess, sendMove, blackPerspective }) => {
  const [activeTile, setActiveTile] = useState<number>(-1);
  const tileProps = new Array(64).fill(null).map((_, i) => ({
    tileNumber: i,
    piece: chess.getPiece(i),
    isAttacked: false,
    isPromotion: false,
  }));

  if (activeTile != -1)
    chess
      .getMovesForSquare(algebraic(activeTile))
      .forEach(({ to }) => (tileProps[squareIndex(to)].isAttacked = true));

  const tiles = tileProps.map((props, i) => (
    <Tile key={i} {...props} blackPerspective={blackPerspective} />
  ));

  const handleClick: MouseEventHandler<HTMLDivElement> = (e) => {
    // TODO: fix types
    // @ts-ignore
    const tile = parseInt(e.target.dataset.tile);

    if (activeTile != -1 && tileProps[tile].isAttacked) {
      sendMove({ from: algebraic(activeTile), to: algebraic(tile) });
      setActiveTile(-1);
      return;
    }

    if (tile == activeTile) setActiveTile(-1);
    else setActiveTile(tile);
  };

  return (
    <>
      <div
        className="grid grid-rows-8 grid-cols-8 w-[800px] aspect-square border-8 border-black rounded-lg"
        onClick={handleClick}
      >
        {blackPerspective == true ? tiles.reverse() : tiles}
      </div>
    </>
  );
};

const Tile: React.FC<{
  tileNumber: number;
  piece: Piece | null;
  isAttacked: boolean;
  blackPerspective?: boolean;
}> = ({ tileNumber, piece, isAttacked, blackPerspective }) => {
  const [bgColor, textColor] =
    squareColor(tileNumber) == COLOR.WHITE
      ? ["bg-white-tile", "text-black-tile"]
      : ["bg-black-tile", "text-white-tile"];

  const tileFile = file(tileNumber);
  const tileRank = rank(tileNumber);
  const square = algebraic(tileNumber);

  const isFirstColumn = tileFile == (blackPerspective ? FILE.H : FILE.A);
  const isLastRow = tileRank == (blackPerspective ? RANK.EIGHTH : RANK.FIRST);

  return (
    <div
      className={`relative font-bold text-xl isolate group [&>*]:pointer-events-none ${bgColor}`}
      data-tile={tileNumber}
    >
      {piece == null ? <></> : <img src={PIECES[piece.color][piece.type]} />}
      <Show when={isAttacked == true}>
        <Show
          when={piece == null}
          fallback={
            <div className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 w-full aspect-square border-8 border-gray-900/40 rounded-full"></div>
          }
        >
          <div className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 w-[35%] aspect-square bg-gray-900/40 rounded-full group-hover:w-[45%]"></div>
        </Show>
      </Show>
      <Show when={isFirstColumn}>
        <div className={`absolute top-1 left-1 -z-10 ${textColor}`}>
          {square[1]}
        </div>
      </Show>
      <Show when={isLastRow}>
        <div className={`absolute bottom-1 right-1 -z-10 ${textColor}`}>
          {square[0]}
        </div>
      </Show>
    </div>
  );
};
