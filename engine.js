var myCharacter;
var myBackground;
//var myForground;
var gornd;
var scale = 1.5;
var Bounds = [];
var origin;

function startGame() {
  //<!-- Game objects (width, height, src, x, y, type, spriteRows, spriteCols) -->
  origin = new component(1, 1, "", 0, 0, "image");
  myCharacter = new component(392, 274, "completeSpriteSheet.png", 275, 180, "character", 30, 12);
  myCharacterHurtbox = new component(83, 101, "transparent", 275, 180, "hurtBox");
  myBackground = new component(640, 480, "fdbackgorund.png", 0, 0, "background");
  //myForground = new component(640, 480, "samus.png", 0, 0, "image");
  gornd = new component(640 * scale, 480 * scale, "MeleeBattlefield.png", 0, 0, "image");
  myEnemy = new component(400 / 6, 400 / 6, "Slime2.png", 62, 390, "character", 4, 4);
  myEnemy2 = new component(400 / 6, 400 / 6, "Slime2.png", 750, 225, "character", 4, 4);
  myEnemy3 = new component(400 / 6, 400 / 6, "Slime2.png", 440, 65, "character", 4, 4);
  myCharacterHitbox = new component(0, 0, "transparent", 0, 0, "hitbox");
  //180, 180
  //<!-- Game Bounds -->
  //<!-- Non-Passable Game Bounds -->
  Bounds[0] = myBound0 = new component(593 * scale, 2 * scale, "transparent", 20 * scale, 303 * scale, "wall");
  // Bounds[4] = myBound4 = new component(2*scale, 100*scale, "red", 62*scale, 94*scale, "wall");
  // Bounds[5] = myBound5 = new component(2*scale, 100*scale, "red", 220*scale, 94*scale, "wall");
  // Bounds[6] = myBound6 = new component(158*scale, 2*scale, "red", 62*scale, 94*scale, "wall");
  //<!-- Only Stand Game Bounds -->
  Bounds[1] = myBound1 = new component(158 * scale, 2 * scale, "transparent", 62 * scale, 194 * scale, "passablewall");
  Bounds[2] = myBound2 = new component(158 * scale, 2 * scale, "transparent", 412 * scale, 194 * scale, "passablewall");
  Bounds[3] = myBound3 = new component(166 * scale, 2 * scale, "transparent", 233 * scale, 80 * scale, "passablewall");
  //<!---->
  //<!---->






  //<!-- Game initialization -->
  myGameArea.start();
}

var myGameArea = {
  canvas: document.createElement("canvas"),
  start: function() {
    //<!-- Canvas creation -->
    this.canvas.width = 640;
    this.canvas.height = 480;
    this.context = this.canvas.getContext("2d");
    document.body.prepend(this.canvas, document.body.childNodes[0]);
    //<!-- Frame Rate -->
    this.interval = setInterval(updateGameArea, 16.67);
    //<!-- Key Listeners for canvas -->
    window.addEventListener('keydown', function(e) {
      myGameArea.keys = (myGameArea.keys || []);
      myGameArea.keys[e.keyCode] = (e.type == "keydown");
    })
    window.addEventListener('keyup', function(e) {
      myGameArea.keys[e.keyCode] = (e.type == "keydown");
    })
  },
  clear: function() {
    //<!-- Refresh canvas -->
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}


//<!-- Object Creator -->
function component(width, height, color, x, y, type, spriteRows, spriteCols) {
  this.type = type;
  if (type == "image" || type == "background" || type == "character" || type == "hurtBox" || type == "hitBox") {
    this.image = new Image();
    this.image.src = color;
  }
  if (type == "character"){
    this.isLookingRight = true;
  }
  this.width = width;
  this.height = height;
  this.speedX = 0;
  this.speedY = 0;
  this.health = 10;
  this.knockback = false;
  this.x = x;
  this.y = y;
  this.spriteRows = spriteRows;
  this.spriteCols = spriteCols;
  this.currentRow = 0;
  this.currentColl = 0;
  this.gravity = 0;
  this.gravitySpeed = 0;
  this.update = function() {
    ctx = myGameArea.context;
    if (type == "image" || type == "background" || type == "character") {
      if (type == "character") {
        var cRow = this.currentRow;
        var cColl = this.currentColl;
        var spriteWidth = this.image.width / this.spriteCols;
        var spriteHeight = this.image.height / this.spriteRows;
        ctx.drawImage(this.image, cColl * spriteWidth, cRow * spriteHeight, spriteWidth, spriteHeight, this.x, this.y, this.width, this.height);
      } else {
        ctx.drawImage(this.image,
          this.x,
          this.y,
          this.width, this.height);
        //<!-- Background loop -->
        if (type == "background") {
          ctx.drawImage(this.image,
            this.x + this.width,
            this.y,
            this.width, this.height);
        }
      }
    } else {
      ctx.fillStyle = color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  }
  //<!-- Change Objects Position -->
  this.newPos = function() {
    if (this.type === "background") {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < -(this.width)) {
        this.x = 0;
      }

    } else {
      //<!-- Gravity -->
      this.gravitySpeed += origin.gravity;
      this.x += origin.speedX;
      this.y += origin.speedY + origin.gravitySpeed;
    }
  }
  //<!-- Collision -->
  this.collide = function(otherobj) {
    var myleft = this.x;
    var myright = this.x + (this.width);
    var mytop = this.y;
    var mybottom = this.y + (this.height);
    var otherleft = otherobj.x;
    var otherright = otherobj.x + (otherobj.width);
    var othertop = otherobj.y;
    var otherbottom = otherobj.y + (otherobj.height);
    var crash = true;
    if ((mybottom <= othertop) || (mytop >= otherbottom) || (myright <= otherleft) || (myleft >= otherright)) {
      crash = false;
    }
    if (crash === true) {
      var topcollision = otherbottom - this.y;
      var bottomcollision = mybottom - otherobj.y;
      var leftcollision = myright - otherobj.x;
      var rightcollision = otherright - this.x;
      if (collisions[4] === false) {
        collisions[0] = false;
        collisions[1] = false;
        collisions[2] = false;
        collisions[3] = false;
      }
      //<!-- Collision Logic -->
      if (otherobj.type === "wall") {
        if (topcollision < bottomcollision && topcollision < leftcollision && topcollision < rightcollision) {
          collisions[0] = true;
          collisions[4] = true;
        }
        if (rightcollision < bottomcollision && rightcollision < leftcollision && rightcollision < topcollision) {
          collisions[1] = true;
          collisions[4] = true;
        }
        if (leftcollision < bottomcollision && leftcollision < topcollision && leftcollision < rightcollision) {
          collisions[3] = true;
          collisions[4] = true;
        }
      }
    }
    if (bottomcollision < topcollision && bottomcollision < leftcollision && bottomcollision < rightcollision) {
      collisions[2] = true;
      collisions[4] = true;
    }
    return crash;
  }
}

var jumpSpeed = 0;
var wait = 2;
var jumpHold = 0;
var impact = false;
var ground = false;
var idleFrame = 0;
var walkingRightFrame = 0;
var walkingLeftFrame = 0;
var enemyFrame = 0;
var enemy2Frame = 0;
var enemy3Frame = 0;
var collisions = [false, false, false, false, false];
var animationWait = 0;
var EanimationWait = 0;
var load = 0;
var direction = 0;
var lookingRight = true;
var animationRow = 5;
var animationColl = 6;
var EanimationRow = 0;
var EanimationColl = 0;
var E2animationRow = 0;
var E2animationColl = 0;
var E3animationRow = 0;
var E3animationColl = 0;
var animationRunning = false;
var animation2Running = false;
var animation3Running = false;
var animation4Running = false;
var keyHold = false;
var hitGround = false;
var crouching = false;

function updateGameArea() {



  //<!-- Ground Collision -->
  for (var i = 0; i < Bounds.length; i++) {
    if (myCharacterHurtbox.collide(Bounds[i])) {
      if (collisions[2]) {
        animation3Running = false;
        animation2Running = false;
        if (hitGround === false) {
          if (lookingRight === true) {
            idleFrame = 0;
            animationRow = 4;
            animationColl = 5;
          } else {
            idleFrame = 0;
            animationRow = 15;
            animationColl = 1;
          }
        }
        origin.gravitySpeed = 0;
        origin.gravity = 0;
        jumpHold = 0;
        ground = true;
        if (animationRunning === false && crouching === false) {
          direction = 0;
        }
        hitGround = true;
      }
    }
  }
  collisions[4] = false;
  if (ground === false) {
    hitGround = false;
    origin.gravity = -0.1;
  }
  jump();
  if (collisions[0]) {
    jumpSpeed = 0;
  }
  if (myCharacterHitbox.collide(myEnemy)) {
    myEnemy.health--;
    if(myEnemy.health < 0){
      myEnemy.knockback = true;
      enemyFrame = 30;
    }
  }
  if (myCharacterHitbox.collide(myEnemy2)) {
    myEnemy2.health--;
    if(myEnemy2.health < 0){
      myEnemy2.knockback = true;
      enemy2Frame = 30;
    }
  }if (myCharacterHitbox.collide(myEnemy3)) {
    myEnemy3.health--;
    if(myEnemy3.health < 0){
      myEnemy3.knockback = true;
      enemy3Frame = 30;
    }
  }
  myGameArea.clear();
  //<!-- Background Scroll Speed -->
  myBackground.speedX = -3;
  origin.speedX = 0;
  origin.speedY = -jumpSpeed;
  if (myGameArea.keys && myGameArea.keys[37]) {
    //direction = 2;
    if (keyhold === false){
    if (animationRunning === false) {
      if (animation2Running === false && animation3Running === false){
      animationRow = 15;
      animationColl = 1;
      myCharacter.currentRow = 15;
      myCharacter.currentColl = 1;
      }
      if (animation3Running === false){
      lookingRight = false;
      }
    }
    }
    //<!-- Left Wall Collision -->
    if (collisions[1] === false) {
      if (animationRunning === false) {
        origin.speedX = 5;
      }
    }
    keyhold = true;
  } else {
    keyhold = false;
  }
  if (myGameArea.keys && myGameArea.keys[39]) {
    //direction = 3;
    if (keyhold === false){
    if (animationRunning === false) {
      if (animation2Running === false && animation3Running === false){

      animationRow = 4;
      animationColl = 5;
      myCharacter.currentRow = 4;
      myCharacter.currentColl = 5;
      }
      if (animation3Running === false){
      lookingRight = true;
    }
    }
    }
    //<!-- Right Wall Collision -->
    if (collisions[3] === false) {
      if (animationRunning === false) {
        origin.speedX = -5;
      }
    }
    keyhold = true;
  } else {
    keyhold = false;
  }
  if (myGameArea.keys && myGameArea.keys[38]) {
    if (jumpHold < 3){
    if (animationRunning === false) {
      if (lookingRight === true) {
        animationRow = 5;
        animationColl = 3;
      } else {
        animationRow = 15;
        animationColl = 11;
      }
      jumpHold++;
      direction = 4;
      jump(-12);
      }
    }
  }
  if (myGameArea.keys && myGameArea.keys[40]) {
    if (animationRunning === false && animation2Running === false && animation3Running === false) {
      if (crouching === false) {
        if (lookingRight === true) {
          animationRow = 21;
          animationColl = 4;
          myCharacter.currentRow = 21;
          myCharacter.currentColl = 4;
          myCharacter.y = 210;
          myCharacter.x = 250;
        } else {
          animationRow = 25;
          animationColl = 7;
          myCharacter.currentRow = 25;
          myCharacter.currentColl = 7;
          myCharacter.y = 210;
          myCharacter.x = 265;
        }
      }
      crouching = true;
    }
  } else {
    if (crouching === true) {
      animationRunning = false;
      if (lookingRight === true) {
        animationRow = 4;
        animationColl = 5;
      } else {
        animationRow = 15;
        animationColl = 1;
      }
    }
    crouching = false
  }
  if (myGameArea.keys && myGameArea.keys[88]) {
    if (animationRunning === false && animation2Running === false) {
        direction = 1;
      if (lookingRight === true) {
        if (crouching === false) {
          if (ground === true) {
            animationRow = 0;
            animationColl = 0;
          } else {
            animationRow = 7;
            animationColl = 11;

          }
        }
      } else {
        if (crouching === false) {
          if (ground === true) {
            animationRow = 10;
            animationColl = 8;
          } else {
            animationRow = 18;
            animationColl = 7;
          }
        }
      }
    }
  }
  if (myGameArea.keys && myGameArea.keys[90]) {
    if (crouching === false && animationRunning === false){
    if (ground === true){
      direction = 5;
      if (lookingRight === true){
      animationRow = 21;
      animationColl = 10;
    } else{
      animationRow = 26;
      animationColl = 1;
    }
    }
  }
  }
  if (myGameArea.keys && myGameArea.keys[69]) {
    myEnemy.x = origin.x + 62;
    myEnemy.y = origin.y + 390;
    myEnemy.width = 67;
    myEnemy.height = 67;
    myEnemy.knockback = false;
    enemyFrame = 0;
    myEnemy2.x = origin.x + 750;
    myEnemy2.y = origin.y + 225;
    myEnemy2.width = 67;
    myEnemy2.height = 67;
    myEnemy2.knockback = false;
    enemy2Frame = 0;
    myEnemy3.x = origin.x + 440;
    myEnemy3.y = origin.y + 65;
    myEnemy3.width = 67;
    myEnemy3.height = 67;
    myEnemy3.knockback = false;
    enemy3Frame = 0;
  }


  //<!-- Idel Animation -->
  if (animationWait === 0) {
    if (lookingRight === true) {
      if (direction === 0 && ground === true && crouching === false) {
        direction = 0;
        myCharacter.currentRow = animationRow;
        myCharacter.currentColl = animationColl;
        myCharacter.x = 275;
        myCharacter.y = 180;
        animationColl++;
        if (animationColl === 12) {
          animationRow++;
          animationColl = 0;
        }
        idleFrame++;
        animationWait = 2;
        if (idleFrame === 10) {
          idleFrame = 0;
          animationRow = 4;
          animationColl = 5;
        }
        //<!-- Axe Kick Animation -->
      }
      if (direction === 1) {
        if (ground === true && animation2Running === false && crouching === false) {
          if (animationRunning === false){
            animationRow = 0;
            animationColl = 0;
          }
          animationRunning = true;
          myCharacter.currentRow = animationRow;
          myCharacter.currentColl = animationColl;
          myCharacter.x = 199;
          myCharacter.y = 23;
          animationColl++;
          if (animationColl === 12) {
            animationRow++;
            animationColl = 0;
          }
          walkingRightFrame++;
          animationWait = 1;
          if (walkingRightFrame > 20 && walkingRightFrame > 31) {

          }
          if (walkingRightFrame === 53) {
            animationRunning = false;
            walkingRightFrame = 0;
            animationRow = 4;
            animationColl = 5;
            direction = 0;
          }
        } else if (ground === false) {
          animation2Running = true;
          myCharacter.currentRow = animationRow;
          myCharacter.currentColl = animationColl;
          myCharacter.x = 211;
          myCharacter.y = 126;
          animationColl++;
          if (animationColl === 12) {
            animationRow++;
            animationColl = 0;
          }
          walkingRightFrame++;
          animationWait = 1;
          if (walkingRightFrame === 21) {
            animation2Running = false;
            animationRunning = false;
            walkingRightFrame = 0;
            animationRow = 4;
            animationColl = 5;
            direction = 0;
          }
        } else if (crouching === true) {
          animationRunning = true;
          myCharacter.currentRow = animationRow;
          myCharacter.currentColl = animationColl;
          myCharacter.y = 210;
          myCharacter.x = 250;
          myCharacterHitbox.x = 318;
          myCharacterHitbox.y = 225;
          myCharacterHitbox.width = 50;
          myCharacterHitbox.height = 10;
          animationColl++;
          if (animationColl === 12) {
            animationRow++;
            animationColl = 0;
          }
          walkingRightFrame++;
          animationWait = 2;
          if (walkingRightFrame === 6) {
            crouching = false;
            animationRunning = false;
            walkingRightFrame = 0;
            animationRow = 4;
            animationColl = 5;
            direction = 0;
            myCharacterHitbox.x = 0;
            myCharacterHitbox.y = 0;
            myCharacterHitbox.width = 0;
            myCharacterHitbox.height = 0;
          }

        }
        //<!-- Walking Left Animation -->
      }
      if (direction === 2) {
        walkingLeftFrame++;
        animationWait = 2;
        if (walkingLeftFrame === 12) {
          walkingLeftFrame = 0;
        }
        //<!-- Jumping Animation -->
      }
      if (direction === 4) {
        if (ground === false) {
          animation3Running = true;
          myCharacter.currentRow = animationRow;
          myCharacter.currentColl = animationColl;
          myCharacter.x = 261;
          if (idleFrame < 27) {
            myCharacter.x = 261 - 6 * idleFrame;
          } else(myCharacter.x = 261 - 6 * 27)
          myCharacter.y = 64;
          animationColl++;
          if (animationColl === 12) {
            animationRow++;
            animationColl = 0;
          }
          idleFrame++;
          animationWait = 1;
          if (idleFrame === 26) {
            animation3Running = false;
            idleFrame = 0;
            animationRow = 4;
            animationColl = 5;
            direction = 0;
          }
        } else {
          idleFrame = 0;
          animationRow = 4;
          animationColl = 5;
          direction = 0;
        }
      }
      if (direction === 5){
        animationRunning = true;
        myCharacter.currentRow = animationRow;
        myCharacter.currentColl = animationColl;
        myCharacter.x = 245;
        myCharacter.y = 170;
        animationColl++;
        if (animationColl === 12) {
          animationRow++;
          animationColl = 0;
        }
        walkingRightFrame++;
        animationWait = 2;
        if (walkingRightFrame === 45) {
          animationRunning = false;
          walkingRightFrame = 0;
          animationRow = 4;
          animationColl = 5;
          direction = 0;
        }
      }
    } else {
      if (direction === 0 && ground === true && crouching === false) {
        myCharacter.currentRow = animationRow;
        myCharacter.currentColl = animationColl;
        myCharacter.x = 275;
        myCharacter.y = 180;
        animationColl++;
        if (animationColl === 12) {
          animationRow++;
          animationColl = 0;
        }
        idleFrame++;
        animationWait = 2;
        if (idleFrame === 10) {
          idleFrame = 0;
          animationRow = 15;
          animationColl = 1;
        }
        //<!-- Axe Kick Animation -->
      }
      if (direction === 1) {
        if (ground === true && animation2Running === false && crouching === false) {
          if (animationRunning === false){
            animationRow = 10;
            animationColl = 8;
          }
          animationRunning = true;
          myCharacter.currentRow = animationRow;
          myCharacter.currentColl = animationColl;
          myCharacter.x = 41;
          myCharacter.y = 23;
          animationColl++;
          if (animationColl === 12) {
            animationRow++;
            animationColl = 0;
          }
          walkingRightFrame++;
          animationWait = 1;
          if (walkingRightFrame === 53) {
            animationRunning = false;
            walkingRightFrame = 0;
            animationRow = 15;
            animationColl = 1;
            direction = 0;
          }
        } else if (ground === false) {
          animation2Running = true;
          myCharacter.currentRow = animationRow;
          myCharacter.currentColl = animationColl;
          myCharacter.x = 220;
          myCharacter.y = 126;
          animationColl++;
          if (animationColl === 12) {
            animationRow++;
            animationColl = 0;
          }
          walkingRightFrame++;
          animationWait = 1;
          if (walkingRightFrame === 21) {
            animation2Running = false;
            animationRunning = false;
            walkingRightFrame = 0;
            animationRow = 15;
            animationColl = 1;
            direction = 0;
          }
        } else if (crouching === true) {
          animationRunning = true;
          myCharacter.currentRow = animationRow;
          myCharacter.currentColl = animationColl;
          myCharacter.y = 210;
          myCharacter.x = 265;
          myCharacterHitbox.x = 267;
          myCharacterHitbox.y = 225;
          myCharacterHitbox.width = 50;
          myCharacterHitbox.height = 10;
          animationColl++;
          if (animationColl === 12) {
            animationRow++;
            animationColl = 0;
          }
          walkingRightFrame++;
          animationWait = 2;
          if (walkingRightFrame === 6) {
            crouching = false;
            animationRunning = false;
            walkingRightFrame = 0;
            animationRow = 15;
            animationColl = 1;
            direction = 0;
            myCharacterHitbox.x = 0;
            myCharacterHitbox.y = 0;
            myCharacterHitbox.width = 0;
            myCharacterHitbox.height = 0;
          }
        }
        //<!-- Walking Left Animation -->
      }
      if (direction === 2) {
        walkingLeftFrame++;
        animationWait = 5;
        if (walkingLeftFrame === 12) {
          walkingLeftFrame = 0;
        }
        //<!-- Jumping Animation -->
      }
      if (direction === 4) {
        if (ground === false) {
          walkingRightFrame = 0;
          animation3Running = true;
          myCharacter.currentRow = animationRow;
          myCharacter.currentColl = animationColl;
          myCharacter.x = 95;
          if (idleFrame < 27) {
            myCharacter.x = 95 + 6 * idleFrame;
          } else(myCharacter.x = 95 + 6 * 27)
          myCharacter.y = 64;
          animationColl++;
          if (animationColl === 12) {
            animationRow++;
            animationColl = 0;
          }
          idleFrame++;
          animationWait = 1;
          if (idleFrame === 26) {
            animation3Running = false;
            idleFrame = 0;
            animationRow = 15;
            animationColl = 1;
            direction = 0;
          }
        } else {
          idleFrame = 0;
          animationRow = 15;
          animationColl = 1;
          direction = 0;
        }
      }
      if (direction === 5){
        animationRunning = true;
        myCharacter.currentRow = animationRow;
        myCharacter.currentColl = animationColl;
        myCharacter.x = 290;
        myCharacter.y = 170;
        animationColl++;
        if (animationColl === 12) {
          animationRow++;
          animationColl = 0;
        }
        walkingRightFrame++;
        animationWait = 2;
        if (walkingRightFrame === 45) {
          animationRunning = false;
          walkingRightFrame = 0;
          animationRow = 15;
          animationColl = 1;
          direction = 0;
        }
      }
    }
  } else {
    animationWait = animationWait - 1;
  }
  if (animationRunning === false && animation2Running === false && animation3Running === false && animation4Running === false) {
    direction = 0;
  }

  myEnemy2.isLookingRight = false;
  myEnemy3.isLookingRight = false;
  if (EanimationWait === 0) {
    if (myEnemy.knockback === false){
    myEnemy.currentRow = EanimationRow;
    myEnemy.currentColl = EanimationColl;
    // if (myEnemy.x < 550 && myEnemy.isLookingRight === true) {
    //   myEnemy.x += 10;
    // } else {
    //   myEnemy.isLookingRight = false;
    // }
    // if (myEnemy.x > 62 && myEnemy.isLookingRight === false) {
    //   myEnemy.x -= 10;
    // } else {
    //   myEnemy.isLookingRight = true;
    // }
    EanimationColl++;
    if (EanimationColl === 4) {
      EanimationRow++;
      EanimationColl = 0;
    }
    enemyFrame++;
    EanimationWait = 2;
    if (enemyFrame === 8) {
      enemyFrame = 0;
      if (myEnemy.isLookingRight === true) {
        EanimationRow = 0;
        EanimationColl = 0;
      } else {
        EanimationRow = 2;
        EanimationColl = 0;
      }
    }
    }
    if (myEnemy2.knockback === false){
    myEnemy2.currentRow = E2animationRow;
    myEnemy2.currentColl = E2animationColl;
    // if (myEnemy2.x < 550 && myEnemy2.isLookingRight === true) {
    //   myEnemy2.x += 10;
    // } else {
    //   myEnemy2.isLookingRight = false;
    // }
    // if (myEnemy2.x > 62 && myEnemy2.isLookingRight === false) {
    //   myEnemy2.x -= 10;
    // } else {
    //   myEnemy2.isLookingRight = true;
    // }
    E2animationColl++;
    if (E2animationColl === 4) {
      E2animationRow++;
      E2animationColl = 0;
    }
    enemy2Frame++;
    EanimationWait = 2;
    if (enemy2Frame === 8) {
      enemy2Frame = 0;
      if (myEnemy2.isLookingRight === true) {
        E2animationRow = 0;
        E2animationColl = 0;
      } else {
        E2animationRow = 2;
        E2animationColl = 0;
      }
    }
  }
    if (myEnemy3.knockback === false){
    myEnemy3.currentRow = E3animationRow;
    myEnemy3.currentColl = E3animationColl;
    // if (myEnemy3.x < 550 && myEnemy3.isLookingRight === true) {
    //   myEnemy3.x += 10;
    // } else {
    //   myEnemy3.isLookingRight = false;
    // }
    // if (myEnemy3.x > 62 && myEnemy3.isLookingRight === false) {
    //   myEnemy3.x -= 10;
    // } else {
    //   myEnemy3.isLookingRight = true;
    // }
    E3animationColl++;
    if (E3animationColl === 4) {
      E3animationRow++;
      E3animationColl = 0;
    }
    enemy3Frame++;
    EanimationWait = 2;
    if (enemy3Frame === 8) {
      enemy3Frame = 0;
      if (myEnemy3.isLookingRight === true) {
        E3animationRow = 0;
        E3animationColl = 0;
      } else {
        E3animationRow = 2;
        E3animationColl = 0;
      }
    }
    }
  } else {
    EanimationWait--
  }
  if (myEnemy.knockback === true) {
    if(enemyFrame > 0){
      if (myEnemy.isLookingRight === true){
      myEnemy.x -= 25;
      myEnemy.y -= 10;
      myEnemy.width += 10;
      myEnemy.height += 10;
    }else{
      myEnemy.x += 15;
      myEnemy.y -= 10;
      myEnemy.width += 10;
      myEnemy.height += 10;
    }
    }
    else{
      myEnemy.x = 0;
      myEnemy.y = 0;
      myEnemy.height = 0;
      myEnemy.width = 0;
      myEnemy.knockback = false;
    }
    enemyFrame--;
  }
  if (myEnemy2.knockback === true) {
    if(enemy2Frame > 0){
      if (myEnemy2.isLookingRight === true){
      myEnemy2.x -= 25;
      myEnemy2.y -= 10;
      myEnemy2.width += 10;
      myEnemy2.height += 10;
    }else{
      myEnemy2.x += 15;
      myEnemy2.y -= 10;
      myEnemy2.width += 10;
      myEnemy2.height += 10;
    }
    }
    else{
      myEnemy2.x = 0;
      myEnemy2.y = 0;
      myEnemy2.height = 0;
      myEnemy2.width = 0;
      myEnemy2.knockback = false;
    }
    enemy2Frame--;
  }
  if (myEnemy3.knockback === true) {
    if(enemy3Frame > 0){
      if (myEnemy3.isLookingRight === true){
      myEnemy3.x -= 25;
      myEnemy3.y -= 10;
      myEnemy3.width += 10;
      myEnemy3.height += 10;
    }else{
      myEnemy3.x += 15;
      myEnemy3.y -= 10;
      myEnemy3.width += 10;
      myEnemy3.height += 10;
    }
    }
    else{
      myEnemy3.x = 0;
      myEnemy3.y = 0;
      myEnemy3.height = 0;
      myEnemy3.width = 0;
      myEnemy3.knockback = false;
    }
    enemy3Frame--;
  }
  // if (ground === false){
  //   if (animationRunning === false && animation4Running === false && animation3Running === false && animation2Running === false){
  //     if (lookingRight === true){
  //     myCharacter.currentRow = 10;
  //     myCharacter.currentColl = 0;
  //   } else {
  //     myCharacter.currentRow = 20;
  //     myCharacter.currentColl = 6;
  //   }
  //   }
  // }

  if (animationRunning === false && animation4Running === false && animation3Running === false && animation2Running === false){
    myCharacterHitbox.x = 0;
    myCharacterHitbox.y = 0;
    myCharacterHitbox.width = 0;
    myCharacterHitbox.height = 0;
  }
  ground = false;
  //<!-- Game Object Updates -->
  origin.newPos();
  origin.update();
  myBackground.newPos();
  myBackground.update();
  gornd.newPos();
  gornd.update();
  myEnemy.newPos();
  myEnemy.update();
  myEnemy2.newPos();
  myEnemy2.update();
  myEnemy3.newPos();
  myEnemy3.update();
  myCharacter.update();
  myCharacterHurtbox.update();
  myCharacterHitbox.update();
  for (var i = 0; i < Bounds.length; i++) {
    Bounds[i].newPos();
    Bounds[i].update();
  }

}

//<!-- Jump Function -->
function jump(x) {
  if (jumpHold < 3) {
    if (x <= 0) {
      jumpSpeed = x;
    }
  }
  if (wait === 0) {
    if (jumpSpeed < 0) {
      jumpSpeed += 1;
      wait = 2;
    }
  } else {
    wait--
  }
}
