import express, { Application, Request, Response } from "express";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 5000;

const app: Application = express();

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

app.listen(PORT, () =>
  console.log("Server listening on http://localhost:" + PORT)
);
