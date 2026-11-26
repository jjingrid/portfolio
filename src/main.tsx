import * as React from "react"
import { createRoot } from "react-dom/client"
import App from "./App"
import { startRouter } from "./lib/router"
import "./styles.css"

startRouter()
createRoot(document.getElementById("root")!).render(<App />)
