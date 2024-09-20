const currentUser = localStorage.getItem("currentUser");

if (currentUser) {
    const parsedUser = JSON.parse(currentUser).username;
    const parsedFullName = JSON.parse(currentUser).fullname;
    console.log(`Logged-in user ${parsedUser}`);
    
    var usernameDisplay = document.querySelector(".username");
    var fullnameDisplay = document.querySelector(".fullname");
    
    usernameDisplay.textContent = parsedUser;
    fullnameDisplay.textContent = parsedFullName;
    
    var tasks = document.getElementById("tasks");
    var sidebarItems = document.querySelectorAll("ul li");
    var main = document.querySelector("main"); // Now selecting the <main> tag instead of an element with id="main"

    tasksFunc();

    sidebarItems.forEach(item => {
    item.addEventListener("click", function() {
        // Remove the 'clicked' class from all sidebar items
        sidebarItems.forEach(el => el.classList.remove("clicked"));
        
        // Add the 'clicked' class to the clicked item
        item.classList.add("clicked");
        if (item.id === "tasks") {
            tasksFunc();
        }
        });
    });

    function tasksFunc() {
        // Reset the main content
        main.innerHTML = '';
        main.classList.remove("side-by-side");
    
        // Create a container for searchBar and addTaskBTN
        let taskHead = document.createElement("div");
        taskHead.classList.add("taskHead");
    
        // Create a container for the search bar and search icon
        let searchBarContainer = document.createElement("div");
        searchBarContainer.classList.add("searchBarContainer");
    
        // Create search bar input
        let searchBar = document.createElement("input");
        searchBar.type = "search";
        searchBar.placeholder = "Search tasks...";
        searchBar.classList.add("searchBar");
    
        searchBar.addEventListener("input", function() {
            if (searchBar.value === "") {
                const tasks = document.querySelectorAll("#taskList li");
                tasks.forEach(task => task.style.display = "flex"); // Show all tasks
            }
        });        

        // Create an img element for the search icon
        let searchIcon = document.createElement("img");
        searchIcon.src = "Images/magnifying-glass.png";  // Replace button with image
        searchIcon.alt = "Search";
        searchIcon.classList.add("searchIcon");
    
        // Inside tasksFunc where you set up the search bar
        searchIcon.addEventListener("click", function() {
            const searchValue = searchBar.value.toLowerCase();
            const tasks = document.querySelectorAll("#taskList li");

            tasks.forEach(task => {
                const taskName = task.querySelector(".task-name").textContent.toLowerCase();
                if (taskName.includes(searchValue)) {
                    task.style.display = "flex"; // Show the matching task
                } else {
                    task.style.display = "none"; // Hide non-matching tasks
                }
            });
        });

        

        // Append searchBar and search icon into the searchBarContainer
        searchBarContainer.appendChild(searchBar);
        searchBarContainer.appendChild(searchIcon);
    
        // Create "Add Task" button
        let addTaskBTN = document.createElement("button");
        addTaskBTN.classList.add("addTask");
        addTaskBTN.innerHTML = "<span class='cross'>+</span> Add task";
    
        // Functionality for adding tasks
        addTaskBTN.addEventListener("click", function () {
            // Create popup overlay
            let popupOverlay = document.createElement("div");
            popupOverlay.classList.add("popup-overlay");

            // Create popup container
            let popup = document.createElement("div");
            popup.classList.add("popup");

            // Add content to the popup
            let popupContent = document.createElement("div");
            popupContent.classList.add("popup-content");

            popupContent.innerHTML = `
                <h2>Add New Task</h2>
                <form id="taskForm">
                    <label for="taskName">Task Name</label>
                    <input type="text" id="taskName" name="taskName" placeholder="Enter task name..." required>

                    <label for="taskPriority">Priority</label>
                    <select id="taskPriority" name="taskPriority" required>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                    </select>

                    <label for="taskDate">Deadline</label>
                    <input type="date" id="taskDate" name="taskDate" required>

                    <div class="popup-buttons">
                        <button type="submit">Add Task</button>
                        <button type="button" id="cancelBtn">Cancel</button>
                    </div>
                </form>
            `;

            // Set the min attribute for the date input
            const today = new Date().toISOString().split("T")[0];
            popupContent.querySelector("#taskDate").setAttribute("min", today);

            // Append content to the popup
            popup.appendChild(popupContent);

            // Append the popup and overlay to the body
            document.body.appendChild(popupOverlay);
            document.body.appendChild(popup);

            // Apply fade-in effect
            setTimeout(() => {
                popup.classList.add("fade-in");
                popupOverlay.classList.add("fade-in");
            }, 10);

            // Close the popup when clicking cancel or outside the popup
            document.getElementById("cancelBtn").addEventListener("click", closePopup);
            popupOverlay.addEventListener("click", closePopup);

            // Form submission handling
            const taskForm = document.getElementById("taskForm");
            taskForm.addEventListener("submit", function (event) {
                event.preventDefault(); // Prevent default form submission
            
                // Get values from the form
                const taskName = taskForm.taskName.value;
                const taskPriority = taskForm.taskPriority.value; 
                const taskDate = taskForm.taskDate.value;
                const createdOn = new Date().toLocaleDateString();
            
                // Create the task object
                const task = {
                    name: taskName,
                    priority: taskPriority,
                    date: taskDate,
                    createdOn: createdOn,
                };
            
                // Add the task to the task list in the UI
                addTaskToTaskList(task);
            
                // Save task to localStorage
                addTaskToLocalStorage(task);
            
                // Close the popup
                closePopup();
            });            

            // Close popup function with fade-out effect
            function closePopup() {
                popup.classList.remove("fade-in");
                popupOverlay.classList.remove("fade-in");

                // Wait for the fade-out transition before removing the elements
                setTimeout(() => {
                    popup.remove();
                    popupOverlay.remove();
                }, 300);
            }
        });

        // Append searchBarContainer and addTaskBTN to taskHead
        taskHead.appendChild(searchBarContainer);
        taskHead.appendChild(addTaskBTN);
        main.appendChild(taskHead);
        
        loadTasks();        
    }
    function addTaskToTaskList(task) {
        let taskList = document.getElementById("taskList");
        if (!taskList) {
            taskList = document.createElement("ul");
            taskList.id = "taskList";
            main.appendChild(taskList);
        }
    
        const newTask = document.createElement("li");
    
        // Create a delete button
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.classList.add("delete-task");
    
        // Add click event for delete button
        deleteBtn.addEventListener("click", function() {
            deleteTask(task);
            newTask.remove(); // Remove the task from the UI immediately
        });
    
        newTask.innerHTML = `
            <div class="task-left">
                <span class="task-name">${task.name}</span>
            </div>
            <div class="task-right">
                <span class="task-priority">${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}</span>
                <span class="task-deadline">Deadline: ${task.date}</span>
                <span class="task-created">Created On: ${task.createdOn}</span>
            </div>
        `;
    
        // Append the delete button to the task
        newTask.appendChild(deleteBtn);
    
        taskList.appendChild(newTask);
    }    
    
    function deleteTask(taskToDelete) {
        const currentUser = localStorage.getItem("currentUser");
        if (currentUser) {
            const user = JSON.parse(currentUser);
            user.tasks = user.tasks.filter(task => task.name !== taskToDelete.name || task.date !== taskToDelete.date); // Filter out the task to delete
            localStorage.setItem("currentUser", JSON.stringify(user)); // Save back to localStorage
        }
    }    

    function loadTasks() {
        const currentUser = localStorage.getItem("currentUser");
        if (currentUser) {
            const user = JSON.parse(currentUser);
            if (user.tasks) {
                user.tasks.forEach(task => addTaskToTaskList(task));
            }
        }
    }
    

    function addTaskToLocalStorage(task) {
        const currentUser = localStorage.getItem("currentUser");
        if (currentUser) {
            const user = JSON.parse(currentUser);
            user.tasks = user.tasks || []; // Initialize if it doesn't exist
            user.tasks.push(task); // Add the new task
            localStorage.setItem("currentUser", JSON.stringify(user)); // Save back to localStorage
        }
    }
    
    document.getElementById("settings").addEventListener("click", openSettingsPopup);

    function openSettingsPopup() {
        const popupOverlay = document.createElement("div");
        popupOverlay.classList.add("popup-overlay");
        popupOverlay.style.position = "fixed";
        popupOverlay.style.top = "0";
        popupOverlay.style.left = "0";
        popupOverlay.style.width = "100%";
        popupOverlay.style.height = "100%";
        popupOverlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    
        const popup = document.createElement("div");
        popup.classList.add("popup");
    
        popup.innerHTML = `
            <div class="popup-content">
                <h2>Settings</h2>
                <form id="settingsForm">
                    <label for="newUsername">New Username</label>
                    <input type="text" id="newUsername" required>
                    <label for="newPassword">New Password</label>
                    <input type="password" id="newPassword" required>
                    <div class="popup-buttons">
                        <button type="submit">Save</button>
                        <button type="button" id="deleteAccountBtn">Delete Account</button>
                        <button type="button" id="cancelBtn">Cancel</button> <!-- Cancel button -->
                    </div>
                </form>
            </div>
        `;
    
        document.body.appendChild(popupOverlay);
        document.body.appendChild(popup);
    
        // Apply fade-in effect
        setTimeout(() => {
            popup.classList.add("fade-in");
            popupOverlay.classList.add("fade-in");
        }, 10);
    
        // Close popup on cancel button click
        document.getElementById("cancelBtn").addEventListener("click", () => {
            closePopup(popup, popupOverlay);
        });
    
        // Close popup and handle form submission
        document.getElementById("settingsForm").addEventListener("submit", (event) => {
            event.preventDefault();
            const newUsername = document.getElementById("newUsername").value;
            const newPassword = document.getElementById("newPassword").value;
            updateUserInLocalStorage(newUsername, newPassword);
            closePopup(popup, popupOverlay);
        });
    
        // Delete account confirmation
        document.getElementById("deleteAccountBtn").addEventListener("click", () => {
            if (confirm("Are you sure you want to delete your account?")) {
                deleteUserAccount();
                window.location.href = "../auth/logIn/login.html";
            }
        });
    }
    
    function closePopup(popup, overlay) {
        popup.classList.remove("fade-in");
        overlay.classList.remove("fade-in");
    
        setTimeout(() => {
            popup.remove();
            overlay.remove();
        }, 300);
    }
    

    function updateUserInLocalStorage(newUsername, newPassword) {
        const currentUser = localStorage.getItem("currentUser");
        const user = JSON.parse(currentUser);
        user.username = newUsername;
        user.password = newPassword; // Handle password hashing if needed
        localStorage.setItem("currentUser", JSON.stringify(user));
    }

    function deleteUserAccount() {
        localStorage.removeItem("currentUser");
        localStorage.removeItem("userTasks"); // Remove associated tasks
    }

    document.getElementById("logOut").addEventListener("click", function() {
        confirmLogout();
    });
    
    function confirmLogout() {
        const logoutButton = document.getElementById("logOut");
    
        // Set a timeout for the duration of the animation (adjust duration as needed)
        setTimeout(() => {
            const confirmation = confirm("Are you sure you want to log out?");
            if (confirmation) {
                localStorage.removeItem("currentUser");
                window.location.href = "../auth/logIn/login.html";
            }
        }, 300); // Adjust this value based on your animation duration
    }
} else {
    // No user is logged in, redirect to the login page
    window.location.href = "../auth/logIn/login.html";
}

// window.addEventListener("beforeunload", function(event) {
//     // Remove the currentUser key from the localStorage
//     localStorage.removeItem("currentUser");

//     // Optional: Confirmation dialog (most browsers ignore custom messages)
//     event.preventDefault(); // Required for some browsers
//     event.returnValue = ""; // Some browsers need this to show a confirmation dialog
// });
