import { useState, useEffect, useCallback, useRef, memo } from "react";
import NewPost from "../NewPost/NewPost";
import useContentLoader from "../../hooks/usePostsLoader";
import PostList from "../Posts/PostList";
import { useSession } from "next-auth/client";

export default function LazyFeed({
  feedRef,
  bindedUrl,
  updatePostsHandler = () => {},
  Component,
  componentProps,
  isStopped = false,
  stopLoading = () => {},
}) {
  const {
    startLoadingOnPageEnd,
    isLoading: isFetchingPosts,
    isDone: isAllPostsLoaded,
    lastId,
    fetchData,
    pageEnded
  } = useContentLoader({
    onFetchHandler: (result) => {
      updatePostsHandler(result);
    },
    url: bindedUrl,
  });

  console.log(lastId);
  useEffect(() => {
    if (isStopped) return;

    feedRef.current.onscroll = function (e) {
      if (
        feedRef.current.scrollHeight - feedRef.current.scrollTop <
          feedRef.current.offsetHeight + 300 &&
        !isAllPostsLoaded
      ) {
        startLoadingOnPageEnd();
      }
    };
  }, [startLoadingOnPageEnd, isAllPostsLoaded, feedRef, isStopped]);

  useEffect(() => {
    if (isAllPostsLoaded) stopLoading();
  }, [isAllPostsLoaded, stopLoading]);

  useEffect(() => {
    if (isStopped) feedRef.current.onscroll = null;
  }, [isStopped, feedRef]);

  useEffect(() => {
    if (pageEnded && !isAllPostsLoaded && !isStopped) fetchData(lastId);
  }, [pageEnded, fetchData, isAllPostsLoaded, lastId, isStopped]);

  useEffect(() => {
    if (!isStopped) startLoadingOnPageEnd();
  }, [startLoadingOnPageEnd, isStopped]);
  return (
    <>
      <Component {...componentProps} isLoading={isFetchingPosts} />
    </>
  );
}
