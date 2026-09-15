
let canvas = document.getElementById("spaceCanvas");
let ctx = canvas.getContext("2d");
let hero = document.querySelector(".hero-section");

function resizeCanvas() {
  canvas.width = hero.clientWidth;
  canvas.height = hero.clientHeight;
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);

const starColors = ["#ffffff", "#f038ff", "#b552ff", "#091c3d"];

let stars = [];

for (let i = 0; i < 200; i++) {
  stars.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    radius: Math.random() * 1.5,
    alpha: Math.random(),
    speed: 0.01,
    color: starColors[Math.floor(Math.random() * starColors.length)],
  });
}

function drawStars() {
  stars.forEach((star) => {
    star.alpha += star.speed;

    if (star.alpha > 1 || star.alpha < 0) {
      star.speed = -star.speed;
    }

    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    ctx.globalAlpha = Math.abs(star.alpha);
    ctx.fillStyle = star.color;
    ctx.fill();
    ctx.globalAlpha = 1;
  });


}

class meteor {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = Math.random() * (canvas.width + 150);
    this.y = -50;
    this.length = 60 + Math.random() * 40;
    this.speed = 2 + Math.random() * 3;
  }

  update() {
    this.x -= this.speed;
    this.y += this.speed;

    if (this.y > canvas.height + 50 || this.x < -100) {
      this.reset();
    }
  }

  draw() {
    const tailX = this.x + this.length;
    const tailY = this.y - this.length;

    const gradient = ctx.createLinearGradient(this.x, this.y, tailX, tailY);
    gradient.addColorStop(0, "#ffffff");
    gradient.addColorStop(0.3, "rgba(240, 56, 255, 0.8)");
    gradient.addColorStop(1, "rgba(240, 56, 255, 0)");

    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(tailX, tailY);
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = gradient;
    ctx.stroke();
  }
}


const meteors = [];
for (let i = 0; i < 5; i++) {
  meteors.push(new meteor());
}



class Spaceship {
  constructor() {
    this.reset(true);
  }

  reset(isFirstSpawn = false) {
    this.active = false;

    this.cooldown = isFirstSpawn ? 60 * 5 : 60 * 120;

    this.x = -60;
    this.baseY = Math.random() * (canvas.height * 0.6) + 50;
    this.y = this.baseY;

    this.baseAngle = (Math.random() * 20 - 10) * (Math.PI / 180);
    this.speed = 2;

    this.waveTime = 0;
    this.waveSpeed = 0.02;
    this.waveAmplitude = 12;
    this.currentRenderAngle = this.baseAngle;
  }

  update() {
    if (!this.active) {
      this.cooldown--;
      if (this.cooldown <= 0) this.active = true;
      return;
    }

    this.x += Math.cos(this.baseAngle) * this.speed;
    this.baseY += Math.sin(this.baseAngle) * this.speed;

    this.waveTime += this.waveSpeed;
    const newY = this.baseY + Math.sin(this.waveTime) * this.waveAmplitude;

    const dx = Math.cos(this.baseAngle) * this.speed;
    const dy = newY - this.y;
    this.currentRenderAngle = Math.atan2(dy, dx);
    this.y = newY;

    if (this.x > canvas.width + 100 || this.y > canvas.height + 100 || this.y < -100) {
      this.reset();
    }
  }

draw() {
    if (!this.active) return;

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.currentRenderAngle);

    // ==========================================
    // الصحن الطائر (UFO) - بألوان نيون متدرجة
    // ==========================================

    // 1. أضواء النيون السفلية المتوهجة (أزرق سيان نيون)
    ctx.shadowColor = "#00f3ff";
    ctx.shadowBlur = 12;

    // أضواء تحكم صغيرة في القاعدة
    const lightPositions = [-12, -4, 4, 12];
    lightPositions.forEach((lx) => {
      ctx.beginPath();
      ctx.arc(lx, 3, 2, 0, Math.PI * 2);
      ctx.fillStyle = "#00f3ff";
      ctx.fill();
    });

    // 2. الهيكل المعدني البيضاوي السفلي (تدرج بين السيان والأرجواني)
    const bodyGradient = ctx.createLinearGradient(-22, 0, 22, 0);
    bodyGradient.addColorStop(0, "#00f3ff");
    bodyGradient.addColorStop(0.5, "#ffffff");
    bodyGradient.addColorStop(1, "#b552ff");

    ctx.beginPath();
    ctx.ellipse(0, 1, 24, 7, 0, 0, Math.PI * 2);
    ctx.fillStyle = bodyGradient;
    ctx.shadowColor = "#00f3ff";
    ctx.shadowBlur = 15;
    ctx.fill();

    const domeGradient = ctx.createRadialGradient(0, -6, 2, 0, -4, 10);
    domeGradient.addColorStop(0, "#ffffff");
    domeGradient.addColorStop(0.6, "#f038ff");
    domeGradient.addColorStop(1, "rgba(181, 82, 255, 0.8)");

    ctx.beginPath();
    ctx.arc(0, -3, 10, Math.PI, 0); 
    ctx.fillStyle = domeGradient;
    ctx.shadowColor = "#f038ff";
    ctx.shadowBlur = 18;
    ctx.fill();

    ctx.beginPath();
    ctx.arc(-3, -7, 3, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255, 255, 255, 0.7)";
    ctx.shadowBlur = 0;
    ctx.fill();

    ctx.restore();
  }
}


const singleShip = new Spaceship();




function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawStars();

  meteors.forEach((m) => {
    m.update();
    m.draw();
  });


  singleShip.update();
  singleShip.draw();

  requestAnimationFrame(animate);

}

animate();

const spaceship = new Spaceship();



async function getSpaceData() {
  const response = await fetch("data.json");
  const data = await response.json();

  let cardParent = document.getElementById("cardParent");

  const random4 = [...data].sort(() => Math.random() - 0.5).slice(0, 4);;
  cardParent.innerHTML = random4
    .map((pho) => {
      return `<a href="details.html?id=${pho.id}">
                <img src="${pho.img}" alt="phonomena img">
                <span>${pho.title}</span>
            </a>`;
    })
    .join("");
}

getSpaceData();

const exploreButton = document.getElementById("exploreButton");
const phenomenaTitle = document.getElementById("phenomenaTitle");

if (exploreButton && phenomenaTitle) {
  exploreButton.addEventListener("click", () => {
    phenomenaTitle.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  });
}

let conceptsParent = document.getElementById("conceptsParent");

async function loadConcepts() {
  if (!conceptsParent) return;

  try {
    const response = await fetch("./concepts.json");
    const conceptsData = await response.json();
    const random4 = [...conceptsData].sort(() => Math.random() - 0.5).slice(0, 3);

    conceptsParent.innerHTML = random4.map((item) => {
        return `
      <div class="concept-card" onclick="window.location.href='concepts.html'">
        <img src="${item.image}" alt="${item.name}" class="concept-card-img" />
        <div class="concept-card-body">
          <h3>${item.name}</h3>
          <p class="tagline">${item.tagline}</p>
          <p class="desc">${item.description.substring(0, 85)}...</p>
        </div>
      </div>
    `;
      }).join("");
  } catch (error) {
    console.error("failed to load concepts data", error);
  }
}

loadConcepts();

const menuToggle = document.querySelector(".menu-toggle");
const mainMenu = document.getElementById("main-menu");

if (menuToggle && mainMenu) {
  menuToggle.addEventListener("click", () => {
    const isOpen = mainMenu.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  });

  document.addEventListener("click", (event) => {
    if (!mainMenu.contains(event.target) && !menuToggle.contains(event.target)) {
      mainMenu.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open menu");
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      mainMenu.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open menu");
      menuToggle.focus();
    }
  });
}
