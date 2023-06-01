import { Alert, Collapse } from "@mui/material"
import React, { useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { StoreState } from "../../reducers/types"
import { setAllAlerts } from "../../reducers"

export const AlertComponent: React.FunctionComponent = () => {
  const { alerts } = useSelector((state: StoreState) => state.globalReducer)
  const dispatch = useDispatch()
  const timeoutRef = useRef<NodeJS.Timeout[]>([])

  function closeAlert(id?: string) {
    if (!id) {
      return
    }
    const indexToDelete = alerts.findIndex((elt) => elt.id === id)
    const allAlerts = [...alerts]
    const eltToDelete = { ...allAlerts[indexToDelete] }
    eltToDelete.isOpen = false
    allAlerts[indexToDelete] = eltToDelete
    dispatch(setAllAlerts({ allAlerts }))
  }

  useEffect(() => {
    // Función para cerrar una alerta después de 5 segundos
    function closeAlertAfterDelay(id: string) {
      const timeoutId = setTimeout(() => {
        closeAlert(id)
      }, 2000)
      timeoutRef.current.push(timeoutId)
    }

    // Cerrar todas las alertas anteriores
    timeoutRef.current.forEach((timeoutId) => clearTimeout(timeoutId))
    timeoutRef.current = []

    // Iniciar el temporizador para cada alerta
    alerts.forEach((alert) => {
      if (alert.id) {
        closeAlertAfterDelay(alert.id)
      }
    })

    // Limpiar las referencias al desmontar el componente
    return () => {
      timeoutRef.current.forEach((timeoutId) => clearTimeout(timeoutId))
    }
  }, [alerts, closeAlert])

  return (
    <div style={{
      position: "absolute",
      bottom: "2%",
      left: "1%"
    }}>
      {
        alerts.map((value) => (
          <div key={value.id} style={{ margin: "5px" }}>
            <Collapse in={value.isOpen}>
              <Alert onClose={() => closeAlert(value.id)}
                severity={value.alert}
                variant={"standard"}>
                {value.text}
              </Alert>
            </Collapse>
          </div>
        ))
      }
    </div>
  )
}
