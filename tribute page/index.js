const menuBtn = document.getElementById("menuBtn");
const navMenu = document.getElementById("navMenu");


// Open and close mobile menu
menuBtn.addEventListener("click", () => {

    navMenu.classList.toggle("show");

});


// Close menu when a link is clicked
const navLinks = document.querySelectorAll("nav a");

navLinks.forEach((link) => {

    link.addEventListener("click", () => {

        navMenu.classList.remove("show");

    });

});