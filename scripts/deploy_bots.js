import { Account, RpcProvider, json } from "starknet";
import fs from "fs";

const provider = new RpcProvider({ nodeUrl: "http://localhost:9944" });

const DEPLOYER_ADDRESS =
  "0x008a1719e7ca19f3d91e8ef50a48fc456575f645497a1d55f30e3781f786afe4";
const DEPLOYER_PRIV_KEY =
  "0x0514977443078cf1e0c36bc88b89ada9a46061a5cf728f40274caea21d76f174";
const EXECUTOR_ADDRESS =
  "0x06744cff5a28d71baa8ac32571b2943d83214acb83a49056099ad9ccf955b9cc";
const MINE_CONTRACT_ADDRESS =
  "0x6423d517eff6512bdad1bfd49cb8073574e5d02fd8cdadf9a0f385f39fd2e44";

const botSierra = json.parse(
  fs.readFileSync("./artifacts/bot_beta.sierra.json").toString("ascii")
);
const botCasm = json.parse(
  fs.readFileSync("./artifacts/bot_beta.casm.json").toString("ascii")
);

const writeArrayToJson = (array, filename) => {
  try {
    const jsonString = JSON.stringify(array, null, 2);
    fs.writeFileSync(filename, jsonString);
    console.log(`Successfully wrote array to ${filename}`);
    return true;
  } catch (error) {
    console.error("Error writing to file:", error);
    return false;
  }
};

const main = async () => {
  const account = new Account(provider, DEPLOYER_ADDRESS, DEPLOYER_PRIV_KEY);
  let nonce = provider.getNonceForAddress(DEPLOYER_ADDRESS);

  let count = 0;
  let botsArray = [];

  while (count < 500) {
    const deployResponse = await account.declareAndDeploy(
      {
        contract: botSierra,
        casm: botCasm,
        constructorCalldata: [MINE_CONTRACT_ADDRESS, EXECUTOR_ADDRESS],
      },
      {
        nonce: count,
      }
    );
    console.log("Receipt: ", deployResponse);

    console.log("Contract Deployed : ", deployResponse.deploy.contract_address);
    botsArray.push(deployResponse.deploy.contract_address);
    count += 1;
    console.log(`Deployed : ${count}/500`);
  }

  writeArrayToJson(botsArray, "./bots.json");
};

main();
