/** @format */

import axios from "axios";
import { parseCookies, destroyCookie } from "nookies";
import Layout from "../components/Layout/Layout";
import baseUrl from "../utils/baseUrl";
import { redirectUser } from "../utils/authUser";
import "semantic-ui-css/semantic.min.css";
import "react-toastify/dist/ReactToastify.css";

function MyApp({ Component, pageProps }) {
  return (
    <Layout {...pageProps}>
      <Component {...pageProps} />
    </Layout>
  );
}

MyApp.getInitialProps = async ({ Component, ctx }) => {
  const { token } = parseCookies(ctx);
  let pageProps = {};

  const protectedRoutes = ctx.pathname === "/";

  if (!token) {
    protectedRoutes && redirectUser(ctx, "/login");
  } else {
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    try {
      const res = await axios.get(`${baseUrl}/api/auth`, {
        headers: { Authorization: token },
      });

      const { user, userFollowerStats } = res.data;

      if (user) {
        !protectedRoutes && redirectUser(ctx, "/");
      }

      pageProps.user = user;
      pageProps.userFollowerStats = userFollowerStats;
    } catch (error) {
      destroyCookie(ctx, "token");
      redirectUser(ctx, "/login");
    }
  }

  return { pageProps };
};

export default MyApp;
