const meterFill = document.getElementById('meter-fill');
const meterImage = document.getElementById('meter-image');
const resultDiv = document.getElementById('result');
const measureBtn = document.getElementById('measureBtn');
const modeBtns = document.querySelectorAll('.mode-btn');

const measureSound = new Audio('sounds/measure.mp3');
const maxSound = new Audio('sounds/max.mp3');

let currentMeter = 'meter1.png';

function getRandomPower() {
  return Math.floor(Math.random() * 101); // от 0 до 100
}

// Выбор мемометра
modeBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    currentMeter = btn.dataset.meter;
    meterImage.src = 'images/' + currentMeter;
  });
});

// Кнопка измерения
measureBtn.addEventListener('click', () => {
  const power = getRandomPower();
  meterFill.style.width = power + '%';
  measureSound.play();

  if (power < 30) {
    resultDiv.textContent = `Потужність слабка: ${power}% 💧`;
  } else if (power < 70) {
    resultDiv.textContent = `Потужність середня: ${power}% ⚡`;
  } else {
    resultDiv.textContent = `Потужність максимальна: ${power}% 🔥`;
    maxSound.play();
  }
});
