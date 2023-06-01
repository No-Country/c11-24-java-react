import ClearAllIcon from "@mui/icons-material/ClearAll"
import { Button, FormControlLabel, Skeleton, Switch, Toolbar, Typography, SvgIcon } from "@mui/material"
import React, { useEffect, useState } from "react"
import { useCookies } from "react-cookie"
import { Link as RouterLink, useHistory } from "react-router-dom"
import { useAuthContext } from "../../context/auth-context"
import { useThemeContext } from "../../context/theme-context"
import { HttpService } from "../../service/http-service"
import { useLocation } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { StoreState } from "../../reducers/types"
import { setAlerts } from "../../reducers"
// import { ReactComponent as btnHomeLight } from "../public/buttonHomeLight.svg"
// import { ReactComponent as btnHomeDark } from "../public/buttonHomeDark.svg"

export const HeaderComponent: React.FunctionComponent = () => {
	// Estado para controlar la visibilidad del encabezado
	const [isHeaderVisible, setHeaderVisible] = useState(true)
	// Estado para controlar si el mouse está sobre el encabezado
	const [isMouseOver, setMouseOver] = useState(false)

	// Objetos y funciones proporcionados por el contexto de autenticación
	const history = useHistory()
	const { user, setUser } = useAuthContext()

	// Estado global del loader de autenticación y grupo activo actual
	const { authLoading, currentActiveGroup } = useSelector(
		(state: StoreState) => state.globalReducer
	)

	// Contexto y función de tema
	const { theme, toggleTheme } = useThemeContext()

	// Dispatcher para acciones
	const dispatch = useDispatch()

	// Instancia del servicio HTTP
	const httpService = new HttpService()

	// Cookies
	const [cookie, setCookie] = useCookies()

	// Estado para controlar si se puede renderizar el encabezado
	const [isHeaderCouldRender, setHeaderRender] = useState<boolean>(false)

	// Ubicación actual
	const location = useLocation()

	// Efecto para determinar si se puede renderizar el encabezado o no (si el path contiene "call" no se renderiza, ya que es una llamada)
	useEffect(() => {
		const isCurrentPathVideoComponent = location.pathname.split("/")[1] !== "call"
		if (isCurrentPathVideoComponent) {
			setHeaderRender(true)
		} else {
			setHeaderRender(false)
		}
	}, [user]) //El efecto se ejecutará nuevamente cuando el valor de user cambie

	// Efecto para guardar el tema actual en las cookies
	useEffect(() => {
		setCookie("pref-theme", theme)
	}, [theme])

	// Efecto para controlar la visibilidad del encabezado al hacer scroll
	useEffect(() => {
		// Función para manejar el evento de desplazamiento
		const handleScroll = () => {
			// Obtener la posición de desplazamiento actual
			const scrollTop = window.pageYOffset || document.documentElement.scrollTop
			// Establecer la visibilidad del encabezado en función de si la posición de desplazamiento es igual a cero
			setHeaderVisible(scrollTop === 0)
		}
	
		// Agregar un event listener para el evento de desplazamiento
		window.addEventListener("scroll", handleScroll)
	
		// Limpiar el event listener cuando el componente se desmonte
		return () => {
			window.removeEventListener("scroll", handleScroll)
		}
	}, [])

	// Manejador del evento de mouse al entrar al encabezado
	const handleMouseEnter = () => {
		setMouseOver(true)
	}

	// Manejador del evento de mouse al salir del encabezado
	const handleMouseLeave = () => {
		setMouseOver(false)
	}

	// Función para cambiar el modo del tema
	function toggleThemeMode() {
		toggleTheme()
	}

	// Función para cerrar sesión del usuario
	async function logoutUser(event: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
		event.preventDefault()
		await httpService.logout()
		setUser(undefined)
		dispatch(setAlerts({
			alert: {
				text: "Has cerrado sesión correctamente",
				alert: "success",
				isOpen: true
			}
		}))
		// Redirigir al usuario a la página principal ("/")
		history.push("/")
	}

	// Función para generar el loader
	function generateLoading() {
		// Generar un arreglo de elementos a partir de [1, 2, 3, 4]
		return [1, 2, 3, 4].map((index) => (
			// Para cada elemento del arreglo, crear un div con una clave única basada en el índice
			<div key={index} style={{ margin: "0 10px 0 10px" }}>
				{/* Dentro del div, renderiza un componente Skeleton*/}
				<Skeleton height={51} width={78} />
			</div>
		))
	}

	return (
		<>
			{isHeaderCouldRender && (
				<div
					className={`${theme} ${isMouseOver ? "header-visible" : "header-hidden"}`}
					onMouseEnter={handleMouseEnter}
					onMouseLeave={handleMouseLeave}
				>
					<Toolbar
						className={"clrcstm"}
						style={{
							display: "flex",
							justifyContent: "space-between",
							borderBottom: "0.5px solid #C8C8C8"
						}}
					>
						<Typography variant="h6">
							<RouterLink className={"lnk clrcstm"} to={"/"}>
								<span
									style={{
										display: "flex",
										alignItems: "center",
										flexWrap: "wrap"
									}}
								>
									{/* <SvgIcon component={btnHomeLight} /> */}
									<ClearAllIcon />
									<span style={{ letterSpacing: "1px" }}>TokTu</span>
								</span>
							</RouterLink>
						</Typography>
						<nav className={"lnk clrcstm mnu"}>
							{authLoading && generateLoading()}
							{!authLoading && user && (
								<RouterLink className={"lnk clrcstm"} to={`/t/messages/${currentActiveGroup}`}>
									<Button className={"clrcstm"} variant="outlined" style={{ margin: "8px 12px" }}>
										Mensajes
									</Button>
								</RouterLink>
							)}
							{!authLoading && !user && (
								<RouterLink className={"lnk clrcstm"} to={"/login"}>
									<Button className={"clrcstm"} variant="outlined" style={{ marginTop: "8px" }}>
										Ingresar
									</Button>
								</RouterLink>
							)}
							{!authLoading && !user && (
								<RouterLink className={"lnk clrcstm"} to={"/register"}>
									<Button className={"clrcstm"} variant="outlined" style={{ margin: "8px 12px" }}>
										Registrarse
									</Button>
								</RouterLink>
							)}
							{!authLoading && user && (
								<RouterLink className={"lnk clrcstm"} to={"/create"}>
									<Button className={"clrcstm"} variant="outlined" style={{ margin: "8px 12px" }}>
										Crear grupo
									</Button>
								</RouterLink>
							)}
							{!authLoading && user && (
								<Button className={"clrcstm"} variant="outlined" disabled style={{ margin: "8px 12px" }}>
									{user?.firstName}
								</Button>
							)}
							{!authLoading && user && (
								<RouterLink className={"lnk clrcstm"} to={"#"}>
									<Button
										className={"clrcstm"}
										variant="outlined"
										onClick={(event) => logoutUser(event)}
										style={{ margin: "8px 12px" }}
									>
										Salir
									</Button>
								</RouterLink>
							)}
							<FormControlLabel
								control={
									<Switch
										checked={theme === "light"}
										onChange={() => toggleThemeMode()}
										name="checkedB"
										color="primary"
									/>
								}
								label={theme === "light" ? "Light " : "Dark"}
							/>
						</nav>
					</Toolbar>
				</div>
			)}
		</>
	)
}