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

const ACCOUNT_CLASS_HASH =
  "0x00e2eb8f5672af4e6a4e8a8f1b44989685e668489b0a25437733756c5a34a1d6";
const ETH_ADDRESS =
  "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7";
const FUNDER_ADDRESS =
  "0x055be462e718c4166d656d11f89e341115b8bc82389c3762a10eade04fcb225d";
const FUNDER_PRIV_KEY =
  "0x077e56c6dc32d40a67f6f7e6625c8dc5e570abe49c0a24e9202e4ae906abcc07";

const provider = new RpcProvider({ nodeUrl: "http://localhost:9944" });

const getETHContract = (account) => {
  const contractArtifact = JSON.parse(
    fs.readFileSync("./artifacts/erc20.json").toString()
  );
  return new Contract(JSON.parse(contractArtifact.abi), ETH_ADDRESS, account);
};

const deployAccount = async (publicKey, privateKey) => {
  try {
    const constructorCalldata = CallData.compile({
      publicKey: publicKey,
    });

    const contractAddress = hash.calculateContractAddressFromHash(
      publicKey,
      ACCOUNT_CLASS_HASH,
      constructorCalldata,
      0
    );
    console.log("Calculated account address:", contractAddress);

    console.log("Funding account with ETH...");
    const funderAccount = new Account(
      provider,
      FUNDER_ADDRESS,
      FUNDER_PRIV_KEY
    );
    const ethContract = getETHContract(funderAccount);

    const transferAmount = 10n ** 18n; // 1 ETH
    const transferResult = await ethContract.transfer(
      contractAddress,
      uint256.bnToUint256(transferAmount)
    );

    const transferReceipt = await provider.waitForTransaction(
      transferResult.transaction_hash
    );
    console.log("ETH transferred ✅");
    console.log("Transfer receipt:", transferReceipt);

    console.log("Deploying account...");
    const account = new Account(provider, contractAddress, privateKey);

    const { transaction_hash, contract_address } = await account.deployAccount({
      classHash: ACCOUNT_CLASS_HASH,
      constructorCalldata: constructorCalldata,
      addressSalt: publicKey,
    });

    console.log("Account deployed successfully ✅");
    console.log("Transaction hash:", transaction_hash);
    console.log("Account address:", contract_address);

    return {
      address: contract_address,
      transactionHash: transaction_hash,
    };
  } catch (error) {
    console.error("Error deploying account:", error);
    throw error;
  }
};

const main = async () => {
  const publicKey = process.argv[2];
  if (!publicKey) {
    console.error("Please provide a public key as an argument");
    process.exit(1);
  }

  try {
    await deployAccount(publicKey, process.argv[3] || FUNDER_PRIV_KEY);
  } catch (error) {
    console.error("Failed to deploy account:", error);
    process.exit(1);
  }
};

main();
