import { memo, useMemo } from "react";
import StoryCard from "./StoryCard";

function Stories() {
  const collections = useMemo(() => {
    return ["235549", "4773283", "362271", "209138", "2411320"];
  }, []);
  const storyCards = Array.from({ length: 5 }, (el, i) => {
    return (
      <StoryCard
        key={i}
        id={i}
        src={`https://source.unsplash.com/collection/${collections[i]}/`}
      />
    );
  });
  return (
    <div className=" gap-1 hidden sm:flex md:gap-3 items-center justify-around sm:justify-between">
      {storyCards}
    </div>
  );
}

export default memo(Stories);
