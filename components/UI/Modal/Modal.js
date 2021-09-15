import ReactDOM from "react-dom";

function Overlay({ closeModal }) {
  return (
    <div
      onClick={closeModal}
      className="h-full w-full bg-gray-800 opacity-80 absolute z-10"
    ></div>
  );
}

function ModalWindow(props) {
  return (
    <div className="absolute w-full sm:w-auto top-1/2 rounded-sm left-1/2 transform -translate-y-1/2 bg-white  z-20 -translate-x-1/2 flex flex-col gap-2">
      <header className="bg-blue-600 p-3 text-white text-semibold text-lg">
        Error
      </header>
      <div className="px-10 py-3 text-md">{props.children}</div>
      <div className="flex justify-end p-3 border-t border-gray-300">
        <button
          onClick={props.closeModal}
          className="bg-blue-500 rounded-md text-white font-semibold text-sm px-4 py-2"
        >
          Ok
        </button>
      </div>
    </div>
  );
}

export default function Modal(props) {
  return (
    <div className="fixed top-0 left-0 z-[150] w-full h-full">
      <Overlay closeModal={props.closeModal} />
      <ModalWindow closeModal={props.closeModal}>{props.message}</ModalWindow>
    </div>
  );
}
