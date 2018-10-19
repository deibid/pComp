let mSprite;
let mRangeInput;


function setup(){

    createCanvas(windowWidth,windowHeight);
    mSprite = createSprite(windowWidth/2,windowHeight/2,20,20);
    mRangeInput = document.getElementById("range-input");
    mRangeInput.oninput = inputChange;

}

function draw(){

    background("#EcEcEc");
    drawSprites();

}


function inputChange(target){
    

    let value = mRangeInput.value;
    console.log("INPUT:> " + mRangeInput.value);
    mSprite.velocity.x = value;

    

}

