import { createConfig, http } from "wagmi";
import { bscTestnet } from "wagmi/chains";
import { LensClient, development } from "@lens-protocol/client";

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

export const lensClient = new LensClient({
  environment: development,
  storage: new LocalStorageProvider(),
});
export const config = (createConfig as any)({
  chains: [bscTestnet],
  transports: {
    [bscTestnet.id]: http(),
  },
});

// declare module "wagmi" {
//   interface Register {
//     config: typeof config;
//   }
// }
