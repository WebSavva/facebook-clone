import { memo } from "react";
import Image from "next/image";
import Link from "next/link";

function UserItem({ userId, userName, avatarUrl }) {
  return (
    <Link href={`/users/${userId}`}>
      <a>
        <li className="flex items-center gap-2 cursor-pointer transition rounded-md md:hover:bg-gray-200 p-2">
          <div className="relative h-[50px] w-[50px]">
            <Image
              layout="fill"
              src={avatarUrl}
              alt={`${userName} Photo`}
              className={`rounded-full animate-saturate`}
            />
          </div>
          <span className="text-sm font-semibold">{userName}</span>
        </li>
      </a>
    </Link>
  );
}

export default UserItem;
