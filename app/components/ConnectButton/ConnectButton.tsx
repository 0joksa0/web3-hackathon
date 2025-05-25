import { useState } from "react";
import { connectWallet } from "~/utils/wallet";


function ConnectButton({className = ""}){
    const [address, setAddress] = useState(null);

    const handleConnect = async () => {
        try{
        const {address} = await connectWallet();
        setAddress(address);
        
        }catch( err :any){
            alert((err as Error).message);
        }
    };




return(
  <button onClick={handleConnect} className={`base-connect-style ${className}`}>
      {address ? `${(address as String).slice(0, 6)}...` : "Connect Wallet"}
    </button>

);
}

export default ConnectButton;


