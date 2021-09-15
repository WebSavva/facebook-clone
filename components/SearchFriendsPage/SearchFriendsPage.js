import SearchFriendsInput from "../SearchFriendsInput/SearchFriendsInput";
import useHttp from "../../hooks/useHttp";
import { useState, useCallback } from "react";
import { useSession } from "next-auth/client";
import UserItem from "./../OnlineUsersBar/UserItem";
import Spinner from "../UI/Spinner/Spinner";
import Banner from "../UI/Banner/Banner";

export default function SearchFriendsPage() {
  const [
    {
      user: { userId: selfId },
    },
  ] = useSession();
  const [notFound, setNotFound] = useState(false);
  const [usersInfo, setUsersInfo] = useState([]);
  const {
    sendRequest: fetchUsersInfo,
    isLoading: isFetching,
    error: fetchingError,
  } = useHttp();

  const bindedFetchUsersInfo = useCallback(
    (enteredName, isOnlineFiltered) => {
      setNotFound(false);
      fetchUsersInfo({
        url: `${window.location.origin}/api/users?entered_name=${enteredName}${
          isOnlineFiltered ? "&online=true" : ""
        }`,
        callback: (result) => {
          if (!result.length) setNotFound(true);
          setUsersInfo(result);
        },
      });
    },
    [fetchUsersInfo]
  );

  const removeNotFound = setNotFound.bind(null, false);

  let content;
  if (fetchingError) {
    content = <h1>{fetchingError}</h1>;
  } else if (isFetching) {
    content = <Spinner />;
  } else if (notFound) {
    content = <Banner text="Sorry, no users found!" />;
  } else {
    content = usersInfo.map(({ _id, ...props }) => (
      <UserItem
        key={_id}
        {...props}
        className="flex items-center gap-5 p-3 shadowm-sm bg-white rounded-lg transition filter md:hover:opacity-70"
      />
    ));
  }

  return (
    <div className="feed-block main-heightened">
      <SearchFriendsInput
        fetchHandler={bindedFetchUsersInfo}
        onChangeHandler={removeNotFound}
      />
      <div className="flex flex-col space-y-4">{content}</div>
    </div>
  );
}
