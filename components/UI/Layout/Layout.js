import Head from "next/head";
import Header from "../../Header/Header";
import Sidebar from "../../Sidebar/Sidebar";
import facebookLogo from "./../../../public/fb-logo.png";
import OnlineUsersBar from "../../OnlineUsersBar/OnlineUsersBar";

export default function Layout(props) {
  return (
    <>
      <Head>
        <title>Facebook</title>
        <link rel="icon" type="image/png" href={facebookLogo.src} />
      </Head>
      <Header />
      <main className="flex flex-col-reverse sm:flex-row bg-gray-100  gap-2 sm:gap-5 lg:justify-between py-2 sm:py-5 overflow-y-hidden main sm:items-start">
        <Sidebar />
        {props.children}
        <OnlineUsersBar />
      </main>
    </>
  );
}

Layout.auth = true;
