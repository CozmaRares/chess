import { describe, expect, test } from "vitest";
import Chess, {
  COLOR,
  Color,
  InternalMove,
  MOVE_FLAGS,
  Square,
} from "../engine";

type TestMove = Omit<InternalMove, "piece">;

type ExpectedMoves = Record<
  string,
  {
    square: Square;
    moves: Array<TestMove>;
  }[]
>;

function runTest(fen: string, expectedMoves: ExpectedMoves, color?: Color) {
  const chess = Chess.load(fen);

  Object.keys(expectedMoves).forEach((key) =>
    test(
      key
        .split("_")
        .concat([color ?? ""])
        .join(" "),
      () =>
        expectedMoves[key].forEach(({ square, moves: expectedMoves }) => {
          const moves: Array<TestMove> = chess
            .getMovesForSquare(square)
            .map(({ from, to, flags, promotion }) => {
              return promotion
                ? {
                  from,
                  to,
                  flags,
                  promotion,
                }
                : { from, to, flags };
            });

          expect(moves).toHaveLength(expectedMoves.length);
          moves.forEach((move) => expect(expectedMoves).toContainEqual(move));
          expectedMoves.forEach((expectedMove) =>
            expect(moves).toContainEqual(expectedMove)
          );
        })
    )
  );
}

function runTests(
  fen: string,
  expectedMovesW: ExpectedMoves,
  expectedMovesB: ExpectedMoves
) {
  runTest(fen.replace("%", "w"), expectedMovesW, COLOR.WHITE);
  runTest(fen.replace("%", "b"), expectedMovesB, COLOR.BLACK);
}

describe("pawn moves", () => {
  const expectedMovesW: ExpectedMoves = {
    can_jump: [
      {
        square: "a2",
        moves: [
          { from: "a2", to: "a3", flags: MOVE_FLAGS.NORMAL },
          { from: "a2", to: "a4", flags: MOVE_FLAGS.PAWN_JUMP },
        ],
      },
    ],
    promotion: [
      {
        square: "b7",
        moves: [
          { from: "b7", to: "b8", flags: MOVE_FLAGS.PROMOTION, promotion: "n" },
          { from: "b7", to: "b8", flags: MOVE_FLAGS.PROMOTION, promotion: "b" },
          { from: "b7", to: "b8", flags: MOVE_FLAGS.PROMOTION, promotion: "r" },
          { from: "b7", to: "b8", flags: MOVE_FLAGS.PROMOTION, promotion: "q" },
          {
            from: "b7",
            to: "a8",
            flags: MOVE_FLAGS.PROMOTION | MOVE_FLAGS.CAPTURE,
            promotion: "n",
          },
          {
            from: "b7",
            to: "a8",
            flags: MOVE_FLAGS.PROMOTION | MOVE_FLAGS.CAPTURE,
            promotion: "b",
          },
          {
            from: "b7",
            to: "a8",
            flags: MOVE_FLAGS.PROMOTION | MOVE_FLAGS.CAPTURE,
            promotion: "r",
          },
          {
            from: "b7",
            to: "a8",
            flags: MOVE_FLAGS.PROMOTION | MOVE_FLAGS.CAPTURE,
            promotion: "q",
          },
        ],
      },
    ],
    regular: [
      {
        square: "c3",
        moves: [{ from: "c3", to: "c4", flags: MOVE_FLAGS.NORMAL }],
      },
    ],
    attack: [
      {
        square: "d4",
        moves: [
          { from: "d4", to: "d5", flags: MOVE_FLAGS.NORMAL },
          { from: "d4", to: "e5", flags: MOVE_FLAGS.CAPTURE },
        ],
      },
    ],
    blocked: [
      {
        square: "c6",
        moves: [],
      },
    ],
  };

  const expectedMovesB: ExpectedMoves = {
    can_jump: [
      {
        square: "h7",
        moves: [
          { from: "h7", to: "h6", flags: MOVE_FLAGS.NORMAL },
          { from: "h7", to: "h5", flags: MOVE_FLAGS.PAWN_JUMP },
        ],
      },
    ],
    promotion: [
      {
        square: "g2",
        moves: [
          { from: "g2", to: "g1", flags: MOVE_FLAGS.PROMOTION, promotion: "n" },
          { from: "g2", to: "g1", flags: MOVE_FLAGS.PROMOTION, promotion: "b" },
          { from: "g2", to: "g1", flags: MOVE_FLAGS.PROMOTION, promotion: "r" },
          { from: "g2", to: "g1", flags: MOVE_FLAGS.PROMOTION, promotion: "q" },
          {
            from: "g2",
            to: "h1",
            flags: MOVE_FLAGS.PROMOTION | MOVE_FLAGS.CAPTURE,
            promotion: "n",
          },
          {
            from: "g2",
            to: "h1",
            flags: MOVE_FLAGS.PROMOTION | MOVE_FLAGS.CAPTURE,
            promotion: "b",
          },
          {
            from: "g2",
            to: "h1",
            flags: MOVE_FLAGS.PROMOTION | MOVE_FLAGS.CAPTURE,
            promotion: "r",
          },
          {
            from: "g2",
            to: "h1",
            flags: MOVE_FLAGS.PROMOTION | MOVE_FLAGS.CAPTURE,
            promotion: "q",
          },
        ],
      },
    ],
    regular: [
      {
        square: "f6",
        moves: [{ from: "f6", to: "f5", flags: MOVE_FLAGS.NORMAL }],
      },
    ],
    attack: [
      {
        square: "e5",
        moves: [
          { from: "e5", to: "e4", flags: MOVE_FLAGS.NORMAL },
          { from: "e5", to: "d4", flags: MOVE_FLAGS.CAPTURE },
        ],
      },
    ],
    blocked: [
      {
        square: "c7",
        moves: [],
      },

      {
        square: "e7",
        moves: [{ from: "e7", to: "e6", flags: MOVE_FLAGS.NORMAL }],
      },
    ],
  };

  runTests(
    "r6k/1Pp1p2p/2P2p2/4p3/3P4/2P5/P5p1/K6R % - - 0 1",
    expectedMovesW,
    expectedMovesB
  );
});

describe("knight moves", () => {
  const expectedMovesW: ExpectedMoves = {
    exclude_g: [
      {
        square: "g2",
        moves: [
          { from: "g2", to: "e1", flags: MOVE_FLAGS.NORMAL },
          { from: "g2", to: "e3", flags: MOVE_FLAGS.NORMAL },
          { from: "g2", to: "f4", flags: MOVE_FLAGS.NORMAL },
          { from: "g2", to: "h4", flags: MOVE_FLAGS.NORMAL },
        ],
      },
    ],
    exclude_h: [
      {
        square: "h1",
        moves: [
          { from: "h1", to: "f2", flags: MOVE_FLAGS.NORMAL },
          { from: "h1", to: "g3", flags: MOVE_FLAGS.NORMAL },
        ],
      },
    ],
    attack: [
      {
        square: "a2",
        moves: [
          { from: "a2", to: "c1", flags: MOVE_FLAGS.NORMAL },
          { from: "a2", to: "c3", flags: MOVE_FLAGS.CAPTURE },
          { from: "a2", to: "b4", flags: MOVE_FLAGS.NORMAL },
        ],
      },
    ],
    regular: [
      {
        square: "e5",
        moves: [
          { from: "e5", to: "g6", flags: MOVE_FLAGS.NORMAL },
          { from: "e5", to: "f7", flags: MOVE_FLAGS.NORMAL },
          { from: "e5", to: "d7", flags: MOVE_FLAGS.NORMAL },
          { from: "e5", to: "c6", flags: MOVE_FLAGS.NORMAL },
          { from: "e5", to: "c4", flags: MOVE_FLAGS.NORMAL },
          { from: "e5", to: "d3", flags: MOVE_FLAGS.NORMAL },
          { from: "e5", to: "f3", flags: MOVE_FLAGS.NORMAL },
          { from: "e5", to: "g4", flags: MOVE_FLAGS.NORMAL },
        ],
      },
    ],
  };

  const expectedMovesB: ExpectedMoves = {
    exclude_a: [
      {
        square: "a8",
        moves: [
          { from: "a8", to: "b6", flags: MOVE_FLAGS.NORMAL },
          { from: "a8", to: "c7", flags: MOVE_FLAGS.NORMAL },
        ],
      },
    ],
    exclude_b: [
      {
        square: "b7",
        moves: [
          { from: "b7", to: "a5", flags: MOVE_FLAGS.NORMAL },
          { from: "b7", to: "c5", flags: MOVE_FLAGS.NORMAL },
          { from: "b7", to: "d6", flags: MOVE_FLAGS.NORMAL },
          { from: "b7", to: "d8", flags: MOVE_FLAGS.NORMAL },
        ],
      },
    ],

    attack: [
      {
        square: "c3",
        moves: [
          { from: "c3", to: "e4", flags: MOVE_FLAGS.NORMAL },
          { from: "c3", to: "b5", flags: MOVE_FLAGS.NORMAL },
          { from: "c3", to: "a4", flags: MOVE_FLAGS.NORMAL },
          { from: "c3", to: "a2", flags: MOVE_FLAGS.CAPTURE },
          { from: "c3", to: "b1", flags: MOVE_FLAGS.NORMAL },
          { from: "c3", to: "d1", flags: MOVE_FLAGS.NORMAL },
          { from: "c3", to: "e2", flags: MOVE_FLAGS.NORMAL },
        ],
      },
    ],
  };

  runTests(
    "n7/Kn6/8/3kN3/8/2n5/N5N1/7N % - - 0 1",
    expectedMovesW,
    expectedMovesB
  );
});

describe("bishop moves", () => {
  const expectedMovesW: ExpectedMoves = {
    exclude_a: [
      {
        square: "a2",
        moves: [
          { from: "a2", to: "b3", flags: MOVE_FLAGS.NORMAL },
          { from: "a2", to: "c4", flags: MOVE_FLAGS.NORMAL },
          { from: "a2", to: "d5", flags: MOVE_FLAGS.NORMAL },
          { from: "a2", to: "e6", flags: MOVE_FLAGS.NORMAL },
          { from: "a2", to: "f7", flags: MOVE_FLAGS.NORMAL },
          { from: "a2", to: "g8", flags: MOVE_FLAGS.NORMAL },
          { from: "a2", to: "b1", flags: MOVE_FLAGS.NORMAL },
        ],
      },
    ],
    attack: [
      {
        square: "d2",
        moves: [
          { from: "d2", to: "c1", flags: MOVE_FLAGS.NORMAL },
          { from: "d2", to: "e1", flags: MOVE_FLAGS.NORMAL },
          { from: "d2", to: "c3", flags: MOVE_FLAGS.NORMAL },
          { from: "d2", to: "b4", flags: MOVE_FLAGS.NORMAL },
          { from: "d2", to: "a5", flags: MOVE_FLAGS.NORMAL },
          { from: "d2", to: "e3", flags: MOVE_FLAGS.NORMAL },
          { from: "d2", to: "f4", flags: MOVE_FLAGS.NORMAL },
          { from: "d2", to: "g5", flags: MOVE_FLAGS.CAPTURE },
        ],
      },
    ],
    regular: [
      {
        square: "c2",
        moves: [
          { from: "c2", to: "b1", flags: MOVE_FLAGS.NORMAL },
          { from: "c2", to: "d1", flags: MOVE_FLAGS.NORMAL },
          { from: "c2", to: "b3", flags: MOVE_FLAGS.NORMAL },
          { from: "c2", to: "a4", flags: MOVE_FLAGS.NORMAL },
          { from: "c2", to: "d3", flags: MOVE_FLAGS.NORMAL },
          { from: "c2", to: "e4", flags: MOVE_FLAGS.NORMAL },
          { from: "c2", to: "f5", flags: MOVE_FLAGS.NORMAL },
          { from: "c2", to: "g6", flags: MOVE_FLAGS.NORMAL },
          { from: "c2", to: "h7", flags: MOVE_FLAGS.NORMAL },
        ],
      },
    ],
  };

  const expectedMovesB: ExpectedMoves = {
    exclude_h: [
      {
        square: "h8",
        moves: [
          { from: "h8", to: "g7", flags: MOVE_FLAGS.NORMAL },
          { from: "h8", to: "f6", flags: MOVE_FLAGS.NORMAL },
          { from: "h8", to: "e5", flags: MOVE_FLAGS.NORMAL },
          { from: "h8", to: "d4", flags: MOVE_FLAGS.NORMAL },
          { from: "h8", to: "c3", flags: MOVE_FLAGS.NORMAL },
          { from: "h8", to: "b2", flags: MOVE_FLAGS.NORMAL },
          { from: "h8", to: "a1", flags: MOVE_FLAGS.NORMAL },
        ],
      },
    ],
    attack: [
      {
        square: "g5",
        moves: [
          { from: "g5", to: "h6", flags: MOVE_FLAGS.NORMAL },
          { from: "g5", to: "h4", flags: MOVE_FLAGS.NORMAL },
          { from: "g5", to: "f6", flags: MOVE_FLAGS.NORMAL },
          { from: "g5", to: "e7", flags: MOVE_FLAGS.NORMAL },
          { from: "g5", to: "d8", flags: MOVE_FLAGS.NORMAL },
          { from: "g5", to: "f4", flags: MOVE_FLAGS.NORMAL },
          { from: "g5", to: "e3", flags: MOVE_FLAGS.NORMAL },
          { from: "g5", to: "d2", flags: MOVE_FLAGS.CAPTURE },
        ],
      },
    ],
    attack_same_color: [
      {
        square: "c5",
        moves: [
          { from: "c5", to: "b6", flags: MOVE_FLAGS.NORMAL },
          { from: "c5", to: "a7", flags: MOVE_FLAGS.NORMAL },
          { from: "c5", to: "d4", flags: MOVE_FLAGS.NORMAL },
          { from: "c5", to: "e3", flags: MOVE_FLAGS.NORMAL },
          { from: "c5", to: "f2", flags: MOVE_FLAGS.NORMAL },
          { from: "c5", to: "g1", flags: MOVE_FLAGS.NORMAL },
          { from: "c5", to: "b4", flags: MOVE_FLAGS.NORMAL },
          { from: "c5", to: "a3", flags: MOVE_FLAGS.NORMAL },
        ],
      },
      {
        square: "d6",
        moves: [
          { from: "d6", to: "c7", flags: MOVE_FLAGS.NORMAL },
          { from: "d6", to: "b8", flags: MOVE_FLAGS.NORMAL },
          { from: "d6", to: "e7", flags: MOVE_FLAGS.NORMAL },
          { from: "d6", to: "f8", flags: MOVE_FLAGS.NORMAL },
          { from: "d6", to: "e5", flags: MOVE_FLAGS.NORMAL },
          { from: "d6", to: "f4", flags: MOVE_FLAGS.NORMAL },
          { from: "d6", to: "g3", flags: MOVE_FLAGS.NORMAL },
          { from: "d6", to: "h2", flags: MOVE_FLAGS.NORMAL },
        ],
      },
    ],
  };

  runTests(
    "K6b/8/3b4/2b3b1/8/8/B1BB4/7k % - - 0 1",
    expectedMovesW,
    expectedMovesB
  );
});

describe("rook moves", () => {
  const expectedMovesW: ExpectedMoves = {
    exclude_a: [
      {
        square: "a5",
        moves: [
          { from: "a5", to: "a1", flags: MOVE_FLAGS.NORMAL },
          { from: "a5", to: "a2", flags: MOVE_FLAGS.NORMAL },
          { from: "a5", to: "a3", flags: MOVE_FLAGS.NORMAL },
          { from: "a5", to: "a4", flags: MOVE_FLAGS.NORMAL },
          { from: "a5", to: "a6", flags: MOVE_FLAGS.NORMAL },
          { from: "a5", to: "a7", flags: MOVE_FLAGS.NORMAL },
          { from: "a5", to: "a8", flags: MOVE_FLAGS.NORMAL },
          { from: "a5", to: "b5", flags: MOVE_FLAGS.NORMAL },
          { from: "a5", to: "c5", flags: MOVE_FLAGS.NORMAL },
          { from: "a5", to: "d5", flags: MOVE_FLAGS.NORMAL },
          { from: "a5", to: "e5", flags: MOVE_FLAGS.NORMAL },
          { from: "a5", to: "f5", flags: MOVE_FLAGS.NORMAL },
          { from: "a5", to: "g5", flags: MOVE_FLAGS.NORMAL },
          { from: "a5", to: "h5", flags: MOVE_FLAGS.NORMAL },
        ],
      },
    ],
  };

  const expectedMovesB: ExpectedMoves = {
    exclude_h: [
      {
        square: "h2",
        moves: [
          { from: "h2", to: "h1", flags: MOVE_FLAGS.NORMAL },
          { from: "h2", to: "h3", flags: MOVE_FLAGS.NORMAL },
          { from: "h2", to: "h4", flags: MOVE_FLAGS.NORMAL },
          { from: "h2", to: "h5", flags: MOVE_FLAGS.NORMAL },
          { from: "h2", to: "h6", flags: MOVE_FLAGS.NORMAL },
          { from: "h2", to: "h7", flags: MOVE_FLAGS.NORMAL },
          { from: "h2", to: "h8", flags: MOVE_FLAGS.NORMAL },
          { from: "h2", to: "g2", flags: MOVE_FLAGS.NORMAL },
          { from: "h2", to: "f2", flags: MOVE_FLAGS.NORMAL },
          { from: "h2", to: "e2", flags: MOVE_FLAGS.NORMAL },
          { from: "h2", to: "d2", flags: MOVE_FLAGS.NORMAL },
          { from: "h2", to: "c2", flags: MOVE_FLAGS.NORMAL },
          { from: "h2", to: "b2", flags: MOVE_FLAGS.NORMAL },
          { from: "h2", to: "a2", flags: MOVE_FLAGS.NORMAL },
        ],
      },
    ],
  };

  runTests("8/6K1/8/R7/8/8/7r/6k1 % - - 0 1", expectedMovesW, expectedMovesB);
});

describe("queen and king moves", () => {
  const expectedMovesW: ExpectedMoves = {
    white_queen: [
      {
        square: "h8",
        moves: [
          { from: "h8", to: "g8", flags: MOVE_FLAGS.NORMAL },
          { from: "h8", to: "f8", flags: MOVE_FLAGS.NORMAL },
          { from: "h8", to: "e8", flags: MOVE_FLAGS.NORMAL },
          { from: "h8", to: "d8", flags: MOVE_FLAGS.NORMAL },
          { from: "h8", to: "c8", flags: MOVE_FLAGS.NORMAL },
          { from: "h8", to: "b8", flags: MOVE_FLAGS.NORMAL },
          { from: "h8", to: "a8", flags: MOVE_FLAGS.NORMAL },
          { from: "h8", to: "h7", flags: MOVE_FLAGS.NORMAL },
          { from: "h8", to: "h6", flags: MOVE_FLAGS.NORMAL },
          { from: "h8", to: "h5", flags: MOVE_FLAGS.NORMAL },
          { from: "h8", to: "h4", flags: MOVE_FLAGS.NORMAL },
          { from: "h8", to: "h3", flags: MOVE_FLAGS.NORMAL },
          { from: "h8", to: "h2", flags: MOVE_FLAGS.NORMAL },
          { from: "h8", to: "h1", flags: MOVE_FLAGS.NORMAL },
          { from: "h8", to: "g7", flags: MOVE_FLAGS.NORMAL },
          { from: "h8", to: "f6", flags: MOVE_FLAGS.NORMAL },
          { from: "h8", to: "e5", flags: MOVE_FLAGS.NORMAL },
          { from: "h8", to: "d4", flags: MOVE_FLAGS.NORMAL },
          { from: "h8", to: "c3", flags: MOVE_FLAGS.NORMAL },
          { from: "h8", to: "b2", flags: MOVE_FLAGS.NORMAL },
          { from: "h8", to: "a1", flags: MOVE_FLAGS.NORMAL },
        ],
      },
    ],
    white_king: [
      {
        square: "g3",
        moves: [
          { from: "g3", to: "f3", flags: MOVE_FLAGS.NORMAL },
          { from: "g3", to: "f4", flags: MOVE_FLAGS.NORMAL },
          { from: "g3", to: "g4", flags: MOVE_FLAGS.NORMAL },
          { from: "g3", to: "h4", flags: MOVE_FLAGS.NORMAL },
          { from: "g3", to: "h3", flags: MOVE_FLAGS.NORMAL },
        ],
      },
    ],
  };

  const expectedMovesB: ExpectedMoves = {
    black_queen: [
      {
        square: "a2",
        moves: [
          { from: "a2", to: "a1", flags: MOVE_FLAGS.NORMAL },
          { from: "a2", to: "a3", flags: MOVE_FLAGS.NORMAL },
          { from: "a2", to: "a4", flags: MOVE_FLAGS.NORMAL },
          { from: "a2", to: "a5", flags: MOVE_FLAGS.NORMAL },
          { from: "a2", to: "a6", flags: MOVE_FLAGS.NORMAL },
          { from: "a2", to: "a7", flags: MOVE_FLAGS.NORMAL },
          { from: "a2", to: "a8", flags: MOVE_FLAGS.NORMAL },
          { from: "a2", to: "b2", flags: MOVE_FLAGS.NORMAL },
          { from: "a2", to: "b1", flags: MOVE_FLAGS.NORMAL },
          { from: "a2", to: "c2", flags: MOVE_FLAGS.NORMAL },
          { from: "a2", to: "d2", flags: MOVE_FLAGS.NORMAL },
          { from: "a2", to: "e2", flags: MOVE_FLAGS.NORMAL },
          { from: "a2", to: "f2", flags: MOVE_FLAGS.NORMAL },
          { from: "a2", to: "g2", flags: MOVE_FLAGS.NORMAL },
          { from: "a2", to: "h2", flags: MOVE_FLAGS.NORMAL },
          { from: "a2", to: "b3", flags: MOVE_FLAGS.NORMAL },
          { from: "a2", to: "c4", flags: MOVE_FLAGS.NORMAL },
          { from: "a2", to: "d5", flags: MOVE_FLAGS.NORMAL },
          { from: "a2", to: "e6", flags: MOVE_FLAGS.NORMAL },
          { from: "a2", to: "f7", flags: MOVE_FLAGS.NORMAL },
          { from: "a2", to: "g8", flags: MOVE_FLAGS.NORMAL },
        ],
      },
    ],
    black_king: [
      {
        square: "c7",
        moves: [
          { from: "c7", to: "b7", flags: MOVE_FLAGS.NORMAL },
          { from: "c7", to: "b6", flags: MOVE_FLAGS.NORMAL },
          { from: "c7", to: "c6", flags: MOVE_FLAGS.NORMAL },
          { from: "c7", to: "d6", flags: MOVE_FLAGS.NORMAL },
          { from: "c7", to: "d7", flags: MOVE_FLAGS.NORMAL },
        ],
      },
    ],
  };

  runTests("7Q/2k5/8/8/8/6K1/q7/8 % - - 0 1", expectedMovesW, expectedMovesB);
});

describe("en passant", () => {
  const expectedMoves: ExpectedMoves = {
    white_sees_ep_square: [
      {
        square: "d5",
        moves: [
          { from: "d5", to: "d6", flags: MOVE_FLAGS.NORMAL },
          { from: "d5", to: "e6", flags: MOVE_FLAGS.EN_PASSANT },
        ],
      },
    ],
  };

  runTest(
    "rnbqkbnr/pp1p1ppp/8/2pPp3/8/8/PPP1PPPP/RNBQKBNR w KQkq e6 0 3",
    expectedMoves
  );
});

describe("castling", () => {
  const expectedMoves: ExpectedMoves = {
    white_castling: [
      {
        square: "e1",
        moves: [
          { from: "e1", to: "g1", flags: MOVE_FLAGS.K_CASTLE },
          { from: "e1", to: "d2", flags: MOVE_FLAGS.NORMAL },
          { from: "e1", to: "f1", flags: MOVE_FLAGS.NORMAL },
        ],
      },
    ],
  };

  runTest(
    "rn1qkbnr/p4ppp/B1p5/1p1pp3/3PPBb1/2NQ3N/PPP2PPP/R3K2R w KQkq - 0 8",
    expectedMoves
  );
});
