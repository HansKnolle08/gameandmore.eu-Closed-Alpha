// /res/javascript/global/index.js

document.addEventListener("DOMContentLoaded", function() {
    const navLinks = document.querySelectorAll("nav ul li a");
    const sections = document.querySelectorAll("section");

    function highlightSection() {
        let scrollPosition = window.scrollY;
        sections.forEach(section => {
            const top = section.offsetTop - 100;
            const height = section.offsetHeight;
            if (scrollPosition >= top && scrollPosition < top + height) {
                navLinks.forEach(link => link.classList.remove("active"));
                document.querySelector(`nav ul li a[href="#${section.id}"]`)?.classList.add("active");
                sections.forEach(sec => sec.classList.remove("active"));
                section.classList.add("active");
            }
        });
    }
    window.addEventListener("scroll", highlightSection);
});