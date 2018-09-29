'use strict';

//Initial configuration
var config = {
    fieldWidth: 30, //width per part of snake
    fieldHeight: 30, //height per part of snake
    snakeLength: 5,
    snakeWeight: 20,
    startX: 10, //per part of snake
    startY: 5, //per part of snake
    velocity: 9 //from 1 to 10
};
Object.freeze(config);
Object.seal(config);

//Part of Snake
var Part = function(x, y, weight) {
    this.x = x;
    this.y = y;
    this.weight = weight;
};

//Class Snake
var Snake = function(length, weight, startX, startY){
    this.length = length;
    this.weight = weight;
    this.headX = startX;
    this.headY = startY;
    this.body = [];
    this.direction = {};
};

Snake.prototype.init = function(){
    for(var i=0; i<this.length; i++){
        this.body[i] = new Part(this.headX, this.headY += this.weight, this.weight);
    }

    this.direction = {top:[0, -this.weight], right:[this.weight, 0], bottom:[0, this.weight], left:[-this.weight, 0]};
    Object.freeze(this.direction);
    Object.seal(this.direction);

    this.currentDirection = this.direction.top;
};

Snake.prototype.changeDirection = function(direction) {
    this.currentDirection = direction;
};

Snake.prototype.getNextCoordinate = function(){
    return [
        this.headX + this.currentDirection[0],
        this.headY + this.currentDirection[1]
    ];
};

Snake.prototype.addPart = function(part){
    this.body.unshift(Object.assign(part));
    this.length++;
};

Snake.prototype.move = function(){
    for(var i=this.length-1; i>=0; i--){
        if(i === 0){
            this.headX = this.body[i].x += this.currentDirection[0];
            this.headY = this.body[i].y += this.currentDirection[1];
        }
        else{
            this.body[i].x = this.body[i-1].x;
            this.body[i].y = this.body[i-1].y;
        }
    }
};

//Game field
var Field = function(width, height){
    this.width = width;
    this.height = height;
};

//Initialization of field
Field.prototype.init = function(){
    this.canvas = new Konva.Stage({
        container: 'field',
        width: this.width,
        height: this.height
    });
};

//Class Game
var Game = function(config){
    this.config = config;
    this.field = new Field(this.normalization(this.config.fieldWidth), this.normalization(this.config.fieldHeight));
    this.snake = new Snake(this.config.snakeLength, this.config.snakeWeight, this.normalization(this.config.startX), this.normalization(this.config.startY));
};

Game.prototype.normalization = function(value){
    return value*this.config.snakeWeight;
};

Game.prototype.init = function(){
    this.snake.init();
    this.field.init();
    this.layerSnake = new Konva.Layer();
    this.layerFreePart = new Konva.Layer();
    this.createFreePart();

    //calculate velocity of game
    if(this.config.velocity > 0 && this.config.velocity < 11){
        this.velocity = 1100-(this.config.velocity*100)
    }
    else if(this.config.velocity > 10 && this.config.velocity < 21){
        this.velocity = 120-((this.config.velocity-10)*10)
    }

    window.onkeydown = function(e){
        switch (e.keyCode) {
            case 38:
                if (this.game.snake.currentDirection !== this.game.snake.direction.bottom)
                    this.game.snake.changeDirection(this.game.snake.direction.top);
                break;
            case 39:
                if (this.game.snake.currentDirection !== this.game.snake.direction.left)
                    this.game.snake.changeDirection(this.game.snake.direction.right);
                break;
            case 40:
                if (this.game.snake.currentDirection !== this.game.snake.direction.top)
                    this.game.snake.changeDirection(this.game.snake.direction.bottom);
                break;
            case 37:
                if (this.game.snake.currentDirection !== this.game.snake.direction.right)
                    this.game.snake.changeDirection(this.game.snake.direction.left);
                break;
        }
    }
};

Game.prototype.render = function(){
    this.layerSnake.destroyChildren();

    for(var i=0; i<this.snake.length; i++){
        this.layerSnake.add(
            new Konva.Rect({
                x: this.snake.body[i].x,
                y: this.snake.body[i].y,
                width: this.snake.body[i].weight,
                height: this.snake.body[i].weight,
                fill: 'gray',
                stroke: 'black',
                strokeWidth: 1
            })
        );
    }
    this.field.canvas.add(this.layerSnake);
    this.field.canvas.add(this.layerFreePart);
    this.layerSnake.draw();
    this.layerFreePart.draw();
};

Game.prototype.randomInteger = function(min, max){
    var rand = min - 0.5 + Math.random() * (max - min + 1);
    rand = Math.round(rand);
    return rand;
};

Game.prototype.createFreePart = function(){
    this.freePart = new Part(
        this.normalization(this.randomInteger(0, this.config.fieldWidth-1)),
        this.normalization(this.randomInteger(0, this.config.fieldHeight-1)),
        this.config.snakeWeight
    );
    this.layerFreePart.destroyChildren();
    this.layerFreePart.add(
        new Konva.Rect({
            x: this.freePart.x,
            y: this.freePart.y,
            width: this.freePart.weight,
            height: this.freePart.weight,
            fill: 'gray',
            stroke: 'black',
            strokeWidth: 1
        })
    );
};

Game.prototype.endGame = function(){
    if(this.snake.headX < 0 ||
        this.snake.headX >= this.normalization(this.config.fieldWidth) ||
        this.snake.headY < 0 ||
        this.snake.headY >= this.normalization(this.config.fieldHeight)){
        return true;
    }
    return false;
};

Game.prototype.run = function(){
    var gameCycle = setInterval(function(){
        this.game.snake.move();
        if(!this.game.endGame()){
            var next = this.game.snake.getNextCoordinate();
            console.log(this.game.snake.body);
            if(next[0] === this.game.freePart.x && next[1] === this.game.freePart.y){
                this.game.snake.addPart(this.game.freePart);
                this.game.createFreePart();
                console.log(this.game.snake.body);
            }
            this.game.render();
        }
        else clearInterval(gameCycle);

    }, this.velocity);
};

var game = new Game(config);
game.init();
game.run();