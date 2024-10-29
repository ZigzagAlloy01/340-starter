const accountModel = require('../models/account-model')
const utilities = require('../utilities')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

async function buildLogin(req, res) {
    const grid_1 = await utilities.buildLogInView()
    let nav = await utilities.getNav()
    res.render("account/login", {
      title: "Login",
      nav,
      grid_1,
    })
}

async function buildSignup(req, res) {
  const grid_2 = await utilities.buildSignUpView()
  let nav = await utilities.getNav()
  res.render("account/signup", {
      title: "Sign Up",
      nav,
      grid_2,
      errors: null,
  })
}

async function registerAccount(req, res) {
  
  const { account_firstname, account_lastname, account_email, account_password } = req.body
  let nav = await utilities.getNav()
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }
  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    const grid_1 = await utilities.buildLogInView()
    req.flash(
      "notice",
      `Congratulations, you're registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("./account/login", {
      title: "Login",
      nav,
      grid_1
    })
  } else {
    const grid_2 = await utilities.buildSignUpView()
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("./account/signup", {
      title: "Sign Up",
      nav,
      grid_2,
      errors: null,
    })
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */

async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
      if(process.env.NODE_ENV === 'development') {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
      } else {
        res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
      }
      return res.redirect("/account/")
    }
    else {
      req.flash("message notice", "Please check your credentials and try again.")
      res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    console.error("Login error:", error.message)
    req.flash("error", "An error occurred during login. Please try again.")
    const grid_1 = await utilities.buildLogInView()
    let nav = await utilities.getNav()
    res.status(500).render("account/login", {
      title: "Login",
      nav,
      grid_1,
      errors: null,
      account_email,
    })
  }
}

async function getAccountManagementView(req, res) {
  let nav = await utilities.getNav()
  res.render('account/account', {
      title: "Account Management",
      nav,
      errors: null   // error message, if set
  })
}

    /*CREATE TABLE IF NOT EXISTS public.account
(
    account_id integer NOT NULL GENERATED BY DEFAULT AS IDENTITY,
    account_firstname character varying NOT NULL,
    account_lastname character varying NOT NULL,
    account_email character varying NOT NULL,
    account_password character varying NOT NULL,
    account_type character varying NOT NULL DEFAULT 'Client',
    CONSTRAINT account_pkey PRIMARY KEY (account_id)
)
    
    If you look in the accounts table of the database, you'll see that the email is stored in the account_email field, while the password is stored in the account_password field.

To apply this to the form, you would name the email input as name="account_email". By using this method, the form and database table locations match. The same idea applies to all form fields.*/

module.exports = { buildLogin, buildSignup, registerAccount, accountLogin, getAccountManagementView}