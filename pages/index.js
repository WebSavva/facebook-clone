import dynamic from 'next/dynamic';


const ClientHomepage = dynamic(() => import('../components/Homepage/Homepage'), {
    ssr:false
  });

  
export default function Home(props) {
  return (
    <ClientHomepage/>
  );
}

Home.auth = true;
