const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const regValidate = require("../utilities/inventory-validation")
const utilities = require("../utilities/")

router.get("/type/:classificationId", invController.buildByClassificationId)

router.get("/detail/:vehicleId", invController.getVehicleById)

router.get("/", invController.buildManagementView)

router.get('/add-classification', invController.renderAddClassificationView);

router.post('/classification', invController.addClassification);

router.get('/add-inventory', invController.renderAddInventoryView);

router.post(
    "/inventory",
    invController.addInventoryItem
  )

module.exports = router