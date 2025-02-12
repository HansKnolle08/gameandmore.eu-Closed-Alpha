// /res/javascript/specific/auth/frontend/frontend-register-form.js

function validateUsername(username) {
    const usernamePattern = /^[A-Z]/;
    if (!usernamePattern.test(username)) {
        alert("Der Benutzername muss mit einem Großbuchstaben beginnen.");
        return false;
    }
    return true;
}

function validatePasswords(password, confirmPassword) {
    if (password !== confirmPassword) {
        alert("Die Passwörter stimmen nicht überein.");
        return false;
    }
    if (password.length < 8) {
        alert("Das Passwort muss mindestens 8 Zeichen lang sein.");
        return false;
    }
    return true;
}

document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
    form.addEventListener("submit", function(event) {
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirm_password").value;

        if (!validateUsername(username) || !validatePasswords(password, confirmPassword)) {
            event.preventDefault();
        }
    });
});
