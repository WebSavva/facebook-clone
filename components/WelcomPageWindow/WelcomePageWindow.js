import FacebookIcon from "../FacebookIcon/FacebookIcon";

export default function WelcomePageWindow(props) {
  return (
    <div className="animate-fade-in fixed bg-gray-100 px-2 h-full w-full flex flex-col items-center justify-center gap-5">
      <FacebookIcon width={200} height={200} />
      <h1 className="text-center text-md sm:text-lg  sm:text-xl md:text-2xl font-bold text-gray-700">
        {props.message}
      </h1>
      <button
        className=" rounded-md px-5 sm:px-10 py-2 bg-blue-600 text-white font-semibold text-md sm:text-lg md:hover:opacity-80"
        onClick={props.clickHandler}
      >
        Sign {props.nextAction}
      </button>
    </div>
  );
}
