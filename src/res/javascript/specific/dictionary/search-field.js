document.addEventListener("DOMContentLoaded", () => {
    const searchField = document.getElementById("searchField");
    const placeholders = [
        "🔍 Suchbegriff eingeben...",
        "🔍 Suche nach 'Homebrew'...",
        "🔍 Suche nach 'Modchip'...",
        "🔍 Suche nach 'Brick'..."
    ];

    let index = 0;
    setInterval(() => {
        searchField.setAttribute("placeholder", placeholders[index]);
        index = (index + 1) % placeholders.length;
    }, 3000);
});
