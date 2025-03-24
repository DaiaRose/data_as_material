// Global variables
let rectangles = [];
let navButton;
let backImg;
let dataLoaded = false;  // Track if words have loaded

// Preload the back button image using the URL passed from post.html
function preload() {
  backImg = loadImage(backImageUrl);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont('Arial');

  // Fetch the body words from your API endpoint and then set up magnets
  fetch(`/api/post/${postSlug}`)
    .then(response => response.json())
    .then(data => {
      const titleWords = postTitle.split(/\s+/);
      const bodyWords = data;
      
      console.log("✅ Title words:", titleWords);
      console.log("✅ Body words:", bodyWords);
      
      setupWordMagnets(titleWords, bodyWords);
      dataLoaded = true;
    })
    .catch(error => {
      console.error("Error fetching word array:", error);
    });
    
  // Create the navigation button (non-draggable)
  navButton = new NavButton(10, 10, backImg, () => {
    window.location.href = "/";
  });
}

// Helper function to wrap words into lines
function wrapWords(words, maxWidth, spacingX) {
  let lines = [];
  let currentLine = [];
  let currentLineWidth = 0;
  for (let word of words) {
    // Calculate width of the word (with padding of 30)
    let wordWidth = textWidth(word) + 30;
    if (currentLine.length === 0) {
      currentLine.push(word);
      currentLineWidth = wordWidth;
    } else {
      if (currentLineWidth + spacingX + wordWidth <= maxWidth) {
        currentLine.push(word);
        currentLineWidth += spacingX + wordWidth;
      } else {
        lines.push({ words: currentLine, lineWidth: currentLineWidth });
        currentLine = [word];
        currentLineWidth = wordWidth;
      }
    }
  }
  if (currentLine.length > 0) {
    lines.push({ words: currentLine, lineWidth: currentLineWidth });
  }
  return lines;
}

function setupWordMagnets(titleWords, bodyWords) {
  let spacingX = 10;
  let margin = 70;
  let titleFontSize = 28;
  textSize(titleFontSize);
  // Maximum width for title magnets (leaving margins)
  let maxTitleWidth = width - 2 * margin;
  
  // Wrap title words into lines if needed
  let titleLines = wrapWords(titleWords, maxTitleWidth, spacingX);
  let titleStartY = 20;
  // Increase line spacing so that multiple lines don't overlap:
  let lineSpacing = titleFontSize + 30;  // Adjust the extra spacing as needed
  
  // Place title magnets line by line, centering each line
  for (let i = 0; i < titleLines.length; i++) {
    let line = titleLines[i];
    // Compute starting X so that this line is centered
    let lineStartX = (width - line.lineWidth) / 2;
    let lineY = titleStartY + i * lineSpacing;  // Each line is lineSpacing lower than the previous line
    for (let word of line.words) {
      let wordWidth = textWidth(word) + 30;
      rectangles.push(new DraggableRect(lineStartX, lineY, word, 'title'));
      lineStartX += wordWidth + spacingX;
    }
  }
  
  // --- Place Body Magnets (Starting on a New Line) ---
  let bodyStartX = 50;
  // Set bodyStartY below the title lines
  let bodyStartY = titleStartY + titleLines.length * lineSpacing + 30;
  let currentX = bodyStartX;
  let currentY = bodyStartY;
  let maxRowHeight = 0;
  textSize(16);
  
  for (let word of bodyWords) {
    let wordWidth = textWidth(word) + 30;
    let wordHeight = 16 + 24;
    // Wrap to next line if necessary
    if (currentX + wordWidth > width - 50) {
      currentX = bodyStartX;
      currentY += maxRowHeight + 20;  // vertical spacing between rows
      maxRowHeight = 0;
    }
    rectangles.push(new DraggableRect(currentX, currentY, word, 'body'));
    currentX += wordWidth + spacingX;
    maxRowHeight = max(maxRowHeight, wordHeight);
  }
}



  
//   // Place title and body magnets
//   placeWords(titleWords, 'title');
//   placeWords(bodyWords, 'body');
// }

function draw() {
  background(240);
  
  // Optionally, display a "Loading..." text until data is ready.
  if (!dataLoaded) {
    fill(0);
    textSize(24);
    textAlign(CENTER, CENTER);
    text("News Magnets Loading...", width / 2, height / 2);
  }
  
  // Draw all draggable magnets
  for (let rect of rectangles) {
    rect.update();
    rect.show();
  }
  
  // Draw the navigation button on top
  navButton.show();
}

// Mouse interaction functions – pass these events to each draggable element and the nav button
function mousePressed() {
  for (let rect of rectangles) {
    rect.pressed();
  }
  navButton.pressed();
}

function mouseReleased() {
  for (let rect of rectangles) {
    rect.released();
  }
}

// DraggableRect class for text magnets
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
    
    // For click detection
    this.initialX = 0;
    this.initialY = 0;
    
    this.dragging = false;
    this.offsetX = 0;
    this.offsetY = 0;
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
      this.initialX = mouseX;
      this.initialY = mouseY;
    }
  }
  
  released() {
    this.dragging = false;
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
    
    // Draw borders for visual effect
    stroke(0);
    strokeWeight(1);
    line(this.x, this.y, this.x + this.w, this.y); // top
    line(this.x, this.y, this.x, this.y + this.h); // left
    strokeWeight(2.5);
    line(this.x + 1, this.y + this.h - 1, this.x + this.w, this.y + this.h - 1); // bottom
    line(this.x + this.w, this.y + 1, this.x + this.w, this.y + this.h - 2); // right
    
    noStroke();
    fill(0);
    textSize(this.type === 'title' ? 28 : 16);
    textAlign(CENTER, CENTER);
    text(this.label, this.x + this.w / 2, this.y + this.h / 2);
  }
}

// NavButton class for a static, clickable image button
class NavButton {
  constructor(x, y, img, action) {
    this.x = x;
    this.y = y;
    this.img = img;
    this.action = action;
    // Set a fixed height and calculate width to preserve aspect ratio
    this.h = 68;
    this.w = this.img.width * (this.h / this.img.height);
  }
  
  pressed() {
    if (
      mouseX > this.x &&
      mouseX < this.x + this.w &&
      mouseY > this.y &&
      mouseY < this.y + this.h
    ) {
      this.action();
    }
  }
  
  update() {
    // No update logic needed since it's static
  }
  
  show() {
    image(this.img, this.x, this.y, this.w, this.h);
  }
}

