// Элементы интерфейса
const menu = document.getElementById('menu');
const meterScreen = document.getElementById('meter-screen');
const measureBtn = document.getElementById('measureBtn');
const backBtn = document.getElementById('backBtn');
const meterPointer = document.getElementById('meter-pointer');
const meterCircle = document.getElementById('meter-circle');
const resultDiv = document.getElementById('result');

let currentMeter = 1;

// Звуки
const sounds = {
  1: ['sounds/meter1_1.mp3','sounds/meter1_2.mp3','sounds/meter1_3.mp3'],
  2: ['sounds/meter2_1.mp3','sounds/meter2_2.mp3','sounds/meter2_3.mp3']
};

// Цвета мемометров
const meterColors = {
  1: ['#0f0','#ff0','#f00'],
  2: ['#0ff','#f0f','#ff0']
};

// Функция открытия выбранного мемометра
function openMeter(meterId) {
  currentMeter = meterId;
  const colors = meterColors[currentMeter];
  meterCircle.style.background = `conic-gradient(${colors[0]} 0%, ${colors[1]} 50%, ${colors[2]} 100%)`;
  meterPointer.style.transform = 'rotate(0deg)';
  resultDiv.textContent = '';

  menu.style.display = 'none';
  meterScreen.style.display = 'block';
}

// Привязка кнопок меню
document.querySelectorAll('.menu-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const meterId = parseInt(btn.dataset.meter);
    openMeter(meterId);
  });
});

// Назад в меню
backBtn.addEventListener('click', () => {
  meterScreen.style.display = 'none';
  menu.style.display = 'block';
});

// Генерация случайного угла стрелки
function getRandomAngle() {
  return Math.floor(Math.random() * 181);
}

// Проигрывание случайного звука мемометра
function playRandomSound() {
  const list = sounds[currentMeter];
  const index = Math.floor(Math.random() * list.length);
  const audio = new Audio(list[index]);
  audio.play();
}

// Кнопка измерения
measureBtn.addEventListener('click', () => {
  const angle = getRandomAngle();
  meterPointer.style.transform = `rotate(${angle}deg)`;
  playRandomSound();

  const power = Math.round(angle / 180 * 100);
  if (power < 30) resultDiv.textContent = `Потужність слабка: ${power}% 💧`;
  else if (power < 70) resultDiv.textContent = `Потужність середня: ${power}% ⚡`;
  else resultDiv.textContent = `Потужність максимальна: ${power}% 🔥`;
});
