import { memo } from "react";
import Link from "next/link";
import UserImage from "../UserImage/UserImage";

function UserItem({
  userId,
  userName,
  avatarUrl,
  className,
  isOnline,
  isNameVisible = true,
}) {
  return (
    <Link href={`${window.location.origin}/users/${userId}`}>
      <a>
        <li className={`${className}`}>
          <UserImage
            className="h-[50px] w-[50px]"
            imgSrc={avatarUrl}
            isOnline={isOnline}
          ></UserImage>
          <span
            className={`text-xs sm:text-sm font-semibold ${
              isNameVisible ? "block" : "hidden"
            }`}
          >
            {userName}
          </span>
        </li>
      </a>
    </Link>
  );
}

export default UserItem;
