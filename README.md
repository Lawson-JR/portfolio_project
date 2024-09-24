Task Management and User Authentication System
--
This project is a simple web-based task management application with user authentication. It allows multiple users to manage their tasks after logging in or creating a new account. The app supports adding, deleting, and marking tasks as complete, along with secure account creation, login, and logout functionalities.

Features
User Authentication:

Create new accounts with unique usernames.
Login and logout functionality.
Recover passwords using a security question and answer.
Delete individual accounts or all accounts.
Task Management:

Add new tasks.
Delete tasks.
Mark tasks as complete or incomplete.
Drag and drop tasks to reorder them.
Technologies Used
HTML: Markup for the interface.
CSS: Styling the interface.
JavaScript: Implementing functionality and interactivity.
LocalStorage: Persisting user data and tasks.
Getting Started
Prerequisites
To run this project, you need a web browser that supports JavaScript and LocalStorage (all modern browsers do).

Installation
Clone the repository:

Copy code
git clone https://github.com/Lawson-JR/portfolio_project/
Open the index.html file in your web browser.

Usage
Creating an Account
Click on "Sign Up".
Fill in the username, password, security question, and security answer fields.
Click "Sign Up" to create the account.
Logging In
Enter your username and password.
Click "Login".
Adding Tasks
Ensure you are logged in.
Enter a task description in the input field.
Click "Add Task" to add the task to your list.
Completing Tasks
Click on a task to toggle its completion status.
Deleting Tasks
Click the "Delete" button next to a task to remove it from your list.
Dragging and Dropping Tasks
Click and hold on a task.
Drag it to the desired position and release it.
Recovering Password
Click "Recover Password".
Enter your username.
Answer the security question.
If the answer is correct, your password will be displayed.
Deleting an Account
Ensure you are logged in.
Click "Delete Account" to permanently remove your account.
Deleting All Accounts
Click "Delete All Accounts" to remove all user data.
Code Overview
JavaScript
The app.js file contains all the JavaScript code for the application. Here's a brief overview of its structure:

Constants and Variables: Define DOM elements, user accounts, and tasks.
Initialization: Load accounts and tasks from LocalStorage.
Authentication UI: Functions to update the UI based on the user's authentication status.
Task Management UI: Functions to manage tasks (add, delete, complete, reorder).
Account Management: Functions to handle user authentication, account creation, and password recovery.
Event Listeners: Attach event listeners to various buttons and inputs to handle user actions.
LocalStorage: Functions to save and retrieve user data from LocalStorage.
HTML
The index.html file contains the structure of the web page, including the task management interface, login form, and sign-up form.

CSS
The styles.css file contains the styles for the web page, ensuring a clean and responsive design.

Contributing
If you'd like to contribute to this project, please fork the repository and create a pull request with your changes. Contributions are always welcome!

Contact
For questions or feedback, feel free to contact me at lawson5n2010@gmail.com.
