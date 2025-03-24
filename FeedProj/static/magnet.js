let rectangles = [];

fetch(`/api/post/${postSlug}`)
  .then(response => response.json())
  .then(data => {
    const titleWords = postTitle.split(/\s+/);
    const bodyWords = data;

    console.log("✅ Title words:", titleWords);
    console.log("✅ Body words:", bodyWords);

    setupWordMagnets(titleWords, bodyWords);
  })
  .catch(error => {
    console.error("Error fetching word array:", error);
  });

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function setupWordMagnets(titleWords, bodyWords) {
  let startX = 50;
  let startY = 50;
  let spacingY = 60; // Vertical spacing between rows
  let spacingX = 10; // Horizontal spacing between words
  let currentX = startX;
  let currentY = startY;
  let maxRowHeight = 0; // Track tallest word in row for spacing

  textSize(16);

  function placeWords(words, type) {
    for (let word of words) {
      const fontSize = type === 'title' ? 28 : 16;
      textSize(fontSize);
      const wordWidth = textWidth(word) + 30;
      const wordHeight = fontSize + 24;

      // Move to next row if word doesn't fit
      if (currentX + wordWidth > width - 50) {
        currentX = startX;
        currentY += maxRowHeight + spacingY;
        maxRowHeight = 0;
      }

      rectangles.push(new DraggableRect(currentX, currentY, word, type));
      currentX += wordWidth + spacingX;
      maxRowHeight = max(maxRowHeight, wordHeight);
    }
  }

  placeWords(titleWords, 'title');
  placeWords(bodyWords, 'body');
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
  constructor(x, y, label, type = 'body') {
    this.x = x;
    this.y = y;
    this.label = label;
    this.type = type;
    this.h = type === 'title' ? 50 : 40;
    this.padding = 15;

    textSize(this.type === 'title' ? 28 : 16);
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
    textSize(this.type === 'title' ? 28 : 16);
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
