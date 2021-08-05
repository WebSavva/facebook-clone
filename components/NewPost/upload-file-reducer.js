export const initialPostData = {
  data: {
    fileUrl: null,
    file: null,
    text: "",
    userId: "",
  },
  error: null,
  isFileUploading: false,
};

export function newPostReducer(state, action) {
  if (action.type === "SET_FILE") {
    return {
      ...state,
      data: {
        ...state.data,
        fileUrl: action.payload.fileBase64,
        file: action.payload.file,
      },
      isFileUploading: false,
    };
  }
  if (action.type === "ERROR") {
    return {
      ...state,
      data: {
        ...state.data,
        fileUrl: null,
        file: null,
      },
      error: action.payload.errorMessage,
    };
  }

  if (action.type === "FILE_UPLOADING") {
    return {
      ...state,
      isFileUploading: true,
      error: null,
    };
  }

  if (action.type === "RESET") {
    return JSON.parse(JSON.stringify(initialPostData));
  }
}
