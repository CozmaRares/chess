import { describe, expect, test } from "vitest";
import Chess from "../chess/engine";

describe("insufficient material", () => {
  test("2 kings", () => {
    expect(
      Chess.load("8/k7/8/6K1/8/8/8/8 w - - 0 1").isInsufficientMaterial()
    ).toBe(true);
  });

  test("king and bishop", () => {
    expect(
      Chess.load("5b2/k7/8/6K1/8/2B5/8/8 w - - 0 1").isInsufficientMaterial()
    ).toBe(true);
  });

  test("king and knight", () => {
    expect(
      Chess.load("8/k7/8/3n2K1/8/5N2/8/8 w - - 0 1").isInsufficientMaterial()
    ).toBe(true);
  });

  test("king and knight vs king and bishop", () => {
    expect(
      Chess.load("8/k3n3/8/6K1/8/2B5/8/8 w - - 0 1").isInsufficientMaterial()
    ).toBe(true);
  });

  test("king and 2 knights", () => {
    expect(
      Chess.load("8/k7/4N3/6K1/8/5N2/8/8 w - - 0 1").isInsufficientMaterial()
    ).toBe(true);
  });
});

describe("sufficient material", () => {
  test("starting position", () => {
    expect(Chess.load().isInsufficientMaterial()).toBe(false);
  });

  test("king and 2 bishops vs king", () => {
    expect(
      Chess.load("8/k7/8/4B1K1/4B3/8/8/8 w - - 0 1").isInsufficientMaterial()
    ).toBe(false);
  });

  test("king and 2 knights vs king and bishop", () => {
    expect(
      Chess.load("8/k7/3n4/6K1/2n1B3/8/8/8 w - - 0 1").isInsufficientMaterial()
    ).toBe(false);
  });

  test("king and 2 knights vs king and knight", () => {
    expect(
      Chess.load("6N1/k7/3n4/6K1/2n5/8/8/8 w - - 0 1").isInsufficientMaterial()
    ).toBe(false);
  });

  test("king and rook vs king", () => {
    expect(
      Chess.load("5r2/k7/8/6K1/8/8/8/8 w - - 0 1").isInsufficientMaterial()
    ).toBe(false);
  });

  test("king and queen vs king", () => {
    expect(
      Chess.load("5Q2/k7/8/6K1/8/8/8/8 w - - 0 1").isInsufficientMaterial()
    ).toBe(false);
  });

  test("only pawns remaining", () => {
    expect(
      Chess.load(
        "1k6/3p4/1p6/6K1/5P2/4P3/8/8 w - - 0 1"
      ).isInsufficientMaterial()
    ).toBe(false);
  });
});
