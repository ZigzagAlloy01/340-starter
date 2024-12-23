const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}

/*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */
validate.registationRules = () => {
    return [
      // firstname is required and must be string
      body("account_firstname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 1 })
        .withMessage("Please provide a first name."), // on error this message is sent.
  
      // lastname is required and must be string
      body("account_lastname")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 2 })
        .withMessage("Please provide a last name."), // on error this message is sent.
  
      // valid email is required and cannot already exist in the DB
      body("account_email")
      .trim()
      .escape()
      .notEmpty()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required."),
  
      // password is required and must be strong password
      body("account_password")
        .trim()
        .notEmpty()
        .isStrongPassword({
          minLength: 12,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        })
        .withMessage("Password does not meet requirements."),
    ]
  }
  /* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */

  validate.checkRegData = async (req, res, next) => {
    let errors = []
    errors = validationResult(req)

    if (!errors.isEmpty()) {
      const grid_2 = await utilities.buildSignUpView()
      let nav = await utilities.getNav()
      return res.render("account/signup", { // Render the signup view if there are errors
        title: "Sign Up",
        nav,
        errors: errors.array(),   // Pass the errors array to the view
        account_firstname: req.body.account_firstname, // Preserve the entered data
        account_lastname: req.body.account_lastname,
        account_email: req.body.account_email,
        grid_2,
      })
    }
  
    next()
}
  
  module.exports = validate