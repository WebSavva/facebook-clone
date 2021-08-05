import {memo} from 'react';
import Image from 'next/image';

function OnlineUserItem({imgSrc, userName, onLoadHandler, isOnline}) {
    return (
        <div className='flex items-center gap-2'>
        <div className='relative h-[50px] w-[50px]'>
            <Image onLoad={onLoadHandler} layout='fill' src={imgSrc} alt={`${userName} Photo`}  className={`rounded-full animate-saturate`}/>
            <span className={`h-[13px] w-[13px] rounded-full absolute bottom-0 right-0  ${isOnline ? 'bg-green-400' : 'bg-red-500' }`}></span>
        </div>
            <span className='text-sm font-semibold'>{userName}</span>
        </div>
    )
}

export default memo(OnlineUserItem);
