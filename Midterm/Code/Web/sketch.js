/**
 * RGBOP Game
 */



/*
Hardware stuff
*/

let mSerial;
let mData;

const PORT_NAME_PREFIX = "usbmodem";

const LIGHT_MAX_ACCUMULATION = 100;





let mSprite;
let mWallManager;
let mGatesPassed = 0;
let TOTAL_GATES_TO_WIN = 8;

// Up and Down Bounds
let mWallTop;
let mWallBottom;
let mLeftWall;

// let mCurrentSpriteColor = 0;

let mScoreboard;

let ColorEnum = {
    "193734413": "#3d5afe",
    "193744413": "#00c853",
    "2091904413": "#d50000",
    "2091914413": "#ffff00",
    "1451104413": "#aa00ff",
    "1451094413": "#18ffff"
};

Object.freeze(ColorEnum);


//intro, playing, win, lose
let mGameState;
let StateEnum = { "intro": 1, "playing": 2, "win": 3, "lose": 4 };
Object.freeze(StateEnum);

let CommandEnum = { "rfid": "tagId", "light1": "light1", "light2": "light2", "pot": "pot" };
Object.freeze(CommandEnum);


let mSceneCounter = 0;
let mSceneBackgrounds = [];
let mSoundtrack;

const GATE_STATE_NONE = "none";
const GATE_STATE_PASSING = "passing";
const GATE_STATE_PASSED = "passed";



function preload(){

    mSceneBackgrounds.push(loadImage('img/start.jpg'));
    mSceneBackgrounds.push(loadImage('img/story_1.jpg'));
    mSceneBackgrounds.push(loadImage('img/controls_1.jpg'));
    mSceneBackgrounds.push(loadImage('img/controls_2.jpg'));
    mSceneBackgrounds.push(loadImage('img/win.jpg'));
    mSceneBackgrounds.push(loadImage('img/try_again.jpg'));

    mSoundtrack = loadSound("sound/soundtrack.mp3");
    mSoundtrack.setLoop(true);


}


function setup() {

    mSoundtrack.play();

    mSerial = new p5.SerialPort();
    mSerial.on('list', getPortList);
    mSerial.on('data', serialEvent);



    mGameState = StateEnum.intro;
    rectMode(CENTER);
    createCanvas(windowWidth, windowHeight);
    // initializeSketch();
}


function draw() {


    switch (mGameState) {
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


function getPortList(ports) {


    let arduinoPort = ports.filter(port => port.includes(PORT_NAME_PREFIX));
    mSerial.open(arduinoPort);

}

function serialEvent() {



    //tag          tagId:#
    //pot values   pot:#
    //light1       light1:#
    //light2       light2:#

    if(mGameState != StateEnum.playing) return;

    mData = mSerial.readLine();
    if (mData.length === 0) return;
    if (!mData.includes(":")) return;

    // console.log("mData "+mData);

    let command = mData.split(":")[0];
    let value = mData.split(":")[1];

    // console.log("COMMAND:::"+command);

    switch (command) {

        case CommandEnum.rfid:
            // console.log("RFID: "+value);
            changeColor(value);
            break;

        case CommandEnum.light1:
            // console.log("Light1: "+value);
            if(value!=0)
                moveSpriteForward(value);
            break;

        case CommandEnum.light2:
            // console.log("Light2: "+value);
            if(value!=0)
                moveSpriteBackward(value);
            break;

        case CommandEnum.pot:
            // console.log("Pot: "+value);
            setSpriteVerticalSpeed(value);
            break;

    }

}


function initializeSketch() {

    this.allSprites.clear();


    


    mSprite = createSprite(200, windowHeight / 2, 20, 20);
    mSprite.setDefaultCollider();
    mSprite.shapeColor = getRandomColorFromEnum();


    mWallManager = new WallManager();
    mWallManager.addWall(new Wall(0));


    mWallTop = createSprite(windowWidth / 2, -30 / 2, windowWidth, 30);
    mWallTop.immovable = true;

    mWallBottom = createSprite(windowWidth / 2, windowHeight + 30 / 2, windowWidth, 30);
    mWallBottom.immovable = true;

    // mLeftWall = createSprite(0,-30/2,30,windowHeight);
    // mLeftWall.immovable = true;

}

keyPressed = function () {

    // console.log("KEYCODE: " + keyCode);

    switch (mGameState) {
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


function Wall(speed) {
    this.wall = createSprite(windowWidth, windowHeight / 2, 20, windowHeight);
    this.wall.velocity.x = speed;
    this.wall.shapeColor = "#1E1E1E";
    this.gateColor = getRandomColorFromEnum();
    this.gateHeight = 100;
    this.gateYPos = this.generateRandomGatePosition();
    this.gate = createSprite(windowWidth, this.gateYPos / 2, 25, this.gateHeight);
    this.gate.shapeColor = (mGatesPassed === TOTAL_GATES_TO_WIN -1)? "#1E1E1E" :this.gateColor;
    this.gate.velocity.x = speed;
    this.gateState = GATE_STATE_NONE; //"none","passing","passed"

}

Wall.prototype.getSprite = function () {
    return this.wall;
}

Wall.prototype.moveWall = function (speed) {
    this.wall.velocity.x = speed;
    this.gate.velocity.x = speed;
}

Wall.prototype.generateRandomGatePosition = function () {

    return getRandomInt(windowHeight * 2);

}


Wall.prototype.setGateState = function(state){
    this.gateState = state;
}

function WallManager() {
    this.walls = [];
    this.spaceBetweenWalls = 300;
    this.wallsSpeed = 0;
}


WallManager.prototype.addWall = function (wall) {
    this.walls.push(wall);
}

WallManager.prototype.moveWalls = function () {
    this.walls.forEach(wall => {
        wall.moveWall(this.wallsSpeed);
    });
}


WallManager.prototype.shouldCreateNewWall = function () {


    let shouldCreateNewWall = false;

    let xPositions = [];
    this.walls.forEach(wall => {
        xPositions.push(wall.wall.position.x);
    });


    let biggestX = Math.max.apply(Math, xPositions);


    if (windowWidth - biggestX >= this.spaceBetweenWalls) {
        shouldCreateNewWall = true;
    }

    return shouldCreateNewWall;

}

WallManager.prototype.updateSpeed = function (speed) {
    this.wallsSpeed = speed;
    this.moveWalls();

}


WallManager.prototype.stopEverything = function () {
    this.wallsSpeed = 0;
    this.moveWalls();
}



function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}



function showIntro() {

    mGatesPassed = 0;
    imageMode(CORNERS);
    image(mSceneBackgrounds[mSceneCounter],0,0,windowWidth,windowHeight);


}



function playGame() {

    background("#434343");
    drawSprites();

    textSize(30);
    text("Portals: "+mGatesPassed+" / "+TOTAL_GATES_TO_WIN,100,100);


    if (mWallManager.shouldCreateNewWall()) {
        mWallManager.addWall(new Wall(mWallManager.wallsSpeed));
    }

    if (mSprite.position.x > 880) {
        mSprite.velocity.x = 0;
    }

    if (mSprite.position.x < 200) {
        mSprite.velocity.x = 0;
        
    }

    let throughGate = false;

    mWallManager.walls.forEach(wall => {


        if (mSprite.overlap(wall.gate)) {
            // console.log("COllide with gate (color check)");
            throughGate = true;

            if (mSprite.shapeColor === wall.gate.shapeColor) {
                // console.log("Color check pass");                                    
                wall.setGateState(GATE_STATE_PASSING);              

            } else {
                // console.log("Color check rejected");
                mGameState = StateEnum.lose;
            }

        } else {
            
            if(wall.gateState === GATE_STATE_PASSING && isSpriteMovingForward()){
                // console.log("CLEARED");
                wall.setGateState(GATE_STATE_PASSED);
                wall.gate.shapeColor = "#1E1E1E";
                mGatesPassed++;
                if(mGatesPassed === TOTAL_GATES_TO_WIN) mGameState = StateEnum.win;
                // console.log("GATES PASSED: "+ mGatesPassed);
            }else if(wall.gateState === GATE_STATE_PASSING && !isSpriteMovingForward()){
                // console.log("reversed");
                wall.setGateState(GATE_STATE_NONE);

            }

            throughGate = false;
        }


        if (!throughGate) {
            if (mSprite.collide(wall.wall)) {
                // console.log("Collide with wall (Lose)");
                mWallManager.stopEverything();
                mSprite.velocity.x = 0;
                mGameState = StateEnum.lose;

            }
        }


    });

    if (mSprite.collide(mWallTop) || mSprite.collide(mWallBottom)) {
        mSprite.velocity.y = 0;
    }


    if (mSprite.collide(mWallTop) || mSprite.collide(mWallBottom)) {
        mSprite.velocity.y = 0;
    }

    
}


function showWin() {

    mSceneCounter = 0;
    clear();
    imageMode(CORNERS);
    image(mSceneBackgrounds[4],0,0,windowWidth,windowHeight);

}


function showLose() {
    
    mSceneCounter = 0;
    clear();
    imageMode(CORNERS);
    image(mSceneBackgrounds[5],0,0,windowWidth,windowHeight);
}




function handleKeyPressesForIntro(keyCode) {
    
    // letter a  
    if (keyCode != 65) return;
    
    if(mSceneCounter < 3){
        mSceneCounter++;
        showIntro();
        
    }else{
        clear();
        initializeSketch();
        mGameState = StateEnum.playing;
    }
    
    

}

function handleKeyPressesForPlayingGame(keyCode) {

    switch (keyCode) {
        case RIGHT_ARROW:
            if (mSprite.position.x < 880) {
                mSprite.velocity.x += 0.5;
            } else {
                mSprite.velocity.x = 0;
            }
            mWallManager.updateSpeed(-1);

            break;

        case LEFT_ARROW:
            
        // if(mGatesPassed === 0 )return;
            if (mSprite.position.x > 200) {
                mSprite.velocity.x -= 0.5;
            } else {
                mSprite.velocity.x = 0;
            }

            mWallManager.updateSpeed(1);

            break;

        case UP_ARROW:
            mSprite.velocity.y -= 0.5;
            break;

        case DOWN_ARROW:
            mSprite.velocity.y += 0.5;
            break;

        'd'
        case 68:
            // mCurrentSpriteColor++;

            // if(mCurrentSpriteColor === mColors.length)
            //     mCurrentSpriteColor = 0;

            mSprite.shapeColor = getRandomColorFromEnum();

        break;

    }

}

function handleKeyPressesForWin(keyCode) {

    if (keyCode != 65) return;
    mGameState = StateEnum.intro;

}


function handleKeyPressesForLose(keyCode) {
    if (keyCode != 65) return;
    mGameState = StateEnum.intro;
}




function changeColor(tagIdValue) {
    let color = ColorEnum[tagIdValue];
    mSprite.shapeColor = color;
}


function setSpriteVerticalSpeed(value){
    
    let speed = map(value,0,1023,-8,8);
    mSprite.velocity.y = speed;


}

function moveSpriteForward(lightValue){

    let speed = map(lightValue,0,LIGHT_MAX_ACCUMULATION,0,3);
    // console.log("MOVE FORWARD: SPEED:: "+speed);

    
    // case RIGHT_ARROW:
    if (mSprite.position.x < 880) {
        
        mSprite.velocity.x = speed;
    } else {
        mSprite.velocity.x = 0;
    }
    mWallManager.updateSpeed(-speed);
}
    

function moveSpriteBackward(lightValue){

    

    let speed = -map(lightValue,0,LIGHT_MAX_ACCUMULATION,0,3);
    // console.log("MOVE BACKWARD: SPEED:: "+speed);

    if (mSprite.position.x > 200) {
        
        mSprite.velocity.x = speed;
    } else {
        mSprite.velocity.x = 0;
    }

    mWallManager.updateSpeed(-speed);
}
// case LEFT_ARROW:



function getRandomColorFromEnum() {

    Object.keys(ColorEnum).forEach(key => {
        // console.log("KEY: " + key);
    })

    let keys = Object.keys(ColorEnum);
    let index = getRandomInt(keys.length);

    return ColorEnum[keys[index]];


}


function isSpriteMovingForward(){

    return (mSprite.velocity.x >0 || mWallManager.wallsSpeed<0) ? true:false;

}