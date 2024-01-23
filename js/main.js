// the game itself
var game;

var gameOptions = {

    // slices (prizes) placed in the wheel
    slices: 6,

    // prize names, starting from 12 o'clock going clockwise
    slicePrizes: [
        "Flat 15% OFF",
        "Better Luck Next Time",
        "T-Shirt",
        "Better Luck Next Time",
        "Surprise Gift",
        "Spin Again"
    ],

    // wheel rotation duration, in milliseconds
    rotationTime: 3000
}

// once the window loads...
window.onload = function () {

    // game configuration object
    var gameConfig = {

        // render type
        type: Phaser.CANVAS,

        // game width, in pixels
        width: 850,

        // game height, in pixels
        height: 850,

        // game background color
        backgroundColor: 0xFFFFFF,

        // scenes used by the game
        scene: [playGame]
    };

    // game constructor
    game = new Phaser.Game(gameConfig);

    // pure javascript to give focus to the page/frame and scale the game
    window.focus()
    resize();
    window.addEventListener("resize", resize, false);
}

// PlayGame scene
class playGame extends Phaser.Scene {

    // constructor
    constructor() {
        super("PlayGame");
    }

    // method to be executed when the scene preloads
    preload() { // loading assets

        this.load.image("wheel", window.location.href + "images/wheel.png");
        this.load.image("pin", window.location.href + "images/pin.png");
    }

    // method to be executed once the scene has been created
    create() {

        // adding the wheel in the middle of the canvas
        this.wheel = this.add.sprite(game.config.width / 2, game.config.height / 2, "wheel");

        // adding the pin in the middle of the canvas
        this.pin = this.add.sprite(game.config.width / 2, game.config.height / 2, "pin");

        // adding the text field
        this.prizeText = this.add.text(game.config.width / 2, game.config.height - 35, "SPIN TO WIN", {
            font: "bold 64px Work Sans",
            align: "center",
            color: "black"
        });

        // center the text
        this.prizeText.setOrigin(0.5);

        // the game has just started = we can spin the wheel
        this.canSpin = true;

        // waiting for your input, then calling "spinWheel" function
        this.input.on("pointerdown", this.spinWheel, this);
    }

    // function to spin the wheel
    spinWheel() {
        // Can we spin the wheel?
        if (this.canSpin) {
            // Resetting text field
            this.prizeText.setText("");
    
            // The wheel will spin round from 2 to 4 times. This is just choreography
            var rounds = Phaser.Math.Between(4, 6);
    
            // Then will rotate by a random number from 0 to 360 degrees. This is the actual spin
            var degrees = Phaser.Math.Between(0, 360);
    
            // Before the wheel ends spinning, we already know the prize according to "degrees" rotation and the number of slices
            // Calculate the offset to shift the wheel to 11:45
            // Calculate the offset to shift the wheel to 08:44
            var offsetDegrees = 360 / (gameOptions.slices * 2) - 70;
    
            // Calculate the prize based on the adjusted rotation
            var prize = gameOptions.slices - 1 - Math.floor((degrees + offsetDegrees) / (360 / gameOptions.slices));
    
            // Ensure that the prize value is within the valid range
            prize = (prize + gameOptions.slices) % gameOptions.slices;
    
            // Now the wheel cannot spin because it's already spinning
            this.canSpin = false;
    
            // Animation tween for the spin: duration 3s, will rotate by (360 * rounds + degrees) degrees
            // The quadratic easing will simulate friction
            this.tweens.add({
                // Adding the wheel to tween targets
                targets: [this.wheel],
    
                // Angle destination
                angle: 360 * rounds + degrees,
    
                // Tween duration
                duration: gameOptions.rotationTime,
    
                // Tween easing
                ease: "Cubic.easeOut",
    
                // Callback scope
                callbackScope: this,
    
                // Callback function to be executed once the tween has been completed
                onComplete: function (tween) {
                    // Displaying prize text
                    this.prizeText.setText(gameOptions.slicePrizes[prize]);
    
                    // Player can spin again
                    this.canSpin = true;
                }
            });
        }
    }
    
}

// pure javascript to scale the game
function resize() {
    var canvas = document.querySelector("canvas");
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;
    var windowRatio = windowWidth / windowHeight;
    var gameRatio = game.config.width / game.config.height;
    if (windowRatio < gameRatio) {
        canvas.style.width = windowWidth + "px";
        canvas.style.height = (windowWidth / gameRatio) + "px";
    }
    else {
        canvas.style.width = (windowHeight * gameRatio) + "px";
        canvas.style.height = windowHeight + "px";
    }
}
