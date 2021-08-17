import Head from 'next/head';
import Header from "../../Header/Header";
import Sidebar from "../../Sidebar/Sidebar";
import facebookLogo from './../../../public/fb-logo.png';


function Layout(props) {
  return (
    <>
    <Head>
        <title>Facebook</title>
        <link rel="icon" 
      type="image/png" 
      href={facebookLogo.src}/>
      </Head>
      <Header />
      <main className="flex bg-gray-100 gap-5 lg:justify-between py-5 overflow-y-hidden main items-start">
        <Sidebar />
        {props.children}
      </main>
    </>
  );
};

export default Layout;
