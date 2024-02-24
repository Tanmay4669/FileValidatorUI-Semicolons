import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  Stack,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
export const DialogBox = (props) => {
  const { open, onClick } = props;
  return (
    <Dialog open={open} minWidth={70}>
      <DialogContent>
        <Stack gap={2} width={"100%"}>
          <Box display={"flex"} justifyContent={"center"}>
            <Avatar sx={{ bgcolor: "white", border: "2px solid lightgray" }}>
              <CheckIcon color="success" />
            </Avatar>
          </Box>
          <Box>Validation Successful</Box>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          color="primary"
          sx={{color: "white", backgroundColor:"#020381"}}
          variant="contained"
          size="small"
          onClick={onClick}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
