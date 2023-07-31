import ReactDOM from "react-dom/client";
import "./index.css";
import {
  createBrowserRouter,
  RouterProvider,
  useNavigate,
} from "react-router-dom";
import Home from "./routes/Home";
import Game from "./routes/Game";
import { useEffect } from "react";

const ErrorElement = () => {
  const naviagte = useNavigate();

  useEffect(() => naviagte("/"), []);

  return <></>;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/game",
    element: <Game />,
  },
  {
    path: "*",
    element: <ErrorElement />,
  },
]);

// TODO: better UI
// React's StricMode doesn't play well with how I implemented the socket connection
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <div className="absolute top-0 left-0 right-0 bottom-0 w-full h-full bg-zinc-200 -z-10">
    <RouterProvider router={router} />
  </div>
);
