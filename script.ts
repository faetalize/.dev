import start from './media/start.mp3';
import hover from './media/hover.mp3';
import select from './media/select.mp3';
import back from './media/back.mp3';
import bgm from './media/bgm.mp3';

const landingText: HTMLElement | null = document.querySelector(".landingText");
const pages: NodeListOf<HTMLElement> = document.querySelectorAll(".page");
const navigationMenu: HTMLElement | null =
  document.querySelector(".navigationMenu");
const navigationItems: NodeListOf<HTMLElement> =
  document.querySelectorAll(".navigationItem");
const headerBar: HTMLElement | null = document.querySelector(".headerBar");
const backButton: HTMLElement | null = document.querySelector(
  "#btn-navigation-back"
);
const backgroundImg: HTMLElement | null =
  document.querySelector(".backgroundImg img");
const footerBar: HTMLElement | null = document.querySelector(".footerBar");
const overlay: HTMLElement | null = document.querySelector(".overlay");
const overlayCloseButton: HTMLElement | null =
  document.querySelector("#btn-overlay-close");
const creditsButton: HTMLElement | null = document.querySelector("#credits");
const highlightButtons: NodeListOf<HTMLElement> =
  document.querySelectorAll(".hbutton");

//keep track of the current page
let currentPage: HTMLElement | null = null;

/**
 * Hide an element (with a 0.5s fade out animation)
 * @param {HTMLElement} element The element to hide
 **/
function hide(element: HTMLElement): void {
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
function show(element: HTMLElement, transitioning: boolean): void {
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
  } else {
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
function playAudio(
  path: string,
  initialVolume: number,
  finalVolume: number,
  duration_ms: number,
  loop: boolean
): void {
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
        } else {
          audioElement.volume = finalVolume;
          clearInterval(interval);
        }
      }, intervalDuration);
    } catch (error) {
      console.log(error);
    }
  });
}

//hide the landingtext on click, show the menu, and play the audio
landingText?.addEventListener("click", function () {
  playAudio(start, 0.3, 0.8, 1500, false);
  playAudio(bgm, 0, 0.8, 10000, true);
  hide(landingText as HTMLElement);
  if (backgroundImg) backgroundImg.style.filter = "blur(0px)";
  show(navigationMenu as HTMLElement, true);
  show(footerBar as HTMLElement, true);
});

creditsButton?.addEventListener("click", function () {
  show(overlay as HTMLElement, false);
});

overlayCloseButton?.addEventListener("click", function () {
  hide(overlay as HTMLElement);
});
//navigation
navigationMenu?.addEventListener("click", function (event) {
  if ((event.target as Element).classList.contains("navigationItem")) {
    let index: number = Array.from(navigationItems).indexOf(
      event.target as HTMLElement
    );
    hide(navigationMenu as HTMLElement);
    hide(backgroundImg as HTMLElement);
    show(headerBar as HTMLElement, true);
    show(pages[index] as HTMLElement, true);
    currentPage = pages[index];
  }
});
backButton?.addEventListener("click", function () {
  hide(headerBar as HTMLElement);
  hide(currentPage as HTMLElement);
  show(navigationMenu as HTMLElement, true);
  show(backgroundImg as HTMLElement, true);
  currentPage = null;
});
//sound effects
for (let button of highlightButtons) {
  button.addEventListener("mouseover", () => {
    playAudio(hover, 0.8, 0.8, 10, false);
  });
  button.addEventListener("click", () => {
    if (button.id == "btn-navigation-back") {
      playAudio(back, 0.8, 0.8, 0, false);
    } else {
      playAudio(select, 0.8, 0.8, 0, false);
    }
  });
}