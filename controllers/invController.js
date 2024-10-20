const utilities = require("../utilities/")
const { validationResult } = require('express-validator')
const invCont = {}
const invModel = require("../models/inventory-model")

/* ***************************
 *  Build inventory by classification view
 * ************************** */

invCont.buildByClassificationId = async function (req, res) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  if (data.length === 0) {
    return res.status(404).render('error', {
      title: 'Classification Not Found',
      nav,
      message: 'The requested classification was not found.'
    })
  }
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

invCont.getVehicleById = async function(req, res) {
  const vehicle_id = req.params.vehicleId
  const data = await invModel.getVehicleById(vehicle_id)
  console.info(data)
  const grid = await utilities.buildVehicleDetail(data[0])
  let nav = await utilities.getNav()
  const className = data[0].inv_model
  res.render("./inventory/detail", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

invCont.buildManagementView = async function(req, res) {
  let nav = await utilities.getNav()
  res.render("inventory/management", {
    title: "Inventory Management",
    nav,
  })
}

invCont.renderAddClassificationView = async (req, res) => {
  let nav = await utilities.getNav()
  res.render('inventory/add-classification', { 
      title: 'Add Classification',
      nav,
      classificationName: req.body.classificationName || '', 
  })
}

invCont.addClassification = async (req, res) => {
  const { classificationName } = req.body
  let nav = await utilities.getNav()

  if (!classificationName) {
    return res.render('inventory/add-classification', {
      title: 'Add Classification',
      nav,
      message: 'Classification name is required',
    })
  }

  try {
    const result = await invModel.addClassification(classificationName)
    nav = await utilities.getNav()
    req.flash('message', 'New classification added successfully')
    res.redirect('/inv')
  } catch (error) {
    res.render('inventory/add-classification', {
      title: 'Add Classification',
      nav,
      message: 'Error adding classification',
    })
  }
}

invCont.renderAddInventoryView = async (req, res) => {
  const classificationList = await utilities.buildClassificationList()
  let nav = await utilities.getNav()
  res.render("inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    inv_make: req.body.inv_make || '',
    inv_model: req.body.inv_model || '',
    inv_year: req.body.inv_year || '',
    inv_description: req.body.inv_description || '',
    inv_price: req.body.inv_price || '',
    inv_miles: req.body.inv_miles || '',
    inv_color: req.body.inv_color || '',
    inv_image: req.body.inv_image || '',
    inv_thumbnail: req.body.inv_thumbnail || '',
    classificationList,
  })
}

invCont.addInventoryItem = async (req, res) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    const classificationList = await utilities.buildClassificationList()
    let nav = await utilities.getNav()
    return res.render("inventory/add-inventory", {
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
    })
  }

  const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_name} = req.body

  try {
    await invModel.addInventoryItem({
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_name,
    })

    req.flash('message', 'Vehicle added successfully!')
    res.redirect('/inv/')
  } catch (error) {
    let nav = await utilities.getNav()
    res.render('inventory/add-inventory', {
      title: 'Add Inventory',
      nav,
      errors: [{ msg: 'Error adding vehicle. Please try again.' }],
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_price,
      inv_miles,
      inv_color,
      inv_image,
      inv_thumbnail,
      classificationList: await utilities.buildClassificationList(),
    })
  }
}


invCont.triggerError = (req, res) => {
  let nav = utilities.getNav()
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message: err.message || 'An unexpected error occurred.',
    nav
  })
}

module.exports = invCont