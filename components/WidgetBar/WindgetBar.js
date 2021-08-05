import { onlineUsersData } from "./online-users";
import {
  CameraIcon,
  DotsHorizontalIcon,
  SearchIcon,
} from "@heroicons/react/solid";
import OnlineUserItem from "./OnlineUserItem";
import { useState, useEffect, useMemo, useCallback, memo } from "react";
import Spinner from "../UI/Spinner/Spinner";

function WidgetBar() {
  const [isWidgetLoaded, setIsWidgetLoaded] = useState(false);
  const [numberLoadedImgs, setNumberLoadedImgs] = useState(0);
  const iconClass = "w-7 h-7 cursor-pointer hover:bg-gray-200 p-1 rounded-sm";
  const onLoadHandler = useCallback( () => setNumberLoadedImgs((prev) => prev + 1), []);
  const onlineUserItems = useMemo(
    () =>
      onlineUsersData.map(({ id, imgSrc, name, isOnline }) => (
        <OnlineUserItem key={id} imgSrc={imgSrc} userName={name} isOnline={isOnline} onLoadHandler={onLoadHandler}/>
      )),
    [onLoadHandler]
  );

  useEffect(() => {
    if (numberLoadedImgs === onlineUsersData.length - 1) setIsWidgetLoaded(true);
  }, [numberLoadedImgs]);


  return (
    <div className="hidden lg:block min-w-[250px] px-3">
      <header className="text-gray-500 flex items-center justify-between mb-5">
        <h4 className="text-lg font-normal tracking-widest">Contacts</h4>
        <div className="flex items-center gap-1">
          <CameraIcon className={iconClass} />
          <DotsHorizontalIcon className={iconClass} />
          <SearchIcon className={iconClass} />
        </div>
      </header>
      {!isWidgetLoaded && <Spinner/>}
      <div className={`flex flex-col gap-5 transition duration-1000 ${!isWidgetLoaded ? 'invisible' : 'visible'}`}>{onlineUserItems}</div>
    </div>
  );
}

export default memo(WidgetBar);
