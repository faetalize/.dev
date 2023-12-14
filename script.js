let landingText = document.querySelector('.landingText');
let pages = document.querySelectorAll('.page');
let navigationMenu = document.querySelector('.navigationMenu');
let navigationItems = document.querySelectorAll('.navigationItem');
let headerBar = document.querySelector('.headerBar');
let backButton = document.querySelector('.backButton');
let backgroundImg = document.querySelector('.backgroundImg img');
let footerBar = document.querySelector('.footerBar');

//function to hide element smoothly then setting display none after the transition time elapsed
function hideElement(element) {
    element.style.transition = 'opacity 0.5s';
    element.style.opacity = '0';
    setTimeout(function() {
        element.style.display = 'none';
    }, 500);
}

function showElement(element) {
    // Wait for other transitions to complete (0.5s delay)
    setTimeout(function() {
        // Change display property
        element.style.display = 'flex';
        // Wait for next frame for display change to take effect
        requestAnimationFrame(function() {
            // Start opacity transition
            element.style.transition = 'opacity 0.5s';
            element.style.opacity = '1';
        });
    }, 500);
}

//hide all elements aside from the landing text (not just pages)
for (let i = 0; i < pages.length; i++) {
    hideElement(pages[i]);
}
hideElement(navigationMenu);
hideElement(headerBar);
hideElement(footerBar);


//hide the landingtext on click and show the menu
landingText.addEventListener('click', function() {
    hideElement(landingText);
    backgroundImg.style.filter = 'blur(0px)';
    showElement(navigationMenu);
    showElement(footerBar);
});

let currentPage;
//add a click event listener to each navigationItem matching the index of the page
for (let i = 0; i < navigationItem.length; i++) {
    navigationItem[i].addEventListener('click', function() {
        //hide the navigationMenu
        hideElement(navigationMenu);
        //show header and footer
        showElement(headerBar);
        //show the page
        showElement(pages[i]);
        //track the current page
        currentPage = pages[i];
    });
}
//add a click event listener to the back button
backButton.addEventListener('click', function() {
    //hide header and footer
    hideElement(headerBar);
    //show the menu
    showElement(navigationMenu);
    //hide the current page
    hideElement(currentPage);
});