import { useWeb3React } from "@web3-react/core";
// import { injectedConnector } from "../utils/connectors";
import { InjectedConnector } from "@web3-react/injected-connector";

export const injectedConnector = new InjectedConnector({
  supportedChainIds: [
    // 1, // Mainet
    // 3, // Ropsten
    // 4, // Rinkeby
    // 5, // Goerli
    // 42, // Kovan
    // 137, // Polygon
    parseInt(process.env.REACT_APP_CHAIN_ID as string),
    // 1287, //Moonbase albha
    // 1285, //Moonriver
  ],
});
const useAuth = () => {
  const {} = useWeb3React();

  //   const login = useCallback(() => {
  //     activate(injectedConnector, async (error: Error) => {
  //       console.error(error);
  //       alert(`Unsupported chain, Please connect Ethereum Network to continue.`);
  //       if (error.name === "UnsupportedChainIdError") {
  //         console.log("error", error.message);
  //       } else {
  //         console.log("error", error.name || error.message);
  //       }
  //     });
  //   }, [activate]);

  return {};
};

export default useAuth;
