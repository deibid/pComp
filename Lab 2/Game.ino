int button1 = 3;
int button2 = 4;
int button3 = 5;
int button4 = 6;

int ledButton1 = 7;
int ledButton2 = 8;
int ledButton3 = 9;
int ledButton4 = 10;

int ledWin = 11;
int ledFail = 12;
int buzzer = 13;


boolean button1LastState = LOW;
boolean button2LastState = LOW;
boolean button3LastState = LOW;
boolean button4LastState = LOW;

int led1Note = 208; //La b 3
int led2Note = 261; //Do 4
int led3Note = 311; //Mi b 4
int led4Note = 392; //Sol 4


const int PATTERN_LENGTH = 4;
const long TIME = 5000;


String sequence = "";
String receivedSequence = "";
int totalPushes = 0;

boolean gameWon = false;

int gameWinSequence[] = {261, 329, 392, 523,329,523};
int gameWinSequenceCounter = 0;

void setup() {

  Serial.begin(9600);

  pinMode(button1, INPUT);
  pinMode(button2, INPUT);
  pinMode(button3, INPUT);
  pinMode(button4, INPUT);

  pinMode(ledButton1, OUTPUT);
  pinMode(ledButton2, OUTPUT);
  pinMode(ledButton3, OUTPUT);
  pinMode(ledButton4, OUTPUT);


  pinMode(ledWin, OUTPUT);
  pinMode(ledFail, OUTPUT);
  pinMode(buzzer, OUTPUT);

  
  generateRandomSequence();

  



}

void loop() {
  // put your main code here, to run repeatedly:

  if (!gameWon) {

    if (button1LastState == LOW && digitalRead(button1) == HIGH) {
      Serial.println("Button 1 pressed");
      button1LastState = HIGH;
      receivedSequence = receivedSequence + "3";

      

      boolean isCorrect = validateInputCharacter('3');

      if (isCorrect) {
        tone(buzzer, led1Note);
        digitalWrite(ledButton1, isCorrect);
        totalPushes++;
      } else {
        restartInputs();
      }

      validateSequence();


    } else if (button1LastState == HIGH && digitalRead(button1) == LOW) {
      button1LastState = LOW;
      digitalWrite(ledButton1, LOW);
      noTone(buzzer);
    }


    if (button2LastState == LOW && digitalRead(button2) == HIGH) {
      Serial.println("Button 2 pressed");
      button2LastState = HIGH;
      receivedSequence = receivedSequence + "4";

      

      boolean isCorrect = validateInputCharacter('4');

      if (isCorrect) {
        tone(buzzer, led2Note);
        digitalWrite(ledButton2, isCorrect);
        totalPushes++;
      } else {
        restartInputs();
      }



      validateSequence();
    } else if (button2LastState == HIGH && digitalRead(button2) == LOW) {
      button2LastState = LOW;
      digitalWrite(ledButton2, LOW);
      noTone(buzzer);
    }

    if (button3LastState == LOW && digitalRead(button3) == HIGH) {
      Serial.println("Button 3 pressed");
      button3LastState = HIGH;
      receivedSequence = receivedSequence + "5";

      

      boolean isCorrect = validateInputCharacter('5');

      if (isCorrect) {
        tone(buzzer, led3Note);
        digitalWrite(ledButton3, isCorrect);
        totalPushes++;
      } else {
        restartInputs();
      }


      validateSequence();
    } else if (button3LastState == HIGH && digitalRead(button3) == LOW) {
      button3LastState = LOW;
      digitalWrite(ledButton3, LOW);
      noTone(buzzer);
    }

    if (button4LastState == LOW && digitalRead(button4) == HIGH) {
      Serial.println("Button 4 pressed");
      button4LastState = HIGH;
      receivedSequence = receivedSequence + "6";

      

      boolean isCorrect = validateInputCharacter('6');

      if (isCorrect) {
        tone(buzzer,led4Note);
        digitalWrite(ledButton4, isCorrect);
        totalPushes++;
      } else {
        restartInputs();
      }


      validateSequence();
    } else if (button4LastState == HIGH && digitalRead(button4) == LOW) {
      button4LastState = LOW;
      digitalWrite(ledButton4, LOW);
      noTone(buzzer);
    }

  }

  // else, if game WON
  else {
    Serial.println("YOU WIN");
    digitalWrite(ledButton1, HIGH);
    digitalWrite(ledButton2, HIGH);
    digitalWrite(ledButton3, HIGH);
    digitalWrite(ledButton4, HIGH);

    if(gameWinSequenceCounter<=5){
      tone(buzzer, gameWinSequence[gameWinSequenceCounter]);
    }

    
    delay(100);

    digitalWrite(ledButton1, LOW);
    digitalWrite(ledButton2, LOW);
    digitalWrite(ledButton3, LOW);
    digitalWrite(ledButton4, LOW);

    noTone(buzzer);
    delay(100);

    gameWinSequenceCounter++;


    if(digitalRead(button1) == HIGH || digitalRead(button2) == HIGH || digitalRead(button3) == HIGH || digitalRead(button4) == HIGH){
      restartInputs();
      gameWon = false;
      gameWinSequenceCounter = 0;
    }

  }

}


boolean validateInputCharacter(char pinMap) {
  Serial.println("__________");
  Serial.print("String[0] ");
  Serial.println(sequence[0]);

  char character = sequence[totalPushes];
  Serial.println("CHAR: ");
  Serial.print(character);
  Serial.println("PinMap: ");
  Serial.print(pinMap);

  if (character == pinMap) {
    Serial.println("Si son iguales");
    return true;
  } else {
    Serial.println("No son iguales");
    return false;
  }



}



void restartInputs() {
  receivedSequence = "";
  totalPushes = 0;
}
void validateSequence() {
  gameWon = (receivedSequence == sequence) ? true : false;
}

void generateRandomSequence() {

  randomSeed(analogRead(0));

  for ( int i = 0; i < 4 ; i++) {
    sequence = sequence + (int)random(3, 6);
  }

  Serial.println("SEQUENCE> " + sequence);

}
