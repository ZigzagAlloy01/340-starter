const passwordInput = document.getElementById('password')
const submitButton = document.querySelector('#submit-password')

function validatePassword(password) {
  const minLength = 12;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  if (password.length >= minLength && hasUpperCase && hasNumber && hasSpecialChar) {
    return true;
  }
  
  return false;
}

submitButton.addEventListener('click', (event) => {
  const password = passwordInput.value;
  if (!validatePassword(password)) {
    console.log("Type a correct password")
  }
})

const pswdBtn = document.querySelector('#pswdBtn')
pswdBtn.addEventListener("click", function() {
    const pswdInput = document.getElementById("password");
    const type = pswdInput.getAttribute("type")
    if (type == "password") {
        pswdInput.setAttribute("type", "text")
        pswdBtn.innerHTML = "Hide Password"
    } else {
        pswdInput.setAttribute("type", "password")
        pswdBtn.innerHTML = "Show Password"
    }
})
