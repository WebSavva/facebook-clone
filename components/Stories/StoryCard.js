import Image from "next/image";
import Spinner from "../UI/Spinner/Spinner";
import { useState } from "react";

export default function StoryCard(props) {
  const [isLoaded, setIsLoaded] = useState(false);
  const currentOpacity = `${isLoaded ? "visible" : "invisible"}`;

  let responsiveDisplay = "";
  switch (props.id) {
    case 3:
      responsiveDisplay = "hidden xs:flex";
      break;
    case 4:
      responsiveDisplay = "hidden sm:flex";
      break;
    default:
      responsiveDisplay = "flex";
      break
  }

  return (
    <div
      className={`relative ${
        responsiveDisplay
      }  justify-center rounded-md items-center transition-normalized md:shadow-md rounded-full md:rounded-md w-[70px] h-[70px] md:w-[130px] md:h-[200px] md:bg-white cursor-pointer transition-transform duration-200 md:hover:-translate-y-0.5`}
    >
      {!isLoaded && <Spinner />}
      <Image
        onLoad={() => setTimeout(setIsLoaded(true), 5e2)}
        className={`z-10  ${currentOpacity} absolute top-0 left-0 rounded-full md:rounded-md transition duration-1500 filter brightness-75 md:hover:brightness-110`}
        layout="fill"
        objectFit="cover"
        src={props.src}
        alt="Story Image"
      />
      <p
        className={`text-xs ${currentOpacity} text-center z-20 text-white absolute bottom-3 transition-all w-full font-semibold hidden md:block`}
      >
        User Name 1
      </p>
    </div>
  );
}
