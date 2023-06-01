import { TextField } from "@mui/material"
import React, { FunctionComponent } from "react"
import styled from "@emotion/styled"
import { useThemeContext } from "../../context/theme-context"

const StyledComp = styled(TextField, {
  shouldForwardProp: (prop) => prop !== "color" && prop !== "myProp",
})<{ myProp: string }>(({
  myProp,
}) => ({
  // Este caso es para cuando se hace foco en el label
  "& label.Mui-focused": {
    color: myProp === "dark" ? "white" : "gray",
  },
  // Este caso es para la letra dentro del input
  "& .MuiInputLabel-formControl": {
    color: myProp === "dark" ? "white" : "gray",
  },
  // Este caso es para el color del subrayado del input
  "& .MuiInput-underline": {
    color: myProp === "dark" ? "white" : "gray",
  },
  // Este caso es para el color del texto de entrada del input
  "& .MuiOutlinedInput-input": {
    color: myProp === "dark" ? "white" : "black",
  },
  // A partir de aquí se establecen los estilos del contenedor del input
  "& .MuiOutlinedInput-root": {
    // Este caso es cuando esta sin foco el input
    "& fieldset": {
	  borderColor: myProp === "dark" ? "rgb(5, 229, 223, 0.5)" : "rgb(5, 229, 223, 0.5)",
    //borderRadius: "15px",
    },
    // Este caso es cuando se le hace hover al input
    "&:hover fieldset": {
	 borderColor: myProp === "dark" ? "#05E5DF" : "#05E5DF",
    },
      // Este caso es cuando se le hace foco al input
    "&.Mui-focused fieldset": {
      borderColor: myProp === "dark" ? "#05E5DF" : "#05E5DF",
      //backgroundColor: myProp === "dark" ? "#202225" : "white",
      color: myProp === "dark" ? "white" : "#202225",
    },
    // "& input:-internal-autofill-selected": {
    //   backgroundColor: myProp === "dark" ? "#202225" : "white",
    // },
    // "&.MuiAutocomplete-inputRoot": {
    //   borderColor: myProp === "dark" ? "#05E5DF" : "#05E5DF",
    //   backgroundColor: myProp === "dark" ? "#202225" : "white",
    //   color: myProp === "dark" ? "white" : "#202225",
    // },
  },
}))

interface ICustomMaterialTextField {
  id: string | undefined
  label: string
  value: string
  name: string
  isMultiline: boolean
  type: "password" | "text"
  handleChange: (event: any) => void
  isDarkModeEnable: string
  onClick?: () => void
  keyUp?: (event: any) => void
  keyDown?: (event: any) => void
}

export const CustomTextField: FunctionComponent<ICustomMaterialTextField> = (props) => {
  const { theme } = useThemeContext()

  const handleChange = (event: any) => {
    props.handleChange(event)
  }

  const submitForm = (event: any) => {
    if (props.keyUp !== undefined) {
	 props.keyUp(event)
    }
    if (props.keyDown !== undefined) {
	 props.keyDown(event)
    }
  }

  return (
    <React.Fragment>
	 <StyledComp
	   myProp={theme}
	   id={props.id}
	   label={props.label}
	   variant="outlined"
	   fullWidth
	   value={props.value}
	   autoFocus={false}
	   maxRows={4}
	   multiline={props.isMultiline}
	   name={props.name}
	   onClick={props.onClick}
	   onChange={handleChange}
	   type={props.type}
	   onKeyUp={(event) => submitForm(event)}
	   onKeyDown={(event) => submitForm(event)}
     InputProps={{
      //step: 300, // 5 min
      style: {
        borderRadius: "15px",
        //backgroundColor: theme === "dark" ? "#22" : "white",
        },
    }}
	 />
    </React.Fragment>
  )
}
