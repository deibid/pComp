let mSerial;
let mData;

const PORT_NAME = "/dev/cu.usbmodem1411";

const BRUSH_SIZE_UP = 0;
const BRUSH_SIZE_DOWN = 1;
const BRUSH_TOGGLE = 2;
const BRUSH_COLOR_UP = 3;
const BRUSH_COLOR_DOWN = 4;

const MAX_BRUSH_SIZE = 60;
const MIN_BRUSH_SIZE = 6;

let mCurrentBrushSize = 9;
let mCurrentBrushColor = 0;
let mShouldPaint = false;
let mXpos;
let mYpos;


// Material Design colors palette - 800 Series
let mColors = ["#424242","#d84315","#ef6c00","#ff8f00","#f9a825",
"#9e9d24","#558b2f","#2e7d32","#00838f","#00695c","#0277bd","#1565c0","#283593"
,"#4527a0","#6a1b9a","#ad1457","#c62828"];


function setup(){
    
    // Crear objecto de serial.
    mSerial = new p5.SerialPort();
    mSerial.on('list',printList);
    mSerial.open(PORT_NAME);
    mSerial.on('data',serialEvent);

    mXpos = windowWidth/2;
    mpos = windowHeight/2;


    createCanvas(windowWidth,windowHeight);
    fill("#FFFFFF");
    strokeWeight(0);

}


function draw(){
    
    
    
    // push();
    // fill(mColors[mCurrentBrushColor]);
    // ellipse(mXpos,mYpos,mCurrentBrushSize);

    // push();
    fill(mColors[mCurrentBrushColor]);
    rect(mXpos,mYpos,mCurrentBrushSize,mCurrentBrushSize);
    // pop();
    // pop();


}


function printList(ports){

    ports.forEach(port => {
        console.log("Port:> "+port); 
    });

}


function serialEvent(){

    let data = Number(mSerial.read());
    parseData(data);

}


function parseData(data){
    
    if(data === BRUSH_SIZE_UP){
        if(mCurrentBrushSize < MAX_BRUSH_SIZE){
            mCurrentBrushSize +=3;
        }
    }else if(data === BRUSH_SIZE_DOWN){
        if(mCurrentBrushSize > MIN_BRUSH_SIZE){
            mCurrentBrushSize -=3;
        }
    }else if(data === BRUSH_COLOR_UP){
        if(mCurrentBrushColor < mColors.length-1){
            mCurrentBrushColor++;
        }
    }else if(data === BRUSH_COLOR_DOWN){
        if(mCurrentBrushColor > 0){
            mCurrentBrushColor --;
        }
    }else if(data >= 10 && data <=170){
        // mXpos = windowWidth - map(data,10,122,0,windowWidth);
        mXpos =  windowWidth - map(data,10,170,0,windowWidth);

    }else if(data >=171 && data <=255){

        mYpos = map(data,171,255,0,windowHeight);
    }


}

function isNoise(previousData,newData){
    if(Math.abs(previousData - newData) > 10)return true;
}