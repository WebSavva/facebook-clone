import { getProviders, signOut } from "next-auth/client";
import { useRouter } from "next/router";
import WelcomePageWindow from "../../components/WelcomPageWindow/WelcomePageWindow";
import Head from "next/head";
import { useSession } from "next-auth/client";

export default function SignOut({ providers }) {
  const facebookProvider = providers.vk;
  const router = useRouter();
  const [
    {
      user: { userId: selfId },
    },
  ] = useSession();
  const signOutHandler = () => {
    if (selfId)
      navigator.sendBeacon(
        `${window.location.origin}/api/users/status?user_id=${selfId}&online=false`
      );
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
