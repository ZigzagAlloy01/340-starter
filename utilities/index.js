const jwt = require("jsonwebtoken")
require("dotenv").config()
const invModel = require("../models/inventory-model")
const Util = {}


/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications();
  
  // Check if data is defined and has rows
  if (!data || !data.rows) {
    console.error("No classifications found.");
    return "<ul><li>No classifications available.</li></ul>";
  }

  let list = "<ul>";
  list += '<li><a href="/" title="Home page">Home</a></li>';
  
  data.rows.forEach((row) => {
    list += "<li>";
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>";
    list += "</li>";
  });  
  list += "</ul>";
  return list;
}

Util.buildClassificationGrid = async function(data) {
  let grid = '';
  if (data && data.length > 0) {
    grid = '<ul id="inv-display">';
    data.forEach(vehicle => { 
      grid += '<li>';
      grid += '<a href="/inv/detail/'+ vehicle.inv_id + '" title="View ' + vehicle.inv_make + ' ' + vehicle.inv_model + ' details"><img src="/public' + vehicle.inv_thumbnail + '" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model +' on CSE Motors" /></a>';
      grid += '<div class="namePrice">';
      grid += '<hr />';
      grid += '<h2>';
      grid += '<a href="/inv/detail/' + vehicle.inv_id +'" title="View ' + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>';
      grid += '</h2>';
      grid += '<span>$' + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>';
      grid += '</div>';
      grid += '</li>';
    });
    grid += '</ul>';
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
}

Util.buildLogInView = async function(){
  let grid
  grid = '<form id="loginForm" action="/account/login" method="post">'
  grid += '<label for="account_email">Email Address:</label>'
  grid += '<input type="email" id="email" name="account_email" required>'
  grid += '<label for="account_password">Password:</label>'
  grid += '<input type="password" id="password" name="account_password" required>'
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

Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications();
  let classificationList =
    '<select name="classification_id" id="classificationList" required>';
  classificationList += "<option value=''>Choose a Classification</option>";
  
  // Check if data is defined and has rows
  if (!data || !data.rows) {
    console.error("No classifications found for dropdown.");
    return classificationList + "</select>"; // Return the dropdown with only the default option
  }

  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"';
    if (classification_id != null && row.classification_id == classification_id) {
      classificationList += " selected ";
    }
    classificationList += ">" + row.classification_name + "</option>";
  });
  classificationList += "</select>";
  return classificationList;
}

Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
   jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
     if (err) {
      req.flash("Please log in")
      res.clearCookie("jwt")
      return res.redirect("/account/login")
     }
     res.locals.accountData = accountData
     res.locals.loggedin = 1
     next()
    })
  } else {
   next()
  }
 }

 Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }

module.exports = Util;