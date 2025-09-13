document.addEventListener("DOMContentLoaded", () => {
  const totalTicks = 50;
  const ticksGroup = document.getElementById("ticks");
  const pointer = document.getElementById("pointer");
  const resultDiv = document.getElementById("result");
  const previewImg = document.getElementById("preview-img");
  const explosionGif = document.getElementById("explosion-gif");
  const menu = document.getElementById("menu");
  const meterScreen = document.getElementById("meter-screen");
  const measureBtn = document.getElementById("measureBtn");
  const backBtn = document.getElementById("backBtn");
  const meterBg = document.getElementById("meter-bg");

  let currentMeter = 1;

  // Построение шкалы
  for (let i = 0; i <= totalTicks; i++) {
    const tick = document.createElement("div");
    tick.className = "tick " + (i % 5 === 0 ? "long" : "short");
    if (i < 11) tick.style.background = "#ffd010";
    else if (i < 22) tick.style.background = "#00ff09";
    else if (i < 33) tick.style.background = "#00ffff";
    else if (i < 44) tick.style.background = "#ff4500";
    else tick.style.background = "#000000";
    ticksGroup.appendChild(tick);
  }

  const sounds = {
    1: {80:"meter1_3.mp3",89:"meter1_2.mp3",98:"meter1_1.mp3"},
    2: {80:"meter2_1.mp3",89:"meter2_2.mp3",98:"meter2_3.mp3"}
  };

  function setPointer(power) {
    const left = 45 + (power/100) * 310;
    pointer.style.left = left + "px";
  }

  function playSoundForPower(meterId, power) {
    const pts = sounds[meterId];
    [80, 89, 98].forEach(p=>{
      if(power >= p - 5 && power <= p + 5 && pts[p]) {
        new Audio(pts[p]).play().catch(()=>{});
      }
    });
  }

  function measure() {
    const power = Math.floor(Math.random()*101); // 0–100%
    setPointer(power);
    resultDiv.textContent = currentMeter===1 ? `Потужність: ${power}%` : `Рівень зради: ${power}%`;

    playSoundForPower(currentMeter, power);

    if(power >= 98){
      previewImg.classList.add("show");
      new Audio("boo.mp3").play().catch(()=>{});
      setTimeout(()=>{
        previewImg.classList.remove("show");
        explosionGif.classList.add("show");
        new Audio("explosion.mp3").play().catch(()=>{});
        setTimeout(()=>explosionGif.classList.remove("show"),2000);
      },2000);
    } else {
      previewImg.classList.remove("show");
      explosionGif.classList.remove("show");
    }
  }

  // Выбор мемометра
  document.querySelectorAll(".menu-btn").forEach(btn=>{
    btn.addEventListener("click",()=>{
      currentMeter = Number(btn.dataset.meter);
      menu.style.display = "none";
      meterScreen.style.display = "block";
      meterBg.style.display = "block"; // показываем фон
      setPointer(0);
      resultDiv.textContent = currentMeter===1?"Потужність: —":"Рівень зради: —";
    });
  });

  measureBtn.addEventListener("click", measure);

  backBtn.addEventListener("click", ()=>{
    meterScreen.style.display="none";
    menu.style.display="flex";
    meterBg.style.display="none"; // скрываем фон
    previewImg.classList.remove("show");
    explosionGif.classList.remove("show");
  });

  setPointer(0);
});
