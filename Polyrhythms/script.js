const paper = document.querySelector("#paper"),
    pen = paper.getContext("2d");

let startTime = new Date().getTime();

const arcs = [
    "#FFFFFF",
    "#E4F0FF",
    "#CAE1FF",
    "#AFD3FF",
    "#95C4FF",
    "#7AB5FF",
    "#9088F2",
    "#A669E6",
    "#BD4ADA",
    "#D32BCD",
    "#D942CC",
    "#DE59CC",
    "#E470CB",
    "#E987CA",
    "#EF9EC9",
    "#F28CB3",
    "#F57B9D",
    "#F76987",
    "#FA5871",
    "#FC465B",
    "#FF3345"
]//.map((color, index) => {
    // const audio = new Audio(`Polyrhythms\\piano_notes\\wav\\${index + 1}.wav`);

    // audio.volume = 0.02;

    // return {
    //     color, audio
    // }

// })


const draw = () => {
    const currentTime = new Date().getTime();
    const elapsedTime = (currentTime - startTime) / 1000;

    paper.width = paper.clientWidth;
    paper.height = paper.clientHeight;

    const start = {
        x: paper.width * 0.1,
        y: paper.height * 0.9
    };

    const end = {
        x: paper.width * 0.9,
        y: paper.height * 0.9
    };

    const center = {
        x: paper.width * 0.5,
        y: paper.height * 0.9
    };

    const length = end.x - start.x;
    const maxAngle = 2 * Math.PI;
    const distance = Math.PI + (elapsedTime * 0.5);
    const modDistance = distance % maxAngle;
    const adjustedDistance = modDistance >= Math.PI ? modDistance : maxAngle - modDistance;

    // Draw base line
    pen.strokeStyle = 'white';
    pen.lineWidth = 3;
    pen.beginPath();
    pen.moveTo(start.x, start.y);
    pen.lineTo(end.x, end.y);
    pen.stroke();

    // Calculate initial arc radius and spacing
    const initialArcRadius = length * 0.05;
    const spacing = (length / 2 - initialArcRadius) / arcs.length;

    // Draw all arcs and their moving circles
    arcs.forEach((color, index) => {
        const arcRadius = initialArcRadius + (index * spacing);

        const numberOfLoops = 50 - index

        const oneFullLoop = 2 * Math.PI, velocity = (oneFullLoop * numberOfLoops) / 900
        const distance = Math.PI + (elapsedTime * velocity);
        const modDistance = distance % maxAngle;
        const adjustedDistance = modDistance >= Math.PI ? modDistance : maxAngle - modDistance;

        // Draw the arc
        pen.beginPath();
        pen.strokeStyle = color;
        pen.arc(center.x, center.y, arcRadius, Math.PI, 2 * Math.PI);
        pen.stroke();

        // Draw moving circle on each arc
        const x = center.x + arcRadius * Math.cos(adjustedDistance);
        const y = center.y + arcRadius * Math.sin(adjustedDistance);

        pen.fillStyle = "white";
        pen.beginPath();
        pen.arc(x, y, length * 0.0065, 0, 2 * Math.PI);
        pen.fill();
    });

    requestAnimationFrame(draw);
};

draw();