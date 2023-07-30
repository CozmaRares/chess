import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Color, COLOR } from "../../../server/src/engine";
import Show from "../utils/Show";
import { CircleExclamation } from "../utils/icons";

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

        if (text == COLOR.BLACK)
          navigate("/game", { state: { id, color: text } });
      })
      .catch((err) => {
        console.error(err);
        setErr(err);
        setID("");
        setJoin(false);
      });
  };

  return (
    <>
      <Err key={err?.message} error={err?.message} />
      <Err key={error} error={error} />
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
                  checked
                  onChange={() => setColor(COLOR.WHITE)}
                />
                <label htmlFor="white">White</label>
                <input
                  type="radio"
                  name="color"
                  id="black"
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
            </div>
          </div>
        </Show>
      </div>
    </>
  );
};

const Err: React.FC<{
  error?: string;
}> = ({ error }) => {
  const [err, setErr] = useState(error);
  const divRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const id = setTimeout(() => {
      let duration = 1;
      if (divRef.current != null) {
        divRef.current.classList.add(
          "opacity-0",
          "transition-opacity",
          "duration-300"
        );
        duration = 300;
      }

      setTimeout(() => {
        setErr(undefined);
        console.log("Removed error");
      }, duration);
    }, 2 * 1000);

    return () => clearTimeout(id);
  }, []);

  return (
    <Show when={err != undefined}>
      <div
        ref={divRef}
        className="flex justify-center items-center gap-1 w-fit mt-2 mr-4 ml-auto border border-black p-2 rounded-md text-lg"
      >
        <span className="text-red-700">
          <CircleExclamation />
        </span>
        {err}
      </div>
    </Show>
  );
};

export default Home;
