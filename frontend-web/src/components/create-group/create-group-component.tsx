import { Button, Container, CssBaseline, Grid, Typography } from "@mui/material"
import React, { useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import { useThemeContext } from "../../context/theme-context"
import { useDispatch } from "react-redux"
import { createGroup, setAlerts } from "../../reducers"
import { CustomTextField } from "../partials/custom-material-textfield"
import { HttpService } from "../../service/http-service"

export const CreateGroupComponent = () => {
  const history = useHistory()
  const [groupName, setGroupName] = useState("")
  const [isCreatingGroup, setIsCreatingGroup] = useState(false)
  const [isButtonDisabled, setIsButtonDisabled] = useState(false)
  const { theme } = useThemeContext()
  const dispatch = useDispatch()
  const httpService = new HttpService()

  useEffect(() => {
    document.title = "Crear grupo | TokTu"
  }, [])

  const rootElement = document.getElementById("root")
  if (rootElement !== null) {
    rootElement.style.backgroundColor = theme === "dark" ? "#202225" : "white"
  }

  function handleChange(event: any) {
    event.preventDefault()
    setGroupName(event.target.value)
  }

  async function createGroupByName(event: any) {
    event.preventDefault()
    if (groupName !== "" && !isCreatingGroup) {
      setIsCreatingGroup(true)
      setIsButtonDisabled(true)
      const res = await httpService.createGroup(groupName)
      dispatch(
        setAlerts({
          alert: {
            isOpen: true,
            alert: "success",
            text: `El grupo "${groupName}" ha sido creado exitosamente.`,
          },
        })
      )
      dispatch(createGroup({ group: res.data }))
      // history.push({
      //   pathname: "/t/messages/" + res.data.url,
      // })
      window.location.href = "/t/messages/" + res.data.url
      setIsCreatingGroup(false)
      setIsButtonDisabled(false)
      // setAlerts([...alerts, new FeedbackModel(UUIDv4(), `Cannot create group "${groupName}" : ${err.toString()}`, "error", true)])
    }
  }

  function submitGroupCreation(event: any) {
    if (event.key === undefined || event.key === "Enter") {
      if (groupName === "") {
        return
      }
      createGroupByName(event)
    }
  }

  return (
    <div
      className={theme + " imageBackground"}
      style={{
        height: "calc(100% - 64px)",
        textAlign: "center",
        paddingTop: "40px",
      }}
    >
      <Container className={"clrcstm"} component="main" maxWidth="xs">
        <CssBaseline />
        <div className={"main-register-form clrcstm"}>
          <Typography className={"clrcstm"} variant="h6">
            Crea un grupo
          </Typography>
        </div>
        <div className={"clrcstm"}>
          <Grid className={"clrcstm"} container spacing={2}>
            <Grid className={"clrcstm"} item xs={12}>
              <CustomTextField
                id={"createGroupMessenger"}
                label={"Escribe un nombre para tu grupo"}
                name={"groupName"}
                handleChange={handleChange}
                value={groupName}
                type={"text"}
                keyUp={submitGroupCreation}
                isDarkModeEnable={theme}
                isMultiline={false}
              />
            </Grid>
              <Grid item xs={12}>
                <Button
                  className={"button-register-form"}
                  onClick={(event) => createGroupByName(event)}
                  fullWidth
                  variant="outlined"
                  color="primary"
                disabled={isButtonDisabled}
                >
                  Crear
                </Button>
              </Grid>
          </Grid>
        </div>
      </Container>
    </div>
  )
}