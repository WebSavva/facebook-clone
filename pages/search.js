import dynamic from 'next/dynamic';

const SearchFriendsClientPage = dynamic(() => import('./../components/SearchFriendsPage/SearchFriendsPage'), {
    ssr:false
  });
  
  export default function SearchPage() {
    return <SearchFriendsClientPage/>;
  }
  
  SearchPage.auth = true;