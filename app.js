document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const deleteAccountBtn = document.getElementById('deleteAccountBtn');
    const signUpBtn = document.getElementById('signUpBtn'); // Add sign-up button
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password'); // Added password input
    const addTaskBtn = document.getElementById('addTaskBtn');
    const newTaskInput = document.getElementById('newTask');
    const tasksContainer = document.getElementById('tasks');
    const accountStatus = document.getElementById('accountStatus');
    const accountListContainer = document.getElementById('accountListContainer');
    const accountList = document.getElementById('accountList');
    const deleteAllAccountsBtn = document.getElementById('deleteAllAccountsBtn');

    const MAX_ACCOUNTS = 4;
    let currentUser = null;
    let accounts = JSON.parse(localStorage.getItem('accounts')) || [];

    signUpBtn.addEventListener('click', () => {
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim(); // Get the password input value
        if (username && password) {
            if (accounts.length >= MAX_ACCOUNTS) {
                alert('Maximum number of accounts reached. Cannot add more users.');
                return;
            }

            const existingAccount = accounts.find(acc => acc.username === username);
            if (existingAccount) {
                alert('Username already exists. Please choose a different username.');
                return;
            }

            accounts.push({ username, password }); // Store username and password
            localStorage.setItem('accounts', JSON.stringify(accounts)); // Update local storage
            updateAccountStatus();
            updateAccountList();
            alert('Account created successfully. You can now log in.');
        } else {
            alert('Please enter a username and password.');
        }

        // Clear inputs after action
        usernameInput.value = '';
        passwordInput.value = '';
    });

    // User Authentication
    loginBtn.addEventListener('click', () => {
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim(); // Get the password input value
        if (username && password) {
            const account = accounts.find(acc => acc.username === username);
            if (!account) {
                alert('This username does not exist. Please sign up first.');
                return;
            }

            if (account.password === password) { // Check if password matches
                currentUser = username;
                updateAuthUI();
                loadTasks();
                renderTasks();
            } else {
                alert('Incorrect password.');
            }

            // Clear inputs after action
            usernameInput.value = '';
            passwordInput.value = '';
        }
    });

    signUpBtn.addEventListener('click', () => {
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim(); // Get the password input value
        if (username && password) {
            if (accounts.length >= MAX_ACCOUNTS) {
                alert('Maximum number of accounts reached. Cannot add more users.');
                return;
            }

            const existingAccount = accounts.find(acc => acc.username === username);
            if (existingAccount) {
                alert('Username already exists. Please choose a different username.');
                return;
            }

            accounts.push({ username, password }); // Store username and password
            saveAccounts();
            alert('Account created successfully. You can now log in.');
        } else {
            alert('Please enter a username and password.');
        }

        // Clear inputs after action
        usernameInput.value = '';
        passwordInput.value = '';
    });

    logoutBtn.addEventListener('click', () => {
        currentUser = null;
        updateAuthUI();
        renderTasks();
        // Clear inputs after logout
        usernameInput.value = '';
        passwordInput.value = '';
    });

    deleteAccountBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            accounts = accounts.filter(account => account.username !== currentUser);
            localStorage.removeItem(currentUser);
            saveAccounts();
            updateAccountStatus(); // Update account status
            updateAccountList(); // Update account list
            currentUser = null;
            updateAuthUI();
            renderTasks();

            // Clear inputs after action
            usernameInput.value = '';
            passwordInput.value = '';
        }
    });

    deleteAllAccountsBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to delete all accounts? This action cannot be undone.')) {
            accounts.forEach(account => localStorage.removeItem(account.username));
            accounts = [];
            saveAccounts();
            updateAccountStatus();
            updateAccountList();
            currentUser = null;
            updateAuthUI();
            renderTasks();

            // Clear inputs after action
            usernameInput.value = '';
            passwordInput.value = '';
        }
    });

    function updateAccountStatus() {
        accountStatus.textContent = `${accounts.length}/${MAX_ACCOUNTS} accounts occupied`;
    }

    function updateAccountList() {
        accountList.innerHTML = ''; // Clear existing list

        accounts.forEach(account => {
            const accountItem = document.createElement('li');
            accountItem.textContent = account.username;
            
            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.addEventListener('click', () => {
                accounts = accounts.filter(acc => acc.username !== account.username);
                localStorage.removeItem(account.username);
                saveAccounts();
                updateAccountStatus();
                updateAccountList();
            });

            accountItem.appendChild(deleteBtn);
            accountList.appendChild(accountItem);
        });
    }

    function updateAuthUI() {
        if (currentUser) {
            usernameInput.style.display = 'none';
            passwordInput.style.display = 'none'; // Hide password input on login
            loginBtn.style.display = 'none';
            signUpBtn.style.display = 'none'; // Hide sign-up button on login
            logoutBtn.style.display = 'block';
            deleteAccountBtn.style.display = 'block';
            addTaskBtn.disabled = false;
            newTaskInput.disabled = false;
        } else {
            usernameInput.style.display = 'block';
            passwordInput.style.display = 'block'; // Show password input on logout
            loginBtn.style.display = 'block';
            signUpBtn.style.display = 'block'; // Show sign-up button on logout
            logoutBtn.style.display = 'none';
            deleteAccountBtn.style.display = 'none';
            addTaskBtn.disabled = true;
            newTaskInput.disabled = true;
        }
    }

    // Add Task
    addTaskBtn.addEventListener('click', () => {
        const taskText = newTaskInput.value.trim();
        if (taskText) {
            const task = { id: Date.now(), text: taskText, user: currentUser };
            let userTasks = JSON.parse(localStorage.getItem(currentUser)) || [];
            userTasks.push(task);
            localStorage.setItem(currentUser, JSON.stringify(userTasks));
            newTaskInput.value = ''; // Clear task input after adding
            renderTasks();
        }
    });

    // Load Tasks
    function loadTasks() {
        tasks = JSON.parse(localStorage.getItem(currentUser)) || [];
    }

    // Render Tasks
    function renderTasks() {
        tasksContainer.innerHTML = '';
        if (currentUser) {
            const userTasks = JSON.parse(localStorage.getItem(currentUser)) || [];
            userTasks.forEach(task => {
                const taskElement = document.createElement('div');
                taskElement.className = 'task';
                taskElement.draggable = true;
                taskElement.innerHTML = `
                    <span>${task.text}</span>
                    <button class="deleteBtn" data-id="${task.id}">Delete</button>
                `;
                taskElement.querySelector('.deleteBtn').addEventListener('click', () => {
                    let tasks = JSON.parse(localStorage.getItem(currentUser));
                    tasks = tasks.filter(t => t.id !== task.id);
                    localStorage.setItem(currentUser, JSON.stringify(tasks));
                    renderTasks();
                });
                tasksContainer.appendChild(taskElement);

                // Drag and Drop
                taskElement.addEventListener('dragstart', () => {
                    taskElement.classList.add('dragging');
                });
                taskElement.addEventListener('dragend', () => {
                    taskElement.classList.remove('dragging');
                });
            });

            tasksContainer.addEventListener('dragover', e => {
                e.preventDefault();
                const afterElement = getDragAfterElement(tasksContainer, e.clientY);
                const draggingElement = document.querySelector('.dragging');
                if (afterElement == null) {
                    tasksContainer.appendChild(draggingElement);
                } else {
                    tasksContainer.insertBefore(draggingElement, afterElement);
                }
                saveTasksOrder();
            });
        }
    }

    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.task:not(.dragging)')];

        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    // Save Tasks Order
    function saveTasksOrder() {
        const tasks = [];
        tasksContainer.querySelectorAll('.task').forEach(taskElement => {
            const text = taskElement.querySelector('span').innerText;
            const taskId = parseInt(taskElement.querySelector('.deleteBtn').dataset.id, 10);
            tasks.push({ id: taskId, text: text, user: currentUser });
        });
        localStorage.setItem(currentUser, JSON.stringify(tasks));
    }

    // Save Accounts to Local Storage
    function saveAccounts() {
        localStorage.setItem('accounts', JSON.stringify(accounts));
    }

    // Initial UI Update
    updateAuthUI();
    updateAccountStatus(); // Update account status
    updateAccountList(); // Update account list
    renderTasks();
});
