// src/res/javascript/specific/auth/frontend/frontend-register-form.js

// Funktion zur Überprüfung des Benutzernamens (er muss mit einem Großbuchstaben beginnen)
function validateUsername(username) {
    const usernamePattern = /^[A-Z]/; // Überprüft, ob der Benutzername mit einem Großbuchstaben beginnt
    if (!usernamePattern.test(username)) {
        alert("Der Benutzername muss mit einem Großbuchstaben beginnen.");
        return false;
    }
    return true;
}

// Funktion zur Überprüfung der Passwörter (müssen identisch und mindestens 8 Zeichen lang sein)
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

// Event-Listener für das Formular
document.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("form");
    form.addEventListener("submit", function(event) {
        // Werte aus den Eingabefeldern holen
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirm_password").value;

        // Überprüfungen durchführen
        if (!validateUsername(username) || !validatePasswords(password, confirmPassword)) {
            // Verhindert das Absenden des Formulars, falls eine Validierung fehlschlägt
            event.preventDefault();
        }
    });
});
