import React, { useState, useCallback } from "react";

const defaultValue = {
  userPosts: [],
  updateUserPosts: (fetchedPosts) => {
    console.log(fetchedPosts);
  },
  addNewUserPos: (newPostData) => {},
  stopUserPostsLoading: () => {},
  isAllPostsLoaded: false
};

export const PostsStore = React.createContext(defaultValue);

export default function PostsProvider(props) {
  const [posts, setPostsState] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const addNewPost = useCallback((newPostData) => setPostsState((prevPosts) => [newPostData, ...prevPosts]), []);
  const addPosts = useCallback((fetchedPosts) => setPostsState((prevPosts) => [...prevPosts, ...fetchedPosts]), []);
  const setLoadEnd = useCallback(() => setIsLoaded(true), []);
  return (
    <PostsStore.Provider
      value={{
       userPosts: posts,
       updateUserPosts: addPosts,
       addNewUserPost: addNewPost,
       stopUserPostsLoading: setLoadEnd,
       isAllPostsLoaded: isLoaded
      }}
    >
        {props.children}
    </PostsStore.Provider>
  );
};
