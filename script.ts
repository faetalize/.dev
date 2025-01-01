import start from "/media/start.mp3";
import hover from "/media/hover.mp3";
import select from "/media/select.mp3";
import back from "/media/back.mp3";
import bgm from "/media/bgm.mp3";

window.addEventListener("load", () => {
  updateProgress();
});

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
const backgroundVideo = document.querySelector<HTMLVideoElement>("#bg img");
const footer = document.querySelector<HTMLDivElement>(".footer");
const overlay = document.querySelector<HTMLDivElement>(".overlay");
const overlayCloseButton =
  document.querySelector<HTMLButtonElement>("#btn-overlay-close");
const creditsButton = document.querySelector<HTMLButtonElement>("#credits");
const hButtons = document.querySelectorAll<HTMLButtonElement>(".hbutton");
const progressBar = document.querySelector<HTMLDivElement>("#loading-progress");
const loadingScreen = document.querySelector<HTMLDivElement>("#loading-screen");

enum SoundEffect {
  START,
  HOVER,
  SELECT,
  BACK,
}

/**
 * Updates the progress bar and handles the completion state.
 *
 * @param {number} progress - The current progress value.
 *
 * Increments the progress value, updates the width of the progress bar,
 * and logs a message when loading is finished. If the progress reaches
 * or exceeds 100%, it hides the loading screen after a delay.
 */
function updateProgress(){
  const total = 6
  progress = progress + 1;
  if(progressBar) progressBar.style.transform = `scaleX(${progress/total})`;
  if (progress >= total) {
    console.log("Finished loading");
    setTimeout(() => {
      hide(loadingScreen);
    }, 1000);
  }
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
  //disable pointer events
  element.style.pointerEvents = "none";
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
  element.style.pointerEvents = "auto";
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
 * Plays background music with a volume transition effect.
 *
 * @param initialVolume - The initial volume level of the audio (between 0.0 and 1.0).
 * @param finalVolume - The final volume level of the audio (between 0.0 and 1.0).
 * @param duration_ms - The duration of the volume transition in milliseconds.
 * @param loop - A boolean indicating whether the audio should loop.
 * @param audioElement - The HTMLAudioElement that will play the audio.
 *
 * @remarks
 * If the initial volume is equal to the final volume, the audio will start playing immediately without any transition.
 * The volume transition is achieved by gradually adjusting the volume in small steps over the specified duration.
 */
function playBGM(
  initialVolume: number,
  finalVolume: number,
  duration_ms: number,
  loop: boolean,
  audioElement: HTMLAudioElement
): void {
  audioElement.volume = initialVolume;
  audioElement.loop = loop;
  if (initialVolume == finalVolume) {
    audioElement.play();
    console.log("no transition, playing audio");
    return;
  }
  //start when enough of the audio has loaded
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
}

/**
 * Loads an audio buffer from a given file path and decodes it using the provided AudioContext.
 *
 * @param {string} path - The path to the audio file to be loaded.
 * @param {AudioContext} context - The AudioContext used to decode the audio data.
 * @returns {Promise<AudioBuffer>} A promise that resolves to the decoded AudioBuffer.
 */
async function loadAudioBuffer(path: string, context: AudioContext): Promise<AudioBuffer> {
  const response = await fetch(path);
  const arrayBuffer = await response.arrayBuffer();
  updateProgress();
  return await context.decodeAudioData(arrayBuffer);
}

/**
 * Asynchronously loads sound effect (SFX) buffers and returns them as an array of `AudioBuffer` objects.
 *
 * This function loads audio buffers for different sound effects such as start, hover, select, and back.
 *
 * @returns {Promise<AudioBuffer[]>} A promise that resolves to an array of `AudioBuffer` objects.
 */
async function loadSFXBuffers(): Promise<AudioBuffer[]> {
  const sfxBuffers: AudioBuffer[] = [];
  sfxBuffers[SoundEffect.START] = await loadAudioBuffer(start,audioContext);
  sfxBuffers[SoundEffect.HOVER] = await loadAudioBuffer(hover, audioContext);
  sfxBuffers[SoundEffect.SELECT] = await loadAudioBuffer(select, audioContext);
  sfxBuffers[SoundEffect.BACK] = await loadAudioBuffer(back, audioContext);
  return sfxBuffers;
}

/**
 * Plays a sound effect using the Web Audio API.
 *
 * @param sfx - The sound effect to play. This should be an enum value of type `SoundEffect`. Maps to an audio buffer in the `audioBuffers` object.
 */
function playSFX(sfx: SoundEffect, context: AudioContext) {
  const source = context.createBufferSource();
  source.buffer = sfxBuffers[sfx];
  source.connect(context.destination);
  source.loop;
  source.start(0);
}



let progress = 0;
//keep track of the current page
let currentPage: HTMLElement | null = null;

//audiocontext for our sfx
const audioContext = new AudioContext({sampleRate: 44100});
const sfxBuffers = await loadSFXBuffers();

//audio element for bgm
const audioElement = new Audio(bgm);
audioElement.addEventListener("canplay", () => {
  updateProgress();
});

//hide the landingtext on click, show the menu, and play the audio
landingText?.addEventListener("click", () => {
  playSFX(SoundEffect.START, audioContext);
  playBGM(0, 0.8, 10000, true, audioElement);
  hide(landingScreen);
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
  hide(backgroundVideo);
  show(header, true);
  show(pages[index], true);
  currentPage = pages[index];
});

backButton?.addEventListener("click", function () {
  hide(header);
  hide(currentPage);
  show(navigation, true);
  show(backgroundVideo, true);
  currentPage = null;
});

//sound effects
for (const button of hButtons) {
  if (!/Mobi|Android/i.test(navigator.userAgent)) {
    button.addEventListener("mouseover", () => {
      playSFX(SoundEffect.HOVER, audioContext);
    });
  }
  button.addEventListener("click", () => {
    playSFX(button.id.includes("back") || button.id.includes("close") ? SoundEffect.BACK : SoundEffect.SELECT, audioContext);
  });
}