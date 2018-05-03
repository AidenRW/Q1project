var myGamePiece;
var myBackground;

function startGame() {
  myGamePiece = new component(220, 280, "samus4.png", 250, 380, "image");
  myBackground = new component(600, 750, "clocktower.png", 0, -120, "background");
  myBackground.gravity = -0.05;
  myFloor = new component(600, 400, "https://i.stack.imgur.com/6aRAd.png", 0, 500, "background");
  myFloor.gravity = -0.05;
  myBound = new component(600, 30, "green", 0, 700);
  myBound.gravity = -0.05;
  myGameArea.start();
}

var myGameArea = {
  canvas: document.createElement("canvas"),
  start: function() {
    this.canvas.width = 1000;
    this.canvas.height = 1000;
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
    this.gravitySpeed += this.gravity;
    this.x += this.speedX;
    this.y += this.speedY + this.gravitySpeed;
    if (this.type == "background") {
      if (this.x == -(this.width)) {
        this.x = 0;
      }
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
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
}

var jumpSpeed = 0;
var wait = 2;
var jumpApex = false;
var jumpHold = 0;
var floor = false;

function updateGameArea() {
  jump();
  if (myFloor.y < 500 && floor === false) {
    jumpSpeed = 0;
    jumpHold = 0;
    floor = true;
  }
  if (myGamePiece.collide(myBound)) {
    myBound.gravitySpeed = 0;
    myBackground.gravitySpeed = 0;
    myFloor.gravitySpeed = 0;
  }
  myGameArea.clear();
  myBackground.speedX = 0;
  myFloor.speedX = 0;
  myBackground.speedY = -jumpSpeed / 2;
  myFloor.speedY = -jumpSpeed;
  if (myGameArea.keys && myGameArea.keys[37]) {
    myBackground.speedX = 3;
    myFloor.speedX = 5;
  }
  if (myGameArea.keys && myGameArea.keys[39]) {
    myBackground.speedX = -3;
    myFloor.speedX = -5;
  }
  if (myGameArea.keys && myGameArea.keys[38]) {
    jumpHold++;
    jump(-10);
  }
  if (myGameArea.keys && myGameArea.keys[40]) {}
  myBackground.newPos();
  myBackground.update();
  myFloor.newPos();
  myFloor.update();
  myGamePiece.newPos();
  myGamePiece.update();
  myBound.newPos();
  myBound.update();

}

function jump(x) {
  if (jumpHold < 20) {
    if (x <= 0) {
      jumpSpeed = x;
    }
  }
  if (jumpSpeed === 11) {
    jumpApex = false;
  }
  if (wait === 0) {
    if (jumpSpeed < 0 && jumpApex === false) {
      jumpSpeed++;
      jumpApex = true;
      wait = 2;
    }
    if (jumpSpeed <= 11 && jumpApex === true) {
      floor = false;
      jumpSpeed++;
      wait = 2;
    }
  } else {
    wait--
  }
}
