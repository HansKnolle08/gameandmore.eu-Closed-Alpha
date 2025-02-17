// /res/javascript/specific/etc/search-field.js

document.addEventListener("DOMContentLoaded", () => {
    const searchField = document.getElementById("searchField");
    const placeholders = [
        "🔍 Suchbegriff eingeben...",
        "🔍 Suche nach 'Artikel 1'...",
        "🔍 Suche nach 'Artikel 2'...",
        "🔍 Suche nach 'Artikel 3'..."
    ];

    let index = 0;
    setInterval(() => {
        searchField.setAttribute("placeholder", placeholders[index]);
        index = (index + 1) % placeholders.length;
    }, 3000);
});
