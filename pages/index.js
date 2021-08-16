import Head from 'next/head';
import Header from '../components/Header/Header';
import { getSession, useSession } from 'next-auth/client';
import facebookLogo from './../public/fb-logo.png'
import Sidebar from '../components/Sidebar/Sidebar';
import Feed from './../components/Feed/Feed';
import DBInterface from './../database/DBInterface';
import sha1 from 'hash.js/lib/hash/sha/1';
import WidgetBar from '../components/WidgetBar/WindgetBar';
import fs from 'fs';
import serverConfig from './../database/server_config.json';

export default function Home(props) {
  return (
    <>
      <Head>
        <title>Facebook</title>
        <link rel="icon" 
      type="image/png" 
      href={facebookLogo.src}/>
      </Head>

    {/* HEADER*/}
    <Header/>
      <main className='flex bg-gray-100 gap-5 lg:justify-between py-5 overflow-y-hidden main items-start'>
        <Sidebar/>
        <Feed userHash={props.userHash}/>
        <WidgetBar/>
      </main>

    </>
  )
}

export async function getServerSideProps(ctx) {
  const session = await getSession(ctx);

  if (!session) {
    return {
      redirect: {
        destination: '/auth/signin',
        permanent: false
      }
    }
  }


  let isDBCreated;
  //checking existenc of db
  try {

    isDBcreated = await new Promise((res, rej) => fs.access(serverConfig.dbPath, (err) => {
      if (!err) {
        rej(new Error());
        return;
      }
      res(true);
    }));

  } catch  {
    isDBCreated = false;
  }

  if (!isDBCreated) {
    while (!isDBCreated) {
      isDBCreated = await DBInterface.initializeDB();
    }
  }

  const db = new DBInterface();
  const emailHash = sha1().update(session.user.email).digest('hex');
  try {
    const doesUserExist = await db.checkUserExistence(emailHash);

    if (!doesUserExist) await db.createNewUser(emailHash)

  } catch (err) {
    console.log(err.message);
  } finally {
    db.shutDown();
  }

  return {
    props: {
      session,
      userHash: emailHash
    }
  }
};
