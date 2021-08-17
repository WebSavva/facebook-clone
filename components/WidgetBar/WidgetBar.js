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

function WidgetBar() {
  const [{user: {
    userId
  }}] = useSession();
  const selfId = useMemo(() => userId, []);
  const [usersData, setUsersData] = useState([]);
  const { sendRequest, isLoading: isFetching, error: fetchingError } = useHttp();
  const fetchRandomUsers = useCallback(() => {
    sendRequest({
      url: `api/users/random?user_id=${selfId}&sample_size=${5}`,
      callback: (responseData) => setUsersData(responseData.result),
    });
  }, [sendRequest, selfId]);

  useEffect(() => {
    fetchRandomUsers();
  }, [fetchRandomUsers]);


  if (fetchingError) {
    fetchRandomUsers();
  }

  const userItems = usersData.map(
    ({ _id: id, userId, userName, avatarUrl }) => (
      <UserItem key={id} userId={userId} userName={userName} avatarUrl={avatarUrl} />
    )
  );

  return (
    <div className="hidden lg:block min-w-[250px] px-3">
      <header className="text-gray-500 flex items-center justify-between mb-5">
        <h4 className="text-lg font-normal">Recommended</h4>
        <div className="flex items-center gap-1">
          <CameraIcon className={'h-5 w-5'} />
          <DotsHorizontalIcon className={'h-5 w-5'} />
          <SearchIcon className={'h-5 w-5'} />
        </div>
      </header>
      {isFetching && <Spinner />}
      {!isFetching && <ul className={`flex flex-col gap-5`}>{userItems}</ul>}
    </div>
  );
}

export default memo(WidgetBar);
