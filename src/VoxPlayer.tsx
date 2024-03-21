import PlayArrow from "@mui/icons-material/PlayArrow";
import {
  Chip,
  CircularProgress,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { useTonejs } from "./hooks/useToneService";
import PauseRounded from "@mui/icons-material/PauseRounded";

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
  smells_like_teen_spirit: {
    musicName: "Smells Like Teen Spirit",
    artist: "Nirvana",
    voices: [
      { name: "Cartman", id: "cartman" },
      { name: "Rihanna", id: "rihanna" },
    ],
  },
  only_girl_in_the_world: {
    musicName: "Only Girl In The World",
    artist: "Rihanna",
    voices: [
      { name: "Cartman", id: "cartman" },
      { name: "Freddy Mercury", id: "freddy" },
    ],
  },
  "scream_&_shout": {
    musicName: "Scream & Shout",
    artist: "Will.i.am & Britney Spears",
    voices: [
      { name: "Cartman", id: "cartman" },
      { name: "Elon Musk", id: "elonmusk" },
    ],
  },
};

const VoxPlayer = (props: Props) => {
  const [songId, setSongId] = useState("");
  const [voice, setVoice] = useState("");
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [voiceLoading, setVoiceLoading] = useState(false);
  const {
    playAudio,
    initializeTone,
    isTonePlaying,
    stopPlayer,
    pausePlayer,
    playPlayer,
  } = useTonejs();

  const onSongClick = async (_id: string) => {
    setLoading(true);
    const _instrUrl = `https://firebasestorage.googleapis.com/v0/b/dev-numix.appspot.com/o/vox_player%2F${_id}%2Fno_vocals.mp3?alt=media`;
    //   const firstVoice = (artistsObj as any)[songId].voices[0].id;
    const _audioUrl = `https://firebasestorage.googleapis.com/v0/b/dev-numix.appspot.com/o/vox_player%2F${_id}%2Fvocals.mp3?alt=media`;
    setVoice("");
    setSongId(_id);
    await playAudio(_instrUrl, _audioUrl, true);

    setLoading(false);
  };

  const onVoiceChange = async (_voiceId: string) => {
    setVoiceLoading(true);
    const _instrUrl = `https://firebasestorage.googleapis.com/v0/b/dev-numix.appspot.com/o/vox_player%2F${songId}%2Fno_vocals.mp3?alt=media`;
    const _audioUrl = `https://firebasestorage.googleapis.com/v0/b/dev-numix.appspot.com/o/vox_player%2F${songId}%2F${_voiceId}.mp3?alt=media`;
    setVoice(_voiceId);
    await playAudio(_instrUrl, _audioUrl);
    setVoiceLoading(false);
  };

  //   useEffect(() => {
  //     if (songId && voice) {
  //       const _instrUrl = `https://firebasestorage.googleapis.com/v0/b/dev-numix.appspot.com/o/vox_player%2F${songId}%2Fno_vocals.mp3?alt=media`;
  //       const _audioUrl = `https://firebasestorage.googleapis.com/v0/b/dev-numix.appspot.com/o/vox_player%2F${songId}%2F${voice}.mp3?alt=media`;
  //       playAudio(_instrUrl, _audioUrl);
  //     }
  //   }, [voice]);

  //   useEffect(() => {
  //     if (songId) {
  //       const _instrUrl = `https://firebasestorage.googleapis.com/v0/b/dev-numix.appspot.com/o/vox_player%2F${songId}%2Fno_vocals.mp3?alt=media`;
  //       //   const firstVoice = (artistsObj as any)[songId].voices[0].id;
  //       const _audioUrl = `https://firebasestorage.googleapis.com/v0/b/dev-numix.appspot.com/o/vox_player%2F${songId}%2Fvocals.mp3?alt=media`;
  //       playAudio(_instrUrl, _audioUrl, true);
  //       setVoice("");
  //     }
  //   }, [songId]);

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
            disabled={loading || voiceLoading}
            onClick={async () => {
              if (isTonePlaying && artistKey === songId) {
                pausePlayer();
              } else if (artistKey === songId) {
                playPlayer();
              } else {
                if (!started) {
                  await initializeTone();
                  setStarted(true);
                }
                if (isTonePlaying) {
                  stopPlayer();
                }
                //   setSongId(artistKey);
                onSongClick(artistKey);
              }
            }}
          >
            {loading && artistKey === songId ? (
              <CircularProgress size={"24px"} color="secondary" />
            ) : isTonePlaying && artistKey === songId ? (
              <PauseRounded />
            ) : (
              <PlayArrow />
            )}
          </IconButton>
          {songId === artistKey && !loading && (
            <Chip
              disabled={voiceLoading}
              label={artistValue.artist}
              variant={voice === "vocals" || !voice ? "outlined" : "filled"}
              clickable
              onClick={() => {
                onVoiceChange("vocals");
                // setVoice("vocals");
              }}
            />
          )}
          {songId === artistKey &&
            !loading &&
            artistValue.voices.map((v, i) => (
              <Chip
                disabled={voiceLoading}
                key={v.name}
                label={v.name}
                variant={voice === v.id ? "outlined" : "filled"}
                clickable
                onClick={() => {
                  onVoiceChange(v.id);
                  //   setVoice(v.id);
                }}
              />
            ))}
        </Box>
      ))}
    </Stack>
  );
};

export default VoxPlayer;
