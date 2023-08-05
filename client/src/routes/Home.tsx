import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Color, COLOR } from "../../../server/src/engine";
import Show from "../utils/Show";
import ErrorNorification from "../components/ErrorNotification";
import Modal, { ModalButton } from "../components/Modal";

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [id, setID] = useState<string>("");
  const [color, setColor] = useState<Color>(COLOR.WHITE);
  const [join, setJoin] = useState(false);
  const [create, setCreate] = useState(false);

  const [err, setErr] = useState<Error>();
  const { error } =
    location.state != null ? location.state : { error: undefined };

  const createGame = () => {
    fetch("/api/create-game")
      .then((res) => {
        if (res.ok) return res.text();
        throw res;
      })
      .then((text) => {
        navigate("/game/online", { state: { id: text, color } });
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

        navigate("/game/online", { state: { id, color: text } });
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
        <div className="absolute top-0 left-0 right-0 bottom-0 m-auto w-fit h-fit">
          <Modal>
            <ModalButton onClick={() => setCreate(true)}>
              Create Game
            </ModalButton>
            <ModalButton onClick={() => setJoin(true)}>Join Game</ModalButton>
            <ModalButton onClick={() => navigate("/game/local")}>
              Local Game
            </ModalButton>
          </Modal>
        </div>
        <Show when={create}>
          <Modal enableOverlay>
            <div className="w-[20rem] max-w-full">
              <p>Select color:</p>
              <div className="flex flex-row justify-evenly">
                <div className="flex flex-row items-center gap-2">
                  <input
                    type="radio"
                    name="color"
                    id="white"
                    checked={color == COLOR.WHITE}
                    onChange={() => setColor(COLOR.WHITE)}
                  />
                  <label htmlFor="white">White</label>
                </div>
                <div className="flex flex-row items-center gap-2">
                  <input
                    type="radio"
                    name="color"
                    id="black"
                    checked={color == COLOR.BLACK}
                    onChange={() => setColor(COLOR.BLACK)}
                  />
                  <label htmlFor="black">Black</label>
                </div>
              </div>
              <ModalButton onClick={createGame}>Start Game</ModalButton>
              <ModalButton onClick={() => setCreate(false)}>Cancel</ModalButton>
            </div>
          </Modal>
        </Show>
        <Show when={join}>
          <Modal enableOverlay>
            <div className="w-[20rem] max-w-full">
              <label htmlFor="game-id">Insert game ID: </label>
              <input
                className="block bg-zinc-700 p-1 mt-2 w-full"
                type="text"
                name="game-id"
                id="game-id"
                value={id}
                onChange={(e) => setID(e.target.value)}
              />
              <ModalButton onClick={joinGame}>Join</ModalButton>
              <ModalButton onClick={() => setJoin(false)}>Cancel</ModalButton>
            </div>
          </Modal>
        </Show>
      </div>
    </>
  );
};

export default Home;
