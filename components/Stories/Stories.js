import { memo, useMemo } from "react";
import StoryCard from "./StoryCard";

function Stories() {
    const categories = useMemo(() => {
        return ['office', 'code', 'festival', 'shop', 'smile']
    }, [])
    const storyCards = Array.from({length: 5}, (el, i) => {
        return <StoryCard key={i} id={i} src={`https://source.unsplash.com/random/1500x1500?${categories[i]}`}/>
    })
    return (
        <div className='flex gap-1 md:gap-3 items-center justify-around sm:justify-between'>
            {storyCards}
        </div>
    )
};

export default memo(Stories);
