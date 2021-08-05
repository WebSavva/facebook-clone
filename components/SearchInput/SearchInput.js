import {SearchIcon} from '@heroicons/react/outline';

export default function SearchInput() {
    return (
        <div className='ml-2 items-center rounded-full bg-gray-100 p-2 hidden sm:flex'>
            <SearchIcon className='h-3 sm:h-5 md:h-5 text-gray-400'/>
            <input  type='text' className=' bg-transparent  items-center w-10 focus:w-auto lg:w-auto placeholder-transparent xl:placeholder-gray-300 text-sm ml-2 focus:outline-none' placeholder='Search Facebook'/>
        </div>
    )
}



