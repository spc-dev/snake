'use strict';

var config = {};

//Initial configuration
Object.defineProperties(config, {
    fieldWidth: {
        value: 600,
        writable: false,
        configurable: false
    },
    fieldHeight: {
        value: 600,
        writable: false,
        configurable: false
    },
    snakeLength: {
        value: 3,
        writable: false,
        configurable: false
    },
    snakeWeight: {
        value: 20,
        writable: false,
        configurable: false
    },
    startX: {
        value: 200,
        writable: false,
        configurable: false
    },
    startY: {
        value: 250,
        writable: false,
        configurable: false
    },
});

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
    this.startX = startX;
    this.startY = startY;
    this.body = [];
};

Snake.prototype.init = function(){
    for(var i=0; i<this.length; i++){
        this.body[i] = new Part(this.startX, this.startY+=this.weight, this.weight);
    }
};

//Class Game
var Game = function(config){
    this.config = config;
    this.field = new Field(this.config.fieldWidth, this.config.fieldHeight);
    this.snake = new Snake(this.config.snakeLength, this.config.snakeWeight, this.config.startX, this.config.startY);
};

Game.prototype.init = function(){
    this.snake.init();
    this.field.init();
    this.layer_snake = new Konva.Layer();
};

Game.prototype.render = function(){
    this.layer_snake.destroyChildren();

    for(var i=0; i<this.snake.length; i++){
        this.layer_snake.add(
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
    this.field.canvas.add(this.layer_snake);
    this.layer_snake.draw();
};

Game.prototype.createPart = function(){

};


var game = new Game(config);
game.init();
var gameCycle = setInterval(function(){
    game.snake.startY += 1;
    game.snake.init();
    console.log(game.snake.startY);
    game.render();
}, 500);