import start from "./media/start.mp3";
import hover from "./media/hover.mp3";
import select from "./media/select.mp3";
import back from "./media/back.mp3";
import bgm from "./media/bgm.mp3";

const landingScreen = document.querySelector<HTMLDivElement>("#landing-screen");
const landingText =
  document.querySelector<HTMLParagraphElement>("#landing-text");
const pages = document.querySelectorAll<HTMLDivElement>(".page");
const navigation = document.querySelector<HTMLDivElement>("#navigation");
const navigationItems = document.querySelectorAll<HTMLDivElement>(".nav-item");
const header = document.querySelector<HTMLDivElement>(".header");
const backButton = document.querySelector<HTMLButtonElement>(
  "#btn-navigation-back"
);
const backgroundImg = document.querySelector<HTMLImageElement>("#bg img");
const footer = document.querySelector<HTMLDivElement>(".footer");
const overlay = document.querySelector<HTMLDivElement>(".overlay");
const overlayCloseButton =
  document.querySelector<HTMLButtonElement>("#btn-overlay-close");
const creditsButton = document.querySelector<HTMLButtonElement>("#credits");
const hButtons = document.querySelectorAll<HTMLButtonElement>(".hbutton");

//keep track of the current page
let currentPage: HTMLElement | null = null;

//audiocontext for sfx
const audioContext = new AudioContext();
const audioBuffers = await loadSFXBuffers();

enum SoundEffect{
  START, HOVER, SELECT, BACK
}
/**
 * Hide an element (with a 0.5s fade out animation)
 * @param {HTMLElement} element The element to hide
 **/
function hide(element: HTMLElement | null): void {
  if (!element) {
    console.error("Element to hide not found.");
    return;
  }
  element.style.transition = "opacity 0.5s";
  element.style.opacity = "0";
  setTimeout(() => {
    element.style.display = "none";
  }, 500);
}

/**
 * Show an element (with a 0.5s fade in animation)
 * @param {HTMLElement} element The element to show
 * @param {boolean} transitioning Whether or not the element is transitioning from another page
 **/
function show(element: HTMLElement | null, transitioning: boolean): void {
  if (!element) {
    console.error("Element to show not found.");
    return;
  }
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
  const audioElement = new Audio(path);
  audioElement.volume = initialVolume;
  audioElement.loop = loop;
  if (initialVolume == finalVolume) {
    audioElement.play();
    console.log("no transition, playing audio");
    return;
  }
  //start when enough of the audio has loaded
  audioElement.addEventListener("canplay", () => {
    audioElement.play();
    const intervalDuration = 100;
    const steps = duration_ms / intervalDuration;
    const volumeStep = (finalVolume - initialVolume) / steps;
    const interval = setInterval(() => {
      if (audioElement.volume + volumeStep < finalVolume) {
        audioElement.volume += volumeStep;
      } else {
        audioElement.volume = finalVolume;
        clearInterval(interval);
      }
    }, intervalDuration);
  });
}


/**
 * Asynchronously loads an audio buffer from a given file path.
 *
 * @param {string} path - The path to the audio file to be loaded.
 * @returns {Promise<AudioBuffer>} A promise that resolves to the loaded AudioBuffer.
 * @throws {Error} If the fetch request or audio decoding fails.
 */
async function loadAudioBuffer(path: string): Promise<AudioBuffer> {
  const response = await fetch(path);
  const arrayBuffer = await response.arrayBuffer();
  return await audioContext.decodeAudioData(arrayBuffer);
}

/**
 * Asynchronously loads sound effect (SFX) buffers and returns them as an array of `AudioBuffer` objects.
 * 
 * This function loads audio buffers for different sound effects such as start, hover, select, and back.
 * 
 * @returns {Promise<AudioBuffer[]>} A promise that resolves to an array of `AudioBuffer` objects.
 */
async function loadSFXBuffers(){
  const sfxBuffers : AudioBuffer[] = []
  sfxBuffers[SoundEffect.START] = await loadAudioBuffer(start);
  sfxBuffers[SoundEffect.HOVER] = await loadAudioBuffer(hover);
  sfxBuffers[SoundEffect.SELECT] = await loadAudioBuffer(select);
  sfxBuffers[SoundEffect.BACK] = await loadAudioBuffer(back);
  return sfxBuffers
}

/**
 * Plays a sound effect using the Web Audio API.
 *
 * @param sfx - The sound effect to play. This should be an enum value of type `SoundEffect`. Maps to an audio buffer in the `audioBuffers` object.
 */
function playSFX(sfx: SoundEffect){
  const source = audioContext.createBufferSource();
  source.buffer = audioBuffers[sfx];
  source.connect(audioContext.destination);
  source.start(0);
}

//hide the landingtext on click, show the menu, and play the audio
landingText?.addEventListener("click", () => {
  playSFX(SoundEffect.START);
  playAudio(bgm, 0, 0.8, 10000, true);
  hide(landingScreen);
  if (backgroundImg) backgroundImg.style.filter = "blur(0px)";
  show(navigation, true);
  show(footer, true);
});

creditsButton?.addEventListener("click", () => {
  show(overlay, false);
});

overlayCloseButton?.addEventListener("click", () => {
  hide(overlay);
});

//navigation
navigation?.addEventListener("click", (event) => {
  const navItem = event.target as HTMLDivElement;
  if (![...navigationItems].includes(navItem)) return;
  const index: number = [...navigationItems].indexOf(navItem);
  hide(navigation);
  hide(backgroundImg);
  show(header, true);
  show(pages[index], true);
  currentPage = pages[index];
});

backButton?.addEventListener("click", function () {
  hide(header);
  hide(currentPage);
  show(navigation, true);
  show(backgroundImg, true);
  currentPage = null;
});

//sound effects
for (const button of hButtons) {
  if (!/Mobi|Android/i.test(navigator.userAgent)) {
    button.addEventListener("mouseover", () => {
      playSFX(SoundEffect.HOVER);
    });
  }
  button.addEventListener("click", () => {
    if (button.id == "btn-navigation-back") {
      playSFX(SoundEffect.BACK);
      return;
    } 
    playSFX(SoundEffect.SELECT);
  });
}