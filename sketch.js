
var gameStates;
var readState;
var dog,hungryDog,happyDog,sleepingDog,deadDog; 
var database;
var credit,creditRem;
var foodS,foodStock;
var buyFood;
var fedTime,lastFed,currentTime;
var feed;
var score,credit1;
var h;


function preload(){
hungryDog=loadImage("Images/Dog.png");
happyDog=loadImage("Images/Happy.png");
sleepingDog=loadImage("Images/Lazy.png")
deadDog=loadImage("Images/deadDog.png");
}


function setup() {
  database=firebase.database();
  createCanvas(1200,800);

  dog=createSprite(600,600,20,20);
  dog.scale=0.2;

score = new Score();
credit1 = new Credit();

 foodStock=database.ref('Food');
  foodStock.on("value",readStock);

  credit=database.ref('Credit');
  credit.on("value",function(data){
    creditRem=data.val();
  });

  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });

  //read game state from database
  readState=database.ref('gameState');
  readState.on("value",function(data){
    gameStates=data.val();
  });
 

  buyFood=createButton("Buy Food");
  buyFood.position(1000,200);
  buyFood.mousePressed(buyaFood);

  feed=createButton("Feed the dog");
  feed.position(1000,250);
  feed.mousePressed(feeddog);
}

function draw() {
  background("white");  
  console.log(gameStates);

  

  if(gameStates==="hungry"){
    dog.addImage(hungryDog);
    text("I AM HUNGRY",200,400);
  }
 
currentTime=hour();
 if(lastFed===currentTime){
   text("Thank You", 200,400);
   dog.addImage(happyDog);
   gameStates="playing";
   update("playing");
 } 
 else
 if(currentTime<(lastFed+2) && currentTime>(lastFed+3)){
   text("Sleeping",200,400);
   gameStates="sleeping";
   dog.addImage(sleepingDog);
   update("sleeping");
 }
 else 
 if(currentTime<(lastFed+3) && currentTime>(lastFed+4)){
   gameStates="hungry";
   dog.addImage(hungryDog);
   update("hungry");
 }
 else
 if(currentTime>(lastFed+6)&& lastFed>0){
   text("GoodBye",200,400);
   gameStates="end";
   dog.addImage(deadDog);
   update("end");
 }
 if(gameStates==="end"){
    buyFood.hide();
    feed.hide();
  }

  //If credit or food Stock is 0 hide the buttons 
  if(creditRem<0){
    buyFood.hide();
  }
  if(foodS===0){
    feed.hide();
  }
 score.display();
 credit1.display();

  drawSprites();
}

function readStock(data){
  foodS=data.val();
}

function buyaFood(){
  creditRem=creditRem-5;
  foodS++;
  database.ref('/').update({
    Credit:creditRem,
    Food:foodS
  })
}

function feeddog(){
  h=hour();
  dog.addImage(happyDog);
  foodS--;
  database.ref('/').update({
    Food:foodS,
    FeedTime:h,
    gameState:"playing"
  })
}

//function to update gamestates in database
function update(state){
  database.ref('/').update({
    gameState:state
  });
}
/*function writeStock(x){
  database.ref('/').update({
    Food:x
  })
}*/