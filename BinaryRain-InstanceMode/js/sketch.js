var rainbinary;

var binaryMatrix = function(p) {
    p.stream;
    p.streams = [];
    p.fadeInterval = 1.6;
    p.symbolSize = 16;

    p.setup = function() {
        p.createCanvas( p.windowWidth, p.windowHeight );
        p.background(0);

        p.x = 0;
        p.y = p.random(-1000, 0);
        
        for (var i = 0; i <= p.width / p.symbolSize; i++) {
            p.stream = new Stream();
            p.stream.generateSymbols(p.x, p.y);
            p.streams.push(p.stream);
            p.x += p.symbolSize;
        }
        
        p.textFont('Consolas');
        p.textSize(p.symbolSize);
    }

    p.draw = function() {
        p.background(0, 150);
        p.streams.forEach(function (stream) {
            stream.render();
        });
    }
    p.windowResized = function() {
        p.resizeCanvas(p.windowWidth, p.windowHeight);
        //p.redraw()
    }
    
    function Symbol(x, y, speed, first, opacity) {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.first = first;
        this.opacity = opacity;
        
        this.value;
        this.switchInterval = p.round(p.random(30, 180));
        this.setToRandomSymbol = function () {
            var charType = p.round(p.random(0, 4));
            if (p.frameCount % this.switchInterval == 0) {
                if (charType > 3) {
                    // set it to random binary Byte [01010101]
                    this.value =
                        p.round(p.random(0, 1)) + "" + p.round(p.random(0, 1)) + "" + p.round(p.random(0, 1)) + "" + p.round(p.random(0, 1)) + "" + p.round(p.random(0, 1)) + "" + p.round(p.random(0, 1)) + "" + p.round(p.random(0, 1)) + "" + p.round(p.random(0, 1));
                } else {
                    // set it to numeric 0 or 1
                    this.value = p.round(p.random(0, 1));
                }
            }
        }
        this.rain = function () {
            this.y = (this.y >= p.height) ? 0 : this.y += this.speed;
        }
        
    }//End of Symbol f()
    
    function Stream() {
        this.symbols = [];
        //Creates the string of binary numbers depending of webpage height
        var canvasHeight = document.getElementsByTagName("body")[0].getBoundingClientRect().height;
        if (canvasHeight < 1024) {
            //produces a total symbols of [8 or 16]
            this.totalSymbols = 7 + 8 * p.round(p.random(0, 1));
            this.speed = p.random(2, 8);
        } else if (canvasHeight < 2048) {
            //produces a total symbols of [8 or 16 or 24]
            this.totalSymbols = 7 + 8 * p.round(p.random(0, 2));
            this.speed = p.random(2, 8);
        } else {
            //produces a total symbols of [8 or 16 or 24 or 32]
            this.totalSymbols = 7 + 8 * p.round(p.random(0, 3));
            this.speed = p.random(2, 16);
        }

        this.generateSymbols = function (x, y) {
            var opacity = 255;
            var first = p.round(p.random(0, 1)) == 1;
            for (var i = 0; i <= this.totalSymbols; i++) {
                symbol = new Symbol(
                    x,
                    y,
                    this.speed,
                    first,
                    opacity);
                
                symbol.setToRandomSymbol();
                this.symbols.push(symbol);
                y -= p.symbolSize;
                opacity -= (255 / this.totalSymbols) / p.fadeInterval;
                first = false;
            }
        }//End of generateSymbols f()
        
        this.render = function () {
            this.symbols.forEach(function (symbol) {
                if (symbol.first) {
                    p.fill(140, 255, 170, symbol.opacity);
                } else {
                    p.fill(0, 255, 70, symbol.opacity);
                }
                p.text(symbol.value, symbol.x, symbol.y);
                symbol.rain();
                symbol.setToRandomSymbol();
            });
        }//End of render f()
        
    }//End of Stream f()
    
}
rainbinary = new p5(binaryMatrix, "processing-bytes")