import { createTheme, CssBaseline, ThemeProvider } from "@mui/material"
import React from "react"

type ThemeProp = {
  children: JSX.Element
}

enum themePalette {
  TURQ = "#05E5DF",
  //BLACK = "#111111",
  WHITEO = "#FFFFFFBF",
  WHITET = "#FFFFFF1F",
  //WHITE = "white",
}

const theme = createTheme({
  palette: {
    primary: {
      main: themePalette.TURQ,
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "13px",
        },
        outlined: {
          "&:hover": { 
            backgroundColor: themePalette.TURQ,
          },
          "&:disabled": { 
            backgroundColor: themePalette.WHITEO,
          },
        },
        contained: {
          "&:disabled": { 
            backgroundColor: themePalette.WHITET,
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        root: {
          "& .MuiDialog-paper": {
            borderRadius: "13px",
            backgroundColor: "#9585AA",
            color: "white",
          },
        },
        paper: {
          // Agregar estilos al contenedor del diálogo
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        },
      },
    },
  }
})

export const ThemeConfig: React.FC<ThemeProp> = ({children}) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  )
}