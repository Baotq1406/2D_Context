console.log("Canvas animation test easing");

"use strict";

let canvas;
let context;

let secondsPassed = 0; 
let oldTimeStamp = 0;

let timePassed = 0;


window.onload = init;

function init() {
    canvas = document.getElementById("canvas");
    context = canvas.getContext("2d");

    window.requestAnimationFrame(gameLoop);
}

function gameLoop(timeStamp) {

    secondsPassed = (timeStamp - oldTimeStamp) / 1000;
    secondsPassed = Math.min(secondsPassed, 0.1);

    oldTimeStamp = timeStamp;

    update(secondsPassed);
    draw();
    window.requestAnimationFrame(gameLoop);
}

function update(secondsPassed) {
    timePassed += secondsPassed;

    // Use different easing functions for different effects.
    rectX = easeInOutQuint(timePassed, 50, 500, 1.5);
    rectY = easeLinear(timePassed, 50, 250, 1.5);

    checkRectPosition();
}

function draw(){
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#ff8080';
    context.fillRect(rectX, rectY, 150, 100);
}

function checkRectPosition() {
    if (rectX > canvas.width || rectY > canvas.height) {    
        rectX = 0;
        rectY = 0;
        timePassed = 0; // Reset time for easing functions
    }
}

// Example easing functions
function easeInOutQuint (t, b, c, d) {
    if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
    return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
}

function easeLinear (t, b, c, d) {
    return c * t / d + b;
}

