import PlayArrow from "@mui/icons-material/PlayArrow";
import { Chip, IconButton, Stack, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { useTonejs } from "./hooks/useToneService";
import StopRoundedIcon from "@mui/icons-material/StopRounded";

type Props = {};

const artistsObj = {
  bob_marley: {
    musicName: "Is This Love",
    artist: "Bob Marley",
    voices: [
      { name: "Kanye West", id: "kanye" },
      { name: "Shawn Mendes", id: "mendes" },
    ],
  },
  chase: {
    musicName: "Baddadan",
    artist: "Chase & Status",
    voices: [
      { name: "Trump", id: "trump" },
      { name: "Cartman", id: "cartman" },
      { name: "Biden", id: "biden" },
    ],
  },
  gangsta: {
    musicName: "Gangsta's Paradise",
    artist: "Coolio",
    voices: [
      { name: "Cartman", id: "cartman" },
      { name: "Mario", id: "mario" },
      { name: "Ed Sheeran", id: "ed_sheeran" },
    ],
  },
  miley: {
    musicName: "Flowers",
    artist: "Miley Cyrus",
    voices: [
      { name: "Biden", id: "biden" },
      { name: "Billie Ellish", id: "billie_ellish" },
      { name: "Cartman", id: "cartman" },
      { name: "Trump", id: "trump" },
    ],
  },
};

const VoxPlayer = (props: Props) => {
  const [songId, setSongId] = useState("");
  const [voice, setVoice] = useState("");
  const [started, setStarted] = useState(false);
  const { playAudio, initializeTone, isTonePlaying, stopPlayer } = useTonejs();

  useEffect(() => {
    if (songId && voice) {
      const _instrUrl = `https://firebasestorage.googleapis.com/v0/b/dev-numix.appspot.com/o/vox_player%2F${songId}%2Fno_vocals.mp3?alt=media`;
      const _audioUrl = `https://firebasestorage.googleapis.com/v0/b/dev-numix.appspot.com/o/vox_player%2F${songId}%2F${voice}.mp3?alt=media`;
      playAudio(_instrUrl, _audioUrl);
    }
  }, [voice]);

  useEffect(() => {
    if (songId) {
      const _instrUrl = `https://firebasestorage.googleapis.com/v0/b/dev-numix.appspot.com/o/vox_player%2F${songId}%2Fno_vocals.mp3?alt=media`;
      const firstVoice = (artistsObj as any)[songId].voices[0].id;
      const _audioUrl = `https://firebasestorage.googleapis.com/v0/b/dev-numix.appspot.com/o/vox_player%2F${songId}%2F${firstVoice}.mp3?alt=media`;
      playAudio(_instrUrl, _audioUrl, true);
      setVoice("");
    }
  }, [songId]);

  return (
    <Stack>
      {/* <Box display={"flex"} gap={2} alignItems="center">
        <IconButton
          disabled={started}
          onClick={async () => {
            if (!started) {
              await initializeTone();
              setStarted(true);
            }
            const _audioUrl = `https://firebasestorage.googleapis.com/v0/b/dev-numix.appspot.com/o/vox_player%2F${artist}_vocals.mp3?alt=media`;
            // playAudio(_audioUrl);
          }}
        >
          <PlayArrow />
        </IconButton>
        <Chip
          label="Biden"
          clickable
          onClick={() => setVoice("biden")}
        //   variant={artist === "biden" ? "outlined" : "filled"}
        />
        <Chip
          label="Trump"
          clickable
          onClick={() => setArtist("trump")}
        //   variant={artist === "trump" ? "outlined" : "filled"}
        />
        <Chip
          label="EricCartman"
          clickable
          onClick={() => setArtist("cartman")}
        //   variant={artist === "cartman" ? "outlined" : "filled"}
        />
      </Box> */}

      {Object.entries(artistsObj).map(([artistKey, artistValue]) => (
        <Box key={artistKey} display="flex" alignItems={"center"} gap={2}>
          <Typography>{artistValue.musicName}</Typography>
          <IconButton
            onClick={async () => {
              if (!started) {
                await initializeTone();
                setStarted(true);
              }
              if (isTonePlaying) {
                stopPlayer();
              }
              setSongId(artistKey);
            }}
          >
            {isTonePlaying && artistKey === songId ? (
              <StopRoundedIcon />
            ) : (
              <PlayArrow />
            )}
          </IconButton>
          {songId === artistKey &&
            artistValue.voices.map((v, i) => (
              <Chip
                key={v.name}
                label={v.name}
                variant={
                  voice === v.id
                    ? "outlined"
                    : !voice && i === 0
                    ? "outlined"
                    : "filled"
                }
                clickable
                onClick={() => {
                  setVoice(v.id);
                }}
              />
            ))}
        </Box>
      ))}
    </Stack>
  );
};

export default VoxPlayer;
