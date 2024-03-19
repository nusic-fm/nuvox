import PlayArrow from "@mui/icons-material/PlayArrow";
import { Chip, IconButton } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { useTonejs } from "./hooks/useToneService";

type Props = {};

const VoxPlayer = (props: Props) => {
  const [artist, setArtist] = useState("biden");
  const [started, setStarted] = useState(false);
  const { playAudio, initializeTone } = useTonejs(
    `https://firebasestorage.googleapis.com/v0/b/dev-numix.appspot.com/o/vox_player%2Finstrument.mp3?alt=media`
  );

  useEffect(() => {
    if (artist && started) {
      const _audioUrl = `https://firebasestorage.googleapis.com/v0/b/dev-numix.appspot.com/o/vox_player%2F${artist}_vocals.mp3?alt=media`;
      playAudio(_audioUrl);
    }
  }, [artist]);

  return (
    <Box display={"flex"} gap={2} alignItems="center">
      <IconButton
        disabled={started}
        onClick={async () => {
          if (!started) {
            await initializeTone();
            setStarted(true);
          }
          const _audioUrl = `https://firebasestorage.googleapis.com/v0/b/dev-numix.appspot.com/o/vox_player%2F${artist}_vocals.mp3?alt=media`;
          playAudio(_audioUrl);
        }}
      >
        <PlayArrow />
      </IconButton>
      <Chip
        label="Biden"
        clickable
        onClick={() => setArtist("biden")}
        variant={artist === "biden" ? "outlined" : "filled"}
      />
      <Chip
        label="Trump"
        clickable
        onClick={() => setArtist("trump")}
        variant={artist === "trump" ? "outlined" : "filled"}
      />
      <Chip
        label="EricCartman"
        clickable
        onClick={() => setArtist("cartman")}
        variant={artist === "cartman" ? "outlined" : "filled"}
      />
    </Box>
  );
};

export default VoxPlayer;
