//Reference to the menu button.
const menuButton = document.querySelector(".menu-btn");

//Reference to the side navigation.
const nav = document.querySelector(".nav");

//Add event listener to the menu button.
menuButton.addEventListener("click", function () {
	//Toggle the menu visibility.
	nav.classList.toggle("nav-visible");
});
