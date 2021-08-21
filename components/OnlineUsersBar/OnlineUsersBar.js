import {
  CameraIcon,
  DotsHorizontalIcon,
  SearchIcon,
} from "@heroicons/react/solid";
import { useSession } from "next-auth/client";
import UserItem from "./UserItem";
import { useState, useEffect, useMemo, useCallback, memo } from "react";
import Spinner from "../UI/Spinner/Spinner";
import useHttp from "../../hooks/useHttp";
import Skeleton from "react-loading-skeleton";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper.min.css";
import usePrevious from "./../../hooks/usePrevious";
import mediaMatch from "./../../utilities/windowMediaMatch";

function OnlineUsersBar() {
  const [
    {
      user: { userId: selfId },
    },
  ] = useSession();
  const [usersData, setUsersData] = useState([]);
  const [isMobile, setIsMobile] = useState(mediaMatch());
  const [responseLimit, setResponseLimit] = useState(isMobile ? 30 : 5);
  const userItemClass =
    "flex items-center gap-2 cursor-pointer transition rounded-md md:hover:bg-gray-200 p-2";
  const {
    sendRequest,
    isLoading: isFetching,
    error: fetchingError,
  } = useHttp();
  const fetchRandomUsers = useCallback(() => {
    sendRequest({
      url: `${window.location.origin}/api/users?online=true&limit=${responseLimit}&self_id=${selfId}`,
      callback: (fetchedUsers) =>
        setUsersData(fetchedUsers.filter(({ userId }) => userId !== selfId)),
    });
  }, [sendRequest, selfId, responseLimit]);
  console.log(fetchingError);
  useEffect(() => {
    fetchRandomUsers();
    let updateOnlineUsersTimer = setInterval(fetchRandomUsers, 5 * 60 * 1e3);
    return () => {
      clearInterval(updateOnlineUsersTimer);
    };
  }, [fetchRandomUsers, responseLimit]);

  useEffect(() => {
    window.onresize = () => {
      if (mediaMatch() && !isMobile) {
        setIsMobile(true);
        setResponseLimit(30);
      } else if (!mediaMatch() && isMobile) {
        setIsMobile(false);
        setResponseLimit(5);
      }
    };
  }, [isMobile]);

  //RENDER LOGIC
  const userItems = usersData.map((props) => {
    let userItem = (
      <UserItem
        key={props._id}
        {...props}
        className={userItemClass}
        isNameVisible={!isMobile}
      />
    );

    return isMobile ? (
      <SwiperSlide key={props._id}>{userItem}</SwiperSlide>
    ) : (
      userItem
    );
  });

  const loadingTemplate = <Skeleton height="100px" width="100%" rounded/>;

  let content;
  if (isMobile) {
    content = (
      <Swiper slidesPerView={5} spaceBetween={1}>
        {userItems}
      </Swiper>
    );
  } else {
    content = <ul className={`flex flex-col gap-5`}>{userItems}</ul>;
  }

  return (
    <div className="block min-w-[250px] px-3">
      <header className="hidden text-gray-500 sm:flex items-center justify-between sm:mb-5">
        <h4 className="text-lg font-normal capitalize">Online Users</h4>
        <div className="flex items-center gap-1">
          <CameraIcon className={"h-5 w-5"} />
          <DotsHorizontalIcon className={"h-5 w-5"} />
          <SearchIcon className={"h-5 w-5"} />
        </div>
      </header>
      {!isFetching &&
        !usersData.length &&  !fetchingError && (
          <h4 className="text-gray-400 capitalize text-center font-light text-sm w-3/4 m-auto">
            No users online currently except you...
          </h4>
        )}
      {(isFetching || fetchingError) && loadingTemplate}

      {!!usersData.length && !isFetching && <>{content}</>}
    </div>
  );
}

export default OnlineUsersBar;
