// Get the current page name
const currentPage = window.location.pathname;


// ==========================================
// PASSWORD HASHING
// ==========================================

async function hashPassword(password) {

    const encoder = new TextEncoder();

    const data = encoder.encode(password);

    const hashBuffer = await crypto.subtle.digest(
        "SHA-256",
        data
    );

    const hashArray = Array.from(
        new Uint8Array(hashBuffer)
    );

    const hashHex = hashArray
        .map(byte => byte.toString(16).padStart(2, "0"))
        .join("");

    return hashHex;
}


// ==========================================
// REGISTER
// ==========================================

const registerForm = document.querySelector("#registerForm");


if (registerForm) {

    registerForm.addEventListener("submit", async function (event) {

        event.preventDefault();


        const username = document
            .querySelector("#registerUsername")
            .value
            .trim();


        const password = document
            .querySelector("#registerPassword")
            .value;


        const message = document.querySelector("#registerMessage");


        // Clear previous message
        message.textContent = "";

        message.className = "message";


        // ==================================
        // EMPTY VALIDATION
        // ==================================

        if (username === "" || password === "") {

            message.textContent =
                "Please fill in all fields.";

            message.classList.add("error");

            return;
        }


        // ==================================
        // PASSWORD VALIDATION
        // ==================================

        if (password.length < 8) {

            message.textContent =
                "Password must be at least 8 characters.";

            message.classList.add("error");

            return;
        }


        // Check for at least one number

        const hasNumber = /\d/.test(password);


        if (!hasNumber) {

            message.textContent =
                "Password must contain at least 1 number.";

            message.classList.add("error");

            return;
        }


        // ==================================
        // GET EXISTING USERS
        // ==================================

        let users = JSON.parse(
            localStorage.getItem("users")
        ) || [];


        // ==================================
        // DUPLICATE CHECK
        // ==================================

        const existingUser = users.find(function (user) {

            return user.username.toLowerCase() ===
                username.toLowerCase();

        });


        if (existingUser) {

            message.textContent =
                "Username or email already exists.";

            message.classList.add("error");

            return;
        }


        // ==================================
        // HASH PASSWORD
        // ==================================

        const hashedPassword =
            await hashPassword(password);


        // ==================================
        // CREATE USER
        // ==================================

        const newUser = {

            username: username,

            password: hashedPassword

        };


        // Add new user to users array

        users.push(newUser);


        // Save users

        localStorage.setItem(
            "users",
            JSON.stringify(users)
        );


        // ==================================
        // SUCCESS
        // ==================================

        message.textContent =
            "Registration successful! You can now login.";

        message.classList.add("success");


        // Clear form

        registerForm.reset();

    });
}


// ==========================================
// LOGIN
// ==========================================

const loginForm = document.querySelector("#loginForm");


if (loginForm) {

    loginForm.addEventListener("submit", async function (event) {

        event.preventDefault();


        const username = document
            .querySelector("#loginUsername")
            .value
            .trim();


        const password = document
            .querySelector("#loginPassword")
            .value;


        const message = document.querySelector("#loginMessage");


        message.textContent = "";

        message.className = "message";


        // ==================================
        // EMPTY VALIDATION
        // ==================================

        if (username === "" || password === "") {

            message.textContent =
                "Please enter your username/email and password.";

            message.classList.add("error");

            return;
        }


        // ==================================
        // GET USERS
        // ==================================

        const users = JSON.parse(
            localStorage.getItem("users")
        ) || [];


        // ==================================
        // FIND USER
        // ==================================

        const user = users.find(function (user) {

            return user.username.toLowerCase() ===
                username.toLowerCase();

        });


        // ==================================
        // HASH ENTERED PASSWORD
        // ==================================

        const hashedPassword =
            await hashPassword(password);


        // ==================================
        // CHECK LOGIN
        // ==================================

        if (
            user &&
            user.password === hashedPassword
        ) {

            // Create login session

            localStorage.setItem(
                "currentUser",
                user.username
            );


            // Redirect to dashboard

            window.location.href =
                "dashboard.html";

        } else {

            // IMPORTANT:
            // We don't tell the user which
            // field was incorrect.

            message.textContent =
                "Invalid username/email or password.";

            message.classList.add("error");
        }

    });
}


// ==========================================
// PROTECT DASHBOARD
// ==========================================

if (
    currentPage.includes("dashboard.html")
) {

    const currentUser =
        localStorage.getItem("currentUser");


    // User is NOT logged in

    if (!currentUser) {

        window.location.href =
            "index.html";

    } else {

        const welcomeMessage =
            document.querySelector("#welcomeMessage");


        if (welcomeMessage) {

            welcomeMessage.textContent =
                `Welcome, ${currentUser}!`;

        }

    }
}


// ==========================================
// LOGOUT
// ==========================================

const logoutBtn =
    document.querySelector("#logoutBtn");


if (logoutBtn) {

    logoutBtn.addEventListener("click", function () {

        // Remove login session

        localStorage.removeItem(
            "currentUser"
        );


        // Redirect to login

        window.location.href =
            "index.html";

    });
}