import { useState, useCallback } from "react";

type State = {
  error: Error | null;
  text: string | null;
};

export default function useCopyToClipboard(): [
  State,
  (value: any) => Promise<void>,
] {
  const [state, setState] = useState<State>({
    error: null,
    text: null,
  });

  const copyToClipboard = useCallback(async (value: string) => {
    if (!navigator?.clipboard) {
      return setState({
        error: new Error("Clipboard not supported"),
        text: null,
      });
    }

    const handleSuccess = () => {
      setState({
        error: null,
        text: value,
      });
    };

    const handleFailure = (e: any) => {
      setState({
        error: e,
        text: null,
      });
    };

    navigator.clipboard.writeText(value).then(handleSuccess, handleFailure);
  }, []);

  return [state, copyToClipboard];
}
