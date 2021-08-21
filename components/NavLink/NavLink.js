import { useRouter } from 'next/router';
import Link from 'next/link';
import PropTypes from 'prop-types';

export { NavLink };


export default function NavLink({ href, children, ...props }) {
    const { pathname } = useRouter();
    const isActive = pathname === href;

    if (isActive) {
        props.className += ' active';
    }

    return (
        <Link href={href}>
            <a {...props}>
                {children}
            </a>
        </Link>
    );
}