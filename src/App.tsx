import {
  TextField,
  Button,
  Stack,
  IconButton,
  Typography,
  Snackbar,
  Chip,
  Alert,
  LinearProgress,
  Badge,
} from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useRef, useState } from "react";
// import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CloseIcon from "@mui/icons-material/Close";
import SettingsRounded from "@mui/icons-material/SettingsRounded";
import axios from "axios";
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { client } from "@gradio/client";
import { useWavesurfer } from "./hooks/useWavesurfer";
import PauseRounded from "@mui/icons-material/PauseRounded";
import PlayRounded from "@mui/icons-material/PlayArrowRounded";
import DownloadRounded from "@mui/icons-material/DownloadRounded";
import { LoadingButton } from "@mui/lab";
import Uploader from "./components/Uploader";
import CheckIcon from "@mui/icons-material/Check";
import { logFirebaseEvent } from "./services/firebase.service";
import VoiceModelSelection from "./components/VoiceModelSelection";
import { createVoiceModelDoc } from "./services/db/voiceModels.service";
import { createErrorDoc } from "./services/db/errors.service";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import { getSpaceId } from "./helpers/hf";
import { useHfClient } from "./hooks/useHf";
import Settings from "./components/Settings";

type Props = {};

export const GPU_SPACE_ID = "nusic-voice-cover";
export const CPU_SPACE_ID = "nusic-voice-cover-cpu";

export const voiceCoverLinks = [
  "eminem-new-era",
  "trump",
  "CartmanClassico",
  "Elvis_model",
  "GreenDay300",
  "KanyeWestGraduation",
  "mcdoor",
];

export type HardwareInfo = { machineType: string; sleepTime: number };

const App = ({}: Props) => {
  const [showAccountSetup, setShowAccountSetup] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [enteredAccessToken, setEnteredAccessToken] = useState("");
  // const [hfToken, setHfToken] = useState("");
  // const [userName, setUserName] = useState("");
  // const [userId, setUserId] = useState("");
  const [gpuSpaceAvailable, setGpuSpaceAvailable] = useState(false);
  const [cpuSpaceAvailable, setCpuSpaceAvailable] = useState(false);
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsAlert, setSettingsAlert] = useState("");
  const [spaceId, setSpaceId] = useState(() => {
    const idx = parseInt(window.localStorage.getItem("TAB_IDX") ?? "0");
    return idx === 0 ? GPU_SPACE_ID : CPU_SPACE_ID;
  });
  const [voiceModelChoices, setVoiceModelChoices] = useState<string[][]>(); // TODO
  const [generateAfterRestart, setGenerateAfterRestart] = useState(false);

  const [uploadedFile, setUploadedFile] = useState<File>();

  // const [spaceExists, setSpaceExists] = useState(false);
  // const [isSpaceRunning, setIsSpaceRunning] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [errorSnackbarMessage, setErrorSnackbarMessage] = useState("");

  const [youtubeLink, setYoutubeLink] = useState("");
  const [inputSongUrl, setInputSongUrl] = useState("");
  // const [inputFile, setInputFile] = useState<File>();
  // const [inputUrl, setInputUrl] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  // const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  // const [selectedArtist, setSelectedArtist] = useState("");
  const [coverUrl, setCoverUrl] = useState(
    ""
    // "https://firebasestorage.googleapis.com/v0/b/dev-numix.appspot.com/o/arr.wav?alt=media&token=141f6e3c-3ef7-48ec-bd37-3df48783570b"
  );
  const [localCoverUrl, setLocalCoverUrl] = useState("");
  const [voiceModelProps, setVoiceModelProps] = useState<{
    url: string;
    name: string;
    uploadFilePath: string;
    fullUploadedUrl: string;
  }>({
    url: "",
    name: "",
    uploadFilePath: "",
    fullUploadedUrl: "",
  });
  const [uploadedZipFile, setUploadedZipFile] = useState<File>();
  // const [eta, setEta] = useState(0);
  const [queueData, setQueueData] = useState("");

  const [progressMsgs, setProgressMsgs] = useState<
    { msg: string; alert: "success" | "error" }[]
  >([]);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [isUploadingZip, setIsUploadingZip] = useState(false);
  const [hfStatus, setHfStatus] = useState<string>("");
  const [hfHardwareInfo, setHfHardwareInfo] = useState<HardwareInfo>({
    machineType: "",
    sleepTime: 0,
  });
  const [txHash, setTxHash] = useState<string>();
  const [hashedAudioUrl, setHashedAudioUrl] = useState<string>();

  const {
    hfUserInfo: { name: userName, id: userId },
    hfToken,
  } = useHfClient(
    enteredAccessToken,
    spaceId,
    (isLoading) => setSettingsLoading(isLoading),
    (msg: string) => setErrorSnackbarMessage(msg)
  );

  const containerRef = useRef(null);
  const wavesurfer = useWavesurfer(containerRef, localCoverUrl, true);

  // const checkUserAccessToken = async () => {
  //   try {
  //     setSettingsLoading(true);
  //     const user = await whoAmI({
  //       credentials: { accessToken: enteredAccessToken },
  //     });
  //     const _userName = user.name;
  //     const _userId = user.id;

  //     window.localStorage.setItem("HF_AT", enteredAccessToken);
  //     setHfToken(enteredAccessToken);
  //     // setUserName(_userName.endsWith("nusic") ? "nusic" : _userName); // user.name "nusic"
  //     setUserName(_userName); // user.name "nusic"
  //     setUserId(_userId);
  //     setShowAccountSetup(false);
  //   } catch (e) {
  //     setShowAccountSetup(true);
  //     setErrorSnackbarMessage("Invalid Access Token");
  //   } finally {
  //     setSettingsLoading(false);
  //   }
  // };
  const checkSpace = async () => {
    try {
      setSettingsLoading(true);
      const statusRes = await axios.get(
        `https://huggingface.co/api/spaces/${userName}/${spaceId}`,
        {
          headers: { Authorization: `Bearer ${hfToken}` },
        }
      );
      if (statusRes) {
        setHfStatus(statusRes.data?.runtime?.stage);
        setHfHardwareInfo({
          machineType: statusRes.data?.runtime?.hardware?.requested,
          sleepTime: statusRes.data?.runtime.gcTimeout,
        });
        if (statusRes.data?.runtime.gcTimeout < 1800) {
          setSettingsAlert(
            "Generations may fail, increase the Auto sleep to 30 minutes or more"
          );
        }
      }
      if (spaceId === GPU_SPACE_ID) {
        setGpuSpaceAvailable(true);
      } else if (spaceId === CPU_SPACE_ID) {
        setCpuSpaceAvailable(true);
      }
      // setAccountSetupSteps(2);
    } catch (e) {
      setErrorSnackbarMessage("Space is not found, duplicate one");
      setShowSettings(true);
      // setShowAccountSetupStepper(true);
      // setAccountSetupSteps(1);
    } finally {
      setSettingsLoading(false);
    }
  };

  const getModelChoices = async () => {
    const _client = await client(getSpaceId(userName, spaceId), {
      hf_token: hfToken as `hf_${string}`,
    });
    const choicesSubmit = _client.submit(5, []);
    try {
      const choices = await new Promise((res, rej) => {
        choicesSubmit.on("status", (status) => {
          console.log(status);
          if (status.size) {
            setQueueData(`${(status.position ?? 0) + 1}/${status.size}`);
          }
          if (status.stage === "error") {
            rej("");
          }
        });
        choicesSubmit.on("data", (event) => {
          console.log("data: ", event);
          if (event.data.length) {
            const choices = (event.data[0] as any).choices as any;
            if (choices) {
              res(choices);
            }
          }
        });
      });
      setVoiceModelChoices(choices as string[][]);
      return choices as string[][];
    } catch (e) {
      setErrorSnackbarMessage("Error occured, try again later");
    }
    return [];
  };

  const onDropZipFile = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length && !isGenerating) {
      setIsUploadingZip(true);
      const zip = acceptedFiles[0];
      const url = `https://${userName}-${spaceId}.hf.space/upload`;
      const formData = new FormData();
      formData.append("files", zip);
      try {
        setSnackbarMessage("Uploading the zip file");
        const res = await axios.post(url, formData, {
          headers: { Authorization: `Bearer ${hfToken}` },
        });
        const filePath = res.data[0];
        setVoiceModelProps((props) => ({
          name: props.name || acceptedFiles[0].name.split(".")[0],
          uploadFilePath: filePath,
          fullUploadedUrl: `https://${userName}-${spaceId}.hf.space/file=${filePath}`,
          url: "",
        }));
        setUploadedZipFile(zip);
        setSnackbarMessage("Successfully Uploaded!");
      } catch (e) {
        setErrorSnackbarMessage("Error uploading the file, try again later");
      } finally {
        setIsUploadingZip(false);
      }
    }
  };

  const onDropMusicUpload = async (acceptedFiles: File[]) => {
    if (acceptedFiles.length && !isGenerating) {
      setIsGenerating(true);
      const melody = acceptedFiles[0];
      setUploadedFile(melody);
      const url = `https://${userName}-${spaceId}.hf.space/upload`;
      const formData = new FormData();
      formData.append("files", melody);
      try {
        const res = await axios.post(url, formData, {
          headers: { Authorization: `Bearer ${hfToken}` },
        });
        const filePath = res.data[0];
        setInputSongUrl(filePath);
        setYoutubeLink("");
      } catch (e) {
        setErrorSnackbarMessage("Error uploading the file, try again later");
      } finally {
        setIsGenerating(false);
      }
    }
  };
  const resetState = () => {
    // Reset State:
    setCoverUrl("");
    setProgressMsgs([]);
    setHashedAudioUrl("");
    setGenerationProgress(0);
  };

  const onGenerateVoiceCover = async () => {
    if (hfToken) {
      if (hfStatus !== "RUNNING") {
        setSnackbarMessage("Space is Building now, try again later");
        await checkSpace();
        return;
      }
      // if (!selectedArtist && !(voiceModelProps.url && voiceModelProps.name)) {
      if (
        !(
          (voiceModelProps.url || voiceModelProps.uploadFilePath) &&
          voiceModelProps.name
        )
      ) {
        setErrorSnackbarMessage("provide a voice model url and name");
        return;
      }
      if (!inputSongUrl) {
        setErrorSnackbarMessage("Enter a Youtube link");
        return;
      }
      resetState();

      setIsGenerating(true);
      const _modelObj = { ...voiceModelProps };
      // if (selectedArtist) {
      //   const name = selectedArtist;
      //   const voiceModelUrl = `https://firebasestorage.googleapis.com/v0/b/nusic-dao-website.appspot.com/o/${name}.zip?alt=media`;
      //   _modelObj.url = voiceModelUrl;
      //   _modelObj.name = name;
      // } else {
      //   _modelObj.url = voiceModelProps.url;
      //   _modelObj.name = voiceModelProps.name;
      // }
      logFirebaseEvent("select_content", {
        content_type: "generate",
        content_id: voiceModelProps.name,
        model_url: voiceModelProps.url,
      });
      const app = await client(getSpaceId(userName, spaceId), {
        hf_token: hfToken as `hf_${string}`,
      });
      const choices = await getModelChoices();
      const choiceIdx = choices.findIndex((c: string[]) =>
        c.includes(_modelObj.name)
      );
      if (choiceIdx === -1) {
        try {
          const methodFnIdx = _modelObj.uploadFilePath ? 15 : 8;
          const _urlData = _modelObj.uploadFilePath
            ? {
                data: _modelObj.fullUploadedUrl,
                name: _modelObj.uploadFilePath,
                size: uploadedZipFile?.size,
                orig_name: uploadedZipFile?.name,
                is_file: true,
              }
            : _modelObj.url;
          const result = await app.predict(methodFnIdx, [
            _urlData, //"https://huggingface.co/nolanaatama/jjsbd10krvcstpsncgm/resolve/main/diobrando.zip",
            _modelObj.name, //"diobrando",
          ]);
          setSnackbarMessage((result as any).data[0]);
        } catch (e: any) {
          console.error(e);
          setIsGenerating(false);
          setProgressMsgs((m) => [
            ...m,
            {
              msg: `Check the provided Model url or Re-Upload the zip`,
              alert: "error",
            },
          ]);
          createErrorDoc({
            type: "upload_voice_model",
            message: e.message || "",
            customMessage: "Check the provided Model url or zip",
            userId,
            userName,
            modelUrl: _modelObj.url,
            modelName: _modelObj.name,
          });
          return;
        }
      }
      try {
        const generateData = [
          inputSongUrl,
          _modelObj.name,
          0,
          false,
          1,
          0,
          0,
          0,
          0.5,
          3,
          0.25,
          "rmvpe",
          128,
          0.33,
          0,
          0.15,
          0.2,
          0.8,
          0.7,
          "mp3",
        ];
        // const genResult = await app.predict(6, generateData);
        //nusic-nusic-voicecovergen.hf.space/file=/tmp/gradio/7a16847668b16521ddd40585cab98614ad86bbd8/Short%20Song%20English%20Song%20W%20Lyrics%2030%20seconds%20Test%20Ver.mp3
        // const audioUrl = `https://nusic-nusic-voicecovergen.hf.space/file=${
        //   (genResult as any).data[0].name
        // }`;
        // setCoverUrl(audioUrl);
        const submitData = app.submit(6, generateData);
        submitData.on("data", (event) => {
          if (event.data.length) {
            const fileData = event.data[0] as any;
            if (fileData) {
              console.log(fileData.name, fileData.orig_name);
              const _name = fileData.name;
              const audioUrl = `https://${userName}-${spaceId}.hf.space/file=${_name}`;
              setCoverUrl(audioUrl);
              setGenerationProgress(0);
              logFirebaseEvent("select_content", {
                content_type: "complete",
                content_id: inputSongUrl,
                model_url: _modelObj.url,
              });
              setIsGenerating(false);
            }
          }
        });
        submitData.on("status", async (event) => {
          // eta = 74.32423, position = 0, queue = true, size = 1
          console.log("status: ", event);
          if (event.stage === "error" && event.message) {
            const msg = event.message;
            setProgressMsgs((m) => [...m, { msg, alert: "error" }]);
            if (msg === "Connection errored out" && settingsAlert) return;
            // setErrorSnackbarMessage("Error Occurred, try again later");
            // setIsGenerating(false);
            createErrorDoc({
              type: "generation",
              message: msg || "",
              customMessage:
                "Unable to download the Model Url, kindly provide a downloadable .zip url",
              userId,
              userName,
              youtubeLink,
              model_url: _modelObj.url,
              model_name: _modelObj.name,
            });
            if (msg.includes("mdxnet_models")) {
              const formData = new FormData();
              formData.append("delete_space_id", getSpaceId(userName, spaceId));
              formData.append("space_id", `nusic/${spaceId}`);
              formData.append("hf_token", hfToken);
              await axios.post(
                `${
                  import.meta.env.VITE_AUDIO_ANALYSER_PY
                }/delete-duplicate-space`,
                formData
              );
              resetState();
              setGenerateAfterRestart(true);
              await checkSpace();
            } else if (
              msg.toLowerCase().includes("invalid") ||
              msg.toLowerCase().includes("does not")
            ) {
              setProgressMsgs((m) => [...m, { msg, alert: "error" }]);
              setIsGenerating(false);
              return;
            } else {
              setProgressMsgs((m) => [...m, { msg, alert: "error" }]);
              onGenerateVoiceCover();
            }
          } else if (event.stage === "pending") {
            const _progressData = event?.progress_data?.at(0);
            setGenerationProgress((_progressData?.progress || 0.05) * 100);
            if (_progressData?.desc) {
              const msg = _progressData.desc;
              setProgressMsgs((m) => [...m, { msg, alert: "success" }]);
            }
          }
          if (event.size) {
            setQueueData(`${(event.position ?? 0) + 1}/${event.size}`);
          }
          if (event.stage === "pending" && event.eta) {
            // setEta(event.eta);
          }
        });
        // Save Voice Models
        if (voiceModelProps.url) {
          try {
            await createVoiceModelDoc(voiceModelProps.name, userId, {
              // size,
              model_url: voiceModelProps.url,
              // ||
              // `https://${userName}-${spaceId}.hf.space/file=${_modelObj.uploadFileUrl}`,
              model_name: voiceModelProps.name,
              user_id: userId,
              userName,
            });
          } catch (e) {
            console.error(e);
          }
        }
        // try {
        //   const modelSizeFormData = new FormData();
        //   modelSizeFormData.append("url", voiceModelProps.url);
        //   const modelSizeRes = await axios.post(
        //     `${import.meta.env.VITE_AUDIO_ANALYSER_PY}/model-size`,
        //     modelSizeFormData
        //   );
        //   const size = modelSizeRes.data.size;
        //   await createVoiceModelDoc(voiceModelProps.name, userId, {
        //     size,
        //     model_url: voiceModelProps.url,
        //     model_name: voiceModelProps.name,
        //     user_id: userId,
        //     userName,
        //   });
        // } catch (e) {
        //   // setErrorSnackbarMessage("Error with the model download url");
        // }
        // TODO: Blockchain hash
        // try {
        //   const res = await axios.post(
        //     `${import.meta.env.VITE_BLOCKCHAIN_SERVER}/deploy-model-contract`,
        //     {
        //       user_id: userId,
        //       model_url: _modelObj.url,
        //       model_name: _modelObj.name,
        //     }
        //   );
        //   setTxHash(res.data.txHash);
        // } catch (e) {}
      } catch (e: any) {
        console.log(e.message);
      }
    }

    // 8: Download Model
    // {"data":["https://huggingface.co/QuickWick/Music-AI-Voices/resolve/main/The%20Weeknd%20(RVC)%201k%20Epoch/The%20Weeknd%20(RVC)%201k%20Epoch.zip","Weeknd"],"event_data":null,"fn_index":8,"session_hash":"t6dc35uqlup"}
    // Response: result.data[0] -> '[+] diobrando Model successfully downloaded!'
    // 5: Model Choices Dropdown
    // Response: result.data[0].choices -> [['Weeknd', 'Weeknd'], ['diobrando', 'diobrando']]
    // 6: Generate
    // {"data":["https://www.youtube.com/watch?v=UKxf74oK9-Q","Weeknd",0,false,1,0,0,0,0.5,3,0.25,"rmvpe",128,0.33,0,0.15,0.2,0.8,0.7,"mp3"],"event_data":null,"fn_index":6,"session_hash":"t6dc35uqlup"}
    // Response: result.data[0].name: "/tmp/gradio/1130f624ea6fd895687173c8c32affbbd9eb3bc8/Perfect Status  Ed Sheeran  Whatsapp Status  trump Ver.mp3"
    // 0: Generate with upload
    // {"data":[{"name":"/tmp/gradio/845f77312dbe62450452cca0181ea6fca735676a/noreturn_chorus_16s 1.wav","size":512078,"data":"","orig_name":"noreturn_chorus_16s (1).wav","is_file":true}],"event_data":null,"fn_index":0,"session_hash":"yw4turma3s"}
    // {"msg":"process_completed","output":{"data":[{"orig_name":"noreturn_chorus_16s 1.wav","name":"/tmp/gradio/8db15c9c74acd78c78be88ff4d2c6a16b9099eb2/noreturn_chorus_16s 1.wav","size":512078,"data":null,"is_file":true},{"value":"/tmp/gradio/8db15c9c74acd78c78be88ff4d2c6a16b9099eb2/noreturn_chorus_16s 1.wav","__type__":"update"}],"is_generating":false,"duration":0.0005247592926025391,"average_duration":0.0005247592926025391},"success":true}
  };

  const hashAndDownload = async () => {
    if (txHash) {
      const res = await axios.post(
        `${import.meta.env.VITE_AUDIO_ANALYSER_PY}/encode-hash`,
        { hash: txHash },
        { responseType: "blob" }
      );
      const hashedBlob = new Blob([res.data]);
      setHashedAudioUrl(URL.createObjectURL(hashedBlob));
      return hashedBlob;
    }
  };

  useEffect(() => {
    if (coverUrl) {
      (async () => {
        const res = await axios.get(coverUrl, {
          responseType: "blob",
          headers: { Authorization: `Bearer ${hfToken}` },
        });
        const blob = new Blob([res.data]);
        setLocalCoverUrl(URL.createObjectURL(blob));
      })();
    }
  }, [coverUrl]);

  useEffect(() => {
    if (hfToken && userName && spaceId) {
      checkSpace();
      // getModelChoices();
    }
  }, [hfToken, userName, spaceId]);
  
  useEffect(() => {
    if (showSettings) {
      checkSpace();
      // getModelChoices();
    }
  }, [showSettings]);

  useEffect(() => {
    if (!hfToken) {
      const _token = window.localStorage.getItem("HF_AT");
      if (_token) {
        setEnteredAccessToken(_token);
      } else {
        setShowAccountSetup(true);
      }
    }
  }, []);

  // useEffect(() => {
  //   if (enteredAccessToken) {
  //     checkUserAccessToken();
  //   }
  // }, [enteredAccessToken]);

  useEffect(() => {
    if (hfStatus === "BUILDING") {
      const intr = setInterval(() => {
        console.log("running interval");
        checkSpace();
      }, 15000);
      return () => clearInterval(intr);
    } else if (hfStatus === "RUNNING" && generateAfterRestart) {
      setGenerateAfterRestart(false);
      onGenerateVoiceCover();
    }
  }, [hfStatus]);

  useEffect(() => {
    if (queueData) {
      const [pos, size] = queueData.split("/");
      if (parseInt(size) > 1) {
        setErrorSnackbarMessage(
          "Multiple requests are being processed, progress will be slow. Pause and Start the space again to dicard the process"
        );
      }
    }
  }, [queueData]);

  return (
    <Box px={{ xs: "5%", md: "10%", lg: "13%" }}>
      <Stack alignItems={"center"} pt={3} pb={6} gap={2}>
        <Box>
          <Box display="flex" justifyContent={"center"} mb={1}>
            <img src="/nusic_purple.png" width={155} alt="" />
          </Box>
          <Typography variant="body2">Unlocking AI Music</Typography>
        </Box>
        <Badge badgeContent={!!settingsAlert ? "!" : 0} color="warning">
          <Chip
            clickable
            label={hfStatus || "LOADING"}
            variant="outlined"
            onDelete={() => setShowSettings(true)}
            deleteIcon={<SettingsRounded />}
            color={
              hfStatus === "RUNNING"
                ? "success"
                : hfStatus === "BUILDING" || !hfStatus
                ? "warning"
                : "error"
            }
            onClick={() => setShowSettings(true)}
          />
        </Badge>
      </Stack>
      <Stack gap={2}>
        {/* <Box display={"flex"} justifyContent="center" alignItems="center">
          <Box width={400} display="flex">
            <FormControl fullWidth>
              <InputLabel>Voice Models</InputLabel>
              <Select
                label="Voice Models"
                color="info"
                value={selectedArtist}
                onChange={(e) => setSelectedArtist(e.target.value as string)}
              >
                {!!voiceModelChoices?.length && (
                  <MyListSubheader muiSkipListHighlight>Loaded</MyListSubheader>
                )}

                {!!voiceModelChoices?.length &&
                  voiceModelChoices.map(([key]) => (
                    <MenuItem value={key} key={key}>
                      {key}
                    </MenuItem>
                  ))}
                {!!voiceModelChoices?.length && (
                  <MyListSubheader muiSkipListHighlight>
                    Available Links
                  </MyListSubheader>
                )}
                {voiceCoverLinks.map((key) => (
                  <MenuItem value={key} key={key}>
                    {key}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Box> */}
        {/* <Box
          display={"flex"}
          justifyContent="center"
          alignItems="center"
          my={2}
          mx={1}
          gap={2}
          flexWrap="wrap"
        >
          {Object.entries(voiceCoverMap).map(([key, value]) => (
            <Stack gap={2} key={key} alignItems="center">
              <IconButton
                onClick={() => {
                  if (selectedArtist === key) setSelectedArtist("");
                  else setSelectedArtist(key);
                }}
              >
                <img
                  src={`https://firebasestorage.googleapis.com/v0/b/nusic-dao-website.appspot.com/o/voice_cover_pics%2F${key}.${value[1]}?alt=media`}
                  alt=""
                  width={100}
                  height={100}
                  style={{
                    objectFit: "contain",
                    borderRadius: "50%",
                    border: "2px solid",
                    borderColor: selectedArtist === key ? "#66bb6a" : "#c3c3c3",
                  }}
                />
              </IconButton>
              <Typography
                sx={{ textTransform: "uppercase" }}
                color={key === selectedArtist ? "#66bb6a" : "#fff"}
              >
                {key}
              </Typography>
            </Stack>
          ))}
        </Box> */}
        <VoiceModelSelection
          voiceModelProps={voiceModelProps}
          setVoiceModelProps={setVoiceModelProps}
          userId={userId}
          onDropZipFile={onDropZipFile}
        />
        <Box
          // mt={10}
          width="100%"
          display={"flex"}
          justifyContent="center"
          flexWrap={"wrap"}
          gap={2}
          // sx={{ bgcolor: "rgb(20, 20, 20)" }}
          // p={5}
          // borderRadius="16px"
        >
          <Box
            flexBasis={{ xs: "100%", md: "58%" }}
            display="flex"
            alignItems={"center"}
          >
            <TextField
              id="youtubelink"
              fullWidth
              sx={{
                ".MuiInputBase-root": {
                  borderRadius: "8px",
                },
                ".MuiOutlinedInput-notchedOutline": {
                  borderColor: "#929292",
                },
              }}
              label="Youtube Link"
              color="secondary"
              value={youtubeLink}
              onChange={(e) => {
                // if (!isGenerating) {
                setYoutubeLink(e.target.value);
                setInputSongUrl(e.target.value);
                setUploadedFile(undefined);
                // }
              }}
            />
          </Box>
          <Box flexBasis={{ xs: "100%", md: "38%" }}>
            <Uploader
              onDrop={onDropMusicUpload}
              melodyFile={uploadedFile}
              initializeTone={() => {}}
              playAudio={() => {}}
              vid={""}
            />
          </Box>
        </Box>
        <Box
          display={"flex"}
          justifyContent="center"
          my={4}
          alignItems="center"
          gap={1}
        >
          <LoadingButton
            disabled={isUploadingZip}
            loading={isGenerating}
            onClick={onGenerateVoiceCover}
            sx={{
              background:
                "linear-gradient(90deg, rgba(84,50,255,1) 0%, rgba(237,50,255,1) 100%)",
              color: "white",
              px: 2.5,
              ".MuiLoadingButton-loadingIndicator": {
                color: "#fff",
              },
            }}
            size="large"
            startIcon={<AutoAwesomeRoundedIcon />}
          >
            Generate
          </LoadingButton>
          {/* <Button
            onClick={async () => {
              const formData = new FormData();
              formData.append("delete_space_id", getSpaceId(userName, spaceId));
              formData.append("space_id", `nusic/${spaceId}`);
              formData.append("hf_token", hfToken);
              await axios.post(
                `${
                  import.meta.env.VITE_AUDIO_ANALYSER_PY
                }/delete-duplicate-space`,
                formData
              );
              resetState();
              setGenerateAfterRestart(true);
              await checkSpace();
            }}
          >
            Test
          </Button> */}
          {queueData !== "1/1" && !!queueData && (
            <Typography variant="caption" color={"red"}>
              {queueData}
            </Typography>
          )}
        </Box>
        {/* {!!eta && (
          <Box display={"flex"} justifyContent="center">
            <Typography>ETA: {eta}</Typography>
          </Box>
        )} */}
        <Stack alignItems={"center"} gap={1}>
          {progressMsgs.map(({ msg, alert }) => (
            <Alert
              key={msg}
              icon={
                alert === "success" ? (
                  <CheckIcon fontSize="inherit" />
                ) : (
                  <CloseIcon fontSize="inherit" />
                )
              }
              severity={alert}
            >
              {msg}
            </Alert>
            // <Typography key={msg}>{msg}</Typography>
          ))}
        </Stack>
        <Box display={"flex"} justifyContent="center">
          {!!generationProgress && (
            <Box width={400}>
              <LinearProgress
                color="info"
                variant="determinate"
                value={generationProgress}
                sx={{
                  height: 20,
                  borderRadius: 5,
                  [`&.MuiLinearProgress-root`]: {
                    backgroundColor: "rgb(66, 66, 66)",
                  },
                  [`& .MuiLinearProgress-bar`]: {
                    borderRadius: 5,
                    backgroundColor: "#1a90ff",
                  },
                }}
              />
            </Box>
          )}
          {coverUrl && (
            <Box>
              <div ref={containerRef} />
              {/* <div id={"wave-spectrogram"} /> */}
              <Box display={"flex"} justifyContent="center" gap={2} pt={2}>
                <Button
                  onClick={() => wavesurfer?.playPause()}
                  variant="outlined"
                  color="info"
                >
                  <PlayRounded />
                  <PauseRounded />
                </Button>
                <IconButton
                  onClick={async () => {
                    let _url = hashedAudioUrl;
                    if (!_url) {
                      const blob = await hashAndDownload();
                      if (blob) _url = URL.createObjectURL(blob);
                    }
                    const a = document.createElement("a");
                    a.href = _url ? _url : localCoverUrl;
                    a.download = `${voiceModelProps.name}_nusic_cover.mp3`; //TODO: get youtube song name
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                  }}
                >
                  <DownloadRounded color="info" />
                </IconButton>
              </Box>
            </Box>
          )}
        </Box>
      </Stack>
      <Settings
        checkSpace={checkSpace}
        cpuSpaceAvailable={cpuSpaceAvailable}
        enteredAccessToken={enteredAccessToken}
        gpuSpaceAvailable={gpuSpaceAvailable}
        hfStatus={hfStatus}
        hfToken={hfToken}
        setEnteredAccessToken={setEnteredAccessToken}
        setErrorSnackbarMessage={setErrorSnackbarMessage}
        setSettingsLoading={setSettingsLoading}
        setShowSettings={setShowSettings}
        setSnackbarMessage={setSnackbarMessage}
        setSpaceId={setSpaceId}
        settingsAlert={settingsAlert}
        settingsLoading={settingsLoading}
        showAccountSetup={showAccountSetup}
        showSettings={showSettings}
        spaceId={spaceId}
        userName={userName}
        hfHardwareInfo={hfHardwareInfo}
      />
      <Snackbar
        open={!!snackbarMessage}
        message={snackbarMessage}
        onClose={() => setSnackbarMessage("")}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      />

      <Snackbar
        open={!!errorSnackbarMessage}
        color="error"
        onClose={() => setErrorSnackbarMessage("")}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setErrorSnackbarMessage("")}
          severity="error"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {errorSnackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default App;
