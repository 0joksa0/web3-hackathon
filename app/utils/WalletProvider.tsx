// WalletContext.tsx
import { createContext, useContext, useState, useEffect } from "react";
import { connectWallet } from "~/utils/wallet";

declare global {
    interface Window {
        ethereum?: any;
    }
}

const WalletCtx = createContext<{
    address: string | null;
    connect: () => Promise<void>;
}>({ address: null, connect: async () => { } });

export function WalletProvider({ children }: { children: React.ReactNode }) {
    const [address, setAddress] = useState<string | null>(null);

    useEffect(() => {
        const cached = localStorage.getItem("wallet");
        if (cached) setAddress(cached);
        else if (window.ethereum?.selectedAddress) {
            setAddress(window.ethereum.selectedAddress);
        }
    }, []);
    /* ②  slušaj MetaMask evente */
    useEffect(() => {
        if (!window.ethereum) return;

        function handleAccounts(accts: string[]) {
            if (accts.length === 0) {
                // korisnik nas je diskonektovao u MetaMask-u
                setAddress(null);
                localStorage.removeItem("wallet");
            } else {
                setAddress(accts[0]);
                localStorage.setItem("wallet", accts[0]);
            }
        }

        window.ethereum.on("accountsChanged", handleAccounts);
        window.ethereum.on("disconnect", () => handleAccounts([])); // sigurnost

        return () => {
            window.ethereum.removeListener("accountsChanged", handleAccounts);
        };
    }, []);


    async function connect() {
        const { address } = await connectWallet();
        setAddress(address);
        localStorage.setItem("wallet", address);
    }
    function disconnect() {
        setAddress(null);
        localStorage.removeItem("wallet");
    }

    return (
        <WalletCtx.Provider value={{ address, connect }}>
            {children}
        </WalletCtx.Provider>
    );
}

export const useWallet = () => useContext(WalletCtx);

