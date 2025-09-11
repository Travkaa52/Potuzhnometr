// Элементы интерфейса
const menu = document.getElementById('menu');
const meterScreen = document.getElementById('meter-screen');
const measureBtn = document.getElementById('measureBtn');
const backBtn = document.getElementById('backBtn');
const pointer = document.getElementById('pointer');
const ticksGroup = document.getElementById('ticks');
const numbersGroup = document.getElementById('numbers');
const gradient = document.getElementById('meter-gradient');
const resultDiv = document.getElementById('result');

let currentMeter = 1;

// Звуки двух мемометров (по 3 на каждый)
const sounds = {
  1: ['sounds/meter1_1.mp3','sounds/meter1_2.mp3','sounds/meter1_3.mp3'],
  2: ['sounds/meter2_1.mp3','sounds/meter2_2.mp3','sounds/meter2_3.mp3']
};

// Градиенты мемометров
const meterColors = {
  1: ['#0f0','#ff0','#f00'],
  2: ['#0ff','#f0f','#ff0']
};

// Настройки шкалы
const centerX = 150;
const centerY = 150;
const radius = 120;
const totalTicks = 20;

// Построение делений и цифр 360°
function buildScale() {
  ticksGroup.innerHTML = '';
  numbersGroup.innerHTML = '';

  for (let i = 0; i <= totalTicks; i++) {
    const angle = 2 * Math.PI * i / totalTicks;
    const cosA = Math.cos(angle);
    const sinA = Math.sin(angle);

    // Деления
    const x1 = centerX + cosA * (radius - 5);
    const y1 = centerY + sinA * (radius - 5);
    const x2 = centerX + cosA * (radius + 5);
    const y2 = centerY + sinA * (radius + 5);

    const line = document.createElementNS("http://www.w3.org/2000/svg","line");
    line.setAttribute("x1", x1);
    line.setAttribute("y1", y1);
    line.setAttribute("x2", x2);
    line.setAttribute("y2", y2);
    line.setAttribute("stroke", "#fff");
    line.setAttribute("stroke-width", "2");
    ticksGroup.appendChild(line);

    // Цифры
    const numberX = centerX + cosA * (radius + 20);
    const numberY = centerY + sinA * (radius + 20);

    const text = document.createElementNS("http://www.w3.org/2000/svg","text");
    text.setAttribute("x", numberX);
    text.setAttribute("y", numberY + 5);
    text.setAttribute("text-anchor", "middle");
    text.setAttribute("alignment-baseline", "middle");
    text.textContent = Math.round(i * (100/totalTicks));
    numbersGroup.appendChild(text);
  }
}

// Открытие выбранного мемометра
function openMeter(meterId) {
  currentMeter = meterId;
  const colors = meterColors[currentMeter];

  gradient.children[0].setAttribute('stop-color', colors[0]);
  gradient.children[1].setAttribute('stop-color', colors[1]);
  gradient.children[2].setAttribute('stop-color', colors[2]);

  pointer.style.transform = 'rotate(0rad)';
  resultDiv.textContent = '';

  menu.style.display = 'none';
  meterScreen.style.display = 'block';
}

// Назад в меню
backBtn.addEventListener('click', () => {
  meterScreen.style.display = 'none';
  menu.style.display = 'block';
});

// Генерация случайного процента мощности
function getRandomPower() {
  return Math.floor(Math.random() * 101);
}

// Движение стрелки
function movePointer(power) {
  const angle = 2 * Math.PI * power / 100;
  pointer.style.transform = `rotate(${angle}rad)`;
}

// Проигрывание случайного звука
function playRandomSound() {
  const list = sounds[currentMeter];
  const index = Math.floor(Math.random() * list.length);
  const audio = new Audio(list[index]);
  audio.play();
}

// Кнопка измерения
measureBtn.addEventListener('click', () => {
  const power = getRandomPower();
  movePointer(power);
  playRandomSound();

  if (power < 30) resultDiv.textContent = `Потужність слабка: ${power}% 💧`;
  else if (power < 70) resultDiv.text
