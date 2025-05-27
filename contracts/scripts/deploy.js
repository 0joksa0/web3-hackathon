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
  // const POLI_ROLE = hre.ethers.keccak256(hre.ethers.toUtf8Bytes("POLICE_ROLE"));
  //
  await vp.grantRole(MECH_ROLE, "0xad9BcAca257c7598EeB5eb0D8749Ec501bEdc932");
  // await vp.grantRole(POLI_ROLE, "0xPoliceAddr…");
  //
  console.log("Initial roles granted.");
const res = await vp.registerVehicle(
        vinToBytes17("VIN-test"),
        "0xad9BcAca257c7598EeB5eb0D8749Ec501bEdc932",
        2001
    )
  console.log(res);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

