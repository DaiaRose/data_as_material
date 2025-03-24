let words = [];
let rectangles = [];

fetch(`/api/post/${postSlug}`)
  .then(response => response.json())
  .then(data => {
    words = data;
    console.log("✅ Loaded word array:", words);
    setupWordMagnets(); // Trigger layout once words are ready
  })
  .catch(error => {
    console.error("Error fetching word array:", error);
  });

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function setupWordMagnets() {
  let startX = 50;
  let startY = 50;
  let spacingY = 20;
  let spacingX = 10;
  let currentX = startX;
  let currentY = startY;
  let maxRowHeight = 0;

  rectangles = []; // Clear any old ones

  textSize(16);
  
  for (let i = 0; i < words.length; i++) {
    let word = words[i];

    let wordWidth = textWidth(word) + 30;
    let wordHeight = 30;

    if (currentX + wordWidth > width - 50) {
      currentX = startX;
      currentY += maxRowHeight + spacingY;
      maxRowHeight = 0;
    }

    rectangles.push(new DraggableRect(currentX, currentY, word));

    currentX += wordWidth + spacingX;
    maxRowHeight = max(maxRowHeight, wordHeight);

    if (currentY + wordHeight > height - 50) {
      break;
    }
  }
}

function draw() {
  background(240);

  for (let rect of rectangles) {
    rect.update();
    rect.show();
  }
}

function mousePressed() {
  for (let rect of rectangles) {
    rect.pressed();
  }
}

function mouseReleased() {
  for (let rect of rectangles) {
    rect.released();
  }
}

class DraggableRect {
  constructor(x, y, label) {
    this.x = x;
    this.y = y;
    this.label = label;
    this.h = 40;
    this.padding = 15;

    textSize(16);
    this.w = textWidth(this.label) + this.padding * 2;

    this.dragging = false;
    this.offsetX = 0;
    this.offsetY = 0;
  }

  update() {
    if (this.dragging) {
      this.x = mouseX + this.offsetX;
      this.y = mouseY + this.offsetY;
    }
  }

  show() {
    noStroke();
    fill(this.dragging ? 200 : 255);
    rect(this.x, this.y, this.w, this.h, 5);

    stroke(0);
    strokeWeight(1);
    line(this.x, this.y, this.x + this.w, this.y);
    line(this.x, this.y, this.x, this.y + this.h);

    strokeWeight(2.5);
    line(this.x + 1, this.y + this.h - 1, this.x + this.w, this.y + this.h - 1);
    line(this.x + this.w, this.y + 1, this.x + this.w, this.y + this.h - 2);

    noStroke();
    fill(0);
    textSize(16);
    textAlign(CENTER, CENTER);
    text(this.label, this.x + this.w / 2, this.y + this.h / 2);
  }

  pressed() {
    if (
      mouseX > this.x &&
      mouseX < this.x + this.w &&
      mouseY > this.y &&
      mouseY < this.y + this.h
    ) {
      this.dragging = true;
      this.offsetX = this.x - mouseX;
      this.offsetY = this.y - mouseY;
    }
  }

  released() {
    this.dragging = false;
  }
}
