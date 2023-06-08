// import LockIcon from "@mui/icons-material/Lock"
import { Button, Grid, Typography, Box, FormControlLabel, Checkbox } from "@mui/material"
import React, { useEffect, useState } from "react"
import { Link, useHistory } from "react-router-dom"
import { useLoaderContext } from "../../context/loader-context"
import { useThemeContext } from "../../context/theme-context"
import { generateLinkColorMode } from "../utils/enable-dark-mode"
import { FooterComponent } from "../partials/footer-component"
import { CustomTextField } from "../partials/custom-material-textfield"
import { HttpService } from "../../service/http-service"
import { useDispatch } from "react-redux"
import { setAlerts } from "../../reducers"
import { AxiosError } from "axios"

export const LoginComponent: React.FunctionComponent = () => {
	const [username, setUsername] = useState("")
	//const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const history = useHistory()
	const dispatch = useDispatch()
	const { theme } = useThemeContext()
	const { setLoading } = useLoaderContext()
	const [rememberData, setRememberData] = useState(!!localStorage.getItem("userData"))
	const [isFormComplete, setIsFormComplete] = useState(false)

	const httpService = new HttpService()

	//Hook | Título del documento (pestaña)
	useEffect(() => {
		document.title = "Login | TOKTU"
	}, [])

	const rootElement = document.getElementById("root")
	if (rootElement !== null) {
		rootElement.style.backgroundColor = theme === "dark" ? "#202225" : "white"
	}

	useEffect(() => {
		const storedUserData = JSON.parse(localStorage.getItem("userData") ?? "{}")
		setRememberData(!!localStorage.getItem("userData"))
		setUsername(storedUserData.username || "")
		setPassword(storedUserData.password || "")
		setIsFormComplete(!!(storedUserData.username && storedUserData.password))
	}, [])

	useEffect(() => {
		if (rememberData) {
			localStorage.setItem(
				"userData",
				JSON.stringify({ username, password })
			)
		} else {
			localStorage.removeItem("userData")
		}
	}, [rememberData, username, password])

	//Actualizo el estado de email y password cuando se cambia
	function handleChange(e: any) {
		e.preventDefault()
		switch (e.target.name) {
			case "username":
				setUsername(e.target.value)
				break
			case "password":
				setPassword(e.target.value)
				break
			default:
				throw Error("Whoops ! Algo anduvo mal...")
		}
		setIsFormComplete(username !== "" && password !== "")
	}
	//verifico si se apretó enter o el evento no tiene info de tecla
	//si hay datos en los dos campos hago click en login
	function submitLogin(event: any) { // KeyboardEvent<HTMLInputElement> | undefined + ? en event (event.?)
		if (event.key === undefined || event.key === "Enter") {
			//if (!email || !password) {
			if (!username || !password) {
				return
			}
			login()
		}
	}

	//manejar el proceso de inicio de sesion
	const login = async () => {
		//inició el proceso
		setLoading(true)
		try {
			// envío solicitud al servidor
			await httpService.authenticate({
				// email,
				username,
				password
			})
			//Alertas Redux en caso exitoso (texto, tipo y estado)
			dispatch(setAlerts({
				alert: {
					text: "Estás conectado",
					alert: "info",
					isOpen: true
				}
			}))
			//redirigir en caso exitoso
			//actualizo la página una vez que se haya logueado
			//history.push("/")
			window.location.href = "/"
			if (rememberData) {
				// Guardar los datos del usuario en algún lugar (por ejemplo, en el almacenamiento local o en una cookie)
				localStorage.setItem("userData", JSON.stringify({ username, password }))
			}
		} catch (err: any) { // Error
			//Alertas Redux en caso de error (texto, tipo y estado)
			dispatch(setAlerts({
				alert: {
					text: err.message,
					alert: "error",
					isOpen: true
				}
			}))
			//Borro el formulario
			//setEmail("")
			setUsername("")
			setPassword("")
		} finally {
			//termino el proceso
			setLoading(false)
		}
	}

	return (

		<div className={theme + " imageBackground"}
			style={{
				height: "calc(100% - 64px)",
				//height: "100%"
			}}>
			<div className={"main-register-form"}>
				<div style={{
					display: "flex",
					justifyContent: "center"
				}}>
					<Box m={3}>
						{theme === "dark" ? <img src="../../toktulogoblanco.png" alt="Logo de la página" width="300"></img> : <img src="../../toktulogo.png" alt="Logo de la página" width="300"></img>}
					</Box>
				</div>
				<Typography component="h1" variant="h5">
					Hablemos!
				</Typography>
				<Box m={6}>
					<Grid container spacing={2}>
						<Grid item xs={12}>
							<CustomTextField id={"loginUsernameInput"}
								label={"Usuario"}
								name={"username"}
								value={username || JSON.parse(localStorage.getItem("userData") ?? "{}").username}
								isDarkModeEnable={theme}
								handleChange={handleChange}
								isMultiline={false}
								type={"text"}
							/>
						</Grid>
						<Grid item xs={12}>
							<CustomTextField id={"loginPasswordInput"}
								label={"Contraseña"}
								name={"password"}
								value={password || JSON.parse(localStorage.getItem("userData") ?? "{}").password}
								isDarkModeEnable={theme}
								handleChange={handleChange}
								type={"password"}
								isMultiline={false}
								keyUp={submitLogin}
							/>
						</Grid>
					</Grid>
					<Grid container justifyContent={"space-between"} style={{ marginTop: "7px" }}>
						<Grid item xs={6} style={{ display: "flex", justifyContent: "flex-start" }}>
						<FormControlLabel
								control={<Checkbox name="remember" color="primary" checked={rememberData} onChange={(e) => setRememberData(e.target.checked)} />}
							label="Recordarme"
						/>
						</Grid>
						<Grid item xs={6} style={{ display: "flex", justifyContent: "flex-end", marginTop: "10px" }}>
							<Link className={"lnks"}
								style={{ color: generateLinkColorMode(theme) }}
								to={"/forgetpassword"}>
								Olvidó su contraseña?
							</Link>
						</Grid>
					</Grid>
					<div>
						<Grid item xs={12}>
							<Button
								//disabled={email === "" || password === ""}
								disabled={!isFormComplete}
								className={"button-register-form"}
								style={{ margin: "8px 0px 10px" }} //
								onClick={(event) => submitLogin(event)}
								fullWidth
								variant="contained"
							>
								Ingresar
							</Button>
						</Grid>
						<Grid item xs={12}>
							<Link className={"button-register-form lnk"} to={"/register"}>
								<Button className={"clrcstm"} variant="contained" style={{ margin: "8px 0 10px" }} fullWidth>
									Registrarse
								</Button>
							</Link>
							{/* <Button
								disabled={!isFormComplete}
							className={"button-register-form"}
							style={{ margin: "8px 0px 10px" }}
							component={Link}
							to={"/register"}
							fullWidth
							variant="contained"
						>
							Registrarse
							</Button> */}
						</Grid>
					</div>
				</Box>
				<FooterComponent />
			</div>
		</div>
	)
}