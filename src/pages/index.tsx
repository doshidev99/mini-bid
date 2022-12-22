import { Layout, Typography } from "antd";
import { useEffect } from "react";
import { useAccount } from "wagmi";
import AppListPlayer from "../components/AppListPlayer";
import AppFormBid from "../components/Form/AppFormBid";

const App = () => {
  const { address } = useAccount();

  if (!address)
    return (
      <div className="text-center">
        <Typography.Text className="font-game ">
          Please connect your wallet to continue
        </Typography.Text>
      </div>
    );

  return (
    <>
      <div
        style={{
          paddingTop: 100,
        }}
      >
        <AppFormBid />
      </div>

      <div
        style={{
          padding: "0 50px",
        }}
      >
        <AppListPlayer />
      </div>
    </>
  );
};

export default App;
