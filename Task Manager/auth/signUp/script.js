// Wait for the DOM to fully load before executing the script
document.addEventListener('DOMContentLoaded', function () {
    // Select the password input, confirm password input, visibility toggles, and the submit button
    const password = document.querySelector("#password");
    const confirmPassword = document.querySelector("#confirm");
    const concealOne = document.querySelector(".one");
    const concealTwo = document.querySelector(".two");
    const submitBtn = document.querySelector("#submit");

    // Event listener to toggle password visibility for the password field
    concealOne.addEventListener("click", function() {
        // Toggle the password field type between "password" and "text" (to hide/show password)
        password.type = (password.type === "password") ? "text" : "password";
        // Update the eye icon and alt text depending on whether the password is visible or hidden
        concealOne.setAttribute("src", (password.type === "password") ? "images/hidden.png" : "images/eye.png");
        concealOne.setAttribute("alt", (password.type === "password") ? "hidden" : "visible");
    });
    
    // Event listener to toggle password visibility for the confirm password field
    concealTwo.addEventListener("click", function() {
        // Toggle the confirm password field type between "password" and "text"
        confirmPassword.type = (confirmPassword.type === "password") ? "text" : "password";
        // Update the eye icon and alt text depending on whether the confirm password is visible or hidden
        concealTwo.setAttribute("src", (confirmPassword.type === "password") ? "images/hidden.png" : "images/eye.png");
        concealTwo.setAttribute("alt", (confirmPassword.type === "password") ? "hidden" : "visible");
    });
    
    // Event listener for form submission, triggered when the submit button is clicked
    submitBtn.addEventListener("click", function(e) {
        // Prevent the default form submission behavior
        e.preventDefault();
    
        // Retrieve and trim the values entered in the username, password, and fullname fields
        let usernameVal = document.querySelector("#username").value.trim();
        let passwordVal = document.querySelector("#password").value.trim();
        let fullnameVal = document.querySelector("#fullname").value.trim();
    
        // Validate that the password has at least 10 characters
        if (passwordVal.length < 10) {
            alert("Password must be at least 10 characters long.");
            return; // Stop form submission if validation fails
        }
    
        // Check if all required fields are filled
        if (usernameVal !== "" && passwordVal !== "" && fullnameVal !== "") {
            // Validate that the confirm password matches the password
            if (confirmPassword.value !== passwordVal) {
                alert("Passwords do not match.");
                return; // Stop form submission if passwords do not match
            }
    
            // Retrieve existing user data from localStorage, or initialize an empty array if none exists
            const storedData = localStorage.getItem("userData");
            let users = storedData ? JSON.parse(storedData) : [];
    
            // Check if the entered username already exists in the user data
            const isUsernameTaken = users.some(user => user.username === usernameVal);
    
            // If the username is already taken, alert the user
            if (isUsernameTaken) {
                alert("Username already exists");
            } else {
                // Create a new user object with the entered details
                const newUser = {
                    username: usernameVal,
                    fullname: fullnameVal, 
                    password: passwordVal
                };
    
                // Add the new user to the existing users array
                users.push(newUser);
    
                // Save the updated user data back to localStorage
                localStorage.setItem("userData", JSON.stringify(users));
    
                // Reset the password fields to the original "password" type for security reasons
                password.type = "password";
                confirmPassword.type = "password";
    
                // Redirect the user to the login page after successful sign-up
                window.location.href = "../logIn/login.html";
            }
        }
    });    
});