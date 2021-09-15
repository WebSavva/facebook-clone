import { useRouter } from "next/router";
import UserCard from "../UserCard/UserCard";
import useHttp from "../../hooks/useHttp";
import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import Spinner from "../UI/Spinner/Spinner";
import LazyFeed from "../LazyFeed/LazyFeed";
import PostList from "../Posts/PostList";
import { useSession } from "next-auth/client";

export default function UserPage() {
  const router = useRouter();
  const [
    {
      user: { userId: selfId },
    },
  ] = useSession();
  const { userId } = router.query;
  if (userId === selfId) router.replace("/");

  const feedRef = useRef(null);
  const [userData, setUserData] = useState(null);
  const [posts, setPosts] = useState([]);
  const {
    sendRequest: fetchUserData,
    isLoading: isFetching,
    error: fetchingError,
  } = useHttp();

  const boundUserFetch = useCallback(() => {
    setUserData(null);
    fetchUserData({
      url: `${window.location.origin}/api/user?user_id=${userId}`,
      callback: setUserData,
    });
  }, [fetchUserData, userId]);
  const updatePosts = useCallback(
    (newPosts) => setPosts((prevPosts) => [...prevPosts, ...newPosts]),
    [setPosts]
  );

  useEffect(() => {
    boundUserFetch();
  }, [boundUserFetch]);

  useEffect(() => {
    setPosts([]);
  }, [userId, selfId, router]);

  const bindedRequestedUserUrl = useMemo(
    () =>
      `${
        window.location.origin
      }/api/posts?&post_owner=${userId}&limit=${5}&last_post_id={}`,
    [userId]
  );

  const componentProps = {
    ownerName: userData?.userName,
    ownerAvatar: userData?.avatarUrl,
    postsData: posts,
  };

  return (
    <div className="feed-block main-heightened" ref={feedRef}>
      {isFetching && <Spinner />}
      {userData && (
        <>
          <UserCard userLink={window.location.href} {...userData} />
          <LazyFeed
            feedRef={feedRef}
            userName={userData.userName}
            userAvatar={userData.avatarUrl}
            bindedUrl={bindedRequestedUserUrl}
            updatePostsHandler={updatePosts}
            Component={PostList}
            componentProps={componentProps}
          />
        </>
      )}
    </div>
  );
}
