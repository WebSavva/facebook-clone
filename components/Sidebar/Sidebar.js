import SidebarRow from "./SidebarRow";
import {
  UsersIcon,
  GlobeAltIcon,
  ChevronDownIcon,
  HomeIcon,
} from "@heroicons/react/solid";
import { useSession } from "next-auth/client";

export default function Sidebar() {
  const [session] = useSession();

  return (
    <ul className="hidden lg:flex flex-col gap-5 px-3 w-max ">
      <SidebarRow title={session.user.name} isUserRow href="/" />
      <SidebarRow title="Home" Icon={HomeIcon} href="/" />
      <SidebarRow title="Search Friends" Icon={UsersIcon} href="/search" />
      <SidebarRow title="Explore" Icon={GlobeAltIcon} href="/explore" />
    </ul>
  );
}
