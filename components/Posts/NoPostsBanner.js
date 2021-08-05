import {EmojiSadIcon} from '@heroicons/react/outline';

function NoPostsBanner(props) {
    return (
        <div className='w-full flex flex-col items-center'>
            <EmojiSadIcon className='text-red-300 w-20 h-20'/>
            <h3 className='text-center text-gray-400 text-md capitalize'>No published posts yet !</h3>
        </div>
    )
}

export default NoPostsBanner
