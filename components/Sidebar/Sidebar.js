import SidebarRow from "./SidebarRow";
import {
  UserGroupIcon,
  LibraryIcon,
  UsersIcon,
  BookmarkIcon,
  ChevronDownIcon,
} from "@heroicons/react/solid";
import { useSession } from "next-auth/client";

export default function Sidebar(){
  const [session] = useSession();
    
  return (
    <ul className="hidden sm:flex flex-col gap-5 px-3 w-max ">
      <SidebarRow title={session.user.name} isUserRow />
      <SidebarRow title='Search Friends' Icon={UsersIcon}/>
      <SidebarRow title='Marketplace' Icon={LibraryIcon}/>
      <SidebarRow title='Groups' Icon={UserGroupIcon}/>
      <SidebarRow title='Save' Icon={BookmarkIcon}/>
      <SidebarRow title='Other' Icon={ChevronDownIcon}/>
    </ul>
  );
};

