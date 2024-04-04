import { isRelaySuccess } from "@lens-protocol/client";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useAccount, useConnect, useSignMessage } from "wagmi";
import { injected } from "wagmi/connectors";
import { lensClient } from "../config";

type Props = {};

const LoginModal = (props: Props) => {
  const { connect } = useConnect();
  const { signMessage } = useSignMessage();

  const { address } = useAccount();
  const [handles, setHandles] = useState<{ name: string; id: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [showConnect, setShowConnect] = useState(true);

  const checkHandlesByAddress = async (_address: string) => {
    setLoading(true);
    const isAuth = await lensClient.authentication.isAuthenticated();
    if (isAuth) {
      setShowConnect(false);
      return;
    }
    const allOwnedProfiles = await lensClient.profile.fetchAll({
      where: {
        ownedBy: [_address],
      },
    });
    const _handles = allOwnedProfiles.items
      .map((item) => ({ name: item.handle?.localName || "", id: item.id }))
      .map((x) => x);
    setHandles(_handles);
    setLoading(false);
  };

  const onCreateNewHandle = async (_address: string) => {
    const profileCreateResult = await lensClient.wallet.createProfileWithHandle(
      {
        handle: "testlenshandle",
        to: _address,
      }
    );
    if (!isRelaySuccess(profileCreateResult)) {
      console.log(`Something went wrong`, profileCreateResult);
      alert("Failed");
      return;
    }
    console.log(`Waiting for the transaction to be indexed...`);
    await lensClient.transaction.waitUntilComplete({
      forTxId: profileCreateResult.txId,
    });
    checkHandlesByAddress(_address);
  };

  const onChipSelection = async (_address: string, profileId: string) => {
    const { id, text } = await lensClient.authentication.generateChallenge({
      signedBy: _address, // e.g "0xdfd7D26fd33473F475b57556118F8251464a24eb"
      for: profileId, // e.g "0x01"
    });
    const signature: string = await new Promise((res) =>
      signMessage(
        { message: text },
        {
          onSuccess: (data) => {
            res(data);
          },
        }
      )
    );
    await lensClient.authentication.authenticate({
      id, // returned from authentication.generateChallenge
      signature,
    });
    setShowConnect(false);
  };

  useEffect(() => {
    if (address) {
      checkHandlesByAddress(address);
    }
  }, [address]);

  return (
    <Dialog open={showConnect} fullWidth>
      <DialogTitle>Welcome</DialogTitle>
      {loading && <LinearProgress />}
      <DialogContent>
        {!address && (
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => {
              connect({ connector: injected() });
              // connectWallet();
            }}
          >
            Connect your wallet
          </Button>
        )}
        {address && (
          <Stack>
            <Box display={"flex"} gap={2}>
              <Typography>Choose your Lens Profile</Typography>
              <Button
                size="small"
                variant="contained"
                onClick={() => onCreateNewHandle(address)}
              >
                Create New
              </Button>
            </Box>
            <Box display={"flex"} gap={2} my={2} flexWrap="wrap">
              {handles.map((handle) => (
                <Chip
                  label={handle.name}
                  key={handle.id}
                  variant="outlined"
                  clickable
                  onClick={() => onChipSelection(address, handle.id)}
                />
              ))}
              {!handles.length && !loading && (
                <Typography>No Handles found for {address} wallet</Typography>
              )}
            </Box>
          </Stack>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
