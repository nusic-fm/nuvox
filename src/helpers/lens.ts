import { LensClient, development } from "@lens-protocol/client";
import { Wallet } from "ethers";

export interface IStorageProvider {
  getItem(key: string): Promise<string | null> | string | null;
  setItem(
    key: string,
    value: string
  ): Promise<string> | Promise<void> | void | string;
  removeItem(key: string): Promise<string> | Promise<void> | void;
}

class LocalStorageProvider implements IStorageProvider {
  getItem(key: string) {
    return window.localStorage.getItem(key);
  }

  setItem(key: string, value: string) {
    window.localStorage.setItem(key, value);
  }

  removeItem(key: string) {
    window.localStorage.removeItem(key);
  }
}

const lensClientConfig = {
  environment: development,
  storage: new LocalStorageProvider(),
};

export async function getAuthenticatedClientFromEthersWallet(
  wallet: Wallet
): Promise<LensClient> {
  const lensClient = new LensClient(lensClientConfig);

  const address = await wallet.getAddress();

  const { id, text } = await lensClient.authentication.generateChallenge({
    signedBy: address,
    for: "Test App",
  });
  const signature = await wallet.signMessage(text);

  await lensClient.authentication.authenticate({ id, signature });

  return lensClient;
}
