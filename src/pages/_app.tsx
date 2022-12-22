import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import type { AppProps } from "next/app";
import NextHead from "next/head";
import * as React from "react";
import { Toaster } from "react-hot-toast";
import { WagmiConfig } from "wagmi";

import { chains, client } from "../wagmi";
// import { Network, Alchemy } from "alchemy-sdk";
// const settings = {
//   apiKey: "GZ2wfLIXvvnfyqzRDt73UeaWDshNi5Sh",
//   network: Network.MATIC_MUMBAI,
// };
// const alchemy = new Alchemy(settings);

import AppHeader from "../components/AppHeader";
import "../styles/cat.scss";
import "../styles/global.css";

function App({ Component, pageProps }: AppProps) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  // React.useEffect(() => {
  //   if (mounted) {
  //     async function get() {
  //       const latestBlock = await alchemy.core.getBlockNumber();
  //       console.log({ latestBlock });
  //       alchemy.ws.on()
  //     }
  //     get();
  //   }
  // }, [mounted]);

  return (
    <WagmiConfig client={client}>
      <RainbowKitProvider chains={chains}>
        <NextHead>
          <title>APT Auction</title>
        </NextHead>
        {mounted && (
          <>
            <AppHeader />
            <Component {...pageProps} />
          </>
        )}
        <Toaster position="top-right" />
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default App;
