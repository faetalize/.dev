"use strict";
const landingText = document.querySelector('.landingText');
const pages = document.querySelectorAll('.page');
const navigationMenu = document.querySelector('.navigationMenu');
const navigationItems = document.querySelectorAll('.navigationItem');
const headerBar = document.querySelector('.headerBar');
const backButton = document.querySelector('.backButton');
const backgroundImg = document.querySelector('.backgroundImg img');
const footerBar = document.querySelector('.footerBar');
//keep track of the current page
let currentPage = null;
/**
* Hide an element (with a 0.5s fade out animation)
* @param {HTMLElement} element The element to hide
**/
function hide(element) {
    element.style.transition = 'opacity 0.5s';
    element.style.opacity = '0';
    setTimeout(function () {
        element.style.display = 'none';
    }, 500);
}
/**
 * Show an element (with a 0.5s fade in animation)
 * @param {HTMLElement} element The element to show
 **/
function show(element) {
    // Wait for other transitions to complete (0.5s delay)
    setTimeout(function () {
        // Change display property
        element.style.display = 'flex';
        // Wait for next frame for display change to take effect
        requestAnimationFrame(function () {
            // Start opacity transition
            element.style.transition = 'opacity 0.5s';
            element.style.opacity = '1';
        });
    }, 500);
}
//hide all elements aside from the landing text
for (let page of pages)
    hide(page);
hide(navigationMenu);
hide(headerBar);
hide(footerBar);
//hide the landingtext on click and show the menu
landingText === null || landingText === void 0 ? void 0 : landingText.addEventListener('click', function () {
    hide(landingText);
    if (backgroundImg)
        backgroundImg.style.filter = 'blur(0px)';
    show(navigationMenu);
    show(footerBar);
});
//navigation
navigationMenu === null || navigationMenu === void 0 ? void 0 : navigationMenu.addEventListener('click', function (event) {
    if (event.target.classList.contains('navigationItem')) {
        let index = Array.from(navigationItems).indexOf(event.target);
        hide(navigationMenu);
        show(headerBar);
        show(pages[index]);
        currentPage = pages[index];
    }
});
backButton === null || backButton === void 0 ? void 0 : backButton.addEventListener('click', function () {
    hide(headerBar);
    show(navigationMenu);
    hide(currentPage);
    currentPage = null;
});
//# sourceMappingURL=script.js.map