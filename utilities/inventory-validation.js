const { body, validationResult } = require("express-validator");
const utilities = require(".");

const validate = {};

/* ************************************
 * Inventory Data Validation Rules
 * ************************************ */
validate.inventoryRules = () => {
  return [
    // Vehicle Make (inv_make) is required and must be a string
    body("inv_make")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Vehicle Name (Make) is required."),
    
    // Vehicle Model (inv_model) is required and must be a string
    body("inv_model")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Vehicle Model is required."),
    
    // Vehicle Year (inv_year) is required and must be a 4-digit number
    body("inv_year")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 4, max: 4 })
      .withMessage("Vehicle Year must be a 4-digit number.")
      .isNumeric()
      .withMessage("Vehicle Year must be a number."),

    // Vehicle Description (inv_description) is required
    body("inv_description")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Vehicle Description is required."),

    // Vehicle Price (inv_price) is required and must be a positive number
    body("inv_price")
      .trim()
      .escape()
      .notEmpty()
      .isNumeric()
      .withMessage("Price must be a valid number.")
      .custom(value => {
        if (value <= 0) {
          throw new Error("Price must be a positive number.");
        }
        return true;
      }),

    // Vehicle Mileage (inv_miles) is required and must be a positive number
    body("inv_miles")
      .trim()
      .escape()
      .notEmpty()
      .isNumeric()
      .withMessage("Mileage must be a valid number.")
      .custom(value => {
        if (value < 0) {
          throw new Error("Mileage cannot be negative.");
        }
        return true;
      }),

    // Vehicle Color (inv_color) is required
    body("inv_color")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Color is required."),

    // Image Path (inv_image) is required
    body("inv_image")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Image Path is required."),

    // Thumbnail Path (inv_thumbnail) is required
    body("inv_thumbnail")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Thumbnail Path is required."),
    
    body("classification_name")
      .notEmpty()
      .withMessage("Classification is required."),
  ];
};

validate.checkInventoryData = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const classificationList = await utilities.buildClassificationList(); 
    let nav = await utilities.getNav();
    res.render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      errors: errors.array(), 
      inv_make: req.body.inv_make,
      inv_model: req.body.inv_model,
      inv_year: req.body.inv_year,
      inv_description: req.body.inv_description,
      inv_price: req.body.inv_price,
      inv_miles: req.body.inv_miles,
      inv_color: req.body.inv_color,
      inv_image: req.body.inv_image,
      inv_thumbnail: req.body.inv_thumbnail,
      classificationList,
    });
    return; 
  }

  next();
};

module.exports = validate;
