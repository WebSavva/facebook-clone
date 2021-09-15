import { useReducer, useEffect, useCallback, useMemo } from "react";
import bindUrlParams from "../utilities/bindUrlParams";

const initialState = {
  loadedPosts: [],
  isLoading: false,
  error: null,
  pageEnded: false,
  lastId: "",
  isDone: false,
};

function reducer(state, action) {
  switch (action.type) {
    case "PAGE_END":
      if (state.isLoading) {
        return {
          ...state,
          pageEnded: false,
        };
      }

      return {
        ...state,
        isLoading: true,
        pageEnded: true,
      };
      break;
    case "SUCCESS":
      const {
        payload: { fetchedPosts },
      } = action;

      if (!fetchedPosts.length) {
        return {
          ...state,
          pageEnded: false,
          error: null,
          isLoading: false,
          isDone: true,
        };
      }

      return {
        ...state,
        loadedPosts: [...fetchedPosts, ...state.loadedPosts],
        error: null,
        pageEnded: false,
        isLoading: false,
        lastId: fetchedPosts[fetchedPosts.length - 1]._id,
      };
      break;
    case "ERROR":
      return {
        ...state,
        pageEnded: false,
        isLoading: false,
        error: action.payload.errorMessage,
      };
  }
}

export default function useContentLoader({ onFetchHandler, url }) {
  const [postsState, dispatch] = useReducer(reducer, initialState);

  const { isLoading, pageEnded, lastId, isDone, error } = postsState;

  const startLoadingOnPageEnd = useCallback(() => {
    dispatch({
      type: "PAGE_END",
    });
  }, []);

  const fetchData = useCallback(
    async (lastId) => {
      try {
        startLoadingOnPageEnd();

        const response = await fetch(bindUrlParams(url, lastId));

        const responseData = await response.json();
        if (!response.ok) throw new Error(responseData.error);

        const fetchedPosts = responseData;
        dispatch({
          type: "SUCCESS",
          payload: {
            fetchedPosts,
          },
        });

        onFetchHandler(fetchedPosts);
      } catch (error) {
        dispatch({
          type: "ERROR",
          payload: {
            error: error.message,
          },
        });
      }
    },
    [startLoadingOnPageEnd, onFetchHandler, url]
  );

  return {
    isLoading,
    isDone,
    startLoadingOnPageEnd,
    error,
    pageEnded,
    fetchData,
    lastId,
  };
}
