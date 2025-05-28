const hre = require("hardhat");
/** ASCII VIN  →  bytes17 (0x + 34 hex) */
const {Web3} = require('web3');
const web3 = new Web3();

function vinToBytes17(vin ) {
  if (vin.length > 17) throw new Error("VIN > 17 characters");

  // 1. UTF-8 → hex (bez 0x)
  const raw = web3.utils.utf8ToHex(vin).slice(2);

  // 2. dopuni nulama do 34 hex-znaka
  const padded = raw.padEnd(34, "0");

  return "0x" + padded;                       // bytes17 is ready
}
async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with:", deployer.address);

  const VP = await hre.ethers.getContractFactory("VehiclePassport");
  const vp = await VP.deploy();        // constructor nema argumenata
  await vp.waitForDeployment();

  console.log("VehiclePassport deployed to:", await vp.getAddress());

  // ▶︎ opcionalno – grant prve role odmah
  const MECH_ROLE = hre.ethers.keccak256(hre.ethers.toUtf8Bytes("MECHANIC_ROLE"));
   const POLI_ROLE = hre.ethers.keccak256(hre.ethers.toUtf8Bytes("POLICE_ROLE"));
  //
  await vp.grantRole(MECH_ROLE, "0xC71386e73e4C0A4E54D85376BC2Ba455537e2d5E");
   await vp.grantRole(POLI_ROLE, "0xed199BbC85a4f037d6f152C79698496dcAEc0012");
  //
  console.log("Initial roles granted.");
const res = await vp.registerVehicle(
        vinToBytes17("VIN-test"),
        "0xF998908b7Ed5575410Ac6AC6Fa1E9e1d45c07828",
        2001, 
        10000
    )
  console.log(res);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

