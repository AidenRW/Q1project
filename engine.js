var myGamePiece;
var myBackground;
//var myForground;
var gornd;
var Bounds = [];
var origin;
var idleAnimation = ["1.png", "2.png", "3.png", "4.png", "5.png", "6.png", "7.png", "8.png", "9.png", "10.png", "11.png"];

function startGame() {
  origin = new component(1, 1, "", 0, 1000, "image");
  myGamePiece = new component(50, 62, "1.png", 45, 180, "image");
  myBackground = new component(640, 480, "fdbackgorund.png", 0, 0, "background");
  //myForground = new component(640, 480, "samus.png", 0, 0, "image");
  gornd = new component(640, 480, "MeleeBattlefield.png", 0, 0, "image");



  Bounds[0] = myBound0 = new component(593, 2, "red", 20, 303, "wall");
  Bounds[4] = myBound4 = new component(2, 100, "red", 62, 94, "wall");
  Bounds[5] = myBound5 = new component(2, 100, "red", 220, 94, "wall");
  Bounds[6] = myBound6 = new component(158, 2, "red", 62, 94, "wall");

  Bounds[1] = myBound1 = new component(158, 2, "lightgreen", 62, 194, "passablewall");
  Bounds[2] = myBound2 = new component(158, 2, "lightgreen", 412, 194, "passablewall");
  Bounds[3] = myBound3 = new component(166, 2, "lightgreen", 233, 80, "passablewall");








  myGameArea.start();
}

var myGameArea = {
  canvas: document.createElement("canvas"),
  start: function() {
    this.canvas.width = 640;
    this.canvas.height = 480;
    this.context = this.canvas.getContext("2d");
    document.body.prepend(this.canvas, document.body.childNodes[0]);
    this.interval = setInterval(updateGameArea, 16.67);
    window.addEventListener('keydown', function(e) {
      myGameArea.keys = (myGameArea.keys || []);
      myGameArea.keys[e.keyCode] = (e.type == "keydown");
    })
    window.addEventListener('keyup', function(e) {
      myGameArea.keys[e.keyCode] = (e.type == "keydown");
    })
  },
  clear: function() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}

function component(width, height, color, x, y, type) {
  this.type = type;
  if (type == "image" || type == "background") {
    this.image = new Image();
    this.image.src = color;
  }
  this.width = width;
  this.height = height;
  this.speedX = 0;
  this.speedY = 0;
  this.x = x;
  this.y = y;
  this.gravity = 0;
  this.gravitySpeed = 0;
  this.update = function() {
    ctx = myGameArea.context;
    if (type == "image" || type == "background") {
      ctx.drawImage(this.image,
        this.x,
        this.y,
        this.width, this.height);
      if (type == "background") {
        ctx.drawImage(this.image,
          this.x + this.width,
          this.y,
          this.width, this.height);
      }
    } else {
      ctx.fillStyle = color;
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  }
  this.newPos = function() {
    if (this.type === "background") {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.x < -(this.width)) {
        this.x = 0;
      }

    } else {
      this.gravitySpeed += origin.gravity;
      this.x += origin.speedX;
      this.y += origin.speedY + origin.gravitySpeed;
    }
  }
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
var animationFrame = 0;
var collisions = [false, false, false, false, false];
var animationWait = 0;

function updateGameArea() {
  if (animationWait === 0){
  myGamePiece.image.src = idleAnimation[animationFrame];
  animationFrame ++;
  animationWait = 5;
  if (animationFrame === 10){
    animationFrame = 0;
  }
}else{animationWait --}
  for (var i = 0; i < Bounds.length; i++) {
    if (myGamePiece.collide(Bounds[i])) {
      if (collisions[2]) {
        origin.gravitySpeed = 0;
        origin.gravity = 0;
        jumpHold = 0;
        ground = true;
      }
    }
  }
  collisions[4] = false;
  if (ground === false) {
    origin.gravity = 0.1;
  }
  ground = false;
  jump();
  if (collisions[0]) {
    jumpSpeed = 0;
  }
  myGameArea.clear();
  myBackground.speedX = -3;
  origin.speedX = 0;
  origin.speedY = jumpSpeed;
  if (myGameArea.keys && myGameArea.keys[37]) {
    if (collisions[1] === false) {
      origin.speedX = -3;
    }
  }
  if (myGameArea.keys && myGameArea.keys[39]) {
    if (collisions[3] === false) {
      origin.speedX = 3;
    }
  }
  if (myGameArea.keys && myGameArea.keys[38]) {
    jumpHold++;

    jump(-10);
  }
  if (myGameArea.keys && myGameArea.keys[40]) {
    origin.speedY = 1;
  }
  origin.newPos();
  origin.update();
  myBackground.newPos();
  myBackground.update();
  //myForground.update();
  gornd.update();
  myGamePiece.newPos();
  myGamePiece.update();
  for (var i = 0; i < Bounds.length; i++) {
    // Bounds[i].newPos();
    Bounds[i].update();
  }

}

function jump(x) {
  if (jumpHold < 20) {
    if (x <= 0) {
      jumpSpeed = x / 2;
    }
  }
  if (wait === 0) {
    if (jumpSpeed < 0) {
      jumpSpeed += 1 / 2;
      wait = 2;
    }
  } else {
    wait--
  }
}
