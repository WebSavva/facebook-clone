import Post from "./Post";
import NoPostsBanner from "./NoPostsBanner";
import Spinner from '../UI/Spinner/Spinner';

function PostList({postsData, isLoading}) {
    const postItems = postsData.map(({id, ...postData})=> <Post key={id} {...postData}/>);
    return (
        <div className='flex flex-col gap-5 mb-5'>
            {!postItems.length && !isLoading && <NoPostsBanner/>}
            {postItems}
            {isLoading && <Spinner/>}
        </div>
    )
}

export default PostList
