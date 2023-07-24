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
  PIECE_PROMOTION,
  COLOR,
  PiecePromotionType,
} from "../../server/src/chess/engine";
import { MouseEventHandler, useLayoutEffect, useState } from "react";
import Show from "./utils/Show";

const PIECES: Record<Color, Record<PieceType, string>> = {
  w: { p: wp, n: wn, b: wb, r: wr, q: wq, k: wk },
  b: { p: bp, n: bn, b: bb, r: br, q: bq, k: bk },
};

export default function App() {
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
}

// taken form https://github.com/uidotdev/usehooks
function useWindowSize() {
  const [size, setSize] = useState({
    width: -1,
    height: -1,
  });

  useLayoutEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return size;
}

const ChessBoard: React.FC<{
  chess: Chess;
  sendMove: (move: Move) => void;
  blackPerspective?: boolean;
}> = ({ chess, sendMove, blackPerspective }) => {
  const { width, height } = useWindowSize();
  const [activeTile, setActiveTile] = useState<number>(-1);
  const [promotionMove, setPromotionMove] = useState<
    (Pick<Move, "from" | "to"> & { color: Color }) | null
  >(null);

  const gridSize = Math.min(width, height, 800);

  const tileProps = new Array(64).fill(null).map((_, i) => ({
    tileNumber: i,
    piece: chess.getPiece(i),
    isAttacked: false,
    isPromotion: false,
    isActive: false,
  }));

  if (activeTile != -1) {
    tileProps[activeTile].isActive = true;
    chess.getMovesForSquare(algebraic(activeTile)).forEach(({ to, flags }) => {
      const square = squareIndex(to);
      tileProps[square].isAttacked = true;
      tileProps[square].isPromotion =
        flags & MOVE_FLAGS.PROMOTION ? true : false;
    });
  }

  const tiles = tileProps.map((props, i) => (
    <Tile key={i} {...props} blackPerspective={blackPerspective} />
  ));

  const handleClick: MouseEventHandler<HTMLDivElement> = (e) => {
    if (promotionMove != null) return;

    // TODO: fix types
    // @ts-ignore
    const tile = parseInt(e.target.dataset.tile);

    if (isNaN(tile)) return;

    if (activeTile != -1 && tileProps[tile].isAttacked) {
      const moveObj = {
        from: algebraic(activeTile),
        to: algebraic(tile),
        color: (chess.getPiece(activeTile) as Piece).color,
      };

      if (tileProps[tile].isPromotion) return setPromotionMove(moveObj);

      sendMove(moveObj);
      setActiveTile(-1);
    }

    if (tileProps[tile].piece == null) return setActiveTile(-1);

    if (tile == activeTile) setActiveTile(-1);
    else setActiveTile(tile);
  };

  const sendPromotionMove = (promotion: PiecePromotionType) => {
    if (promotionMove == null) return;

    const moveObj: Move = {
      from: promotionMove.from,
      to: promotionMove.to,
      promotion,
    };

    sendMove(moveObj);
    setPromotionMove(null);
    setActiveTile(-1);
  };

  return (
    <div className="flex flex-row h-fit items-center">
      <div
        className="relative grid grid-rows-8 grid-cols-8 aspect-square border-8 border-black rounded-lg"
        onClick={handleClick}
        style={{ width: `${gridSize}px` }}
      >
        {blackPerspective == true ? tiles.reverse() : tiles}
      </div>
      {promotionMove == null ? (
        <></>
      ) : (
        <div className="w-fit flex flex-col bg-black rounded-r-2xl p-1">
          {PIECE_PROMOTION.map((p) => (
            <img
              key={p}
              src={PIECES[promotionMove.color][p]}
              style={{ width: `${gridSize / 8}px`, aspectRatio: 1 }}
              onClick={() => sendPromotionMove(p)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const TILE_COLORS = Object.freeze({
  w: {
    bg: "bg-white-tile",
    text: "text-black-tile",
    active: "bg-sky-400",
  },
  b: {
    bg: "bg-black-tile",
    text: "text-white-tile",
    active: "bg-sky-700",
  },
} as const);

const Tile: React.FC<{
  tileNumber: number;
  piece: Piece | null;
  isActive: boolean;
  isAttacked: boolean;
  blackPerspective?: boolean;
}> = ({ tileNumber, piece, isActive, isAttacked, blackPerspective }) => {
  const color = squareColor(tileNumber);

  const { bg: bgColor, text: textColor } = TILE_COLORS[color];
  const activeColor = isActive ? TILE_COLORS[color].active : "";

  const tileFile = file(tileNumber);
  const tileRank = rank(tileNumber);
  const square = algebraic(tileNumber);

  const isFirstColumn = tileFile == (blackPerspective ? FILE.H : FILE.A);
  const isLastRow = tileRank == (blackPerspective ? RANK.EIGHTH : RANK.FIRST);

  return (
    <div
      className={`relative aspect-square font-bold text-xl isolate group [&>*]:pointer-events-none ${bgColor} ${activeColor}`}
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
