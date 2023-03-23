let lastPaintTime=0;
let snake_speed=2;
let inputDirection={x:-1,y:0};
let lastInputDirection = inputDirection;
let score = 0;
const expansion_amount=1;
const snakeBody=[
    {x:20,y:16},
    {x:21,y:16},
    {x:22,y:16}
];
let food=getFoodRandomPosition();

const gameBoard = document.querySelector(".game-board");
const scoreBox = document.getElementById("scoreID");
function paint(currentTime){
    var timeSeconds=(currentTime-lastPaintTime)/1000;
    requestAnimationFrame(paint);
    if(timeSeconds<1/snake_speed) return;
    lastPaintTime=currentTime;

    update();
    draw();
}

window.requestAnimationFrame(paint);


function draw(){
    drawSnake();
    drawFood();
}

function update(){
    gameBoard.innerHTML = "";
    snakeMove();
    snakeEatFood();
}

function drawSnake(){
    snakeBody.forEach((segment,index)=>{
        var snakeElement=document.createElement("div");
        snakeElement.style.gridColumnStart = segment.x;
        snakeElement.style.gridRowStart=segment.y;
        snakeElement.style.transform="rotate(0deg)"

        if(index==0){
            snakeElement.classList.add("head");
            if(inputDirection.x==1){
                snakeElement.style.transform="rotate(-90deg)"
            }
            else if(inputDirection.x==-1){
                snakeElement.style.transform="rotate(90deg)"
            }
            if(inputDirection.y==1){
                snakeElement.style.transform="rotate(0deg)"
            }
            if(inputDirection.y==-1){
                snakeElement.style.transform="rotate(-180deg)"
            }
        }
        else{
            snakeElement.classList.add("snake");
        }
        gameBoard.appendChild(snakeElement);
    });
}

function drawFood(){
    var foodElement=document.createElement("div");
        foodElement.style.gridColumnStart = food.x;
        foodElement.style.gridRowStart=food.y;
        foodElement.classList.add("food");
        gameBoard.appendChild(foodElement);
}

function snakeMove(){
    inputDirection=getInputDirection();

    for(i=snakeBody.length-2;i>=0;i--){
        snakeBody[i+1]={...snakeBody[i]};
    }

    snakeBody[0].x += inputDirection.x;
    snakeBody[0].y += inputDirection.y;
    checkGameOver();
}

function getInputDirection(){
    window.addEventListener("keydown",e=>{
        switch(e.key){
            case 'ArrowUp' : 
            if(lastInputDirection.y==1) break;
            inputDirection = {x:0,y:-1};
            break;
            case 'ArrowDown' : 
            if(lastInputDirection.y==-1) break;
            inputDirection = {x:0,y:1};
            break;
            case 'ArrowLeft' : 
            if(lastInputDirection.x==1) break;
            inputDirection = {x:-1,y:0};
            break;
            case 'ArrowRight' :
            if(lastInputDirection.x==-1) break;
            inputDirection = {x:1,y:0};
            break;
            default : inputDirection = {x:0,y:0};
        }
    })
    lastInputDirection=inputDirection;
    return inputDirection;
}

function snakeEatFood(){
    if(isEat()){
        score+=10;
        scoreBox.innerHTML=score;
        food=getFoodRandomPosition();
        expandSnake();
        snake_speed+=0.5;
    }
}

function isEat(){
    return food.x == snakeBody[0].x && food.y == snakeBody[0].y;
}

function getFoodRandomPosition(){
    let a,b,cond=true;
    while(cond){
        a=Math.ceil(Math.random()*25);
        b=Math.ceil(Math.random()*25);

        cond=snakeBody.some(segment=>{
            return segment.x==a && segment.y==b;
        })
    }
    return {x:a,y:b};
}

function expandSnake(){
    snakeBody.push(snakeBody[snakeBody.length-1]);
}

function checkGameOver(){
    if(outOfGrid() || intersection()){
        location.reload();
        alert("Game Over !");
    }
}

function outOfGrid(){
    if(snakeBody[0].x<0 || snakeBody[0].x>25 || snakeBody[0].y<0 || snakeBody[0].y>25){
        return true;
    }
}

function intersection(){
    for(i=1;i<snakeBody.length;i++){
        if(snakeBody[0].x == snakeBody[i].x && snakeBody[0].y == snakeBody[i].y){
            return true;
        }
    }
}