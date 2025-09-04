const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
const scoreDisplay = document.getElementById("score");
const levelDisplay = document.getElementById("level");
const messageDisplay = document.getElementById("message");

let level = 1;
let score = 0;
let circles = [];
let arrows = [];
let circleHit = [];
let hoverIndex = -1;

function initLevel() {
  messageDisplay.textContent = "";
  const baseRadius = Math.max(20, 35 - (level - 1) * 3); 
  const arrowSpeed = -3 - (level - 1); 

  circles = [
    { x: 100, y: 80, radius: baseRadius, color: "red", hitColor: "pink", label: "Circle 1" },
    { x: 100, y: 180, radius: baseRadius, color: "blue", hitColor: "lightblue", label: "Circle 2" },
    { x: 100, y: 280, radius: baseRadius, color: "green", hitColor: "lightgreen", label: "Circle 3" },
    { x: 100, y: 380, radius: baseRadius, color: "orange", hitColor: "moccasin", label: "Circle 4" }
  ];

  arrows = [
    { x: 700, y: 80, dx: arrowSpeed, active: false, label: "Arrow 1" },
    { x: 700, y: 180, dx: arrowSpeed, active: false, label: "Arrow 2" },
    { x: 700, y: 280, dx: arrowSpeed, active: false, label: "Arrow 3" },
    { x: 700, y: 380, dx: arrowSpeed, active: false, label: "Arrow 4" }
  ];
  circleHit = [false, false, false, false];

  levelDisplay.textContent = `Level: ${level}`;
    updateScore();
}

function drawCircles() {
    circles.forEach((c, i) => {
      ctx.beginPath();
      ctx.arc(c.x, c.y, c.radius, 0, Math.PI * 2);
      ctx.fillStyle = circleHit[i] ? c.hitColor : c.color;
      ctx.fill();

      if (hoverIndex === i && !circleHit[i]) {
        ctx.lineWidth = 3;
        ctx.strokeStyle = "black";
      } else {
        ctx.lineWidth = 1;
        ctx.strokeStyle = "gray";
      }
      ctx.stroke();
      ctx.fillStyle = "black";
      ctx.font = "14px Arial";
      ctx.fillText(c.label, c.x - 25, c.y - 40);
    });
}

function drawArrows() {
    arrows.forEach((a, i) => {
      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(a.x - 40, a.y);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(a.x, a.y);
      ctx.lineTo(a.x - 10, a.y - 10);
      ctx.lineTo(a.x - 10, a.y + 10);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = "black";
      ctx.font = "14px Arial";
      ctx.fillText(a.label, a.x - 50, a.y - 15);
    });
}

function updateArrows() {
    arrows.forEach((a, i) => {
      if (a.active && !circleHit[i]) {
        a.x += a.dx;
        let dx = a.x - circles[i].x;
        if (dx <= circles[i].radius + 5) {
          circleHit[i] = true;
          a.active = false;
          score++;
          updateScore();

        if (circleHit.every(hit => hit)) {
        nextLevel();
        }
      }
    }
  });
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawCircles();
  drawArrows();
  updateArrows();
  requestAnimationFrame(draw);
}

function updateScore() {
  scoreDisplay.textContent = `Score: ${score}`;
}

function nextLevel() {
  messageDisplay.textContent = `🎉 Level ${level} Completed!`;
  setTimeout(() => {
  level++;
  initLevel();
  }, 1500);
}

canvas.addEventListener("click", function (event) {
const rect = canvas.getBoundingClientRect();
const mouseX = event.clientX - rect.left;
const mouseY = event.clientY - rect.top;

circles.forEach((c, i) => {
    const dist = Math.sqrt((mouseX - c.x) ** 2 + (mouseY - c.y) ** 2);
    if (dist <= c.radius && !circleHit[i]) {
      arrows[i].active = true;
   }
  });
});

canvas.addEventListener("mousemove", function (event) {
    const rect = canvas.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;

    hoverIndex = -1;
    circles.forEach((c, i) => {
    const dist = Math.sqrt((mouseX - c.x) ** 2 + (mouseY - c.y) ** 2);
    if (dist <= c.radius && !circleHit[i]) {
      hoverIndex = i;
   }
  });
});

function resetGame() {
  level = 1;
  score = 0;
  initLevel();
}
initLevel();    
draw();