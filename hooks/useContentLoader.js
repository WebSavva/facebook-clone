import { useReducer, useEffect, useCallback ,useMemo } from "react";
function setUrlParam(url, urlParamName, urlParamValue) {
  let regExp = new RegExp(`(?<=${urlParamName}=)%`);
//   console.log(regExp);
//     console.log(url.match(regExp));
  return url.replace(regExp, urlParamValue);
}
const initialState = {
  isLoading: false,
  error: null,
  pageEnded: false,
  lastId: null,
  isDone: false,
};

function getReducer(fieldName) {
  return function reducer(state, action) {
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
          payload: { fetchedData },
        } = action;

        if (!fetchedData.length) {
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
          error: null,
          pageEnded: false,
          isLoading: false,
          lastId: fetchedData[fetchedData.length - 1][fieldName],
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
  };
}

export default function useContentLoader({
  onFetchHandler,
  urlTemplate,
  idFieldName,
  urlParamsMap: { id: urlId, bindingField: urlBindingField, otherParams },
}) {
  const [idParamName, initialIdValue] = Object.entries(urlId)[0];
  const additionalParams = useMemo(() => otherParams);
  const [postsState, dispatch] = useReducer(getReducer(idFieldName), {
    ...initialIdValue,
    lastId: initialIdValue,
  });

  const { isLoading, pageEnded, lastId, isDone, error } = postsState;

  const [bindingFieldName, bindingFieldValue] = useMemo(() => Object.entries(urlBindingField)[0], []);
    
  const boundUrl = useMemo ( () => setUrlParam(
    urlTemplate,
    bindingFieldName,
    bindingFieldValue
  ), []);

  const startLoadingOnPageEnd = useCallback(() => {
    dispatch({
      type: "PAGE_END",
    });
  }, []);

  const fetchData = useCallback(
    async (lastId) => {
      try {
        startLoadingOnPageEnd();

        let fullUrl = setUrlParam(boundUrl, idParamName, lastId);
        for (let [paramName, paramValue] of Object.entries(additionalParams)) {
            fullUrl = setUrlParam(fullUrl, paramName, paramValue);
        }
        
        const response = await fetch(
          fullUrl
        );

        const responseData = await response.json();
        if (!response.ok) throw new Error(responseData.error);

        const fetchedData = responseData.result;
        dispatch({
          type: "SUCCESS",
          payload: {
            fetchedData,
          },
        });

        onFetchHandler(fetchedData);
    } catch (error) {
        console.log(error.message);
        dispatch({
          type: "ERROR",
          payload: {
            error: error.message,
          },
        });
      }
    },
    [startLoadingOnPageEnd, onFetchHandler]
  );

  useEffect(() => {
    if (pageEnded && !isDone) fetchData(lastId);
  }, [pageEnded, fetchData, isDone]);

  useEffect(() => {
    startLoadingOnPageEnd();
  }, []);

  return {
    isLoading,
    isDone,
    startLoadingOnPageEnd,
    error,
  };
}
