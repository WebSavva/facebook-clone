import Head from "next/head";
import { getSession, useSession } from "next-auth/client";
import Feed from "./../components/Feed/Feed";
import DBInterface from "./../database/DBInterface";
import serverConfig from "./../database/server_config.json";
import WidgetBar from './../components/WidgetBar/WidgetBar';
import hashify from "../utilities/hash-function";
import Layout from "../components/UI/Layout/Layout";

export default function Home(props) {
  return (
    <Layout>
      <Head>
        <title>Homepage</title>
      </Head>
      <Feed />
      <WidgetBar/>
    </Layout>
  );
}

export async function getServerSideProps(ctx) {
  const session = await getSession(ctx);

  if (!session) {
    return {
      redirect: {
        destination: "/auth/signin",
        permanent: false,
      },
    };
  }

  const db = await DBInterface.getDB();
  const emailHash = hashify(session.user.email);
  const avatarId = hashify(session.user.image);

  try {
    const currentUser = await db.createNewUser({
      userName: session.user.name,
      userId: emailHash,
      avatarId,
      avatarUrl: session.user.image,
    });
    session.user.image = currentUser.avatarUrl;
    session.user.userId = currentUser.userId;
    session.user.registrationDate = new Date(
      currentUser.registrationDate
    ).toISOString();
  } catch (err) {
    console.log(err.message);
  } finally {
    db.close();
  }

  return {
    props: {
      session,
    },
  };
}
