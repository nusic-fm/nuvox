import { createConfig, http, Config } from "wagmi";
import { polygonMumbai } from "wagmi/chains";
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
  chains: [polygonMumbai],
  transports: {
    [polygonMumbai.id]: http(),
  },
});

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
