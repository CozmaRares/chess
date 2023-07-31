const Modal: React.FC<{
  children: React.ReactNode;
  enableOverlay?: boolean;
}> = ({ children, enableOverlay }) => {
  const modal = (
    <div className="bg-gray-900 text-white p-4 rounded-lg w-fit">
      {children}
    </div>
  );

  return enableOverlay ? (
    <div className="absolute top-0 left-0 right-0 bottom-0 w-full h-full flex justify-center items-center bg-zinc-800 bg-opacity-70">
      {modal}
    </div>
  ) : (
    modal
  );
};
export const ModalButton: React.FC<{
  children: React.ReactNode;
  onClick: () => void;
}> = ({ children, onClick }) => (
  <button
    className="block cursor-pointer border-2 rounded-md p-2 w-full hover:bg-white hover:text-gray-800 transition-colors [&:nth-child(n+2)]:mt-3"
    onClick={onClick}
  >
    {children}
  </button>
);

export default Modal;
