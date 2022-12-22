import { multicall } from "@wagmi/core";
import { useRouter } from "next/router";
import { useToggle } from "./../hooks/useToggle";
import { useStorageData } from "./../store/useStorageData";
import { useBidAction } from "./useBidAction";

import { useEffect } from "react";
import { useSigner } from "wagmi";
import ZKAbi from "../web3/contracts/abi/ZkBid.json";
import { useContractZkBid } from "./useContract";

export const useGetDataPlayer = () => {
  const { data } = useSigner();
  const contractInstance = useContractZkBid(data);
  const { updateDataList, updateStorageLoad } = useStorageData();

  const get = async () => {
    if (!contractInstance) return [];
    const contractInfo = {
      address: contractInstance.address,
      abi: ZKAbi,
    };
    try {
      const totalUserBidding = await contractInstance?.totalUsersBidding();
      const contracts = [...new Array(+totalUserBidding).keys()].map((i) => ({
        ...contractInfo,
        functionName: "getUserByIndex",
        args: [+i],
      }));

      const _dataUserByIndex = await multicall({
        contracts: contracts,
      });

      const _dataUser = await Promise.all([
        multicall({
          contracts: _dataUserByIndex.map((user) => ({
            ...contractInfo,
            functionName: "bidHashes",
            args: [user],
          })),
        }),
        multicall({
          contracts: _dataUserByIndex.map((user) => ({
            ...contractInfo,
            functionName: "bidValues",
            args: [user],
          })),
        }),
      ]);

      const _data = [...new Array(+totalUserBidding).keys()].map((i) => {
        return {
          key: i + 1,
          address: _dataUserByIndex[i],
          bidHash: _dataUser[0][i],
          bidValue: _dataUser[1][i],
          tags: [Number(_dataUser[1][i]) > 0 ? "Ready" : "Not Ready"],
        };
      });
      updateDataList(_data as any);
      return _data;
    } catch (er: any) {
      console.log(er?.reason);
    }
  };

  return get;
};

export const useGetPlayers = () => {
  const { isReady } = useRouter();
  const { data } = useSigner();

  const contractInstance = useContractZkBid(data);
  const [loading, setLoading] = useToggle(false);
  const { getTotalRevealed } = useBidAction();

  const get = useGetDataPlayer();
  useEffect(() => {
    let idTimeout: any;
    if (isReady && contractInstance) {
      setLoading();
      idTimeout = setInterval(() => {
        Promise.all([get(), getTotalRevealed()]).finally(setLoading);
      }, 15000);
    }
    return () => {
      clearInterval(idTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { loading };
};
