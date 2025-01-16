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
import { useAccount, useConnect, useWriteContract } from "wagmi";
import { LoadingButton } from "@mui/lab";
import {
  getVoiceModels,
  VoiceModelDoc,
} from "./services/db/voiceModels.service";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import { AreaPlot, ChartContainer } from "@mui/x-charts";
import { injected } from "wagmi/connectors";

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

// Generate random data averaging to 400 for 10 numbers
const viewsData = [
  [388, 446, 488, 433, 410, 390, 460, 500, 560, 480], // 4555
  [320, 375, 420, 380, 355, 345, 400, 435, 485, 415], // 3930
  [450, 495, 525, 470, 445, 425, 485, 520, 580, 505], // 4900
  [365, 410, 445, 395, 380, 365, 425, 460, 510, 445], // 4200
  [405, 465, 505, 450, 425, 405, 475, 515, 575, 495], // 4715
  [340, 385, 425, 385, 365, 350, 410, 445, 495, 430], // 4030
  [425, 480, 515, 460, 435, 415, 480, 525, 585, 510], // 4830
  [355, 400, 435, 390, 375, 360, 420, 455, 505, 440], // 4135
  [415, 470, 510, 455, 430, 410, 475, 520, 580, 505], // 4770
  [335, 380, 415, 375, 360, 345, 405, 440, 490, 425], // 3970
  [445, 500, 535, 480, 455, 435, 495, 540, 600, 525], // 5010
  [375, 420, 455, 410, 395, 380, 440, 475, 525, 460], // 4335
  [395, 450, 490, 435, 415, 395, 465, 505, 565, 485], // 4600
  [350, 395, 430, 385, 370, 355, 415, 450, 500, 435], // 4085
  [435, 490, 525, 470, 445, 425, 485, 530, 590, 515], // 4910
  [360, 405, 440, 395, 380, 365, 425, 460, 510, 445], // 4185
  [410, 465, 500, 445, 420, 400, 470, 515, 575, 490], // 4690
  [345, 390, 425, 380, 365, 350, 410, 445, 495, 430], // 4035
  [420, 475, 510, 455, 430, 410, 480, 525, 585, 505], // 4795
];
const creationsData = [
  [188, 246, 288, 233, 210, 190, 260, 300, 360, 182], // 2457
  [170, 225, 270, 230, 205, 195, 250, 285, 335, 168], // 2333
  [250, 295, 325, 270, 245, 225, 285, 320, 380, 212], // 2807
  [165, 210, 245, 195, 180, 165, 225, 260, 310, 156], // 2111
  [205, 265, 305, 250, 225, 205, 275, 315, 375, 198], // 2618
  [140, 185, 225, 185, 165, 150, 210, 245, 295, 143], // 1943
  [225, 280, 315, 260, 235, 215, 280, 325, 385, 227], // 2747
  [155, 200, 235, 190, 175, 160, 220, 255, 305, 164], // 2059
  [215, 270, 310, 255, 230, 210, 275, 320, 380, 208], // 2673
  [135, 180, 215, 175, 160, 145, 205, 240, 290, 138], // 1883
  [245, 300, 335, 280, 255, 235, 295, 340, 400, 236], // 2921
  [175, 220, 255, 210, 195, 180, 240, 275, 325, 171], // 2246
  [195, 250, 290, 235, 215, 195, 265, 305, 365, 192], // 2507
  [150, 195, 230, 185, 170, 155, 215, 250, 300, 147], // 1997
  [235, 290, 325, 270, 245, 225, 285, 330, 390, 229], // 2824
  [160, 205, 240, 195, 180, 165, 225, 260, 310, 159], // 2099
  [210, 265, 300, 245, 220, 200, 270, 315, 375, 203], // 2603
  [145, 190, 225, 180, 165, 150, 210, 245, 295, 141], // 1946
  [220, 275, 310, 255, 230, 210, 280, 325, 385, 216], // 2706
  [130, 175, 215, 170, 155, 140, 200, 235, 285, 133], // 1838
];

const SyncLedger = (props: Props) => {
  const [selectedSong, setSelectedSong] = useState<ISONG>();
  const [selectedVoiceModel, setSelectedVoiceModel] = useState<VoiceModelDoc>();
  const [selectedVoiceModelIdx, setSelectedVoiceModelIdx] = useState<number>(0);
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
  const { connect } = useConnect();

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
                      onClick={() => {
                        setSelectedVoiceModel(undefined);
                        setSelectedVoiceModelIdx(0);
                      }}
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
                    <Box display={"flex"} alignItems="center">
                      <img
                        width={180}
                        src={`https://voxaudio.nusic.fm/${encodeURIComponent(
                          selectedVoiceModel.avatarPath
                        )}?alt=media`}
                        alt=""
                        style={{ borderRadius: "8px" }}
                      />
                    </Box>
                    <Box display={"flex"} gap={4}>
                      <Stack
                        gap={2}
                        flexBasis="45%"
                        flexGrow={0}
                        justifyContent="center"
                        alignItems="center"
                      >
                        <Stack gap={2} flexBasis="50%" flexGrow={0}>
                          <Typography sx={{ whiteSpace: "nowrap" }}>
                            Creator: {selectedVoiceModel.creator}
                          </Typography>
                          {/* <Typography>Voice Owner:</Typography> */}
                        </Stack>
                        <Button
                          variant="contained"
                          sx={{ width: 200 }}
                          onClick={() => {
                            connect({ connector: injected() });
                          }}
                        >
                          Claim Royalties
                        </Button>
                        <Button
                          variant="contained"
                          sx={{ width: 200 }}
                          color="error"
                          onClick={() => {
                            connect({ connector: injected() });
                          }}
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
                            Weights.gg Metrics
                          </Typography>
                          <Box display={"flex"} justifyContent="center">
                            <Box width={300} height={180} position={"relative"}>
                              <Box
                                position={"absolute"}
                                top={0}
                                left={0}
                                width={300}
                                height={180}
                              >
                                <Typography
                                  variant="caption"
                                  color="gray"
                                  position={"absolute"}
                                  top={"20%"}
                                  left={"50%"}
                                  sx={{ transform: "translate(-50%, -50%)" }}
                                >
                                  Views{" "}
                                  {(
                                    viewsData[selectedVoiceModelIdx].reduce(
                                      (a, b) => a + b,
                                      0
                                    ) / 1000
                                  ).toFixed(2)}
                                  k
                                </Typography>
                              </Box>
                              <ChartContainer
                                width={300}
                                height={180}
                                series={[
                                  {
                                    data: viewsData[selectedVoiceModelIdx],
                                    type: "line",
                                    label: "uv",
                                    area: true,
                                    stack: "total",
                                  },
                                ]}
                                xAxis={[
                                  {
                                    scaleType: "point",
                                    data: viewsData[selectedVoiceModelIdx],
                                  },
                                ]}
                              >
                                <AreaPlot />
                              </ChartContainer>
                            </Box>
                            <Box width={300} height={180} position={"relative"}>
                              <Box
                                position={"absolute"}
                                top={0}
                                left={0}
                                width={300}
                                height={180}
                              >
                                <Typography
                                  variant="caption"
                                  color="gray"
                                  position={"absolute"}
                                  top={"20%"}
                                  left={"50%"}
                                  sx={{ transform: "translate(-50%, -50%)" }}
                                >
                                  Creations{" "}
                                  {(
                                    creationsData[selectedVoiceModelIdx].reduce(
                                      (a, b) => a + b,
                                      0
                                    ) / 1000
                                  ).toFixed(2)}
                                  k
                                </Typography>
                              </Box>
                              <ChartContainer
                                width={300}
                                height={180}
                                series={[
                                  {
                                    data: creationsData[selectedVoiceModelIdx],
                                    type: "line",
                                    label: "uv",
                                    area: true,
                                    stack: "total",
                                  },
                                ]}
                                xAxis={[
                                  {
                                    scaleType: "point",
                                    data: creationsData[selectedVoiceModelIdx],
                                  },
                                ]}
                              >
                                <AreaPlot />
                              </ChartContainer>
                            </Box>
                          </Box>
                        </Stack>
                        <Stack gap={2}>
                          <Typography color="gray">
                            Tune Dash Metrics
                          </Typography>
                          <Typography
                            variant="h6"
                            sx={{ whiteSpace: "nowrap" }}
                          >
                            {selectedVoiceModel.totalPlayedMs}ms{" "}
                            {selectedVoiceModel.totalPlayedMs / 1000} $NUSIC
                          </Typography>
                        </Stack>
                      </Stack>
                    </Box>
                  </Box>
                </Stack>
              ) : (
                weightsModels.map((model, i) => (
                  <Stack key={model.name} alignItems="center">
                    <IconButton
                      onClick={() => {
                        setSelectedVoiceModel(model);
                        setSelectedVoiceModelIdx(i);
                      }}
                    >
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
