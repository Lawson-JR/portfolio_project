document.addEventListener('DOMContentLoaded', () => {
    const tasksContainer = document.getElementById('tasks');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const newTaskInput = document.getElementById('newTask');
    const dueDateInput = document.getElementById('dueDate');

    // Elements references
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

    // Update the task UI based on the current tasks
    const updateTaskUI = () => {
        tasksContainer.innerHTML = '';
        if (tasks.length > 0) {
            tasks.forEach((task, index) => {
                const taskElement = document.createElement('div');
                taskElement.className = 'task';
                taskElement.setAttribute('draggable', 'true');
                taskElement.id = `task-${index}`;
                taskElement.innerHTML = `
                    <h3>${task.description}</h3>
                    <p>Due: ${task.dueDate}</p>
                    <button class="delete-btn" onclick="deleteTask(${index})">Delete</button>
                `;
                taskElement.addEventListener('dragstart', handleDragStart);
                taskElement.addEventListener('dragover', handleDragOver);
                taskElement.addEventListener('drop', handleDrop);
                taskElement.addEventListener('dragend', handleDragEnd);
                tasksContainer.appendChild(taskElement);
            });
        }
    };

    // Add a new task
    addTaskBtn.addEventListener('click', () => {
        const newTask = newTaskInput.value.trim();
        const dueDate = dueDateInput.value;

        if (newTask === '' || dueDate === '') {
            alert('Please enter a task and a due date.');
            return;
        }

        tasks.push({ description: newTask, dueDate });
        newTaskInput.value = '';
        dueDateInput.value = '';
        updateTaskUI();
        currentAccount.tasks = tasks;
        saveAccounts();
    });

    // Delete a task
    const deleteTask = (index) => {
        tasks.splice(index, 1);
        updateTaskUI();
        currentAccount.tasks = tasks;
        saveAccounts();
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
    signUpBtn.addEventListener('click', () => {
        const username = signupUsernameInput.value.trim();
        const password = signupPasswordInput.value.trim();
        const securityQuestion = signupSecurityQuestionInput.value.trim();
        const securityAnswer = signupSecurityAnswerInput.value.trim();

        if (!username || !password || !securityQuestion || !securityAnswer) {
            alert('Please fill out all fields.');
            return;
        }

        if (accounts.find(account => account.username === username)) {
            alert('Username already exists');
            return;
        }

        const newAccount = {
            username,
            password,
            securityQuestion,
            securityAnswer,
            tasks: []
        };

        if (accounts.length < MAX_ACCOUNTS) {
            accounts.push(newAccount);
            saveAccounts();
            alert('Sign-up successful! Please log in to access your account.');
            // Reset current account and display login interface
            currentAccount = null;
            tasks = [];
            loginInterface.style.display = 'block';
            signupInterface.style.display = 'none';
            recoverPasswordBtn.style.display = 'inline-block';  // Show recover password in login
            updateAuthUI();
            updateAccountStatus();
            updateAccountListUI();
        } else {
            alert('Maximum number of accounts reached.');
        }
    });

    // Logout
    logoutBtn.addEventListener('click', () => {
        currentAccount = null;
        tasks = [];
        updateAuthUI();
        updateTaskUI();
        updateAccountStatus();
        updateAccountListUI();
    });

    // Delete account
    deleteAccountBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            accounts = accounts.filter(account => account !== currentAccount);
            saveAccounts();
            currentAccount = null;
            tasks = [];
            updateAuthUI();
            updateTaskUI();
            updateAccountStatus();
            updateAccountListUI();
        }
    });

    // Delete all accounts
    deleteAllAccountsBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to delete all accounts? This action cannot be undone.')) {
            accounts = [];
            saveAccounts();
            currentAccount = null;
            tasks = [];
            updateAuthUI();
            updateTaskUI();
            updateAccountStatus();
            updateAccountListUI();
        }
    });
    
    // Recover password process
    recoverPasswordBtn.addEventListener('click', () => {
        const username = prompt('Enter your username:');
        const account = accounts.find(account => account.username === username);
    
        if (account) {
            const answer = prompt(account.securityQuestion);
            if (answer === account.securityAnswer) {
                alert(`Your password is: ${account.password}`);
            } else {
                alert('Incorrect answer to the security question.');
            }
        } else {
            alert('No account found with that username.');
        }
    });
    
    // Update account status
    const updateAccountStatus = () => {
        accountStatus.textContent = `${accounts.length}/${MAX_ACCOUNTS} accounts occupied`;
    };
    
    // Initial UI setup
    updateAuthUI();
    updateAccountStatus();
    updateAccountListUI();
    updateTaskUI();

    // Drag and drop functionality
    function handleDragStart(event) {
        event.dataTransfer.setData('text/plain', event.target.id);
        setTimeout(() => {
            event.target.classList.add('hide');
        }, 0);
    }

    function handleDragOver(event) {
        event.preventDefault();
        event.target.classList.add('drag-over');
    }

    function handleDrop(event) {
        event.preventDefault();
        event.target.classList.remove('drag-over');
        const id = event.dataTransfer.getData('text/plain');
        const draggable = document.getElementById(id);
        tasksContainer.insertBefore(draggable, event.target);
    }

    function handleDragEnd(event) {
        event.target.classList.remove('hide');
        const tasks = document.querySelectorAll('.task');
        tasks.forEach(task => {
            task.classList.remove('drag-over');
        });
    }
});
