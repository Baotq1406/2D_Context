console.log("Importing an image from a URL...");

let canvas = document.getElementById("myCanvas");
let context = canvas.getContext("2d");

let img = new Image();

img.onload = function() {
    context.drawImage(img, 10, 10);
};

//img.src = '<URL_OF_THE_IMAGE_TO_LOAD>'; // URL of the image to load
img.src = 'https://www.image2url.com/r2/default/images/1781066609167-d5b61dd4-3734-407c-b94e-852987366ee1.jpg'; // URL of the image to load
