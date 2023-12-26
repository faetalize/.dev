const landingText : HTMLElement | null = document.querySelector('.landingText');
const pages : NodeListOf<HTMLElement> = document.querySelectorAll('.page');
const navigationMenu : HTMLElement | null = document.querySelector('.navigationMenu');
const navigationItems : NodeListOf<HTMLElement> = document.querySelectorAll('.navigationItem');
const headerBar : HTMLElement | null = document.querySelector('.headerBar');
const backButton : HTMLElement | null = document.querySelector('.backButton');
const backgroundImg : HTMLElement | null = document.querySelector('.backgroundImg img');
const footerBar : HTMLElement | null = document.querySelector('.footerBar');

//keep track of the current page
let currentPage : HTMLElement | null = null;

/**
* Hide an element (with a 0.5s fade out animation)
* @param {HTMLElement} element The element to hide
**/
function hide(element : HTMLElement) : void  {
    element.style.transition = 'opacity 0.5s';
    element.style.opacity = '0';
    setTimeout(function() {
        element.style.display = 'none';
    }, 500);
}

/**
 * Show an element (with a 0.5s fade in animation)
 * @param {HTMLElement} element The element to show
 **/
function show(element : HTMLElement) : void {
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

//hide all elements aside from the landing text
for(let page of pages) 
    hide(page as HTMLElement);
hide(navigationMenu as HTMLElement);
hide(headerBar as HTMLElement);
hide(footerBar as HTMLElement);


//hide the landingtext on click and show the menu
landingText?.addEventListener('click', function() {
    hide(landingText as HTMLElement);
    if(backgroundImg) 
        backgroundImg.style.filter = 'blur(0px)';
    show(navigationMenu as HTMLElement);
    show(footerBar as HTMLElement);
});

//navigation
navigationMenu?.addEventListener('click', function(event) {
    if ((event.target as Element).classList.contains('navigationItem')) {
        let index: number = Array.from(navigationItems).indexOf(event.target as HTMLElement);
        hide(navigationMenu as HTMLElement);
        show(headerBar as HTMLElement);
        show(pages[index] as HTMLElement);
        currentPage = pages[index];
    }
});

backButton?.addEventListener('click', function() {
    hide(headerBar as HTMLElement);
    show(navigationMenu as HTMLElement);
    hide(currentPage as HTMLElement);
    currentPage = null;
});