import "../styles/globals.css";
import '../styles/bootstrap.scss'
import React, { useState } from "react";
import Head from "next/head";
import { Provider } from "react-redux"
import store from "../redux/store";
import { ThemeProvider } from '@mui/material/styles';
import { theme } from "../styles/theme";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "../utils/i18next"
import Loader from "../components/Loader/Loader";
import Header from "../components/Header/Header";
import Footer from "../components/Footer/Footer";
import { useRouter } from "next/router";
import favicon from "../public/favicon.ico"

// @ts-ignore

function MyApp({ Component, pageProps }) {
  const [notAuth, setNotAuth] = useState<boolean>()
  const router = useRouter()
  const pathNames = ["/login", "/register", "/new_password", "/reset_password", "/forgot_password", "/confirmation_sms", "/change_new_password"]

  React.useEffect(() => {
    if (pathNames.includes(router.pathname)) {
      setNotAuth(false)
    } else {
      setNotAuth(true)
    }
  }, [router.pathname])

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Портал закупок отрубей</title>
        <link rel="icon" sizes="120x120" href="/kebekIcon.ico" />
      </Head>
      <Provider store={store} >
        <ThemeProvider theme={theme}>
          <React.Suspense fallback={<Loader />}>
            <div style={{ position: "relative" }}>
              {notAuth && <Header />}
              <Component {...pageProps} />
              {notAuth && <Footer />}
            </div>
          </React.Suspense>
        </ThemeProvider>
      </Provider>
      <ToastContainer />
    </>
  )
}

export default MyApp;
