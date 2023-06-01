import React from "react"
import CommentsDisabledIcon from "@mui/icons-material/CommentsDisabled"
import { Box } from "@mui/material"

export const NoDataComponent = (): JSX.Element => {
  return (
    <Box margin={0} height={"100%"} width={"100%"} display={"flex"} justifyContent={"center"} flexDirection={"column"}
	    textAlign={"center"}>
	 <div style={{ textAlign: "center" }}>
	   <CommentsDisabledIcon fontSize={"large"}/>
	 </div>
	 <h3>No se ha seleccionado ninguna conversación. Puedes abrir una o crear una nueva conversación.</h3>
    </Box>
  )
}
