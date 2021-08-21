import dynamic from 'next/dynamic';


const ClientExplore = dynamic(() => import('../components/GlobalFeed/GlobalFeed'), {
    ssr:false
  });

  
export default function ClientExplorePage(props) {
  return (
    <ClientExplore/>
  );
}

ClientExplorePage.auth = true;