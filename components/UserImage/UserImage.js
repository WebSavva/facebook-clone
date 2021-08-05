import {Image as MediaImage} from 'reactjs-media';
import { useSession } from 'next-auth/client';

function UserImage({className}) {
    const [{
        user: {
            image: userImgUrl
        }
    }] = useSession();
    return (
        <div className={className}>
            <MediaImage alt='User Image' src={userImgUrl} className='w-full h-full rounded-full'/>
        </div>
    )
}

export default UserImage;
