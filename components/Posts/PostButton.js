export default function PostButton({ Icon }) {
  return (
    <button className="p-2 flex flex-grow text-gray-400 items-center justify-center transition-all rounded-md md:hover:text-gray-700 md:hover:bg-gray-200">
      <Icon className="h-4 w-4 md:h-5 md:w-5" />
    </button>
  );
}
