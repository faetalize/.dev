"use strict";
const landingText = document.querySelector('.landingText');
const pages = document.querySelectorAll('.page');
const navigationMenu = document.querySelector('.navigationMenu');
const navigationItems = document.querySelectorAll('.navigationItem');
const headerBar = document.querySelector('.headerBar');
const backButton = document.querySelector('#btn-navigation-back');
const backgroundImg = document.querySelector('.backgroundImg img');
const footerBar = document.querySelector('.footerBar');
const overlay = document.querySelector('.overlay');
const overlayCloseButton = document.querySelector('#btn-overlay-close');
const creditsButton = document.querySelector('#credits');
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
 * @param {boolean} transitioning Whether or not the element is transitioning from another page
 **/
function show(element, transitioning) {
    if (transitioning) {
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
    else {
        element.style.display = 'flex';
        requestAnimationFrame(function () {
            // Start opacity transition
            element.style.transition = 'opacity 0.5s';
            element.style.opacity = '1';
        });
    }
}
/**
 * Plays audio file with a gradual increase in volume
 * @param {string} path The path to the audio file
 * @param {number} initialVolume Initial volume
 * @param {number} finalVolume Final volume
 * @param {number} duration_ms Duration of the volume increase
 * @param {boolean} loop Whether or not to loop the audio
 */
function playAudio(path, initialVolume, finalVolume, duration_ms, loop) {
    let audioElement = new Audio(path);
    audioElement.volume = initialVolume;
    audioElement.loop = loop;
    try {
        audioElement.play();
        let volumeStep = (finalVolume - initialVolume) / duration_ms;
        let interval = setInterval(() => {
            audioElement.volume += volumeStep;
            if (audioElement.volume >= finalVolume) {
                clearInterval(interval);
            }
        }, 1);
    }
    catch (error) {
        console.log(error);
    }
}
//hide all elements aside from the landing text
for (let page of pages)
    hide(page);
hide(navigationMenu);
hide(headerBar);
hide(footerBar);
hide(overlay);
//hide the landingtext on click and show the menu
landingText === null || landingText === void 0 ? void 0 : landingText.addEventListener('click', function () {
    playAudio('./media/mist.mp3', 0, 0.65, 3000, true);
    hide(landingText);
    if (backgroundImg)
        backgroundImg.style.filter = 'blur(0px)';
    show(navigationMenu, true);
    show(footerBar, true);
});
creditsButton === null || creditsButton === void 0 ? void 0 : creditsButton.addEventListener('click', function () {
    show(overlay, false);
});
overlayCloseButton === null || overlayCloseButton === void 0 ? void 0 : overlayCloseButton.addEventListener('click', function () {
    hide(overlay);
});
//navigation
navigationMenu === null || navigationMenu === void 0 ? void 0 : navigationMenu.addEventListener('click', function (event) {
    if (event.target.classList.contains('navigationItem')) {
        let index = Array.from(navigationItems).indexOf(event.target);
        hide(navigationMenu);
        show(headerBar, true);
        show(pages[index], true);
        currentPage = pages[index];
    }
});
backButton === null || backButton === void 0 ? void 0 : backButton.addEventListener('click', function () {
    hide(headerBar);
    show(navigationMenu, true);
    hide(currentPage);
    currentPage = null;
});
//# sourceMappingURL=script.js.map