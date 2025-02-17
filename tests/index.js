document.addEventListener("DOMContentLoaded", function () {
    const registerButton = document.querySelector("button[type='submit']");

    registerButton.addEventListener("click", function () {
        const name = document.getElementById("name-input").value.trim();
        const email = document.getElementById("email-input").value.trim();
        const password = document.getElementById("password-input").value;
        const passwordRepeat = document.getElementById("password-input-repeat").value;

        if (!name || !email || !password || !passwordRepeat) {
            console.log("Fehler: Alle Felder müssen ausgefüllt sein.");
            return;
        }

        if (password !== passwordRepeat) {
            console.log("Fehler: Passwörter stimmen nicht überein.");
            return;
        }

        let users = JSON.parse(localStorage.getItem("users")) || { Users: {} };

        let userCount = Object.keys(users.Users).length;
        let newUserKey = "User" + (userCount + 1);

        users.Users[newUserKey] = {
            name: name,
            email: email,
            password: password,
            is_admin: null
        };

        localStorage.setItem("users", JSON.stringify(users));
        console.log("Erfolgreich registriert:", users.Users[newUserKey]);
    });
});
