import { useReadContract } from "wagmi";
import OracleConsumerABI from "./../abis/OracleConsumer.json";
import { ORACLE_CONSUMER_CONTRACT_ADDRESS } from "../constants";

export const useOracleConsumer = () => {
  // Read: getLatestPrice
  const latestPrice = useReadContract({
    address: ORACLE_CONSUMER_CONTRACT_ADDRESS,
    abi: OracleConsumerABI.abi,
    functionName: "getLatestPrice",
  });

  return {
    latestPrice: {
      data: latestPrice.data as bigint | undefined,
      isLoading: latestPrice.isLoading,
      error: latestPrice.error,
    },
  };
};
