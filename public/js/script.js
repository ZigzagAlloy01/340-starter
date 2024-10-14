const passwordInput = document.getElementById('password')
    const submitButton = document.querySelector('button[type="submit"]')

    submitButton.addEventListener('click', (event) => {
      const password = passwordInput.value;
      if (!validatePassword(password)) {
        alert('Password must be at least 12 characters long and contain at least 1 capital letter, 1 number, and 1 special character.')
        event.preventDefault()
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
