import { ThemeProvider } from "@mui/material/styles";
import React, { createContext, useContext, useState } from "react";
import ReactDOM from "react-dom/client";
// import App from "./App";
import "./index.css";
import theme from "./theme";
import {
  // createBrowserRouter,
  createHashRouter,
  RouterProvider,
  // Route,
  // Link,
} from "react-router-dom";
import App from "./App";
import DecodeHash from "./DecodeHash";
import VoxPlayer from "./VoxPlayer";
import SyncLedger from "./SyncLedger";
import WithNavbar from "./components/WithNavBar";
import { useTonejs } from "./hooks/useToneService";
import { Box } from "@mui/system";
import { IconButton, Stack, Typography } from "@mui/material";
import PlayArrow from "@mui/icons-material/PlayArrow";
import PauseRounded from "@mui/icons-material/PauseRounded";
import Replay10RoundedIcon from "@mui/icons-material/Replay10Rounded";
import Forward10RoundedIcon from "@mui/icons-material/Forward10Rounded";
import * as Tone from "tone";

type MusicState = {
  songId: string;
  voiceId?: string;
  songImg: string;
  songName: string;
  songInstrUrl: string;
  coverVocalsUrl: string;
  fromStart: boolean;
  voices: {
    name: string;
    id: string;
  }[];
};

const GlobalStateContext = createContext<any>(null);

// Step 2: Create a provider component
export const GlobalStateProvider = ({ children }: any) => {
  const {
    playAudio,
    initializeTone,
    isTonePlaying,
    stopPlayer,
    pausePlayer,
    playPlayer,
  } = useTonejs();
  const [songId, setSongId] = useState("");
  const [voice, setVoice] = useState("");
  const [loading, setLoading] = useState(false);
  const [songInfo, setSongInfo] = useState<MusicState>({
    songImg: "",
    songId: "",
    songName: "",
    songInstrUrl: "",
    coverVocalsUrl: "",
    fromStart: true,
    voices: [],
  });
  console.log({ songInfo });

  const updateGlobalState = async (newState: MusicState) => {
    setSongId(newState.songId);
    setVoice(newState.voiceId || "");

    setSongInfo((prevState: MusicState) => ({
      ...prevState,
      ...newState,
    }));
    if (newState.songInstrUrl) {
      setLoading(true);
      await playAudio(
        newState.songInstrUrl,
        newState.coverVocalsUrl,
        newState.fromStart
      );
      setLoading(false);
    }
  };

  return (
    <GlobalStateContext.Provider
      value={{
        songInfo,
        updateGlobalState,
        songId,
        initializeTone,
        isTonePlaying,
        stopPlayer,
        pausePlayer,
        playPlayer,
        voice,
        loading,
      }}
    >
      <Box sx={{ overflowY: "auto" }} height="90vh">
        {children}
      </Box>
      {songInfo?.songId && (
        <Box
          position={"absolute"}
          width="calc(100% - 16px)"
          height={"8vh"}
          bottom={0}
          p={2}
          px={4}
          display="flex"
          gap={4}
          alignItems="center"
          sx={{ bgcolor: "rgb(20, 20, 20)" }}
        >
          <img
            src={`https://firebasestorage.googleapis.com/v0/b/dev-numix.appspot.com/o/syncledger%2F${songInfo.songImg}?alt=media`}
            alt=""
            width={40}
            style={{ borderRadius: "50%" }}
          />
          <Stack gap={1}>
            <Typography>{songInfo.songName}</Typography>
            <Typography variant="caption">
              {songInfo.voices.filter((v) => v.id === voice).at(0)?.name ||
                "Original"}
            </Typography>
          </Stack>
          <Box alignItems={"center"}>
            <IconButton
              disabled={loading}
              onClick={() => {
                Tone.Transport.seconds -= 10;
                if (!isTonePlaying) playPlayer();
              }}
            >
              <Replay10RoundedIcon />
            </IconButton>
            <IconButton
              disabled={loading}
              onClick={async () => {
                if (isTonePlaying) {
                  pausePlayer();
                } else {
                  playPlayer();
                }
              }}
            >
              {isTonePlaying ? <PauseRounded /> : <PlayArrow />}
            </IconButton>
            <IconButton
              disabled={loading}
              onClick={() => {
                Tone.Transport.seconds += 10;
                if (!isTonePlaying) playPlayer();
              }}
            >
              <Forward10RoundedIcon />
            </IconButton>
          </Box>
        </Box>
      )}
    </GlobalStateContext.Provider>
  );
};

export const useGlobalState = () => useContext(GlobalStateContext);

const router = createHashRouter([
  {
    path: "/",
    element: (
      <WithNavbar>
        <App />
      </WithNavbar>
    ),
  },
  {
    path: "/decode",
    element: (
      <WithNavbar>
        <DecodeHash />
      </WithNavbar>
    ),
  },
  {
    path: "/player",
    element: (
      <WithNavbar>
        <VoxPlayer />
      </WithNavbar>
    ),
  },
  {
    path: "/sync-ledger",
    element: (
      <WithNavbar>
        <SyncLedger />
      </WithNavbar>
    ),
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <GlobalStateProvider>
        <RouterProvider router={router} />
      </GlobalStateProvider>
    </ThemeProvider>
  </React.StrictMode>
);
