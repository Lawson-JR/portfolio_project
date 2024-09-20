const logInBTN = document.querySelector("input[type='button']");
const signUpBTN = document.querySelector("button");

signUpBTN.addEventListener("click", function() {
    window.location.href = "../signUp/signup.html";
})

logInBTN.addEventListener("click", function(e) {
    // Stop default form submission process
    e.preventDefault();
    
    // Collect username and password
    let usernameVal = document.querySelector("#username").value;
    let passwordVal = document.querySelector("#password").value;
    
    if (usernameVal != "" && passwordVal != "") {
        // Retrieve the data from localStorage
        const storedData = localStorage.getItem("userData");

        if (storedData) {
            const users = JSON.parse(storedData);
            
            // Check if there is any matching user
            const matchedUser = users.find(user => user.username === usernameVal && user.password === passwordVal);

            if (matchedUser) {
                console.log("Matching user found: " + matchedUser.username);

                // Create or Ovewrite the currentUser key with logged-in user data
                localStorage.setItem("currentUser", JSON.stringify(matchedUser));

                window.location.href = "../../web-app/app.html"
                // Optionally, log the stored current user
                // const currentUserData = localStorage.getItem("currentUser");
                // console.log("Current logged-in user:", JSON.parse(currentUserData));
            } else {
                alert("No matching user found.");
            }
        }   else {
            alert("No user data found in localStorage.");
        }
    }
});