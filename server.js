/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/



const express = require("express")
const path = require('path')
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const expressLayouts = require("express-ejs-layouts")
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute")



/* ***********************
 * Routes
 *************************/
app.use(static)
app.use(expressLayouts)
app.use("/inv", inventoryRoute)
app.use('/public', express.static(path.join(__dirname, 'public')))
app.set("view engine", "ejs")
app.set("layout", "./layouts/layout")
app.set('view engine', 'ejs')
app.get("/", baseController.buildHome)

// Set the views directory
app.set('views', path.join(__dirname, 'views'))

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')))



/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT || 5500
const host = process.env.HOST || 'localhost'

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})

