import { useEffect } from "react";
import Head from "next/head";
import Router from "next/router";
import NProgress from "nprogress";
import { ConfigProvider } from "antd";
import "../styles/utilities.css";
import "../styles/main.css";
import { getUserProfileListApi } from "./../services/apiServices";
import { isLoggedIn, setLocalUserInfo } from "./../services/appServices";

export default function App({ Component, pageProps }) {
    useEffect(() => {
        const handleRouteStart = () => {
            NProgress.configure({
                minimum: 0.2,
                easing: "ease",
                speed: 250,
                showSpinner: true,
                trickleRate: 0.1,
                trickleSpeed: 150,
            });
            NProgress.start();
        };
        const handleRouteDone = () => NProgress.done();

        Router.events.on("routeChangeStart", handleRouteStart);
        Router.events.on("routeChangeComplete", handleRouteDone);
        Router.events.on("routeChangeError", handleRouteDone);

        return () => {
            // Make sure to remove the event handler on unmount!
            Router.events.off("routeChangeStart", handleRouteStart);
            Router.events.off("routeChangeComplete", handleRouteDone);
            Router.events.off("routeChangeError", handleRouteDone);
        };
    }, []);

    useEffect(() => {
        if (isLoggedIn()) {
            getUserProfileList();
        }
    });

    const getUserProfileList = async () => {
        try {
            let user = await getUserProfileListApi();
            setLocalUserInfo(user);
        } catch (error) {}
    };

    return (
        <ConfigProvider
            theme={{
                token: {
                    fontFamily: "'Kanit', sans-serif",
                },
            }}
        >
            <Head>
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1.0, maximum-scale=1.0,user-scalable=0"
                />
            </Head>
            <Component {...pageProps} />
        </ConfigProvider>
    );
}
