import Web3 from "web3";

let web3;

export const connectWallet = async () => {
  if (window.ethereum) {
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      web3 = new Web3(window.ethereum);
      const accounts = await web3.eth.getAccounts();
      return {
        web3,
        address: accounts[0],
      };
    } catch (error) {
      throw new Error("User denied account access");
    }
  } else {
    throw new Error("MetaMask not detected");
  }
};

