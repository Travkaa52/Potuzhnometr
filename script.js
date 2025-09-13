<script>
document.addEventListener("DOMContentLoaded", () => {
  /* ---------- Константы ---------- */
  const powerPoints = [80, 89, 98];          // фиксированные значения мощности
  const totalTicks  = 50;
  const meterWidth  = 310;

  /* ---------- Элементы DOM ---------- */
  const menu         = document.getElementById("menu");
  const meterScreen  = document.getElementById("meter-screen");
  const measureBtn   = document.getElementById("measureBtn");
  const backBtn      = document.getElementById("backBtn");
  const pointer      = document.getElementById("pointer");
  const ticksGroup   = document.getElementById("ticks");
  const resultDiv    = document.getElementById("result");
  const previewImg   = document.getElementById("preview-img");
  const explosionGif = document.getElementById("explosion-gif");

  let currentMeter = 1;

  /* ---------- Звуки для каждой точки мощности ---------- */
  const sounds = {
    1: { 80: "sounds/meter1_3.mp3",
         89: "sounds/meter1_2.mp3",
         98: "sounds/meter1_1.mp3" },
    2: { 80: "sounds/meter2_1.mp3",
         89: "sounds/meter2_2.mp3",
         98: "sounds/meter2_3.mp3" }
  };

  /* ---------- Построение шкалы ---------- */
  function buildScale() {
    ticksGroup.innerHTML = "";
    for (let i = 0; i <= totalTicks; i++) {
      const tick = document.createElement("div");
      tick.style.height = i % 5 === 0 ? "60px" : "45px";

      if      (i < 11) tick.style.background = "#ffd010"; // жёлтый
      else if (i < 22) tick.style.background = "#00ff09"; // зелёный
      else if (i < 33) tick.style.background = "#00ffff"; // голубой
      else if (i < 44) tick.style.background = "#ff4500"; // красный
      else             tick.style.background = "#000000"; // чёрный

      ticksGroup.appendChild(tick);
    }
  }
  buildScale();

  /* ---------- Логика измерения ---------- */
  // возвращает одно из трёх фиксированных значений
  function getRandomPower() {
    const idx = Math.floor(Math.random() * powerPoints.length);
    return powerPoints[idx];
  }

  function setPointer(power) {
    const left = (power / 100) * meterWidth;
    pointer.style.left = `${left}px`;
  }

  function playSound(meterId, power) {
    const file = sounds[meterId][power];
    if (file) {
      const audio = new Audio(file);
      audio.play().catch(() => {});
    }
  }

  function openMeter(meterId) {
    currentMeter = meterId;
    setPointer(0);
    resultDiv.textContent = "";
    menu.style.display = "none";
    meterScreen.style.display = "block";
  }

  /* ---------- Обработчики событий ---------- */
  document.querySelectorAll(".menu-btn").forEach(btn => {
    btn.addEventListener("click", () =>
      openMeter(Number(btn.dataset.meter) || 1)
    );
  });

  backBtn.addEventListener("click", () => {
    meterScreen.style.display = "none";
    menu.style.display = "block";
    previewImg.classList.remove("show");
    explosionGif.classList.remove("show");
  });

  measureBtn.addEventListener("click", () => {
    const power = getRandomPower();
    setPointer(power);

    resultDiv.textContent =
      currentMeter === 1
        ? `Потужність: ${power}%`
        : `Рівень зради: ${power}%`;

    playSound(currentMeter, power);

    // Взрыв только при 98 %
    if (power === 98) {
      previewImg.classList.add("show");
      new Audio("sounds/boo.mp3").play().catch(() => {});
      setTimeout(() => {
        previewImg.classList.remove("show");
        explosionGif.classList.add("show");
        new Audio("sounds/explosion.mp3").play().catch(() => {});
        setTimeout(() => explosionGif.classList.remove("show"), 2000);
      }, 2000);
    } else {
      previewImg.classList.remove("show");
      explosionGif.classList.remove("show");
    }
  });

  /* ---------- Начальное положение стрелки ---------- */
  setPointer(0);
});
</script>
