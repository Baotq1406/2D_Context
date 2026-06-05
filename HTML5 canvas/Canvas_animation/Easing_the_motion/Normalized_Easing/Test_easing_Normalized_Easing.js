console.log("Canvas animation test easing normalized");

"use strict";

let canvas;
let context;

let secondsPassed = 0;
let oldTimeStamp = 0;

// animation variables
let timePassed = 0;
let duration = 2; // seconds

let startX = 50;
let startY = 50;

let endX = 450;
let endY = 250;

let rectX = startX;
let rectY = startY;

window.onload = init;

function init() {
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");

    window.requestAnimationFrame(gameLoop);
};

function gameLoop(timeStamp) {
    secondsPassed = (timeStamp - oldTimeStamp) / 1000;
    secondsPassed = Math.min(secondsPassed, 0.1);

    oldTimeStamp = timeStamp;

    update(secondsPassed);
    draw();
    window.requestAnimationFrame(gameLoop);
};

function update(secondsPassed) {
    timePassed += secondsPassed;

    let progress = timePassed / duration; // Normalized time (0 to 1)

     // clamp progress
    if (progress > 1) 
    {
        timePassed = 0; // Reset time for easing functions
        progress = 1;
    }
      

    // normalized easing (ease in out quint)
    let eased = easeInOutQuint(progress);

    rectX = startX + (endX - startX) * eased;
    rectY = startY + (endY - startY) * eased;
};

function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#ff8080';
    context.fillRect(rectX, rectY, 150, 100);
}

function easeInOutQuint(t) {
    return t < 0.5
        ? 16 * t * t * t * t * t
        : 1 - Math.pow(-2 * t + 2, 5) / 2;
};

