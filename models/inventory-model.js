/*const { deleteInventoryView } = require("../controllers/invController");*/
const pool = require("../database/")

async function getClassifications() {
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

async function getInventoryByClassificationId(classification_id) {
  console.log('Classification ID param:', classification_id)
  if (isNaN(classification_id) || classification_id === null) {
    throw new Error(`Invalid classification_id: ${classification_id}`);
  }
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
       JOIN public.classification AS c 
       ON i.classification_id = c.classification_id 
       WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("Error in getInventoryByClassificationId: " + error)
    throw error
  }
}

async function getVehicleById(inv_id) {
  console.log('Classification ID param:', inv_id)

  try {
    const data = await pool.query("SELECT * FROM public.inventory WHERE inv_id = $1", [inv_id])
    return data.rows.length > 0 ? data.rows[0] : null
  } catch (error) {
    console.error("Error in getVehicleById: " + error)
    throw error
  }
}

async function addClassification(classificationName) {
  const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *"
  return await pool.query(sql, [classificationName])
}

async function addInventoryItem(inv_make,
  inv_model,
  inv_year,
  inv_description,
  inv_image,
  inv_thumbnail,
  inv_price,
  inv_miles,
  inv_color,
  classification_id) {

  const sql = `
    INSERT INTO inventory (inv_id, inv_make, inv_model, inv_year, inv_description, inv_image, 
    inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) 
    RETURNING *
    `
    return await pool.query(sql, [classification_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id])
    }

    /* ***************************
 *  Update Inventory Data
 * ************************** */
async function updateInventory(
  inv_id,
  inv_make,
  inv_model,
  inv_description,
  inv_image,
  inv_thumbnail,
  inv_price,
  inv_year,
  inv_miles,
  inv_color,
  classification_id
) {
  try {
    const sql =
      "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *"
    const data = await pool.query(sql, [
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
      classification_id,
      inv_id
    ])
    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}

 /* ***************************
 *  Delete Inventory Data
 * ************************** */
 async function deleteInventory(
  inv_id,
) {
  try {
    const sql = 'DELETE FROM inventory WHERE inv_id = $1'
    const data = await pool.query(sql, [
      inv_id
    ])
    return data
  } catch (error) {
    console.error("model error: " + error)
  }
}

async function searchInventory(searchTerm) {
  const sql = `
    SELECT * FROM public.inventory 
    WHERE inv_make = $1 OR inv_model = $1 OR inv_year::text = $1
    ORDER BY inv_make, inv_model, inv_year`;
  try {
    const data = await pool.query(sql, [searchTerm]);
    return data.rows.length > 0 ? data.rows[0] : null
  } catch (error) {
    console.error("Error in searchInventory: " + error);
    throw error;
  }
}

module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getVehicleById,
  addClassification,
  addInventoryItem,
  updateInventory,
  deleteInventory,
  searchInventory
}