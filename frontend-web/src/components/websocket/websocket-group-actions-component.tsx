import {
	Collapse,
	IconButton,
	List,
	ListItem, ListItemButton,
	ListItemIcon,
	ListItemSecondaryAction,
	ListItemText,
	MenuItem,
	Tooltip
} from "@mui/material"
import { ExpandLess } from "@mui/icons-material"
import SecurityIcon from "@mui/icons-material/Security"
import ExpandMore from "@mui/icons-material/ExpandMore"
import PersonIcon from "@mui/icons-material/Person"
import GroupAddIcon from "@mui/icons-material/GroupAdd"
import GroupIcon from "@mui/icons-material/Group"
import MoreHorizIcon from "@mui/icons-material/MoreHoriz"
import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { GroupActionEnum } from "./group-action-enum"
import { useAuthContext } from "../../context/auth-context"
import { useThemeContext } from "../../context/theme-context"
import {
	generateClassName,
	generateIconColorMode
} from "../utils/enable-dark-mode"
import { StoreState } from "../../reducers/types"
import { useWebSocketContext } from "../../context/ws-context"
import { TransportModel } from "../../interface-contract/transport-model"
import { TransportActionEnum } from "../../utils/transport-action-enum"
import { AllUsersDialog } from "../partials/all-users-dialog"
import { HttpService } from "../../service/http-service"
import { GroupUserModel } from "../../interface-contract/group-user-model"
import { setAlerts } from "../../reducers"

export const WebSocketGroupActionComponent: React.FunctionComponent<{ groupUrl: string }> = ({ groupUrl }) => {
	const [paramsOpen, setParamsOpen] = useState(false)
	const [popupOpen, setPopupOpen] = useState(false)
	const [usersInConversation, setUsersInConversation] = useState<GroupUserModel[]>([])
	const [allUsers, setAllUsers] = useState<GroupUserModel[]>([])
	const [isCurrentUserAdmin, setCurrentUserIsAdmin] = useState(false)
	const [toolTipAction, setToolTipAction] = useState(false)
	const [openTooltipId, setToolTipId] = useState<number | null>(null)
	const [loadingContacts, setLoadingContacts] = useState(false)
	const [loadingMembers, setLoadingMembers] = useState(false)
	const [addingUser, setAddingUser] = useState(false)
	const [deletingMember, setDeletingMember] = useState(false)
	const [grantingAdmin, setGrantingAdmin] = useState(false)
	const [removingAdmin, setRemovingAdmin] = useState(false)
	const [leavingGroup, setLeavingGroup] = useState(false)

	const { theme } = useThemeContext()
	const dispatch = useDispatch()
	const { ws } = useWebSocketContext()
	const httpService = new HttpService()
	const { user } = useAuthContext()

	// Obtener el grupo activo actual y los grupos disponibles del estado global
	const {
		currentActiveGroup,
		groups
	} = useSelector((state: StoreState) => state.globalReducer)

	// Limpia los datos cuando el grupo activo actual cambia o el componente se desmonta
	useEffect(() => {
		clearData()
		return () => {
			clearData()
		}
	}, [currentActiveGroup])

	// Maneja las acciones de los tooltips
	function handleTooltipAction(event: any, action: string) {
		event.preventDefault()
		if (action === GroupActionEnum.OPEN) {
			setToolTipAction(true)
		}
		if (action === GroupActionEnum.CLOSE) {
			setToolTipAction(false)
			setToolTipId(null)
		}
	}

	// Limpia los datos del componente
	function clearData() {
		setAllUsers([])
		setToolTipAction(false)
		setToolTipId(null)
		setCurrentUserIsAdmin(false)
		setUsersInConversation([])
		handlePopupState(false)
		setParamsOpen(false)
	}

	// Maneja la acción de mostrar un usuario específico
	function handleDisplayUserAction(event: any, id: number) {
		event.preventDefault()
		setToolTipId(id)
	}

	// Cierra la acción de mostrar un usuario específico
	function closeDisplayUserAction(event: any) {
		event.preventDefault()
		setToolTipAction(false)
		setToolTipId(null)
	}

	// Maneja el clic en diferentes acciones del grupo
	async function handleClick(event: React.MouseEvent<HTMLElement>, action: string) {
		event.preventDefault()

		switch (action) {
			// Acción de parámetros del grupo
			case GroupActionEnum.PARAM:
				// Si no se han cargado los usuarios en conversación, se obtienen del servidor
				if (usersInConversation.length === 0) {
					setLoadingMembers(true)
					const res = await httpService.fetchAllUsersInConversation(groupUrl)
					res.data.forEach((groupUserModel) => {
						// Verifica si el usuario actual es administrador del grupo
						if (groupUserModel.userId === user?.id && groupUserModel.admin) {
							setCurrentUserIsAdmin(true)
						}
					})
					setUsersInConversation(res.data)

				}
				// Cambia el estado de apertura de los parámetros del grupo
				setParamsOpen(!paramsOpen)
				setLoadingMembers(false)
				break
			default:
				throw new Error("Error, por favor actualiza la página.")
		}
	}

	// Maneja el estado del cuadro emergente
	function handlePopupState(isOpen: boolean) {
		setPopupOpen(isOpen)
	}

	// Maneja la acción de agregar un usuario al grupo
	async function handleAddUserAction(action: string) {
		switch (action) {
			// Abre el cuadro emergente de agregar usuario y carga los usuarios disponibles del servidor
			case GroupActionEnum.OPEN:
				handlePopupState(true)
				setLoadingContacts(true)
				try {
					const res = await httpService.fetchAllUsersWithoutAlreadyInGroup(groupUrl)
					setAllUsers(res.data)
				} catch (error) {
					dispatch(setAlerts({
						alert: {
							text: "Error al obtener los usuarios. Por favor, inténtalo de nuevo más tarde.",
							alert: "error",
							isOpen: true
						}
					}))
				} finally {
					setLoadingContacts(false)
				}
				break
			// Cierra el cuadro emergente de agregar usuario
			case GroupActionEnum.CLOSE:
				handlePopupState(false)
				break
			default:
				throw new Error("No se pudo agregar el Usuario")
		}
	}

	// Maneja la acción de salir del grupo
	function leaveGroup(userId: number) {
		setLeavingGroup(true)
		if (ws) {
			const transport = new TransportModel(userId, TransportActionEnum.LEAVE_GROUP, undefined, groupUrl)
			ws.publish({
				destination: "/app/message",
				body: JSON.stringify(transport)
			})
		}
		setLeavingGroup(false)
	}

	// Maneja la acción de eliminar un usuario de la lista de administradores en la conversación
	async function removeUserFromAdminListInConversation(userId: string | number) {
		setRemovingAdmin(true)
		try {
			const res = await httpService.removeAdminUserInConversation(userId, groupUrl)
			const users = [...usersInConversation]
			const user = users.find((elt) => elt.userId === userId)
			if (user) {
				user.admin = false
			}
			setUsersInConversation(users)
			dispatch(setAlerts({
				alert: {
					text: res.data,
					alert: "success",
					isOpen: true
				}
			}))
		} catch (err) {
			dispatch(setAlerts({
				alert: {
					text: "No se pueden eliminar los derechos de usuario. Por favor, inténtalo de nuevo más tarde.",
					alert: "error",
					isOpen: true
				}
			}))
		}
		setRemovingAdmin(false)
	}

	// Maneja la acción de otorgar permisos de administrador a un usuario en la conversación
	async function grantUserAdminInConversation(userId: number | string) {
		setGrantingAdmin(true)
		try {
			const res = await httpService.grantUserAdminInConversation(userId, groupUrl)
			dispatch(setAlerts({
				alert: {
					text: res.data,
					alert: "success",
					isOpen: true
				}
			}))
			const users = [...usersInConversation]
			const user = users.find((elt) => elt.userId === userId)
			if (user) {
				user.admin = true
			}
			setUsersInConversation(users)
		} catch (err) {
			dispatch(setAlerts({
				alert: {
					text: "No se puede otorgar permisos al usuario. Por favor, inténtalo de nuevo más tarde.",
					alert: "error",
					isOpen: true
				}
			}))
		}
		setGrantingAdmin(false)
	}

	// Maneja la acción de agregar un usuario a la conversación del grupo
	async function addUserInConversation(userId: string | number) {
		setAddingUser(true)
		try {
			const res = await httpService.addUserToGroup(userId, groupUrl)
			const users = [...usersInConversation]
			users.push(res.data)
			setUsersInConversation(users)
			dispatch(setAlerts({
				alert: {
					text: `${res.data.firstName} ha sido agregado al grupo.`,
					alert: "success",
					isOpen: true
				}
			}))
		} catch (err: any) {
			dispatch(setAlerts({
				alert: {
					text: `No se puede agregar al usuario al grupo : ${err.toString()}`,
					alert: "error",
					isOpen: true
				}
			}))
		} finally {
			setPopupOpen(false)
		}
		setAddingUser(false)
	}

	// Maneja la acción de eliminar un usuario de la conversación del grupo
	async function removeUserFromConversation(userId: string | number) {
		setDeletingMember(true)
		try {
			const res = await httpService.removeUserFromConversation(userId, groupUrl)
			dispatch(setAlerts({
				alert: {
					text: res.data,
					alert: "success",
					isOpen: true
				}
			}))
			const users = [...usersInConversation]
			const index = users.findIndex((elt) => elt.userId === userId)
			users.splice(index, 1)
			setUsersInConversation(users)
		} catch (err: any) {
			dispatch(setAlerts({
				alert: {
					text: `No se puede eliminar al usuario del grupo : ${err.toString()}`,
					alert: "error",
					isOpen: true
				}
			}))
		}
		setDeletingMember(false)
	}

	return (
		<div>
			{/* Barra lateral */}
			<div className={"sidebar"}>
				<List
					component="nav">
					{/* Botón "Agregar usuario al grupo" */}
					<ListItemButton disabled={groups.length === 0 || !currentActiveGroup || loadingMembers || addingUser || deletingMember || grantingAdmin || removingAdmin ||leavingGroup}
						onClick={() => handleAddUserAction(GroupActionEnum.OPEN)}>
						<ListItemIcon>
							<GroupAddIcon style={{ color: generateIconColorMode(theme) }} />
						</ListItemIcon>
						<ListItemText primary="Agregar usuario al grupo" />
					</ListItemButton>
					{/* Botón "Miembros" */}
					<ListItemButton disabled={groups.length === 0 || !currentActiveGroup || loadingMembers || addingUser || deletingMember || grantingAdmin || removingAdmin || leavingGroup}
						onClick={(event) => handleClick(event, GroupActionEnum.PARAM)}>
						<ListItemIcon>
							<GroupIcon style={{ color: generateIconColorMode(theme) }} />
						</ListItemIcon>
						<ListItemText primary="Miembros" />
						{paramsOpen ? <ExpandLess /> : <ExpandMore />}
					</ListItemButton>
					{/* Lista de miembros */}
					{loadingMembers &&
						<div style={{ margin: "1% 0 0 17%" }}>Cargando Miembros...</div>}
					<Collapse in={paramsOpen}>


						<List component="div" disablePadding>
							{paramsOpen && usersInConversation.map((value, index) => (
								<ListItem key={index} disabled={loadingMembers || addingUser || deletingMember || grantingAdmin || removingAdmin || leavingGroup}
									onMouseEnter={(event) => handleDisplayUserAction(event, index)}
									onMouseLeave={event => closeDisplayUserAction(event)}>
									<ListItemIcon>
										{
											value.admin
												? <SecurityIcon
													style={{ color: generateIconColorMode(theme) }} />
												: <PersonIcon
													style={{ color: generateIconColorMode(theme) }} />
										}
									</ListItemIcon>
									<ListItemText primary={value.firstName + " " + value.lastName}
										secondary={
											<React.Fragment>
												<span className={generateClassName(theme)} >
													{

														value.admin
															? "Administrador"
															: ""
													}
												</span>
											</React.Fragment>
										} />
									<ListItemSecondaryAction
										onMouseEnter={event => handleDisplayUserAction(event, index)}
										onMouseLeave={event => closeDisplayUserAction(event)}
									>
										{/* Tooltip */}
										{openTooltipId === index
											? <Tooltip
												PopperProps={{
													disablePortal: false
												}}
												onClose={event => handleTooltipAction(event, GroupActionEnum.CLOSE)}
												open={toolTipAction}
												disableFocusListener
												disableHoverListener
												disableTouchListener
												title={
													<React.Fragment>
														<div>
															{/* Opciones del tooltip */}
															{
																isCurrentUserAdmin && value.admin &&
																<MenuItem disabled={loadingMembers || addingUser || deletingMember || grantingAdmin || removingAdmin || leavingGroup}
																	onClick={() => removeUserFromAdminListInConversation(value.userId)}
																	dense={true}>Quitar administrador
																</MenuItem>
															}
															{
																isCurrentUserAdmin && !value.admin &&
																<MenuItem disabled={loadingMembers || addingUser || deletingMember || grantingAdmin || removingAdmin || leavingGroup}
																	onClick={() => grantUserAdminInConversation(value.userId)}
																	dense={true}>Designar administrador
																</MenuItem>
															}
															{
																!(user?.id === value.userId) &&
																<MenuItem disabled={loadingMembers || addingUser || deletingMember || grantingAdmin || removingAdmin || leavingGroup}
																	onClick={() => removeUserFromConversation(value.userId)}
																	dense={true}>Eliminar del grupo</MenuItem>
															}
															{
																user?.id === value.userId &&
																<MenuItem disabled={loadingMembers || addingUser || deletingMember || grantingAdmin || removingAdmin || leavingGroup}
																	onClick={() => leaveGroup(Number(value.userId))}
																	dense={true}>Abandonar grupo</MenuItem>
															}
														</div>
													</React.Fragment>
												}>
												<IconButton
													onClick={event => handleTooltipAction(event, GroupActionEnum.OPEN)}
													style={{ color: generateIconColorMode(theme) }}>
													<MoreHorizIcon />
												</IconButton>
											</Tooltip>
											: <IconButton />
										}
									</ListItemSecondaryAction>
								</ListItem>
							))}
						</List>
					</Collapse>
				</List>
			</div>
			{
				addingUser ? (
					<div style={{ margin: "1% 0 0 17%" }}>Agregando usuario...</div>
				) : (
					<AllUsersDialog
						usersList={allUsers}
						open={popupOpen}
						setOpen={handlePopupState}
						dialogTitle={"Agregar usuario a la conversación"}
						action={addUserInConversation}
					>
						{/* Mensaje de carga de usuarios */}
						{loadingContacts && <div>Cargando usuarios...</div>}
					</AllUsersDialog>
				)
			}
			{deletingMember && <div style={{ margin: "1% 0 0 17%" }}>Eliminando usuario...</div>}
			{grantingAdmin && <div style={{ margin: "1% 0 0 17%" }}>Designando Administrador...</div>}
			{removingAdmin && <div style={{ margin: "1% 0 0 17%" }}>Quitando Administrador...</div>}
			{leavingGroup && <div style={{ margin: "1% 0 0 17%" }}>Saliendo del Grupo...</div>}
		</div>
	)
}