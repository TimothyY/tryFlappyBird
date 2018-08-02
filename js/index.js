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

    groundTile = loader.getResult("groundTile");
    ground = new createjs.Shape();
    ground.graphics.beginBitmapFill(groundTile).drawRect(0, 0, w + groundTile.width, groundTile.height);
    ground.tileW = groundTile.width;
    ground.y = h - groundTile.height;

    var birdData = new createjs.SpriteSheet({
        "images": [loader.getResult("bird")],
        //set center and size of frames, center is important for later bird rotation
        "frames": {
            "width": 92,
            "height": 64,
            "regX": 46,
            "regY": 32,
            "count": 3
        },
        // define two animations, run (loops, 0.21x speed) and dive (returns to dive and holds frame one static):
        "animations": {
            "fly": [0, 2, "fly", 0.21],
            "dive": [1, 1, "dive", 1]
        }
    });
    bird = new createjs.Sprite(birdData, "fly");

    startX = (w / 2) - (92 / 2);
    startY = 512;

    // Set initial position and scale 1 to 1
    bird.setTransform(startX, startY, 1, 1);
    // Set framerate
    bird.framerate = 30;

    stage.addChild(background);

    pipes = new createjs.Container();
    stage.addChild(pipes);

    stage.addChild(bird, ground);
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

        bird.framerate = 60;
        bird.gotoAndPlay("fly");

        if (bird.y < -200) {
            bird.y = -200;
        }

        //bird should go up then down
        createjs.Tween.get(bird)
            .to({
                y: bird.y - jumpAmount //y tujuan naik
            }, 300, createjs.Ease.linear)
            .to({
                y: 1024 //y tujuan turun
            }, 1300, createjs.Ease.linear);

        isJump = false;

    }

}

function dieBird() {
    isDead = true;
    bird.gotoAndPlay("dive");
    createjs.Tween.removeTweens(bird);
    createjs.Tween.get(bird)
        .to({
            y: bird.y,
            rotation: 90
        }, 1000, createjs.Ease.linear) //rotate back
        .to({
            y: ground.y - 30
        }, 100, createjs.Ease.linear); //drop to the bedrock
}

function generatePipeAndScore(deltaS) {

    var gap = 300; //gap for the pipe
    var l = pipes.getNumChildren();
    if (isGameStarted && !isDead) {
        if (pipeDelay == 0) {

            pipe = new createjs.Bitmap(loader.getResult("pipe"));
            pipe.x = w + 600;
            pipe.y = (ground.y - gap * 2) * Math.random() + gap * 1.5;
            pipes.addChild(pipe);

            pipe2 = new createjs.Bitmap(loader.getResult("pipe"));
            pipe2.scaleX = -1;
            pipe2.rotation = 180;
            pipe2.x = pipe.x; //+ pipe.image.width
            pipe2.y = pipe.y - gap;

            pipes.addChild(pipe2);

            pipeDelay = masterPipeDelay;

        } else {
            pipeDelay = pipeDelay - 1;
        }
        for (var i = 0; i < l; i++) {
            pipe = pipes.getChildAt(i);
            if (pipe) {
                if (true) { // tried replacing true with this, but it's off: pipe.x < bird.x + 92 && pipe.x > bird.x 
                    var collision = ndgmr.checkRectCollision(pipe, bird, 1, true);
                    if (collision) {
                        if (collision.width > 30 && collision.height > 30) {
                            dieBird();
                        }
                    }
                }
                pipe.x = (pipe.x - deltaS * 300);
                if (pipe.x <= 338 && pipe.rotation == 0 && pipe.name != "counted") {
                    pipe.name = "counted"; //using the pipe name to count pipes
                    scoreCounter.text = scoreCounter.text + 1;
                }
                if (pipe.x + pipe.image.width <= -pipe.w) {
                    pipes.removeChild(pipe);
                }
            }
        }
        if (isScoreShown) {
            scoreCounter.alpha = 1;
            isScoreShown = false;
        }

    }
}

function handleTick(event) {
    var deltaS = event.delta / 1000; //event.delta is The time elapsed in ms since the last tick

    if (bird.y > (ground.y - 40)) {
        if (!isDead) dieBird();
    }

    if (!isDead) {
        console.log("ground.x: " + ground.x + " deltaS: " + deltaS);
        ground.x = (ground.x - deltaS * 300) % groundTile.width; //deltaS*speed untuk geser, loop berjalan ketika 0%groundTile.width
    }

    // generatePipeAndScore(deltaS);

    stage.update(event);
}