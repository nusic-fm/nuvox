import PlayArrow from "@mui/icons-material/PlayArrow";
import {
  Avatar,
  Button,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  Paper,
  Popover,
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
// import Replay10RoundedIcon from "@mui/icons-material/Replay10Rounded";
// import Forward10RoundedIcon from "@mui/icons-material/Forward10Rounded";
import { useSession } from "./hooks/useSession";
import { useGlobalState } from "./main";
import { timeToSeconds } from "./helpers/audio";
import FavoriteBorderRoundedIcon from "@mui/icons-material/FavoriteBorderRounded";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import RepeatRoundedIcon from "@mui/icons-material/RepeatRounded";
import EqualizerRoundedIcon from "@mui/icons-material/EqualizerRounded";

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

const artistsObj: {
  [key: string]: {
    musicName: string;
    vid: string;
    artist: string;
    voices: { name: string; id: string }[];
    img: string;
    createdInfo: { name: string; id: string; img: string };
    sections: { name: string; start: number }[];
    bpm: number;
  };
} = {
  bob_marley: {
    musicName: "Is This Love",
    vid: "69RdQFDuYPI",
    artist: "Bob Marley",
    voices: [
      { name: "Kanye West", id: "kanye" },
      { name: "Shawn Mendes", id: "mendes" },
    ],
    img: "isthislove.jpg",
    createdInfo: { name: "Saulgoodman", id: "1", img: "1.webp" },
    sections: [
      { name: "Intro", start: 0 },
      { name: "Verse", start: 0.16 },
      { name: "Chorus", start: 0.55 },
      { name: "Bridge", start: 1.11 },
      { name: "Verse", start: 1.42 },
      { name: "Chorus", start: 2.2 },
      { name: "Bridge", start: 2.37 },
      { name: "Verse", start: 3.07 },
      { name: "Outro", start: 3.42 },
    ],
    bpm: 122,
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
    img: "baddadan.jpeg",
    createdInfo: { name: "Heisenberg", id: "2", img: "2.webp" },
    sections: [
      { name: "Intro", start: 0 },
      { name: "Verse", start: 0.22 },
      { name: "Hook", start: 0.42 },
      { name: "Verse", start: 1.04 },
      { name: "Hook", start: 1.26 },
      { name: "Verse", start: 1.48 },
      { name: "Bridge", start: 2.11 },
      { name: "Hook", start: 2.32 },
      { name: "Drop", start: 2.53 },
      { name: "Outro", start: 3.16 },
    ],
    bpm: 88,
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
    img: "gangsta.jpg",
    createdInfo: { name: "Barry Allen", id: "3", img: "3.webp" },
    sections: [
      { name: "Intro", start: 0 },
      { name: "Verse", start: 0.26 },
      { name: "Chorus", start: 1.02 },
      { name: "Verse", start: 1.26 },
      { name: "hook", start: 2.01 },
      { name: "chorus", start: 2.14 },
      { name: "verse", start: 2.38 },
      { name: "chorus", start: 3.02 },
      { name: "hook", start: 3.25 },
      { name: "outro", start: 3.5 },
    ],
    bpm: 80,
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
    img: "flowers.webp",
    createdInfo: { name: "Lorem Ipsum", id: "4", img: "4.webp" },
    sections: [
      { name: "Intro", start: 0 },
      { name: "verse", start: 0.07 },
      { name: "pre-chorus", start: 0.24 },
      { name: "chorus", start: 0.33 },
      { name: "post-chorus", start: 1.01 },
      { name: "verse", start: 1.08 },
      { name: "pre-chorus", start: 1.25 },
      { name: "chorus", start: 1.34 },
      { name: "post-chorus", start: 2.02 },
      { name: "pre-chorus", start: 2.18 },
      { name: "chorus", start: 2.27 },
      { name: "post-chorus", start: 2.59 },
      { name: "outro", start: 3.15 },
    ],
    bpm: 118,
  },
  smells_like_teen_spirit: {
    musicName: "Smells Like Teen Spirit",
    vid: "hTWKbfoikeg",
    artist: "Nirvana",
    voices: [
      { name: "Cartman", id: "cartman" },
      { name: "Rihanna", id: "rihanna" },
    ],
    img: "smells.jpeg",
    createdInfo: { name: "Ghost", id: "5", img: "5.webp" },
    sections: [
      { name: "Intro", start: 0 },
      { name: "verse", start: 0.18 },
      { name: "pre-chorus", start: 0.43 },
      { name: "chorus", start: 0.58 },
      { name: "post-chorus", start: 1.22 },
      { name: "verse", start: 1.32 },
      { name: "pre-chorus", start: 1.57 },
      { name: "chorus", start: 2.12 },
      { name: "post-chorus", start: 2.36 },
      { name: "bridge", start: 2.46 },
      { name: "verse", start: 3.02 },
      { name: "pre-chorus", start: 3.27 },
      { name: "chorus", start: 3.42 },
      { name: "outro", start: 4.06 },
    ],
    bpm: 117,
  },
  only_girl_in_the_world: {
    musicName: "Only Girl In The World",
    vid: "pa14VNsdSYM",
    artist: "Rihanna",
    voices: [
      { name: "Cartman", id: "cartman" },
      { name: "Freddy Mercury", id: "freddy" },
    ],
    img: "onlygirl.png",
    createdInfo: { name: "Test", id: "6", img: "6.webp" },
    sections: [
      { name: "Intro", start: 0 },
      { name: "verse", start: 0.31 },
      { name: "chorus", start: 1.01 },
      { name: "verse", start: 1.47 },
      { name: "chorus", start: 2.17 },
      { name: "bridge", start: 2.48 },
      { name: "chorus", start: 3.2 },
      { name: "outro", start: 3.55 },
    ],
    bpm: 126,
  },
  "scream_&_shout": {
    musicName: "Scream & Shout",
    vid: "kYtGl1dX5qI",
    artist: "Will.i.am & Britney Spears",
    voices: [
      { name: "Cartman", id: "cartman" },
      { name: "Elon Musk", id: "elonmusk" },
    ],
    img: "scream.png",
    createdInfo: { name: "Adam", id: "7", img: "7.webp" },
    sections: [
      { name: "Intro", start: 0 },
      { name: "refrain", start: 0.14 },
      { name: "pre-chorus", start: 0.29 },
      { name: "chorus", start: 0.43 },
      { name: "post-chorus", start: 1.09 },
      { name: "drop", start: 1.14 },
      { name: "verse", start: 1.27 },
      { name: "refrain", start: 1.57 },
      { name: "pre-chorus", start: 2.13 },
      { name: "chorus", start: 2.27 },
      { name: "post-chorus", start: 2.53 },
      { name: "drop", start: 2.57 },
      { name: "bridge", start: 3.11 },
      { name: "chorus", start: 3.41 },
      { name: "post-chorus", start: 4.21 },
      { name: "outro", start: 4.26 },
    ],
    bpm: 130,
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
    img: "drdre.jpeg",
    createdInfo: { name: "Saulgoodman", id: "8", img: "8.webp" },
    sections: [
      { name: "Intro", start: 0 },
      { name: "verse", start: 0.2 },
      { name: "chorus", start: 1.01 },
      { name: "verse", start: 1.22 },
      { name: "chorus", start: 2.03 },
      { name: "verse", start: 2.24 },
      { name: "chorus", start: 3.04 },
      { name: "outro", start: 3.37 },
    ],
    bpm: 93,
  },
  rhythm_is_a_dancer: {
    musicName: "Rhythm Is a Dancer",
    vid: "P-sGt5E2epc",
    artist: "SNAP!",
    voices: [
      { name: "Rihanna", id: "rihanna" },
      { name: "Cartman", id: "cartman" },
    ],
    img: "rhythm.jpg",
    createdInfo: { name: "CryptoKid", id: "3", img: "1.webp" },
    sections: [
      { name: "Intro", start: 0 },
      { name: "chorus", start: 0.31 },
      { name: "post-chorus", start: 0.46 },
      { name: "chorus", start: 1.02 },
      { name: "post-chorus", start: 1.17 },
      { name: "chorus", start: 1.33 },
      { name: "bridge", start: 1.49 },
      { name: "verse", start: 2.04 },
      { name: "chorus", start: 2.35 },
      { name: "post-chorus", start: 2.5 },
      { name: "bridge", start: 3.06 },
      { name: "outro", start: 3.21 },
    ],
    bpm: 124,
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
    img: "duality.jpg",
    createdInfo: { name: "Adam", id: "7", img: "1.webp" },
    sections: [
      { name: "Intro", start: 0 },
      { name: "verse", start: 0.31 },
      { name: "verse", start: 0.57 },
      { name: "chorus", start: 1.11 },
      { name: "verse", start: 1.28 },
      { name: "chorus", start: 1.47 },
      { name: "bridge", start: 2.17 },
      { name: "chorus", start: 2.47 },
      { name: "outro", start: 3.22 },
    ],
    bpm: 144,
  },
};

const VoxPlayer = (props: Props) => {
  // const [songId, setSongId] = useState("");
  // const [voice, setVoice] = useState("");
  const [started, setStarted] = useState(false);
  // const [loading, setLoading] = useState(false);
  const [voiceLoading, setVoiceLoading] = useState(false);
  // const {
  //   playAudio,
  //   initializeTone,
  //   isTonePlaying,
  //   stopPlayer,
  //   pausePlayer,
  //   playPlayer,
  // } = useTonejs();
  // const [songInfoObj, setSongInfoObj] = useState<{
  //   [key: string]: { title: string };
  // }>({});
  const { logs, pushLog, setPrevSeconds, setStartLog } = useSession();
  const [userName, setUserName] = useState(() => {
    return window.localStorage.getItem("KAMU_USERNAME") || "";
  });
  const {
    updateGlobalState,
    songId,
    initializeTone,
    isTonePlaying,
    stopPlayer,
    pausePlayer,
    playPlayer,
    voice,
    loading,
  } = useGlobalState();
  const [anchorEl, setAnchorEl] = useState<{
    elem: HTMLDivElement;
    idx: number;
  } | null>(null);
  const [sectionPopover, setSectionPopover] = useState<HTMLElement | null>(
    null
  );
  const [hoverSectionName, setHoverSectionName] = useState("null");

  const handleClick = (event: React.MouseEvent<HTMLDivElement>, i: number) => {
    setAnchorEl({ elem: event.currentTarget, idx: i });
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const onSongClick = async (_id: string, endTime: number) => {
    // setLoading(true);
    const _instrUrl = `https://firebasestorage.googleapis.com/v0/b/dev-numix.appspot.com/o/vox_player%2F${_id}%2Fno_vocals.mp3?alt=media`;
    //   const firstVoice = (artistsObj as any)[songId].voices[0].id;
    const _audioUrl = `https://firebasestorage.googleapis.com/v0/b/dev-numix.appspot.com/o/vox_player%2F${_id}%2Fvocals.mp3?alt=media`;
    // setVoice("");
    // setSongId(_id);
    pushLog(endTime);
    // await playAudio(_instrUrl, _audioUrl, true);
    // if (globalStateHook?.updateGlobalState) {
    await updateGlobalState({
      songImg: artistsObj[_id].img,
      songName: artistsObj[_id].musicName,
      songInstrUrl: _instrUrl,
      coverVocalsUrl: _audioUrl,
      fromStart: true,
      voices: artistsObj[_id].voices,
      songId: _id,
      bpm: artistsObj[_id].bpm,
    });
    // }
    setStartLog({
      song: artistsObj[_id].musicName,
      voice: artistsObj[_id].artist,
      start: 0,
      end: 0,
      userName,
    });
    setPrevSeconds(0);
    // setLoading(false);
  };

  const onVoiceChange = async (_voiceId: string, artistName: string) => {
    setVoiceLoading(true);
    const _instrUrl = `https://firebasestorage.googleapis.com/v0/b/dev-numix.appspot.com/o/vox_player%2F${songId}%2Fno_vocals.mp3?alt=media`;
    const _audioUrl = `https://firebasestorage.googleapis.com/v0/b/dev-numix.appspot.com/o/vox_player%2F${songId}%2F${_voiceId}.mp3?alt=media`;
    // setVoice(_voiceId);
    // await playAudio(_instrUrl, _audioUrl);
    // if (globalStateHook?.updateGlobalState) {
    await updateGlobalState({
      songImg: artistsObj[songId].img,
      songName: artistsObj[songId].musicName,
      songInstrUrl: _instrUrl,
      coverVocalsUrl: _audioUrl,
      fromStart: false,
      voices: artistsObj[songId].voices,
      songId,
      voiceId: _voiceId,
      bpm: artistsObj[songId].bpm,
    });
    // }
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
      <Stack gap={2} py={2}>
        {Object.entries(artistsObj).map(([artistKey, artistValue], i) => (
          <Box key={artistKey} display="flex" alignItems={"center"} gap={2}>
            <Box display={"flex"} alignItems="center">
              {/* <IconButton onClick={() => (Tone.Transport.seconds -= 10)}>
                {isTonePlaying && artistKey === songId && (
                  <Replay10RoundedIcon />
                )}
              </IconButton> */}

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

              {/* <IconButton onClick={() => (Tone.Transport.seconds += 10)}>
                {isTonePlaying && artistKey === songId && (
                  <Forward10RoundedIcon />
                )}
              </IconButton> */}
            </Box>
            {/* <img
              src={`https://firebasestorage.googleapis.com/v0/b/dev-numix.appspot.com/o/syncledger%2F${artistValue.img}?alt=media`}
              alt=""
              width={40}
              style={{ borderRadius: "50%" }}
            /> */}
            <Avatar
              src={`https://firebasestorage.googleapis.com/v0/b/dev-numix.appspot.com/o/lens_profiles%2F${artistValue.createdInfo.id}.webp?alt=media`}
              onMouseEnter={(e) => handleClick(e, i)}
              // onMouseLeave={handleClose}
            />
            <Popover
              open={!!anchorEl && i === anchorEl.idx}
              anchorEl={anchorEl?.elem}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              disableRestoreFocus
              // sx={{
              //   pointerEvents: "none",
              // }}
            >
              <Box p={2} onMouseLeave={handleClose}>
                <Stack gap={2}>
                  <Box display={"flex"} gap={2} width="400px">
                    <Avatar
                      sizes="10px"
                      src={`https://firebasestorage.googleapis.com/v0/b/dev-numix.appspot.com/o/lens_profiles%2F${artistValue.createdInfo.id}.webp?alt=media`}
                    />
                    <Typography variant="caption">
                      <Typography
                        component={"a"}
                        color="#8973F8"
                        sx={{ textDecoration: "underline", mr: 1 }}
                      >
                        {artistValue.createdInfo.name}
                      </Typography>
                      shared "{artistValue.musicName}" on Mon, Mar 25th 2014
                      with{" "}
                      <Typography
                        component={"a"}
                        color="#8973F8"
                        sx={{ textDecoration: "underline", mr: 1 }}
                      >
                        {artistValue.voices[0].name}
                      </Typography>
                    </Typography>
                  </Box>
                  <Box display={"flex"} gap={2} alignItems="center">
                    <IconButton size="small">
                      <FavoriteBorderRoundedIcon sx={{ fontSize: "18px" }} />
                    </IconButton>
                    <IconButton size="small">
                      <ChatBubbleOutlineOutlinedIcon
                        sx={{ fontSize: "18px" }}
                      />
                    </IconButton>
                    <IconButton size="small">
                      <RepeatRoundedIcon sx={{ fontSize: "18px" }} />
                    </IconButton>
                    <Box display={"flex"} gap={0.5} alignItems="center">
                      <IconButton size="small">
                        <EqualizerRoundedIcon sx={{ fontSize: "18px" }} />
                      </IconButton>
                      <Typography variant="caption">
                        {Math.round(Math.random() * 100)}
                      </Typography>
                    </Box>
                  </Box>
                </Stack>
              </Box>
            </Popover>
            <Stack gap={1}>
              <Box display={"flex"} alignItems="center" gap={2}>
                <Typography>{artistValue.musicName}</Typography>
                {songId === artistKey && (
                  <Chip
                    disabled={loading || voiceLoading}
                    label={artistValue.artist}
                    variant={
                      voice === "vocals" || !voice ? "outlined" : "filled"
                    }
                    clickable
                    onClick={() => {
                      onVoiceChange("vocals", artistValue.artist);
                      // setVoice("vocals");
                    }}
                  />
                )}
                {songId === artistKey &&
                  artistValue.voices.map((v, i) => (
                    <Chip
                      disabled={loading || voiceLoading}
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
              {songId === artistKey && (
                <Box
                  display={"flex"}
                  gap={0.5}
                  alignItems="center"
                  flexWrap={"wrap"}
                >
                  {artistValue.sections.map((section, i) => (
                    <Button
                      disabled={loading || voiceLoading}
                      key={section.start}
                      // p={0.85}
                      // width={100}
                      variant="contained"
                      color="info"
                      sx={{
                        minWidth: 0,
                        width: artistValue.sections[i + 1]
                          ? `${
                              (timeToSeconds(
                                artistValue.sections[i + 1].start.toString()
                              ) -
                                timeToSeconds(
                                  artistValue.sections[i].start.toString()
                                )) *
                              3
                            }px`
                          : "100px",
                        transition: "transform 0.3s ease",
                        ":hover": {
                          zIndex: 999,
                          transform: "scale(1.5)",
                          background: "#563FC8",
                        },
                      }}
                      onClick={() =>
                        (Tone.Transport.seconds = timeToSeconds(
                          section.start.toString()
                        ))
                      }
                      onMouseEnter={(e) => {
                        setSectionPopover(e.currentTarget);
                        setHoverSectionName(section.name);
                      }}
                      onMouseLeave={() => {
                        setSectionPopover(null);
                      }}
                    />
                  ))}
                </Box>
              )}
              <Popover
                open={!!sectionPopover}
                anchorEl={sectionPopover}
                onClose={() => setSectionPopover(null)}
                onMouseLeave={() => setSectionPopover(null)}
                anchorOrigin={{ vertical: 35, horizontal: "center" }}
                transformOrigin={{
                  vertical: 85,
                  horizontal: "center",
                }}
                sx={{
                  pointerEvents: "none",
                }}
                disableRestoreFocus
              >
                <Typography px={2} py={1} textTransform="capitalize">
                  {hoverSectionName}
                </Typography>
              </Popover>
            </Stack>
          </Box>
        ))}
      </Stack>
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
