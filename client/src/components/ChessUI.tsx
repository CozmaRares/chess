import InferProps from "../utils/InferProps";
import ChessBoard from "./Chessboard";
import History from "./History";

// TODO: fix border
const ChessUI: React.FC<InferProps<[typeof ChessBoard, typeof History]>> = (
    props
) => (
    <div className="max-h-[80vmin] m-4 flex flex-row gap-4 justify-center">
        <ChessBoard {...props} />
        <History {...props} />
    </div>
);

export default ChessUI;
