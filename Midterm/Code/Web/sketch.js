let mSprite;
let mWallManager;


// Up and Down Bounds
let mWallTop;
let mWallBottom;

// 
let mColors = ["#F57F22","#E5043A","#3A75C4","#007A3D","#D8DDCD","#FFED38"];
let mCurrentSpriteColor = 0;

function setup(){

    rectMode(CENTER);
    createCanvas(windowWidth,windowHeight);
    mSprite = createSprite(200,windowHeight/2,20,20);
    
    mSprite.setDefaultCollider();
    mSprite.shapeColor = mColors[mCurrentSpriteColor];
    

    mWallManager = new WallManager();
    mWallManager.addWall(new Wall(0));


    mWallTop = createSprite(windowWidth/2, -30/2, windowWidth, 30);
    mWallTop.immovable = true;

    mWallBottom = createSprite(windowWidth/2, windowHeight+30/2, windowWidth, 30);
    mWallBottom.immovable = true;

  


}

function draw(){

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



    let colission = false;
    let throughGate = false;
    
    mWallManager.walls.forEach(wall =>{
        
        
        if(mSprite.overlap(wall.gate)){
            console.log("COllide with gate (color check)");
            throughGate = true;

            if(mSprite.shapeColor === wall.gate.shapeColor){
                console.log("Color check pass");
            }else{
                console.log("Color check rejected");
            }

        }else{
            throughGate = false;
        }
        
        
        if(!throughGate){
            if(mSprite.collide(wall.wall)){
                console.log("Collide with wall (Lose)");
                mWallManager.stopEverything();
                mSprite.velocity.x = 0;

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



function keyPressed(){


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
    }
}




function Wall(speed){
    this.wall = createSprite(windowWidth,windowHeight/2,20,windowHeight);
    this.wall.velocity.x = speed;
    this.wall.shapeColor = "#1E1E1E";
    this.gateColor = mColors[getRandomInt(mColors.length-1)];
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
    // this.walls.forEach(wall=>{
    //     wall.velocity.x = 0;
    // })
}



function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }