'use strict';

//Initial configuration
var config = {
    fieldWidth: 600,
    fieldHeight: 600,
    snakeLength: 5,
    snakeWeight: 20,
    startX: 200,
    startY: 250,
};
Object.freeze(config);
Object.seal(config);

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

Snake.prototype.changeDirection = function(direction){
    this.currentDirection = direction;
};

Snake.prototype.move = function(){
    for(var i=this.length-1; i>=0; i--){
        if(i === 0){
            this.body[i].x += this.currentDirection[0];
            this.body[i].y += this.currentDirection[1];
        }
        else{
            this.body[i].x = this.body[i-1].x;
            this.body[i].y = this.body[i-1].y;
        }
    }
};

//Class Game
var Game = function(config){
    this.config = config;
    this.field = new Field(this.config.fieldWidth, this.config.fieldHeight);
    this.snake = new Snake(this.config.snakeLength, this.config.snakeWeight, this.config.startX, this.config.startY);
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

Game.prototype.init = function(){
    this.snake.init();
    this.field.init();
    this.layer_snake = new Konva.Layer();
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

Game.prototype.run = function(){
    var gameCycle = setInterval(function(){
        game.snake.move();
        game.render();
    }, 500);
};

var game = new Game(config);
game.init();
game.run();