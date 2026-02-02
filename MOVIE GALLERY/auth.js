document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");
    const loginLink = document.getElementById("loginLink");
    const logoutLink = document.getElementById("logoutLink");

    // Check for existing session and update UI
    const session = JSON.parse(localStorage.getItem('session'));
    if (session && session.loggedIn) {
        if (loginLink) {
            loginLink.style.display = "none"; // Hide login link
        }
        if (logoutLink) {
            logoutLink.style.display = "flex"; // Show the logout link
        }
        const headerNav = document.querySelector('.header-nav');
        if (headerNav) {
            const welcomeEl = document.createElement('span');
            welcomeEl.className = 'nav-link welcome-message';
            welcomeEl.textContent = `Welcome, ${session.username}`;
            headerNav.prepend(welcomeEl);
        }
    } else {
        // If not logged in, ensure logout link is hidden
        if (logoutLink) {
            logoutLink.style.display = "none";
        }
    }

    // --- Registration ---
    if (registerForm) {
        registerForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const username = document.getElementById("registerUsername").value;
            const password = document.getElementById("registerPassword").value;
            const confirmPassword = document.getElementById("registerConfirmPassword").value;

            if (password !== confirmPassword) {
                alert("Passwords do not match.");
                return;
            }

            let users = JSON.parse(localStorage.getItem('users')) || [];
            if (users.find(user => user.username === username)) {
                alert("Username already exists.");
                return;
            }

            users.push({ username, password, watchHistory: [] });
            localStorage.setItem('users', JSON.stringify(users));
            alert("Registration successful! Please login.");
            toggleForms();
        });
    }

    // --- Login ---
    if (loginForm) {
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const username = document.getElementById("loginUsername").value;
            const password = document.getElementById("loginPassword").value;

            let users = JSON.parse(localStorage.getItem('users')) || [];
            const user = users.find(u => u.username === username && u.password === password);

            if (user) {
                localStorage.setItem('session', JSON.stringify({ loggedIn: true, username: user.username }));
                window.location.href = "Main.html";
            } else {
                alert("Invalid username or password.");
            }
        });
    }

    // --- Logout functionality ---
    if (logoutLink) {
        logoutLink.addEventListener("click", (e) => {
            e.preventDefault();
            localStorage.removeItem('session');
            window.location.reload();
        });
    }
});

function toggleForms() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    if (loginForm.style.display === 'none') {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
    } else {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
    }
}