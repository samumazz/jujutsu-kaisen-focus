const jjkRoster = {
    gojo: { name: "Satoru Gojo", technique: "Hollow Purple", theme: "theme-gojo", baseImg: "gojo_base.jpg", actionImg: "gojo_mossa.jpg" },
    sukuna: { name: "Ryomen Sukuna", technique: "Cleave & Dismantle", theme: "theme-sukuna", baseImg: "sukuna_base.jpg", actionImg: "sukuna_mossa.jpg" },
    itadori: { name: "Yuji Itadori", technique: "Black Flash", theme: "theme-itadori", baseImg: "itadori_base.jpg", actionImg: "itadori_mossa.jpg" },
    megumi: { name: "Megumi Fushiguro", technique: "Ten Shadows Technique", theme: "theme-megumi", baseImg: "megumi_base.jpg", actionImg: "megumi_mossa.jpg" },
    yuta: { name: "Yuta Okkotsu", technique: "Copy", theme: "theme-yuta", baseImg: "yuta_base.jpg", actionImg: "yuta_mossa.jpg" },
    nobara: { name: "Nobara Kugisaki", technique: "Resonance", theme: "theme-nobara", baseImg: "nobara_base.jpg", actionImg: "nobara_mossa.jpg" },
    toji: { name: "Toji Fushiguro", technique: "Heavenly Restriction (Physical)", theme: "theme-toji", baseImg: "toji_base.jpg", actionImg: "toji_mossa.jpg" },
    maki: { name: "Maki Zen'in", technique: "Soul Splitter Katana", theme: "theme-maki", baseImg: "maki_base.jpg", actionImg: "maki_mossa.jpg" },
    inumaki: { name: "Toge Inumaki", technique: "Cursed Speech", theme: "theme-inumaki", baseImg: "inumaki_base.jpg", actionImg: "inumaki_mossa.jpg" },
    panda: { name: "Panda", technique: "Gorilla Mode", theme: "theme-panda", baseImg: "panda_base.jpg", actionImg: "panda_mossa.jpg" },
    choso: { name: "Choso", technique: "Piercing Blood", theme: "theme-choso", baseImg: "choso_base.jpg", actionImg: "choso_mossa.jpg" }
};

let timerInterval = null;
let currentDuration = 25 * 60; 
let timeRemaining = currentDuration;
let isRunning = false;

// Elementi DOM
const timerDisplay = document.getElementById('timerDisplay');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const activeSorcerer = document.getElementById('activeSorcerer');
const activeTechnique = document.getElementById('activeTechnique');
const mediaWindow = document.getElementById('mediaWindow');
const charSelect = document.getElementById('charSelect');
const timeSelect = document.getElementById('timeSelect');
const charPreviewImg = document.getElementById('charPreviewImg');

// Elementi Audio e Splash Screen
const ambientAudio = document.getElementById('ambientAudio');
const battleAudio = document.getElementById('battleAudio');
const splashScreen = document.getElementById('splashScreen');
const enterAppBtn = document.getElementById('enterAppBtn');

ambientAudio.volume = 1.0;
battleAudio.volume = 1.0;

// Gestione del pulsante di ingresso per sbloccare e avviare subito la sigla
enterAppBtn.addEventListener('click', () => {
    splashScreen.style.display = 'none';
    ambientAudio.play().catch(e => console.log(e));
});

function updateInterfaceTheme() {
    const selectedKey = charSelect.value;
    const node = jjkRoster[selectedKey];
    
    activeSorcerer.textContent = node.name;
    activeTechnique.textContent = node.technique;
    document.body.className = node.theme;
    
    charPreviewImg.src = `${node.baseImg}`;
    mediaWindow.innerHTML = `<img src="${node.baseImg}" alt="${node.name}">`;
}

function renderActiveMedia() {
    const selectedKey = charSelect.value;
    const node = jjkRoster[selectedKey];
    mediaWindow.innerHTML = `<img src="${node.actionImg}" alt="${node.technique}">`;
}

function handleTimeChange() {
    if (isRunning) return;
    const minutes = parseInt(timeSelect.value);
    currentDuration = minutes * 60;
    timeRemaining = currentDuration;
    renderTimerString();
}

function renderTimerString() {
    const mins = Math.floor(timeRemaining / 60).toString().padStart(2, '0');
    const secs = (timeRemaining % 60).toString().padStart(2, '0');
    timerDisplay.textContent = `${mins}:${secs}`;
}

// Sostituisci la vecchia funzione con questa nel tuo app.js
function riproduciTrillo() {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        
        // Genera 10 bip consecutivi (durata totale circa 5 secondi)
        for (let i = 0; i < 10; i++) {
            const timeOffset = i * 0.5; // Distanza di mezzo secondo tra un bip e l'altro
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(880, audioCtx.currentTime + timeOffset); // Suono acuto
            
            gain.gain.setValueAtTime(0.2, audioCtx.currentTime + timeOffset);
            // Sfumatura del singolo bip per renderlo più pulito
            gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + timeOffset + 0.3);
            
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            
            osc.start(audioCtx.currentTime + timeOffset);
            osc.stop(audioCtx.currentTime + timeOffset + 0.3);
        }
    } catch(e) {
        console.log("Errore nella generazione del trillo sonoro esteso.");
    }
}


function processTimerStep() {
    if (timeRemaining > 0) {
        timeRemaining--;
        renderTimerString();
    } else {
        clearInterval(timerInterval);
        isRunning = false;
        startBtn.disabled = false;
        resetBtn.disabled = true;
        charSelect.disabled = false;
        timeSelect.disabled = false;
        timeRemaining = currentDuration;
        renderTimerString();
        mediaWindow.innerHTML = `<span style="color:#10b981; font-weight:700; font-size:20px; letter-spacing:1px;">DOMAIN CLEAR</span>`;

        // Scambio audio finale e riproduzione del trillo
        battleAudio.pause();
        battleAudio.currentTime = 0;
        ambientAudio.play().catch(e => console.log(e));
        
        riproduciTrillo(); // Suona la sveglia acuta
    }
}

charSelect.addEventListener('change', updateInterfaceTheme);
timeSelect.addEventListener('change', handleTimeChange);

startBtn.addEventListener('click', () => {
    if (isRunning) return;
    isRunning = true;
    startBtn.disabled = true;
    resetBtn.disabled = false;
    charSelect.disabled = true; 
    timeSelect.disabled = true;
    
    const mainScreen = document.querySelector('.domain-screen');
    mainScreen.classList.add('shake-active');
    setTimeout(() => mainScreen.classList.remove('shake-active'), 400);

    ambientAudio.pause();
    battleAudio.currentTime = 0;
    battleAudio.play().catch(e => console.log(e));

    renderActiveMedia(); 
    timerInterval = setInterval(processTimerStep, 1000);
});

resetBtn.addEventListener('click', () => {
    clearInterval(timerInterval);
    isRunning = false;
    startBtn.disabled = false;
    resetBtn.disabled = true;
    charSelect.disabled = false;
    timeSelect.disabled = false;
    timeRemaining = currentDuration;
    renderTimerString();

    battleAudio.pause();
    battleAudio.currentTime = 0;
    ambientAudio.play().catch(e => console.log(e));

    updateInterfaceTheme();
});

// Esecuzione al caricamento
updateInterfaceTheme();
renderTimerString();
// Incolla questo alla fine del tuo file app.js per sbloccare l'installazione pulita
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js')
    .then(() => console.log("Service Worker Registered Succesfully"))
    .catch(err => console.log("Service Worker Registration Failed", err));
}
