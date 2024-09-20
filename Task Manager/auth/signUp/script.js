// script.js (Frontend JavaScript)
document.addEventListener('DOMContentLoaded', function () {
    const password = document.querySelector("#password");
    const confirmPassword = document.querySelector("#confirm");
    const concealOne = document.querySelector(".one");
    const concealTwo = document.querySelector(".two");
    const submitBtn = document.querySelector("#submit");

    // Toggle password visibility
    concealOne.addEventListener("click", function() {
        password.type = (password.type === "password") ? "text" : "password";
        concealOne.setAttribute("src", (password.type === "password") ? "images/hidden.png" : "images/eye.png");
        concealOne.setAttribute("alt", (password.type === "password") ? "hidden" : "visible");
    });
    
    // Toggle confirm password visibility
    concealTwo.addEventListener("click", function() {
        confirmPassword.type = (confirmPassword.type === "password") ? "text" : "password";
        concealTwo.setAttribute("src", (confirmPassword.type === "password") ? "images/hidden.png" : "images/eye.png");
        concealTwo.setAttribute("alt", (confirmPassword.type === "password") ? "hidden" : "visible");
    });
    
    submitBtn.addEventListener("click", function(e) {
        // Stop default form submission process
        e.preventDefault();

        // Collect user details
        let usernameVal = document.querySelector("#username").value.trim();
        let passwordVal = document.querySelector("#password").value.trim();
        let fullnameVal = document.querySelector("#fullname").value.trim();
        
        if (usernameVal != "" && passwordVal != "" && fullnameVal != "") {
            if (confirmPassword.value != passwordVal)
                return
            // Retrieve existing data from localStorage, or create an empty array if none exists
            const storedData = localStorage.getItem("userData");
            let users = storedData ? JSON.parse(storedData) : [];

            // Check if username already exists
            const isUsernameTaken = users.some(user => user.username === usernameVal)

            if (isUsernameTaken) {
                alert("Username already exists")
            } else {
                // New user data to add
                const newUser = {
                    username: usernameVal,
                    fullname: fullnameVal, 
                    password: passwordVal
                };
    
                // Add the new user to the array
                users.push(newUser);
    
                // Save the updated array back to localStorage
                localStorage.setItem("userData", JSON.stringify(users));
    
                // Set the password to the original type
                password.type = "password";
                confirmPassword.type = "password";
    
                // After handling logic, redirect to another page
                window.location.href = "../logIn/login.html";
            }
        }
    });
});