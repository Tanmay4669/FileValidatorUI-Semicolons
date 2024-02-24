import { Box, CircularProgress, Modal, colors } from "@mui/material"

export const Loader=(props)=>{
    const {isLoading}=props;
    return <Modal
    open={isLoading}
    backdrop="static"
    aria-labelledby="modal-add-title"
  >
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform:"translate(-50%, -50%)",
        width: "150px",
        backgroundColor: "transparant",
        padding: "10px",
      }}
      width="100px"
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress size={70} sx={{color: "#020381"}} />
      </Box>
    </Box>
  </Modal>
} 