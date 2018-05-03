var myGamePiece;
var myBackground;
var Bounds = [];
var origin;

function startGame() {
  origin = new component(1, 1, "samus4.png", 0, 1000, "image");
  myGamePiece = new component(7, 15, "samus.png", 45, 180, "image");
  myBackground = new component(677, 872, "clocktower.png", 0, 0, "background");


  Bounds[0] = myBound0 = new component(260, 1, "red", 40, 200);
  Bounds[1] = myBound1 = new component(1, 70, "red", 300, 200);
  Bounds[2] = myBound2 = new component(160, 1, "red", 40, 175);
  Bounds[3] = myBound3 = new component(1, 9, "red", 200, 175);
  Bounds[4] = myBound4 = new component(21, 1, "red", 200, 184);
  Bounds[5] = myBound5 = new component(1, 17, "red", 221, 167);
  Bounds[6] = myBound6 = new component(16, 1, "red", 221, 167);
  Bounds[7] = myBound7 = new component(1, 10, "red", 237, 157);
  Bounds[8] = myBound8 = new component(22, 1, "red", 215, 157);
  Bounds[9] = myBound9 = new component(107, 1, "red", 258, 157);
  Bounds[10] = myBound10 = new component(1, 10, "red", 258, 157);
  Bounds[11] = myBound11 = new component(22, 1, "red", 258, 167);
  Bounds[12] = myBound12 = new component(1, 17, "red", 280, 167);
  Bounds[13] = myBound13 = new component(20, 1, "red", 280, 184);
  Bounds[14] = myBound14 = new component(1, 17, "red", 300, 167);
  Bounds[15] = myBound15 = new component(65, 1, "red", 300, 167);
  Bounds[16] = myBound16 = new component(1, 22, "red", 365, 167);
  Bounds[17] = myBound17 = new component(11, 1, "red", 354, 189);
  Bounds[18] = myBound18 = new component(1, 32, "red", 354, 189);
  Bounds[19] = myBound19 = new component(6, 1, "red", 354, 221);
  Bounds[20] = myBound20 = new component(1, 22, "red", 360, 221);
  Bounds[21] = myBound21 = new component(6, 1, "red", 354, 243);
  Bounds[22] = myBound22 = new component(1, 32, "red", 354, 243);
  Bounds[23] = myBound23 = new component(10, 1, "red", 354, 275);
  Bounds[24] = myBound24 = new component(1, 21, "red", 364, 275);
  Bounds[25] = myBound25 = new component(15, 1, "red", 349, 296);
  Bounds[26] = myBound26 = new component(1, 11, "red", 349, 285);
  Bounds[27] = myBound27 = new component(11, 1, "red", 338, 285);
  Bounds[28] = myBound28 = new component(1, 11, "red", 338, 285);
  Bounds[29] = myBound29 = new component(26, 1, "red", 312, 296);
  Bounds[30] = myBound30 = new component(1, 11, "red", 312, 285);
  Bounds[31] = myBound31 = new component(43, 1, "red", 269, 285);
  Bounds[32] = myBound32 = new component(26, 1, "red", 274, 270);
  Bounds[33] = myBound33 = new component(1, 43, "red", 215, 114);


  Bounds[34] = myBound34 = new component(25, 1, "lightgreen", 313, 285);
  Bounds[35] = myBound35 = new component(10, 1, "lightgreen", 301, 211);
  Bounds[36] = myBound36 = new component(10, 1, "lightgreen", 243, 189);
  Bounds[37] = myBound37 = new component(22, 1, "lightgreen", 237, 173);









  myGameArea.start();
}

var myGameArea = {
  canvas: document.createElement("canvas"),
  start: function() {
    this.canvas.width = 677;
    this.canvas.height = 872;
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
    this.gravitySpeed += origin.gravity;
    this.x += origin.speedX;
    this.y += origin.speedY + origin.gravitySpeed;
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
    if (crash === true){
      var topcollision = otherbottom - this.y;
      var bottomcollision = mybottom - otherobj.y;
      var leftcollision = myright - otherobj.x;
      var rightcollision = otherright - this.x;
      if (topcollision < bottomcollision && topcollision < leftcollision && topcollision < rightcollision){
        console.log("top");
        top = true;
      }else{top = false;}
      if (bottomcollision < topcollision && bottomcollision < leftcollision && bottomcollision < rightcollision){
        //console.log("bottom");
        bottom = true;
      }else{bottom = false;}
      if (leftcollision < bottomcollision && leftcollision < topcollision && leftcollision < rightcollision){
        //console.log("right");
        right = true;
      }else{right = false;}
      if (rightcollision < bottomcollision && rightcollision < leftcollision && rightcollision < topcollision){
        //console.log("left");
        left = true;
      }else{left = false;}
    }
    return crash;
  }
}

var jumpSpeed = 0;
var wait = 2;
var jumpHold = 0;
var impact = false;
var ground = false;
var top = false;
var bottom = false;
var left = false;
var right = false;

function updateGameArea() {
  for (var i = 0; i < Bounds.length; i++) {
    if (myGamePiece.collide(Bounds[i])) {
      if (bottom){
      origin.gravitySpeed = 0;
      origin.gravity = 0;
      jumpHold = 0;
      ground = true;
      }
    }
  }
  if (ground === false) {
    origin.gravity = 0.05;
  }
  ground = false;
  jump();
  myGameArea.clear();
  origin.speedX = 0;
  origin.speedY = jumpSpeed;
  if (myGameArea.keys && myGameArea.keys[37]) {
    if (left === false){
    origin.speedX = -1;
    }
  }
  if (myGameArea.keys && myGameArea.keys[39]) {
    if (right === false){
    origin.speedX = 1;
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
  // myBackground.newPos();
  myBackground.update();
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
      jumpSpeed = x / 8;
    }
  }
  if (wait === 0) {
    if (jumpSpeed < 0) {
      jumpSpeed += 1 / 8;
      wait = 2;
    }
  } else {
    wait--
  }
}
