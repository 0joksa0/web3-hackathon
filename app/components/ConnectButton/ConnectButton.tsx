import Jazzicon from "@metamask/jazzicon";  
import { useEffect, useRef } from "react";
import { useWallet } from "~/utils/WalletProvider";

export default function ConnectButton({ className = "" }: { className?: string }) {
  const { address, connect } = useWallet();
  const avatarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (address && avatarRef.current) {
      const seed = parseInt(address.slice(2, 10), 16);
      avatarRef.current.innerHTML = "";         // clear
      avatarRef.current.appendChild(Jazzicon(16, seed));
    }
  }, [address]);

  return (
    <button
      onClick={connect}
      className={`
        relative inline-flex items-center justify-center gap-2 text-center
        rounded-[2rem] px-5 py-2
        font-semibold 
        transition
        hover:scale-[1.03]
        ${address
          ? "bg-black text-white border border-cyan-400/30 hover:shadow-[0_0_8px_#00e0ff66]"
          : "text-white shadow-lg"
        }
        ${className}
      `}
    >
      {address && (
        <span
          ref={avatarRef}
          className="w-4 h-4 rounded-full overflow-hidden shrink-0"
        />
      )}

      {address ? `${address.slice(0, 6)}…${address.slice(-4)}` : "Connect Wallet"}
    </button>
  );
}

