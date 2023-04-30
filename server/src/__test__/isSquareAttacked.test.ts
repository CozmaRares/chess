import { expect, test } from "vitest";
import Chess from "../chess/engine";

test("", () => {
  const chess = Chess.load();

  expect(chess.isSquareAttacked("e4", "w")).toBe(true);
  expect(chess.isSquareAttacked("e4", "b")).toBe(false);

  expect(chess.isSquareAttacked("e5", "w")).toBe(false);
  expect(chess.isSquareAttacked("e5", "b")).toBe(false);
});
