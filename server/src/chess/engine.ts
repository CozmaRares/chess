export const DEFAULT_POSITION =
  "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";

export const PIECE = Object.freeze({
  PAWN: "p",
  KNIGHT: "n",
  BISHOP: "b",
  ROOK: "r",
  QUEEN: "q",
  KING: "k",
} as const);

function isPieceValid(string: string): boolean {
  return (Object.values(PIECE) as string[]).includes(string);
}

export const PIECE_PROMOTION = Object.freeze([
  PIECE.KNIGHT,
  PIECE.BISHOP,
  PIECE.ROOK,
  PIECE.QUEEN,
] as const);

export type PiecePromotionType = typeof PIECE_PROMOTION[number];
export type PieceType = typeof PIECE[keyof typeof PIECE];

export const COLOR = Object.freeze({
  WHITE: "w",
  BLACK: "b",
} as const);

export type Color = typeof COLOR[keyof typeof COLOR];

export type Piece = {
  type: PieceType;
  color: Color;
};

// prettier-ignore
export const SQUARES = Object.freeze([
  'a8', 'b8', 'c8', 'd8', 'e8', 'f8', 'g8', 'h8',
  'a7', 'b7', 'c7', 'd7', 'e7', 'f7', 'g7', 'h7',
  'a6', 'b6', 'c6', 'd6', 'e6', 'f6', 'g6', 'h6',
  'a5', 'b5', 'c5', 'd5', 'e5', 'f5', 'g5', 'h5',
  'a4', 'b4', 'c4', 'd4', 'e4', 'f4', 'g4', 'h4',
  'a3', 'b3', 'c3', 'd3', 'e3', 'f3', 'g3', 'h3',
  'a2', 'b2', 'c2', 'd2', 'e2', 'f2', 'g2', 'h2',
  'a1', 'b1', 'c1', 'd1', 'e1', 'f1', 'g1', 'h1',
] as const);

function isSquareValid(string: string): boolean {
  return (SQUARES as readonly string[]).includes(string);
}

export const EMPTY_SQUARE = "-";
export type Square = typeof SQUARES[number] | typeof EMPTY_SQUARE;

// prettier-ignore
export const MOVE_FLAGS = Object.freeze({
  NORMAL:     0b0000001,
  CAPTURE:    0b0000010,
  K_CASTLE:   0b0000100,
  Q_CASTLE:   0b0001000,
  PAWN_JUMP:  0b0010000,
  PROMOTION:  0b0100000,
  EN_PASSANT: 0b1000000,
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
  KING:   0b100000,
} as const);

export const COLOR_MASKS: Record<keyof typeof COLOR, number> = Object.freeze({
  WHITE: 0b01,
  BLACK: 0b10,
} as const);

const PAWN_PROMOTION_RANK = Object.freeze({
  w: 8,
  b: 1,
});

const PAWN_OFFSETS = Object.freeze({
  w: 8,
  b: -8,
});

const PIECE_OFFSETS = Object.freeze({
  n: [-10, -17, -15, -6, 10, 17, 15, 6],
  b: [-9, -7, 9, 7],
  r: [-8, 1, 8, -1],
  q: [-9, -7, 9, 7, -8, 1, 8, -1],
  k: [-9, -7, 9, 7, -8, 1, 8, -1],
});

type Board = (Piece | null)[];

function generatePawnMoves(
  board: Readonly<Board>,
  position: number,
  color: Color
) {
  const moves: Move[] = [];

  const generatePromotionMoves = (from: number, to: number) => {
    const fromAlgebraic = algebraic(from);
    const toAlgebraic = algebraic(to);

    PIECE_PROMOTION.forEach(piece =>
      moves.push({
        from: fromAlgebraic,
        to: toAlgebraic,
        promotion: piece,
        flag: MOVE_FLAGS.PROMOTION,
      })
    );
  };

  const offset = PAWN_OFFSETS[color];
  const nextPosition = position + offset;

  if (board[nextPosition] == null) {
    if (rank(nextPosition) == PAWN_PROMOTION_RANK[color])
      generatePromotionMoves(position, nextPosition);
    else {
      moves.push({
        from: algebraic(position),
        to: algebraic(nextPosition),
        flag: MOVE_FLAGS.NORMAL,
      });

      const jumpPosition = nextPosition + offset;

      if (board[jumpPosition] == null)
        moves.push({
          from: algebraic(position),
          to: algebraic(jumpPosition),
          flag: MOVE_FLAGS.PAWN_JUMP,
        });
    }
  }

  [1, -1].forEach(value => {
    const attackPosition = nextPosition + value;

    if (board[attackPosition] != null)
      moves.push({
        from: algebraic(position),
        to: algebraic(attackPosition),
        flag: MOVE_FLAGS.CAPTURE,
      });
  });

  return moves;
}

function generatePieceMoves(board: Readonly<Board>) {}

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

export function validateFEN(fen: string): void {
  const fields = fen.split(" ");

  if (fields.length != 6)
    throw new Error(
      "Invalid FEN - string must contain 6 space delimited fields"
    );

  const validatePosition = (position: string) => {
    const rows = position.split("/");

    if (rows.length != 8)
      throw new Error(
        "Invalid FEN - board position must contain 8 rows delimited by '/'"
      );

    const kings = [
      { regex: /K/g, color: "white" },
      { regex: /k/g, color: "black" },
    ];

    for (const king of kings) {
      const matches = position.match(king.regex) ?? [];

      if (matches.length == 0)
        throw new Error(
          `Invalid FEN - board position is missing ${king.color} king`
        );

      if (matches.length > 1)
        throw new Error(
          `Invalid FEN - board position contains too many ${king.color} kings`
        );
    }

    rows.forEach(row => {
      let numSquares = 0;
      let previousWasNumber = false;

      [...row].forEach(symbol => {
        if (isDigit(symbol)) {
          if (previousWasNumber)
            throw new Error(
              "Invalid FEN - board position contains consecutive digits"
            );

          numSquares += parseInt(symbol);
          previousWasNumber = true;

          return;
        }

        if (!isPieceValid(symbol.toLowerCase()))
          throw new Error(
            "Invalid FEN - board position contains an invalid piece symbol: " +
              symbol
          );

        numSquares++;
        previousWasNumber = false;
      });

      if (numSquares != 8)
        throw new Error(
          "Invalid FEN - board position contains a row that does not have 8 squares"
        );
    });
  };

  const validateTurn = (turn: string) => {
    if (/^(w|b)$/.test(turn) == false)
      throw new Error("Invalid FEN - invalid side to move");
  };

  const validateCastling = (castling: string) => {
    if (/[^kKqQ-]/.test(castling))
      throw new Error("Invalid FEN - string contains invalid castling rights");
  };

  const validateEnPassant = (enPassant: string, turn: string) => {
    if (
      !/^(-|[abcdefgh][36])$/.test(enPassant) ||
      (turn == "w" && enPassant[1] == "3") ||
      (turn == "b" && enPassant[1] == "6")
    )
      throw new Error("Invalid FEN - invalid en-passant square");
  };

  const validateHalfMoves = (halfMoves: string) => {
    if (/^\d+$/.test(halfMoves) == false)
      throw new Error(
        "Invalid FEN - move number must be a non-negative integer"
      );
  };

  const validateFullMoves = (fullMoves: string) => {
    if (/^[1-9]\d*$/.test(fullMoves) == false)
      throw new Error(
        "Invalid FEN - number of full moves must be a positive integer"
      );
  };

  validateTurn(fields[1]);
  validateCastling(fields[2]);
  validateEnPassant(fields[3], fields[1]);
  validateHalfMoves(fields[4]);
  validateFullMoves(fields[5]);
  validatePosition(fields[0]);
}

export class Chess {
  private _board: Board = [];
  private _turn: Color = COLOR.WHITE;
  private _castling: Record<Color, number> = { w: 0, b: 0 };
  private _enPassant: Square = EMPTY_SQUARE;
  private _halfMoves = 0;
  private _fullMoves = 1;

  constructor(fen = DEFAULT_POSITION) {
    this.load(fen);
  }

  reset() {
    this.load(DEFAULT_POSITION);
  }

  load(fen: string) {
    validateFEN(fen);

    const fields = fen.split(" ");

    const position = fields[0];
    this._board = new Array(64).fill(null);

    let square = 0;

    for (let i = 0; i < position.length; i++) {
      if (position[i] == "/") continue;

      if (isDigit(position[i])) {
        square += parseInt(position[i]);
        continue;
      }

      this._board[square++] = {
        color: position[i] < "a" ? COLOR.WHITE : COLOR.BLACK,
        type: position[i].toLowerCase() as PieceType,
      };
    }

    this._turn = fields[1] as Color;

    this._castling = { w: 0, b: 0 };
    const castling = fields[2];
    if (castling.indexOf("K") > -1) this._castling.w |= MOVE_FLAGS.K_CASTLE;
    if (castling.indexOf("Q") > -1) this._castling.w |= MOVE_FLAGS.Q_CASTLE;
    if (castling.indexOf("k") > -1) this._castling.b |= MOVE_FLAGS.K_CASTLE;
    if (castling.indexOf("q") > -1) this._castling.b |= MOVE_FLAGS.Q_CASTLE;

    this._enPassant = fields[3] as Square;

    this._halfMoves = parseInt(fields[4]);
    this._fullMoves = parseInt(fields[5]);
  }

  getFEN() {
    let position = "";

    let emptySquares = 0;

    for (let i = 0; i < 64; i++) {
      if (i % 8 == 0) {
        if (emptySquares) position += `${emptySquares}`;

        position += "/";

        emptySquares = 0;
      }

      const piece = this.getPiece(i);

      if (piece == null) {
        emptySquares++;
        continue;
      }

      if (emptySquares) position += `${emptySquares}`;

      position +=
        piece.color == COLOR.WHITE
          ? piece.type.toUpperCase()
          : piece.type.toLowerCase();

      emptySquares = 0;
    }

    let castling = "";

    if (this._castling.w & MOVE_FLAGS.K_CASTLE) castling += "K";
    if (this._castling.w & MOVE_FLAGS.Q_CASTLE) castling += "Q";
    if (this._castling.b & MOVE_FLAGS.K_CASTLE) castling += "k";
    if (this._castling.b & MOVE_FLAGS.Q_CASTLE) castling += "q";

    return [
      position.substring(1),
      this._turn,
      castling,
      this._enPassant,
      this._halfMoves,
      this._fullMoves,
    ].join(" ");
  }

  getPiece(square: number) {
    return this._board[square];
  }

  getMoves() {}

  getMovesForSquare(square: Square) {}

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
