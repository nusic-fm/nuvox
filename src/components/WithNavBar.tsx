import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import NavBar from "./NavBar";

type Props = { children: any };

const WithNavbar = ({ children }: Props) => {
  return (
    <Box display={"flex"} gap={2}>
      <NavBar />
      <Box
        // height={"calc(100vh - 100px)"}
        width="90%"
        // sx={{ overflowY: "auto" }}
        my={2}
      >
        <Box>
          <Box display="flex" justifyContent={"center"} mb={1}>
            <img src="/nusic_purple.png" width={155} alt="" />
          </Box>
          <Typography variant="body2" textAlign={"center"}>
            Streaming On Steroids
          </Typography>
        </Box>
        {children}
      </Box>
    </Box>
  );
};

export default WithNavbar;
