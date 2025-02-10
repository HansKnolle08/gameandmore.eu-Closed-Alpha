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

function searchTerm() {
    const searchValue = document.getElementById('searchField').value.toLowerCase();
    const sections = document.querySelectorAll('section');

    for (let section of sections) {
        const sectionTitleElement = section.querySelector('h3');
        
        if (sectionTitleElement) {
            const sectionTitle = sectionTitleElement.innerText.toLowerCase();

            if (sectionTitle.includes(searchValue)) {
                section.scrollIntoView({ behavior: 'smooth' });
                
                sectionTitleElement.classList.add('highlight');

                setTimeout(() => {
                    sectionTitleElement.classList.remove('highlight');
                }, 1000);
                break;
            }
        }
    }
}