let mSprite;
let mRangeInput;
let mWall;


function setup(){

    createCanvas(windowWidth,windowHeight);
    mSprite = createSprite(windowWidth/2,windowHeight/2,20,20);
    mWall = createSprite(800,0,20,windowHeight);

}

function draw(){

    background("#EcEcEc");
    drawSprites();


    if(mSprite.collide(mWall)){
        console.log("Crash");
    }

    

}



function keyPressed(){

    switch(keyCode){
        case RIGHT_ARROW:
            mSprite.velocity.x +=0.5;
        break;

        case LEFT_ARROW:
            mSprite.velocity.x -= 0.5;
        break;

        case UP_ARROW:
            mSprite.velocity.y -= 0.5;
        break;

        case DOWN_ARROW:
            mSprite.velocity.y += 0.5;
        break;


    }

}



