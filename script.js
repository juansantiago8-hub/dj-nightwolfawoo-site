const menuToggle = document.querySelector("[data-menu-toggle]");
const nav = document.querySelector("[data-nav]");
const bookingForm = document.querySelector("[data-booking-form]");
const formStatus = document.querySelector("[data-form-status]");
const musicToggle = document.querySelector("[data-music-toggle]");
const bookingEmail = "djnightwolfawoo@aol.com";
let audioContext;
let masterGain;
let musicTimer;
let nextNoteTime = 0;
let step = 0;
let musicPlaying = false;

if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    document.body.classList.toggle("menu-open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  });

  nav.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      nav.classList.remove("is-open");
      document.body.classList.remove("menu-open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open menu");
    }
  });
}

if (bookingForm && formStatus) {
  bookingForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(bookingForm);
    const name = String(formData.get("name") || "").trim();
    const date = String(formData.get("date") || "").trim();
    const eventType = String(formData.get("event") || "").trim();
    const details = String(formData.get("details") || "").trim();
    const subject = `Booking request from ${name || "DJ Nightwolfawoo website"}`;
    const body = [
      "New DJ Nightwolfawoo booking request",
      "",
      `Name: ${name || "Not provided"}`,
      `Event date: ${date || "Not provided"}`,
      `Event type: ${eventType || "Not provided"}`,
      "",
      "Details:",
      details || "Not provided",
    ].join("\n");
    const mailto = `mailto:${bookingEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    formStatus.textContent = `Opening an email to ${bookingEmail}.`;
    window.location.href = mailto;
    bookingForm.reset();
  });
}

function getAudioContext() {
  if (!audioContext) {
    audioContext = new AudioContext();
    masterGain = audioContext.createGain();
    masterGain.gain.value = 0.22;
    masterGain.connect(audioContext.destination);
  }

  return audioContext;
}

function playTone(frequency, time, duration, type, volume) {
  const context = getAudioContext();
  const oscillator = context.createOscillator();
  const gain = context.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, time);
  gain.gain.setValueAtTime(0, time);
  gain.gain.linearRampToValueAtTime(volume, time + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.001, time + duration);
  oscillator.connect(gain);
  gain.connect(masterGain);
  oscillator.start(time);
  oscillator.stop(time + duration + 0.02);
}

function playNoise(time, duration, volume, filterFrequency) {
  const context = getAudioContext();
  const bufferSize = context.sampleRate * duration;
  const buffer = context.createBuffer(1, bufferSize, context.sampleRate);
  const data = buffer.getChannelData(0);
  const noise = context.createBufferSource();
  const filter = context.createBiquadFilter();
  const gain = context.createGain();

  for (let i = 0; i < bufferSize; i += 1) {
    data[i] = Math.random() * 2 - 1;
  }

  filter.type = "highpass";
  filter.frequency.setValueAtTime(filterFrequency, time);
  gain.gain.setValueAtTime(0, time);
  gain.gain.linearRampToValueAtTime(volume, time + 0.005);
  gain.gain.exponentialRampToValueAtTime(0.001, time + duration);
  noise.buffer = buffer;
  noise.connect(filter);
  filter.connect(gain);
  gain.connect(masterGain);
  noise.start(time);
  noise.stop(time + duration);
}

function scheduleBeat() {
  const context = getAudioContext();
  const secondsPerStep = 60 / 124 / 4;
  const bassPattern = [55, 55, 82.41, 73.42, 55, 65.41, 82.41, 98];

  while (nextNoteTime < context.currentTime + 0.14) {
    if (step % 4 === 0) {
      playTone(46.25, nextNoteTime, 0.16, "sine", 0.95);
    }

    if (step % 8 === 4) {
      playNoise(nextNoteTime, 0.08, 0.32, 1400);
    }

    if (step % 2 === 1) {
      playNoise(nextNoteTime, 0.035, 0.12, 7000);
    }

    if (step % 2 === 0) {
      playTone(bassPattern[(step / 2) % bassPattern.length], nextNoteTime, 0.12, "sawtooth", 0.16);
    }

    step = (step + 1) % 32;
    nextNoteTime += secondsPerStep;
  }
}

function startMusic() {
  const context = getAudioContext();

  context.resume();
  nextNoteTime = context.currentTime + 0.05;
  step = 0;
  musicTimer = window.setInterval(scheduleBeat, 45);
  musicPlaying = true;
  musicToggle.textContent = "Pause background music";
  musicToggle.setAttribute("aria-pressed", "true");
  musicToggle.classList.add("is-playing");
}

function stopMusic() {
  window.clearInterval(musicTimer);
  musicTimer = undefined;
  musicPlaying = false;
  musicToggle.textContent = "Play background music";
  musicToggle.setAttribute("aria-pressed", "false");
  musicToggle.classList.remove("is-playing");
}

if (musicToggle) {
  musicToggle.addEventListener("click", () => {
    if (musicPlaying) {
      stopMusic();
    } else {
      startMusic();
    }
  });
}
