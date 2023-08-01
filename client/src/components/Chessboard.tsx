import wp from "../assets/pieces/wp.png";
import wn from "../assets/pieces/wn.png";
import wb from "../assets/pieces/wb.png";
import wr from "../assets/pieces/wr.png";
import wq from "../assets/pieces/wq.png";
import wk from "../assets/pieces/wk.png";

import bp from "../assets/pieces/bp.png";
import bn from "../assets/pieces/bn.png";
import bb from "../assets/pieces/bb.png";
import br from "../assets/pieces/br.png";
import bq from "../assets/pieces/bq.png";
import bk from "../assets/pieces/bk.png";

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
  PiecePromotionType,
} from "../../../server/src/engine";
import { MouseEventHandler, useState } from "react";
import Show from "../utils/Show";
import useWindowSize from "../utils/useWindowSize";

const PIECES: Record<Color, Record<PieceType, string>> = {
  w: { p: wp, n: wn, b: wb, r: wr, q: wq, k: wk },
  b: { p: bp, n: bn, b: bb, r: br, q: bq, k: bk },
};
const ChessBoard: React.FC<{
  chess: Chess;
  makeMove: (move: Move) => void;
  blackPerspective?: boolean;
  disabled?: boolean;
}> = ({ chess, makeMove, blackPerspective, disabled }) => {
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
    if (disabled || promotionMove != null) return;

    const tile = parseInt((e.target as HTMLDivElement).dataset.tile ?? "");

    if (isNaN(tile)) return;

    if (activeTile != -1 && tileProps[tile].isAttacked) {
      const moveObj = {
        from: algebraic(activeTile),
        to: algebraic(tile),
        color: (chess.getPiece(activeTile) as Piece).color,
      };

      if (tileProps[tile].isPromotion) return setPromotionMove(moveObj);

      makeMove(moveObj);
      setActiveTile(-1);
      return;
    }

    if (tileProps[tile].piece == null) return setActiveTile(-1);

    setActiveTile(tile == activeTile ? -1 : tile);
  };

  const sendPromotionMove = (promotion: PiecePromotionType) => {
    if (promotionMove == null) return;

    const moveObj: Move = {
      from: promotionMove.from,
      to: promotionMove.to,
      promotion,
    };

    makeMove(moveObj);
    setPromotionMove(null);
    setActiveTile(-1);
  };

  return (
    <>
      <div className="relative w-fit h-fit max-w-full isolate border-[6px] border-black rounded-lg peer">
        <div
          className="grid grid-rows-8 grid-cols-8 aspect-square select-none max-w-full"
          onClick={handleClick}
          style={{ width: `${gridSize}px` }}
        >
          {blackPerspective == true ? tiles.reverse() : tiles}
        </div>
        {promotionMove == null ? (
          <></>
        ) : (
          <>
            <div className="absolute top-0 left-0 right-0 bottom-0 bg-red-50 bg-opacity-50 peer-default:pointer-events-none"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 grid grid-cols-2 grid-rows-2 gap-1 bg-black bg-opacity-80 rounded-2xl p-2 z-10">
              {PIECE_PROMOTION.map((p) => (
                <img
                  key={p}
                  src={PIECES[promotionMove.color][p]}
                  style={{ width: `${gridSize / 8}px`, aspectRatio: 1 }}
                  onClick={() => sendPromotionMove(p)}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </>
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
  const activeColor = TILE_COLORS[color].active;

  const tileFile = file(tileNumber);
  const tileRank = rank(tileNumber);
  const square = algebraic(tileNumber);

  const isFirstColumn = tileFile == (blackPerspective ? FILE.H : FILE.A);
  const isLastRow = tileRank == (blackPerspective ? RANK.EIGHTH : RANK.FIRST);

  return (
    <div
      className={
        "relative aspect-square font-bold text-xl isolate group [&>*]:pointer-events-none " +
        (isActive ? activeColor : bgColor)
      }
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

export default ChessBoard;
