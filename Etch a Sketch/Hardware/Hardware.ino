/**

   Author: David Azar
   davidazar.mx
   October 2018
   ITP Tisch School of the Arts


   [Etch a Sketch]

*/


int xPot = A5;
int yPot = A4;


int brushSizeDecreaseButton = 5;
int brushSizeIncreaseButton = 6;
int brushColorDecreaseButton = 7;
int brushColorIncreaseButton = 8;
int brushPaintToggleButton = 9;

bool brushSizeIncreaseButtonPreviousState = LOW;
bool brushSizeDecreaseButtonPreviousState = LOW;
bool brushColorIncreaseButtonPreviousState = LOW;
bool brushColorDecreaseButtonPreviousState = LOW;
bool brushPaintToggleButtonPreviousState = LOW;


const int BRUSH_SIZE_UP = 0;
const int BRUSH_SIZE_DOWN = 1;
const int BRUSH_TOGGLE = 2;
const int BRUSH_COLOR_UP = 3;
const int BRUSH_COLOR_DOWN = 4;


int xPos;
int yPos;


int accumXpos = 0;
int accumYpos = 0;

const int MEASUREMENTS_FOR_READING = 60;

void setup() {

  Serial.begin(9600);
  pinMode(xPot, INPUT);
  pinMode(yPot, INPUT);

  pinMode(brushSizeIncreaseButton, INPUT);
  pinMode(brushSizeDecreaseButton, INPUT);
  pinMode(brushColorIncreaseButton, INPUT);
  pinMode(brushColorDecreaseButton, INPUT);
  pinMode(brushPaintToggleButton, INPUT);



}

void loop() {




  if (brushSizeIncreaseButtonPreviousState == LOW) {
    if (digitalRead(brushSizeIncreaseButton) == HIGH) {
      brushSizeIncreaseButtonPreviousState = HIGH;
      Serial.write(BRUSH_SIZE_UP);
    }
  } else {
    brushSizeIncreaseButtonPreviousState = digitalRead(brushSizeIncreaseButton);
  }


  if (brushSizeDecreaseButtonPreviousState == LOW) {
    if (digitalRead(brushSizeDecreaseButton) == HIGH) {
      brushSizeDecreaseButtonPreviousState = HIGH;
      Serial.write(BRUSH_SIZE_DOWN);
    }
  } else {
    brushSizeDecreaseButtonPreviousState = digitalRead(brushSizeDecreaseButton);
  }





  if (brushColorIncreaseButtonPreviousState == LOW) {
    if (digitalRead(brushColorIncreaseButton) == HIGH) {
      brushColorIncreaseButtonPreviousState = HIGH;
      //      Serial.println("Brush Color Up");
      Serial.write(BRUSH_COLOR_UP);
    }
  } else {
    brushColorIncreaseButtonPreviousState = digitalRead(brushColorIncreaseButton);
  }


  if (brushColorDecreaseButtonPreviousState == LOW) {
    if (digitalRead(brushColorDecreaseButton) == HIGH) {
      brushColorDecreaseButtonPreviousState = HIGH;
      //      Serial.println("Brush Color Down");
      Serial.write(BRUSH_COLOR_DOWN);
    }
  } else {
    brushColorDecreaseButtonPreviousState = digitalRead(brushColorDecreaseButton);
  }


  if (brushPaintToggleButtonPreviousState == LOW) {
    if (digitalRead(brushPaintToggleButton) == HIGH) {
      brushPaintToggleButtonPreviousState = HIGH;
      //      Serial.println("Brush Toggle");
      Serial.write(BRUSH_TOGGLE);
    }
  } else {
    brushPaintToggleButtonPreviousState = digitalRead(brushPaintToggleButton);
  }

    

//    xPos = map(analogRead(xPot)/4,0,255,10,122);
//    yPos = map(analogRead(yPot)/4,0,255,123,245);


    
    for(int i = 0; i<MEASUREMENTS_FOR_READING;i++){
      accumXpos += map(analogRead(xPot)/4,0,255,10,170);
      accumYpos += map(analogRead(yPot)/4,0,255,171,255);
    }

    xPos = accumXpos/MEASUREMENTS_FOR_READING;
    yPos = accumYpos/MEASUREMENTS_FOR_READING;
    
    Serial.write(xPos);
    Serial.write(yPos);

    accumXpos = 0;
    accumYpos = 0;

//    Serial.write(analogRead(analogPin)/4);

//  delay(500);






}
