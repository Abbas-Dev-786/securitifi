import { useEffect, useState } from "react";
import { useAppKitBalance, useAppKitAccount } from "@reown/appkit/react";

const useBalance = () => {
  const { fetchBalance } = useAppKitBalance();
  const [balance, setBalance] = useState<any>();
  const { isConnected } = useAppKitAccount();

  useEffect(() => {
    if (isConnected) {
      fetchBalance().then((x) => setBalance(x.data));
    }
  }, [isConnected, fetchBalance]);

  return balance;
};

export default useBalance;
