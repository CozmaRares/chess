import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Color, COLOR } from "../../../server/src/engine";
import Show from "../utils/Show";
import ErrorNorification from "../utils/ErrorNotification";

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [id, setID] = useState<string>("");
  const [join, setJoin] = useState(false);
  const [color, setColor] = useState<Color>(COLOR.WHITE);

  const [err, setErr] = useState<Error>();
  const { error } =
    location.state != null ? location.state : { error: undefined };

  const createGame = () => {
    fetch("/api/create-game")
      .then((res) => {
        if (res.ok) return res.text();
        throw res;
      })
      .then((id) => {
        setID(id);
      })
      .catch((err) => {
        console.error(err);
        setErr(err);
      });
  };

  const joinGame = () => {
    fetch(`/api/other-color/${id}`)
      .then((res) => {
        if (res.ok) return res.text();
        throw res;
      })
      .then((text) => {
        if (text == "invalid id") throw new Error("Invalid game ID");
        if (text == "full") throw new Error("Game already has 2 players");

        navigate("/game", { state: { id, color: text } });
      })
      .catch((err) => {
        console.error(err);
        setErr(err);
        setID("");
        setJoin(false);
      });
  };

  const removeLocationState = () =>
    window.history.replaceState({ state: null }, document.title);

  const errObj = err?.message
    ? {
        error: err.message,
        removeError: () => setErr(undefined),
      }
    : {
        error,
        removeError: removeLocationState,
      };

  return (
    <>
      <ErrorNorification key={errObj.error} {...errObj} />
      <div className="text-xl">
        <div className="absolute top-0 left-0 right-0 bottom-0 m-auto p-6 bg-gray-800 text-white w-fit h-fit rounded-[25px]">
          <button
            className="block cursor-pointer border-2 rounded-md p-2 w-full hover:bg-white hover:text-gray-800 transition-colors mb-3"
            onClick={createGame}
          >
            Create Game
          </button>
          <button
            className="block cursor-pointer border-2 rounded-md p-2 w-full hover:bg-white hover:text-gray-800 transition-colors"
            onClick={() => setJoin(true)}
          >
            Join Game
          </button>
        </div>
        <Show when={join == false && id != ""}>
          <div className="absolute top-0 left-0 right-0 bottom-0 w-full h-full flex justify-center items-center bg-zinc-800 bg-opacity-70">
            <div className="bg-gray-900 text-white p-4 rounded-lg">
              <p>Select color:</p>
              <div className="grid grid-cols-[auto,minmax(0,1fr)] text-center ">
                <input
                  type="radio"
                  name="color"
                  id="white"
                  checked={color == COLOR.WHITE}
                  onChange={() => setColor(COLOR.WHITE)}
                />
                <label htmlFor="white">White</label>
                <input
                  type="radio"
                  name="color"
                  id="black"
                  checked={color == COLOR.BLACK}
                  onChange={() => setColor(COLOR.BLACK)}
                />
                <label htmlFor="black">Black</label>
              </div>
              <button
                className="block cursor-pointer border-2 rounded-md p-2 w-full hover:bg-white hover:text-gray-800 transition-colors mt-3"
                onClick={() => navigate("/game", { state: { id, color } })}
              >
                Start Game
              </button>
            </div>
          </div>
        </Show>
        <Show when={join}>
          <div className="absolute top-0 left-0 right-0 bottom-0 w-full h-full flex justify-center items-center bg-zinc-800 bg-opacity-70">
            <div className="bg-gray-900 text-white p-4 rounded-lg">
              <label htmlFor="game-id">Insert game ID: </label>
              <input
                className="block bg-zinc-700 p-1 mt-2"
                type="text"
                name="game-id"
                id="game-id"
                value={id}
                onChange={(e) => setID(e.target.value)}
              />
              <button
                className="block cursor-pointer border-2 rounded-md p-2 w-full hover:bg-white hover:text-gray-800 transition-colors mt-3"
                onClick={joinGame}
              >
                Join
              </button>
              <button
                className="block cursor-pointer border-2 rounded-md p-2 w-full hover:bg-white hover:text-gray-800 transition-colors mt-3"
                onClick={() => setJoin(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </Show>
      </div>
    </>
  );
};

export default Home;
