import { useReducer, useCallback } from "react";

const initialState = {
    data: {},
    isLoading: false,
    error: null
};

const reducer = (state, action) => {
    if (action.type === 'SUCCESS') {
        return {
            ...state,
            isLoading: false,
            data: action.payload.responseData
        }
    } 

    if (action.type === 'ERROR') {
        return {
            ...state,
            isLoading: false,
            error: action.payload.errorMessage
        }
    }

    if (action.type === 'LOADING') {
        return {
            ...state,
            error: null,
            isLoading: true
        }
    }
};

const useHttp  = () => {
    const [responseState , dispatch] = useReducer(reducer, initialState);

    const sendRequest = useCallback(async ({
        url,
        requestBody,
        requestMethod,
        callback
    }) => { 
        try {
            dispatch({
                type: 'LOADING'
            });
            let response = await fetch(url, {
                ...(requestMethod && {method: requestMethod}),
                ...(requestBody && {body: requestBody}),
            });
            
            
            let responseData = await response.json();
            if (!response.ok)  {
                throw new Error(responseData.err.message);
            }

            dispatch({
                type: 'SUCCESS',
                payload: {
                    responseData
                }
            });
            callback(responseData);
            
        } catch (error) {
            dispatch({
                type: 'ERROR',
                payload: {
                    errorMessage: error.message
                }
            });
        }
    }, [dispatch]);

    return {
        ...responseState,
        sendRequest
    };
};

export default useHttp;

