// /res/javascript/specific/dictionary/dictionary.js

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
                }, 5000);
                break;
            }
        }
    }
}