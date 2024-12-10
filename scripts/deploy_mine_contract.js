import { Account, json, RpcProvider } from "starknet";
import fs from "fs";

const provider = new RpcProvider({ nodeUrl: "http://localhost:9944" });

const DEPLOYER_ADDRESS =
  "0x008a1719e7ca19f3d91e8ef50a48fc456575f645497a1d55f30e3781f786afe4";
const DEPLOYER_PRIV_KEY =
  "0x0514977443078cf1e0c36bc88b89ada9a46061a5cf728f40274caea21d76f174";

const mineSierra = json.parse(
  fs.readFileSync("./artifacts/mine.sierra.json").toString("ascii")
);
const mineCasm = json.parse(
  fs.readFileSync("./artifacts/mine.casm.json").toString("ascii")
);

const main = async () => {
  const account = new Account(provider, DEPLOYER_ADDRESS, DEPLOYER_PRIV_KEY);

  const deployResponse = await account.declareAndDeploy({
    contract: mineSierra,
    casm: mineCasm,
    constructorCalldata: ["0"],
  });
  console.log("Receipt: ", deployResponse);
  console.log("Contract Deployed : ", deployResponse.deploy.contract_address);
};

main();
