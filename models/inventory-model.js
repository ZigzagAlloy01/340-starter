const pool = require("../database/")

async function getClassifications(){
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
    console.error("getclassificationsbyid error " + error)
  }
}

async function getVehicleById(inv_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory WHERE inv_id = $1`,
      [inv_id]
    );
    return data.rows; // Return the first matching vehicle
  } catch (error) {
    console.error("getVehicleById error: " + error);
    throw error; // Propagate the error
  }
}

async function addClassification(classificationName) {
  const sql = 'INSERT INTO classification (classification_name) VALUES ($1) RETURNING *';
  return await pool.query(sql, [classificationName]);
};

async function addInventoryItem(vehicleData) {
  const {inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_name} = vehicleData;
  const sql = `
    INSERT INTO public.inventory (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_name)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING inv_id;
  `;
  const params = [inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_name];
  return pool.query(sql, params);
};


module.exports = {getClassifications, getInventoryByClassificationId, getVehicleById, addClassification, addInventoryItem}