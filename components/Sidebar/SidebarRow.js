import UserImage from "../UserImage/UserImage"

export default function SidebarRow({Icon, title, isUserRow}) {
    return (
        <li key={title} className='flex items-center gap-2 p-3 cursor-pointer transition-all hover:bg-gray-300 rounded-md'>
            {isUserRow &&  <UserImage className='w-[25px] h-[25px]'/>}
            {Icon && <Icon className='h-6 w-6 text-blue-600'/>}
            <span className='hidden sm:flex font-semibold'>{title}</span>
        </li>
    )
}

