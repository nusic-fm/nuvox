import { Typography } from "@mui/material";
import { Stack } from "@mui/system";
import axios from "axios";
import { useState } from "react";
import Uploader from "./components/Uploader";

type Props = {};

function DecodeHash({}: Props) {
  const [txHash, setTxHash] = useState<string>();
  const onDropDecodeAudio = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length) {
      const formData = new FormData();
      formData.append("audio", acceptedFiles[0]);
      const res = await axios.post(
        `${import.meta.env.VITE_AUDIO_ANALYSER_PY}/decode-hash`,
        formData
      );
      const _txHash = res.data;
      setTxHash(_txHash);
    }
  };

  return (
    <Stack gap={2} alignItems="center" p={4}>
      <Uploader
        onDrop={onDropDecodeAudio}
        initializeTone={() => {}}
        playAudio={() => {}}
        vid=""
      />
      {txHash && (
        <Typography
          component={"a"}
          href={`https://mumbai.polygonscan.com/tx/${txHash}`}
          sx={{ textDecoration: "underline" }}
          target="_blank"
        >
          {`https://mumbai.polygonscan.com/tx/${txHash}`}
        </Typography>
      )}
    </Stack>
  );
}

export default DecodeHash;
