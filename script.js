const tasksContainer = document.getElementById('tasks');
const addTaskBtn = document.getElementById('addTaskBtn');
const newTaskInput = document.getElementById('newTask');
const dueDateInput = document.getElementById('dueDate');
const loginInterface = document.getElementById('loginInterface');
const signupInterface = document.getElementById('signupInterface');
const logoutBtn = document.getElementById('logoutBtn');
const deleteAccountBtn = document.getElementById('deleteAccountBtn');
const recoverPasswordBtn = document.getElementById('recoverPasswordBtn');
const showSignUpBtn = document.getElementById('showSignUpBtn');
const cancelSignUpBtn = document.getElementById('cancelSignUpBtn');
const loginBtn = document.getElementById('loginBtn');
const signUpBtn = document.getElementById('signUpBtn');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const signupUsernameInput = document.getElementById('signupUsername');
const signupPasswordInput = document.getElementById('signupPassword');
const signupSecurityQuestionInput = document.getElementById('signupSecurityQuestion');
const signupSecurityAnswerInput = document.getElementById('signupSecurityAnswer');
const accountList = document.getElementById('accountList');
const deleteAllAccountsBtn = document.getElementById('deleteAllAccountsBtn');
const accountStatus = document.getElementById('accountStatus');
const switchAccountBtn = document.getElementById('switchAccountBtn');

const MAX_ACCOUNTS = 4;
let accounts = JSON.parse(localStorage.getItem('accounts')) || [];
let currentAccount = null;
let tasks = [];

// Save accounts to local storage
const saveAccounts = () => {
    localStorage.setItem('accounts', JSON.stringify(accounts));
};

// Update UI for authentication status
const updateAuthUI = () => {
    if (currentAccount) {
        loginInterface.style.display = 'none';
        signupInterface.style.display = 'none';
        logoutBtn.style.display = 'inline-block';
        deleteAccountBtn.style.display = 'inline-block';
        switchAccountBtn.style.display = 'inline-block';
        recoverPasswordBtn.style.display = 'none';  // Hide recover password when logged in
        newTaskInput.disabled = false;
        dueDateInput.disabled = false;
        addTaskBtn.disabled = false;
        usernameInput.value = '';
        passwordInput.value = '';
    } else {
        loginInterface.style.display = 'block';
        signupInterface.style.display = 'none';
        logoutBtn.style.display = 'none';
        deleteAccountBtn.style.display = 'none';
        switchAccountBtn.style.display = 'none';
        recoverPasswordBtn.style.display = 'inline-block';  // Show recover password when not logged in
        newTaskInput.disabled = true;
        dueDateInput.disabled = true;
        addTaskBtn.disabled = true;
    }
};

// Function to update the task UI
const updateTaskUI = () => {
    tasksContainer.innerHTML = '';
    if (tasks.length > 0) {
        tasks.forEach((task, index) => {
            const taskElement = document.createElement('div');
            taskElement.className = 'task fadeIn'; // Add fadeIn class for fade-in animation
            if (task.done) {
                taskElement.classList.add('done');
            }
            
            // Check if the task is past the due date
            const currentDate = new Date();
            const dueDate = new Date(task.dueDate);
            if (!task.done && dueDate < currentDate) {
                taskElement.classList.add('uncompleted-date-passed');
                taskElement.innerHTML = `
                    <h3>${task.description}</h3>
                    <p>Due: ${task.dueDate} (Date passed)</p>
                    <button class="delete-btn" onclick="deleteTask(${index})">Delete</button>
                    <input type="checkbox" class="done-checkbox" disabled>
                    <label for="done-checkbox-${index}">Date passed</label>
                `;
            } else {
                taskElement.innerHTML = `
                    <h3>${task.description}</h3>
                    <p>Due: ${task.dueDate}</p>
                    <button class="delete-btn" onclick="deleteTask(${index})">Delete</button>
                    <input type="checkbox" class="done-checkbox" ${task.done ? 'checked' : ''} onchange="toggleTaskDone(${index})">
                    <label for="done-checkbox-${index}">${task.done ? 'Done' : 'Uncompleted'}</label>
                `;
            }

            taskElement.setAttribute('draggable', 'true');
            taskElement.id = `task-${index}`;
            taskElement.addEventListener('dragstart', handleDragStart);
            taskElement.addEventListener('dragover', handleDragOver);
            taskElement.addEventListener('drop', handleDrop);
            taskElement.addEventListener('dragend', handleDragEnd);
            tasksContainer.appendChild(taskElement);
            // Apply slide-in animation to newly added task
            taskElement.classList.add('slideInFromLeft');
        });
    }
};

// Function to toggle the "done" state of a task
const toggleTaskDone = (index) => {
    tasks[index].done = !tasks[index].done;
    updateTaskUI();
    saveAccounts(); // Ensure changes are saved
};

// Add Task button event listener
// Add Task button event listener
addTaskBtn.addEventListener('click', () => {
    const description = newTaskInput.value.trim();
    let dueDate = dueDateInput.value;

    if (!description) {
        alert('Please enter a description for the task.');
        return;
    }

    // Use current date if no due date is provided
    if (!dueDate) {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        let month = currentDate.getMonth() + 1;
        let day = currentDate.getDate();

        // Add leading zero if month/day is single digit
        month = month < 10 ? '0' + month : month;
        day = day < 10 ? '0' + day : day;

        dueDate = `${year}-${month}-${day}`;
    }

    const newTask = {
        description,
        dueDate,
        done: false
    };

    tasks.push(newTask);
    updateTaskUI();
    saveAccounts(); // Ensure changes are saved
    
    newTaskInput.value = '';
    dueDateInput.value = '';
});

// Example function to delete a task
const deleteTask = (index) => {
    tasks.splice(index, 1);
    updateTaskUI();
    saveAccounts(); // Ensure changes are saved
};

// Example drag and drop handlers
const handleDragStart = (event) => {
    event.dataTransfer.setData('text/plain', event.target.id);
    setTimeout(() => {
        event.target.classList.add('hide');
    }, 0);
};

const handleDragOver = (event) => {
    event.preventDefault();
    event.target.classList.add('drag-over');
};

const handleDrop = (event) => {
    event.preventDefault();
    event.target.classList.remove('drag-over');
    const id = event.dataTransfer.getData('text/plain');
    const draggable = document.getElementById(id);
    tasksContainer.insertBefore(draggable, event.target);
};

const handleDragEnd = (event) => {
    event.target.classList.remove('hide');
    const tasks = document.querySelectorAll('.task');
    tasks.forEach(task => {
        task.classList.remove('drag-over');
    });
};

// Update account list UI
const updateAccountListUI = () => {
    accountList.innerHTML = '';
    accounts.forEach((account, index) => {
        const accountElement = document.createElement('li');
        accountElement.textContent = account.username;
        if (currentAccount && currentAccount.username === account.username) {
            accountElement.classList.add('highlighted-account');
        } else {
            accountElement.classList.remove('highlighted-account');
        }
        accountList.appendChild(accountElement);
    });
};

// Switch account
switchAccountBtn.addEventListener('click', () => {
    const username = prompt('Enter the username of the account you want to switch to:');
    if (username === currentAccount.username) {
        alert('You are already logged in with this account.');
        return;
    }

    const account = accounts.find(acc => acc.username === username);
    if (!account) {
        alert('No account found with that username.');
        return;
    }

    const password = prompt('Enter the password for this account:');
    if (account.password !== password) {
        alert('Incorrect password.');
        return;
    }

    currentAccount = account;
    tasks = currentAccount.tasks;
    updateTaskUI();
    updateAuthUI();
    updateAccountStatus();
    updateAccountListUI();
});

// Login
loginBtn.addEventListener('click', () => {
    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    const account = accounts.find(acc => acc.username === username && acc.password === password);

    if (account) {
        currentAccount = account;
        tasks = currentAccount.tasks;
        updateTaskUI();
        updateAuthUI();
        updateAccountStatus();
        updateAccountListUI();
    } else {
        alert('Invalid username or password');
    }
});

// Show sign-up interface
showSignUpBtn.addEventListener('click', () => {
    loginInterface.style.display = 'none';
    signupInterface.style.display = 'block';
    recoverPasswordBtn.style.display = 'none';  // Hide recover password in sign-up
});

// Cancel sign-up
cancelSignUpBtn.addEventListener('click', () => {
    signupInterface.style.display = 'none';
    loginInterface.style.display = 'block';
    recoverPasswordBtn.style.display = 'inline-block';  // Show recover password in login
});

// Sign up
// Sign up
signUpBtn.addEventListener('click', () => {
    const username = signupUsernameInput.value.trim();
    const password = signupPasswordInput.value.trim();
    const securityQuestion = signupSecurityQuestionInput.value.trim();
    const securityAnswer = signupSecurityAnswerInput.value.trim();

    if (!username || !password || !securityQuestion || !securityAnswer) {
        alert('Please fill in all fields');
        return;
    }

    if (accounts.length >= MAX_ACCOUNTS) {
        alert('Maximum number of accounts reached');
        return;
    }

    const existingAccount = accounts.find(acc => acc.username === username);
    if (existingAccount) {
        alert('Username already exists');
        return;
    }

    if (!validateSecurityAnswer(securityAnswer, password) || !validateSecurityAnswer(securityQuestion, password)) {
        alert('Security answer or question cannot be the same as the password');
        return;
    }

    const newAccount = {
        username,
        password,
        securityQuestion,
        securityAnswer,
        tasks: []
    };

    accounts.push(newAccount);
    saveAccounts();
    updateAccountListUI();
    signupInterface.style.display = 'none';
    loginInterface.style.display = 'block';
    alert('Account created successfully');
});

// Function to validate security answer
const validateSecurityAnswer = (answer, password) => {
    return answer !== password;
};


// Logout
logoutBtn.addEventListener('click', () => {
    currentAccount = null;
    tasks = [];
    updateAuthUI();
    updateTaskUI();
});

// Delete account
deleteAccountBtn.addEventListener('click', () => {
    if (!currentAccount) return;

    const index = accounts.findIndex(acc => acc.username === currentAccount.username);
    if (index !== -1) {
        accounts.splice(index, 1);
        saveAccounts();
        currentAccount = null;
        tasks = [];
        updateAuthUI();
        updateTaskUI();
        updateAccountListUI();
    }
});

// Delete all accounts
deleteAllAccountsBtn.addEventListener('click', () => {
    accounts = [];
    saveAccounts();
    currentAccount = null;
    tasks = [];
    updateAuthUI();
    updateTaskUI();
    updateAccountListUI();
});

// Recover password
recoverPasswordBtn.addEventListener('click', () => {
    const username = prompt('Enter your username:');
    const account = accounts.find(acc => acc.username === username);

    if (!account) {
        alert('No account found with that username');
        return;
    }

    const securityAnswer = prompt(account.securityQuestion);
    if (securityAnswer !== account.securityAnswer) {
        alert('Incorrect answer to the security question');
        return;
    }

    const changePassword = confirm('Would you like to change your password?');
    if (changePassword) {
        const newPassword = prompt('Enter your new password:');
        account.password = newPassword;
        saveAccounts();
        alert('Password changed successfully');
    } else {
        alert(`Your password is: ${account.password}`);
    }
});

// Update account status UI
const updateAccountStatus = () => {
    const occupiedCount = accounts.length;
    accountStatus.textContent = `${occupiedCount}/${MAX_ACCOUNTS} accounts occupied`;
};

// Initial UI updates
updateAuthUI();
updateTaskUI();
updateAccountListUI();
updateAccountStatus();


document.addEventListener("DOMContentLoaded", function() {
    const goHomeBtn = document.getElementById('goHomeBtn');
    goHomeBtn.style.display = 'none';
});

const appSection = document.getElementById('app');
const otherSections = document.querySelectorAll('section:not(#app)');
const nav = document.getElementById('nav');
const header = document.getElementById('header');
const goHomeBtn = document.getElementById('goHomeBtn');
const goToAppBtns = document.querySelectorAll('a[href="#app"], button[href="#app"]');

goToAppBtns.forEach(btn => {
    btn.addEventListener('click', (event) => {
        event.preventDefault(); // Prevent the default behavior of the link
        appSection.style.display = 'block'; // Show the app

        otherSections.forEach(section => {
            section.style.display = 'none';
        });

        nav.style.display = 'none';
        goHomeBtn.style.display = 'block';
    });
});

goHomeBtn.addEventListener('click', () => {
    otherSections.forEach(section => {
        section.style.display = 'block';
    });

    nav.style.display = 'block';
    appSection.style.display = 'none';
    goHomeBtn.style.display = 'none';
});
