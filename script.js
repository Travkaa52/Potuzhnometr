const meterFill = document.getElementById('meter-fill');
const resultDiv = document.getElementById('result');
const measureBtn = document.getElementById('measureBtn');
const modeBtns = document.querySelectorAll('.mode-btn');

// Звуки для двух мемометров
const sounds = {
  1: ['sounds/meter1_1.mp3', 'sounds/meter1_2.mp3', 'sounds/meter1_3.mp3'],
  2: ['sounds/meter2_1.mp3', 'sounds/meter2_2.mp3', 'sounds/meter2_3.mp3']
};

let currentMeter = 1;
let colors = ['#0f0','#ff0','#f00'];

// Смена мемометра
modeBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    currentMeter = parseInt(btn.dataset.meter);
    colors = btn.dataset.colors.split(',');
    meterFill.style.background = `linear-gradient(to right, ${colors.join(',')})`;
  });
});

// Случайное число от 0 до 100
function getRandomPower() {
  return Math.floor(Math.random() * 101);
}

// Проигрывание случайного звука текущего мемометра
function playRandomSound() {
  const list = sounds[currentMeter];
  const index = Math.floor(Math.random() * list.length);
  const audio = new Audio(list[index]);
  audio.play();
}

// Кнопка измерения
measureBtn.addEventListener('click', () => {
  const power = getRandomPower();
  meterFill.style.width = power + '%';

  playRandomSound();

  if (power < 30) resultDiv.textContent = `Потужність слабка: ${power}% 💧`;
  else if (power < 70) resultDiv.textContent = `Потужність середня: ${power}% ⚡`;
  else resultDiv.textContent = `Потужність максимальна: ${power}% 🔥`;
});
