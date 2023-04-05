export const DEFAULT_POSITION =
  "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

export const PIECE = Object.freeze({
  PAWN: "p",
  KNIGHT: "n",
  BISHOP: "b",
  ROOK: "r",
  QUEEN: "q",
  KING: "k"
} as const);

const PIECE_SYMBOLS = Object.freeze([
  PIECE.PAWN,
  PIECE.KNIGHT,
  PIECE.BISHOP,
  PIECE.ROOK,
  PIECE.QUEEN,
  PIECE.KING
] as string[]);

export type PiecePromotionType =
  | typeof PIECE.KNIGHT
  | typeof PIECE.BISHOP
  | typeof PIECE.ROOK
  | typeof PIECE.QUEEN;

export type PieceType = typeof PIECE[keyof typeof PIECE];

export const COLOR = Object.freeze({
  WHITE: "w",
  BLACK: "b"
} as const);

export type Color = typeof COLOR[keyof typeof COLOR];

export type Piece = {
  type: PieceType;
  color: Color;
};

// prettier-ignore
export const SQUARES = Object.freeze([
  'a1', 'b1', 'c1', 'd1', 'e1', 'f1', 'g1', 'h1',
  'a2', 'b2', 'c2', 'd2', 'e2', 'f2', 'g2', 'h2',
  'a3', 'b3', 'c3', 'd3', 'e3', 'f3', 'g3', 'h3',
  'a4', 'b4', 'c4', 'd4', 'e4', 'f4', 'g4', 'h4',
  'a5', 'b5', 'c5', 'd5', 'e5', 'f5', 'g5', 'h5',
  'a6', 'b6', 'c6', 'd6', 'e6', 'f6', 'g6', 'h6',
  'a7', 'b7', 'c7', 'd7', 'e7', 'f7', 'g7', 'h7',
  'a8', 'b8', 'c8', 'd8', 'e8', 'f8', 'g8', 'h8'
] as const);

export const EMPTY_SQUARE = "-";
export type Square = typeof SQUARES[number] | typeof EMPTY_SQUARE;

export const MOVE_FLAGS = Object.freeze({
  NORMAL: "n",
  CAPTURE: "c",
  BIG_PAWN: "p",
  K_CASTLE: "k",
  Q_CASTLE: "q",
  EN_PASSANT: "e"
} as const);

export type MoveFlag = typeof MOVE_FLAGS[keyof typeof MOVE_FLAGS];

export type Move = {
  from: Square;
  to: Square;
  flag: MoveFlag;
  promotion?: PiecePromotionType;
};

type InternalMove = Move & {
  beforeFEN: string;
};

// prettier-ignore
export const PIECE_MASKS: Record<keyof typeof PIECE, number> = Object.freeze({
  PAWN:   0b000001,
  KNIGHT: 0b000010,
  BISHOP: 0b000100,
  ROOK:   0b001000,
  QUEEN:  0b010000,
  KING:   0b100000
} as const);

export const COLOR_MASKS: Record<keyof typeof COLOR, number> = Object.freeze({
  WHITE: 0b01,
  BLACK: 0b10
} as const);

// prettier-ignore
export const MOVE_FLAG_MASKS: Record<keyof typeof MOVE_FLAGS, number> = Object.freeze({
  NORMAL:     0b000001,
  CAPTURE:    0b000010,
  BIG_PAWN:   0b000100,
  K_CASTLE:   0b001000,
  Q_CASTLE:   0b010000,
  EN_PASSANT: 0b100000
} as const);

const PAWN_OFFSETS = Object.freeze({
  b: [16, 32, 17, 15],
  w: [-16, -32, -17, -15]
});

const PIECE_OFFSETS = Object.freeze({
  n: [-18, -33, -31, -14, 18, 33, 31, 14],
  b: [-17, -15, 17, 15],
  r: [-16, 1, 16, -1],
  q: [-17, -16, -15, 1, 17, 16, 15, -1],
  k: [-17, -16, -15, 1, 17, 16, 15, -1]
});

export function rank(squareIdx: number): number {
  return squareIdx >> 3;
}

export function file(squareIdx: number): number {
  return squareIdx & 0b111;
}

export function isDigit(c: string): boolean {
  return /^\d$/.test(c);
}

export function algebraic(square: number): Square {
  const f = file(square);
  const r = rank(square);
  return ("abcdefgh"[f] + "12345678"[r]) as Square;
}

export function swapColor(color: Color): Color {
  return color === COLOR.WHITE ? COLOR.BLACK : COLOR.WHITE;
}

export function validateFEN(fen: string): { ok: boolean; error?: string } {
  const fields = fen.split(" ");

  if (fields.length != 6)
    return {
      ok: false,
      error: "Invalid FEN: string must contain 6 space delimited fields"
    };

  const validatePosition = (position: string) => {
    const rows = position.split("/");

    if (rows.length != 8)
      throw "Invalid FEN: board position must contain 8 rows delimited by '/'";

    const kings = [
      { regex: /K/g, color: "white" },
      { regex: /k/g, color: "black" }
    ];

    for (const king of kings) {
      const matches = position.match(king.regex) ?? [];

      if (matches.length == 0)
        throw `Invalid FEN: board position is missing ${king.color} king`;

      if (matches.length > 1)
        throw `Invalid FEN: board position contains too many ${king.color} kings`;
    }

    rows.forEach(row => {
      let numSquares = 0;
      let previousWasNumber = false;

      [...row].forEach(symbol => {
        if (isDigit(symbol)) {
          if (previousWasNumber)
            throw "Invalid FEN: board position contains consecutive digits";

          numSquares += parseInt(symbol);
          previousWasNumber = true;

          return;
        }

        if (PIECE_SYMBOLS.includes(symbol.toLowerCase()) == false)
          throw (
            "Invalid FEN: board position contains an invalid piece symbol: " +
            symbol
          );

        numSquares++;
        previousWasNumber = false;
      });

      if (numSquares != 8)
        throw "Invalid FEN: board position contains a row that does not have 8 squares";
    });
  };

  const validateTurn = (turn: string) => {
    if (/^(w|b)$/.test(turn) == false)
      throw "Invalid FEN: invalid side to move";
  };

  const validateCastling = (castling: string) => {
    if (/[^kKqQ-]/.test(castling))
      throw "Invalid FEN: string contains invalid castling rights";
  };

  const validateEnPassant = (enPassant: string, turn: string) => {
    if (!/^(-|[abcdefgh][36])$/.test(enPassant))
      throw "Invalid FEN: invalid en-passant square";
    if (turn == "w" && enPassant[1] == "3")
      throw "Invalid FEN: invalid en-passant square";
    if (turn == "b" && enPassant[1] == "6")
      throw "Invalid FEN: invalid en-passant square";
  };

  const validateHalfMoves = (halfMoves: string) => {
    if (/^\d+$/.test(halfMoves) == false)
      throw "Invalid FEN: move number must be a non-negative integer";
  };

  const validateFullMoves = (fullMoves: string) => {
    if (/^[1-9]\d*$/.test(fullMoves) == false)
      throw "Invalid FEN: number of full moves must be a positive integer";
  };

  try {
    validateTurn(fields[1]);
    validateCastling(fields[2]);
    validateEnPassant(fields[3], fields[1]);
    validateHalfMoves(fields[4]);
    validateFullMoves(fields[5]);
    validatePosition(fields[0]);
  } catch (e) {
    return { ok: false, error: `${e}` };
  }

  return { ok: true };
}

export class Chess {
  private _board: (Piece | null)[] = [];
  private _turn: Color = COLOR.WHITE;
  private _castling: Record<Color, number> = { w: 0, b: 0 };
  private _enPassant: Square = "-";
  private _halfMoves = 0;
  private _fullMoves = 1;

  constructor(fen = DEFAULT_POSITION) {
    this.load(fen);
  }

  reset() {
    this.load(DEFAULT_POSITION);
  }

  load(fen: string) {}

  getMoves() {}

  getMovesForSquare(square: Square) {}

  getFEN() {}

  makeMove() {}

  isSquareAttacked() {}

  isCheck() {}

  isCheckMate() {}

  isStalemate() {}

  isInsufficientMaterial() {}

  isThreefoldRepetition() {}

  isDraw() {}

  isGameOver() {}

  private _addToHistory() {}

  // and a way to track how many moves were undo'ed
  undo() {}

  turn() {}

  squareColor() {}

  history() {}
}
