import { describe, expect, test } from "vitest";
import { DEFAULT_POSITION, validateFEN } from "../chess/engine";

describe("valid FEN strings", () => {
  test("starting position", () => {
    expect(validateFEN(DEFAULT_POSITION)).toBeUndefined();
  });

  test("1. e4", () => {
    expect(
      validateFEN("rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1")
    ).toBeUndefined();
  });

  test("1. e4 2. e5", () => {
    expect(
      validateFEN(
        "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e6 0 2"
      )
    ).toBeUndefined();
  });

  test("1. e4 2. e5 3. ke2", () => {
    expect(
      validateFEN("rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPPKPPP/RNBQ1BNR b kq - 1 2")
    ).toBeUndefined();
  });

  test("random position 1", () => {
    expect(
      validateFEN("r1b1r1k1/pp4pp/3Bpp2/8/2q5/P5Q1/3R1PPP/R5K1 b - - 0 19")
    ).toBeUndefined();
  });

  test("random position 2", () => {
    expect(
      validateFEN("1k6/1pp5/p7/5B1p/PP6/6K1/4p2r/4R3 b - - 3 43")
    ).toBeUndefined();
  });

  test("random position 3", () => {
    expect(validateFEN("8/8/2k2Q2/8/5P2/8/1p6/6K1 b - - 1 48")).toBeUndefined();
  });
});

describe("invalid FEN strings", () => {
  test("string doesn't contain 6 fields", () => {
    expect(() =>
      validateFEN("8/8/2k2Q2/8/5P2/8/1p6/6K1 b - 1 48")
    ).toThrowError(
      /^Invalid FEN - string must contain 6 space delimited fields$/
    );
  });

  describe("invalid board position", () => {
    test("doesn't contain 8 fields/rows", () => {
      expect(() =>
        validateFEN("8/8/2k2Q2/8/5P2/8/1p6 b - - 1 48")
      ).toThrowError(
        /^Invalid FEN - board position must contain 8 rows delimited by '\/'$/
      );
    });

    test("missing white king", () => {
      expect(() =>
        validateFEN("8/8/2k2Q2/8/5P2/8/1p6/8 b - - 1 48")
      ).toThrowError(/^Invalid FEN - board position is missing white king$/);
    });

    test("missing black king", () => {
      expect(() =>
        validateFEN("8/8/2K2Q2/8/5P2/8/1p6/8 b - - 1 48")
      ).toThrowError(/^Invalid FEN - board position is missing black king$/);
    });

    test("too many white kings", () => {
      expect(() =>
        validateFEN("8/7K/2k2Q2/8/5P2/8/1p6/6K1 b - - 1 48")
      ).toThrowError(
        /^Invalid FEN - board position contains too many white kings$/
      );
    });

    test("too many black kings", () => {
      expect(() =>
        validateFEN("8/7k/2k2Q2/8/5P2/8/1p6/6K1 b - - 1 48")
      ).toThrowError(
        /^Invalid FEN - board position contains too many black kings$/
      );
    });

    test("consecutive digits", () => {
      expect(() =>
        validateFEN("8/62/2k2Q2/8/5P2/8/1p6/6K1 b - - 1 48")
      ).toThrowError(
        /^Invalid FEN - board position contains consecutive digits$/
      );
    });

    test("invalid piece", () => {
      expect(() =>
        validateFEN("1k6/1Gp5/p7/5B1p/PP6/6K1/4p2r/4R3 b - - 3 43")
      ).toThrowError(
        /^Invalid FEN - board position contains an invalid piece symbol: G$/
      );
    });

    test("too many squares on row", () => {
      expect(() =>
        validateFEN("1k6/1pp5/1p7/5B1p/PP6/6K1/4p2r/4R3 b - - 3 43")
      ).toThrowError(
        /^Invalid FEN - board position contains a row that does not have 8 squares$/
      );
    });
  });

  describe("invalid turn", () => {
    test("capital W", () => {
      expect(() =>
        validateFEN("1k6/1pp5/p7/5B1p/PP6/6K1/4p2r/4R3 W - - 3 43")
      ).toThrowError(/^Invalid FEN - invalid side to move$/);
    });

    test("capital B", () => {
      expect(() =>
        validateFEN("1k6/1pp5/p7/5B1p/PP6/6K1/4p2r/4R3 B - - 3 43")
      ).toThrowError(/^Invalid FEN - invalid side to move$/);
    });

    test("invalid letter", () => {
      expect(() =>
        validateFEN("1k6/1pp5/p7/5B1p/PP6/6K1/4p2r/4R3 c - - 3 43")
      ).toThrowError(/^Invalid FEN - invalid side to move$/);
    });
  });

  describe("invalid castling rights", () => {
    test("invalid characters", () => {
      expect(() =>
        validateFEN("1k6/1pp5/p7/5B1p/PP6/6K1/4p2r/4R3 b abc - 3 43")
      ).toThrowError(/^Invalid FEN - string contains invalid castling rights$/);
    });
  });

  describe("invalid en-passant", () => {
    test("random position 1", () => {
      expect(() =>
        validateFEN("r1b1r1k1/pp4pp/3Bpp2/8/2q5/P5Q1/3R1PPP/R5K1 b - e1 0 19")
      ).toThrowError(/^Invalid FEN - invalid en-passant square$/);
    });

    test("random position 1", () => {
      expect(() =>
        validateFEN("r1b1r1k1/pp4pp/3Bpp2/8/2q5/P5Q1/3R1PPP/R5K1 w - e3 0 19")
      ).toThrowError(/^Invalid FEN - invalid en-passant square$/);
    });

    test("random position 1", () => {
      expect(() =>
        validateFEN("r1b1r1k1/pp4pp/3Bpp2/8/2q5/P5Q1/3R1PPP/R5K1 b - e6 0 19")
      ).toThrowError(/^Invalid FEN - invalid en-passant square$/);
    });
  });

  describe("invalid half moves", () => {
    test("negative number", () => {
      expect(() =>
        validateFEN("r1b1r1k1/pp4pp/3Bpp2/8/2q5/P5Q1/3R1PPP/R5K1 b - - -2 19")
      ).toThrowError(
        /^Invalid FEN - move number must be a non-negative integer$/
      );
    });

    test("not a number", () => {
      expect(() =>
        validateFEN("r1b1r1k1/pp4pp/3Bpp2/8/2q5/P5Q1/3R1PPP/R5K1 b - - abc 19")
      ).toThrowError(
        /^Invalid FEN - move number must be a non-negative integer$/
      );
    });
  });

  describe("invalid full moves", () => {
    test("negative number", () => {
      expect(() =>
        validateFEN("r1b1r1k1/pp4pp/3Bpp2/8/2q5/P5Q1/3R1PPP/R5K1 b - - 0 -3")
      ).toThrowError(
        /^Invalid FEN - number of full moves must be a positive integer$/
      );
    });

    test("zero", () => {
      expect(() =>
        validateFEN("r1b1r1k1/pp4pp/3Bpp2/8/2q5/P5Q1/3R1PPP/R5K1 b - - 0 0")
      ).toThrowError(
        /^Invalid FEN - number of full moves must be a positive integer$/
      );
    });

    test("not a number", () => {
      expect(() =>
        validateFEN("r1b1r1k1/pp4pp/3Bpp2/8/2q5/P5Q1/3R1PPP/R5K1 b - - 0 abc")
      ).toThrowError(
        /^Invalid FEN - number of full moves must be a positive integer$/
      );
    });
  });
});
