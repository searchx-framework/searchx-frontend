/**
 * Adapted from:
 * @license HTML5 experiment Snake
 * http://www.xarg.org/project/html5-snake/
 *
 * Copyright (c) 2011, Robert Eisele (robert@xarg.org)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 **/
var interval;

exports.openSnake = function() {
    var ctx;
    var turn  = [];
    var xV = [-1, 0, 1, 0];
    var yV = [0, -1, 0, 1];
    var queue = [];
    var elements = 1;
    var map = [];
    var X = 5 + (Math.random() * (45 - 10))|0;
    var Y = 5 + (Math.random() * (30 - 10))|0;
    var direction = Math.random() * 3 | 0;
    interval = 0;
    var score = 0;
    var inc_score = 50;
    var sum = 0, easy = 0;
    var i, dir;
    var canvas = document.createElement('canvas');
    for (i = 0; i < 45; i++) {
        map[i] = [];
    }
    canvas.setAttribute('id', 'snake-canvas');
    canvas.setAttribute('width', 45 * 10);
    canvas.setAttribute('height', 30 * 10);
    ctx = canvas.getContext('2d');
    document.getElementById('snake-container').appendChild(canvas);
    function placeFood() {
        var x, y;
        do {
            x = Math.random() * 45|0;
            y = Math.random() * 30|0;
        } while (map[x][y]);
        map[x][y] = 1;
        ctx.strokeRect(x * 10 + 1, y * 10 + 1, 10 - 2, 10 - 2);
    }
    placeFood();
    function clock() {
        if (easy) {
            X = (X+45)%45;
            Y = (Y+30)%30;
        }
        --inc_score;
        if (turn.length) {
            dir = turn.pop();
            if ((dir % 2) !== (direction % 2)) {
                direction = dir;
            }
        }
        if (
            (easy || (0 <= X && 0 <= Y && X < 45 && Y < 30))
            && 2 !== map[X][Y]) {
            if (1 === map[X][Y]) {
                score+= Math.max(5, inc_score);
                inc_score = 50;
                placeFood();
                elements++;
            }
            ctx.fillRect(X * 10, Y * 10, 10 - 1, 10 - 1);
            map[X][Y] = 2;
            queue.unshift([X, Y]);
            X+= xV[direction];
            Y+= yV[direction];
            if (elements < queue.length) {
                dir = queue.pop();
                map[dir[0]][dir[1]] = 0;
                ctx.clearRect(dir[0] * 10, dir[1] * 10, 10, 10);
            }
        } else if (!turn.length) {
            window.clearInterval(interval);
            const scoreParagraph = document.createElement('p');
            scoreParagraph.setAttribute('id', 'score-paragraph');
            const scoreText = document.createTextNode("Your Score is " + score + ". Play again?");
            scoreParagraph.appendChild(scoreText);
            const restartButton = document.createElement('button');
            restartButton.setAttribute('id', 'restart-button');
            const restartText = document.createTextNode("Restart");
            restartButton.appendChild(restartText);
            restartButton.setAttribute('class', 'btn btn-default');
            const snakeContainer = document.getElementById('snake-container');
            snakeContainer.appendChild(scoreParagraph);
            snakeContainer.appendChild(restartButton);
            const confirm = function () {
                snakeContainer.removeChild(scoreParagraph);
                snakeContainer.removeChild(restartButton);
                interval = window.setInterval(clock, 60);
                ctx.clearRect(0, 0, 450, 300);
                queue = [];
                elements = 1;
                map = [];
                X = 5 + (Math.random() * (45 - 10))|0;
                Y = 5 + (Math.random() * (30 - 10))|0;
                direction = Math.random() * 3 | 0;
                score = 0;
                inc_score = 50;
                for (i = 0; i < 45; i++) {
                    map[i] = [];
                }
                placeFood();
            };
            restartButton.onclick = confirm;
        }
    }
    interval = window.setInterval(clock, 60);
    document.onkeydown = function(e) {
        var code = e.keyCode - 37;
        /*
         * 0: left
         * 1: up
         * 2: right
         * 3: down
         **/
        if (0 <= code && code < 4 && code !== turn[0]) {
            turn.unshift(code);
        } else if (-5 === code) {
            if (interval) {
                window.clearInterval(interval);
                interval = null;
            } else {
                interval = window.setInterval(clock, 60);
            }
        } else { 
            dir = sum + code;
            if (dir === 44||dir===94||dir===126||dir===171) {
                sum+= code
            } else if (dir === 218) easy = 1;
        }
    }
};

exports.closeSnake = function () {
    const snakeCanvas = document.getElementById('snake-canvas');
    const scoreParagraph = document.getElementById('score-paragraph');
    const restartButton = document.getElementById('restart-button');
    const snakeContainer = document.getElementById('snake-container');
    window.clearInterval(interval);
    document.onkeydown = null;
    if (snakeCanvas) {
        snakeContainer.removeChild(snakeCanvas);
    }
    if (scoreParagraph) {
        snakeContainer.removeChild(scoreParagraph);
    }
    if (restartButton) {
        snakeContainer.removeChild(restartButton);
    }
};