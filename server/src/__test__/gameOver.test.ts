import { describe, expect, test } from "vitest";
import Chess, { Move } from "../engine";

const makeMoves = (startingFen: string, moves: Array<Move>) => {
  const chess = Chess.load(startingFen);

  moves.forEach((move) => chess.makeMove(move));

  return chess;
};

describe("checkmate", () => {
  test("Starting Position", () => {
    expect(Chess.load().isCheckMate()).toBe(false);
  });
  test("Fool's Mate", () => {
    expect(
      Chess.load(
        "rnb1kbnr/pppp1ppp/8/4p3/6Pq/5P2/PPPPP2P/RNBQKBNR w KQkq - 1 3"
      ).isCheckMate()
    ).toBe(true);
  });
  test("Scholar's Mate", () => {
    expect(
      Chess.load(
        "rnb1kbnr/pppp1ppp/8/4p3/6Pq/5P2/PPPPP2P/RNBQKBNR w KQkq - 1 3"
      ).isCheckMate()
    ).toBe(true);
  });
});

describe("stalemate", () => {
  test("Starting Position", () => {
    expect(Chess.load().isStalemate()).toBe(false);
  });
  test("Rosen Trap", () => {
    expect(Chess.load("8/8/6k1/8/8/8/5q2/7K w - - 0 1").isStalemate()).toBe(
      true
    );
  });
  test("Troitsky vs. Vogt, 1896", () => {
    expect(
      Chess.load(
        "3k4/1pp2pp1/1b4r1/pP2p3/P3P3/6Nb/5P1P/3qB1KR w - - 0 1"
      ).isStalemate()
    ).toBe(true);
  });
  test("Lukany vs. Smulyan, 1938", () => {
    expect(
      Chess.load("8/8/8/p1K5/k1P1P3/PpP5/1P6/8 b - - 0 1").isStalemate()
    ).toBe(true);
  });
});

describe("threefold repetition", () => {
  test("Starting Position", () => {
    expect(Chess.load().isThreefoldRepetition()).toBe(false);
  });
  test("chess.com example", () => {
    const chess = makeMoves("1kr5/1b3R2/8/4Pn1p/R7/2P1B1p1/1KP4r/8 w - - 0 1", [
      { to: "a7", from: "e3" },
      { to: "a8", from: "b8" },
      { to: "g1", from: "a7" },
      { to: "b8", from: "a8" },
      { to: "a7", from: "g1" },
      { to: "a8", from: "b8" },
      { to: "g1", from: "a7" },
      { to: "b8", from: "a8" },
      { to: "a7", from: "g1" },
    ]);
    expect(chess.isThreefoldRepetition()).toBe(true);
  });
  test("bongcloud", () => {
    const chess = makeMoves(
      "rnbq1bnr/ppppkppp/8/4p3/4P3/8/PPPPKPPP/RNBQ1BNR w - - 2 3",
      [
        { to: "e1", from: "e2" },
        { to: "e8", from: "e7" },
        { to: "e2", from: "e1" },
        { to: "e7", from: "e8" },
        { to: "e1", from: "e2" },
        { to: "e8", from: "e7" },
        { to: "e2", from: "e1" },
        { to: "e7", from: "e8" },
      ]
    );
    expect(chess.isThreefoldRepetition()).toBe(true);
  });
});

describe("50 moves", () => {
  test("", () => {
    const chess = makeMoves("7k/8/r7/p1p1p1p1/P1P1P1P1/R7/8/7K w - - 0 1", [
      { from: "h1", to: "h2" },
      { from: "h8", to: "h7" },
      { from: "h2", to: "h3" },
      { from: "h7", to: "h6" },
      { from: "h3", to: "g3" },
      { from: "h6", to: "g6" },
      { from: "g3", to: "g2" },
      { from: "g6", to: "g7" },
      { from: "g2", to: "g1" },
      { from: "g7", to: "g8" },
      { from: "g1", to: "f1" },
      { from: "g8", to: "f8" },
      { from: "f1", to: "f2" },
      { from: "f8", to: "f7" },
      { from: "f2", to: "f3" },
      { from: "f7", to: "f6" },
      { from: "f3", to: "e3" },
      { from: "f6", to: "e6" },
      { from: "e3", to: "e2" },
      { from: "e6", to: "e7" },
      { from: "e2", to: "e1" },
      { from: "e7", to: "e8" },
      { from: "e1", to: "d1" },
      { from: "e8", to: "d8" },
      { from: "d1", to: "d2" },
      { from: "d8", to: "d7" },
      { from: "d2", to: "d3" },
      { from: "d7", to: "d6" },
      { from: "d3", to: "c3" },
      { from: "d6", to: "c6" },
      { from: "c3", to: "c2" },
      { from: "c6", to: "c7" },
      { from: "c2", to: "c1" },
      { from: "c7", to: "c8" },
      { from: "c1", to: "b1" },
      { from: "c8", to: "b8" },
      { from: "b1", to: "b2" },
      { from: "b8", to: "b7" },
      { from: "b2", to: "b3" },
      { from: "b7", to: "b6" },
      { from: "a3", to: "a1" },
      { from: "b6", to: "b7" },
      { from: "b3", to: "b2" },
      { from: "b7", to: "b8" },
      { from: "b2", to: "b1" },
      { from: "b8", to: "c8" },
      { from: "b1", to: "c2" },
      { from: "c8", to: "d7" },
      { from: "c2", to: "c1" },
      { from: "d7", to: "c8" },
      { from: "c1", to: "d1" },
      { from: "c8", to: "d8" },
      { from: "d1", to: "e1" },
      { from: "d8", to: "e8" },
      { from: "e1", to: "f1" },
      { from: "e8", to: "f8" },
      { from: "f1", to: "g1" },
      { from: "f8", to: "g8" },
      { from: "g1", to: "h1" },
      { from: "g8", to: "h8" },
      { from: "h1", to: "h2" },
      { from: "a6", to: "a8" },
      { from: "h2", to: "h3" },
      { from: "h8", to: "h7" },
      { from: "h3", to: "g3" },
      { from: "h7", to: "g6" },
      { from: "g3", to: "f3" },
      { from: "g6", to: "f6" },
      { from: "f3", to: "e3" },
      { from: "f6", to: "e6" },
      { from: "e3", to: "d3" },
      { from: "e6", to: "d6" },
      { from: "d3", to: "c3" },
      { from: "d6", to: "c6" },
      { from: "c3", to: "b3" },
      { from: "c6", to: "b6" },
      { from: "b3", to: "b2" },
      { from: "b6", to: "b7" },
      { from: "b2", to: "b1" },
      { from: "b7", to: "b8" },
      { from: "a1", to: "a2" },
      { from: "b8", to: "c8" },
      { from: "b1", to: "c1" },
      { from: "c8", to: "d8" },
      { from: "c1", to: "d1" },
      { from: "d8", to: "e8" },
      { from: "d1", to: "e1" },
      { from: "a8", to: "b8" },
      { from: "e1", to: "f1" },
      { from: "e8", to: "f7" },
      { from: "f1", to: "f2" },
      { from: "f7", to: "f6" },
      { from: "f2", to: "f3" },
      { from: "f6", to: "g7" },
      { from: "f3", to: "g3" },
      { from: "g7", to: "g6" },
      { from: "g3", to: "h3" },
      { from: "g6", to: "h6" },
      { from: "h3", to: "h2" },
      { from: "h6", to: "h7" },
    ]);
    expect(chess.is50Rule()).toBe(true);
  });
});

describe("insufficient material", () => {
  test("2 kings", () => {
    expect(
      Chess.load("8/k7/8/6K1/8/8/8/8 w - - 0 1").isInsufficientMaterial()
    ).toBe(true);
  });

  test("king and bishop", () => {
    expect(
      Chess.load("5b2/k7/8/6K1/8/2B5/8/8 w - - 0 1").isInsufficientMaterial()
    ).toBe(true);
  });

  test("king and knight", () => {
    expect(
      Chess.load("8/k7/8/3n2K1/8/5N2/8/8 w - - 0 1").isInsufficientMaterial()
    ).toBe(true);
  });

  test("king and knight vs king and bishop", () => {
    expect(
      Chess.load("8/k3n3/8/6K1/8/2B5/8/8 w - - 0 1").isInsufficientMaterial()
    ).toBe(true);
  });

  test("king and 2 knights", () => {
    expect(
      Chess.load("8/k7/4N3/6K1/8/5N2/8/8 w - - 0 1").isInsufficientMaterial()
    ).toBe(true);
  });

  test("starting position", () => {
    expect(Chess.load().isInsufficientMaterial()).toBe(false);
  });

  test("king and 2 bishops vs king", () => {
    expect(
      Chess.load("8/k7/8/4B1K1/4B3/8/8/8 w - - 0 1").isInsufficientMaterial()
    ).toBe(false);
  });

  test("king and 2 knights vs king and bishop", () => {
    expect(
      Chess.load("8/k7/3n4/6K1/2n1B3/8/8/8 w - - 0 1").isInsufficientMaterial()
    ).toBe(false);
  });

  test("king and 2 knights vs king and knight", () => {
    expect(
      Chess.load("6N1/k7/3n4/6K1/2n5/8/8/8 w - - 0 1").isInsufficientMaterial()
    ).toBe(false);
  });

  test("king and rook vs king", () => {
    expect(
      Chess.load("5r2/k7/8/6K1/8/8/8/8 w - - 0 1").isInsufficientMaterial()
    ).toBe(false);
  });

  test("king and queen vs king", () => {
    expect(
      Chess.load("5Q2/k7/8/6K1/8/8/8/8 w - - 0 1").isInsufficientMaterial()
    ).toBe(false);
  });

  test("only pawns remaining", () => {
    expect(
      Chess.load(
        "1k6/3p4/1p6/6K1/5P2/4P3/8/8 w - - 0 1"
      ).isInsufficientMaterial()
    ).toBe(false);
  });
});
