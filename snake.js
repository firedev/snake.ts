"use strict";
let width;
let height;
let tileSize = 20;
let canvas;
let ctx;
let food;
let snake;
let interval;
let fps = 10;
let score = 0;
let isPaused = false;
function spawnLocation() {
    const rows = width / tileSize;
    const cols = height / tileSize;
    const x = Math.floor(Math.random() * rows) * tileSize;
    const y = Math.floor(Math.random() * cols) * tileSize;
    return { x, y };
}
function init() {
    width = tileSize * Math.floor(window.innerWidth / tileSize);
    height = tileSize * Math.floor(window.innerHeight / tileSize);
    canvas = document.getElementById('game');
    canvas.width = width;
    canvas.height = height;
    ctx = canvas.getContext('2d');
    food = new Food(spawnLocation(), 'red');
    snake = new Snake(spawnLocation(), 'green');
    console.log(food.draw());
    console.log(snake.draw());
}
function showScore() {
    ctx.textAlign = 'center';
    ctx.font = '16px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText(`SCORE ${score}`, width - 100, 24);
}
function showPaused() {
    ctx.textAlign = 'center';
    ctx.font = '32px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText(`PAUSE`, width / 2, height / 2);
}
function update() {
    if (isPaused)
        return;
    snake.border();
    if (snake.die()) {
        alert('Game over');
        clearInterval(interval);
        window.location.reload();
    }
    if (snake.eat()) {
        food = new Food(spawnLocation(), 'red');
        score += 10;
    }
    ctx.clearRect(0, 0, width, height);
    food.draw();
    snake.draw();
    snake.move();
    showScore();
}
function game() {
    init();
    interval = setInterval(update, 1000 / fps);
    window.addEventListener('keydown', function (evt) {
        console.log(evt.key);
        if (evt.key === ' ' || evt.key === 'Escape') {
            evt.preventDefault();
            isPaused = !isPaused;
            showPaused();
        }
        else if (evt.key === 'ArrowUp') {
            evt.preventDefault();
            if (snake.velY != 1 &&
                snake.x >= 0 &&
                snake.x <= width &&
                snake.y >= 0 &&
                snake.y <= height)
                snake.dir(0, -1);
        }
        else if (evt.key === 'ArrowDown') {
            evt.preventDefault();
            if (snake.velY != -1 &&
                snake.x >= 0 &&
                snake.x <= width &&
                snake.y >= 0 &&
                snake.y <= height)
                snake.dir(0, 1);
        }
        else if (evt.key === 'ArrowLeft') {
            evt.preventDefault();
            if (snake.velX != 1 &&
                snake.x >= 0 &&
                snake.x <= width &&
                snake.y >= 0 &&
                snake.y <= height)
                snake.dir(-1, 0);
        }
        else if (evt.key === 'ArrowRight') {
            evt.preventDefault();
            if (snake.velX != -1 &&
                snake.x >= 0 &&
                snake.x <= width &&
                snake.y >= 0 &&
                snake.y <= height)
                snake.dir(1, 0);
        }
    });
}
class Snake {
    constructor(pos, color) {
        this.x = pos.x;
        this.y = pos.y;
        this.color = color;
        this.velX = 1;
        this.velY = 0;
        this.tail = [
            { x: pos.x - tileSize, y: pos.y },
            { x: pos.x - tileSize * 2, y: pos.y },
        ];
    }
    draw() {
        ctx.beginPath();
        ctx.rect(this.x, this.y, tileSize, tileSize);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.closePath();
        this.tail.map(({ x, y }) => {
            ctx.beginPath();
            ctx.rect(x, y, tileSize, tileSize);
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 3;
            ctx.stroke();
            ctx.closePath();
        });
    }
    move() {
        if (this.tail.length > 0) {
            this.tail = [{ x: this.x, y: this.y }, ...this.tail.slice(0, -1)];
        }
        this.x += this.velX * tileSize;
        this.y += this.velY * tileSize;
    }
    dir(dirX, dirY) {
        this.velX = dirX;
        this.velY = dirY;
    }
    eat() {
        if (Math.abs(this.x - food.x) < tileSize &&
            Math.abs(this.y - food.y) < tileSize) {
            this.tail = this.tail.concat(this.tail.slice(-1));
            return true;
        }
        return false;
    }
    die() {
        if (this.tail.find(({ x, y }) => Math.abs(this.x - x) < tileSize && Math.abs(this.y - y) < tileSize)) {
            return true;
        }
        return false;
    }
    border() {
        if ((this.x + tileSize > width && this.velX != -1) ||
            (this.x < 0 && this.velX != 1))
            this.x = width - this.x;
        else if ((this.y + tileSize > height && this.velY != -1) ||
            (this.y < 0 && this.velY != 1))
            this.y = height - this.y;
    }
}
class Food {
    constructor(pos, color) {
        this.x = pos.x;
        this.y = pos.y;
        this.color = color;
    }
    draw() {
        ctx.beginPath();
        ctx.rect(this.x, this.y, tileSize, tileSize);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.closePath();
    }
}
window.addEventListener('load', game);
