document.addEventListener('DOMContentLoaded', () => {
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const signUpUsernameInput = document.getElementById('signupUsername');
    const signUpPasswordInput = document.getElementById('signupPassword');
    const signUpSecurityQuestionInput = document.getElementById('signupSecurityQuestion');
    const signUpSecurityAnswerInput = document.getElementById('signupSecurityAnswer');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const newTaskInput = document.getElementById('newTask');
    const dueDateInput = document.getElementById('dueDate');
    const tasksContainer = document.getElementById('tasks');
    const accountStatus = document.getElementById('accountStatus');
    const accountListContainer = document.getElementById('accountListContainer');
    const accountList = document.getElementById('accountList');
    const deleteAllAccountsBtn = document.getElementById('deleteAllAccountsBtn');

    const MAX_ACCOUNTS = 4;
    let currentUser = null;
    let accounts = JSON.parse(localStorage.getItem('accounts')) || [];

    showSignUpBtn.addEventListener('click', () => {
        document.getElementById('loginInterface').style.display = 'none';
        document.getElementById('signupInterface').style.display = 'block';
    });

    cancelSignUpBtn.addEventListener('click', () => {
        document.getElementById('signupInterface').style.display = 'none';
        document.getElementById('loginInterface').style.display = 'block';
    });

    recoverPasswordBtn.addEventListener('click', () => {
        const username = prompt('Enter your username:');
        if (username) {
            const account = accounts.find(acc => acc.username === username);
            if (account) {
                const securityQuestion = account.securityQuestion;
                const answer = prompt(securityQuestion);
                if (answer === account.securityAnswer) {
                    alert(`Your password is: ${account.password}`);
                } else {
                    alert('Incorrect answer!');
                }
            } else {
                alert('Username not found!');
            }
        }
    });

    signUpBtn.addEventListener('click', () => {
        const username = signUpUsernameInput.value.trim();
        const password = signUpPasswordInput.value.trim();
        const securityQuestion = signUpSecurityQuestionInput.value.trim();
        const securityAnswer = signUpSecurityAnswerInput.value.trim();
        if (username && password && securityQuestion && securityAnswer) {
            if (accounts.length >= MAX_ACCOUNTS) {
                alert('Maximum number of accounts reached. Cannot add more users.');
                return;
            }

            const existingAccount = accounts.find(acc => acc.username === username);
            if (existingAccount) {
                alert('Username already exists. Please choose a different username.');
                return;
            }

            accounts.push({ username, password, securityQuestion, securityAnswer });
            localStorage.setItem('accounts', JSON.stringify(accounts));
            updateAccountStatus();
            updateAccountList();
            alert('Account created successfully. You can now log in.');
        } else {
            alert('Please fill in all fields.');
        }

        signUpUsernameInput.value = '';
        signUpPasswordInput.value = '';
        signUpSecurityQuestionInput.value = '';
        signUpSecurityAnswerInput.value = '';
    });

    loginBtn.addEventListener('click', () => {
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();
        if (username && password) {
            const account = accounts.find(acc => acc.username === username);
            if (!account) {
                alert('This username does not exist. Please sign up first.');
                return;
            }

            if (account.password === password) {
                currentUser = username;
                updateAuthUI();
                loadTasks();
                renderTasks();
            } else {
                alert('Incorrect password.');
            }

            usernameInput.value = '';
            passwordInput.value = '';
        }
    });

    logoutBtn.addEventListener('click', () => {
        currentUser = null;
        updateAuthUI();
        renderTasks();
        usernameInput.value = '';
        passwordInput.value = '';
    });

    deleteAccountBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
            accounts = accounts.filter(account => account.username !== currentUser);
            localStorage.removeItem(currentUser);
            saveAccounts();
            updateAccountStatus();
            updateAccountList();
            currentUser = null;
            updateAuthUI();
            renderTasks();
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
            usernameInput.value = '';
            passwordInput.value = '';
        }
    });

    function updateAccountStatus() {
        accountStatus.textContent = `${accounts.length}/${MAX_ACCOUNTS} accounts occupied`;
    }

    function updateAccountList() {
        accountList.innerHTML = '';
        accounts.forEach(account => {
            const accountItem = document.createElement('li');
            accountItem.textContent = account.username;

            const switchBtn = document.createElement('button');
            switchBtn.textContent = 'Switch';
            switchBtn.addEventListener('click', () => {
                const password = prompt(`Enter password for ${account.username}`);
                if (password === account.password) {
                    currentUser = account.username;
                    updateAuthUI();
                    loadTasks();
                    renderTasks();
                } else {
                    alert('Incorrect password.');
                }
            });

            accountItem.appendChild(switchBtn);
            accountList.appendChild(accountItem);
        });
    }
    function updateAuthUI() {
        if (currentUser) {
            usernameInput.style.display = 'none';
            passwordInput.style.display = 'none';
            loginBtn.style.display = 'none';
            showSignUpBtn.style.display = 'none';
            logoutBtn.style.display = 'block';
            deleteAccountBtn.style.display = 'block';
            addTaskBtn.disabled = false;
            newTaskInput.disabled = false;
        } else {
            usernameInput.style.display = 'block';
            passwordInput.style.display = 'block';
            loginBtn.style.display = 'block';
            showSignUpBtn.style.display = 'block';
            logoutBtn.style.display = 'none';
            deleteAccountBtn.style.display = 'none';
            addTaskBtn.disabled = true;
            newTaskInput.disabled = true;
        }
    }

    function addTask(taskText) {
        const task = { id: Date.now(), text: taskText, user: currentUser };
        let userTasks = JSON.parse(localStorage.getItem(currentUser)) || [];
        userTasks.push(task);
        localStorage.setItem(currentUser, JSON.stringify(userTasks));
    }

    function loadTasks() {
        return JSON.parse(localStorage.getItem(currentUser)) || [];
    }

    function renderTasks() {
        tasksContainer.innerHTML = '';
        if (currentUser) {
            const userTasks = loadTasks();
            userTasks.forEach(task => {
                const taskElement = document.createElement('div');
                taskElement.className = 'task';
                taskElement.draggable = true;
                taskElement.innerHTML = `
                    <span>${task.text}</span>
                    <button class="deleteBtn" data-id="${task.id}">Delete</button>
                `;
                taskElement.querySelector('.deleteBtn').addEventListener('click', () => {
                    let tasks = loadTasks();
                    tasks = tasks.filter(t => t.id !== task.id);
                    localStorage.setItem(currentUser, JSON.stringify(tasks));
                    renderTasks();
                });
                tasksContainer.appendChild(taskElement);

                taskElement.addEventListener('dragstart', () => {
                    taskElement.classList.add('dragging');
                });
                taskElement.addEventListener('dragend', () => {
                    taskElement.classList.remove('dragging');
                    saveTasksOrder();
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

    function saveTasksOrder() {
        const tasks = [];
        tasksContainer.querySelectorAll('.task').forEach(taskElement => {
            const text = taskElement.querySelector('span').innerText;
            const taskId = parseInt(taskElement.querySelector('.deleteBtn').dataset.id, 10);
            tasks.push({ id: taskId, text: text, user: currentUser });
        });
        localStorage.setItem(currentUser, JSON.stringify(tasks));
    }

    function saveAccounts() {
        localStorage.setItem('accounts', JSON.stringify(accounts));
    }

    updateAuthUI();
    updateAccountStatus();
    updateAccountList();
    renderTasks();

    addTaskBtn.addEventListener('click', () => {
        const taskText = newTaskInput.value.trim();
        if (taskText) {
            addTask(taskText);
            newTaskInput.value = '';
            renderTasks();
        }
    });
});
