import { useSession } from "next-auth/client";
import { ThumbUpIcon, ShareIcon, ChatAltIcon } from "@heroicons/react/solid";
import PostButton from "./PostButton";
import { ReactVideo, ReactAudio, Image as MediaImage } from "reactjs-media";
import Spinner from "./../UI/Spinner/Spinner";
import UserImage from "../UserImage/UserImage";
import convertDate from "./../../utilities/date-converter";
import Link from "next/link";
import Lightbox from "../UI/Lightbox/Lightbox";

const Post = ({
  fileUrl,
  postOwner,
  mediaType,
  postText,
  publishedDate,
  postOwnerAvatarUrl,
  postOwnerName,
}) => {
  let mediaContent;
  if (fileUrl) {
    switch (mediaType) {
      case "image":
        mediaContent = (
          <Lightbox>
            <MediaImage src={fileUrl} className="w-full" alt="Post Image" />
          </Lightbox>
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
        mediaContent = <ReactAudio src={fileUrl} className="w-full h-[90px]" />;
        break;

      default:
        break;
    }
  }

  const convertedPublishedDate = convertDate(publishedDate);

  return (
    <div className="flex flex-col gap-2 bg-white rounded-md shadow-sm p-5 animate-saturate">
      <Link href={`${window.location.origin}/users/${postOwner}`}>
        <a className="self-start cursor-pointer">
          <header className="flex gap-3">
            <UserImage
              className="h-[40px] w-[40px] sm:h-[50px] sm:w-[50px]"
              imgSrc={postOwnerAvatarUrl}
            />
            <div className="flex flex-col">
              <span className="text-sm md:text-md font-semibold">
                {postOwnerName}
              </span>
              <p className="text-xs sm:text-sm text-gray-400 font-normal">
                <span>{convertedPublishedDate.date}</span>
                <span className="ml-2 text-gray-300 hidden sm:inline-block">
                  {convertedPublishedDate.moment}
                </span>
              </p>
            </div>
          </header>
        </a>
      </Link>
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
