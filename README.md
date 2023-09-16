# Chess Game

> [Working Demo](https://chess.raru.dev)

## Project Description

A minimalistic server for a chess game accompanied by a corresponding website.

Features:

- Game Initiation: Effortlessly initiate a new game and conveniently share the
  generated ID.
- Game Participation: Smoothly join a game by connecting to the one
  corresponding with its unique ID.
- Local Gameplay: Experiment with strategies and engage in a friendly match
  directly from a single device.

## Getting Started

### Prerequisites

- nodejs

  Debian/Ubuntu:

  ```sh
  sudo apt install nodejs
  ```

- npm

  Debian/Ubuntu:

  ```sh
  sudo apt install npm
  ```

### Installation

1. Clone the repo

   ```sh
   git clone https://github.com/CozmaRares/chess.git
   cd chess
   ```

2. Install the dependencies

   ```sh
   npm install
   cd client
   npm install
   cd ..
   ```

3. Start the development server

   ```sh
   npm run dev
   ```

4. Run test suite for the chess engine

   ```sh
   npm run test
   ```

5. Build for production

   ```sh
   npm run build
   ```

## Deployment

The application is hosted on AWS, with Route 53 directing traffic to an EC2
instance. Within the EC2 instance, an nginx server is configured to route
incoming HTTPS traffic from port 443 to the specific port where the application
server is listening, ensuring secure communication.

## Reflection

The goal of the project was to build a fully functional chess server and to
familiarize myself with the technologies used during the development process.

Originally I set out to include more gamemodes, such as 4 player chess or use a
10x10 board instead of the standard 8x8. The limiting factor proved to be my
naive implementation of the chess engine that does not support more than two
players and a bigger than 8x8 board, not without major refactoring.

The most challenging part was the design of the chess engine itself, mostly
generating the moves and synchronizing the associated [FEN](https://www.chess.com/terms/fen-chess)
string with the posision of the pieces on the board.

During the project, I encountered some unforeseen obstacles, including:

- CSS struggled to manage overflowing height of the gameplay history, and had to
  hack my way through with a little JavaScript.
- Browsers need to connect securely to the game server. Initially, I assumed `ACM`
  certificate generation and `Route 53` configuration were sufficient. However, I
  explored a more complex route involving a `load balancer` before ultimately relying
  on `nginx`.

The project's development relies on a range of technologies. `AWS` provides a
dependable infrastructure. `TypeScript` ensures a more error-resistant
development process. `React` facilitates the creation of dynamic user
interfaces, with `React Router` simplifying application routing, while
`TailwindCSS` enables swift UI styling. `Vite` minimizes the initial frontend
setup. On the backend, `Express` offers a robust HTTP framework, while
`Socket.IO` manages web socket connections. Additionally, `Vitest` serves as a
rapid testing tool that supports TypeScript out of the box.

Lastly, I want to point out the features that need to be improved if I ever
decide to develop a second version of this project:

- a more efficient [move generation engine](https://www.chessprogramming.org/Move_Generation)
- a more generalized engine that supports additional game modes
- a richer user interface
