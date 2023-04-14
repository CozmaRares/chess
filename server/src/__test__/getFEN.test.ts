import { describe, expect, test } from "vitest";
import Chess, { DEFAULT_POSITION } from "../chess/engine";

test("starting position", () => {
  expect(Chess.load(DEFAULT_POSITION).getFEN()).toBe(DEFAULT_POSITION);
});

test("1. e4", () => {
  const fen = "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1";
  expect(Chess.load(fen).getFEN()).toBe(fen);
});

test("1. e4 2. e5", () => {
  const fen = "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq e6 0 2";
  expect(Chess.load(fen).getFEN()).toBe(fen);
});

test("1. e4 2. e5 3. ke2", () => {
  const fen = "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPPKPPP/RNBQ1BNR b kq - 1 2";
  expect(Chess.load(fen).getFEN()).toBe(fen);
});

test("random position 1", () => {
  const fen = "r1b1r1k1/pp4pp/3Bpp2/8/2q5/P5Q1/3R1PPP/R5K1 b - - 0 19";
  expect(Chess.load(fen).getFEN()).toBe(fen);
});

test("random position 2", () => {
  const fen = "1k6/1pp5/p7/5B1p/PP6/6K1/4p2r/4R3 b - - 3 43";
  expect(Chess.load(fen).getFEN()).toBe(fen);
});

test("random position 3", () => {
  const fen = "8/8/2k2Q2/8/5P2/8/1p6/6K1 b - - 1 48";
  expect(Chess.load(fen).getFEN()).toBe(fen);
});
