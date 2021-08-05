import FileInput from "./FileInput";
import { useRef } from "react";
import {
  VideoCameraIcon,
  MusicNoteIcon,
  CameraIcon,
} from "@heroicons/react/solid";

export default function FileInputBox(props) {
  const { triggerAction, newPostUpdate } = props;
  const fileInputRef = useRef(null);

  return (
    <div className="mt-2 pt-2 flex items-center justify-around border-t-2 border-gray-100">
      <FileInput
        newPostUpdate={newPostUpdate}
        triggerAction={props.triggerAction}
        mediaType="video"
      />
      <FileInput
        newPostUpdate={newPostUpdate}
        triggerAction={props.triggerAction}
        mediaType="image"
      />
      <FileInput
        newPostUpdate={newPostUpdate}
        triggerAction={props.triggerAction}
        mediaType="audio"
      />
    </div>
  );
}
