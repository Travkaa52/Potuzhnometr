document.addEventListener('DOMContentLoaded', () => {

  // Элементы страницы
  const menu = document.getElementById('menu');
  const meterScreen = document.getElementById('meter-screen');
  const measureBtn = document.getElementById('measureBtn');
  const backBtn = document.getElementById('backBtn');
  const pointer = document.getElementById('pointer');
  const ticksGroup = document.getElementById('ticks');
  const numbersGroup = document.getElementById('numbers');
  const gradient = document.getElementById('meter-gradient');
  const resultDiv = document.getElementById('result');

  // Текущее состояние
  let currentMeter = 1; // по умолчанию

  // Звуки (положи файлы в папку sounds/)
  const sounds = {
    1: ['sounds/meter1_1.mp3', 'sounds/meter1_2.mp3', 'sounds/meter1_3.mp3'],
    2: ['sounds/meter2_1.mp3', 'sounds/meter2_2.mp3', 'sounds/meter2_3.mp3']
  };

  // Цвета (градиенты) для мемометров
  const meterColors = {
    1: ['#0f0', '#ff0', '#f00'],   // Потужнометр
    2: ['#0ff', '#f0f', '#ff0']    // Зрадометр
  };

  // Параметры шкалы
  const centerX = 150;
  const centerY = 150;
  const radius = 120;
  const totalTicks = 20; // сколько делений вокруг круга (0..20)

  // --- Функция: строим деления и цифры по окружности ---
  function buildScale() {
    ticksGroup.innerHTML = '';
    numbersGroup.innerHTML = '';

    for (let i = 0; i <= totalTicks; i++) {
      const angle = 2 * Math.PI * i / totalTicks; // 0..2π
      const cosA = Math.cos(angle);
      const sinA = Math.sin(angle);

      // координаты для деления (короткая и длинная линия)
      const x1 = centerX + cosA * (radius - 6);
      const y1 = centerY + sinA * (radius - 6);
      const x2 = centerX + cosA * (radius + 6);
      const y2 = centerY + sinA * (radius + 6);

      const tick = document.createElementNS('http://www.w3.org/2000/svg','line');
      tick.setAttribute('x1', x1);
      tick.setAttribute('y1', y1);
      tick.setAttribute('x2', x2);
      tick.setAttribute('y2', y2);
      tick.setAttribute('stroke', '#ffffff');
      tick.setAttribute('stroke-width', i % 5 === 0 ? 3 : 1.5); // большие метки через каждые 5
      ticksGroup.appendChild(tick);

      // цифры (0..100)
      const numberX = centerX + cosA * (radius + 22);
      const numberY = centerY + sinA * (radius + 22);

      const txt = document.createElementNS('http://www.w3.org/2000/svg','text');
      txt.setAttribute('x', numberX);
      txt.setAttribute('y', numberY + 4); // небольшая корректировка
      txt.setAttribute('text-anchor', 'middle');
      txt.setAttribute('alignment-baseline', 'middle');
      txt.setAttribute('fill', '#fff');

      // округлённый процент
      const value = Math.round(i * (100 / totalTicks));
      txt.textContent = value;

      // SVG у тебя повёрнут в CSS rotate(-90deg), поэтому чтобы цифры были читабельны —
      // компенсируем поворот для текста (поворот +90deg)
      txt.setAttribute('transform', `rotate(90 ${numberX} ${numberY})`);

      numbersGroup.appendChild(txt);
    }
  }

  // строим шкалу при загрузке
  buildScale();

  // --- Функция: применяем градиент цветов для текущего мемометра ---
  function applyGradientForMeter(meterId) {
    const stops = gradient.querySelectorAll('stop');
    const colors = meterColors[meterId] || meterColors[1];
    if (stops.length >= 3) {
      stops[0].setAttribute('stop-color', colors[0]);
      stops[1].setAttribute('stop-color', colors[1]);
      stops[2].setAttribute('stop-color', colors[2]);
    } else {
      // на случай, если структура иная
      gradient.innerHTML = `
        <stop offset="0%" stop-color="${colors[0]}"/>
        <stop offset="50%" stop-color="${colors[1]}"/>
        <stop offset="100%" stop-color="${colors[2]}"/>
      `;
    }
  }

  // Установим начальный градиент
  applyGradientForMeter(currentMeter);

  // --- Управление стрелкой ---
  // В CSS для #pointer должен быть указан transform-origin: 150px 150px; и transition: transform ...;
  function setPointerDeg(deg) {
    // используем CSS трансформ (deg) — тогда анимация через transition сработает
    pointer.style.transform = `rotate(${deg}deg)`;
  }

  function resetPointer() {
    setPointerDeg(0);
  }

  // --- Воспроизведение звука (без блокировок) ---
  function playRandomSoundForMeter(meterId) {
    const list = sounds[meterId] || sounds[1];
    if (!list || list.length === 0) return;
    const idx = Math.floor(Math.random() * list.length);
    const audio = new Audio(list[idx]);
    // попытка проиграть — подавляем возможную ошибку автоплей-браузера
    audio.play().catch(() => {/* silent */});
  }

  // --- Открытие экрана выбранного мемометра ---
  function openMeter(meterId) {
    currentMeter = meterId;
    applyGradientForMeter(currentMeter);
    resetPointer();
    resultDiv.textContent = '';
    menu.style.display = 'none';
    meterScreen.style.display = 'block';
  }

  // --- Обработчики кнопок меню ---
  const menuButtons = document.querySelectorAll('.menu-btn');
  menuButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const id = Number(btn.dataset.meter) || 1;
      openMeter(id);
    });
  });

  // Назад
  backBtn.addEventListener('click', () => {
    meterScreen.style.display = 'none';
    menu.style.display = 'block';
  });

  // --- Генерация случайной мощности и движение стрелки ---
  function getRandomPower() {
    return Math.floor(Math.random() * 101); // 0..100
  }

  function movePointerByPower(power) {
    // преобразуем процент в градусы 0..360
    const deg = power / 100 * 360;
    // Для приятной анимации — можно добавить небольшой рандомизатор скорости/ easing в CSS
    setPointerDeg(deg);
  }

  // Кнопка измерения
  measureBtn.addEventListener('click', () => {
    // Генерируем мощность
    const power = getRandomPower();
    // Двигаем стрелку
    movePointerByPower(power);
    // Проигрываем звук для текущего мемометра
    playRandomSoundForMeter(currentMeter);

    // Отображаем текст результата внизу
    if (currentMeter === 1) resultDiv.textContent = `Потужність: ${power}%`;
    else resultDiv.textContent = `Рівень зради: ${power}%`;
  });

  // Сброс при загрузке
  resetPointer();

});
