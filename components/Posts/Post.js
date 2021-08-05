import { useSession } from "next-auth/client";
import { ThumbUpIcon, ShareIcon, ChatAltIcon } from "@heroicons/react/solid";
import PostButton from "./PostButton";
import { ReactVideo, ReactAudio, Image as MediaImage } from "reactjs-media";
import Spinner from "./../UI/Spinner/Spinner";
import audioImage from "./../../public/audio_default.jpg";
import UserImage from "../UserImage/UserImage";

const Post = ({ fileUrl, mediaType, postText, publishedDate }) => {
  const [
    {
      user: { image: userImage, name: userName },
    },
  ] = useSession();

  let mediaContent;
  if (fileUrl) {
    switch (mediaType) {
      case "image":
        mediaContent = (
          <MediaImage
            src={fileUrl}
            className="w-full h-[150px] sm:h-[200px] md:h-[250px] lg:h-[300px]"
            alt="Post Image"
          />
        );
        break;
      case "video":
        mediaContent = (
          <ReactVideo
            src={fileUrl + "#t=0.1"}
            className="w-full h-[150px] sm:h-[200px] md:h-[250px] lg:h-[300px]"
          />
        );
        break;
      case "audio":
        mediaContent = (
          <ReactAudio
            src={fileUrl}
            className="w-full h-[90px]"
          />
        );
        break;

      default:
        break;
    }
  }

  let publishedDay = new Date(
    publishedDate.match(/\d{4}-\d{2}-\d{2}/)[0]
  ).toLocaleDateString("en-US", {
    dateStyle: "medium",
  });
  let publishedMoment = publishedDate.match(/\d\d:\d\d/)[0];

  return (
    <div className="flex flex-col gap-2 bg-white rounded-md shadow-sm p-5">
      <header className="flex gap-3">
        <UserImage className='h-[40px] w-[40px] sm:h-[50px] sm:w-[50px]'/>
        <div className="flex flex-col">
          <span className="text-sm md:text-md font-semibold">{userName}</span>
          <p className="text-xs sm:text-sm text-gray-400 font-normal">
            <span>{publishedDay}</span>
            <span className="ml-2 text-gray-300 hidden sm:inline-block">{publishedMoment}</span>
          </p>
        </div>
      </header>
      <p className="text-sm sm:text-sm md:text-base">{postText}</p>
      {mediaContent}
      <div className="flex gap-1 justify-between">
        <PostButton Icon={ThumbUpIcon} />
        <PostButton Icon={ChatAltIcon} />
        <PostButton Icon={ShareIcon} />
      </div>
    </div>
  );
};

export default Post;
