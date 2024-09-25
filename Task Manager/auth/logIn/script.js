// Select the login button using an input type selector and the sign-up button using the button tag
const logInBTN = document.querySelector("input[type='button']");
const signUpBTN = document.querySelector("button");

// Event listener for the sign-up button to redirect the user to the sign-up page when clicked
signUpBTN.addEventListener("click", function() {
    window.location.href = "../signUp/signup.html"; // Redirect to sign-up page
});

// Event listener for the login button to handle the login process
logInBTN.addEventListener("click", function(e) {
    // Prevent the default form submission behavior
    e.preventDefault();

    // Collect the values entered by the user for username and password
    let usernameVal = document.querySelector("#username").value;
    let passwordVal = document.querySelector("#password").value;

    // Check if both username and password fields are not empty
    if (usernameVal != "" && passwordVal != "") {
        // Retrieve the user data stored in localStorage
        const storedData = localStorage.getItem("userData");

        // If user data exists in localStorage, proceed to find the matching user
        if (storedData) {
            const users = JSON.parse(storedData); // Parse the JSON string to retrieve user data

            // Find a user with matching username and password
            const matchedUser = users.find(user => user.username === usernameVal && user.password === passwordVal);

            // If a matching user is found
            if (matchedUser) {
                console.log("Matching user found: " + matchedUser.username);

                // Store the matched user as the current user in localStorage
                localStorage.setItem("currentUser", JSON.stringify(matchedUser));

                // Redirect the user to the main application page after successful login
                window.location.href = "../../web-app/app.html";

                // Optionally, log the current user data from localStorage for debugging purposes
                // const currentUserData = localStorage.getItem("currentUser");
                // console.log("Current logged-in user:", JSON.parse(currentUserData));
            } else {
                // If no matching user is found, display an alert message
                alert("No matching user found.");
            }
        } else {
            // If no user data is found in localStorage, display an alert message
            alert("No user data found in localStorage.");
        }
    }
});