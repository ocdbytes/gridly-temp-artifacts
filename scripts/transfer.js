import {
  Account,
  ec,
  json,
  stark,
  RpcProvider,
  hash,
  CallData,
  Contract,
  uint256,
} from "starknet";
import fs from "fs";

const ETH_ADDRESS =
  "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7";
const FUNDER_ADDRESS =
  "0x01d775883a0a6e5405a345f18d7639dcb54b212c362d5a99087f742fba668396";
const FUNDER_PRIV_KEY =
  "0x07b4a2263d9cc475816a03163df7efd58552f1720c8df0bd2a813663895ef022";

const provider = new RpcProvider({ nodeUrl: "http://localhost:9944" });

const getETHContract = (account) => {
  const contractArtifact = JSON.parse(
    fs.readFileSync("./artifacts/erc20.json").toString()
  );
  return new Contract(JSON.parse(contractArtifact.abi), ETH_ADDRESS, account);
};

const main = async () => {
  const funderAccount = new Account(provider, FUNDER_ADDRESS, FUNDER_PRIV_KEY);

  const ethContract = getETHContract(funderAccount);

  const addresses = JSON.parse(fs.readFileSync("./bots.json").toString());

  for (let i = 0; i < addresses.length; i++) {
    let obj = addresses[i];
    const transferAmount = 10n ** 18n; // 1 ETH
    const transferResult = await ethContract.transfer(
      obj.contract_address,
      uint256.bnToUint256(transferAmount)
    );
    const transferReceipt = await provider.waitForTransaction(
      transferResult.transaction_hash
    );
    console.log("ETH transferred ✅");
    console.log("Transfer receipt:", transferReceipt);
  }

  //   addresses.forEach(async (entry) => {
  //     const transferAmount = 10n ** 18n; // 1 ETH
  //     const transferResult = await ethContract.transfer(
  //       entry.contract_address,
  //       uint256.bnToUint256(transferAmount)
  //     );
  //     const transferReceipt = await provider.waitForTransaction(
  //       transferResult.transaction_hash
  //     );
  //     console.log("ETH transferred ✅");
  //     console.log("Transfer receipt:", transferReceipt);
  //   });
};

main();
