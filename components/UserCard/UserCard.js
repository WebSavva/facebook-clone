import Image from "next/image";
import convertDate from "../../utilities/date-converter";
import { LinkIcon, ChartSquareBarIcon } from "@heroicons/react/outline";
import copyLink from "./../../utilities/copy";
import Lightbox from "./../UI/Lightbox/Lightbox";

export default function UserCard({
  userName,
  registrationDate,
  lastSeen,
  avatarUrl,
  userLink,
  isOnline,
}) {
  const convertedRegDate = convertDate(registrationDate);
  const onCopyHandler = () => copyLink(userLink);
  let statusContent;
  if (isOnline) {
    statusContent = (
      <p className="flex items-baseline gap-1">
        <span className="w-3 h-3 rounded-full bg-green-400 animate-pulse"></span>
        <span className="text-gray-400 font-semibold">Online</span>
      </p>
    );
  } else {
    const convertedLastSeen = convertDate(lastSeen);
    statusContent = (
      <span className=" text-gray-400">
        {convertedLastSeen.date}{" "}
        <span className="ml-2 text-gray-300">{convertedLastSeen.moment}</span>
      </span>
    );
  }

  return (
    <section className="bg-white shadow-sm rounded-md flex gap-5  p-5">
      <div className="w-[50px] h-[50px] sm:w-[110px] sm:h-[110px]  relative">
        <Lightbox>
          <Image
            alt={`${userName} Photo`}
            layout="fill"
            src={avatarUrl}
            className="rounded-md"
          />
        </Lightbox>
      </div>
      <div className="px-15 space-y-2">
        <h4 className="text-sm sm:text-lg font-bold text-gray-700">
          {userName}
        </h4>
        <p className="text-xs sm:text-sm font-semibold flex  gap-3">
          <span className="text-gray-500">Registration Date:</span>
          <span className=" text-gray-400">{convertedRegDate.date}</span>
        </p>
        <p className="text-xs sm:text-sm font-semibold flex  gap-3">
          <span className="text-gray-500 capitalize">
            {isOnline ? "Status" : "Last Seen"}
          </span>
          {statusContent}
        </p>
        <button
          className="text-xs flex items-base space-x-1 bg-blue-200 py-1 sm:py-2 px-2 sm:px-3 rounded-lg md:hover:bg-blue-400"
          onClick={onCopyHandler}
        >
          <LinkIcon className="h-4 w-4 text-gray-600" />
          <span className="font-semibold">Copy Link</span>
        </button>
      </div>
    </section>
  );
}
