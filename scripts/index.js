import {
  Account,
  ec,
  json,
  stark,
  RpcProvider,
  hash,
  CallData,
} from "starknet";

const main = () => {
  const privateKeyAX = stark.randomAddress();
  const starkKeyPubAX = ec.starkCurve.getStarkKey(privateKeyAX);

  console.log("AX_ACCOUNT_PRIVATE_KEY=", privateKeyAX);
  console.log("AX_ACCOUNT_PUBLIC_KEY=", starkKeyPubAX);
};

main();
