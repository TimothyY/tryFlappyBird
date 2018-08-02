var stage, w, h, loader, startX, startY;
var background, bird, groundTile, ground, pipe, pipes, scoreCounter;

var isJump = false; // is the bird jumping?
var jumpAmount = 120; // How high is the jump?

var isDead = false; // is the bird isDead?
var masterPipeDelay = 78; // delay between pipes
var pipeDelay = masterPipeDelay; //counter used to monitor delay

var isScoreShown = false; // show counter outline for score?
var isGameStarted = false;

function init() {
    if (window.top != window) {
        document.getElementById("header").style.display = "none";
    }
    stage = new createjs.Stage("testCanvas");
    createjs.Touch.enable(stage);

    // grab canvas width and height for later calculations:
    w = stage.canvas.width;
    h = stage.canvas.height;

    manifest = [{
            src: "img/bird.png",
            id: "bird"
        },
        {
            src: "img/background.png",
            id: "background"
        },
        {
            src: "img/ground_tile.png",
            id: "groundTile"
        },
        {
            src: "img/pipe.png",
            id: "pipe"
        },
    ];

    loader = new createjs.LoadQueue(false);
    loader.addEventListener("complete", gameReady);
    loader.loadManifest(manifest);
}

function gameReady() {

}

function jumpBird() {

}

function dieBird() {

}

function generatePipeAndScore(deltaS) {

}

function handleTick(event) {

    stage.update(event); //paint the canvas
}