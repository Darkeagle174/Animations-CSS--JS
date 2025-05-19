window.addEventListener("load", () => {
    const lenis = new Lenis();
    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    const images = []; // Stores loaded Image objects
    let loadedImageCount = 0;
    const totalImageFilesToLoad = 7; // Total number of image files

    function loadImages() {
        if (totalImageFilesToLoad === 0) {
            initializeScene();
            return;
        }
        for (let i = 1; i <= totalImageFilesToLoad; i++) {
            const img = new Image();
            const imagePath = `./assets/img${i}.jpg`;

            img.onload = function () {
                console.log(`Image loaded: ${imagePath}`);
                images.push(img); // Push in order of loading, might not be 1, 2, 3...
                                  // This was the original logic. For ordered images, pre-allocate array
                                  // and assign images[i-1] = img;
                loadedImageCount++;
                if (loadedImageCount === totalImageFilesToLoad) {
                    // Ensure images are sorted by their intended sequence if loading order wasn't guaranteed
                    // For this specific naming (img1, img2), if push works, it's fine.
                    // A more robust way is to load into specific array slots:
                    // const tempImages = new Array(totalImageFilesToLoad);
                    // In onload: tempImages[parsed_index_from_src] = img;
                    // Then: images.length = 0; images.push(...tempImages.filter(Boolean));
                    console.log("All images loaded. Initializing scene.");
                    initializeScene();
                }
            };
            img.onerror = function () {
                console.error(`Failed to load image: ${imagePath}`);
                // Optionally push a placeholder or null, or just count it
                loadedImageCount++;
                if (loadedImageCount === totalImageFilesToLoad) {
                    console.warn("Some images failed to load. Initializing scene.");
                    initializeScene();
                }
            };
            img.src = imagePath;
        }
    }

    function initializeScene() {
        if (images.length === 0 && totalImageFilesToLoad > 0) {
            console.error("No images were successfully loaded. Scene cannot be initialized properly.");
            // Optionally display a message to the user on the page
            document.body.innerHTML = "<p style='color:white; text-align:center; padding-top: 50px;'>Error: Could not load images. Please check the console and image paths.</p>";
            return;
        }

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
            45,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );

        const renderer = new THREE.WebGLRenderer({
            canvas: document.querySelector("canvas"),
            antialias: true,
            powerPreference: "high-performance",
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x000000);

        const parentWidth = 20;
        const parentHeight = 75;
        const curvature = 35;
        const segmentsX = 200;
        const segmentsY = 200;

        const parentGeometry = new THREE.PlaneGeometry(
            parentWidth,
            parentHeight,
            segmentsX,
            segmentsY
        );

        const positions = parentGeometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
            const y = positions[i + 1];
            const distanceFromCenter = Math.abs(y / (parentHeight / 2));
            positions[i + 2] = Math.pow(distanceFromCenter, 2) * curvature;
        }
        parentGeometry.computeVertexNormals(); // Still useful for MeshBasicMaterial if you switch back or for other effects

        const totalSlides = images.length; // Use actual number of loaded images
        const slideHeight = 15; // Conceptual height of one slide item in 3D space
        const gap = 2.5;       // Conceptual gap between slide items
        const cycleHeight = totalSlides * (slideHeight + gap); // Total conceptual height of one cycle

        const textureCanvas = document.createElement("canvas");
        const ctx = textureCanvas.getContext("2d", {
            alpha: true,
            willReadFrequently: false, // Set based on usage; true if reading back pixels often
        });
        textureCanvas.width = 2048;  // Power of 2 is good for textures
        textureCanvas.height = 8192; // Power of 2

        // Calculate the height of a single slide image on the texture canvas
        const slideTextureImageHeight = (slideHeight / cycleHeight) * textureCanvas.height;

        // Calculate the Y-coordinate on the texture canvas where the TOP of the first slide (img1)
        // should be drawn so that its CENTER aligns with the CENTER of the textureCanvas.
        const initialYShiftForFirstSlideTop = (textureCanvas.height / 2) - (slideTextureImageHeight / 2);

        const texture = new THREE.CanvasTexture(textureCanvas);
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());

        const parentMaterial = new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.DoubleSide,
        });

        const parentMesh = new THREE.Mesh(parentGeometry, parentMaterial);
        parentMesh.position.set(0, 0, 0);
        parentMesh.rotation.x = THREE.MathUtils.degToRad(-20);
        parentMesh.rotation.y = THREE.MathUtils.degToRad(20);
        scene.add(parentMesh);

        const distance = 17.5;
        const heightOffset = 5;
        const offsetX = distance * Math.sin(THREE.MathUtils.degToRad(20));
        const offsetZ = distance * Math.cos(THREE.MathUtils.degToRad(20));

        camera.position.set(offsetX, heightOffset, offsetZ);
        camera.lookAt(0, heightOffset, 0);
        camera.rotation.z = THREE.MathUtils.degToRad(-10);

        const slideTitles = ["Title 1", "Title 2", "Title 3", "Title 4",
                             "Title 5", "Title 6", "Title 7"]; // Make sure this matches totalSlides

        function updateTexture(scrollOffset = 0) {
            ctx.fillStyle = "#000"; // Clear canvas
            ctx.fillRect(0, 0, textureCanvas.width, textureCanvas.height);

            const fontSize = 180;
            ctx.font = `500 ${fontSize}px Eagle Lake`; // Ensure "Eagle Lake" font is loaded via CSS
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";

            const extraSlides = 2; // For seamless wrapping visualization

            for (let i = -extraSlides; i < totalSlides + extraSlides; i++) {
                // conceptualBaseY is the Y position of the top of slide 'i' (0-indexed)
                // if the first slide's top was at Y=0, and sequence goes downwards.
                let conceptualBaseY = -i * (slideHeight + gap);

                // Adjust conceptualBaseY based on scrollOffset.
                // As scrollOffset increases (user scrolls "down"), images should effectively move "up".
                let scrolledConceptualY = conceptualBaseY - (scrollOffset * cycleHeight);

                // Convert this conceptual Y to a Y position on the texture canvas.
                let textureDrawY = (scrolledConceptualY / cycleHeight) * textureCanvas.height;

                // Apply the initial shift to center the first slide (when i=0, scrollOffset=0).
                textureDrawY += initialYShiftForFirstSlideTop;

                // Wrap the textureDrawY to fit within the canvas height.
                let wrappedY = textureDrawY % textureCanvas.height;
                if (wrappedY < 0) {
                    wrappedY += textureCanvas.height;
                }

                // slideIndex will be 0 for img1, 1 for img2, etc.
                let slideIndex = ((-i % totalSlides) + totalSlides) % totalSlides;

                const slideRect = {
                    x: textureCanvas.width * 0.05, // 5% margin
                    y: wrappedY,                   // This is the top of the image rectangle on texture
                    width: textureCanvas.width * 0.9, // 90% width
                    height: slideTextureImageHeight,  // Consistent height for each slide's image
                };

                const img = images[slideIndex]; // Access image using 0-based slideIndex

                if (img && img.complete && img.naturalWidth > 0) {
                    const imgAspect = img.width / img.height;
                    const rectAspect = slideRect.width / slideRect.height;

                    let drawWidth, drawHeight, drawX, drawY;

                    if (imgAspect > rectAspect) { // Image wider than area (fit height, center width)
                        drawHeight = slideRect.height;
                        drawWidth = drawHeight * imgAspect;
                        drawX = slideRect.x + (slideRect.width - drawWidth) / 2;
                        drawY = slideRect.y;
                    } else { // Image taller than area (fit width, center height)
                        drawWidth = slideRect.width;
                        drawHeight = drawWidth / imgAspect;
                        drawX = slideRect.x;
                        drawY = slideRect.y + (slideRect.height - drawHeight) / 2;
                    }

                    ctx.save();
                    ctx.beginPath();
                    // Use ctx.rect for sharp corners, or ctx.roundRect(..., [radius]) for rounded.
                    ctx.rect(
                        slideRect.x,
                        slideRect.y,
                        slideRect.width,
                        slideRect.height
                    );
                    ctx.clip();
                    ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
                    ctx.restore();

                    ctx.fillStyle = "white"; // Title color
                    ctx.fillText(
                        slideTitles[slideIndex] || `Image ${slideIndex + 1}`, // Fallback title
                        textureCanvas.width / 2,
                        wrappedY + slideRect.height / 2 // Center text in the slide
                    );
                } else {
                    // Placeholder for missing or failed images
                    ctx.fillStyle = "rgba(30,30,30,1)"; // Dark grey placeholder
                    ctx.fillRect(slideRect.x, slideRect.y, slideRect.width, slideRect.height);
                    ctx.fillStyle = "rgba(150,150,150,1)";
                    const placeholderFontSize = Math.max(20, fontSize / 3);
                    ctx.font = `300 ${placeholderFontSize}px Inter`; // Use a common fallback font
                    ctx.fillText(
                        `Image ${slideIndex + 1} unavailable`,
                        textureCanvas.width / 2,
                        wrappedY + slideRect.height / 2 - placeholderFontSize * 0.75
                    );
                    // Still draw the main title over the placeholder if available
                    ctx.font = `500 ${fontSize}px Eagle Lake`; // Reset for main title
                    ctx.fillStyle = "rgba(200,200,200,1)"; // Lighter title on dark placeholder
                    if (slideTitles[slideIndex]) {
                        ctx.fillText(
                            slideTitles[slideIndex],
                            textureCanvas.width / 2,
                            wrappedY + slideRect.height / 2 + placeholderFontSize * 0.75
                        );
                    }
                }
            }
            texture.needsUpdate = true;
        }

        let currentScroll = 0;
        lenis.on("scroll", ({ scroll, limit, velocity, direction, progress }) => {
            // console.log("Lenis scroll event:", { scroll, limit, progress });
            if (limit > 0) {
                currentScroll = scroll / limit;
            } else {
                currentScroll = 0; // Or use progress if it's consistently 0-1
            }
            // currentScroll = progress; // This is often simpler if Lenis normalizes progress well

            updateTexture(currentScroll);
            renderer.render(scene, camera);
        });

        let resizeTimeout;
        window.addEventListener("resize", () => {
            if (resizeTimeout) clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
                // Re-render on resize, especially if texture content depends on aspect (not directly here)
                updateTexture(currentScroll); // Re-draw texture if needed (not strictly necessary if only camera changes)
                renderer.render(scene, camera);
            }, 250);
        });

        updateTexture(0); // Initial render with scrollOffset = 0
        renderer.render(scene, camera);
    }

    loadImages(); // Start loading images
});