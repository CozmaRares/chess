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

export type PiecePromotionType = (typeof PIECE_PROMOTION)[number];
export type PieceType = (typeof PIECE)[keyof typeof PIECE];

export const COLOR = Object.freeze({
  WHITE: "w",
  BLACK: "b",
} as const);

export type Color = (typeof COLOR)[keyof typeof COLOR];

export type Piece = {
  type: PieceType;
  color: Color;
};

export type Board = (Piece | null)[];

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

const EN_PASSANT_SQUARES = {
  w: ["a6", "b6", "c6", "d6", "e6", "f6", "g6", "h6"],
  b: ["a3", "b3", "c3", "d3", "e3", "f3", "g3", "h3"],
};

function isSquareValid(string: string): boolean {
  return (SQUARES as readonly string[]).includes(string);
}

export const EMPTY_SQUARE = "-";
export type Square = (typeof SQUARES)[number] | typeof EMPTY_SQUARE;

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

export type MoveFlag = (typeof MOVE_FLAGS)[keyof typeof MOVE_FLAGS];

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

export function rank(squareIdx: number): number {
  return squareIdx >> 3;
}

export const RANK = Object.freeze({
  FIRST: 7,
  SECOND: 6,
  THIRD: 5,
  FORTH: 4,
  FIFTH: 3,
  SIXTH: 2,
  SEVENTH: 1,
  EIGHTH: 0,
} as const);

export function file(squareIdx: number): number {
  return squareIdx & 0b111;
}

export const FILE: Record<string, number> = Object.freeze({
  A: 0,
  B: 1,
  C: 2,
  D: 3,
  E: 4,
  F: 5,
  G: 6,
  H: 7,
});

export function isDigit(c: string): boolean {
  return /^\d$/.test(c);
}

export function squareIndex(square: Square): number {
  if (square == EMPTY_SQUARE) return -1;

  return SQUARES.indexOf(square);
}

export function algebraic(square: number): Square {
  const f = file(square);
  const r = rank(square);
  return ("abcdefgh"[f] + "87654321"[r]) as Square;
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

  const validateEnPassant = (enPassant: string, turn: Color) => {
    if (enPassant != "-" && !EN_PASSANT_SQUARES[turn].includes(enPassant))
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
  validateEnPassant(fields[3], fields[1] as Color);
  validateHalfMoves(fields[4]);
  validateFullMoves(fields[5]);
  validatePosition(fields[0]);
}

const PAWN_MOVE_INFO = Object.freeze({
  w: { offset: -8, promotion: RANK.EIGHTH, jumpRank: RANK.SECOND },
  b: { offset: 8, promotion: RANK.FIRST, jumpRank: RANK.SEVENTH },
});

const PAWN_ATTACKS = Object.freeze([
  { offset: 1, excludedFile: FILE.H },
  { offset: -1, excludedFile: FILE.A },
]);

const PIECE_MOVE_INFO = Object.freeze({
  n: {
    generateMultiple: false,
    moves: [
      { offset: -17, excludedFiles: [FILE.A] },
      { offset: -10, excludedFiles: [FILE.A, FILE.B] },
      { offset: 6, excludedFiles: [FILE.A, FILE.B] },
      { offset: 15, excludedFiles: [FILE.A] },
      { offset: 17, excludedFiles: [FILE.H] },
      { offset: 10, excludedFiles: [FILE.G, FILE.H] },
      { offset: -6, excludedFiles: [FILE.G, FILE.H] },
      { offset: -15, excludedFiles: [FILE.H] },
    ],
  },
  b: {
    generateMultiple: true,
    moves: [
      { offset: -9, excludedFiles: [FILE.A] },
      { offset: -7, excludedFiles: [FILE.H] },
      { offset: 9, excludedFiles: [FILE.H] },
      { offset: 7, excludedFiles: [FILE.A] },
    ],
  },
  r: {
    generateMultiple: true,
    moves: [
      { offset: -8, excludedFiles: [] },
      { offset: 1, excludedFiles: [FILE.H] },
      { offset: 8, excludedFiles: [] },
      { offset: -1, excludedFiles: [FILE.A] },
    ],
  },
  q: {
    generateMultiple: true,
    moves: [
      { offset: -9, excludedFiles: [FILE.A] },
      { offset: -7, excludedFiles: [FILE.H] },
      { offset: 9, excludedFiles: [FILE.H] },
      { offset: 7, excludedFiles: [FILE.A] },
      { offset: -8, excludedFiles: [] },
      { offset: 1, excludedFiles: [FILE.H] },
      { offset: 8, excludedFiles: [] },
      { offset: -1, excludedFiles: [FILE.A] },
    ],
  },
  k: {
    generateMultiple: false,
    moves: [
      { offset: -9, excludedFiles: [FILE.A] },
      { offset: -7, excludedFiles: [FILE.H] },
      { offset: 9, excludedFiles: [FILE.H] },
      { offset: 7, excludedFiles: [FILE.A] },
      { offset: -8, excludedFiles: [] },
      { offset: 1, excludedFiles: [FILE.H] },
      { offset: 8, excludedFiles: [] },
      { offset: -1, excludedFiles: [FILE.A] },
    ],
  },
});

function generatePawnMoves(
  board: Readonly<Board>,
  position: number,
  color: Color
): Move[] {
  if (board[position] == null) return [];

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

  const offset = PAWN_MOVE_INFO[color].offset;
  const nextPosition = position + offset;

  if (board[nextPosition] == null) {
    if (rank(nextPosition) == PAWN_MOVE_INFO[color].promotion)
      generatePromotionMoves(position, nextPosition);
    else {
      moves.push({
        from: algebraic(position),
        to: algebraic(nextPosition),
        flag: MOVE_FLAGS.NORMAL,
      });

      if (rank(position) == PAWN_MOVE_INFO[color].jumpRank) {
        const jumpPosition = nextPosition + offset;

        if (board[jumpPosition] == null)
          moves.push({
            from: algebraic(position),
            to: algebraic(jumpPosition),
            flag: MOVE_FLAGS.PAWN_JUMP,
          });
      }
    }
  }

  PAWN_ATTACKS.forEach(({ offset, excludedFile }) => {
    const attackPosition = nextPosition + offset;

    const piece = board[attackPosition];

    if (file(position) != excludedFile && piece != null && piece.color != color)
      moves.push({
        from: algebraic(position),
        to: algebraic(attackPosition),
        flag: MOVE_FLAGS.CAPTURE,
      });
  });

  return moves;
}

export function generatePieceMoves(
  board: Readonly<Board>,
  position: number,
  piece: Piece
): Move[] {
  if (piece.type == PIECE.PAWN)
    return generatePawnMoves(board, position, piece.color);

  const type = piece.type; // hacked the type system

  const generateOnce = () => {
    const moves: Move[] = [];

    PIECE_MOVE_INFO[type].moves.forEach(({ offset, excludedFiles }) => {
      if (excludedFiles.includes(file(position))) return;

      const nextPosition = position + offset;

      if (nextPosition < 0 || nextPosition >= 64) return;

      const attackedPiece = board[nextPosition];

      if (attackedPiece == null)
        moves.push({
          from: algebraic(position),
          to: algebraic(nextPosition),
          flag: MOVE_FLAGS.NORMAL,
        });
      else if (attackedPiece.color != piece.color)
        moves.push({
          from: algebraic(position),
          to: algebraic(nextPosition),
          flag: MOVE_FLAGS.CAPTURE,
        });
    });

    return moves;
  };

  const generateMultiple = () => {
    const moves: Move[] = [];

    PIECE_MOVE_INFO[type].moves.forEach(({ offset, excludedFiles }) => {
      if (excludedFiles.includes(file(position))) return;

      let nextPosition = position + offset;

      while (nextPosition >= 0 && nextPosition < 64) {
        const attackedPiece = board[nextPosition];

        if (attackedPiece == null) {
          moves.push({
            from: algebraic(position),
            to: algebraic(nextPosition),
            flag: MOVE_FLAGS.NORMAL,
          });

          if (excludedFiles.includes(file(nextPosition))) break;

          nextPosition += offset;

          continue;
        }

        if (attackedPiece.color != piece.color)
          moves.push({
            from: algebraic(position),
            to: algebraic(nextPosition),
            flag: MOVE_FLAGS.CAPTURE,
          });

        break;
      }
    });

    return moves;
  };

  return PIECE_MOVE_INFO[piece.type].generateMultiple
    ? generateMultiple()
    : generateOnce();
}

export default class Chess {
  private _board: Board;
  private _turn: Color;
  private _castling: Record<Color, number>;
  private _enPassant: Square;
  private _halfMoves;
  private _fullMoves;

  private constructor(
    board: Board,
    turn: Color,
    castling: Record<Color, number>,
    enPassant: Square,
    halfMoves: number,
    fullMoves: number
  ) {
    this._board = board;
    this._turn = turn;
    this._castling = castling;
    this._enPassant = enPassant;
    this._halfMoves = halfMoves;
    this._fullMoves = fullMoves;
  }

  static load(fen = DEFAULT_POSITION) {
    validateFEN(fen);

    const builder = new Chess.Builder();

    const fields = fen.split(" ");

    const position = fields[0];

    let square = 0;

    for (let i = 0; i < position.length; i++) {
      if (position[i] == "/") continue;

      if (isDigit(position[i])) {
        square += parseInt(position[i]);
        continue;
      }

      const piece = {
        color: position[i] < "a" ? COLOR.WHITE : COLOR.BLACK,
        type: position[i].toLowerCase() as PieceType,
      };

      builder.addPiece(square++, piece);
    }

    builder.setTurn(fields[1] as Color);
    builder.setCastling(fields[2]);
    builder.setEnPassant(fields[3] as Square);
    builder.setHalfMoves(fields[4]);
    builder.setFullMoves(fields[5]);

    return builder.build();
  }

  reset() {
    const chess = Chess.load();

    this._board = chess._board;
    this._turn = chess._turn;
    this._castling = chess._castling;
    this._enPassant = chess._enPassant;
    this._halfMoves = chess._halfMoves;
    this._fullMoves = chess._fullMoves;
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

    if (emptySquares) position += `${emptySquares}`;

    let castling = "";

    if (this._castling.w & MOVE_FLAGS.K_CASTLE) castling += "K";
    if (this._castling.w & MOVE_FLAGS.Q_CASTLE) castling += "Q";
    if (this._castling.b & MOVE_FLAGS.K_CASTLE) castling += "k";
    if (this._castling.b & MOVE_FLAGS.Q_CASTLE) castling += "q";

    if (castling == "") castling = "-";

    return [
      position.substring(1), // remove first '/'
      this._turn,
      castling,
      this._enPassant,
      this._halfMoves,
      this._fullMoves,
    ].join(" ");
  }

  getPiece(square: Square | number) {
    if (typeof square != "number") square = squareIndex(square);

    return this._board[square];
  }

  toAscii() {
    let str = "";

    for (let i = 0; i < 64; i++) {
      if (i % 8 == 0) str += `\n${8 - Math.floor(i / 8)}`;

      const piece = this.getPiece(i);

      if (piece == null) {
        str += " .";
        continue;
      }

      const pieceLetter =
        piece.color == COLOR.BLACK
          ? piece.type.toLowerCase()
          : piece.type.toUpperCase();

      str += ` ${pieceLetter}`;
    }

    str += "\n  A B C D E F G H";

    return str;
  }

  getMoves() {}

  getMovesForSquare(square: Square | number): Move[] {
    if (typeof square != "number") square = squareIndex(square);

    const piece = this.getPiece(square);

    return piece == null ? [] : generatePieceMoves(this._board, square, piece);
  }

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

  static Builder = class {
    private _board: Board;
    private _turn: Color;
    private _castling: Record<Color, number>;
    private _enPassant: Square;
    private _halfMoves: number;
    private _fullMoves: number;

    constructor() {
      this._board = new Array(64).fill(null);
      this._turn = COLOR.WHITE;
      this._castling = { w: 0, b: 0 };
      this._enPassant = EMPTY_SQUARE;
      this._halfMoves = 0;
      this._fullMoves = 1;
    }

    addPiece(square: Square | number, piece: Piece) {
      if (typeof square != "number") square = squareIndex(square);

      if (square < 0 || square > 63) return;

      this._board[square] = piece;
    }

    setTurn(turn: Color) {
      this._turn = turn;
      this._enPassant = EMPTY_SQUARE;
    }

    setCastling(castling: string) {
      if (castling.indexOf("K") > -1) this._castling.w |= MOVE_FLAGS.K_CASTLE;
      if (castling.indexOf("Q") > -1) this._castling.w |= MOVE_FLAGS.Q_CASTLE;
      if (castling.indexOf("k") > -1) this._castling.b |= MOVE_FLAGS.K_CASTLE;
      if (castling.indexOf("q") > -1) this._castling.b |= MOVE_FLAGS.Q_CASTLE;
    }

    setEnPassant(enPassant: Square) {
      if (EN_PASSANT_SQUARES[this._turn].includes(enPassant))
        this._enPassant = enPassant;
    }

    setHalfMoves(halfMoves: string) {
      this._halfMoves = parseInt(halfMoves);
    }

    setFullMoves(fullMoves: string) {
      this._fullMoves = parseInt(fullMoves);
    }

    build() {
      return new Chess(
        this._board,
        this._turn,
        this._castling,
        this._enPassant,
        this._halfMoves,
        this._fullMoves
      );
    }
  };
}
