/**
 * RGBOP Game
 */



/*
Hardware stuff
*/

let mSerial;
let mData;

const PORT_NAME_PREFIX = "usbmodem";





let mSprite;
let mWallManager;


// Up and Down Bounds
let mWallTop;
let mWallBottom;

// 
// let mColors = ["#3d5afe","#00c853","#d50000","#ffff00","#aa00ff","#FFED38"];
let mCurrentSpriteColor = 0;

let ColorEnum = {
    "193734413":"#3d5afe",
    "193744413":"#00c853",
    "2091904413":"#d50000",
    "2091914413":"#ffff00",
    "1451104413":"#aa00ff",
    "1451094413":"#18ffff"};

Object.freeze(ColorEnum);


//intro, playing, win, lose
let mGameState;
let StateEnum = {"intro":1,"playing":2,"win":3,"lose":4};
Object.freeze(StateEnum);

let CommandEnum = {"rfid":"tagId","light1":"light1","light2":"light2","pot":"pot"};
Object.freeze(CommandEnum);





function setup(){
    
    

    mSerial = new p5.SerialPort();
    mSerial.on('list',getPortList);
    mSerial.on('data',serialEvent);



    mGameState = StateEnum.intro;
    rectMode(CENTER);
    createCanvas(windowWidth,windowHeight);
    // initializeSketch();
}


function draw(){


    switch(mGameState){
        case StateEnum.intro:
        showIntro();
        break;

        case StateEnum.playing:
        playGame();
        break;

        case StateEnum.win:
        showWin();
        break;

        case StateEnum.lose:
        showLose();
        break;
    }
        

}


function getPortList(ports){
    
    
    let arduinoPort = ports.filter(port => port.includes(PORT_NAME_PREFIX));
    mSerial.open(arduinoPort);

}

function serialEvent(){



    //tag          tagId:#
    //pot values   pot:#
    //light1       light1:#
    //light2       light2:#
    
    
    mData = mSerial.readLine();
    if(mData.length === 0)return;
    if(!mData.includes(":"))return;

    // console.log("mData "+mData);
    
    let command = mData.split(":")[0];
    let value = mData.split(":")[1];

    // console.log("COMMAND:::"+command);

    switch(command){

        case CommandEnum.rfid:
            // console.log("RFID: "+value);
            changeColor(value);
        break;
        
        case CommandEnum.light1:
            // console.log("Light1: "+value);
        break;

        case CommandEnum.light2:
            // console.log("Light2: "+value);
        break;

        case CommandEnum.pot:
            // console.log("Pot: "+value);
        break;

    }

}


function initializeSketch(){
    
    this.allSprites.clear();
    

    
    mSprite = createSprite(200,windowHeight/2,20,20);
    mSprite.setDefaultCollider();
    mSprite.shapeColor = getRandomColorFromEnum();
    

    mWallManager = new WallManager();
    mWallManager.addWall(new Wall(0));


    mWallTop = createSprite(windowWidth/2, -30/2, windowWidth, 30);
    mWallTop.immovable = true;

    mWallBottom = createSprite(windowWidth/2, windowHeight+30/2, windowWidth, 30);
    mWallBottom.immovable = true;
}

keyPressed = function(){

    console.log("KEYCODE: "+keyCode);

    switch(mGameState){
        case StateEnum.intro:
        handleKeyPressesForIntro(keyCode);
        break;

        case StateEnum.playing:
        handleKeyPressesForPlayingGame(keyCode);
        break;

        case StateEnum.win:
        handleKeyPressesForWin(keyCode);
        break;

        case StateEnum.lose:
        handleKeyPressesForLose(keyCode);
        break;
    }

    
}




function Wall(speed){
    this.wall = createSprite(windowWidth,windowHeight/2,20,windowHeight);
    this.wall.velocity.x = speed;
    this.wall.shapeColor = "#1E1E1E";
    this.gateColor = getRandomColorFromEnum();
    this.gateHeight = 100;
    this.gateYPos = this.generateRandomGatePosition();
    this.gate = createSprite(windowWidth,this.gateYPos/2,25,this.gateHeight);
    this.gate.shapeColor = this.gateColor;
    this.gate.velocity.x = speed;

}

Wall.prototype.getSprite = function(){
    return this.wall;
}

Wall.prototype.moveWall = function(speed){
    this.wall.velocity.x = speed;
    this.gate.velocity.x = speed;
}

Wall.prototype.generateRandomGatePosition = function(){

    return getRandomInt(windowHeight*2);

}



function WallManager(){
    this.walls = [];
    this.spaceBetweenWalls = 300;
    this.wallsSpeed = 0;
}


 WallManager.prototype.addWall = function(wall){
     this.walls.push(wall);
 }

WallManager.prototype.moveWalls = function(){
    this.walls.forEach(wall => {
        wall.moveWall(this.wallsSpeed);
    });
}


WallManager.prototype.shouldCreateNewWall = function(){

    
    let shouldCreateNewWall = false;
    
    let xPositions = [];
    this.walls.forEach(wall=>{
        xPositions.push(wall.wall.position.x);
    });

    
    let biggestX = Math.max.apply(Math, xPositions);
    

    if(windowWidth - biggestX >= this.spaceBetweenWalls){
        shouldCreateNewWall = true;
    }

    return shouldCreateNewWall;

}

WallManager.prototype.updateSpeed = function(delta){
    this.wallsSpeed += delta;
    this.moveWalls();

}


WallManager.prototype.stopEverything = function(){
    this.wallsSpeed = 0;
    this.moveWalls();
}



function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }



  function showIntro(){

    background(0,200,0);
    text("Introduction", 500,200);
    text("press s",300,600);

  }



  function playGame(){

    background("#EcEcEc");
    drawSprites();

    

    if(mWallManager.shouldCreateNewWall()){
        mWallManager.addWall(new Wall(mWallManager.wallsSpeed));
    }

    if(mSprite.position.x > 880){
        mSprite.velocity.x =0;
    }

    if(mSprite.position.x < 200){
        mSprite.velocity.x =0;
    }

    let throughGate = false;
    
    mWallManager.walls.forEach(wall =>{
        
        
        if(mSprite.overlap(wall.gate)){
            console.log("COllide with gate (color check)");
            throughGate = true;

            if(mSprite.shapeColor === wall.gate.shapeColor){
                console.log("Color check pass");
            }else{
                console.log("Color check rejected");
                mGameState = StateEnum.lose;
            }

        }else{
            throughGate = false;
        }
        
        
        if(!throughGate){
            if(mSprite.collide(wall.wall)){
                console.log("Collide with wall (Lose)");
                mWallManager.stopEverything();
                mSprite.velocity.x = 0;
                mGameState = StateEnum.lose;

            }
        }


    });

    if(mSprite.collide(mWallTop) || mSprite.collide(mWallBottom)){
        mSprite.velocity.y = 0;
    }


    if(mSprite.collide(mWallTop) || mSprite.collide(mWallBottom)){
        mSprite.velocity.y = 0;
    }
  }


  function showWin(){
      clear();
      background(100,5,20);
      text("You win baby", 300,300);
      text("press s",300,600);
      
  }


  function showLose(){
      clear();
      background(0);
      fill(255);
      text("You lose",300,300);

      text("press s",300,600);
  }




  function handleKeyPressesForIntro(keyCode){

    if(keyCode != 83) return;
    clear();
    initializeSketch();
    mGameState = StateEnum.playing;

  }

  function handleKeyPressesForPlayingGame(keyCode){

    switch(keyCode){
        case RIGHT_ARROW:
            if(mSprite.position.x < 880){
                mSprite.velocity.x +=0.5;
            }else{
                mSprite.velocity.x = 0;
            }
            mWallManager.updateSpeed(-0.5);
            
        break;

        case LEFT_ARROW:

            if(mSprite.position.x >200){
                mSprite.velocity.x -=0.5;
            }else{
                mSprite.velocity.x = 0;
            }
         
            mWallManager.updateSpeed(0.5);
            
        break;

        case UP_ARROW:
            mSprite.velocity.y -= 0.5;
        break;

        case DOWN_ARROW:
            mSprite.velocity.y += 0.5;
        break;

        // 'd'
        // case 68:
        //     mCurrentSpriteColor++;
            
        //     if(mCurrentSpriteColor === mColors.length)
        //         mCurrentSpriteColor = 0;

        //     mSprite.shapeColor = mColors[mCurrentSpriteColor];

        // break;
        
    }

  }

  function handleKeyPressesForWin(keyCode){
    
    if(keyCode != 83) return;
    mGameState = StateEnum.intro;
    
  }


  function handleKeyPressesForLose(keyCode){
    if(keyCode != 83) return;
    mGameState = StateEnum.intro;
  }

  

  
function changeColor(tagIdValue){


    let color = ColorEnum[tagIdValue];

    console.log("COLOR VALUEEEEEE "+color);
    mSprite.shapeColor = color;

}



function getRandomColorFromEnum(){

    Object.keys(ColorEnum).forEach(key=>{
        console.log("KEY: "+key);
    })
    
    let keys = Object.keys(ColorEnum);
    let index = getRandomInt(keys.length);

    return ColorEnum[keys[index]];
    

}