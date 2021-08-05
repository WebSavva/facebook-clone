import Stories from "../Stories/Stories";
import {
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import Image from "next/image";
import NewPost from "../NewPost/NewPost";
import useLoadPosts from "../../hooks/useLoadPosts";
import PostList from "./../Posts/PostList";


export default function Feed({ userHash }) {
  const [userPosts, setUserPosts] = useState([]);
  const {
    startLoadingOnPageEnd,
    isLoading: isFetchingPosts,
    isDone: isAllPostsLoaded

  } = useLoadPosts((rows) => setUserPosts((prevUserPosts) => prevUserPosts.concat(rows)), userHash);
  
  const feedRef = useRef(null);

  const addNewUserPostHandler = useCallback((postObject) => {
    setUserPosts((prevPosts) => [postObject, ...prevPosts]);
  },[]);

 

  useEffect(() => {
    feedRef.current.onscroll = function (e) {
      if (
        (feedRef.current.scrollHeight - feedRef.current.scrollTop <
        feedRef.current.offsetHeight + 200) && !isAllPostsLoaded
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
