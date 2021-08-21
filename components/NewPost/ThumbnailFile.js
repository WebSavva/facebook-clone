import audioImageSrc from './../../public/audio_default.jpg';
import Image from 'next/image';
import Lightbox from './../UI/Lightbox/Lightbox';

export default function ThumbnailFile({src, file, removeHandler}) {
    let thumbnailContent;
    let [mediaType, format] = file.type.split('/');
    
    let shortenedFileName;
    if (file.name.includes('.')) {
        shortenedFileName = file.name.split('.')[0];
    } else {
        shortenedFileName = file.name;
    }

    if (shortenedFileName.length > 10) {
        shortenedFileName = shortenedFileName.slice(0, 10) + '...';
    }

    switch (mediaType) {
        case 'video':
            thumbnailContent = (<video className='absolute top-0 left-0 w-full h-full object-cover'>
                <source src={src}/>
            </video>);
            break;
        case 'audio':
            thumbnailContent = (<Image src={audioImageSrc} alt='File Thumbnail' className='absolute z-10 top-0 left-0 filter brightness-75' layout='fill' objectFit='cover'/>);
            break;
        case 'image':
            thumbnailContent = (<Lightbox><Image src={src} alt='File Thumbnail' className='absolute z-10 top-0 left-0 filter brightness-75' layout='fill' objectFit='cover'/></Lightbox>);
    }

    return (
        <div className='w-[130px] h-[80px] relative'>
            <button onClick={removeHandler} className='z-20 text-xs flex items-center justify-between text-white absolute top-0 right-0 p-1 bg-gray-600'>&#10006;</button>
            <span className='flex items-baseline gap-[2px] z-20 absolute text-xs bottom-0 left-0 p-1 text-white bg-gray-600'>{shortenedFileName}<span className='font-semibold text-xs md:text-sm'>&#124;</span>{format.toUpperCase()}</span>
            {thumbnailContent}
        </div>
    )
}

