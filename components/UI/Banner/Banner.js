import { EmojiSadIcon } from "@heroicons/react/outline";

function Banner({ text }) {
  return (
    <div className="w-full flex flex-col items-center">
      <EmojiSadIcon className="text-red-300 w-20 h-20" />
      <h3 className="text-center text-gray-400 text-md capitalize">{text}</h3>
    </div>
  );
}

export default Banner;

export function ErrorPage() {
  return (
    <div className="w-full h-full flex items-center justify-center min-w-screen min-h-full">
      <Banner text="Sorry, something went wrong" />
    </div>
  );
}
