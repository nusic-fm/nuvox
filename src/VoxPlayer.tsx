import PlayArrow from "@mui/icons-material/PlayArrow";
import {
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";
import { useTonejs } from "./hooks/useToneService";
import PauseRounded from "@mui/icons-material/PauseRounded";
import * as Tone from "tone";
import Replay10RoundedIcon from "@mui/icons-material/Replay10Rounded";
import Forward10RoundedIcon from "@mui/icons-material/Forward10Rounded";
import { useSession } from "./hooks/useSession";

type Props = {};

const voiceCredits: any = {
  kanye: {
    creator: "TheRealheavy",
    rvcVersion: "v2",
  },
  mendes: {
    creator: "AI-Wheelz",
    rvcVersion: "v2",
  },
  trump: {
    creator: "week old roadkill#5734",
    rvcVersion: "v2",
    creditRequired: true,
  },
  cartman: {
    creator: "sub2rhys",
    rvcVersion: "v2",
  },
  biden: {
    creator: "week old roadkill#5734",
    rvcVersion: "v2",
    creditRequired: true,
  },
  mario: {
    creator: "marioguy",
  },
  ed_sheeran: {
    creator: "AIVERSE#5393",
  },
  billie_ellish: {
    creator: "houstpen#1053",
    rvcVersion: "v2",
    creditRequired: true,
  },
  rihanna: {
    creator: "AIVER-SE",
  },
  freddy: {
    creator: "bowlql",
    rvcVersion: "v2",
    creditRequired: false,
  },
  elonmusk: {
    creator: "anonymous12345678910",
  },
  terminator: {
    creator: "Hazza1",
  },
  arthur_morgan: {
    creator: "@737743021612859561",
  },
  homer_simpson: {
    creator: "kalomaze#2983",
    rvcVersion: "v2",
    creditRequired: false,
  },
  drake: {
    creator: "Snoop Dogg#8709 ",
    rvcVersion: "v1",
    creditRequired: false,
  },
  morgan_freeman: {
    creator: "CxronaBxndit",
    rvcVersion: "v2",
  },
};

const artistsObj = {
  bob_marley: {
    musicName: "Is This Love",
    vid: "69RdQFDuYPI",
    artist: "Bob Marley",
    voices: [
      { name: "Kanye West", id: "kanye" },
      { name: "Shawn Mendes", id: "mendes" },
    ],
  },
  chase: {
    musicName: "Baddadan",
    vid: "rkjNL4dX-U4",
    artist: "Chase & Status",
    voices: [
      { name: "Trump", id: "trump" },
      { name: "Cartman", id: "cartman" },
      { name: "Biden", id: "biden" },
    ],
  },
  gangsta: {
    musicName: "Gangsta's Paradise",
    vid: "fPO76Jlnz6c",
    artist: "Coolio",
    voices: [
      { name: "Cartman", id: "cartman" },
      { name: "Mario", id: "mario" },
      { name: "Ed Sheeran", id: "ed_sheeran" },
    ],
  },
  miley: {
    musicName: "Flowers",
    vid: "G7KNmW9a75Y",
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
    vid: "hTWKbfoikeg",
    artist: "Nirvana",
    voices: [
      { name: "Cartman", id: "cartman" },
      { name: "Rihanna", id: "rihanna" },
    ],
  },
  only_girl_in_the_world: {
    musicName: "Only Girl In The World",
    vid: "pa14VNsdSYM",
    artist: "Rihanna",
    voices: [
      { name: "Cartman", id: "cartman" },
      { name: "Freddy Mercury", id: "freddy" },
    ],
  },
  "scream_&_shout": {
    musicName: "Scream & Shout",
    vid: "kYtGl1dX5qI",
    artist: "Will.i.am & Britney Spears",
    voices: [
      { name: "Cartman", id: "cartman" },
      { name: "Elon Musk", id: "elonmusk" },
    ],
  },
  still_dre: {
    musicName: "Still D.R.E.",
    vid: "Qeem6ZVr8Ic",
    artist: "Dr. Dre",
    voices: [
      { name: "Homer Simpson", id: "homer_simpson" },
      { name: "Drake", id: "drake" },
      { name: "Morgan Freeman", id: "morgan_freeman" },
    ],
  },
  rhythm_is_a_dancer: {
    musicName: "Rhythm Is a Dancer",
    vid: "P-sGt5E2epc",
    artist: "SNAP!",
    voices: [
      { name: "Rihanna", id: "rihanna" },
      { name: "Cartman", id: "cartman" },
    ],
  },
  duality: {
    musicName: "Duality",
    vid: "B2lmOei7qfk",
    artist: "Slipknot",
    voices: [
      { name: "Cartman", id: "cartman" },
      { name: "Terminator", id: "terminator" },
      { name: "Arthur Morgan", id: "arthur_morgan" },
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
  const [songInfoObj, setSongInfoObj] = useState<{
    [key: string]: { title: string };
  }>({});
  const { logs, pushLog, setPrevSeconds, setStartLog } = useSession();
  const [userName, setUserName] = useState(() => {
    return window.localStorage.getItem("KAMU_USERNAME") || "";
  });

  const onSongClick = async (_id: string, endTime: number) => {
    setLoading(true);
    const _instrUrl = `https://firebasestorage.googleapis.com/v0/b/dev-numix.appspot.com/o/vox_player%2F${_id}%2Fno_vocals.mp3?alt=media`;
    //   const firstVoice = (artistsObj as any)[songId].voices[0].id;
    const _audioUrl = `https://firebasestorage.googleapis.com/v0/b/dev-numix.appspot.com/o/vox_player%2F${_id}%2Fvocals.mp3?alt=media`;
    setVoice("");
    setSongId(_id);
    pushLog(endTime);
    await playAudio(_instrUrl, _audioUrl, true);
    setStartLog({
      song: (artistsObj as any)[_id].musicName,
      voice: (artistsObj as any)[_id].artist,
      start: 0,
      end: 0,
      userName,
    });
    setPrevSeconds(0);
    setLoading(false);
  };

  const onVoiceChange = async (_voiceId: string, artistName: string) => {
    setVoiceLoading(true);
    const _instrUrl = `https://firebasestorage.googleapis.com/v0/b/dev-numix.appspot.com/o/vox_player%2F${songId}%2Fno_vocals.mp3?alt=media`;
    const _audioUrl = `https://firebasestorage.googleapis.com/v0/b/dev-numix.appspot.com/o/vox_player%2F${songId}%2F${_voiceId}.mp3?alt=media`;
    setVoice(_voiceId);
    await playAudio(_instrUrl, _audioUrl);
    pushLog(Math.round(Tone.Transport.seconds));
    setStartLog({
      song: (artistsObj as any)[songId].musicName,
      voice: artistName,
      start: Math.round(Tone.Transport.seconds),
      end: 0,
      userName,
    });
    setVoiceLoading(false);
  };

  // const fetchYoutubeVideoInfo = async (id: string) => {
  //   const vid = (artistsObj as any)[id]?.vid;
  //   if (vid) {
  //     const formData = new FormData();
  //     formData.append("vid", vid);
  //     const res = await axios.post(
  //       `${import.meta.env.VITE_AUDIO_ANALYSER_PY}/ytp-content`,
  //       formData
  //     );
  //     setSongInfoObj((songInfo) => ({
  //       ...songInfo,
  //       [id]: { title: res.data.title },
  //     }));
  //   }
  // };

  // useEffect(() => {
  //   if (songId && !songInfoObj[songId]) {
  //     fetchYoutubeVideoInfo(songId);
  //   }
  // }, [songId]);

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
    <Stack px={2}>
      <Box my={2}>
        <TextField
          size="small"
          label="Username"
          value={userName}
          onChange={(e) => {
            setUserName(e.target.value);
            window.localStorage.setItem("KAMU_USERNAME", e.target.value);
          }}
          color="secondary"
        />
      </Box>
      <Divider />
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
          <Box display={"flex"} alignItems="center">
            <IconButton onClick={() => (Tone.Transport.seconds -= 10)}>
              {isTonePlaying && artistKey === songId && <Replay10RoundedIcon />}
            </IconButton>

            <IconButton
              disabled={loading || voiceLoading}
              onClick={async () => {
                const endTime = Math.round(Tone.Transport.seconds);
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
                  onSongClick(artistKey, endTime);
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

            <IconButton onClick={() => (Tone.Transport.seconds += 10)}>
              {isTonePlaying && artistKey === songId && (
                <Forward10RoundedIcon />
              )}
            </IconButton>
          </Box>
          {songId === artistKey && !loading && (
            <Chip
              disabled={voiceLoading}
              label={artistValue.artist}
              variant={voice === "vocals" || !voice ? "outlined" : "filled"}
              clickable
              onClick={() => {
                onVoiceChange("vocals", artistValue.artist);
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
                  onVoiceChange(v.id, v.name);
                  //   setVoice(v.id);
                }}
              />
            ))}
        </Box>
      ))}
      {/* {songId && songInfoObj[songId]?.title && (
        <Box display={"flex"} m={4} alignItems="center" gap={2}>
          <Typography fontWeight={900}>Song</Typography>
          <Chip
            label={songInfoObj[songId].title}
            variant="outlined"
            color="warning"
            clickable
            onClick={() => window.open(`youtube`)}
          />
        </Box>
      )} */}
      {voice && (
        <Box display={"flex"} my={4} alignItems="center" gap={2}>
          <Typography fontWeight={900}>Voice Model Creator</Typography>
          <Chip
            label={voiceCredits[voice]?.creator}
            variant="outlined"
            color="warning"
          />
        </Box>
      )}
      <Divider />
      <Typography my={1}>Session Logs:</Typography>
      <TableContainer component={Paper} sx={{ width: 650 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="left">Song Name</TableCell>
              <TableCell align="right">Voice</TableCell>
              <TableCell align="right">Start Time</TableCell>
              <TableCell align="right">End Time</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {logs.map((log, i) => (
              <TableRow
                key={i}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {log.song}
                </TableCell>
                <TableCell align="right">{log.voice}</TableCell>
                <TableCell align="right">{log.start}s</TableCell>
                <TableCell align="right">{log.end}s</TableCell>
              </TableRow>
              // <Typography>
              //   {log.song} - {log.voice} - {log.start} - {log.end}
              // </Typography>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
};

export default VoxPlayer;
