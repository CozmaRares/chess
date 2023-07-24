import { useLayoutEffect, useState } from "react";

// taken form https://github.com/uidotdev/usehooks
export default function useWindowSize() {
  const [size, setSize] = useState({
    width: -1,
    height: -1,
  });

  useLayoutEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return size;
}
