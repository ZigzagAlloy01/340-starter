const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const utilities = require("../utilities/")
const regValidate = require('../utilities/account-validation')

// Ruta para la página de inicio de sesión
router.get("/login", utilities.handleErrors(accountController.buildLogin))

// Ruta para la página de registro de usuario
router.get("/signup", utilities.handleErrors(accountController.buildSignup))

// Ruta para el registro de un nuevo usuario (POST)
router.post(
  "/signup",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount) 
)

module.exports = router