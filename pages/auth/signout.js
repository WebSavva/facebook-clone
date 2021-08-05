import { getProviders, signOut } from "next-auth/client";
import { useRouter } from "next/router";
import WelcomePageWindow from "../../components/WelcomPageWindow/WelcomePageWindow";

export default function SignIn({ providers }) {
  const facebookProvider = providers.facebook;
  const router = useRouter();

  const signOutHandler = () => {
    signOut({ callbackUrl: 'http://localhost:3000/' });
 
  };

  return <WelcomePageWindow clickHandler={signOutHandler} message={'Do you really want to sign out from you profile ?'} nextAction={'Out'}/>
}

// This is the recommended way for Next.js 9.3 or newer
export async function getServerSideProps(context) {
  const providers = await getProviders();
  return {
    props: { providers },
  };
}
