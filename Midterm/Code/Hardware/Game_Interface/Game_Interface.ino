#include <AddicoreRFID.h>
#include <SPI.h>


//shorthand for unsigned int and char. makes initialiazations faster.. a bit of overkill if you ask me
#define uchar unsigned char
#define uint  unsigned int

uchar fifobytes;
uchar fifoValue;

AddicoreRFID myRFID; // create AddicoreRFID object to control the RFID module

/**
   RFID variables
*/
const int chipSelectPin = 10;
const int NRSTPD = 5;

#define MAX_LEN 16

String prevTagId = "";

/**
   RFID variables
*/


/**
   Light sensor variables
*/
const int LIGHT_SENSOR_1 = A0;
const int LIGHT_SENSOR_2 = A1;

const int LIGHT_INTENSITY_THRESHOLD = 150;
const int LIGHT_MAX_ACCUMULATION = 100;

int loopCount = 0;
int loopSampleRate = 1;

unsigned long accumulatorLight1 = 0;
unsigned long accumulatorLight2 = 0;

/**
   Light sensor variables
*/


/**
   Potentiometer variables
*/

int POTENTIOMETER = A2;

/**
   Potentiometer variables
*/






void setup() {
  Serial.begin(9600);                        // RFID reader SOUT pin connected to Serial RX pin at 9600bps



  setupRFID();
  setupLightSensors();
  setupPotentiometer();



}

void loop() {


  handleRFID();
  handleLightSensors();
  handlePotentiometer();


}



void setupRFID() {

  SPI.begin();

  pinMode(chipSelectPin, OUTPUT);             // Set digital pin 10 as OUTPUT to connect it to the RFID /ENABLE pin
  digitalWrite(chipSelectPin, LOW);           // Activate the RFID reader
  pinMode(NRSTPD, OUTPUT);                    // Set digital pin 10 , Not Reset and Power-down
  digitalWrite(NRSTPD, HIGH);

  myRFID.AddicoreRFID_Init();

}


void setupLightSensors() {

  pinMode(LIGHT_SENSOR_1, INPUT);
  pinMode(LIGHT_SENSOR_2, INPUT);

}

void setupPotentiometer() {

  pinMode(POTENTIOMETER, INPUT);

}




void handleRFID() {

  uchar i, tmp, checksum1;
  uchar status;
  uchar str[MAX_LEN];
  uchar RC_size;
  uchar blockAddr;  //Selection operation block address 0 to 63
  String mynum = "";

  str[1] = 0x4400;
  //Find tags, return tag type
  status = myRFID.AddicoreRFID_Request(PICC_REQIDL, str);

  if (status == MI_OK) {

    //    Serial.println("RFID tag detected");
    //    Serial.print("Tag Type:\t\t");
    uint tagType = str[0] << 8;
    tagType = tagType + str[1];

    //    switch (tagType) {
    //      case 0x4400:
    //        Serial.println("Mifare UltraLight");
    //        break;
    //      case 0x400:
    //        Serial.println("Mifare One (S50)");
    //        break;
    //      case 0x200:
    //        Serial.println("Mifare One (S70)");
    //        break;
    //      case 0x800:
    //        Serial.println("Mifare Pro (X)");
    //        break;
    //      case 0x4403:
    //        Serial.println("Mifare DESFire");
    //        break;
    //      default:
    //        Serial.println("Unknown");
    //        break;
    //    }
  }

  //Anti-collision, return tag serial number 4 bytes
  status = myRFID.AddicoreRFID_Anticoll(str);
  if (status == MI_OK) {

    checksum1 = str[0] ^ str[1] ^ str[2] ^ str[3];
    //    Serial.print("The tag's number is:\t");
    //    Serial.print(str[0]);
    //    Serial.print(" , ");
    //    Serial.print(str[1]);
    //    Serial.print(" , ");
    //    Serial.print(str[2]);
    //    Serial.print(" , ");
    //    Serial.println(str[3]);
    //
    //    Serial.print("Read Checksum:\t\t");
    //    Serial.println(str[4]);
    //    Serial.print("Calculated Checksum:\t");
    //    Serial.println(checksum1);


    String tagId = "";
    tagId.concat(str[0]);
    tagId.concat(str[1]);
    tagId.concat(str[2]);
    tagId.concat(str[3]);

    if (!prevTagId.equals(tagId)) {
      Serial.println("tagId:" + tagId);
      prevTagId = tagId;
    }



    //    Serial.println();
    //    delay(1000);
  }

  //Todo; revisar si este halt afecta el performance del sensor.
  //  myRFID.AddicoreRFID_Halt();      //Command tag into hibernation

}

void handleLightSensors() {

  if (loopCount % loopSampleRate == 0) {

    int lightValue1 = analogRead(LIGHT_SENSOR_1);
    int lightValue2 = analogRead(LIGHT_SENSOR_2);


    //    Serial.println(lightValue2);


    if (lightValue1 > LIGHT_INTENSITY_THRESHOLD) {
      if (accumulatorLight1 < LIGHT_MAX_ACCUMULATION) accumulatorLight1++;
    } else {
      if (accumulatorLight1 > 0) accumulatorLight1--;
    }

    if (lightValue2 > LIGHT_INTENSITY_THRESHOLD) {
      if (accumulatorLight2 < LIGHT_MAX_ACCUMULATION) accumulatorLight2++;
    } else {
      if (accumulatorLight2 > 0) accumulatorLight2--;
    }



    //    if (accumulatorLight1 > accumulatorLight2) {
    //
    //      String light1Msg = "light1:" + String(accumulatorLight1);
    //      Serial.println(light1Msg);
    //
    //    } else if (accumulatorLight1 < accumulatorLight2) {
    //
    //      String light2Msg = "light2:" + String(accumulatorLight2);
    //      Serial.println(light2Msg);
    //
    //    }

    //    if (lightValue1 > lightValue2) {
    //
    //      String light1Msg = "light1:" + String(accumulatorLight1);
    //      Serial.println(light1Msg);
    //
    //    } else if (lightValue1 < lightValue2) {
    //
    //      String light2Msg = "light2:" + String(accumulatorLight2);
    //      Serial.println(light2Msg);
    //
    //    }

    loopCount = 0;

    String light1Msg = "light1:" + String(accumulatorLight1);
    Serial.println(light1Msg);

    String light2Msg = "light2:" + String(accumulatorLight2);
    Serial.println(light2Msg);

  }


  loopCount++;






}



void handlePotentiometer() {

  int potentiometerReading = analogRead(POTENTIOMETER);

  String potMsg = "pot:" + String(potentiometerReading);
  Serial.println(potMsg);


}
