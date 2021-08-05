import Image from "next/image";
import FacebookLogo from "./../../public/fb-logo.png";
import SearchInput from "../SearchInput/SearchInput";
import {
  HomeIcon,
  BellIcon,
  ViewGridIcon,
  ChevronDownIcon,
  LogoutIcon
} from "@heroicons/react/solid";
import {
  FlagIcon,
  PlayIcon,
  ShoppingCartIcon,
  ChatIcon,
} from "@heroicons/react/outline";
import HeaderIcon from "./HeaderIcon";
import { useSession } from "next-auth/client";
import { useRouter } from "next/router";
import UserImage from "../UserImage/UserImage";

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
            objectFit='cover'
          />
        </div>
        <SearchInput />
      </div>

      {/* CENTER */}
      <div className="flex md-2 md:gap-5">
        <HeaderIcon Icon={HomeIcon} active />
        <HeaderIcon Icon={FlagIcon} />
        <HeaderIcon Icon={ShoppingCartIcon} />
        <HeaderIcon Icon={PlayIcon} />
        <HeaderIcon Icon={LogoutIcon} onClickHandler={redirectToSignOutPage}/>
      </div>

      {/* RIGHT */}
      <div className="flex items-center justify-end gap-2">
        <UserImage className='rounded-full h-[35px] w-[35px]'/>
        <span className="font-semibold  sm:gap-2 hidden sm:flex sm:text-sm lg:text-base ">
          <span>{userFirstName}</span>
          <span className="hidden md:inline-block">
            {!(userLastName.length > 20) && userLastName}
          </span>
        </span>
        <ViewGridIcon className="icon" />
        <ChatIcon className="icon" />
        <BellIcon className="icon" />
        <ChevronDownIcon className="icon" />
      </div>
    </div>
  );
}
