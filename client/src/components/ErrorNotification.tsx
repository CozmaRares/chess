import { useEffect, useRef, useState } from "react";
import Show from "../utils/Show";
import { CircleExclamation } from "./icons";

const ErrorNorification: React.FC<{
  error?: string;
  removeError?: () => void;
}> = ({ error, removeError }) => {
  const [err, setErr] = useState(error);
  const divRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const id = setTimeout(() => {
      if (err == undefined || divRef.current == null) return;

      divRef.current.classList.add(
        "opacity-0",
        "transition-opacity",
        "duration-300"
      );

      setTimeout(() => {
        if (removeError) removeError();
        setErr(undefined);
      }, 300);
    }, 2 * 1000);

    return () => clearTimeout(id);
  }, []);

  return (
    <Show when={err != undefined}>
      <div
        ref={divRef}
        className="absolute top-0 right-0 flex justify-center items-center gap-1 w-fit mt-2 mr-4 border border-black p-2 rounded-md text-lg"
      >
        <span className="text-red-700">
          <CircleExclamation />
        </span>
        {err}
      </div>
    </Show>
  );
};

export default ErrorNorification;
