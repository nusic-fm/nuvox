import { useRef, useState } from "react";
import * as Tone from "tone";
import { ToneAudioBuffer } from "tone";

export const useTonejs = () => {
  const [currentPlayer, setCurrentPlayer] = useState<Tone.Player | null>();
  const playerRef = useRef<Tone.Player | null>(null);
  const instrPlayerRef = useRef<Tone.Player | null>(null);
  const startTimeRef = useRef(0);
  const scheduledNextTrackBf = useRef<Tone.ToneAudioBuffer | null>(null);

  const [isToneInitialized, setIsToneInitialized] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isTonePlaying, setIsTonePlaying] = useState(false);
  const [toneLoadingForSection, setToneLoadingForSection] = useState<
    string | null
  >(null);
  const [loop, setLoop] = useState(false);
  const onEndedCalledRef = useRef(false);

  const initializeTone = async () => {
    if (!isToneInitialized) {
      setIsToneInitialized(true);
      await Tone.start();
      console.log("context started");
      setEvents();
    }
  };

  const setEvents = () => {
    Tone.Transport.on("start", (...args) => {
      console.log("Tone Started");
      setIsTonePlaying(true);
    });
    Tone.Transport.on("stop", (...args) => {
      console.log("Tone Stopped");
      setIsTonePlaying(false);
    });
    Tone.Transport.on("pause", (...args) => {
      console.log("Tone Paused");
      setIsTonePlaying(false);
    });
  };
  const changePlayerBuffer = (
    bf: ToneAudioBuffer,
    offsetPosition: Tone.Unit.Time
  ) => {
    if (playerRef.current) {
      playerRef.current.stop();
      playerRef.current.buffer = bf;
      playerRef.current.start(undefined, offsetPosition);
    }
  };

  const playAudio = async (
    instrUrl: string,
    vocalsUrl: string,
    changeInstr: boolean = false
  ): Promise<void> => {
    if (toneLoadingForSection) {
      scheduledNextTrackBf.current = null;
      setToneLoadingForSection(null);
      onEndedCalledRef.current = false;
    }
    if (playerRef.current && !changeInstr) {
      await switchAudio(vocalsUrl);
      return;
    }
    await initializeTone();
    if (instrPlayerRef.current) {
      instrPlayerRef.current.disconnect();
      instrPlayerRef.current.disconnect();
    }
    if (playerRef.current) {
      playerRef.current.disconnect();
      playerRef.current.dispose();
    }
    // Load and play the new audio
    const player = new Tone.Player(vocalsUrl).sync().toDestination();
    const instrPlayer = new Tone.Player(instrUrl).sync().toDestination();
    instrPlayerRef.current = instrPlayer;
    playerRef.current = player;
    setCurrentPlayer(player);
    await Tone.loaded();
    if (isMuted) player.mute = true;
    player.loop = true;
    instrPlayer.loop = true;
    // player.fadeIn = 0.3;
    // player.fadeOut = 0.3;
    Tone.Transport.start();
    player.start();
    instrPlayer.start();
    startTimeRef.current = Tone.Transport.seconds;
  };

  const switchAudio = async (url: string) => {
    await new Promise((res) => {
      const audioBuffer = new Tone.Buffer(url);
      audioBuffer.onload = (bf) => {
        // Audio is downloaded
        if (isTonePlaying) {
          if (playerRef.current) {
            changePlayerBuffer(bf, Tone.Transport.seconds);
          }
        } else if (playerRef.current) {
          playerRef.current.buffer = bf;
          Tone.Transport.start();
          playerRef.current.start();
        }
        res("");
      };
    });
  };
  // const changeInstrAudio = async (url: string) => {
  //   await new Promise((res) => {
  //     const audioBuffer = new Tone.Buffer(url);
  //     audioBuffer.onload = (bf) => {
  //       // Audio is downloaded
  //       if (instrPlayerRef.current) {
  //         instrPlayerRef.current.buffer = bf;
  //         Tone.Transport.start();
  //         instrPlayerRef.current.start();
  //       } else {

  //       }
  //       res("");
  //     };
  //   });
  // };

  const switchLoop = () => {
    if (currentPlayer) {
      currentPlayer.loop = !loop;
      setLoop(!loop);
    }
  };

  const mutePlayer = () => {
    setIsMuted(true);
    if (playerRef.current) {
      playerRef.current.mute = true;
      // currentPlayer.stop(currentPlayer.now() + 0.1);
    }
  };

  const unMutePlayer = () => {
    setIsMuted(false);
    if (playerRef.current) {
      playerRef.current.mute = false;
      // currentPlayer.start();
    }
  };

  const pausePlayer = () => {
    Tone.Transport.pause();
  };
  const playPlayer = () => {
    Tone.Transport.start();
  };
  const stopPlayer = () => {
    Tone.Transport.stop();
  };
  return {
    currentPlayer,
    playAudio,
    mutePlayer,
    unMutePlayer,
    pausePlayer,
    playPlayer,
    stopPlayer,
    isTonePlaying,
    isMuted,
    toneLoadingForSection,
    switchLoop,
    loop,
    initializeTone,
    // changeInstrAudio,
  };
};
