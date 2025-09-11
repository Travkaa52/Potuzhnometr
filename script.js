const menu = document.getElementById('menu');
const meterScreen = document.getElementById('meter-screen');
const measureBtn = document.getElementById('measureBtn');
const backBtn = document.getElementById('backBtn');
const meterPointer = document.getElementById('meter-pointer');
const resultDiv = document.getElementById('result');

let currentMeter = 1;

// Звуки для двух мемометров
const sounds = {
  1: ['sounds/meter1_1.mp3','sounds/meter1_2.mp3','sounds/meter1_3.mp3'],
  2: ['sounds/meter2_1.mp3','sounds/meter2_2.mp3','sounds/meter2_3.mp3']
};

// Главное меню — выбор мемометра
document.querySelectorAll('.menu-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    currentMeter = parseInt(btn.dataset.meter);
    menu.style.display = 'none';
    meterScreen.style.display = 'block';
    resultDiv.textContent = '';
    meterPointer.style.transform = 'rotate(0deg)';
  });
});

// Назад в меню
backBtn.addEventListener('click', () => {
  meterScreen.style.display = 'none';
  menu.style.display = 'block';
});

// Случайное число 0-180 градусов для стрелки
function getRandomAngle() {
  return Math.floor(Math.random() * 181);
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
  const angle = getRandomAngle();
  meterPointer.style.transform = `rotate(${angle}deg)`;
  playRandomSound();

  // Отображение результата
  const power = Math.round(angle / 180 * 100);
  if (power < 30) resultDiv.textContent = `Потужність слабка: ${power}% 💧`;
  else if (power < 70) resultDiv.textContent = `Потужність середня: ${power}% ⚡`;
  else resultDiv.textContent = `Потужність максимальна: ${power}% 🔥`;
});
