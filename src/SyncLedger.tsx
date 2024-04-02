import {
  Select,
  TextField,
  Typography,
  MenuItem,
  Box,
  Divider,
  FormControl,
  InputLabel,
  IconButton,
} from "@mui/material";
import { Stack } from "@mui/system";
import { useState } from "react";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";

type Props = {};

const songs = [
  {
    name: "Is This Love",
    ascap: 50,
    bmi: 0,
    iswc: "T0700817884",
    writers: "MARLEY BOB",
    workId: 390330131,
    publishers: ["56 Hope road music limited", "Primary wave/blue mountain"],
    img: "isthislove.jpg",
  },
  {
    name: "Baddadan",
    ascap: 50,
    bmi: 0,
    iswc: "T0700817884",
    writers: "Chase & Status",
    workId: 390330131,
    publishers: ["56 Hope road music limited", "Primary wave/blue mountain"],
    img: "baddadan.jpeg",
  },
  {
    name: "Gangsta's Paradise",
    ascap: 50,
    bmi: 0,
    iswc: "T0700817884",
    writers: "Miley Cyrus",
    workId: 390330131,
    publishers: ["56 Hope road music limited", "Primary wave/blue mountain"],
    img: "gangsta.jpg",
  },
  {
    name: "Flowers",
    ascap: 50,
    bmi: 0,
    iswc: "T0700817884",
    writers: "MARLEY BOB",
    workId: 390330131,
    publishers: ["56 Hope road music limited", "Primary wave/blue mountain"],
    img: "flowers.webp",
  },
  {
    name: "Smells Like Teen Spirit",
    ascap: 50,
    bmi: 0,
    iswc: "T0700817884",
    writers: "Nirvana",
    workId: 390330131,
    publishers: ["56 Hope road music limited", "Primary wave/blue mountain"],
    img: "smells.jpeg",
  },
  {
    name: "Only Girl In The World",
    ascap: 50,
    bmi: 0,
    iswc: "T0700817884",
    writers: "Rihanna",
    workId: 390330131,
    publishers: ["56 Hope road music limited", "Primary wave/blue mountain"],
    img: "onlygirl.png",
  },
  {
    name: "Scream & Shout",
    ascap: 50,
    bmi: 0,
    iswc: "T0700817884",
    writers: "Will.i.am & Britney Spears",
    workId: 390330131,
    publishers: ["56 Hope road music limited", "Primary wave/blue mountain"],
    img: "scream.png",
  },
  {
    name: "Still D.R.E.",
    ascap: 50,
    bmi: 0,
    iswc: "T0700817884",
    writers: "Dr. Dre",
    workId: 390330131,
    publishers: ["56 Hope road music limited", "Primary wave/blue mountain"],
    img: "drdre.jpeg",
  },
  {
    name: "Rhythm Is a Dancer",
    ascap: 50,
    bmi: 0,
    iswc: "T0700817884",
    writers: "SNAP!",
    workId: 390330131,
    publishers: ["56 Hope road music limited", "Primary wave/blue mountain"],
    img: "rhythm.jpg",
  },
  {
    name: "Duality",
    ascap: 50,
    bmi: 0,
    iswc: "T0700817884",
    writers: "Slipknot",
    workId: 390330131,
    publishers: ["56 Hope road music limited", "Primary wave/blue mountain"],
    img: "duality.jpg",
  },
];

const SyncLedger = (props: Props) => {
  const [songIdx, setSongIdx] = useState(-1);
  const [role, setRole] = useState(-1);
  const [subRole, setSubRole] = useState(-1);
  const [name, setName] = useState("");

  return (
    <Stack spacing={4} px={"5%"}>
      <Typography variant="h4">Sync Ledger</Typography>
      <Divider />
      <Stack alignItems="start" spacing={2}>
        <Box display={"flex"} gap={2}>
          <Box width={200}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Role</InputLabel>
              <Select
                label="Role"
                value={role}
                onChange={(e) => setRole(e.target.value as number)}
                fullWidth
                size="small"
              >
                <MenuItem value={0}>Rights Holder</MenuItem>
                <MenuItem value={1}>RVC Model Creator</MenuItem>
                <MenuItem value={2}>AI Cover Creator</MenuItem>
              </Select>
            </FormControl>
          </Box>
          {role === 0 && (
            <Box width={200}>
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Sub Role</InputLabel>
                <Select
                  label="Sub Role"
                  fullWidth
                  defaultValue={0}
                  size="small"
                >
                  <MenuItem value={0}>PRO</MenuItem>
                  <MenuItem value={1}>Artist</MenuItem>
                  <MenuItem value={2} disabled>
                    Composer
                  </MenuItem>
                  <MenuItem value={3} disabled>
                    Songwriter
                  </MenuItem>
                  <MenuItem value={4} disabled>
                    Record Label
                  </MenuItem>
                </Select>
              </FormControl>
            </Box>
          )}
        </Box>
        {role === 0 && (
          <Box width={415}>
            <TextField fullWidth size="small"></TextField>
          </Box>
        )}
      </Stack>
      {role === 1 && (
        <Stack>
          <Typography pl={1}>Available Voice Models</Typography>
        </Stack>
      )}
      {role === 2 && (
        <Stack>
          <Typography pl={1}>Available Voice Covers</Typography>
        </Stack>
      )}
      {songIdx >= 0 ? (
        <Stack gap={2}>
          <Box display={"flex"} justifyContent="start">
            <IconButton onClick={() => setSongIdx(-1)}>
              <ArrowBackRoundedIcon />
            </IconButton>
          </Box>
          <Box display={"flex"} gap={2}>
            <img
              width={180}
              src={`https://firebasestorage.googleapis.com/v0/b/dev-numix.appspot.com/o/syncledger%2F${songs[songIdx].img}?alt=media`}
              alt=""
            />
            <Box display={"flex"} justifyContent="space-around" width={"50%"}>
              <Stack gap={2}>
                <Typography>ISWC: {songs[songIdx].iswc}</Typography>
                <Typography>Writers: {songs[songIdx].writers}</Typography>
              </Stack>
              <Stack gap={2}>
                <Typography>Work ID: {songs[songIdx].workId}</Typography>
                <Typography>Publishers</Typography>
                <Typography>{songs[songIdx].publishers[0]}</Typography>
                <Typography>{songs[songIdx].publishers[1]}</Typography>
              </Stack>
            </Box>
          </Box>
        </Stack>
      ) : (
        role === 0 && (
          <Stack>
            <Typography pl={1}>Available Songs</Typography>
            <Box mt={2} display="flex" flexWrap={"wrap"} gap={2}>
              {songs.map((song, i) => (
                <IconButton key={song.name} onClick={() => setSongIdx(i)}>
                  <img
                    width={180}
                    src={`https://firebasestorage.googleapis.com/v0/b/dev-numix.appspot.com/o/syncledger%2F${song.img}?alt=media`}
                    alt=""
                    style={{ borderRadius: "8px" }}
                  />
                </IconButton>
              ))}
            </Box>
          </Stack>
        )
      )}
    </Stack>
  );
};

export default SyncLedger;
