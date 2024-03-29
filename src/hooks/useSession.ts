import axios from "axios";
import { useState } from "react";

export const useSession = () => {
  const [prevSeconds, setPrevSeconds] = useState(-1);
  const [logs, setLogs] = useState<
    {
      voice: string;
      song: string;
      start: number;
      end: number;
    }[]
  >([]);
  const [startLog, setStartLog] = useState<{
    voice: string;
    song: string;
    userName: string;
    start: number;
    end: number;
  } | null>(null);

  const pushLog = (endTime: number) => {
    if (startLog) {
      setLogs((l) => [...l, { ...startLog, end: endTime }]);
      try {
        axios.post(
          "https://api.nusic.kamu.dev/nusic/nuvox-sessions/ingest",
          {
            song: startLog.song,
            voice: startLog.voice,
            user_name: startLog.userName || "test",
            start_time: startLog.start,
            end_time: endTime,
          },
          {
            headers: {
              "Content-Type": "application/x-ndjson",
              Authorization: `Bearer ${import.meta.env.VITE_KAMU_AUTH_TOKEN}`,
            },
          }
        );
      } catch (e: any) {
        console.error(e.message);
      }
    }
  };

  return {
    setStartLog,
    setPrevSeconds,
    pushLog,
    logs,
  };
};
