import { getProviders, signOut } from "next-auth/client";
import { useRouter } from "next/router";
import WelcomePageWindow from "../../components/WelcomPageWindow/WelcomePageWindow";
import Head from "next/head";

export default function SignIn({ providers }) {
  const facebookProvider = providers.facebook;
  const router = useRouter();

  const signOutHandler = () => {
    signOut({
      callbackUrl: process.env.NEXTAUTH_URL || "https://localhost:3000",
    });
  };

  return (
    <>
      <Head>
        <title>Facebook | Sign Out</title>
      </Head>
      <WelcomePageWindow
        clickHandler={signOutHandler}
        message={"Do you really want to sign out from your profile ?"}
        nextAction={"Out"}
      />
    </>
  );
}

export async function getServerSideProps(context) {
  const providers = await getProviders();
  return {
    props: { providers },
  };
}
