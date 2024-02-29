
let gameMap = [];
let gameOn = true ;
const prompt = require("prompt-sync")({ sigint: true });

initGame();

function visitSquare(coordinates){
    gameMap[coordinates.x][coordinates.y].visited = true ;
    if(gameMap[coordinates.x][coordinates.y].isMine){
        gameOver();
    }else{
        let mineCount = 0 ;
        for(let i = coordinates.x - 1 ; i <= coordinates.x + 1 ; i++){
            for(let j = coordinates.y - 1 ; j <= coordinates.y + 1 ; j++){
                if(!(i === coordinates.x && j === coordinates.y)){
                    if(!(i === -1 || i === 10 || j === -1 || j === 10)){
                        if(gameMap[i][j].isMine){
                            mineCount++ ;
                        }
                    }
                }
            }
        }
        if(mineCount === 0){
            gameMap[coordinates.x][coordinates.y].value = `O`;
            for(let i = coordinates.x - 1 ; i <= coordinates.x + 1 ; i++){
                for(let j = coordinates.y - 1 ; j <= coordinates.y + 1 ; j++){
                    if(!(i === coordinates.x && j === coordinates.y)){
                        if(!(i === -1 || i === 10 || j === -1 || j === 10)){
                            gameMap[i][j].visited ? null :  visitSquare({x:i,y:j});
                        }
                    }
                }
            }
        }else{
            gameMap[coordinates.x][coordinates.y].value = `${mineCount}`;
        }
    }
}

function youWon(){
    gameOn = false ;
    console.clear()
    printGame()
    console.log('\x1b[36m%s\x1b[0m', 'You won !!!!');
    let answer = prompt("enter y to play again : ");
    answer === "y" ? initGame() : null ;
}

function playGame (){
    console.clear()
    printGame()
    visitSquare(getCoordinates ())
}

function printGame (){
    let visitedCount = 0 ;
    const header = "x\\y ";
    process.stdout.write(header);
    for(let i = 0 ; i < 10 ; i++){
        process.stdout.write(i + " ");
    }
    console.log('');
    for(let i = 0 ; i < 10 ; i++){
        process.stdout.write(" " + i + "  ");
        for(let j = 0 ; j < 10 ; j++){
            gameMap[i][j].visited ? visitedCount++ : null ;
            if(gameOn){
                process.stdout.write(gameMap[i][j].value + ' ')
            }else{
                gameMap[i][j].isMine ? process.stdout.write('+ ') : process.stdout.write(gameMap[i][j].value + ' ');
            }
        }
        console.log('');
        if(gameOn){
            visitedCount === 90 ? youWon() :null ;
        }
    }
}

function initGame(){
    gameMap = [];
    gameOn = true ;
    for(let i = 0 ; i < 10 ; i++){
        let row = [] ;
        for(let j = 0 ; j < 10 ; j++){
            row.push({value:"." , visited :false , isMine:false});
        }
        gameMap.push(row);
    }
    let count = 0 ;
    for(;;){
        let randX = Math.floor(Math.random() * gameMap.length)
        let randY = Math.floor(Math.random() * gameMap.length)
        if(!gameMap[randX][randY].isMine){
            gameMap[randX][randY].isMine = true ;
            count++;
        }
        if(count === 10)
            break;
    }
    while(gameOn){
        playGame();
    }
}


function gameOver(){
    console.clear();
    gameOn = false ;
    printGame()
    console.log('\x1b[36m%s\x1b[0m', 'Game Over !');
    let answer = prompt("enter y to try again : ");
    answer === "y" ? initGame() : null ;
}


function getCoordinates (){
    let x="" , y = "" , checked = false;
    do{
        checked ? console.log("already checked try another one") : null ;
        do{
            x = Math.floor(+prompt("choose x : "));
        }while(!(x >= 0 && x < 10));
        do{
            y = Math.floor(+prompt("choose y : "));
        }while(!(y >= 0 && y < 10));
        checked =true ;
    }while(gameMap[x][y].visited);
    return {x:x , y:y}
}







