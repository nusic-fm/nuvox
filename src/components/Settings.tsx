import RefreshRounded from "@mui/icons-material/RefreshRounded";
import { LoadingButton } from "@mui/lab";
import {
  Dialog,
  DialogTitle,
  IconButton,
  DialogContent,
  // Tabs,
  // Tab,
  Stack,
  Box,
  FormControlLabel,
  Switch,
  Chip,
  LinearProgress,
  TextField,
  // Divider,
  // FormControl,
  // InputLabel,
  // Select,
  // MenuItem,
  // Alert,
  Typography,
  // Button,
  Tooltip,
} from "@mui/material";
import { CPU_SPACE_ID, GPU_SPACE_ID, HardwareInfo } from "../App";
import CloseIcon from "@mui/icons-material/Close";
import { getSpaceId } from "../helpers/hf";
import axios from "axios";
import { useEffect, useState } from "react";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";
import RemoveRedEyeRoundedIcon from "@mui/icons-material/RemoveRedEyeRounded";

const machineTypes = {
  gpu: {
    "t4-small": "T4 small - $0.60/hour",
    "t4-medium": "T4 medium - $0.90/hour",
    "a10g-small": "A10G small - $1.05/hour",
    "a10g-large": "A10G large - $3.15/hour",
  },
  cpu: {
    "cpu-basic": "CPU basic - Free",
    "cpu-upgrade": "CPU upgrade - $0.03/hour",
  },
};

type Props = {
  showAccountSetup: boolean;
  enteredAccessToken: string;
  userName: string;
  spaceId: string;
  settingsAlert: string;
  cpuSpaceAvailable: boolean;
  setSnackbarMessage: any;
  setErrorSnackbarMessage: any;
  setEnteredAccessToken: any;
  showSettings: boolean;
  setShowSettings: any;
  hfToken: string;
  setSpaceId: any;
  gpuSpaceAvailable: boolean;
  settingsLoading: boolean;
  hfStatus: string;
  checkSpace: any;
  setSettingsLoading: any;
  hfHardwareInfo: HardwareInfo
};

const Settings = ({
  showAccountSetup,
  enteredAccessToken,
  userName,
  spaceId,
  settingsAlert,
  cpuSpaceAvailable,
  setSnackbarMessage,
  setErrorSnackbarMessage,
  setEnteredAccessToken,
  showSettings,
  setShowSettings,
  hfToken,
  setSpaceId,
  gpuSpaceAvailable,
  settingsLoading,
  hfStatus,
  checkSpace,
  setSettingsLoading,
  hfHardwareInfo
}: Props) => {
  const [selectedConfigTabIdx, setSelectedConfigTabIdx] = useState(1)
  //   () => {
  //   const idx = parseInt(window.localStorage.getItem("TAB_IDX") ?? "0");
  //   return idx;
  // });
  const [showAt, setShowAt] = useState(false);
  const [machineType, setMachineType] = useState("");
  const [machineSleepTime, setMachineSleepTime] = useState(0);

  const onStartOrPause = async () => {
    setSettingsLoading(true);
    const formData = new FormData();
    formData.append("space_id", getSpaceId(userName, spaceId));
    formData.append("hf_token", hfToken);
    if (hfStatus === "RUNNING") {
      await axios.post(
        `${import.meta.env.VITE_AUDIO_ANALYSER_PY}/pause-space`,
        formData
      );
      await checkSpace();
    } else {
      await axios.post(
        `${import.meta.env.VITE_AUDIO_ANALYSER_PY}/start-space`,
        formData
      );
      await checkSpace();
    }
    setSettingsLoading(false);
  };
  const onUpgradeSpace = async () => {
    setSettingsLoading(true);
    const formData = new FormData();
    formData.append("space_id", getSpaceId(userName, spaceId));
    formData.append("hf_token", hfToken);
    if (machineType)
        formData.append("hardware", machineType);
    if (machineSleepTime)
        formData.append("sleep_time", machineSleepTime.toString());
    try {
      await axios.post(
        `${import.meta.env.VITE_AUDIO_ANALYSER_PY}/upgrade-space`,
        formData
      );
      await checkSpace();
    } catch (e) {
      setErrorSnackbarMessage("Error upgrading, make sure billing is setup");
    } finally {
      setSettingsLoading(false);
    }
  };

  const onDuplicateSpace = async () => {
    try {
      setSettingsLoading(true);
      const formData = new FormData();
      formData.append("space_id", `nusic/${spaceId}`);
      formData.append("hf_token", hfToken);
      formData.append(
        "hardware",
        spaceId === GPU_SPACE_ID ? "t4-small" : "cpu-basic"
      );
      await axios.post(
        `${import.meta.env.VITE_AUDIO_ANALYSER_PY}/duplicate`,
        formData
      );

      setSnackbarMessage("Space is created successfully");
      await checkSpace();
      // setAccountSetupSteps(2);
    } catch (e) {
      setErrorSnackbarMessage(
        "Error occurred, kindly check if you have billing enabled"
      );
    } finally {
      setSettingsLoading(false);
    }
  };

  useEffect(() => {
    if (hfHardwareInfo.machineType || hfHardwareInfo.sleepTime) {
        setMachineType('')
        setMachineSleepTime(0)
    }
  }, [hfHardwareInfo])

  return (
    <>
      <Dialog open={showAccountSetup}>
        <DialogTitle>Welcome</DialogTitle>
        <DialogContent>
          <Stack my={1} gap={2}>
            <Stack gap={1}>
              <Box display={"flex"} alignItems="center" gap={2} width={400}>
                <TextField
                  value={enteredAccessToken}
                  label="Access Token"
                  fullWidth
                  onChange={(e) => setEnteredAccessToken(e.target.value)}
                  error={!enteredAccessToken}
                  type={showAt ? "text" : "password"}
                  disabled={settingsLoading}
                />
                <IconButton onClick={() => setShowAt(!showAt)}>
                  {showAt ? (
                    <VisibilityOffRoundedIcon />
                  ) : (
                    <RemoveRedEyeRoundedIcon />
                  )}
                </IconButton>
              </Box>
              <Box display={"flex"} gap={0.5}>
                <Typography variant="caption">
                  Create an Access Token with Role as
                </Typography>
                <Typography variant="caption" fontWeight={900}>
                  "Write"
                </Typography>
                <Typography
                  variant="caption"
                  component={"a"}
                  fontStyle="italic"
                  sx={{ textDecoration: "underline" }}
                  href="https://huggingface.co/settings/tokens?new_token=true"
                  target={"_blank"}
                >
                  here
                </Typography>
              </Box>
              {settingsLoading && <LinearProgress />}
            </Stack>
            {/* <Button
                    variant="outlined"
                    color="warning"
                    onClick={checkUserAccessToken}
                    disabled={!enteredAccessToken}
                  >
                    Validate
                  </Button> */}
          </Stack>
        </DialogContent>
      </Dialog>
      <Dialog open={showSettings} onClose={() => setShowSettings(false)}>
        <DialogTitle>Settings</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={() => {
            if (hfToken) setShowSettings(false);
          }}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <DialogContent sx={{ pt: 0 }}>
          {/* <Tabs
            textColor="secondary"
            indicatorColor="secondary"
            value={selectedConfigTabIdx}
            onChange={(e, tabIndex) => {
              setSelectedConfigTabIdx(tabIndex);
              setSpaceId(tabIndex === 0 ? GPU_SPACE_ID : CPU_SPACE_ID);
              window.localStorage.setItem("TAB_IDX", tabIndex);
            }}
          >
            <Tab value={0} label="GPU"></Tab>
            <Tab value={1} label="CPU (FREE)"></Tab>
          </Tabs> */}
          {/* {selectedConfigTabIdx === 0 &&
            (gpuSpaceAvailable ? (
              <Stack gap={2} mt={2}>
                <Box display={"flex"} alignItems="center" gap={1}>
                  <FormControlLabel
                    sx={{
                      display: "block",
                    }}
                    control={
                      <Switch
                        disabled={settingsLoading || hfStatus === "BUILDING"}
                        checked={
                          hfStatus === "RUNNING" || hfStatus === "BUILDING"
                        }
                        onChange={onStartOrPause}
                        name="loading"
                        color={
                          hfStatus === "RUNNING" || hfStatus === "BUILDING"
                            ? "success"
                            : "error"
                        }
                      />
                    }
                    label="VM"
                  />
                  <Chip
                    label={hfStatus || "--"}
                    color={
                      hfStatus === "RUNNING"
                        ? "success"
                        : hfStatus === "BUILDING"
                        ? "warning"
                        : "error"
                    }
                    size="small"
                  />
                  <IconButton
                    onClick={() => checkSpace()}
                    disabled={settingsLoading}
                  >
                    <RefreshRounded fontSize="small" />
                  </IconButton>
                </Box>
                {settingsLoading && <LinearProgress />}
                <Box display={"flex"} alignItems="center" gap={2}>
                  <TextField
                    value={hfToken}
                    label="Access Token"
                    fullWidth
                    onChange={(e) => setEnteredAccessToken(e.target.value)}
                    error={!hfToken}
                    type={showAt ? "text" : "password"}
                    color="secondary"
                  />
                  <IconButton onClick={() => setShowAt(!showAt)}>
                    {showAt ? (
                      <VisibilityOffRoundedIcon />
                    ) : (
                      <RemoveRedEyeRoundedIcon />
                    )}
                  </IconButton>
                </Box>
                <Divider />
                {hfToken && (
                  <Stack alignItems={"center"} gap={2} mt={1}>
                    <Box display={"flex"} alignItems="center" gap={2}>
                      <FormControl
                        sx={{ width: "160px" }}
                        size="small"
                        color="secondary"
                      >
                        <InputLabel id="demo-simple-select-label">
                          Machine Type
                        </InputLabel>
                        <Select
                          color="secondary"
                          label="Machine Type"
                          value={machineType ||hfHardwareInfo.machineType}
                        //   value={machineType}
                          onChange={(e) =>
                            setMachineType(e.target.value as string)
                          }
                        >
                          {Object.entries(machineTypes.gpu).map(
                            ([key, value]) => (
                              <MenuItem value={key} key={key}>
                                {value}
                              </MenuItem>
                            )
                          )}
                        </Select>
                      </FormControl>
                      <FormControl
                        sx={{ width: "160px" }}
                        size="small"
                        color="secondary"
                      >
                        <InputLabel id="demo-simple-select-label">
                          Auto Sleep
                        </InputLabel>
                        <Select
                          color="secondary"
                          label="Auto Sleep"
                          value={machineSleepTime || hfHardwareInfo.sleepTime}
                        //   value={machineSleepTime}
                          onChange={(e) =>
                            setMachineSleepTime(e.target.value as number)
                          }
                        >
                          {Object.entries({
                            1800: "30 minutes",
                            3600: "1 hour",
                            7200: "2 hours",
                            86400: "24 hours",
                          }).map(([key, value]) => (
                            <MenuItem value={key} key={key}>
                              {value}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Box>
                    <LoadingButton
                      variant="outlined"
                      color="warning"
                      loading={settingsLoading}
                      onClick={onUpgradeSpace}
                      disabled={!(machineType || machineSleepTime)}
                    >
                      Upgrade
                    </LoadingButton>
                    {!!settingsAlert && (
                      <Alert
                        color="warning"
                        variant="outlined"
                        severity="warning"
                      >
                        {settingsAlert}
                      </Alert>
                    )}
                  </Stack>
                )}
              </Stack>
            ) : (
              <Stack py={4} gap={2}>
                <Box display={"flex"} alignItems="center" gap={2}>
                  <TextField
                    value={hfToken}
                    label="Access Token"
                    fullWidth
                    onChange={(e) => setEnteredAccessToken(e.target.value)}
                    error={!hfToken}
                    type={showAt ? "text" : "password"}
                  />
                  <IconButton onClick={() => setShowAt(!showAt)}>
                    {showAt ? (
                      <VisibilityOffRoundedIcon />
                    ) : (
                      <RemoveRedEyeRoundedIcon />
                    )}
                  </IconButton>
                </Box>
                <LoadingButton
                  loading={settingsLoading}
                  variant="contained"
                  onClick={onDuplicateSpace}
                >
                  Duplicate
                </LoadingButton>
                <Box display={"flex"} gap={0.5}>
                  <Typography variant="caption">
                    Make sure the billing is setup
                  </Typography>
                  <Typography
                    variant="caption"
                    component={"a"}
                    fontStyle="italic"
                    sx={{ textDecoration: "underline" }}
                    href="https://huggingface.co/settings/billing/payment"
                    target={"_blank"}
                  >
                    here
                  </Typography>
                </Box>
              </Stack>
            ))} */}
          {selectedConfigTabIdx === 1 &&
            (cpuSpaceAvailable ? (
              <Stack gap={2}>
                <Box display={"flex"} alignItems="center" gap={1}>
                  <FormControlLabel
                    sx={{
                      display: "block",
                    }}
                    control={
                      <Switch
                        disabled={settingsLoading || hfStatus === "BUILDING"}
                        checked={
                          hfStatus === "RUNNING" || hfStatus === "BUILDING"
                        }
                        onChange={onStartOrPause}
                        name="loading"
                        color={
                          hfStatus === "RUNNING" || hfStatus === "BUILDING"
                            ? "success"
                            : "error"
                        }
                      />
                    }
                    label="VM"
                  />
                  <Chip
                    label={hfStatus || "--"}
                    color={
                      hfStatus === "RUNNING"
                        ? "success"
                        : hfStatus === "BUILDING"
                        ? "warning"
                        : "error"
                    }
                    size="small"
                  ></Chip>
                  <Tooltip title='refresh status'>
                  <IconButton
                    onClick={() => checkSpace()}
                    disabled={settingsLoading}
                  >
                    <RefreshRounded fontSize="small" />
                  </IconButton></Tooltip>
                </Box>
                <LinearProgress sx={{visibility: settingsLoading ? 'show' : 'hidden'}} />
                <Box display={"flex"} alignItems="center" gap={2}>
                  <TextField
                    value={hfToken}
                    label="Access Token"
                    fullWidth
                    onChange={(e) => setEnteredAccessToken(e.target.value)}
                    error={!hfToken}
                    type={showAt ? "text" : "password"}
                  />
                  <IconButton onClick={() => setShowAt(!showAt)}>
                    {showAt ? (
                      <VisibilityOffRoundedIcon />
                    ) : (
                      <RemoveRedEyeRoundedIcon />
                    )}
                  </IconButton>
                </Box>
                {/* <Divider />
                {hfToken && (
                  <Box display={"flex"} alignItems="center" gap={4} mt={2}>
                    <FormControl sx={{ width: "250px" }} size='small'>
                      <InputLabel id="demo-simple-select-label">
                        Machine Type
                      </InputLabel>
                      <Select size='small'
                        label="Machine Type"
                        value={hfHardwareInfo.machineType}
                        onChange={(e) => setMachineType(e.target.value)}
                      >
                        {Object.entries(machineTypes.cpu).map(
                          ([key, value]) => (
                            <MenuItem value={key} key={key}>
                              {value}
                            </MenuItem>
                          )
                        )}
                      </Select>
                    </FormControl>
                    <Button
                      variant="outlined"
                      color="warning"
                      onClick={onUpgradeSpace}
                      disabled={!machineType}
                    >
                      Upgrade
                    </Button>
                  </Box>
                )} */}
              </Stack>
            ) : (
              <Stack py={4} gap={2}>
                <Box display={"flex"} alignItems="center" gap={2}>
                  <TextField
                    value={hfToken}
                    label="Access Token"
                    fullWidth
                    onChange={(e) => setEnteredAccessToken(e.target.value)}
                    error={!hfToken}
                    type={showAt ? "text" : "password"}
                  />
                  <IconButton onClick={() => setShowAt(!showAt)}>
                    {showAt ? (
                      <VisibilityOffRoundedIcon />
                    ) : (
                      <RemoveRedEyeRoundedIcon />
                    )}
                  </IconButton>
                </Box>
                <LoadingButton
                  loading={settingsLoading}
                  variant="contained"
                  onClick={onDuplicateSpace}
                >
                  Duplicate
                </LoadingButton>
              </Stack>
            ))}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Settings;
