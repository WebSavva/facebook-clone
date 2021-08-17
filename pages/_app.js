import "../styles/globals.css";
import { Provider } from "next-auth/client";
import Layout from "../components/UI/Layout/Layout";

function MyApp({ Component, pageProps }) {
  return (
    <Provider session={pageProps.session}>
      <Component {...pageProps} />
    </Provider>
  );
}

export default MyApp;
