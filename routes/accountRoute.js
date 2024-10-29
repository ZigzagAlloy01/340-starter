const express = require("express")
const router = new express.Router()
const accountController = require("../controllers/accountController")
const utilities = require("../utilities/")
const regValidate = require('../utilities/account-validation')

router.get('/', utilities.checkLogin,  utilities.handleErrors(accountController.getAccountManagementView))

router.get("/login", utilities.handleErrors(accountController.buildLogin))

router.get("/signup", utilities.handleErrors(accountController.buildSignup))

router.post(
  "/signup",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount) 
)

router.post(
  "/login",
  /*regValidate.loginRules(),
  regValidate.checkLoginData,*/
  utilities.handleErrors(accountController.accountLogin)
)

module.exports = router