import { useRef, useMemo, useContext } from "react";
import { useSession } from "next-auth/client";
import LazyFeed from "../LazyFeed/LazyFeed";
import UserCard from "../UserCard/UserCard";
import bindUrlParams from "../../utilities/bindUrlParams";
import PostList from "../Posts/PostList";
import { PostsStore } from "../../posts-store/PostsStore";
import NewPost from "../NewPost/NewPost";

export default function Homepage() {
  const [
    {
      user: { userId, name: userName, image: avatarUrl, registrationDate },
    },
  ] = useSession();

  const {
    isAllPostsLoaded,
    stopUserPostsLoading,
    userPosts,
    addNewUserPost,
    updateUserPosts,
  } = useContext(PostsStore);

  const postBlockRef = useRef(null);
  const bindedUserUrl = useMemo(
    () =>
      bindUrlParams(
        `${
          window.location.origin
        }/api/posts?post_owner=${userId}&limit=${5}&last_post_id={}`
      ),
    [userId]
  );

  const componentProps = {
    ownerName: userName,
    ownerAvatar: avatarUrl,
    postsData: userPosts,
  };

  return (
    <div
      className="feed-block main-heightened"
      ref={postBlockRef}
      id="feed-block"
    >
      <UserCard
        avatarUrl={avatarUrl}
        userName={userName}
        registrationDate={registrationDate}
        isOnline={true}
        userLink={`${window.location.origin}/users/${userId}`}
      />
      <NewPost addNewPost={addNewUserPost} />
      <LazyFeed
        feedRef={postBlockRef}
        bindedUrl={bindedUserUrl}
        stopLoading={stopUserPostsLoading}
        isStopped={isAllPostsLoaded}
        Component={PostList}
        componentProps={componentProps}
        updatePostsHandler={updateUserPosts}
      />
    </div>
  );
}
