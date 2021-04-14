import App from 'next/app';
import axios from 'axios';
import { parseCookies, destroyCookie } from 'nookies';
import baseUrl from '../utilsClient/baseUrl';
import { redirectUser } from '../utilsClient/authUser';
import Layout from '../components/Layout/Layout';
import 'semantic-ui-css/semantic.min.css';

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {};
    const { token } = parseCookies(ctx);

    // 可以反着来
    const protectedRoutes = ['/', '/t1'].includes(ctx.pathname);

    if (!token) {
      protectedRoutes && redirectUser(ctx, '/signin');
    }
    //
    else {
      if (Component.getInitialProps) {
        pageProps = await Component.getInitialProps(ctx);
      }

      try {
        const res = await axios.get(`${baseUrl}/api/auth`, {headers: {
          Authorization: token
        }})
        const { user, userFollowStats } = res.data;
        if (user) !protectedRoutes && redirectUser(ctx, "/");

        pageProps.user = user;
        pageProps.userFollowStats = userFollowStats;
      } catch (error) {
        destroyCookie(ctx, 'token');
        redirectUser(ctx, '/signin');
      }
    }

    return { pageProps };
  }

  render() {
    const { Component, pageProps } = this.props;
    return (
      <Layout {...pageProps}>
        <Component {...pageProps} />
      </Layout>
    );
  }
}

export default MyApp;
