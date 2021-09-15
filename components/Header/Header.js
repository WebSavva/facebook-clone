import Image from "next/image";
import FacebookLogo from "./../../public/fb-logo.png";
import SearchInput from "../SearchInput/SearchInput";
import {
  HomeIcon,
  BellIcon,
  ViewGridIcon,
  ChevronDownIcon,
  LogoutIcon,
  UserGroupIcon,
} from "@heroicons/react/solid";
import { ChatIcon, GlobeIcon } from "@heroicons/react/outline";
import HeaderIcon from "./HeaderIcon";
import { useSession } from "next-auth/client";
import { useRouter } from "next/router";
import UserImage from "../UserImage/UserImage";
import NavLink from "../NavLink/NavLink";
import Link from "next/link";

export default function Header() {
  const [
    {
      user: { image: userImage, name: userName },
    },
  ] = useSession();
  const router = useRouter();
  const redirectToSignOutPage = () => router.push("/auth/signout");
  const [userFirstName, userLastName] = userName.split(" ");

  return (
    <div className="flex justify-between items-center bg-white shadow-md p-2 md:px-5 bg-white header">
      {/* LEFT */}
      <div className="flex items-center">
        <div className="relative w-[30px] h-[30px] md:w-[40px] md:h-[40px]">
          <Image
            src={FacebookLogo}
            alt={"Search Icon"}
            layout="fill"
            objectFit="cover"
          />
        </div>
        <SearchInput />
      </div>

      {/* CENTER */}
      <div className="flex md-2 md:gap-5">
        <NavLink href="/" className="header-link">
          <HeaderIcon Icon={HomeIcon} />
        </NavLink>
        <NavLink href="/explore" className="header-link">
          <HeaderIcon Icon={GlobeIcon} />
        </NavLink>
        <NavLink href="/search" className="header-link">
          <HeaderIcon Icon={UserGroupIcon} />
        </NavLink>
        <button onClick={redirectToSignOutPage} className="header-link">
          <HeaderIcon Icon={LogoutIcon} />
        </button>
      </div>

      {/* RIGHT */}
      <div className="flex items-center justify-end gap-2">
        <Link href="/">
          <a className="flex items-center gap-2">
            <UserImage className="rounded-full h-[35px] w-[35px]" />
            <span className="font-semibold  sm:gap-2 hidden sm:flex sm:text-sm lg:text-base ">
              <span>{userFirstName}</span>
              <span className="hidden md:inline-block">
                {!(userLastName.length > 20) && userLastName}
              </span>
            </span>
          </a>
        </Link>

        <ViewGridIcon className="icon" />
        <ChatIcon className="icon" />
        <BellIcon className="icon" />
        <ChevronDownIcon className="icon" />
      </div>
    </div>
  );
}
