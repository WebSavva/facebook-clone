import { useRef } from "react";
import React from "react";
import config from "./../../custom_configuration/configuration.json";
import {
  VideoCameraIcon,
  MusicNoteIcon,
  CameraIcon,
} from "@heroicons/react/solid";

export default function FileInput({ mediaType, triggerAction, newPostUpdate }) {
  const fileInputRef = useRef(null);
  const onFileChange = (e) => {
    let errorMessage = "";
    if (fileInputRef.current.files.length > 1) {
      errorMessage =
        "You cannot download more than a single file per a post. Please, try again !";
    } else if (fileInputRef.current.files.length === 0) {
      erorMessage = "Choose your file to upload, please !";
    }

    const pickedFile = fileInputRef.current.files[0];
    const [pickedMediaType, pickedFormat] = pickedFile.type.split("/");
    fileInputRef.current.value = null;
    console.log(pickedMediaType, pickedFormat);
    if (pickedFile.size > config.maxFileSize) {
      errorMessage = "The file size exceeds the limit 10MB!";
    } else if (
      pickedMediaType !== mediaType ||
      !config.allowedExtensions[mediaType].includes(pickedFormat)
    ) {
      errorMessage =
        "Your file media type or extension is not supported, unfortunately. Try to upload a different file.";
    }

    if (errorMessage) {
      triggerAction({
        type: "ERROR",
        payload: {
          errorMessage,
        },
      });
      return;
    }

    triggerAction({
      type: "FILE_UPLOADING",
    });
    const fileReader = new FileReader();
    fileReader.readAsDataURL(pickedFile);

    fileReader.onload = (e) => {
      triggerAction({
        type: "SET_FILE",
        payload: {
          fileBase64: e.target.result,
          file: pickedFile,
        },
      });
      newPostUpdate();
    };

    fileReader.onerror = (e) => {
      triggerAction({
        type: "ERROR",
        payload: {
          errorMessage: "Something went wrong! Please, try again!",
        },
      });
    };
  };

  const simulateFileInputClick = (e) => {
    e.preventDefault();
    fileInputRef.current.click();
  };

  let iconStyle = "w-6 md:w-8  h-5  md:h-7 ";
  let Icon;

  switch (mediaType) {
    case "video":
      Icon = VideoCameraIcon;
      iconStyle += "text-red-400";
      break;
    case "image":
      Icon = CameraIcon;
      iconStyle += "text-green-400";
      break;
    case "audio":
      Icon = MusicNoteIcon;
      iconStyle += "text-yellow-400";
      break;
  }

  return (
    <React.Fragment>
      <button
        className={`flex items-center flex-wrap justify-center gap-1 md:gap-2 p-1 md:p-2 flex-1 cursor-pointer transiton-all md:hover:bg-gray-200 rounded-md`}
        onClick={simulateFileInputClick}
      >
        <Icon className={iconStyle} />
        <span className="text-xs sm:text-sm md:text-base font-font-semibold capitalize">{`${mediaType} file`}</span>
      </button>
      <input
        type="file"
        accept={`${mediaType}/*`}
        ref={fileInputRef}
        onChange={onFileChange}
        className="hidden"
      />
    </React.Fragment>
  );
};

