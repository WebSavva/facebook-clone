import fbCircleLogo from "./../../../public/fb-circle.png";
import Image from "next/image";
import Spinner from "../Spinner/Spinner";

function MainPageLoader() {
  return (
    <div className="w-full h-full min-h-screen flex items-center justify-center bg-gray-100 flex-col">
      <div className="w-[200px] h-[200px] relative animate-pulse">
        <Image src={fbCircleLogo.src} alt="Facebook logo" layout="fill" priority/>
      </div>
        <h3 className='text-3xl font-light text-gray-500 mt-3 tracking-wider'>Loading...</h3>
    </div>
  );
}

export default MainPageLoader;
