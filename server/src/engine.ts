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

const EN_PASSANT_ATTACK_SQUARES = {
  w: ["a6", "b6", "c6", "d6", "e6", "f6", "g6", "h6"],
  b: ["a3", "b3", "c3", "d3", "e3", "f3", "g3", "h3"],
};

export const EMPTY_SQUARE = "-";
export type Square = (typeof SQUARES)[number] | typeof EMPTY_SQUARE;

export const MOVE_FLAGS = Object.freeze({
  NORMAL: 0b0000001,
  CAPTURE: 0b0000010,
  K_CASTLE: 0b0000100,
  Q_CASTLE: 0b0001000,
  PAWN_JUMP: 0b0010000,
  PROMOTION: 0b0100000,
  EN_PASSANT: 0b1000000,
} as const);
export type MoveFlag = (typeof MOVE_FLAGS)[keyof typeof MOVE_FLAGS];

export type InternalMove = {
  from: Square;
  to: Square;
  promotion?: PiecePromotionType;
  flags: number;
};
export type Move = Pick<InternalMove, "from" | "to" | "promotion">;

export const PIECE_MASKS: Record<PieceType, number> = Object.freeze({
  p: 0b000001,
  n: 0b000010,
  b: 0b000100,
  r: 0b001000,
  q: 0b010000,
  k: 0b100000,
} as const);

export const COLOR_MASKS: Record<Color, number> = Object.freeze({
  w: 0b01,
  b: 0b10,
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

export function squareIndex(square: string | number): number {
  if (typeof square === "number") return square;
  if (square.length != 2) return -1;

  const file = square[0];
  const rank = square[1];

  if (file < "a" || file > "h" || "rank" < "1" || rank > "8") return -1;

  const fileNum = file.charCodeAt(0) - "a".charCodeAt(0);
  const rankNum = "8".charCodeAt(0) - rank.charCodeAt(0);
  return rankNum * 8 + fileNum;
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

    rows.forEach((row) => {
      let numSquares = 0;
      let previousWasNumber = false;

      [...row].forEach((symbol) => {
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
    if (
      enPassant != "-" &&
      !EN_PASSANT_ATTACK_SQUARES[turn].includes(enPassant)
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
  position: number,
  color: Color,
  board: Readonly<Board>,
  enPassantSquare: Square
): InternalMove[] {
  if (board[position] == null) return [];

  const moves: InternalMove[] = [];

  const generatePromotionMoves = (from: number, to: number, flag: MoveFlag) => {
    const fromAlgebraic = algebraic(from);
    const toAlgebraic = algebraic(to);

    PIECE_PROMOTION.forEach((piece) =>
      moves.push({
        from: fromAlgebraic,
        to: toAlgebraic,
        promotion: piece,
        flags: MOVE_FLAGS.PROMOTION | flag,
      })
    );
  };

  const offset = PAWN_MOVE_INFO[color].offset;
  const nextPosition = position + offset;

  if (board[nextPosition] == null)
    if (rank(nextPosition) == PAWN_MOVE_INFO[color].promotion)
      generatePromotionMoves(position, nextPosition, MOVE_FLAGS.NORMAL);
    else {
      moves.push({
        from: algebraic(position),
        to: algebraic(nextPosition),
        flags: MOVE_FLAGS.NORMAL,
      });

      if (rank(position) == PAWN_MOVE_INFO[color].jumpRank) {
        const jumpPosition = nextPosition + offset;

        if (board[jumpPosition] == null)
          moves.push({
            from: algebraic(position),
            to: algebraic(jumpPosition),
            flags: MOVE_FLAGS.PAWN_JUMP,
          });
      }
    }

  const enPassant = squareIndex(enPassantSquare);

  PAWN_ATTACKS.forEach(({ offset, excludedFile }) => {
    const attackPosition = nextPosition + offset;
    const piece = board[attackPosition];

    const isPiece = piece != null && piece.color != color;
    const isEnPassant =
      attackPosition == enPassant &&
      EN_PASSANT_ATTACK_SQUARES[color].includes(enPassantSquare);

    if (file(position) != excludedFile && (isPiece || isEnPassant))
      if (rank(nextPosition) == PAWN_MOVE_INFO[color].promotion)
        generatePromotionMoves(position, attackPosition, MOVE_FLAGS.CAPTURE);
      else
        moves.push({
          from: algebraic(position),
          to: algebraic(attackPosition),
          flags: isPiece ? MOVE_FLAGS.CAPTURE : MOVE_FLAGS.EN_PASSANT,
        });
  });

  return moves;
}

export function generatePieceMoves(
  position: number,
  piece: Piece,
  board: Readonly<Board>,
  enPassantSquare: Square
): InternalMove[] {
  if (piece.type == PIECE.PAWN)
    return generatePawnMoves(position, piece.color, board, enPassantSquare);

  const type = piece.type; // hacked the type system
  const generateOnce = () => {
    const moves: InternalMove[] = [];

    PIECE_MOVE_INFO[type].moves.forEach(({ offset, excludedFiles }) => {
      if (excludedFiles.includes(file(position))) return;

      const nextPosition = position + offset;

      if (nextPosition < 0 || nextPosition >= 64) return;

      const attackedPiece = board[nextPosition];

      if (attackedPiece == null)
        moves.push({
          from: algebraic(position),
          to: algebraic(nextPosition),
          flags: MOVE_FLAGS.NORMAL,
        });
      else if (attackedPiece.color != piece.color)
        moves.push({
          from: algebraic(position),
          to: algebraic(nextPosition),
          flags: MOVE_FLAGS.CAPTURE,
        });
    });

    return moves;
  };

  const generateMultiple = () => {
    const moves: InternalMove[] = [];

    PIECE_MOVE_INFO[type].moves.forEach(({ offset, excludedFiles }) => {
      if (excludedFiles.includes(file(position))) return;

      let nextPosition = position + offset;

      while (nextPosition >= 0 && nextPosition < 64) {
        const attackedPiece = board[nextPosition];

        if (attackedPiece == null) {
          moves.push({
            from: algebraic(position),
            to: algebraic(nextPosition),
            flags: MOVE_FLAGS.NORMAL,
          });

          if (excludedFiles.includes(file(nextPosition))) break;
          nextPosition += offset;
          continue;
        }

        if (attackedPiece.color != piece.color)
          moves.push({
            from: algebraic(position),
            to: algebraic(nextPosition),
            flags: MOVE_FLAGS.CAPTURE,
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

export function squareColor(square: Square | number): Color {
  square = squareIndex(square);

  if (square == -1) throw new Error("invalid square");

  const r = rank(square);
  const f = file(square);

  return (r + f) % 2 == 0 ? COLOR.WHITE : COLOR.BLACK;
}

export default class Chess {
  private _board;
  private _turn;
  private _castling;
  private _enPassant;
  private _halfMoves;
  private _fullMoves;
  private _kings;

  private _moves: InternalMove[] = [];
  private _attacks: number[] = [];
  private _history: Readonly<{ fen: string; san: string }>[] = [];
  private _enableProcessMoves = true;
  private _boardPositionCounter = new Map<string, number>();

  private constructor(
    board: Board,
    turn: Color,
    castling: Record<Color, number>,
    enPassant: Square,
    halfMoves: number,
    fullMoves: number,
    kings: Record<Color, number>,
    enableProcessMoves: boolean
  ) {
    this._board = board;
    this._turn = turn;
    this._castling = castling;
    this._enPassant = enPassant;
    this._halfMoves = halfMoves;
    this._fullMoves = fullMoves;
    this._kings = kings;
    this._enableProcessMoves = enableProcessMoves;
    this._processBoardState();
  }

  private _computeMoves() {
    this._attacks = new Array(64).fill(0);
    this._moves = [];

    for (let i = 0; i < this._board.length; i++) {
      const { piece, moves } = this._getMovesForSquare(i);

      if (piece == null) continue;
      if (this._turn == piece.color) this._moves = this._moves.concat(moves);

      moves.forEach(
        ({ to }) => (this._attacks[squareIndex(to)] |= COLOR_MASKS[piece.color])
      );
    }

    if (this._enableProcessMoves) this._processMoves();

    const canCastleThrough = (square: number, attackedBy: Color) => {
      return (
        this._board[square] == null &&
        !this.isSquareAttacked(square, attackedBy)
      );
    };

    for (const color of Object.values(COLOR)) {
      if (color != this._turn) continue;

      const otherColor = swapColor(color);

      const castling = this._castling[color];
      const kingPosition = this._kings[color];
      const queensKnightPosition = kingPosition - 3;
      const queensBishopPosition = kingPosition - 2;
      const queenPosition = kingPosition - 1;
      const kingsBishopPosition = kingPosition + 1;
      const kingsKnightPosition = kingPosition + 2;

      if (
        castling & MOVE_FLAGS.K_CASTLE &&
        canCastleThrough(kingsBishopPosition, otherColor) &&
        canCastleThrough(kingsKnightPosition, otherColor)
      )
        this._moves.push({
          from: algebraic(kingPosition),
          to: algebraic(kingsKnightPosition),
          flags: MOVE_FLAGS.K_CASTLE,
        });

      if (
        castling & MOVE_FLAGS.Q_CASTLE &&
        canCastleThrough(queenPosition, otherColor) &&
        canCastleThrough(queensBishopPosition, otherColor) &&
        canCastleThrough(queensKnightPosition, otherColor)
      )
        this._moves.push({
          from: algebraic(kingPosition),
          to: algebraic(queensBishopPosition),
          flags: MOVE_FLAGS.Q_CASTLE,
        });
    }
  }

  private _getPositionCounter() {
    const trimFEN = this.getFEN(true);
    return this._boardPositionCounter.get(trimFEN) ?? 0;
  }

  private _modifyPositionCounter(decrement: boolean) {
    const trimFEN = this.getFEN(true);
    const counter = this._boardPositionCounter.get(trimFEN) ?? 0;
    this._boardPositionCounter.set(trimFEN, counter + (decrement ? -1 : 1));
  }

  private _processBoardState(undo = false) {
    this._computeMoves();

    if (!undo) this._modifyPositionCounter(false);
  }

  private static _load(fen: string, enableProcessMoves: boolean) {
    validateFEN(fen);

    const builder = new Chess.Builder();
    const fields = fen.split(" ");
    const position = fields[0];
    let square = 0;

    for (const char of position) {
      if (char == "/") continue;

      if (isDigit(char)) {
        square += parseInt(char);
        continue;
      }

      const piece = {
        color: char < "a" ? COLOR.WHITE : COLOR.BLACK,
        type: char.toLowerCase() as PieceType,
      };
      builder.addPiece(square++, piece);
    }

    builder.setTurn(fields[1] as Color);
    builder.setCastling(fields[2]);
    builder.setEnPassant(fields[3] as Square);
    builder.setHalfMoves(fields[4]);
    builder.setFullMoves(fields[5]);

    if (enableProcessMoves == false) builder.disableComputeMoves();

    return builder.build();
  }

  static load(fen = DEFAULT_POSITION) {
    return this._load(fen, true);
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

  getFEN(trim = false) {
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

    const arr: any[] = [
      position.substring(1), // remove first '/'
      this._turn,
      castling,
      this._enPassant,
    ];

    if (!trim) arr.push(this._halfMoves, this._fullMoves);

    return arr.join(" ");
  }

  getPiece(square: Square | number) {
    square = squareIndex(square);
    return square < 0 || square > 63 ? null : this._board[square];
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

  getMoves(): InternalMove[] {
    return this._moves;
  }

  private _getMovesForSquare(square: number) {
    const piece = this.getPiece(square);
    const moves =
      piece == null
        ? []
        : generatePieceMoves(square, piece, this._board, this._enPassant);
    return { piece, moves };
  }

  private _processMoves() {
    const currentFEN = this.getFEN();
    this._moves = this._moves.filter((move) => {
      const chess = Chess._load(currentFEN, false);
      chess._makeMove(move);
      return !chess._isKingAttacked(this._turn);
    }, this);
  }

  getMovesForSquare(square: Square): InternalMove[] {
    return this._moves.filter(({ from }) => from == square);
  }

  private _makeMove(move: InternalMove) {
    const myColor = this._turn;
    const theirColor = swapColor(this._turn);

    this._history.push({
      fen: this.getFEN(),
      san: this._generateSan(move),
    });

    this._board[squareIndex(move.to)] =
      move.flags & MOVE_FLAGS.PROMOTION
        ? {
          type: move.promotion as PieceType,
          color: myColor,
        }
        : this._board[squareIndex(move.from)];
    this._board[squareIndex(move.from)] = null;
    let keepEpSquare = false;

    switch (move.flags) {
      case MOVE_FLAGS.PAWN_JUMP:
        this._enPassant = algebraic(
          squareIndex(move.to) - PAWN_MOVE_INFO[myColor].offset
        );
        keepEpSquare = true;
        break;

      case MOVE_FLAGS.EN_PASSANT:
        this._board[
          squareIndex(this._enPassant) + PAWN_MOVE_INFO[theirColor].offset
        ] = null;
        break;

      case MOVE_FLAGS.K_CASTLE:
        const kingsKnight = squareIndex(move.to);
        const kingsRook = kingsKnight + 1;
        const kingsBishop = kingsKnight - 1;
        this._board[kingsBishop] = this._board[kingsRook];
        this._board[kingsRook] = null;
        break;

      case MOVE_FLAGS.Q_CASTLE:
        const queensBishop = squareIndex(move.to);
        const queen = queensBishop + 1;
        const queensRook = queensBishop - 2;
        this._board[queen] = this._board[queensRook];
        this._board[queensRook] = null;
        break;

      default:
        break;
    }
    if (!keepEpSquare) this._enPassant = EMPTY_SQUARE;

    const piece = this.getPiece(move.to)?.type as PieceType;

    if (piece == PIECE.KING) this._kings[myColor] = squareIndex(move.to);

    if (
      piece == PIECE.PAWN ||
      move.flags & (MOVE_FLAGS.CAPTURE | MOVE_FLAGS.EN_PASSANT)
    )
      this._halfMoves = 0;
    else this._halfMoves++;

    if (myColor == COLOR.BLACK) this._fullMoves++;

    this._turn = theirColor;
    this._updateCastling();
    this._processBoardState();
  }

  // TODO: implement
  private _generateSan(move: InternalMove) {
    return `${move.from} ${move.to}`;
  }

  makeMove(move: Move) {
    let moveObj = null;

    for (const computedMove of this._moves) {
      const found =
        move.to == computedMove.to &&
        move.from == computedMove.from &&
        move.promotion == computedMove.promotion;

      if (found) {
        moveObj = computedMove;
        break;
      }
    }

    if (moveObj == null) throw new Error("Move not found");

    this._makeMove(moveObj);
  }

  private _updateCastling() {
    const uptate = (color: Color) => {
      const castling = this._castling[color];

      if (castling == 0) return;

      const king = this.getPiece(color == COLOR.WHITE ? "e1" : "e8");

      if (king?.type != PIECE.KING && king?.color != color) {
        this._castling[color] = 0;
        return;
      }

      if (castling & MOVE_FLAGS.K_CASTLE) {
        const rook = this.getPiece(color == COLOR.WHITE ? "h1" : "h8");

        if (rook?.type != PIECE.ROOK && rook?.color != color)
          this._castling[color] ^= MOVE_FLAGS.K_CASTLE;
      }

      if (castling & MOVE_FLAGS.Q_CASTLE) {
        const rook = this.getPiece(color == COLOR.WHITE ? "a1" : "a8");

        if (rook?.type != PIECE.ROOK && rook?.color != color)
          this._castling[color] ^= MOVE_FLAGS.Q_CASTLE;
      }
    };

    uptate(COLOR.WHITE);
    uptate(COLOR.BLACK);
  }

  isSquareAttacked(square: Square | number, attackedBy: Color) {
    square = squareIndex(square);
    return square < 0 || square > 63
      ? false
      : (this._attacks[square] & COLOR_MASKS[attackedBy]) != 0;
  }

  private _isKingAttacked(color: Color) {
    const square = this._kings[color];
    return this.isSquareAttacked(square, swapColor(color));
  }

  isCheck() {
    return this._isKingAttacked(this._turn);
  }

  isCheckMate() {
    return this.isCheck() && this._moves.length === 0;
  }

  isStalemate() {
    return !this.isCheck() && this._moves.length === 0;
  }

  isInsufficientMaterial() {
    const remainingPieces: Record<PieceType, Record<Color, number>> = {
      p: { w: 0, b: 0 },
      n: { w: 0, b: 0 },
      b: { w: 0, b: 0 },
      r: { w: 0, b: 0 },
      q: { w: 0, b: 0 },
      k: { w: 0, b: 0 },
    };

    this._board.forEach((piece) => {
      if (piece == null) return;
      remainingPieces[piece.type][piece.color]++;
    });

    if (
      remainingPieces[PIECE.PAWN][COLOR.WHITE] > 0 ||
      remainingPieces[PIECE.PAWN][COLOR.BLACK] > 0 ||
      remainingPieces[PIECE.QUEEN][COLOR.WHITE] > 0 ||
      remainingPieces[PIECE.QUEEN][COLOR.BLACK] > 0 ||
      remainingPieces[PIECE.ROOK][COLOR.WHITE] > 0 ||
      remainingPieces[PIECE.ROOK][COLOR.BLACK] > 0 ||
      remainingPieces[PIECE.BISHOP][COLOR.WHITE] == 2 ||
      remainingPieces[PIECE.BISHOP][COLOR.BLACK] == 2 ||
      remainingPieces[PIECE.BISHOP][COLOR.WHITE] +
      remainingPieces[PIECE.BISHOP][COLOR.BLACK] +
      remainingPieces[PIECE.KNIGHT][COLOR.WHITE] +
      remainingPieces[PIECE.KNIGHT][COLOR.BLACK] >=
      3
    )
      return false;

    return true;
  }

  isThreefoldRepetition() {
    return this._getPositionCounter() >= 3;
  }

  isDraw() {
    return (
      this._halfMoves >= 100 || // 50 moves per side = 100 half moves
      this.isStalemate() ||
      this.isInsufficientMaterial() ||
      this.isThreefoldRepetition()
    );
  }

  isGameOver() {
    return this.isCheckMate() || this.isDraw();
  }

  undo() {
    this._modifyPositionCounter(true);
    const lastHistory = this._history.pop();
    if (lastHistory == undefined) return;

    const chess = Chess._load(lastHistory.fen, this._enableProcessMoves);
    this._board = chess._board;
    this._turn = chess._turn;
    this._castling = chess._castling;
    this._enPassant = chess._enPassant;
    this._halfMoves = chess._halfMoves;
    this._fullMoves = chess._fullMoves;
    this._kings = chess._kings;
    this._processBoardState(true);
  }

  getTurn() {
    return this._turn;
  }

  getHistory() {
    return this._history;
  }

  static Builder = class {
    private _board: Board = new Array(64).fill(null);
    private _turn: Color = COLOR.WHITE;
    private _castling: Record<Color, number> = { w: 0, b: 0 };
    private _enPassant: Square = EMPTY_SQUARE;
    private _halfMoves: number = 0;
    private _fullMoves: number = 1;
    private _kings: Record<Color, number> = { w: 0, b: 0 };
    private _enableProcessMoves = true;

    addPiece(square: Square | number, piece: Piece) {
      if (typeof square != "number") square = squareIndex(square);
      if (square < 0 || square > 63) return;
      this._board[square] = piece;
      if (piece.type == PIECE.KING) this._kings[piece.color] = square;
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
      if (EN_PASSANT_ATTACK_SQUARES[this._turn].includes(enPassant))
        this._enPassant = enPassant;
    }

    setHalfMoves(halfMoves: string) {
      this._halfMoves = parseInt(halfMoves);
    }

    setFullMoves(fullMoves: string) {
      this._fullMoves = parseInt(fullMoves);
    }

    disableComputeMoves() {
      this._enableProcessMoves = false;
    }

    build() {
      return new Chess(
        this._board,
        this._turn,
        this._castling,
        this._enPassant,
        this._halfMoves,
        this._fullMoves,
        this._kings,
        this._enableProcessMoves
      );
    }
  };
}

// FIX: tests
// TODO: add missing tests for features
