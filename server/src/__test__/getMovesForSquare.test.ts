import { describe, expect, test } from "vitest";
import Chess, { MOVE_FLAGS, Move, Square } from "../chess/engine";

type ExpectedMove = {
  square: Square;
  moves: Move[];
};

describe("simple moves", () => {
  describe("pawn moves", () => {
    const chess = Chess.load("7k/1P5p/5p2/4p3/3P4/2P5/P5p1/K7 w - - 0 1");

    const expectedMoves: Record<string, ExpectedMove[]> = {
      starting: [
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
    };

    Object.keys(expectedMoves).forEach(key =>
      test(key, () =>
        expectedMoves[key].forEach(({ square, moves: expectedMoves }) => {
          const moves = chess.getMovesForSquare(square);

          // console.log({ square, expectedMoves, moves });
          // console.log();

          expect(moves.length).toEqual(expectedMoves.length);

          moves.forEach(move => expect(expectedMoves).toContain(move));
          expectedMoves.forEach(move => expect(moves).toContain(move));
        })
      )
    );
  });
});
