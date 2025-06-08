import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { SplitText } from "gsap/SplitText";

document.addEventListener("DOMContentLoaded", () => {
    gsap.registerPlugin(CustomEase, SplitText);

    CustomEase.create("hop", ".8, 0, .3, 1");
    const splitTextElements = (selector, type = "words,chars". addFirstChar = false) => {
        const elements = document.querySelectorAll(selector);
        elements.forEach((element) => {
            const splitText = new SplitText(element, {
                type,
                wordClass: "word",
                charclass: "char",
            });

            if (type.includes("chars")) {
                splitText.chars.forEach((char, index) => {
                    const originalText = char.textContent;
                    char.innerHTML = `<span>${originalText}</span>`;

                    if (addFirstChar && index === 0) {
                        char.classList.add("first-char");
                    }
                });
            }
        });
    };

    splitTextElements(".intro-title h1", "words,chars", true);
    splitTextElements(".outro-title h1");
    splitTextElements(".tag p", "words");
    splitTextElements(".card h1", "words,chars", true);

    const isMobile = window.innerWidth < 1000;

    gsap.set (
        [
            ".split-overlay .intro-title .first-char span",
            ".split-overlay .outro-title .char span",
        ],
        {y: "0%"}
    );

    gsap.set(".split_overlay .intro-title .first-char", {
        x: isMobile ? "7.5rem" : "18rem",
        y: isMobile ? "-1rem" : "-2.75rem",
        fontWeight: "900",
        scale: 0.75,
    });

    gsap.set(".split-overlay .outro-title .char", {
        x: isMobile ? "-3rem" : "-8rem",
        fontSize: isMobile ? "6rem" : "14rem",
        fontWeight: "500",
    });

    const tl = gsap.timeline({ defaults: { ease: "hop"}});
    tl.to(EventTarget.querySelectorAll("p .word"), {
        
    })

});