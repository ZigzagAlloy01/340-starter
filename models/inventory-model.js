const pool = require("../database/")

async function getClassifications() {
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

async function getInventoryByClassificationId(classification_id) {
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


module.exports = {
  getClassifications,
  getInventoryByClassificationId,
  getVehicleById,
  addClassification,
  addInventoryItem
}