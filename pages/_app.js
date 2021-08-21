import "../styles/globals.css";
import { Provider } from "next-auth/client";
import { useEffect } from "react";
import Layout from "../components/UI/Layout/Layout";
import { useSession, signIn } from "next-auth/client";
import PostsProvider from "../posts-store/PostsStore";
import OnlineListener from "../components/OnlineListener/OnlineListener";
import MainPageLoader from "../components/UI/MainPageLoader/MainPageLoader";
import SimpleReactLightbox from "simple-react-lightbox";

export default function App({ Component, pageProps }) {
  return (
    <Provider session={pageProps.session}>
      {Component.auth ? (
        <Auth>
          <OnlineListener>
            <PostsProvider>
              <SimpleReactLightbox>
                <Layout>
                  <Component {...pageProps} />
                </Layout>
              </SimpleReactLightbox>
            </PostsProvider>
          </OnlineListener>
        </Auth>
      ) : (
        <Component {...pageProps} />
      )}
    </Provider>
  );
}

function Auth({ children }) {
  const [session, loading] = useSession();
  const isUser = !!session?.user;
  useEffect(() => {
    if (loading) return; // Do nothing while loading
    if (!isUser) signIn(); // If not authenticated, force log in
  }, [isUser, loading]);

  if (isUser) {
    return children;
  }

  // Session is being fetched, or no user.
  // If no user, useEffect() will redirect.
  return <MainPageLoader />;
}
