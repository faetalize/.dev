"use strict";
const landingText = document.querySelector(".landingText");
const pages = document.querySelectorAll(".page");
const navigationMenu = document.querySelector(".navigationMenu");
const navigationItems = document.querySelectorAll(".navigationItem");
const headerBar = document.querySelector(".headerBar");
const backButton = document.querySelector("#btn-navigation-back");
const backgroundImg = document.querySelector(".backgroundImg img");
const footerBar = document.querySelector(".footerBar");
const overlay = document.querySelector(".overlay");
const overlayCloseButton = document.querySelector("#btn-overlay-close");
const creditsButton = document.querySelector("#credits");
const highlightButtons = document.querySelectorAll(".hbutton");
//keep track of the current page
let currentPage = null;
/**
 * Hide an element (with a 0.5s fade out animation)
 * @param {HTMLElement} element The element to hide
 **/
function hide(element) {
    element.style.transition = "opacity 0.5s";
    element.style.opacity = "0";
    setTimeout(function () {
        element.style.display = "none";
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
            element.style.display = "flex";
            // hackery to ensure the transition works on mobile, idk why this works but who fucking cares
            requestAnimationFrame(function () {
                requestAnimationFrame(function () {
                    element.style.transition = "opacity 0.5s";
                    element.style.opacity = "1";
                });
            });
        }, 500);
    }
    else {
        element.style.display = "flex";
        requestAnimationFrame(function () {
            requestAnimationFrame(function () {
                element.style.transition = "opacity 0.5s";
                element.style.opacity = "1";
            });
        });
    }
}
/**
 * Plays audio file with a gradual increase in volume (after enough has loaded)
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
    if (initialVolume == finalVolume) {
        audioElement.play();
        console.log("no transition, playing audio");
        return;
    }
    //start when enough of the audio has loaded
    audioElement.addEventListener("canplay", function () {
        try {
            audioElement.play();
            let intervalDuration = 100;
            let steps = duration_ms / intervalDuration;
            let volumeStep = (finalVolume - initialVolume) / steps;
            let interval = setInterval(() => {
                if (audioElement.volume + volumeStep < finalVolume) {
                    audioElement.volume += volumeStep;
                }
                else {
                    audioElement.volume = finalVolume;
                    clearInterval(interval);
                }
            }, intervalDuration);
        }
        catch (error) {
            console.log(error);
        }
    });
}
//hide the landingtext on click, show the menu, and play the audio
landingText === null || landingText === void 0 ? void 0 : landingText.addEventListener("click", function () {
    playAudio("./media/start.mp3", 0.3, 0.8, 1500, false);
    playAudio("./media/mist.mp3", 0, 0.8, 10000, true);
    hide(landingText);
    if (backgroundImg)
        backgroundImg.style.filter = "blur(0px)";
    show(navigationMenu, true);
    show(footerBar, true);
});
creditsButton === null || creditsButton === void 0 ? void 0 : creditsButton.addEventListener("click", function () {
    show(overlay, false);
});
overlayCloseButton === null || overlayCloseButton === void 0 ? void 0 : overlayCloseButton.addEventListener("click", function () {
    hide(overlay);
});
//navigation
navigationMenu === null || navigationMenu === void 0 ? void 0 : navigationMenu.addEventListener("click", function (event) {
    if (event.target.classList.contains("navigationItem")) {
        let index = Array.from(navigationItems).indexOf(event.target);
        hide(navigationMenu);
        show(headerBar, true);
        show(pages[index], true);
        currentPage = pages[index];
    }
});
//sound effects
for (let button of highlightButtons) {
    button.addEventListener("mouseover", () => {
        playAudio("./media/hover.mp3", 0.8, 0.8, 10, false);
    });
    button.addEventListener("click", () => {
        if (button.id == "btn-navigation-back") {
            playAudio("./media/back.mp3", 0.8, 0.8, 0, false);
        }
        else {
            playAudio("./media/select.mp3", 0.8, 0.8, 0, false);
        }
    });
}
backButton === null || backButton === void 0 ? void 0 : backButton.addEventListener("click", function () {
    hide(headerBar);
    hide(currentPage);
    show(navigationMenu, true);
    currentPage = null;
});
//# sourceMappingURL=script.js.map