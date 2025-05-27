// hooks/useContract.ts
import { useEffect, useState } from "react";
import vpAbi from "~/../contracts/artifacts/contracts/VehiclePassport.sol/VehiclePassport.json";
const CONTRACT_ADDR = import.meta.env.VITE_CONTRACT_ADDR as string;
const INFURA_ID     = import.meta.env.VITE_INFURA_ID     as string;

export function useContract() {
  const [web3, setWeb3]       = useState<any>();
  const [contract, setCtr]    = useState<any>();

  useEffect(() => {
    if (typeof window === "undefined") return;      // SSR guard
    (async () => {
      const { default: Web3 } = await import("web3");
      const provider =
        (window as any).ethereum ??
        new Web3.providers.HttpProvider(
          `https://sepolia.infura.io/v3/${INFURA_ID}`
        );

      const w3  = new Web3(provider);
      const ctr = new w3.eth.Contract(vpAbi.abi as any, CONTRACT_ADDR);

      setWeb3(w3);
      setCtr(ctr);
    })();
  }, []);

  return { web3, contract };
}

