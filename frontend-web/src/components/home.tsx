import { Box, Grid } from "@mui/material"
import React, { useEffect } from "react"
import { Link as RouterLink } from "react-router-dom"
import { generateColorMode } from "./utils/enable-dark-mode"
import { useAuthContext } from "../context/auth-context"
import { useLoaderContext } from "../context/loader-context"
import { useThemeContext } from "../context/theme-context"

export const HomeComponent = (): JSX.Element => {
	const { theme } = useThemeContext()
	const { user } = useAuthContext()
	const { setLoading } = useLoaderContext()

	useEffect(() => {
		document.title = "Home | TokTu"
		setLoading(false)
	}, [setLoading])
	const rootElement = document.getElementById("root")
	if (rootElement !== null) {
		rootElement.style.backgroundColor = theme === "dark" ? "#202225" : "white"
	}
	return (
		<div className={generateColorMode(theme) + " homeBackground"}
			style={{
				height: "calc(100% - 64px)",
				textAlign: "center",
			}}>
			<Box p={2}>
				<Grid container spacing={2}>

					<Grid item xs={12}>
						<Box m={5} ml={19}>
							{theme === "dark" ? <img src="../../gifLoginToktuDark.gif" alt="Logo de la página" width="300"></img> : <img src="../../gifLoginToktuLight.gif" alt="Logo de la página" width="300"></img>}
						</Box>
						<h3>Bienvenid@{user ? " " + user.firstName : ""}!</h3>
						{
							user
								? <p>Tienes 0 <RouterLink
								className={"lnks clrcstm"} to={"/t/messages"}><span>mensajes</span></RouterLink>  no leídos.</p>
								: <div>Bienvenido a TokTu, registrate <RouterLink
									className={"lnks clrcstm"} to={"/register"}><span>aquí</span></RouterLink>  
									{/* y a disfrutar... */}
								</div>
						}
					</Grid>
				</Grid>
			</Box>
		</div>
	)
}
