import { describe, expect, test } from "vitest";
import Chess, { COLOR, PIECE } from "../chess/engine";

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

  test("1. e4", () => {
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
    builder.addPiece("e4", { color: COLOR.WHITE, type: PIECE.PAWN });
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

    const chess = Chess.load(
      "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1"
    );

    for (let i = 0; i < 64; i++)
      expect(chess.getPiece(i)).toEqual(expected.getPiece(i));
  });

  test("1. e4 2. e5", () => {
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
    builder.addPiece("e4", { color: COLOR.WHITE, type: PIECE.PAWN });
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
    builder.addPiece("e5", { color: COLOR.BLACK, type: PIECE.PAWN });
    builder.addPiece("f7", { color: COLOR.BLACK, type: PIECE.PAWN });
    builder.addPiece("g7", { color: COLOR.BLACK, type: PIECE.PAWN });
    builder.addPiece("h7", { color: COLOR.BLACK, type: PIECE.PAWN });

    const expected = builder.build();

    const chess = Chess.load(
      "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e6 0 2"
    );

    for (let i = 0; i < 64; i++)
      expect(chess.getPiece(i)).toEqual(expected.getPiece(i));
  });

  test("1. e4 2. e5 3. ke2", () => {
    const builder = new Chess.Builder();

    builder.addPiece("a1", { color: COLOR.WHITE, type: PIECE.ROOK });
    builder.addPiece("b1", { color: COLOR.WHITE, type: PIECE.KNIGHT });
    builder.addPiece("c1", { color: COLOR.WHITE, type: PIECE.BISHOP });
    builder.addPiece("d1", { color: COLOR.WHITE, type: PIECE.QUEEN });
    builder.addPiece("e2", { color: COLOR.WHITE, type: PIECE.KING });
    builder.addPiece("f1", { color: COLOR.WHITE, type: PIECE.BISHOP });
    builder.addPiece("g1", { color: COLOR.WHITE, type: PIECE.KNIGHT });
    builder.addPiece("h1", { color: COLOR.WHITE, type: PIECE.ROOK });

    builder.addPiece("a2", { color: COLOR.WHITE, type: PIECE.PAWN });
    builder.addPiece("b2", { color: COLOR.WHITE, type: PIECE.PAWN });
    builder.addPiece("c2", { color: COLOR.WHITE, type: PIECE.PAWN });
    builder.addPiece("d2", { color: COLOR.WHITE, type: PIECE.PAWN });
    builder.addPiece("e4", { color: COLOR.WHITE, type: PIECE.PAWN });
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
    builder.addPiece("e5", { color: COLOR.BLACK, type: PIECE.PAWN });
    builder.addPiece("f7", { color: COLOR.BLACK, type: PIECE.PAWN });
    builder.addPiece("g7", { color: COLOR.BLACK, type: PIECE.PAWN });
    builder.addPiece("h7", { color: COLOR.BLACK, type: PIECE.PAWN });

    const expected = builder.build();

    const chess = Chess.load(
      "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPPKPPP/RNBQ1BNR b kq - 1 2"
    );

    for (let i = 0; i < 64; i++)
      expect(chess.getPiece(i)).toEqual(expected.getPiece(i));
  });

  test("random position 1", () => {
    const builder = new Chess.Builder();

    builder.addPiece("a1", { color: COLOR.WHITE, type: PIECE.ROOK });
    builder.addPiece("d6", { color: COLOR.WHITE, type: PIECE.BISHOP });
    builder.addPiece("g3", { color: COLOR.WHITE, type: PIECE.QUEEN });
    builder.addPiece("g1", { color: COLOR.WHITE, type: PIECE.KING });
    builder.addPiece("d2", { color: COLOR.WHITE, type: PIECE.ROOK });

    builder.addPiece("a3", { color: COLOR.WHITE, type: PIECE.PAWN });
    builder.addPiece("f2", { color: COLOR.WHITE, type: PIECE.PAWN });
    builder.addPiece("g2", { color: COLOR.WHITE, type: PIECE.PAWN });
    builder.addPiece("h2", { color: COLOR.WHITE, type: PIECE.PAWN });

    builder.addPiece("a8", { color: COLOR.BLACK, type: PIECE.ROOK });
    builder.addPiece("c8", { color: COLOR.BLACK, type: PIECE.BISHOP });
    builder.addPiece("c4", { color: COLOR.BLACK, type: PIECE.QUEEN });
    builder.addPiece("g8", { color: COLOR.BLACK, type: PIECE.KING });
    builder.addPiece("e8", { color: COLOR.BLACK, type: PIECE.ROOK });

    builder.addPiece("a7", { color: COLOR.BLACK, type: PIECE.PAWN });
    builder.addPiece("b7", { color: COLOR.BLACK, type: PIECE.PAWN });
    builder.addPiece("e6", { color: COLOR.BLACK, type: PIECE.PAWN });
    builder.addPiece("f6", { color: COLOR.BLACK, type: PIECE.PAWN });
    builder.addPiece("g7", { color: COLOR.BLACK, type: PIECE.PAWN });
    builder.addPiece("h7", { color: COLOR.BLACK, type: PIECE.PAWN });

    const expected = builder.build();

    const chess = Chess.load(
      "r1b1r1k1/pp4pp/3Bpp2/8/2q5/P5Q1/3R1PPP/R5K1 b - - 0 19"
    );

    for (let i = 0; i < 64; i++)
      expect(chess.getPiece(i)).toEqual(expected.getPiece(i));
  });

  test("random position 2", () => {
    const builder = new Chess.Builder();

    builder.addPiece("e1", { color: COLOR.WHITE, type: PIECE.ROOK });
    builder.addPiece("f5", { color: COLOR.WHITE, type: PIECE.BISHOP });
    builder.addPiece("g3", { color: COLOR.WHITE, type: PIECE.KING });

    builder.addPiece("a4", { color: COLOR.WHITE, type: PIECE.PAWN });
    builder.addPiece("b4", { color: COLOR.WHITE, type: PIECE.PAWN });

    builder.addPiece("h2", { color: COLOR.BLACK, type: PIECE.ROOK });
    builder.addPiece("b8", { color: COLOR.BLACK, type: PIECE.KING });

    builder.addPiece("a6", { color: COLOR.BLACK, type: PIECE.PAWN });
    builder.addPiece("b7", { color: COLOR.BLACK, type: PIECE.PAWN });
    builder.addPiece("c7", { color: COLOR.BLACK, type: PIECE.PAWN });
    builder.addPiece("e2", { color: COLOR.BLACK, type: PIECE.PAWN });
    builder.addPiece("h5", { color: COLOR.BLACK, type: PIECE.PAWN });

    const expected = builder.build();

    const chess = Chess.load("1k6/1pp5/p7/5B1p/PP6/6K1/4p2r/4R3 b - - 3 43");

    for (let i = 0; i < 64; i++)
      expect(chess.getPiece(i)).toEqual(expected.getPiece(i));
  });

  test("random position 3", () => {
    const builder = new Chess.Builder();

    builder.addPiece("f6", { color: COLOR.WHITE, type: PIECE.QUEEN });
    builder.addPiece("g1", { color: COLOR.WHITE, type: PIECE.KING });

    builder.addPiece("f4", { color: COLOR.WHITE, type: PIECE.PAWN });

    builder.addPiece("c6", { color: COLOR.BLACK, type: PIECE.KING });

    builder.addPiece("b2", { color: COLOR.BLACK, type: PIECE.PAWN });

    const expected = builder.build();

    const chess = Chess.load("8/8/2k2Q2/8/5P2/8/1p6/6K1 b - - 1 48");

    for (let i = 0; i < 64; i++)
      expect(chess.getPiece(i)).toEqual(expected.getPiece(i));
  });
});

describe("invalid FEN strings", () => {
  test("string doesn't contain 6 fields", () => {
    expect(() => Chess.load("8/8/2k2Q2/8/5P2/8/1p6/6K1 b - 1 48")).toThrowError(
      /^Invalid FEN - string must contain 6 space delimited fields$/
    );
  });

  test("missing white king", () => {
    expect(() => Chess.load("8/8/2k2Q2/8/5P2/8/1p6/8 b - - 1 48")).toThrowError(
      /^Invalid FEN - board position is missing white king$/
    );
  });

  test("invalid turn", () => {
    expect(() =>
      Chess.load("1k6/1pp5/p7/5B1p/PP6/6K1/4p2r/4R3 a - - 3 43")
    ).toThrowError(/^Invalid FEN - invalid side to move$/);
  });

  test("invalid castling rights", () => {
    expect(() =>
      Chess.load("1k6/1pp5/p7/5B1p/PP6/6K1/4p2r/4R3 b abc - 3 43")
    ).toThrowError(/^Invalid FEN - string contains invalid castling rights$/);
  });
});
