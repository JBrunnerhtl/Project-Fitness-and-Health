function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);


    const icon = document.getElementById('darkModeIcon');
    const text = document.getElementById('darkModeText');

    if (isDarkMode) {
        icon.src = "../icones/bx--sun.png";
        text.textContent = "Light Mode";
    } else {
        icon.src = "../icones/bx--moon.png";
        text.textContent = "Dark Mode";
    }
}


document.addEventListener('DOMContentLoaded', function() {
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
        document.getElementById('darkModeIcon').src = "../icones/bx--moon";
        document.getElementById('darkModeText').textContent = "Light Mode";
    }


    document.getElementById('darkModeToggle').addEventListener('click', toggleDarkMode);
});