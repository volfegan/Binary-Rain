var streams = [];
var fadeInterval = 1.6;
var symbolSize = 16;

var startTime;
var reset = false;

function keyPressed() {
  if (keyCode === ESCAPE && reset == false) {
    reset = true;
  } else if (keyCode === ESCAPE && reset == true) {
    reset = false;
  }
}

function setup() {
    var canvas = createCanvas(
        window.innerWidth,
        window.innerHeight
    );
    canvas.parent('processing-bytes');
    background(0);

    var x = 0;
    for (var i = 0; i <= width / symbolSize; i++) {
        var stream = new Stream();
        stream.generateSymbols(x, random(-500, 0));
        streams.push(stream);
        x += symbolSize;
    }

    textFont('Consolas');
    textSize(symbolSize);
    startTime = Date.now();
}

function draw() {
    let message;
    
    background(0, 150);
    streams.forEach(function (stream) {
        stream.render();
    });
    
    if (Date.now() < startTime + 1000 && streams.length > 0) {
        message = "Connection on-line";
        text(message, (window.innerWidth/2)-textWidth(message)/2, window.innerHeight/2);
    }
    if (reset && streams.length > 0) {
        streams.splice(random(streams.length-1),1); //remove a random stream of binaries
        if (streams.length == 0) startTime = Date.now();
    } 
    if (streams.length == 0 && Date.now() < startTime + 3000) {
        message = "Connection Lost...";
        text(message, (window.innerWidth/2)-textWidth(message)/2, window.innerHeight/2);
    }
}

function Symbol(x, y, speed, first, opacity) {
    this.x = x;
    this.y = y;
    this.value;

    this.speed = speed;
    this.first = first;
    this.opacity = opacity;

    this.switchInterval = round(random(30, 180));

    this.setToRandomSymbol = function () {
        var charType = round(random(0, 4));
        if (frameCount % this.switchInterval == 0) {
            if (charType > 3) {
                // set it to random binary Byte
                this.value =
                    round(random(0, 1)) + "" + round(random(0, 1)) + "" + round(random(0, 1)) + "" + round(random(0, 1)) + "" + round(random(0, 1)) + "" + round(random(0, 1)) + "" + round(random(0, 1)) + "" + round(random(0, 1));
            } else {
                // set it to numeric 0 or 1
                this.value = round(random(0, 1));
            }
        }
    }

    this.rain = function () {
        this.y = (this.y >= height) ? 0 : this.y += this.speed;
    }

}

function Stream() {
    this.symbols = [];
    
    //Creates the string of binary numbers depending of webpage height
    var canvasHeight = document.getElementsByTagName("body")[0].getBoundingClientRect().height;
    if (canvasHeight < 720) {
            //produces a total symbols of [8 or 16]
        this.totalSymbols = 7 + 8 * round(random(0, 1));
        this.speed = random(2, 8);
    } else if (canvasHeight < 1080) {
            //produces a total symbols of [8 or 16 or 24]
        this.totalSymbols = 7 + 8 * round(random(0, 2));
        this.speed = random(2, 8);
    } else {
            //produces a total symbols of [8 or 16 or 24 or 32]
        this.totalSymbols = 7 + 8 * round(random(0, 3));
        this.speed = random(2, 16);
    }

    this.generateSymbols = function (x, y) {
        var opacity = 255;
        var first = round(random(0, 1)) == 1;
        for (var i = 0; i <= this.totalSymbols; i++) {
            symbol = new Symbol(
                x,
                y,
                this.speed,
                first,
                opacity
            );
            symbol.setToRandomSymbol();
            this.symbols.push(symbol);
            opacity -= (255 / this.totalSymbols) / fadeInterval;
            y -= symbolSize;
            first = false;
        }
    }

    this.render = function () {
        this.symbols.forEach(function (symbol) {
            if (symbol.first) {
                fill(140, 255, 170, symbol.opacity);
            } else {
                fill(0, 255, 70, symbol.opacity);
            }
            text(symbol.value, symbol.x, symbol.y);
            symbol.rain();
            symbol.setToRandomSymbol();
        });
    }
}
