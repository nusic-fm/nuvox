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
    start: number;
    end: number;
  } | null>(null);

  const pushLog = (endTime: number) => {
    if (startLog) {
      setLogs((l) => [...l, { ...startLog, end: endTime }]);
    }
  };

  return {
    setStartLog,
    setPrevSeconds,
    pushLog,
    logs,
  };
};
