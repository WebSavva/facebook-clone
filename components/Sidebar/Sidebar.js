import SidebarRow from "./SidebarRow";
import {
  UsersIcon,
  GlobeAltIcon,
  ChevronDownIcon,
  HomeIcon
} from "@heroicons/react/solid";
import { useSession } from "next-auth/client";

export default function Sidebar(){
  const [session] = useSession();
    
  return (
    <ul className="hidden sm:flex flex-col gap-5 px-3 w-max ">
      <SidebarRow title={session.user.name} isUserRow />
      <SidebarRow title='Home' Icon={HomeIcon}/>
      <SidebarRow title='Search Friends' Icon={UsersIcon}/>
      <SidebarRow title='Explore' Icon={GlobeAltIcon}/>
      <SidebarRow title='Other' Icon={ChevronDownIcon}/>
    </ul>
  );
};

