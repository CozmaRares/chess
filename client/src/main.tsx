import ReactDOM from "react-dom/client";
import "./index.css";
import {
  createBrowserRouter,
  RouterProvider,
  useNavigate,
} from "react-router-dom";
import Home from "./routes/Home";
import OnlineGame from "./routes/OnlineGame";
import LocalGame from "./routes/LocalGame";
import { useEffect } from "react";

const ErrorElement = () => {
  const naviagte = useNavigate();

  useEffect(() => naviagte("/"), []);

  return <h1 className="text-2xl bold loading">Redirecting to home page</h1>;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/game/online",
    element: <OnlineGame />,
  },
  {
    path: "/game/local",
    element: <LocalGame />,
  },
  {
    path: "*",
    element: <ErrorElement />,
  },
]);

// React's StricMode doesn't play well with how I implemented the socket connection
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <>
    <div className="w-full h-[100dvh] bg-zinc-200">
      <div className="z-0">
        <RouterProvider router={router} />
      </div>
    </div>
  </>
);
