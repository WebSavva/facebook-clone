import { Image as MediaImage } from "reactjs-media";
import { useSession } from "next-auth/client";

function UserImage({ className, imgSrc, isOnline }) {
  const [
    {
      user: { image: userImgUrl },
    },
  ] = useSession();
  return (
    <div className={`${className} user-image relative`}>
      <MediaImage
        alt="User Image"
        src={imgSrc || userImgUrl}
        className="w-full h-full rounded-full"
      />
      {isOnline && (
        <span className="absolute bottom-0 right-1 w-3 h-3 bg-green-400 rounded-full"></span>
      )}
    </div>
  );
}

export default UserImage;
