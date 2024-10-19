const invModel = require("../models/inventory-model")
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="/inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="/public' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="/inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

Util.buildLogInView = async function(){
  let grid
  grid = '<form action="/account/login" method="POST">'
  grid += '<label for="account_email">Email Address:</label>'
  grid += '<input type="email" id="email" name="account_email" required>'
  grid += '<label for="account_password">Password:</label>'
  grid += '<input type="password" id="password" name="account_password " required>'
  grid += '<span id="pswdBtn">Show Password</span>'
  grid += '<button id="submit-password" type="submit">Login</button>'
  grid += '<p>No account? <a href="/account/signup">Sign up</a></p>'
  grid += '</form>'
  return grid
}

Util.buildSignUpView = async function(){
  let grid
  grid = '<form action="/account/signup" method="POST">'
  grid += '<p>All fields are required</p>'
  grid += '<label for="account_firstname">First Name:</label>'
  grid += '<input type="text" id="firstname" name="account_firstname" required>'
  grid += '<label for="account_lastname">Last Name:</label>'
  grid += '<input type="text" id="lastname" name="account_lastname" required>'
  grid += '<label for="account_email">Email Address:</label>'
  grid += '<input type="email" id="email" name="account_email" required>'
  grid += '<label for="account_password">Password:</label>'
  grid += '<span>Passwords must be at least 12 characters and contain at least 1 number, 1 capital letter and 1 special character</span>'
  grid += '<input type="password" id="password" name="account_password" required>'
  grid += '<span id="pswdBtn">Show Password</span>'
  grid += '<button id="submit-password" type="submit">Sign Up</button>'
  grid += '</form>'
  return grid
}

function formatMiles(miles) {
  return miles.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

Util.buildVehicleDetail = async function(vehicle) {
  if (!vehicle) {
      return '<p class="notice">Vehicle not found.</p>';
  }
  let detailHtml = '<div class="vehicle-detail">';
  detailHtml += `<h1>${vehicle.inv_year} ${vehicle.inv_make} ${vehicle.inv_model}</h1>`;
  detailHtml += `<img src="/public${vehicle.inv_thumbnail}" alt="Image of ${vehicle.inv_make} ${vehicle.inv_model}" />`;
  detailHtml += `<p>${vehicle.inv_make} ${vehicle.inv_model} Details</p>`;
  detailHtml += `<p>Price: $${new Intl.NumberFormat('en-US').format(vehicle.inv_price)}</p>`;
  detailHtml += `<p>Description: ${vehicle.inv_description || 'No description available.'}</p>`;
  detailHtml += `<p>Color: ${vehicle.inv_color || 'No color available.'}</p>`;
  detailHtml += `<p>Miles: ${formatMiles(vehicle.inv_miles) || 'No miles available.'}</p>`;
  detailHtml += '</div>';
  return detailHtml;
};

Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

module.exports = Util