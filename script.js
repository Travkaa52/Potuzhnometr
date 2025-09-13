document.addEventListener("DOMContentLoaded", () => {
  const menu = document.getElementById("menu");

  const meterScreen = document.getElementById("meter-screen");

  const measureBtn = document.getElementById("measureBtn");

  const backBtn = document.getElementById("backBtn");

  const pointer = document.getElementById("pointer");

  const ticksGroup = document.getElementById("ticks");

  const resultDiv = document.getElementById("result");

  const previewImg = document.getElementById("preview-img");

  const explosionGif = document.getElementById("explosion-gif");

  let currentMeter = 1;

  const totalTicks = 50;

  const meterWidth = 310;

  const sounds = {
    1: ["sounds/meter1_1.mp3", "sounds/meter1_2.mp3", "sounds/meter1_3.mp3"],

    2: ["sounds/meter2_1.mp3", "sounds/meter2_2.mp3", "sounds/meter2_3.mp3"]
  };

  // Создаем шкалу |||||||

  function buildScale() {
    ticksGroup.innerHTML = "";

    for (let i = 0; i <= totalTicks; i++) {
      const tick = document.createElement("div");

      tick.style.height = i % 5 ===0 ? "60px" : "45px"; // увеличили высоту палочек

      // Цвет по диапазону

      if (i < 11) tick.style.background = "#ffd010";
      // жёлтый
      else if (i < 22) tick.style.background = "#00ff09";
      // зелёный
      else if (i < 33) tick.style.background = "#00ffff";
      // голубой
      else if (i <44) tick.style.background = "#ff4500";// красный
      else if (i <55) tick.style.background = "#000000";
      ticksGroup.appendChild(tick);
    }
  }
  buildScale();

  function getRandomPowerAligned() {
    const tick = Math.floor(Math.random() * (totalTicks + 1));

    return tick * (100 / totalTicks);
  }

  function setPointer(power) {
    const left = (power / 100) * meterWidth;

    pointer.style.left = `${left}px`;
  
  }

  function playRandomSound(meterId) {
    const list = sounds[meterId] || sounds[1];

    const idx = Math.floor(Math.random() * list.length);

    const audio = new Audio(list[idx]);

    audio.play().catch(() => {});
  }

  function openMeter(meterId) {
    currentMeter = meterId;

    setPointer(0);

    resultDiv.textContent = "";

    menu.style.display = "none";

    meterScreen.style.display = "block";
  }

  document.querySelectorAll(".menu-btn").forEach((btn) => {
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
    const power = getRandomPowerAligned();

    setPointer(power);

    playRandomSound(currentMeter);

    resultDiv.textContent =
      currentMeter === 1
        ? `Потужність: ${Math.round(power)}%`
        : `Рівень зради: ${Math.round(power)}%`;

    if (power >= 90) {
      previewImg.classList.add("show");

      new Audio("sounds/boo.mp3").play().catch(() => {});

      setTimeout(() => {
        previewImg.classList.remove("show");

        explosionGif.classList.add("show");

        new Audio("sounds/explosion.mp3").play().catch(() => {});

        setTimeout(() => {
    
          explosionGif.classList.remove("show");
        }, 2000);
      }, 2000);
    } else {
      previewImg.classList.remove("show");

      explosionGif.classList.remove("show");
    }
  });

  setPointer(0);
});

