import { test, expect } from "vitest";
import Chess from "../chess/engine";

const chess = Chess.load();

test("e4 attacked", () => {
  expect(chess.isSquareAttacked("e4", "w")).toBe(true);
  expect(chess.isSquareAttacked("e4", "b")).toBe(false);
});

test("e5 attacked", () => {
  expect(chess.isSquareAttacked("e5", "w")).toBe(false);
  expect(chess.isSquareAttacked("e5", "b")).toBe(true);
});

