console.log("Getting a reference to an HTML image element...");

let canvas;
let context;

window.onload = function() {
    canvas = document.getElementById("myCanvas");
    context = canvas.getContext("2d");

    // Get a reference to the image element
    let img = document.getElementById("myImage");
    context.drawImage(img, 10, 30);
}   