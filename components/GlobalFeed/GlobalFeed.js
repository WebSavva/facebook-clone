import io from "socket.io-client";
import { useEffect, useState, useContext, useCallback, useRef } from "react";
import PostList from "../Posts/PostList";
import LazyFeed from "../LazyFeed/LazyFeed";
import { PostsStore } from "./../../posts-store/PostsStore";
import NewPost from "../NewPost/NewPost";
import Stories from "../Stories/Stories";

function GlobalFeed(props) {
  const [globalPosts, setGlobalPosts] = useState([]);
  const { addNewUserPost } = useContext(PostsStore);
  const postsBlockRef = useRef(null);

  const updatePosts = useCallback(
    (newPosts) => setGlobalPosts((prevPosts) => [...newPosts, ...prevPosts]),
    []
  );
  useEffect(() => {
    fetch(`${window.location.origin}/api/posts/listen`).finally(() => {
      const socket = io();

      socket.on("connect", () => {
        console.log("connect");
        socket.emit("hello");
      });

      socket.on("new-post", ([newPostObject]) => {
        setGlobalPosts((prev) => [newPostObject, ...prev]);
      });

      socket.on("disconnect", () => {
        console.log("disconnect");
      });
    });
  }, []);

  const componentProps = {
    postsData: globalPosts,
  };

  return (
    <div className="feed-block main-heightened" ref={postsBlockRef}>
      <Stories />
      <NewPost addNewPost={addNewUserPost} />
      <LazyFeed
        Component={PostList}
        feedRef={postsBlockRef}
        bindedUrl={`${
          window.location.origin
        }/api/posts?limit=${10}&last_post_id={}`}
        updatePostsHandler={updatePosts}
        componentProps={componentProps}
      />
    </div>
  );
}

export default GlobalFeed;
