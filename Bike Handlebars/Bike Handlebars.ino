#include <CapacitiveSensor.h>



//Capative couples
CapacitiveSensor cs_11_13 = CapacitiveSensor(11, 13);
CapacitiveSensor cs_11_9 = CapacitiveSensor(11, 9);


//Outout leds
int LED1 = 2;
int LED2 = 3;
int LED3 = 4;
int LED4 = 5;



void setup() {

  //  This is supposed to turn off autocalibration, needs better testing
  cs_11_13.set_CS_AutocaL_Millis(0xFFFFFFFF);
  cs_11_9.set_CS_AutocaL_Millis(0xFFFFFFFF);
  Serial.begin(9600);


  //  no need to declare capacitive pins, thats taken care for us in the library
  pinMode(LED1,OUTPUT);
  pinMode(LED2,OUTPUT);
  pinMode(LED3,OUTPUT);
  pinMode(LED4,OUTPUT);

}

void loop() {


  long start = millis();
  
  // get the reading. Average 30 samples per loop()  
  long total1 =  cs_11_13.capacitiveSensor(30);
  long total2 = cs_11_9.capacitiveSensor(30);
  

  // turn on the leds if either of the sensors is being touched. 300 seemed like a reasonable threshold after some tests
  if(total1 > 300 || total2 > 300){
    digitalWrite(LED1,HIGH);
    digitalWrite(LED2,HIGH);
    digitalWrite(LED3,HIGH);
    digitalWrite(LED4,HIGH);
  }else{
    digitalWrite(LED1,LOW);
    digitalWrite(LED2,LOW);
    digitalWrite(LED3,LOW);
    digitalWrite(LED4,LOW);
  }


  Serial.print(millis() - start);        
  Serial.print("\t");
  Serial.println(total1);
  Serial.print("\t");                    
  Serial.println(total2);                    
                            

}
