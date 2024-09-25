// Retrieve the current user from localStorage
const currentUser = localStorage.getItem("currentUser");

if (currentUser) {
    // Parse the user's username and full name from the localStorage data
    const parsedUser = JSON.parse(currentUser).username;
    const parsedFullName = JSON.parse(currentUser).fullname;
    console.log(`Logged-in user: ${parsedUser}`);
    
    // Select DOM elements where the username and full name should be displayed
    const usernameDisplay = document.querySelector(".username");
    const fullnameDisplay = document.querySelector(".fullname");
    
    // Update the text content of the selected DOM elements with the parsed username and full name
    usernameDisplay.textContent = parsedUser;
    fullnameDisplay.textContent = parsedFullName;

    // Call a function to update the notification icon (this function is assumed to be defined elsewhere)
    updateNotificationIcon();

    // Cache DOM elements for tasks section, sidebar items, and the main content area
    const tasks = document.getElementById("tasks");
    const sidebarItems = document.querySelectorAll("ul li");
    const main = document.querySelector("main");

    // Variable to track the last function executed, useful for remembering the last view
    let lastFunction = null;

    /**
     * Function to determine which sidebar item was clicked and run the corresponding function.
     * It checks for the 'clicked' class on the sidebar items and executes the relevant function.
     */
    function runClickedFunction() {
        // Loop through each sidebar item to check if it has the 'clicked' class
        sidebarItems.forEach(item => {
            if (item.classList.contains("clicked")) {
                // Based on the item's id, run the appropriate function
                if (item.id === "tasks") {
                    tasksFunc();
                    lastFunction = "tasks"; // Store which function was last executed
                }
                if (item.id === "notifications") {
                    notificationsFunc();
                    lastFunction = "notifications";
                }
                if (item.id === "dashboard") {
                    dashboardFunc();
                    lastFunction = "dashboard";
                }
            }
        });
    }

    /**
     * Add click event listeners to each sidebar item to trigger actions when clicked.
     * Clears the 'clicked' class from all items, then applies it to the clicked item.
     * Calls runClickedFunction to handle the action corresponding to the clicked item.
     */
    sidebarItems.forEach(item => {
        item.addEventListener("click", function() {
            // Remove the 'clicked' class from all sidebar items to reset
            sidebarItems.forEach(el => el.classList.remove("clicked"));
            
            // Add the 'clicked' class to the currently clicked item
            item.classList.add("clicked");
            
            // Execute the function corresponding to the clicked item
            runClickedFunction();
        });
    });

    // Automatically run the function associated with the initially clicked sidebar item on load
    runClickedFunction();

    function dashboardFunc() {
        // Clear the main content area before rendering the dashboard
        main.innerHTML = "";

        // Create a container for the dashboard layout and add necessary CSS classes
        const dashboardContainer = document.createElement("div");
        dashboardContainer.classList.add("dashboard-container", "fade-in");

        // Create sections for the dashboard: left for task details, right for task summary
        const leftSection = document.createElement("div");
        leftSection.classList.add("dashboard-left");

        const rightSection = document.createElement("div");
        rightSection.classList.add("dashboard-right");

        // Initialize task counts
        let totalTasks = 0;
        let completedTasks = 0;
        let ongoingTasks = 0;
        let overdueTasks = 0;

        // Retrieve user data and the current logged-in user from localStorage
        let userData = JSON.parse(localStorage.getItem("userData"));
        let currentUser = JSON.parse(localStorage.getItem("currentUser"));

        // If user data and current user exist, proceed to display task-related information
        if (userData && currentUser) {
            const user = userData.find(u => u.username === currentUser.username);

            if (user && user.tasks) {
                const tasks = user.tasks;
                totalTasks = tasks.length; // Total number of tasks
                completedTasks = tasks.filter(task => task.completed).length; // Number of completed tasks

                // Debugging log to verify the structure of the tasks array
                console.log("Tasks:", tasks);

                // Calculate ongoing tasks (not completed and due after today)
                ongoingTasks = tasks.filter(task => !task.completed && isTaskOngoing(task.date)).length;

                // Calculate overdue tasks (tasks due in the past)
                overdueTasks = tasks.filter(task => isTaskOverdue(task.date)).length;

                // Initialize an object to store tasks based on priority (high, medium, low)
                let priorityTasks = {
                    high: [],
                    medium: [],
                    low: []
                };

                // Organize tasks into priority groups (high, medium, low) based on their priority property
                tasks.forEach(task => {
                    const priorityLower = task.priority.toLowerCase();
                    if (priorityTasks[priorityLower]) {
                        priorityTasks[priorityLower].push(task);
                    }
                });

                // Populate the left section with task details categorized by priority
                Object.keys(priorityTasks).forEach(priority => {
                    // Create a dropdown for each priority level
                    const dropdown = document.createElement("div");
                    dropdown.classList.add("task-dropdown");

                    // Create a button for the dropdown to toggle task visibility
                    const dropdownButton = document.createElement("button");
                    dropdownButton.textContent = `${priority.charAt(0).toUpperCase() + priority.slice(1)} Priority Tasks`;
                    dropdownButton.classList.add("dropdown-button");

                    dropdown.appendChild(dropdownButton);

                    // Create a list to hold the tasks for the current priority level
                    const taskList = document.createElement("ul");
                    taskList.classList.add("task-list");
                    taskList.style.display = "block"; // Initially display the task list

                    // If there are tasks for the current priority, display them
                    if (priorityTasks[priority].length > 0) {
                        priorityTasks[priority].forEach(task => {
                            const listItem = document.createElement("li");
                            listItem.classList.add("task-item");

                            // Create task information elements (name and description)
                            const taskInfo = document.createElement("div");
                            taskInfo.style.width = "70%";

                            const taskName = document.createElement("strong");
                            taskName.textContent = task.name;

                            const taskDescription = document.createElement("span");
                            taskDescription.textContent = ` - ${task.description}`;

                            taskInfo.appendChild(taskName);
                            taskInfo.appendChild(taskDescription);

                            // Create a view image (icon) to allow task viewing
                            const viewImage = document.createElement("img");
                            viewImage.src = "images/view.png";
                            viewImage.alt = "View Task";
                            viewImage.classList.add("view-image");

                            // When clicking the view image, switch to the tasks section
                            viewImage.addEventListener("click", () => {
                                tasksFunc();
                                document.querySelector(".sidebar li#dashboard").classList.remove("clicked");
                                document.querySelector(".sidebar li#tasks").classList.add("clicked");
                            });

                            listItem.appendChild(taskInfo);
                            listItem.appendChild(viewImage);
                            taskList.appendChild(listItem);

                            // Apply deadline styling based on task's due date
                            deadlineCheck(listItem, task.date);
                        });
                    } else {
                        // If no tasks are available, show a message indicating no tasks for this priority level
                        const noTasksMessage = document.createElement("li");
                        noTasksMessage.textContent = "No tasks available";
                        noTasksMessage.classList.add("no-tasks");
                        taskList.appendChild(noTasksMessage);
                    }

                    dropdown.appendChild(taskList);

                    // Toggle the visibility of the task list when the dropdown button is clicked
                    dropdownButton.addEventListener("click", () => {
                        taskList.style.display = (taskList.style.display === "none") ? "block" : "none";
                    });

                    // Add the priority dropdown to the left section
                    leftSection.appendChild(dropdown);
                });
            } else {
                // If no tasks are found for the user, display a message indicating this
                leftSection.innerHTML = `<p class="noTasks">No tasks found for <strong>${currentUser.username}</strong></p>`;
            }
        } else {
            // If user data is not available, display an error message
            leftSection.innerHTML = "<p>No user data available.</p>";
        }

        // Right section: display task summary (total, completed, ongoing, overdue tasks)
        const rightSectionContent = `
            <h2>Task Summary</h2>
            <div class="summary-item">Total Tasks - <span>${totalTasks}</span></div>
            <div class="summary-item">Completed Tasks: <span>${completedTasks}</span></div>
            <div class="summary-item">Ongoing Tasks: <span>${ongoingTasks}</span></div>
            <div class="summary-item">Overdue Tasks: <span>${overdueTasks}</span></div>
        `;

        rightSection.innerHTML = rightSectionContent;

        // Append the left and right sections to the dashboard container
        dashboardContainer.appendChild(leftSection);
        dashboardContainer.appendChild(rightSection);

        // Finally, append the dashboard container to the main content area
        main.appendChild(dashboardContainer);
    }

    // Helper function to determine if a task is overdue
    function isTaskOverdue(dueDate) {
        // Convert the task's due date string into a JavaScript Date object
        const taskDueDate = new Date(dueDate);
        // Get the current date and time
        const currentDate = new Date();
        // Reset the current date to midnight, eliminating time from the comparison
        currentDate.setHours(0, 0, 0, 0);

        // Return true if the task's due date is strictly earlier than today's date, meaning it is overdue
        return taskDueDate < currentDate;
    }

    // Helper function to determine if a task is ongoing
    function isTaskOngoing(dueDate) {
        // Convert the task's due date string into a JavaScript Date object
        const taskDueDate = new Date(dueDate);
        // Get the current date and time
        const currentDate = new Date();
        // Reset the current date to midnight to compare only the date portion
        currentDate.setHours(0, 0, 0, 0);

        // Return true if the task's due date is today or in the future
        return taskDueDate >= currentDate;
    }

    // Main function to load and display the tasks section
    function tasksFunc() {
        // Clear the main content area before rendering the tasks section
        main.innerHTML = '';
        // Remove any specific classes, such as "side-by-side", that might affect the layout
        main.classList.remove("side-by-side");

        // Create the container for the task header (includes search bar and "Add task" button)
        let taskHead = document.createElement("div");
        taskHead.classList.add("taskHead");

        // Create a container for the search bar and attach relevant CSS classes
        let searchBarContainer = document.createElement("div");
        searchBarContainer.classList.add("searchBarContainer");

        // Create the search bar input field where users can type task names to filter the list
        let searchBar = document.createElement("input");
        searchBar.type = "search"; // Specifies that this input field is for search functionality
        searchBar.placeholder = "Search tasks..."; // Placeholder text prompting the user
        searchBar.classList.add("searchBar"); // Add styling class for the search bar

        // Event listener for detecting user input in the search bar
        searchBar.addEventListener("input", function() {
            // If the search bar is cleared (empty), display all tasks
            if (searchBar.value === "") {
                const tasks = document.querySelectorAll("#taskList li");
                tasks.forEach(task => task.style.display = "block"); // Show all tasks
            }
        });

        // Create the search icon (magnifying glass) element to trigger a search
        let searchIcon = document.createElement("img");
        searchIcon.src = "images/magnifying-glass.png"; // Path to the search icon image
        searchIcon.alt = "Search"; // Alternate text for accessibility
        searchIcon.classList.add("searchIcon"); // Add styling class for the search icon

        // Event listener for clicking the search icon to perform a search
        searchIcon.addEventListener("click", function() {
            const searchValue = searchBar.value.toLowerCase(); // Get the search input in lowercase
            const tasks = document.querySelectorAll("#taskList li"); // Get all tasks in the task list

            // Loop through all tasks to filter based on the search value
            tasks.forEach(task => {
                const taskName = task.querySelector(".task-name").textContent.toLowerCase(); // Get task name
                if (taskName.includes(searchValue)) {
                    task.style.display = "block"; // Show the task if it matches the search term
                } else {
                    task.style.display = "none"; // Hide the task if it doesn't match the search term
                }
            });
        });

        // Append the search bar and icon into the searchBarContainer
        searchBarContainer.appendChild(searchBar);
        searchBarContainer.appendChild(searchIcon);

        // Create the "Add task" button that allows users to create new tasks
        let addTaskBTN = document.createElement("button");
        addTaskBTN.classList.add("addTask"); // Add styling class for the button
        addTaskBTN.innerHTML = "<span class='cross'>+</span> Add task"; // Display a "+" symbol and text

        // Event listener to handle clicking the "Add task" button, triggering the task creation popup
        addTaskBTN.addEventListener("click", function () {
            createTaskPopup(); // Call the function to display a popup for creating a new task
        });

        // Append the search bar container and "Add task" button to the task header
        taskHead.appendChild(searchBarContainer);
        taskHead.appendChild(addTaskBTN);

        // Append the task header (search bar + "Add task" button) to the main content area
        main.appendChild(taskHead);

        // Load tasks into the main section (assumed to be defined elsewhere)
        loadTasks();
    }

    // Function to handle notifications section
    function notificationsFunc() {
        main.innerHTML = ""; // Clear the main content area
        
        // Create the main container for notifications
        const notificationContainer = document.createElement("div");
        notificationContainer.classList.add("notification-container", "fade-in"); // Add a CSS class for styling

        // Create sections for different categories of tasks
        const overdueSection = createNotificationCategory("Overdue Tasks"); // Section for overdue tasks
        const ongoingSection = createNotificationCategory("Ongoing Tasks"); // Section for ongoing tasks
        const completedSection = createNotificationCategory("Completed Tasks"); // Section for completed tasks

        // Retrieve current user and user data from local storage
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        const userData = JSON.parse(localStorage.getItem("userData"));
        
        // If both current user and user data exist
        if (currentUser && userData) {
            // Find the user that matches the current logged-in username
            const user = userData.find(u => u.username === currentUser.username);
            
            // If the user is found and has tasks
            if (user && user.tasks) {
                // Filter tasks into overdue, ongoing, and completed categories
                const overdueTasks = user.tasks.filter(task => isTaskOverdue(task.date) && !task.completed);
                const ongoingTasks = user.tasks.filter(task => isTaskOngoing(task.date) && !task.completed);
                const completedTasks = user.tasks.filter(task => task.completed);
                
                // Populate the respective sections with the filtered tasks
                populateTaskSection(overdueSection, overdueTasks);
                populateTaskSection(ongoingSection, ongoingTasks);
                populateTaskSection(completedSection, completedTasks);
            }
        }

        // Append the task sections to the main notification container
        notificationContainer.appendChild(overdueSection);
        notificationContainer.appendChild(ongoingSection);
        notificationContainer.appendChild(completedSection);

        // Append the notification container to the main content area
        main.appendChild(notificationContainer);

        // Update the notification icon after displaying tasks
        updateNotificationIcon();
    }

    // Helper function to populate a notification category section with tasks
    function populateTaskSection(container, tasks) {
        // If there are no tasks in this category, show a "No tasks" message
        if (tasks.length === 0) {
            const emptyMessage = document.createElement("p");
            emptyMessage.textContent = "No tasks available in this category.";
            container.appendChild(emptyMessage);
        } else {
            // Otherwise, loop through the tasks and display each one
            tasks.forEach(task => {
                const taskItem = document.createElement("li");
                taskItem.classList.add("task-notification"); // Add a CSS class for styling
                taskItem.textContent = `${task.name} (Due: ${task.date})`; // Display task name and due date
                container.appendChild(taskItem); // Append the task to the container
            });
        }
    }

    // Helper function to determine if a task is overdue
    function isTaskOverdue(dueDate) {
        const taskDueDate = new Date(dueDate); // Convert task due date to a Date object
        const currentDate = new Date(); // Get the current date
        return taskDueDate < currentDate; // Return true if the task is overdue
    }

    // Helper function to determine if a task is ongoing (due today or in the future)
    function isTaskOngoing(dueDate) {
        const taskDueDate = new Date(dueDate); // Convert task due date to a Date object
        const currentDate = new Date(); // Get the current date
        return taskDueDate >= currentDate; // Return true if the task is ongoing
    }

    // Helper function to check if two dates are the same day
    function isSameDay(date1, date2) {
        return date1.getFullYear() === date2.getFullYear() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() === date2.getDate(); // Compare year, month, and day
    }

    // Function to update the notification icon based on task status
    function updateNotificationIcon() {
        const currentUser = JSON.parse(localStorage.getItem("currentUser")); // Get current user from local storage
        const userData = JSON.parse(localStorage.getItem("userData")); // Get user data from local storage
        
        // If both current user and user data exist
        if (currentUser && userData) {
            const user = userData.find(u => u.username === currentUser.username); // Find the current user
            if (user && user.tasks) {
                // Check if there are any ongoing tasks
                const hasOngoing = user.tasks.some(task => isTaskOngoing(task.date) && !task.completed);

                // Update the notification icon based on the task status
                if (hasOngoing) {
                    document.querySelector("#notifications img").src = "images/notification (1).png"; // Show active notification icon
                } else {
                    document.querySelector("#notifications img").src = "images/notification.png"; // Show inactive notification icon
                }
            }
        }
    }

    // Helper function to create a notification category section (e.g., "Overdue Tasks")
    function createNotificationCategory(title) {
        const container = document.createElement("div"); // Create a div for the category
        container.classList.add("notification-category"); // Add a CSS class for styling

        const header = document.createElement("h3"); // Create an h3 element for the category title
        header.textContent = title; // Set the category title
        container.appendChild(header); // Append the title to the container

        return container; // Return the container element
    } 

    // Function to load tasks from local storage and display them in a list
    function loadTasks() {
        const taskList = document.createElement("ul"); // Create an unordered list to hold tasks
        taskList.id = "taskList"; // Assign an ID to the task list for easy access

        // Retrieve user data and current user from local storage
        let userData = JSON.parse(localStorage.getItem("userData"));
        let currentUser = JSON.parse(localStorage.getItem("currentUser"));

        // Check if user data and current user exist
        if (userData && currentUser) {
            // Find the user that matches the current logged-in username
            const user = userData.find(u => u.username === currentUser.username);

            // If the user is found and has tasks
            if (user && user.tasks) {
                // Loop through each task and add it to the task list
                user.tasks.forEach(task => {
                    addTaskToTaskList(task); // Function to append the task to the list
                });
            }
        }

        main.appendChild(taskList); // Append the task list to the main content area
    }

    // Function to create a popup for editing a task
    function createEditPopup(task) {
        let popupOverlay = document.createElement("div"); // Create overlay for the popup
        popupOverlay.classList.add("popup-overlay"); // Add a class for styling

        let popup = document.createElement("div"); // Create the popup container
        popup.classList.add("popup"); // Add a class for styling

        let popupContent = document.createElement("div"); // Create a content area for the popup
        popupContent.classList.add("popup-content");

        const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

        // Populate the popup with HTML content including the task details
        popupContent.innerHTML = `
            <h2>Edit Task</h2>
            <form id="editTaskForm">
                <label for="editTaskName">Task Name</label>
                <input type="text" id="editTaskName" name="editTaskName" placeholder="Task Name" value="${task.name}" required>

                <label for="editTaskPriority">Priority</label>
                <select id="editTaskPriority" name="editTaskPriority" required>
                    <option value="high" ${task.priority === 'high' ? 'selected' : ''}>High</option>
                    <option value="medium" ${task.priority === 'medium' ? 'selected' : ''}>Medium</option>
                    <option value="low" ${task.priority === 'low' ? 'selected' : ''}>Low</option>
                </select>

                <label for="editTaskDate">Deadline</label>
                <input type="date" id="editTaskDate" name="editTaskDate" value="${task.date}" required min="${today}">

                <div class="popup-buttons">
                    <button type="submit">Save</button>
                    <button type="button" id="cancelEditBtn">Cancel</button>
                </div>
            </form>
        `;

        // Append content to the popup
        popup.appendChild(popupContent);
        document.body.appendChild(popupOverlay); // Add overlay to the body
        document.body.appendChild(popup); // Add popup to the body

        // Add fade-in effect for the popup and overlay
        setTimeout(() => {
            popup.classList.add("fade-in");
            popupOverlay.classList.add("fade-in");
        }, 10);

        // Event listener to handle the cancel button
        document.getElementById("cancelEditBtn").addEventListener("click", () => closePopup(popup, popupOverlay));
        // Close the popup when overlay is clicked
        popupOverlay.addEventListener("click", () => closePopup(popup, popupOverlay));

        // Event listener for the form submission
        document.getElementById("editTaskForm").addEventListener("submit", function (event) {
            event.preventDefault(); // Prevent default form submission

            // Create an updated task object
            const updatedTask = {
                name: document.getElementById("editTaskName").value,
                priority: document.getElementById("editTaskPriority").value,
                date: document.getElementById("editTaskDate").value,
                description: task.description // Keep the same description
            };

            // Retrieve current user data from local storage
            let tasks = JSON.parse(localStorage.getItem("userData")) || [];
            const currentUser = JSON.parse(localStorage.getItem("currentUser"));

            if (currentUser) {
                // Find the index of the current user in the user data array
                const userIndex = tasks.findIndex(u => u.username === currentUser.username);
                if (userIndex !== -1) {
                    // Check for duplicate task names
                    const isDuplicate = tasks[userIndex].tasks.some(t => 
                        t.name.toLowerCase() === updatedTask.name.toLowerCase() && t.name !== task.name
                    );

                    if (isDuplicate) {
                        alert(`Task with the name "${updatedTask.name}" already exists.`); // Alert for duplicate task name
                        return; // Exit if duplicate is found
                    }

                    // Update the user's task with the updated task details
                    tasks[userIndex].tasks = tasks[userIndex].tasks.map(t => 
                        t.name === task.name ? { ...t, ...updatedTask } : t
                    );

                    // Save updated tasks back to local storage
                    localStorage.setItem("userData", JSON.stringify(tasks));
                }
            }

            // Clear the current task list and reload tasks to reflect changes
            const taskList = document.getElementById("taskList");
            if (taskList) {
                taskList.innerHTML = ''; // Clear existing tasks
            }

            loadTasks(); // Reload tasks to show the updated list

            closePopup(popup, popupOverlay); // Close the popup
        });
    }

    // Function to create a popup for adding a new task
    function createTaskPopup() {
        let popupOverlay = document.createElement("div"); // Create overlay for the popup
        popupOverlay.classList.add("popup-overlay"); // Add a class for styling

        let popup = document.createElement("div"); // Create the popup container
        popup.classList.add("popup"); // Add a class for styling

        let popupContent = document.createElement("div"); // Create a content area for the popup
        popupContent.classList.add("popup-content");

        const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

        // Populate the popup with HTML content for adding a new task
        popupContent.innerHTML = `
            <h2>Add Task</h2>
            <form id="addTaskForm">
                <label for="taskName">Task Name</label>
                <input type="text" id="taskName" placeholder="Task Name" name="taskName" required>
                
                <label for="taskDescription">Description</label>
                <textarea id="taskDescription" placeholder="Task Description" name="taskDescription" required></textarea>
                <span id="descriptionError" class="error" style="color: red; display: none;">Description must be at least 10 words.</span>
                
                <label for="taskPriority">Priority</label>
                <select id="taskPriority" name="taskPriority" required>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                </select>
                
                <label for="taskDate">Deadline</label>
                <input type="date" id="taskDate" name="taskDate" required min="${today}">
                
                <div class="popup-buttons">
                    <button type="submit">Add Task</button>
                    <button type="button" id="cancelAddTaskBtn">Cancel</button>
                </div>
            </form>
        `;

        // Append content to the popup
        popup.appendChild(popupContent);
        document.body.appendChild(popupOverlay); // Add overlay to the body
        document.body.appendChild(popup); // Add popup to the body

        // Add fade-in effect for the popup and overlay
        setTimeout(() => {
            popup.classList.add("fade-in");
            popupOverlay.classList.add("fade-in");
        }, 10);

        // Event listener for cancel button to close the popup
        document.getElementById("cancelAddTaskBtn").addEventListener("click", closePopup);
        // Close the popup when overlay is clicked
        popupOverlay.addEventListener("click", closePopup);

        // Event listener for form submission to add a new task
        document.getElementById("addTaskForm").addEventListener("submit", function (event) {
            event.preventDefault(); // Prevent default form submission

            // Retrieve input values from the form
            const taskName = document.getElementById("taskName").value;
            const taskDescription = document.getElementById("taskDescription").value;
            const taskPriority = document.getElementById("taskPriority").value;
            const taskDate = document.getElementById("taskDate").value;

            const descriptionError = document.getElementById("descriptionError"); // Reference to error message
            const wordCount = taskDescription.trim().split(/\s+/).length; // Count words in description

            // Validate that the description has at least 10 words
            if (wordCount < 10) {
                descriptionError.style.display = "block"; // Show error if validation fails
                return;
            } else {
                descriptionError.style.display = "none"; // Hide error if validation passes
            }

            // Retrieve user data from local storage
            const tasks = JSON.parse(localStorage.getItem("userData")) || [];
            const currentUser = JSON.parse(localStorage.getItem("currentUser"));
            let isDuplicate = false; // Flag for duplicate tasks

            // Check if the current user exists
            if (currentUser) {
                const userIndex = tasks.findIndex(u => u.username === currentUser.username);
                if (userIndex !== -1 && tasks[userIndex].tasks) {
                    // Check for duplicate task names in the user's tasks
                    isDuplicate = tasks[userIndex].tasks.some(t => t.name === taskName);
                }
            }

            // Alert user if a duplicate task is found
            if (isDuplicate) {
                alert("A task with this name already exists. Please choose a different name.");
                return; // Exit if duplicate is found
            }

            // Create a new task object
            const newTask = {
                name: taskName,
                description: taskDescription,
                priority: taskPriority,
                date: taskDate,
                createdOn: new Date().toLocaleDateString() // Save the date the task was created
            };

            addTaskToLocalStorage(newTask); // Function to save the new task in local storage
            addTaskToTaskList(newTask); // Function to add the new task to the displayed list

            closePopup(); // Close the popup after adding the task
        });

        // Function to close the popup
        function closePopup() {
            popup.classList.remove("fade-in"); // Remove fade-in class for the popup
            popupOverlay.classList.remove("fade-in"); // Remove fade-in class for the overlay

            setTimeout(() => {
                popup.remove(); // Remove popup from the DOM after a delay
                popupOverlay.remove(); // Remove overlay from the DOM after a delay
            }, 300); // Delay to match the CSS transition duration
        }
    }    

    // Function to add a new task to the task list
    function addTaskToTaskList(task) {
        // Get the task list element by its ID; create it if it doesn't exist
        let taskList = document.getElementById("taskList");
        if (!taskList) {
            taskList = document.createElement("ul"); // Create a new unordered list for tasks
            taskList.id = "taskList"; // Assign an ID for the task list
            main.appendChild(taskList); // Append the task list to the main container
        }

        // Create a new list item for the task
        const newTask = document.createElement("li");
        newTask.classList.add("task-item"); // Add class for styling
        newTask.style.opacity = 0; // Start with an opacity of 0 for fade-in effect

        // Create a container for the task elements
        const taskContainer = document.createElement("div");
        taskContainer.classList.add("task-container"); // Add class for styling

        // Fade in effect for the new task
        setTimeout(() => {
            newTask.style.transition = 'opacity 0.5s'; // Transition for opacity
            newTask.style.opacity = 1; // Set opacity to 1 after a brief delay
        }, 10);

        // Create a container for task details
        const taskDetailsContainer = document.createElement("div");
        taskDetailsContainer.classList.add("task-details"); // Add class for styling

        // Create an image for the task status (completed/incomplete)
        const statusImage = document.createElement("img");
        statusImage.src = task.completed ? "images/checked.png" : "images/undone.png"; // Set image based on task completion
        statusImage.alt = task.completed ? "Completed Task" : "Incomplete Task"; // Set appropriate alt text
        statusImage.classList.add("task-status"); // Add class for styling

        // Toggle task completion on status image click
        statusImage.addEventListener("click", function () {
            task.completed = !task.completed; // Toggle the completed status
            statusImage.src = task.completed ? "images/checked.png" : "images/undone.png"; // Update status image

            // Update user data in local storage
            let tasks = JSON.parse(localStorage.getItem("userData")) || [];
            const currentUser = JSON.parse(localStorage.getItem("currentUser")); // Retrieve current user data
            if (currentUser) {
                const userIndex = tasks.findIndex(u => u.username === currentUser.username); // Find the user in tasks
                if (userIndex !== -1) {
                    // Update the task completion status in local storage
                    tasks[userIndex].tasks = tasks[userIndex].tasks.map(t =>
                        t.name === task.name ? { ...t, completed: task.completed } : t
                    );
                    localStorage.setItem("userData", JSON.stringify(tasks)); // Save updated tasks back to local storage
                }
            }
            updateNotificationIcon();
        });

        // Create a span element for the task name
        const taskName = document.createElement("span");
        taskName.classList.add("task-name"); // Add class for styling
        taskName.textContent = task.name; // Set the task name text
        
        // Create a container for the status image and task name
        const statusAndNameContainer = document.createElement("div");
        statusAndNameContainer.classList.add("status-name-container"); // Add class for styling
        statusAndNameContainer.appendChild(statusImage); // Add status image to container
        statusAndNameContainer.appendChild(taskName); // Add task name to container

        // Append status and name container to task container
        taskContainer.appendChild(statusAndNameContainer);

        // Create a span for the task priority
        const taskPriority = document.createElement("span");
        taskPriority.classList.add("task-priority"); // Add class for styling
        taskPriority.textContent = `${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}`; // Capitalize the first letter of priority

        // Set priority styling based on task priority level
        if (task.priority.toLowerCase() === "high") {
            taskPriority.classList.add("high");
        } else if (task.priority.toLowerCase() === "medium") {
            taskPriority.classList.add("medium");
        } else {
            taskPriority.classList.add("low");
        }

        // Create a span for the task deadline
        const taskDeadline = document.createElement("span");
        taskDeadline.classList.add("task-deadline"); // Add class for styling
        taskDeadline.textContent = `Deadline: ${task.date}`; // Set deadline text

        // Create a span for the task creation date
        const taskCreated = document.createElement("span");
        taskCreated.classList.add("task-created"); // Add class for styling
        taskCreated.textContent = `Created On: ${task.createdOn}`; // Set creation date text

        // Append priority, created date, and deadline to the task details container
        taskDetailsContainer.appendChild(taskPriority);
        taskDetailsContainer.appendChild(taskCreated);
        taskDetailsContainer.appendChild(taskDeadline);

        // Create a container for the buttons
        const btnContainer = document.createElement("div");
        btnContainer.classList.add("button-container"); // Add class for styling

        // Create an edit button with an image
        const editButton = document.createElement("img");
        editButton.src = "images/edit.png"; // Set image for the edit button
        editButton.alt = "Edit"; // Set alt text for accessibility
        editButton.classList.add("editTask"); // Add class for styling
        // Open the edit popup on button click
        editButton.addEventListener("click", function (event) {
            event.stopPropagation(); // Prevent event from bubbling up
            createEditPopup(task); // Call the function to create an edit popup
        });

        // Create a delete button with an image
        const deleteBtn = document.createElement("img");
        deleteBtn.src = "images/trash-bin.png"; // Set image for the delete button
        deleteBtn.alt = "Delete"; // Set alt text for accessibility
        deleteBtn.classList.add("delete-task"); // Add class for styling
        // Handle task deletion on button click
        deleteBtn.addEventListener("click", function (event) {
            event.stopPropagation(); // Prevent event from bubbling up

            newTask.style.transition = 'opacity 0.5s'; // Set transition for fading out
            newTask.style.opacity = 0; // Fade out the task
            // After fade out, delete the task
            setTimeout(() => {
                deleteTask(task); // Call the function to delete the task
                updateNotificationIcon(); // Update notification icon after deletion
                newTask.remove(); // Remove the task from the DOM
            }, 500);
        });

        // Append the edit and delete buttons to the button container
        btnContainer.appendChild(editButton);
        btnContainer.appendChild(deleteBtn);

        // Append details and buttons to the task container
        taskContainer.appendChild(taskDetailsContainer);
        taskContainer.appendChild(btnContainer);

        // Create a span for task description
        const taskDescription = document.createElement("span");
        taskDescription.classList.add("task-description"); // Add class for styling
        taskDescription.textContent = task.description; // Set task description text
        taskDescription.style.display = "none"; // Initially hide the description

        // Toggle the display of task description on task click
        newTask.addEventListener("click", function (event) {
            // Ensure the description is only toggled if non-button areas are clicked
            if (!event.target.classList.contains('editTask') && !event.target.classList.contains('delete-task') && !event.target.classList.contains('task-status')) {
                taskDescription.style.display = taskDescription.style.display === "none" ? "block" : "none"; // Toggle display
            }
        });

        // Append task container and description to the new task element
        newTask.appendChild(taskContainer);
        newTask.appendChild(taskDescription);
        
        // Append the new task to the task list
        taskList.appendChild(newTask);

        // Check if the task deadline is approaching
        deadlineCheck(newTask, task.date);

        // Update the notification icon for task updates
        updateNotificationIcon();
    }
        
    // Function to check if a task's due date has passed or is due today
    function deadlineCheck(taskElement, dueDate) {
        const deadlineDate = new Date(dueDate); // Convert dueDate string to a Date object
        const today = new Date(); // Get the current date
        today.setHours(0, 0, 0, 0); // Set today's time to midnight to compare only the date

        // Check if the task's due date has passed
        if (deadlineDate < today) {
            taskElement.style.backgroundColor = 'red'; // Highlight overdue tasks in red
            taskElement.style.color = 'beige';
            taskElement.style.borderRadius = '5px';
        } else if (deadlineDate.toDateString() === today.toDateString()) {
            taskElement.style.backgroundColor = 'yellow'; // Highlight tasks due today in yellow
        }
    }

    // Create the search icon for the task list
    let searchIcon = document.createElement("img");
    searchIcon.src = "images/magnifying-glass.png"; // Set the source of the search icon
    searchIcon.alt = "Search"; // Set alt text for accessibility
    searchIcon.classList.add("searchIcon"); // Add a class for styling

    // Add click event listener to the search icon
    searchIcon.addEventListener("click", function() {
        const searchValue = searchBar.value.toLowerCase(); // Get the search input value in lowercase
        const tasks = document.querySelectorAll("#taskList li"); // Select all task list items

        // Iterate through each task to filter based on the search value
        tasks.forEach(task => {
            const taskName = task.querySelector(".task-name").textContent.toLowerCase(); // Get task name
            // Show or hide tasks based on whether the task name includes the search value
            if (taskName.includes(searchValue)) {
                task.style.display = "block"; // Display matching tasks
            } else {
                task.style.display = "none"; // Hide non-matching tasks
            }
        });
    });

    // Function to delete a specified task from local storage
    function deleteTask(taskToDelete) {
        const currentUser = localStorage.getItem("currentUser"); // Get the current user from local storage
        if (currentUser) {
            const user = JSON.parse(currentUser); // Parse the current user data
            const storedData = localStorage.getItem("userData"); // Get all stored user data

            if (storedData) {
                const users = JSON.parse(storedData); // Parse user data to an object
                const userIndex = users.findIndex(u => u.username === user.username); // Find the index of the current user
                if (userIndex !== -1 && Array.isArray(users[userIndex].tasks)) {
                    // Filter out the task to be deleted
                    users[userIndex].tasks = users[userIndex].tasks.filter(task => 
                        task.name !== taskToDelete.name || task.date !== taskToDelete.date
                    );

                    // Update the user data in local storage
                    localStorage.setItem("userData", JSON.stringify(users));
                }
            }
        }
    }

    // Function to add a task to local storage for the current user
    function addTaskToLocalStorage(task) {
        const currentUser = localStorage.getItem("currentUser"); // Get the current user

        if (currentUser) {
            const user = JSON.parse(currentUser); // Parse current user data

            const storedData = localStorage.getItem("userData"); // Get all stored user data
            let users = storedData ? JSON.parse(storedData) : []; // Parse to object or initialize as empty array

            const userIndex = users.findIndex(u => u.username === user.username); // Find current user index

            if (userIndex !== -1) {
                users[userIndex].tasks = users[userIndex].tasks || []; // Initialize tasks array if undefined
                
                users[userIndex].tasks.push(task); // Add new task to user's tasks
                
                // Update the user data in local storage
                localStorage.setItem("userData", JSON.stringify(users));
            }
        }
    }

    // Add click event listener to the settings button to open settings popup
    document.getElementById("settings").addEventListener("click", openSettingsPopup);

    // Function to open the settings popup for the current user
    function openSettingsPopup() {
        const currentUser = JSON.parse(localStorage.getItem("currentUser")); // Get current user data

        // Create a semi-transparent overlay for the popup
        const popupOverlay = document.createElement("div");
        popupOverlay.classList.add("popup-overlay");
        popupOverlay.style.position = "fixed"; // Fix position to cover the screen
        popupOverlay.style.top = "0";
        popupOverlay.style.left = "0";
        popupOverlay.style.width = "100%";
        popupOverlay.style.height = "100%";
        popupOverlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)"; // Set background color with opacity

        // Create the main popup container
        const popup = document.createElement("div");
        popup.classList.add("popup");

        // Populate the popup with content including settings fields
        popup.innerHTML = `
            <div class="popup-content">
                <h2>Settings</h2>
                <div id="settingsFields">
                    <div class="setting-item">
                        <label>Username: </label>
                        <span id="usernameDisplay">${currentUser.username}</span>
                        <button id="editUsernameBtn">Edit</button>
                    </div>
                    <div id="usernameEditContainer" class="edit-container" style="display: none;">
                        <input type="text" id="newUsername" placeholder="New Username" value="${currentUser.username}">
                        <button id="saveUsernameBtn">Save</button>
                        <button id="cancelUsernameEditBtn">Cancel</button>
                    </div>
                    
                    <div class="setting-item">
                        <label>Password: </label>
                        <span id="passwordDisplay">${'*'.repeat(currentUser.password.length)}</span>
                        <button id="editPasswordBtn">Edit</button>
                    </div>
                    <div id="passwordEditContainer" class="edit-container" style="display: none;">
                        <input type="password" id="newPassword" placeholder="New Password">
                        <button id="savePasswordBtn">Save</button>
                        <button id="cancelPasswordEditBtn">Cancel</button>
                    </div>
                </div>
                <div class="popup-buttons">
                    <button type="button" id="deleteAccountBtn">Delete Account</button>
                    <button type="button" id="cancelBtn">Cancel</button>
                </div>
            </div>
        `;

        // Append the overlay and popup to the body
        document.body.appendChild(popupOverlay);
        document.body.appendChild(popup);

        // Add fade-in effect for the popup
        setTimeout(() => {
            popup.classList.add("fade-in");
            popupOverlay.classList.add("fade-in");
        }, 10);

        // Add event listener to edit username button
        document.getElementById("editUsernameBtn").addEventListener("click", function () {
            // Show the username edit container and hide the display
            document.getElementById("usernameDisplay").style.display = "none";
            document.getElementById("editUsernameBtn").style.display = "none";
            document.getElementById("usernameEditContainer").style.display = "block";
        });

        // Add event listener to save new username
        document.getElementById("saveUsernameBtn").addEventListener("click", function () {
            const newUsername = document.getElementById("newUsername").value; // Get new username value
            // Check if the new username is available
            if (!isUsernameAvailable(newUsername)) {
                alert("Username is already taken. Please choose a different one."); // Alert if taken
            } else {
                updateUserInLocalStorage(newUsername, null); // Update username in local storage
                document.getElementById("usernameDisplay").textContent = newUsername; // Update display
                closeUsernameEdit(); // Close edit container
            }
        });

        // Add event listener to cancel username edit
        document.getElementById("cancelUsernameEditBtn").addEventListener("click", function () {
            closeUsernameEdit(); // Close edit container
        });

        // Function to handle closing username edit
        function closeUsernameEdit() {
            document.getElementById("usernameDisplay").style.display = "inline"; // Show username display
            document.getElementById("editUsernameBtn").style.display = "inline"; // Show edit button
            document.getElementById("usernameEditContainer").style.display = "none"; // Hide edit container
        }

        // Add event listener to edit password button
        document.getElementById("editPasswordBtn").addEventListener("click", function () {
            // Show the password edit container and hide the display
            document.getElementById("passwordDisplay").style.display = "none";
            document.getElementById("editPasswordBtn").style.display = "none";
            document.getElementById("passwordEditContainer").style.display = "block";
        });

        // Add event listener to save new password
        document.getElementById("savePasswordBtn").addEventListener("click", function () {
            const newPassword = document.getElementById("newPassword").value; // Get new password value
            // Validate new password
            if (newPassword.trim() === "") {
                alert("Password cannot be empty."); // Alert if empty
            } 
            else if (newPassword.length < 10) {
                alert("Password must be at least 10 characters"); // Alert if too short
            }
            else {
                updateUserInLocalStorage(null, newPassword); // Update password in local storage
                closePasswordEdit(); // Close edit container
            }
        });

        // Add event listener to cancel password edit
        document.getElementById("cancelPasswordEditBtn").addEventListener("click", function () {
            closePasswordEdit(); // Close edit container
        });

        // Function to handle closing password edit
        function closePasswordEdit() {
            document.getElementById("passwordDisplay").style.display = "inline"; // Show password display
            document.getElementById("editPasswordBtn").style.display = "inline"; // Show edit button
            document.getElementById("passwordEditContainer").style.display = "none"; // Hide edit container
        }

        // Add event listener to cancel button in the popup
        document.getElementById("cancelBtn").addEventListener("click", () => {
            closePopup(popup, popupOverlay); // Close popup

            // Remove clicked state from sidebar items
            sidebarItems.forEach(el => el.classList.remove("clicked"));

            // Restore clicked state to the last active sidebar item
            if (lastFunction === "tasks") {
                document.getElementById("tasks").classList.add("clicked");
            } else if (lastFunction === "notifications") {
                document.getElementById("notifications").classList.add("clicked");
            } else if (lastFunction === "dashboard") {
                document.getElementById("dashboard").classList.add("clicked");
            }

            document.getElementById("settings").classList.remove("clicked"); // Remove clicked state from settings
        });

        // Add event listener to delete account button
        document.getElementById("deleteAccountBtn").addEventListener("click", () => {
            // Confirm account deletion
            if (confirm("Are you sure you want to delete your account?")) {
                deleteUserAccount(); // Call function to delete account
                window.location.href = "../auth/logIn/login.html"; // Redirect to login page
            }
        });

        // Close the popup if the overlay is clicked
        popupOverlay.addEventListener("click", () => closePopup(popup, popupOverlay));
    }

    // Function to close the popup and overlay
    function closePopup(popup, overlay) {
        popup.classList.remove("fade-in"); // Remove fade-in class for effect
        overlay.classList.remove("fade-in"); // Remove fade-in class for overlay

        // Remove popup and overlay after the fade-out duration
        setTimeout(() => {
            popup.remove();
            overlay.remove();
        }, 300);
    }

    // Function to check if a username is available
    function isUsernameAvailable(newUsername) {
        const storedData = localStorage.getItem("userData"); // Get all stored user data
        const currentUser = JSON.parse(localStorage.getItem("currentUser")); // Get current user data
        let users = storedData ? JSON.parse(storedData) : []; // Parse user data to object or initialize as empty array

        // If the new username is the same as the current, return false
        if (currentUser && currentUser.username === newUsername) {
            return false;
        }

        // Check if the new username is taken by any other user
        const isUsernameTaken = users.some(user => user.username === newUsername);

        return !isUsernameTaken; // Return true if username is available, false if taken
    }

    // Function to update user information in local storage
    function updateUserInLocalStorage(newUsername, newPassword) {
        const currentUser = JSON.parse(localStorage.getItem("currentUser")); // Get current user data
        const storedData = localStorage.getItem("userData"); // Get all stored user data
        let users = storedData ? JSON.parse(storedData) : []; // Parse user data to object or initialize as empty array

        if (currentUser) {
            const userIndex = users.findIndex(user => user.username === currentUser.username); // Find current user index

            if (userIndex !== -1) {
                // Update username if provided
                if (newUsername) {
                    users[userIndex].username = newUsername;
                    currentUser.username = newUsername; // Update currentUser object
                }
                // Update password if provided
                if (newPassword) {
                    users[userIndex].password = newPassword;
                    currentUser.password = newPassword; // Update currentUser object
                }

                // Update the user data in local storage
                localStorage.setItem("userData", JSON.stringify(users));
                localStorage.setItem("currentUser", JSON.stringify(currentUser));

                alert("User information updated successfully!"); // Alert user of successful update

                // Remove current user from local storage and redirect to login
                localStorage.removeItem("currentUser");
                window.location.href = "../auth/logIn/login.html"; // Redirect to login page
            } else {
                console.error("User not found in userData."); // Log error if user not found
            }
        } else {
            console.error("No currentUser found in localStorage."); // Log error if currentUser not found
        }
    }

    // Function to delete the current user account
    function deleteUserAccount() {
        const currentUser = JSON.parse(localStorage.getItem("currentUser")); // Get current user data
        
        if (currentUser) {
            const storedData = localStorage.getItem("userData"); // Get all stored user data
            let users = storedData ? JSON.parse(storedData) : []; // Parse user data to object or initialize as empty array

            // Filter out the current user from the users array
            users = users.filter(user => user.username !== currentUser.username);

            // Update the user data in local storage
            localStorage.setItem("userData", JSON.stringify(users));

            localStorage.removeItem("currentUser"); // Remove current user from local storage
            
            localStorage.removeItem("userTasks"); // Remove user tasks from local storage
        }
    }

    // Add click event listener to the logout button
    document.getElementById("logOut").addEventListener("click", function() {
        confirmLogout(); // Call logout confirmation function
    });

    // Function to confirm user logout
    function confirmLogout() {
        setTimeout(function() {
            const confirmation = confirm("Are you sure you want to log out?"); // Confirm logout
            if (confirmation) {
                // User confirmed logout
                localStorage.removeItem("currentUser"); // Remove current user from local storage
                window.location.href = "../auth/logIn/login.html"; // Redirect to login page
            } else {
                // User canceled logout
                // Remove clicked state from sidebar items
                sidebarItems.forEach(el => el.classList.remove("clicked"));

                // Restore clicked state to the last active sidebar item
                if (lastFunction === "tasks") {
                    document.getElementById("tasks").classList.add("clicked");
                } else if (lastFunction === "notifications") {
                    document.getElementById("notifications").classList.add("clicked");
                } else if (lastFunction === "dashboard") {
                    document.getElementById("dashboard").classList.add("clicked");
                }
            }
        }, 300); // Delay for a more user-friendly experience
    }
} else {
    // Redirect to login page if no current user is found
    window.location.href = "../auth/logIn/login.html";
}

// Add event listener to handle page unload
window.addEventListener("beforeunload", function(event) {
    localStorage.removeItem("currentUser"); // Remove current user on page unload

    event.preventDefault(); // Prevent the default action
    event.returnValue = ""; // Show confirmation dialog
});