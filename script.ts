const landingText: HTMLElement | null = document.querySelector('.landingText');
const pages: NodeListOf<HTMLElement> = document.querySelectorAll('.page');
const navigationMenu: HTMLElement | null = document.querySelector('.navigationMenu');
const navigationItems: NodeListOf<HTMLElement> = document.querySelectorAll('.navigationItem');
const headerBar: HTMLElement | null = document.querySelector('.headerBar');
const backButton: HTMLElement | null = document.querySelector('#btn-navigation-back');
const backgroundImg: HTMLElement | null = document.querySelector('.backgroundImg img');
const footerBar: HTMLElement | null = document.querySelector('.footerBar');
const overlay: HTMLElement | null = document.querySelector('.overlay');
const overlayCloseButton: HTMLElement | null = document.querySelector('#btn-overlay-close');
const creditsButton: HTMLElement | null = document.querySelector('#credits');

//keep track of the current page
let currentPage: HTMLElement | null = null;

/**
* Hide an element (with a 0.5s fade out animation)
* @param {HTMLElement} element The element to hide
**/
function hide(element: HTMLElement): void {
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
function show(element: HTMLElement, transitioning: boolean): void {
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
function playAudio(path: string, initialVolume: number, finalVolume: number, duration_ms: number, loop: boolean): void {
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
    hide(page as HTMLElement);
hide(navigationMenu as HTMLElement);
hide(headerBar as HTMLElement);
hide(footerBar as HTMLElement);
hide(overlay as HTMLElement);


//hide the landingtext on click and show the menu
landingText?.addEventListener('click', function () {
    playAudio('./media/mist.mp3', 0, 0.65, 3000, true);
    hide(landingText as HTMLElement);
    if (backgroundImg)
        backgroundImg.style.filter = 'blur(0px)';
    show(navigationMenu as HTMLElement, true);
    show(footerBar as HTMLElement, true);
});

creditsButton?.addEventListener('click', function () {
    show(overlay as HTMLElement, false);
});
overlayCloseButton?.addEventListener('click', function () {
    hide(overlay as HTMLElement);
});
//navigation
navigationMenu?.addEventListener('click', function (event) {
    if ((event.target as Element).classList.contains('navigationItem')) {
        let index: number = Array.from(navigationItems).indexOf(event.target as HTMLElement);
        hide(navigationMenu as HTMLElement);
        show(headerBar as HTMLElement, true);
        show(pages[index] as HTMLElement, true);
        currentPage = pages[index];
    }
});

backButton?.addEventListener('click', function () {
    hide(headerBar as HTMLElement);
    show(navigationMenu as HTMLElement, true);
    hide(currentPage as HTMLElement);
    currentPage = null;
});


