const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
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

invCont.triggerError = (req, res) => {
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message,
    nav
  })
};

module.exports = invCont