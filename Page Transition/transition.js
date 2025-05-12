document.addEventListener('DOMContentLoaded', () => {
    const ease = "power4.inOut";

    // Add transition event listeners to all links except those starting with # or to current page
    document.querySelectorAll('nav a').forEach((link) => {
        link.addEventListener("click", (event) => {
            event.preventDefault();
            const href = link.getAttribute("href");

            if (href && !href.startsWith("#") && href !== window.location.pathname) {
                // First, close the blocks on the current page
                closeCurrentPageBlocks().then(() => {
                    // Then navigate to the new page
                    window.location.href = href;
                });
            }
        });
    });

    // Initial page load reveal transition
    function initializePageReveal() {
        return new Promise((resolve) => {
            gsap.set(".block", { scaleY: 1 });
            gsap.to(".block", {
                scaleY: 0,
                duration: 1,
                stagger: {
                    each: 0.1,
                    from: "start",
                    grid: [5, 2], // Match the grid layout in your HTML
                },
                ease: ease,
                onComplete: resolve,
            });
        });
    }

    // Function to close blocks on the current page
    function closeCurrentPageBlocks() {
        return new Promise((resolve) => {
            gsap.to(".block", {
                scaleY: 0,
                duration: 1,
                stagger: {
                    each: 0.1,
                    from: "start",
                    grid: [5, 2], // Match the grid layout in your HTML
                },
                ease: ease,
                onComplete: resolve,
            });
        });
    }

    // Function to rise blocks on the new page
    function riseNewPageBlocks() {
        return new Promise((resolve) => {
            gsap.set(".block", { scaleY: 0 });
            gsap.to(".block", {
                scaleY: 1,
                duration: 1,
                stagger: {
                    each: 0.1,
                    from: "start",
                    grid: [5, 2], // Match the grid layout in your HTML
                },
                ease: ease,
                onComplete: resolve,
            });
        });
    }

    // Run initial page reveal
    initializePageReveal().then(() => {
        gsap.set(".block", { visibility: "hidden" });
    });

    // If this is a newly loaded page, run the rise transition
    if (performance.navigation.type === 1) {  // PAGE_RELOAD or navigated to
        riseNewPageBlocks().then(() => {
            gsap.set(".block", { visibility: "hidden" });
        });
    }
});