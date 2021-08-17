import Stories from "../Stories/Stories";
import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import NewPost from "../NewPost/NewPost";
import useContentLoader from "../../hooks/useContentLoader";
import PostList from "./../Posts/PostList";
import { useSession } from "next-auth/client";

export default function Feed() {
  const [
    {
      user: { userId },
    },
  ] = useSession();
  const [userPosts, setUserPosts] = useState([]);
  const {
    startLoadingOnPageEnd,
    isLoading: isFetchingPosts,
    isDone: isAllPostsLoaded,
  } = useContentLoader({
    onFetchHandler: (result) =>
      setUserPosts((prevUserPosts) => prevUserPosts.concat(result)),
    urlTemplate: "api/posts?last_post_date=%&post_owner=%&limit=%",
    idFieldName: "publishedDate",
    urlParamsMap: {
      id: {
        last_post_date: "3000-01-01",
      },
      bindingField: {
        post_owner: userId,
      },
      otherParams: {
        limit: 5,
      },
    },
  });

  const feedRef = useRef(null);

  const addNewUserPostHandler = useCallback((postObject) => {
    setUserPosts((prevPosts) => [postObject, ...prevPosts]);
  }, []);

  useEffect(() => {
    feedRef.current.onscroll = function (e) {
      if (
        feedRef.current.scrollHeight - feedRef.current.scrollTop <
          feedRef.current.offsetHeight + 300 &&
        !isAllPostsLoaded
      ) {
        startLoadingOnPageEnd();
      }
    };
  }, [startLoadingOnPageEnd, isAllPostsLoaded]);

  return (
    <div
      className="py-5 flex overflow-y-auto scrollbar-hide main-heightened flex-col gap-10 flex-grow p-3  lg:max-w-[600px]"
      ref={feedRef}
    >
      <Stories />
      <NewPost addNewPost={addNewUserPostHandler} />
      <PostList postsData={userPosts} isLoading={isFetchingPosts} />
    </div>
  );
}
