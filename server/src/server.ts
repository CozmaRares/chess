import express, { Request, Response } from "express";
import path from "path";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import { randomUUID } from "crypto";
import Chess, { COLOR, Color, Move } from "./engine";

dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();
const server = http.createServer(app);
const io = new Server(
  server,
  process.env.NODE_ENV === "development"
    ? {
        cors: {
          origin: "http://localhost:3000",
        },
      }
    : {}
);

type Room = {
  [color in Color]: string | null;
} & {
  game: Chess;
};

const rooms: Map<string, Room> = new Map();

io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);
  });

  socket.on("join game", (id: string, color: Color) => {
    const room = rooms.get(id);

    console.log({
      isRoom: room != undefined,
      w: room?.w,
      b: room?.b,
      sock: socket.id,
      color,
      cond:
        room == undefined || (room[color] != null && room[color] != socket.id),
    });

    if (
      room == undefined ||
      (room[color] != null && room[color] != socket.id)
    ) {
      socket.emit("join error");
      return;
    }

    socket.join(id);

    room[color] = socket.id;

    if (room[COLOR.WHITE] != null && room[COLOR.BLACK] != null)
      io.to(id).emit("start game");
  });

  socket.on("make move", (id: string, move: Move) => {
    const room = rooms.get(id);

    if (room == undefined) return socket.emit("move error", "Invalid game ID");

    const chess = room.game;

    if (socket.id != room[chess.getTurn()])
      return socket.emit("move error", "Not your turn!");

    try {
      chess.makeMove(move);
      io.to(id).emit("receive move", move);
    } catch (e) {
      socket.emit("move error", (e as Error).message);
    }
  });
});

if (process.env.NODE_ENV === "development")
  app.get("/games", (_req, res) => {
    const m = new Map();
    rooms.forEach((room, id) =>
      m.set(id, {
        w: room.w,
        b: room.b,
        game: room.game.getFEN(),
      })
    );
    return res.json(Object.fromEntries(m));
  });

app.get("/api/create-game", (_req, res) => {
  let id = randomUUID();

  while (rooms.has(id)) id = randomUUID();

  rooms.set(id, {
    b: null,
    w: null,
    game: Chess.load(),
  });

  res.send(id);
  console.log("Created room:", id);
});

app.get("/api/other-color/:id", (req, res) => {
  const id = req.params.id;

  const room = rooms.get(id);

  if (room == undefined) res.send("invalid id");
  else if (room[COLOR.WHITE] == null) res.send(COLOR.WHITE);
  else if (room[COLOR.BLACK] == null) res.send(COLOR.BLACK);
  else res.send("full");
});

if (process.env.NODE_ENV === "production") {
  const __dirname = path.resolve();
  app.use(express.static(path.join(__dirname, "client", "dist")));

  app.get("*", (_req, res) =>
    res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"))
  );
} else app.get("/", (_req, res) => res.send("Hello, world!"));

app.use((req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
});

app.use((err: Error, _req: Request, res: Response) => {
  let status = res.statusCode == 200 ? 500 : res.statusCode;
  let message = err.message;

  res.status(status).json({
    message,
    stack: process.env.NODE_ENV !== "production" ? err.stack : null,
  });
});

server.listen(PORT, () =>
  console.log("Server listening on http://localhost:" + PORT)
);
