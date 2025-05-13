document.addEventListener('DOMContentLoaded', () => {
    const ease = "power4.inOut";
    const transitionDuration = 1;

    // IMPORTANT: Local storage to detect page transitions
    const isNewPageLoad = sessionStorage.getItem('pageIsLoading');
    
    // Add transition event listeners to all navigation links
    document.querySelectorAll('nav a').forEach((link) => {
        link.addEventListener("click", (event) => {
            const href = link.getAttribute("href");
            
            // Skip if link is to current page or anchor
            if (!href || href.startsWith("#") || href === window.location.pathname.split('/').pop()) {
                return;
            }
            
            event.preventDefault();
            
            // Set flag in sessionStorage that we're transitioning pages
            sessionStorage.setItem('pageIsLoading', 'true');
            sessionStorage.setItem('destinationPage', href);
            
            // Run the exit animation
            exitAnimation().then(() => {
                window.location.href = href;
            });
        });
    });
    
    // Choose which animation to run on page load
    if (isNewPageLoad) {
        // Clear the loading flag
        sessionStorage.removeItem('pageIsLoading');
        
        // We're arriving at a new page - run the entry animation
        entryAnimation();
    } else {
        // This is the initial site load - run the reveal animation
        initialReveal();
    }
    
    // Exit animation - blocks rise up to cover the screen
    function exitAnimation() {
        return new Promise((resolve) => {
            // Make blocks visible and start from hidden (scaled to 0)
            gsap.set(".transition", { visibility: "visible" });
            gsap.set(".transition-row.row-1 .block", { scaleY: 0, transformOrigin: "top" });
            gsap.set(".transition-row.row-2 .block", { scaleY: 0, transformOrigin: "bottom" });
            
            // Animate blocks to cover screen
            const tl = gsap.timeline({
                onComplete: resolve
            });
            
            tl.to(".transition-row.row-1 .block", {
                scaleY: 1,
                duration: transitionDuration,
                stagger: { each: 0.1, from: "start" },
                ease: ease
            }, 0);
            
            tl.to(".transition-row.row-2 .block", {
                scaleY: 1,
                duration: transitionDuration,
                stagger: { each: 0.1, from: "start" },
                ease: ease
            }, 0);
        });
    }
    
    // Entry animation - blocks covering the screen drop away
    function entryAnimation() {
        // Make sure blocks are visible and scaled to 1 (covering screen)
        gsap.set(".transition", { visibility: "visible" });
        gsap.set(".transition-row.row-1 .block", { scaleY: 1, transformOrigin: "top" });
        gsap.set(".transition-row.row-2 .block", { scaleY: 1, transformOrigin: "bottom" });
        
        // Animate blocks away
        const tl = gsap.timeline({
            onComplete: () => {
                gsap.set(".transition", { visibility: "hidden" });
            }
        });
        
        tl.to(".transition-row.row-1 .block", {
            scaleY: 0,
            duration: transitionDuration,
            stagger: { each: 0.1, from: "start" },
            ease: ease
        }, 0);
        
        tl.to(".transition-row.row-2 .block", {
            scaleY: 0, 
            duration: transitionDuration,
            stagger: { each: 0.1, from: "start" },
            ease: ease
        }, 0);
    }
    
    // Initial page reveal animation
    function initialReveal() {
        // Set initial state - blocks covering the screen
        gsap.set(".transition", { visibility: "visible" });
        gsap.set(".transition-row.row-1 .block", { scaleY: 1, transformOrigin: "top" });
        gsap.set(".transition-row.row-2 .block", { scaleY: 1, transformOrigin: "bottom" });
        
        // Slight delay to ensure everything is loaded
        setTimeout(() => {
            // Then run the entry animation to reveal the page
            entryAnimation();
        }, 100);
    }
});