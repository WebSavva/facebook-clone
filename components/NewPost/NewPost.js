import Image from "next/image";
import { useRef, useReducer, useCallback, useState } from "react";
import { useSession } from "next-auth/client";
import FileInputBox from "./FileInputBox";
import Spinner from "../UI/Spinner/Spinner";
import ThumbnailFile from "./ThumbnailFile";
import Modal from "../UI/Modal/Modal";
import useHttp from "./../../hooks/useHttp";
import { initialPostData, newPostReducer } from "./upload-file-reducer";
import UserImage from "../UserImage/UserImage";

export default function NewPost(props) {
  const [session] = useSession();
  const textInputRef = useRef(null);
  const [postState, dispatch] = useReducer(newPostReducer, initialPostData);
  const {
    data: enteredPostData,
    isFileUploading,
    error: uploadError,
  } = postState;
  const {
    data: fetchedNewPostData,
    error: pushError,
    isLoading: isPushingNewPostData,
    sendRequest: pushNewPost,
  } = useHttp();
  const [, updateState] = useState();
  const forceUpdate = useCallback(() => updateState({}), []);

  const removeUploadedFile = (e, _ = e && e.preventDefault) =>
    dispatch({
      type: "RESET",
    });

  const clearOutForm = (e, _ = e && e.preventDefault) => {
    removeUploadedFile();
    textInputRef.current.value = "";
  };

  const saveNewPost = (e) => {
    e.preventDefault();
    const newPostFormData = new FormData();
    if (!textInputRef.current.value && !enteredPostData.file) return;

    newPostFormData.append("uploaded-file", enteredPostData.file);
    newPostFormData.append("text", textInputRef.current.value);
    newPostFormData.append("user-email", session.user.email);

    pushNewPost({
      url: `${window.location.origin}/api/new-post`,
      requestMethod: "POST",
      requestBody: newPostFormData,
      callback: (newPostObject) => {
        if (newPostObject.fileUrl) {
          newPostObject.fileUrl = newPostObject.fileUrl.join("");
        }
        props.addNewPost(newPostObject);
        clearOutForm();
      },
    });
  };

  let isLoading = isPushingNewPostData || isFileUploading;
  let error;
  if (pushError) {
    error = pushError;
  } else {
    error = uploadError;
  }

  return (
    <form
      className="bg-white shadow-md flex-col rounded-md flex  gap-2 text-gray-900 p-2 sm:p-5"
      onSubmit={saveNewPost}
    >
      {error && <Modal message={error} closeModal={removeUploadedFile} />}
      <div className="flex gap-0 sm:gap-2">
        {!isLoading && !enteredPostData.file && (
          <UserImage className="hidden sm:block h-[50px] w-[50px]" />
        )}
        <div className="flex flex-grow gap-2 flex-wrap">
          <textarea
            ref={textInputRef}
            rows="3"
            placeholder={`What's new, ${session.user.name} ?`}
            className="flex-grow text-xs max-w-full sm:max-w-auto md:text-base focus:outline-none rounded-lg bg-gray-200 px-2 sm:px-5 py-2"
          ></textarea>
          {isLoading && <Spinner />}
          {!isLoading && enteredPostData.file && (
            <ThumbnailFile
              removeHandler={removeUploadedFile}
              file={enteredPostData.file}
              src={enteredPostData.fileUrl}
            />
          )}
        </div>
      </div>

      {!(isLoading || enteredPostData.file || error) && (
        <FileInputBox triggerAction={dispatch} newPostUpdate={forceUpdate} />
      )}
      <button
        type="submit"
        disabled={isLoading}
        className={`btn-submit ${isLoading && "disabled"}`}
      >
        Submit
      </button>
    </form>
  );
}
