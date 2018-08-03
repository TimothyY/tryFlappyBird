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

    background = new createjs.Shape();
    background.graphics.beginBitmapFill(loader.getResult("background")).drawRect(0, 0, w, h);

    stage.addChild(background);

    groundTile = loader.getResult("groundTile");
    ground = new createjs.Shape();
    ground.graphics.beginBitmapFill(groundTile).drawRect(0, 0, w + groundTile.width, groundTile.height);
    ground.y = h - groundTile.height;
    stage.addChild(ground);


    var birdData = new createjs.SpriteSheet({
        "images": [loader.getResult("bird")],
        "frames": {
            "width": 92,
            "height": 64,
            "regX": 46,
            "regY": 32,
            "count": 3
        },
        "animations": {
            "fly": [0, 2, "fly", 0.21],
            "dive": [1, 1, "dive", 1]
        }
    });
    bird = new createjs.Sprite(birdData, "fly");

    startX = (w / 2) - (92 / 2);
    startY = 512;

    bird.setTransform(startX, startY, 1, 1);
    bird.framerate = 30;

    stage.addChild(bird);
    stage.addEventListener("stagemousedown", jumpBird);

    scoreCounter = new createjs.Text(0, "86px 'Flappy Bird'", "#000000");
    scoreCounter.outline = 10;
    scoreCounter.textAlign = 'center';
    scoreCounter.x = w / 2;
    scoreCounter.y = 935;
    scoreCounter.alpha = 0;
    stage.addChild(scoreCounter);

    createjs.Ticker.timingMode = createjs.Ticker.RAF;
    createjs.Ticker.addEventListener("tick", handleTick);
}

function jumpBird() {
    if (!isDead) {
        createjs.Tween.removeTweens(bird);
        isJump = true;

        if (!isGameStarted) {
            isGameStarted = true;
            isScoreShown = true;
        }

        bird.framerate = 30;
        bird.gotoAndPlay("fly");

        if (bird.y < -200) {
            bird.y = -200;
        }

        createjs.Tween.get(bird).
        to({
                y: bird.y - jumpAmount
            }, 300, createjs.Ease.linear)
            .to({
                y: 1024
            }, 1300, createjs.Ease.linear);

        isJump = false;
    }
}

function dieBird() {

}

function generatePipes(deltaS) {

}

function showScore() {
    if (isScoreShown) {
        scoreCounter.alpha = 1;
        isScoreShown = false;
    }
}

function handleTick(event) {

    var deltaS = event.delta / 1000;

    if (!isDead) {
        console.log("ground.x: " + ground.x);
        console.log("deltaS: " + deltaS);

        ground.x = (ground.x - deltaS * 300) % groundTile.width;
    }

    showScore();

    stage.update(event); //paint the canvas
}