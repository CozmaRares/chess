import { describe, expect, test } from "vitest";
import Chess, { MOVE_FLAGS, Move, Square } from "../chess/engine";

type ExpectedMoves = Record<
  string,
  {
    square: Square;
    moves: Move[];
  }[]
>;

function runTest(fen: string, expectedMoves: ExpectedMoves) {
  const chess = Chess.load(fen);

  Object.keys(expectedMoves).forEach(key =>
    test(key.split("_").join(" "), () =>
      expectedMoves[key].forEach(({ square, moves: expectedMoves }) => {
        const moves = chess.getMovesForSquare(square);

        expect(moves).toHaveLength(expectedMoves.length);

        moves.forEach(move => expect(expectedMoves).toContainEqual(move));
        expectedMoves.forEach(expectedMove =>
          expect(moves).toContainEqual(expectedMove)
        );
      })
    )
  );
}

describe("pawn moves", () => {
  const expectedMoves: ExpectedMoves = {
    can_jump: [
      {
        square: "a2",
        moves: [
          {
            from: "a2",
            to: "a3",
            flag: MOVE_FLAGS.NORMAL,
          },
          {
            from: "a2",
            to: "a4",
            flag: MOVE_FLAGS.PAWN_JUMP,
          },
        ],
      },
      {
        square: "h7",
        moves: [
          {
            from: "h7",
            to: "h6",
            flag: MOVE_FLAGS.NORMAL,
          },
          {
            from: "h7",
            to: "h5",
            flag: MOVE_FLAGS.PAWN_JUMP,
          },
        ],
      },
    ],
    promotion: [
      {
        square: "b7",
        moves: [
          {
            from: "b7",
            to: "b8",
            flag: MOVE_FLAGS.PROMOTION,
            promotion: "n",
          },
          {
            from: "b7",
            to: "b8",
            flag: MOVE_FLAGS.PROMOTION,
            promotion: "b",
          },
          {
            from: "b7",
            to: "b8",
            flag: MOVE_FLAGS.PROMOTION,
            promotion: "r",
          },
          {
            from: "b7",
            to: "b8",
            flag: MOVE_FLAGS.PROMOTION,
            promotion: "q",
          },
        ],
      },
      {
        square: "g2",
        moves: [
          {
            from: "g2",
            to: "g1",
            flag: MOVE_FLAGS.PROMOTION,
            promotion: "n",
          },
          {
            from: "g2",
            to: "g1",
            flag: MOVE_FLAGS.PROMOTION,
            promotion: "b",
          },
          {
            from: "g2",
            to: "g1",
            flag: MOVE_FLAGS.PROMOTION,
            promotion: "r",
          },
          {
            from: "g2",
            to: "g1",
            flag: MOVE_FLAGS.PROMOTION,
            promotion: "q",
          },
        ],
      },
    ],
    regular: [
      {
        square: "c3",
        moves: [
          {
            from: "c3",
            to: "c4",
            flag: MOVE_FLAGS.NORMAL,
          },
        ],
      },
      {
        square: "f6",
        moves: [
          {
            from: "f6",
            to: "f5",
            flag: MOVE_FLAGS.NORMAL,
          },
        ],
      },
    ],
    attack: [
      {
        square: "d4",
        moves: [
          {
            from: "d4",
            to: "d5",
            flag: MOVE_FLAGS.NORMAL,
          },
          {
            from: "d4",
            to: "e5",
            flag: MOVE_FLAGS.CAPTURE,
          },
        ],
      },
      {
        square: "e5",
        moves: [
          {
            from: "e5",
            to: "e4",
            flag: MOVE_FLAGS.NORMAL,
          },
          {
            from: "e5",
            to: "d4",
            flag: MOVE_FLAGS.CAPTURE,
          },
        ],
      },
    ],
    blocked: [
      {
        square: "c7",
        moves: [],
      },
      {
        square: "c6",
        moves: [],
      },
      {
        square: "e7",
        moves: [
          {
            from: "e7",
            to: "e6",
            flag: MOVE_FLAGS.NORMAL,
          },
        ],
      },
    ],
  };

  runTest("7k/1Pp1p2p/2P2p2/4p3/3P4/2P5/P5p1/K7 w - - 0 1", expectedMoves);
});

describe("knight moves", () => {
  const expectedMoves: ExpectedMoves = {
    exclude_a: [
      {
        square: "a8",
        moves: [
          {
            from: "a8",
            to: "b6",
            flag: MOVE_FLAGS.NORMAL,
          },
          {
            from: "a8",
            to: "c7",
            flag: MOVE_FLAGS.NORMAL,
          },
        ],
      },
    ],
    exclude_b: [
      {
        square: "b7",
        moves: [
          {
            from: "b7",
            to: "a5",
            flag: MOVE_FLAGS.NORMAL,
          },
          {
            from: "b7",
            to: "c5",
            flag: MOVE_FLAGS.NORMAL,
          },
          {
            from: "b7",
            to: "d6",
            flag: MOVE_FLAGS.NORMAL,
          },
          {
            from: "b7",
            to: "d8",
            flag: MOVE_FLAGS.NORMAL,
          },
        ],
      },
    ],
    exclude_g: [
      {
        square: "g2",
        moves: [
          {
            from: "g2",
            to: "e1",
            flag: MOVE_FLAGS.NORMAL,
          },
          {
            from: "g2",
            to: "e3",
            flag: MOVE_FLAGS.NORMAL,
          },
          {
            from: "g2",
            to: "f4",
            flag: MOVE_FLAGS.NORMAL,
          },
          {
            from: "g2",
            to: "h4",
            flag: MOVE_FLAGS.NORMAL,
          },
        ],
      },
    ],
    exclude_h: [
      {
        square: "h1",
        moves: [
          {
            from: "h1",
            to: "f2",
            flag: MOVE_FLAGS.NORMAL,
          },
          {
            from: "h1",
            to: "g3",
            flag: MOVE_FLAGS.NORMAL,
          },
        ],
      },
    ],
    attack: [
      {
        square: "a2",
        moves: [
          {
            from: "a2",
            to: "c1",
            flag: MOVE_FLAGS.NORMAL,
          },
          {
            from: "a2",
            to: "c3",
            flag: MOVE_FLAGS.CAPTURE,
          },
          {
            from: "a2",
            to: "b4",
            flag: MOVE_FLAGS.NORMAL,
          },
        ],
      },
      {
        square: "c3",
        moves: [
          {
            from: "c3",
            to: "e4",
            flag: MOVE_FLAGS.NORMAL,
          },
          {
            from: "c3",
            to: "b5",
            flag: MOVE_FLAGS.CAPTURE,
          },
          {
            from: "c3",
            to: "a4",
            flag: MOVE_FLAGS.NORMAL,
          },
          {
            from: "c3",
            to: "a2",
            flag: MOVE_FLAGS.CAPTURE,
          },
          {
            from: "c3",
            to: "b1",
            flag: MOVE_FLAGS.NORMAL,
          },
          {
            from: "c3",
            to: "d1",
            flag: MOVE_FLAGS.NORMAL,
          },
          {
            from: "c3",
            to: "e2",
            flag: MOVE_FLAGS.NORMAL,
          },
        ],
      },
    ],
    regular: [
      {
        square: "e5",
        moves: [
          {
            from: "e5",
            to: "g6",
            flag: MOVE_FLAGS.NORMAL,
          },
          {
            from: "e5",
            to: "f7",
            flag: MOVE_FLAGS.NORMAL,
          },
          {
            from: "e5",
            to: "d7",
            flag: MOVE_FLAGS.NORMAL,
          },
          {
            from: "e5",
            to: "c6",
            flag: MOVE_FLAGS.NORMAL,
          },
          {
            from: "e5",
            to: "c4",
            flag: MOVE_FLAGS.NORMAL,
          },
          {
            from: "e5",
            to: "d3",
            flag: MOVE_FLAGS.NORMAL,
          },
          {
            from: "e5",
            to: "f3",
            flag: MOVE_FLAGS.NORMAL,
          },
          {
            from: "e5",
            to: "g4",
            flag: MOVE_FLAGS.NORMAL,
          },
        ],
      },
    ],
  };

  runTest("n7/1n6/8/1K1kN3/8/2n5/N5N1/7N w - - 0 1", expectedMoves);
});

describe("bishop moves", () => {
  const expectedMoves: ExpectedMoves = {
    exclude_a: [
      {
        square: "a2",
        moves: [
          {
            from: "a2",
            to: "b3",
            flag: MOVE_FLAGS.NORMAL,
          },
          {
            from: "a2",
            to: "c4",
            flag: MOVE_FLAGS.NORMAL,
          },
          {
            from: "a2",
            to: "d5",
            flag: MOVE_FLAGS.NORMAL,
          },
          {
            from: "a2",
            to: "e6",
            flag: MOVE_FLAGS.NORMAL,
          },
          {
            from: "a2",
            to: "f7",
            flag: MOVE_FLAGS.NORMAL,
          },
          {
            from: "a2",
            to: "g8",
            flag: MOVE_FLAGS.NORMAL,
          },
          {
            from: "a2",
            to: "b1",
            flag: MOVE_FLAGS.NORMAL,
          },
        ],
      },
    ],
    exclude_h: [
      {
        square: "h8",
        moves: [
          {
            from: "h8",
            to: "g7",
            flag: MOVE_FLAGS.NORMAL,
          },
          {
            from: "h8",
            to: "f6",
            flag: MOVE_FLAGS.NORMAL,
          },
          {
            from: "h8",
            to: "e5",
            flag: MOVE_FLAGS.NORMAL,
          },
          {
            from: "h8",
            to: "d4",
            flag: MOVE_FLAGS.NORMAL,
          },
          {
            from: "h8",
            to: "c3",
            flag: MOVE_FLAGS.NORMAL,
          },
          {
            from: "h8",
            to: "b2",
            flag: MOVE_FLAGS.NORMAL,
          },
          {
            from: "h8",
            to: "a1",
            flag: MOVE_FLAGS.NORMAL,
          },
        ],
      },
    ],
    attack: [
      {
        square: "d2",
        moves: [
          {
            from: "d2",
            to: "c1",
            flag: MOVE_FLAGS.NORMAL,
          },
          {
            from: "d2",
            to: "e1",
            flag: MOVE_FLAGS.NORMAL,
          },
          {
            from: "d2",
            to: "c3",
            flag: MOVE_FLAGS.NORMAL,
          },
          {
            from: "d2",
            to: "b4",
            flag: MOVE_FLAGS.NORMAL,
          },
          {
            from: "d2",
            to: "a5",
            flag: MOVE_FLAGS.NORMAL,
          },
          {
            from: "d2",
            to: "e3",
            flag: MOVE_FLAGS.NORMAL,
          },
          {
            from: "d2",
            to: "f4",
            flag: MOVE_FLAGS.NORMAL,
          },
          {
            from: "d2",
            to: "g5",
            flag: MOVE_FLAGS.CAPTURE,
          },
        ],
      },
      {
        square: "g5",
        moves: [
          {
            from: "g5",
            to: "h6",
            flag: MOVE_FLAGS.NORMAL,
          },
          {
            from: "g5",
            to: "h4",
            flag: MOVE_FLAGS.NORMAL,
          },
          {
            from: "g5",
            to: "f6",
            flag: MOVE_FLAGS.NORMAL,
          },
          {
            from: "g5",
            to: "e7",
            flag: MOVE_FLAGS.NORMAL,
          },
          {
            from: "g5",
            to: "d8",
            flag: MOVE_FLAGS.NORMAL,
          },
          {
            from: "g5",
            to: "f4",
            flag: MOVE_FLAGS.NORMAL,
          },
          {
            from: "g5",
            to: "e3",
            flag: MOVE_FLAGS.NORMAL,
          },
          {
            from: "g5",
            to: "d2",
            flag: MOVE_FLAGS.CAPTURE,
          },
        ],
      },
    ],
    attack_same_color: [
      {
        square: "c5",
        moves: [
          {
            from: "c5",
            to: "b6",
            flag: MOVE_FLAGS.NORMAL,
          },
          {
            from: "c5",
            to: "a7",
            flag: MOVE_FLAGS.NORMAL,
          },
          {
            from: "c5",
            to: "d4",
            flag: MOVE_FLAGS.NORMAL,
          },
          {
            from: "c5",
            to: "e3",
            flag: MOVE_FLAGS.NORMAL,
          },
          {
            from: "c5",
            to: "f2",
            flag: MOVE_FLAGS.NORMAL,
          },
          {
            from: "c5",
            to: "g1",
            flag: MOVE_FLAGS.NORMAL,
          },
          {
            from: "c5",
            to: "b4",
            flag: MOVE_FLAGS.NORMAL,
          },
          {
            from: "c5",
            to: "a3",
            flag: MOVE_FLAGS.NORMAL,
          },
        ],
      },
      {
        square: "d6",
        moves: [
          {
            from: "d6",
            to: "c7",
            flag: MOVE_FLAGS.NORMAL,
          },
          {
            from: "d6",
            to: "b8",
            flag: MOVE_FLAGS.NORMAL,
          },
          {
            from: "d6",
            to: "e7",
            flag: MOVE_FLAGS.NORMAL,
          },
          {
            from: "d6",
            to: "f8",
            flag: MOVE_FLAGS.NORMAL,
          },
          {
            from: "d6",
            to: "e5",
            flag: MOVE_FLAGS.NORMAL,
          },
          {
            from: "d6",
            to: "f4",
            flag: MOVE_FLAGS.NORMAL,
          },
          {
            from: "d6",
            to: "g3",
            flag: MOVE_FLAGS.NORMAL,
          },
          {
            from: "d6",
            to: "h2",
            flag: MOVE_FLAGS.NORMAL,
          },
        ],
      },
    ],
    regular: [
      {
        square: "c2",
        moves: [
          {
            from: "c2",
            to: "b1",
            flag: MOVE_FLAGS.NORMAL,
          },
          {
            from: "c2",
            to: "d1",
            flag: MOVE_FLAGS.NORMAL,
          },
          {
            from: "c2",
            to: "b3",
            flag: MOVE_FLAGS.NORMAL,
          },
          {
            from: "c2",
            to: "a4",
            flag: MOVE_FLAGS.NORMAL,
          },
          {
            from: "c2",
            to: "d3",
            flag: MOVE_FLAGS.NORMAL,
          },
          {
            from: "c2",
            to: "e4",
            flag: MOVE_FLAGS.NORMAL,
          },
          {
            from: "c2",
            to: "f5",
            flag: MOVE_FLAGS.NORMAL,
          },
          {
            from: "c2",
            to: "g6",
            flag: MOVE_FLAGS.NORMAL,
          },
          {
            from: "c2",
            to: "h7",
            flag: MOVE_FLAGS.NORMAL,
          },
        ],
      },
    ],
  };

  runTest("K6b/8/3b4/2b3b1/8/8/B1BB4/7k w - - 0 1", expectedMoves);
});
