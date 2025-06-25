let bgImg, blacksheepImg, herd1, herd2, herd3;
let blackSheep;
let whiteSheep = [];

function preload() {
  bgImg = loadImage('assets/background-typeface.jpg');
  herd1 = loadImage('assets/herd-1.png');
  herd2 = loadImage('assets/herd-2.png');
  herd3 = loadImage('assets/herd3.png');
  blacksheepImg = loadImage('assets/blacksheep.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  imageMode(CORNER);

  textSize(48);
  fill(255);

  blackSheep = {
    x: 2500,
    y: 200,
    w: 300,
    h: 300,
    speed: 5,
    vx: 0,
    vy: 0,
    rotation: 0
  };

  whiteSheep = [
    { img: herd1, x: 300, y: 10, w: 700, h: 900, speed: 10, vx: 0, vy: 0, rotation: 0 },
    { img: herd2, x: 2500, y: 1000, w: 700, h: 900, speed: 10, vx: 0, vy: 0, rotation: 0 },
    { img: herd3, x: 100, y: 1000, w: 700, h: 900, speed: 10, vx: 0, vy: 0, rotation: 0 }
  ];
}

function draw() {
  image(bgImg, 0, 0, width, height);

  // Reset black sheep velocity
  blackSheep.vx = 0;
  blackSheep.vy = 0;

  if (keyIsDown(87)) blackSheep.vy -= blackSheep.speed; // W
  if (keyIsDown(83)) blackSheep.vy += blackSheep.speed; // S
  if (keyIsDown(65)) blackSheep.vx -= blackSheep.speed; // A
  if (keyIsDown(68)) blackSheep.vx += blackSheep.speed; // D

  blackSheep.x += blackSheep.vx;
  blackSheep.y += blackSheep.vy;

  blackSheep.x = constrain(blackSheep.x, 0, width - blackSheep.w);
  blackSheep.y = constrain(blackSheep.y, 0, height - blackSheep.h);

  if (blackSheep.vx !== 0 || blackSheep.vy !== 0) {
    blackSheep.rotation = atan2(blackSheep.vy, blackSheep.vx);
  }

  // Move and rotate white sheep
  for (let sheep of whiteSheep) {
    let d = dist(blackSheep.x, blackSheep.y, sheep.x, sheep.y);

    if (d < 600) {
      let angle = atan2(sheep.y - blackSheep.y, sheep.x - blackSheep.x);
      sheep.vx = cos(angle) * sheep.speed;
      sheep.vy = sin(angle) * sheep.speed;
      sheep.x += sheep.vx;
      sheep.y += sheep.vy;
      sheep.rotation = angle;
    } else {
      sheep.vx = 0;
      sheep.vy = 0;
    }

    sheep.x = constrain(sheep.x, 0, width - sheep.w);
    sheep.y = constrain(sheep.y, 0, height - sheep.h);
  }

  // Collision avoidance between white sheep
  for (let i = 0; i < whiteSheep.length; i++) {
    for (let j = i + 1; j < whiteSheep.length; j++) {
      let a = whiteSheep[i];
      let b = whiteSheep[j];

      let dx = b.x - a.x;
      let dy = b.y - a.y;
      let distance = dist(a.x, a.y, b.x, b.y);
      let minDist = (a.w + b.w) / 4; // Adjust this based on image size

      if (distance < minDist) {
        // Push away from each other
        let angle = atan2(dy, dx);
        let overlap = (minDist - distance) / 5;
        a.x -= cos(angle) * overlap;
        a.y -= sin(angle) * overlap;
        b.x += cos(angle) * overlap;
        b.y += sin(angle) * overlap;
      }
    }
  }

  // Draw white sheep with rotation
  for (let sheep of whiteSheep) {
    push();
    translate(sheep.x + sheep.w / 2, sheep.y + sheep.h / 2);
    rotate(sheep.rotation);
    imageMode(CENTER);
    image(sheep.img, 0, 0, sheep.w, sheep.h);
    imageMode(CORNER);
    pop();
  }

  // Draw black sheep last
  push();
  translate(blackSheep.x + blackSheep.w / 2, blackSheep.y + blackSheep.h / 2);
  rotate(blackSheep.rotation);
  imageMode(CENTER);
  image(blacksheepImg, 0, 0, blackSheep.w, blackSheep.h);
  imageMode(CORNER);
  pop();
}
