const utilities = require("../utilities/")
const invModel = require("../models/inventory-model")

async function buildManagementView(req, res) {
  let nav = await utilities.getNav()
  const classificationSelect = await utilities.buildClassificationList()
  res.render("inventory/management", {
    title: "Inventory Management",
    nav,
    classificationSelect,
  })
}

async function buildByClassificationId(req, res) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()

  if (data.length === 0) {
    return res.status(404).render("error", {
      title: "Classification Not Found",
      nav,
      message: "The requested classification was not found."
    })
  }

  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: `${className} vehicles`,
    nav,
    grid
  })
}

async function getVehicleById(req, res) {
  const vehicle_id = req.params.vehicleId
  const data = await invModel.getVehicleById(vehicle_id)
  const grid = await utilities.buildVehicleDetail(data)
  let nav = await utilities.getNav()

  if (!data) {
    return res.status(404).render("error", {
      title: "Vehicle Not Found",
      nav,
      message: "The requested vehicle was not found."
    })
  }

  const className = data.inv_model
  res.render("./inventory/detail", {
    title: `${className} vehicles`,
    nav,
    grid
  })
}

async function renderAddClassificationView(req, res) {
  let nav = await utilities.getNav()
  res.render("inventory/add-classification", {
    title: "Add Classification",
    nav,
    classificationName: req.body.classificationName || ''
  })
}

async function addClassification(req, res) {
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

async function renderAddInventoryView(req, res) {
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
    classificationList
  })
}

async function addInventoryItem(req, res) {
  const { inv_make } = req.body;
  const { inv_model } = req.body;
  const { inv_year } = req.body;
  const { inv_description } = req.body;
  const { inv_image } = req.body;
  const { inv_thumbnail } = req.body;
  const { inv_price } = req.body;
  const { inv_miles } = req.body;
  const { inv_color } = req.body;
  const { classification_id } = req.body;

  try {
      const inventoryItem = await invModel.addInventoryItem(
          inv_make,
          inv_model,
          inv_year,
          inv_description,
          inv_image,
          inv_thumbnail,
          inv_price,
          inv_miles,
          inv_color,
          classification_id
      );

      req.flash("message", "Vehicle added successfully!");
      res.redirect("/inv/");
  } catch (error) {
      res.redirect("/inv/")
  }
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
async function getInventoryJSON(req, res, next) {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Build edit inventory view
 * ************************** */
async function editInventoryView(req, res) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getInventoryById(inv_id)
  const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}

module.exports = {
  buildManagementView,
  buildByClassificationId,
  getVehicleById,
  renderAddClassificationView,
  addClassification,
  renderAddInventoryView,
  addInventoryItem,
  getInventoryJSON,
  editInventoryView
}