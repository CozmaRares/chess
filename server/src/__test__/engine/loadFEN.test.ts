import { describe, expect, test } from "vitest";
import Chess, { COLOR, PIECE } from "../../chess/engine";

describe("valid FEN strings", () => {
  test("default", () => {
    const builder = new Chess.Builder();

    builder.addPiece("a1", { color: COLOR.WHITE, type: PIECE.ROOK });
    builder.addPiece("b1", { color: COLOR.WHITE, type: PIECE.KNIGHT });
    builder.addPiece("c1", { color: COLOR.WHITE, type: PIECE.BISHOP });
    builder.addPiece("d1", { color: COLOR.WHITE, type: PIECE.QUEEN });
    builder.addPiece("e1", { color: COLOR.WHITE, type: PIECE.KING });
    builder.addPiece("f1", { color: COLOR.WHITE, type: PIECE.BISHOP });
    builder.addPiece("g1", { color: COLOR.WHITE, type: PIECE.KNIGHT });
    builder.addPiece("h1", { color: COLOR.WHITE, type: PIECE.ROOK });

    builder.addPiece("a2", { color: COLOR.WHITE, type: PIECE.PAWN });
    builder.addPiece("b2", { color: COLOR.WHITE, type: PIECE.PAWN });
    builder.addPiece("c2", { color: COLOR.WHITE, type: PIECE.PAWN });
    builder.addPiece("d2", { color: COLOR.WHITE, type: PIECE.PAWN });
    builder.addPiece("e2", { color: COLOR.WHITE, type: PIECE.PAWN });
    builder.addPiece("f2", { color: COLOR.WHITE, type: PIECE.PAWN });
    builder.addPiece("g2", { color: COLOR.WHITE, type: PIECE.PAWN });
    builder.addPiece("h2", { color: COLOR.WHITE, type: PIECE.PAWN });

    builder.addPiece("a8", { color: COLOR.BLACK, type: PIECE.ROOK });
    builder.addPiece("b8", { color: COLOR.BLACK, type: PIECE.KNIGHT });
    builder.addPiece("c8", { color: COLOR.BLACK, type: PIECE.BISHOP });
    builder.addPiece("d8", { color: COLOR.BLACK, type: PIECE.QUEEN });
    builder.addPiece("e8", { color: COLOR.BLACK, type: PIECE.KING });
    builder.addPiece("f8", { color: COLOR.BLACK, type: PIECE.BISHOP });
    builder.addPiece("g8", { color: COLOR.BLACK, type: PIECE.KNIGHT });
    builder.addPiece("h8", { color: COLOR.BLACK, type: PIECE.ROOK });

    builder.addPiece("a7", { color: COLOR.BLACK, type: PIECE.PAWN });
    builder.addPiece("b7", { color: COLOR.BLACK, type: PIECE.PAWN });
    builder.addPiece("c7", { color: COLOR.BLACK, type: PIECE.PAWN });
    builder.addPiece("d7", { color: COLOR.BLACK, type: PIECE.PAWN });
    builder.addPiece("e7", { color: COLOR.BLACK, type: PIECE.PAWN });
    builder.addPiece("f7", { color: COLOR.BLACK, type: PIECE.PAWN });
    builder.addPiece("g7", { color: COLOR.BLACK, type: PIECE.PAWN });
    builder.addPiece("h7", { color: COLOR.BLACK, type: PIECE.PAWN });

    const expected = builder.build();

    const chess = Chess.load();

    for (let i = 0; i < 64; i++)
      expect(chess.getPiece(i)).toEqual(expected.getPiece(i));
  });
});
