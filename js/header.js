const hamMenu = document.querySelector('.ham-menu');
const navMenu = document.querySelector('nav');

if (hamMenu && navMenu) {
    hamMenu.addEventListener('click', () => {
        hamMenu.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
}