import Post from "./Post";
import Spinner from "../UI/Spinner/Spinner";
import Banner from "./../UI/Banner/Banner";

function PostList({ postsData, isLoading, ownerName, ownerAvatar }) {
  const postItems = postsData.map(({ _id, ...postData }) => {
    if (postData.postOwnerName) {
      return <Post key={_id} {...postData} />;
    } else {
      return (
        <Post
          key={_id}
          {...postData}
          postOwnerName={ownerName}
          postOwnerAvatarUrl={ownerAvatar}
        />
      );
    }
  });
  return (
    <div className="flex flex-col gap-5 mb-5">
      {!postItems.length && !isLoading && (
        <Banner text="No published posts yet!" />
      )}
      {postItems}
      {isLoading && <Spinner />}
    </div>
  );
}

export default PostList;
