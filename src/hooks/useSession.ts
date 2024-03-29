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
            Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzM4NCJ9.eyJleHAiOjE3NDMwMjQ1MTEsImlhdCI6MTcxMTQ4ODUxMSwiaXNzIjoiZGV2LmthbXUiLCJzdWIiOiJudXNpYyIsImFjY2Vzc19jcmVkZW50aWFscyI6eyJsb2dpbl9tZXRob2QiOiJwYXNzd29yZCIsInByb3ZpZGVyX2NyZWRlbnRpYWxzX2pzb24iOiJ7XCJhY2NvdW50X25hbWVcIjpcIm51c2ljXCJ9In19.rTEsGGPAzK4zqGapl6JWVeEbfCjCA3Cv6b3PDw_-ajLCwjGx9FGGFWRl8MU5SlBv`,
          },
        }
      );
    }
  };

  return {
    setStartLog,
    setPrevSeconds,
    pushLog,
    logs,
  };
};
