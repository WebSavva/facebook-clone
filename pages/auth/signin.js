import { getProviders, signIn } from "next-auth/client";
import WelcomePageWindow from "../../components/WelcomPageWindow/WelcomePageWindow";
import Head from "next/head";

export default function SignIn({ providers }) {
  const facebookProvider = providers.facebook;
  const signInHandler = () =>
    signIn(facebookProvider.id, {
      callbackUrl: process.env.NEXTAUTH_URL || "https://localhost:3000",
    });

  return (
    <>
      <Head>
        <title>Facebook | Sign In </title>
      </Head>
      <WelcomePageWindow
        clickHandler={signInHandler}
        message={"Welcome to Facebook!"}
        nextAction={"In"}
      />
    </>
  );
}

// This is the recommended way for Next.js 9.3 or newer
export async function getServerSideProps(context) {
  const providers = await getProviders();
  return {
    props: { providers },
  };
}
