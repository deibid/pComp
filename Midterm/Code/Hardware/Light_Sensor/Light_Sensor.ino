

const int LIGHT_SENSOR_1 = A0;
const int LIGHT_INTENSITY_THRESHOLD = 800;



int loopCount = 0;
int loopSampleRate = 10;

long accumulator = 0;




void setup() {
  // put your setup code here, to run once:
  pinMode(LIGHT_SENSOR_1, INPUT);

  Serial.begin(9600);

}

void loop() {
  // put your main code here, to run repeatedly:


  if (loopCount % loopSampleRate == 0) {
    
    int lightValue1 = analogRead(LIGHT_SENSOR_1);
    Serial.println(lightValue1);

    if (lightValue1 > LIGHT_INTENSITY_THRESHOLD) {
      
      if(accumulator < 500) accumulator++;
      
    }else{
      if(accumulator > 0) accumulator--;
    }

//    Serial.println(accumulator);
    loopCount = 0;
  }


  loopCount++;

}
