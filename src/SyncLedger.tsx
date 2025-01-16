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
  InputAdornment,
  LinearProgress,
  Button,
} from "@mui/material";
import { Stack } from "@mui/system";
import { useEffect, useState } from "react";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import { useAccount, useWriteContract } from "wagmi";
import { LoadingButton } from "@mui/lab";
import {
  getVoiceModels,
  VoiceModelDoc,
} from "./services/db/voiceModels.service";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";

type Props = {};

const songs = [
  {
    name: "Is This Love",
    ascap: 100,
    bmi: 0,
    splits: { writers: [50], publishers: [50] },
    iswc: "T0700817884",
    writers: ["MARLEY BOB"],
    workId: "390330131",
    publishers: ["56 Hope road music limited", "Primary wave/blue mountain"],
    img: "isthislove.jpg",
  },
  {
    name: "Baddadan",
    ascap: 90.84,
    bmi: 0,
    splits: { writers: [45.84], publishers: [45] },
    iswc: "T3201051943",
    writers: [
      "BOUGUENNA AMINE",
      "BOUGUENNA MOHAMED AMINE",
      "BRYANT EZRA JOSHUA",
      "KENNARD WILLIAM FREDERICK",
      "MILTON SAUL GREGORY",
      "SMITH TUNDY ISIAH",
      "TENDAYI TAKURA",
      "VEIRA MARC ANTHONY",
    ],
    workId: "921273242",
    publishers: ["CONCORD ALTO CC1", "CONCORD CM UK LIMITED"],
    img: "baddadan.jpeg",
  },
  {
    name: "Gangsta's Paradise",
    ascap: 0,
    bmi: 100,
    splits: { writers: [0, 50], publishers: [0, 50] },
    iswc: "T0711828339",
    writers: [
      "IVEY ARTIS L JR",
      "RASHEED DOUGLAS B",
      "SANDERS LARRY JAMES",
      "WONDER STEVIE",
    ],
    workId: "2035231",
    publishers: [
      "MADCASTLE MUZIC",
      "UNIVERSAL SONGS OF POLYGRAM INTERNATIONAL INC",
    ],
    img: "gangsta.jpg",
  },
  {
    name: "Flowers",
    ascap: 0,
    bmi: 100,
    splits: { writers: [0, 50], publishers: [0, 50] },
    iswc: "T3150688334",
    writers: ["CYRUS MILEY RAY", "HEIN GREG ALDAE", "POLLACK MICHAEL ROSS"],
    workId: "59897816",
    publishers: [
      "DROOG PUBLISHING",
      "MCEO PUBLISHING",
      "SONGS BY GREGORY HEIN",
      "SONGS WITH A PURE TONE",
      "THESE ARE PULSE SONGS",
      "WARNER-TAMERLANE PUBLISHING CORP",
      "WHAT KEY DO YOU WANT IT IN MUSIC",
      "WIDE EYED GLOBAL",
    ],
    img: "flowers.webp",
  },
  {
    name: "Smells Like Teen Spirit",
    ascap: 0,
    bmi: 25,
    splits: { writers: [0, 12.5], publishers: [0, 12.5] },
    iswc: "T0702436916",
    writers: ["COBAIN KURT D", "GROHL DAVID ERIC", "NOVOSELIC KRIST ANTHONY"],
    workId: "1358504",
    publishers: ["MJ TWELVE MUSIC", "MURKY SLOUGH MUSIC"],
    img: "smells.jpeg",
  },
  {
    name: "Only Girl In The World",
    ascap: 81.68,
    bmi: 18.33,
    splits: { writers: [40.84, 9.16], publishers: [40.84, 9.17] },
    iswc: "T9056795961",
    writers: [
      "ERIKSEN MIKKEL STORLEER",
      "HERMANSEN TOR ERIK",
      "JOHNSON POMPEY CRYSTAL NICOLE",
      "WILHELM SANDY JULIEN",
    ],
    workId: "ASCAP: 881893611, BMI: 12109715",
    publishers: [
      "CSTYLE INK MUSIC PUBLISHING",
      "DI PIU S R L",
      "DOWNTOWN DMP SONGS",
      "EMI APRIL MUSIC INC",
      "EMI MUSIC PUBLISHING LTD",
      "SLIDE THAT MUSIC",
      "ULTRA EMPIRE MUSIC",
    ],
    img: "onlygirl.png",
  },
  {
    name: "Scream & Shout",
    ascap: 66,
    bmi: 34,
    splits: { writers: [33, 17], publishers: [33, 17] },
    iswc: "T9149746827",
    writers: [
      "ADAMS WILL",
      "CONTOSTAVLOS TULA",
      "KOUAME JEAN BAPTISTE",
      "MARTENS JEF",
    ],
    workId: "884800945",
    publishers: [
      "BMG SAPPHIRE SONGS",
      "I AM COMPOSING LLC",
      "KOBALT MUSIC SERVICES AMERICA INC",
      "MUSICALLSTARS PUBLISHING",
      "SONY/ATV MUSIC PUBLISHING (UK) LIMITED",
    ],
    img: "scream.png",
  },
  {
    name: "Still D.R.E.",
    ascap: 100,
    bmi: 0,
    splits: { writers: [50], publishers: [50] },
    iswc: "T0711885630",
    writers: [
      "BRADFORD MELVIN CHARLES",
      "CARTER SHAWN C",
      "STORCH SCOTT SPENCER",
      "YOUNG ANDRE ROMELL",
    ],
    workId: "491066487",
    publishers: [
      "LIL LU LU PUBLISHING",
      "MELVIN BRADFORD MUSIC",
      "RESERVOIR MEDIA MUSIC",
      "UNIVERSAL MUSIC CORPORATION",
    ],
    img: "drdre.jpeg",
  },
  {
    name: "Rhythm Is a Dancer",
    ascap: 0,
    bmi: 25,
    splits: { writers: [0, 12.5], publishers: [0, 12.5] },
    iswc: "T8009529969",
    writers: ["ANZILOTTI LUCA", "AUSTIN THEA", "MUENZING MICHAEL"],
    workId: "1773214",
    publishers: ["SONGS OF LOGIC EDITION", "UNIVERSAL MUSIC CAREERS"],
    img: "rhythm.jpg",
  },
  {
    name: "Duality",
    ascap: 100,
    bmi: 0,
    splits: { writers: [50], publishers: [50] },
    iswc: "T0719641312",
    writers: [
      "CRAHAN MICHAEL SHAWN",
      "FEHN CHRISTOPHER MICHAEL",
      "GRAY PAUL D",
      "JONES CRAIG A",
      "JORDISON NATHAN J",
      "ROOT JAMES DONALD",
      "TAYLOR COREY",
      "THOMSON MICKAEL G",
      "WILSON SIDNEY GEORGE",
    ],
    workId: "341101033",
    publishers: ["EMI APRIL MUSIC INC", "MUSIC THAT MUSIC"],
    img: "duality.jpg",
  },
];

type ISONG = {
  name: string;
  ascap: number;
  bmi: number;
  iswc: string;
  writers: string[];
  workId: string;
  publishers: string[];
  img: string;
  splits: { writers: number[]; publishers: number[] };
};

const SyncLedger = (props: Props) => {
  const [selectedSong, setSelectedSong] = useState<ISONG>();
  const [selectedVoiceModel, setSelectedVoiceModel] = useState<VoiceModelDoc>();
  const [role, setRole] = useState(-1);
  const [subRole, setSubRole] = useState(-1);
  const [availableSongs, setAvailableSongs] = useState<ISONG[]>([]);
  const [weightsModels, setWeightsModels] = useState<VoiceModelDoc[]>([]);
  const [otherVoiceModels, setOtherVoiceModels] = useState<VoiceModelDoc[]>([]);
  const [name, setName] = useState("");
  const [ascapWriter, setAscapWriter] = useState<number>();
  const [ascapPublishers, setAscapPublishers] = useState<number>();
  const [bmiWriter, setBmiWriter] = useState<number>();
  const [bmiPublisher, setBmiPublisher] = useState<number>();
  const { data: hash, error, writeContract, isPending } = useWriteContract();
  const { address } = useAccount();
  const [isLoading, setIsLoading] = useState(false);

  const fetchWeightsModels = async () => {
    if (weightsModels.length > 0) return;
    setIsLoading(true);
    const res = await getVoiceModels();
    setWeightsModels(res);
    setIsLoading(false);
  };

  const onNameChange = (e: any) => {
    if ("ascap" === e.target.value.toLowerCase()) {
      setAvailableSongs(songs.filter((s) => s.ascap));
    } else if ("bmi" === e.target.value.toLowerCase()) {
      setAvailableSongs(songs.filter((s) => s.bmi));
    } else {
      setSelectedSong(undefined);
      setAvailableSongs([]);
    }
  };

  useEffect(() => {
    if (hash) alert(`Tx Successful`);
  }, [hash]);

  useEffect(() => {
    if (error) alert(`Error: ${error.message}`);
  }, [error]);

  useEffect(() => {
    if (role === 1 && subRole === 0) fetchWeightsModels();
  }, [role, subRole]);

  // https://api.demo.kamu.dev/nusic/demo-models/tail?limit=10 - Others
  //

  return (
    <Stack spacing={4} px={"5%"}>
      <Typography variant="h4">Sync Ledger</Typography>
      <Divider />
      <Stack alignItems="start" spacing={2}>
        <Box display={"flex"} gap={2}>
          <Box width={200}>
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
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
          {(role === 0 || role === 1) && (
            <Box width={200}>
              <FormControl fullWidth>
                <InputLabel>Sub Role</InputLabel>
                <Select
                  label="Sub Role"
                  fullWidth
                  size="small"
                  value={subRole}
                  onChange={(e) => {
                    setSubRole(e.target.value as number);
                  }}
                >
                  {(role === 0
                    ? [
                        { name: "PRO", disabled: false },
                        { name: "Artist", disabled: false },
                        { name: "Composer", disabled: true },
                        { name: "Songwriter", disabled: true },
                        { name: "Record Label", disabled: true },
                      ]
                    : [
                        { name: "Weights.gg", disabled: false },
                        { name: "Other", disabled: false },
                      ]
                  ).map((r, i) => (
                    <MenuItem value={i} disabled={r.disabled}>
                      {r.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          )}
        </Box>
        {role === 0 && (
          <Box width={415}>
            <TextField
              label="Name"
              fullWidth
              size="small"
              onChange={onNameChange}
              placeholder="ascap or bmi"
            ></TextField>
          </Box>
        )}
      </Stack>
      {role === 1 && (
        <Stack>
          <Typography pl={1}>Available Voice Models</Typography>
          {weightsModels.length === 0 &&
            otherVoiceModels.length === 0 &&
            !isLoading && (
              <Typography variant="caption" color="gray" px={1} mt={2}>
                --- No Voice Models found ---
              </Typography>
            )}
          {isLoading && (
            <Box width={"100%"}>
              <LinearProgress />
            </Box>
          )}
          {subRole === 0 && (
            <Box mt={2} display="flex" flexWrap={"wrap"} gap={2}>
              {!!selectedVoiceModel ? (
                <Stack gap={2}>
                  <Box display={"flex"} justifyContent="start">
                    <IconButton
                      onClick={() => setSelectedVoiceModel(undefined)}
                    >
                      <ArrowBackRoundedIcon />
                    </IconButton>
                  </Box>
                  <Box
                    display={"flex"}
                    justifyContent="start"
                    alignItems="center"
                    gap={1}
                  >
                    <Typography variant="h6">
                      {selectedVoiceModel.name}
                    </Typography>
                    <CheckCircleRoundedIcon color="info" />
                  </Box>
                  <Box display={"flex"} gap={2}>
                    <img
                      width={180}
                      src={`https://voxaudio.nusic.fm/${encodeURIComponent(
                        selectedVoiceModel.avatarPath
                      )}?alt=media`}
                      alt=""
                    />
                    <Box display={"flex"} gap={4}>
                      <Stack
                        gap={2}
                        flexBasis="45%"
                        flexGrow={0}
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Stack gap={2} flexBasis="50%" flexGrow={0}>
                          <Typography sx={{ whiteSpace: "nowrap" }}>
                            Creator: {selectedVoiceModel.creator}
                          </Typography>
                          {/* <Typography>Voice Owner:</Typography> */}
                        </Stack>
                        <Button variant="contained" sx={{ width: 200 }}>
                          Claim Royalties
                        </Button>
                        <Button
                          variant="contained"
                          sx={{ width: 200 }}
                          color="error"
                        >
                          Dispute
                        </Button>
                      </Stack>
                      <Divider orientation="vertical" flexItem />
                      <Stack
                        gap={2}
                        flexBasis="50%"
                        flexGrow={0}
                        justifyContent="space-between"
                      >
                        <Stack gap={2}>
                          <Typography color="gray">
                            Tune Dash Metrics
                          </Typography>
                          <Typography
                            variant="h6"
                            sx={{ whiteSpace: "nowrap" }}
                          >
                            892,000ms 892 $NUSIC
                          </Typography>
                        </Stack>
                      </Stack>
                    </Box>
                  </Box>
                </Stack>
              ) : (
                weightsModels.map((model, i) => (
                  <Stack key={model.name} alignItems="center">
                    <IconButton onClick={() => setSelectedVoiceModel(model)}>
                      <img
                        width={180}
                        src={`https://voxaudio.nusic.fm/${encodeURIComponent(
                          model.avatarPath
                        )}?alt=media`}
                        alt=""
                        style={{ borderRadius: "8px" }}
                      />
                    </IconButton>
                    <Typography>{model.name}</Typography>
                  </Stack>
                ))
              )}
            </Box>
          )}
          {subRole === 1 && (
            <Box mt={2} display="flex" flexWrap={"wrap"} gap={2}>
              {otherVoiceModels.length === 0 && !isLoading && (
                <Typography variant="caption" color="gray" px={1}>
                  --- No Voice Models found ---
                </Typography>
              )}
            </Box>
          )}
        </Stack>
      )}
      {role === 2 && (
        <Stack>
          <Typography pl={1}>Available Voice Covers</Typography>
        </Stack>
      )}
      {!!selectedSong ? (
        <Stack gap={2}>
          <Box display={"flex"} justifyContent="start">
            <IconButton onClick={() => setSelectedSong(undefined)}>
              <ArrowBackRoundedIcon />
            </IconButton>
          </Box>
          <Box display={"flex"} gap={2}>
            <img
              width={180}
              src={`https://firebasestorage.googleapis.com/v0/b/dev-numix.appspot.com/o/syncledger%2F${selectedSong.img}?alt=media`}
              alt=""
            />
            <Box display={"flex"} gap={4}>
              <Stack
                gap={2}
                flexBasis="50%"
                flexGrow={0}
                justifyContent="space-between"
              >
                <Stack gap={2} flexBasis="50%" flexGrow={0}>
                  <Typography>ISWC: {selectedSong.iswc}</Typography>
                  <Typography>
                    Writers: {selectedSong.writers.join(", ")}
                  </Typography>
                </Stack>
                {!!selectedSong.splits.writers[0] && (
                  <Box display={"flex"} gap={1} alignItems="center" width={100}>
                    {/* <Typography color="#8973F8">
                      Ascap: {selectedSong.splits.writers[0]}%
                    </Typography> */}
                    <TextField
                      label="Ascap"
                      onChange={(e) => {
                        setAscapWriter(parseFloat(e.target.value));
                      }}
                      type="number"
                      defaultValue={selectedSong.splits.writers[0]}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">%</InputAdornment>
                        ),
                      }}
                    />
                  </Box>
                )}
                {!!selectedSong.splits.writers[1] && (
                  <Box display={"flex"} gap={1} alignItems="center" width={100}>
                    {/* <Typography color="#8973F8">
                      Bmi: {selectedSong.splits.writers[1]}%
                    </Typography> */}
                    <TextField
                      label="Bmi"
                      onChange={(e) => {
                        setBmiWriter(parseFloat(e.target.value));
                      }}
                      type="number"
                      defaultValue={selectedSong.splits.writers[1]}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">%</InputAdornment>
                        ),
                      }}
                    />
                  </Box>
                )}
              </Stack>
              <Stack
                gap={2}
                flexBasis="50%"
                flexGrow={0}
                justifyContent="space-between"
              >
                <Stack gap={2}>
                  <Typography>Work ID: {selectedSong.workId}</Typography>
                  <Typography>
                    Publishers: {selectedSong.publishers.join(", ")}
                  </Typography>
                </Stack>

                {!!selectedSong.splits.publishers[0] && (
                  <Box display={"flex"} gap={1} alignItems="center" width={100}>
                    {/* <Typography color="#8973F8">
                      Ascap: {selectedSong.splits.publishers[0]}%
                    </Typography> */}
                    <TextField
                      label="Ascap"
                      onChange={(e) => {
                        setAscapPublishers(parseFloat(e.target.value));
                      }}
                      type="number"
                      defaultValue={selectedSong.splits.publishers[0]}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">%</InputAdornment>
                        ),
                      }}
                    />
                  </Box>
                )}
                {!!selectedSong.splits.publishers[1] && (
                  <Box display={"flex"} gap={1} alignItems="center" width={100}>
                    {/* <Typography color="#8973F8">
                      Bmi: {selectedSong.splits.writers[1]}%
                    </Typography> */}
                    <TextField
                      label="Bmi"
                      onChange={(e) => {
                        setBmiPublisher(parseFloat(e.target.value));
                      }}
                      type="number"
                      defaultValue={selectedSong.splits.publishers[1]}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">%</InputAdornment>
                        ),
                      }}
                    />
                  </Box>
                )}
              </Stack>
            </Box>
          </Box>
          <Divider />
          <Box display={"flex"} justifyContent="center">
            <LoadingButton
              loading={isPending}
              variant="contained"
              disabled={
                !(ascapWriter || ascapPublishers || bmiWriter || bmiPublisher)
              }
              onClick={() => {
                (writeContract as any)({
                  abi: [
                    {
                      inputs: [
                        {
                          internalType: "address[]",
                          name: "addressList",
                          type: "address[]",
                        },
                        {
                          internalType: "uint256[]",
                          name: "splitList",
                          type: "uint256[]",
                        },
                      ],
                      name: "updateSplit",
                      outputs: [],
                      stateMutability: "nonpayable",
                      type: "function",
                    },
                  ],
                  address: import.meta.env.VITE_AI_COVER_CONTRACT,
                  functionName: "updateSplit",
                  args: [
                    [address, address],
                    [
                      (ascapWriter || bmiWriter || 1) * 100,
                      (ascapPublishers || bmiPublisher || 1) * 100,
                    ],
                  ],
                });
              }}
            >
              Publish
            </LoadingButton>
          </Box>
          {hash && (
            <Typography mt={2}>
              Tx:{" "}
              <Typography
                color={"#8973F8"}
                component={"a"}
                href={`https://testnet.bscscan.com/tx/${hash}`}
                sx={{ textDecoration: "underline" }}
                target="_blank"
              >
                {hash}
              </Typography>
            </Typography>
          )}
        </Stack>
      ) : (
        role === 0 && (
          <Stack>
            <Typography pl={1}>Available Songs</Typography>
            <Box mt={2} display="flex" flexWrap={"wrap"} gap={2}>
              {availableSongs.length === 0 && (
                <Typography variant="caption" color="gray" px={1}>
                  --- No songs found ---
                </Typography>
              )}
              {availableSongs.map((song, i) => (
                <Stack key={song.name}>
                  <IconButton
                    key={song.name}
                    onClick={() => setSelectedSong(song)}
                  >
                    <img
                      width={180}
                      src={`https://firebasestorage.googleapis.com/v0/b/dev-numix.appspot.com/o/syncledger%2F${song.img}?alt=media`}
                      alt=""
                      style={{ borderRadius: "8px" }}
                    />
                  </IconButton>
                  <Typography>{song.name}</Typography>
                </Stack>
              ))}
            </Box>
          </Stack>
        )
      )}
    </Stack>
  );
};

export default SyncLedger;
