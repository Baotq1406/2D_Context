console.log("Using clipping with sprites");

let canvas = document.getElementById("myCanvas");
let context = canvas.getContext("2d");
let sprite_1 = document.getElementById("mySprite_1");
let sprite_2 = document.getElementById("mySprite_2");

let row = 1;
let col = 3;

let frameWidth = 50;
let frameHeight = 61;

// window.onload = function() {
//     //context.drawImage(sprite, 0, 0);
//     context.drawImage(sprite_1, col*frameWidth, row*frameHeight, frameWidth, frameHeight, 10, 30, frameWidth, frameHeight);
// }
let numCols = 5;
let numRows = 2;

let frameW = sprite_2.width / numCols;
let frameH = sprite_2.height / numRows;

// The sprite image frame starts from 0
let currentFrame = 0;

setInterval(function()
{
    // Pick a new frame
    currentFrame++;

    // Make the frames loop
    let maxFrame = numCols * numRows - 1;
    if (currentFrame > maxFrame){
        currentFrame = 0;
    }

    // Update rows and columns
    let columns = currentFrame % numCols;
    let rows = Math.floor(currentFrame / numCols);

    // Clear and draw
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(sprite_1, col*frameWidth, row*frameHeight, frameWidth, frameHeight, 10, 30, frameWidth, frameHeight);
    context.drawImage(sprite_2, columns * frameWidth, rows * frameHeight, frameWidth, frameHeight, 100, 30, frameWidth, frameHeight);

//Wait for next step in the loop
}, 100);