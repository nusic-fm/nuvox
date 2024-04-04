import { createConfig, http, Config } from "wagmi";
import { polygonMumbai } from "wagmi/chains";
import { LensClient, development } from "@lens-protocol/client";

export const lensClient = new LensClient({
  environment: development,
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
