import { useReducer, useEffect, useCallback } from "react";

const initialState = {
    isLoading: false,
    error: null,
    loadedPosts: null,
    pageEnded: false,
    lastPostId: 1e9,
    isDone: false
};

function reducer(state, action) {
    console.log(action.type);
    switch (action.type) {
        case "PAGE_END":
            if (state.isLoading) {
                return {
                    ...state,
                    pageEnded:false
                }
            }

            return {
                ...state,
                isLoading:true,
                pageEnded: true
            };
            break;
        case "SUCCESS":
            const {
                payload: {
                    fetchedPosts
                }
            } = action;

            if (!fetchedPosts.length) {
                return {
                    ...state,
                    pageEnded:false,
                    error:null,
                    isLoading:false,
                    isDone:true
                };
            }

            return {
                ...state,
                error: null,
                pageEnded:false,
                isLoading: false,
                loadedPosts: fetchedPosts,
                lastPostId: fetchedPosts[fetchedPosts.length - 1].id
            };
            break;
        case "ERROR":
            return {
                ...state,
                pageEnded: false,
                isLoading: false,
                error: action.payload.errorMessage
            };
    }
  

}

export default function useLoadPosts(onFetchHandler, postOwner) {
    const [postsState, dispatch] = useReducer(reducer, initialState);

    const {
        isLoading,
        pageEnded,
        lastPostId,
        loadedPosts,
        isDone,
        error
    } = postsState;

    const startLoadingOnPageEnd = useCallback(() => {
        dispatch({
            type: "PAGE_END"
        });
    }, []);
    
    const fetchPosts = useCallback(async (lastPostId) => {
        try {
            startLoadingOnPageEnd();
            const response = await fetch(`api/posts?post_owner=${postOwner}&last_post_id=${lastPostId}`);
            console.log(lastPostId);
            const responseData = await response.json();
            console.log(postOwner, lastPostId);
            if (!response.ok) throw new Error(responseData.error);

            const fetchedPosts = responseData.rows;
            dispatch({
                type:"SUCCESS",
                payload: {
                    fetchedPosts
                }
            })
            onFetchHandler(fetchedPosts);

            

        } catch (error) {
            dispatch({
                type: "ERROR",
                payload: {
                    error: error.message
                }
            })
        }
    }, [postOwner, startLoadingOnPageEnd, onFetchHandler]);

    useEffect(() => {
        if (pageEnded && !isDone) fetchPosts(lastPostId);
    }, [pageEnded, fetchPosts, isDone]);

    useEffect(() => {
        startLoadingOnPageEnd();
    }, []);

    return {
        isLoading,
        isDone,
        startLoadingOnPageEnd,
        error
    };
}
