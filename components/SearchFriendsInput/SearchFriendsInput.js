import { useRef, useState } from "react";
import OnlineCheckbox from "../SearchFriendsInput/OnlineCheckbox";

function SearchFriendsInput({ fetchHandler, isFetching, onChangeHandler }) {
  const inputRef = useRef(null);
  const [isOnlineFiltered, setIsOnlineFiltered] = useState(false);
  const submitHandler = (e) => {
      e.preventDefault();
      const enteredName = inputRef.current.value;
      

      fetchHandler( (!enteredName ? '.+' : enteredName), isOnlineFiltered);
      inputRef.current.value = '';
  };

  return (
    <form className="flex" onSubmit={submitHandler}>
      <input
        onChange={onChangeHandler}
        ref={inputRef}
        type="text"
        placeholder="Enter name of the person"
        className=" p-2 text-xs sm:text-sm md:text-base :p-3 bg-white rounded-tl-md focus:font-semibold rounded-bl-md focus:placeholder-blue-400 focus:px-7 text-gray-500 focus:outline-none  flex-grow transition-all outline-none"
      />
      <button
        type="submit"
        disabled={isFetching}
        className={`rounded-tr-md rounded-br-md ${isFetching ?' bg-gray-300 text-gray-500' : 'bg-blue-400 text-white cursor-pointer'} sm:text-sm md:text-base  font semibold py-2 px-3 transition-all md:hover:opacity-75`}
      >
        Search
      </button>
      <OnlineCheckbox isOn={isOnlineFiltered} toggleCheckbox={() => setIsOnlineFiltered((prev) => !prev)}/>
    </form>
  );
}

export default SearchFriendsInput;
