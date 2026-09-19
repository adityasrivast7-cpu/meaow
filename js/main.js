(() => {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;

  const sounds = {
    audioCtx: null,

    ensureAudioContext() {
      if (!AudioCtx) return null;
      if (!this.audioCtx) {
        this.audioCtx = new AudioCtx();
      }
      return this.audioCtx;
    },

    playTone(frequency, duration = 0.12, type = 'triangle', volume = 0.05) {
      const ctx = this.ensureAudioContext();
      if (!ctx) return;

      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      oscillator.type = type;
      oscillator.frequency.value = frequency;
      gainNode.gain.value = volume;

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.start();
      gainNode.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
      oscillator.stop(ctx.currentTime + duration);
    },

    playChime() {
      this.playTone(523.25, 0.18, 'triangle', 0.06);
      setTimeout(() => this.playTone(659.25, 0.18, 'triangle', 0.05), 70);
    },

    playBlowSound() {
      this.playTone(180, 0.22, 'sawtooth', 0.04);
    },

    playPop() {
      this.playTone(260, 0.12, 'square', 0.055);
    }
  };

  const music = {
    isPlaying: false,
    timer: null,
    nextNoteTime: 0,
    step: 0,
    notes: [261.63, 329.63, 392, 523.25, 392, 329.63, 293.66, 392],

    start() {
      const ctx = sounds.ensureAudioContext();
      if (!ctx || this.isPlaying) return;

      if (ctx.state === 'suspended') ctx.resume();
      this.isPlaying = true;
      this.nextNoteTime = ctx.currentTime + 0.05;
      this.schedule();
      this.timer = window.setInterval(() => this.schedule(), 250);
      updateMusicButton();
    },

    stop() {
      this.isPlaying = false;
      window.clearInterval(this.timer);
      this.timer = null;
      updateMusicButton();
    },

    schedule() {
      const ctx = sounds.audioCtx;
      if (!ctx || !this.isPlaying) return;

      while (this.nextNoteTime < ctx.currentTime + 0.5) {
        const note = this.notes[this.step % this.notes.length];
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        oscillator.type = 'sine';
        oscillator.frequency.value = note;
        gainNode.gain.setValueAtTime(0.0001, this.nextNoteTime);
        gainNode.gain.exponentialRampToValueAtTime(0.035, this.nextNoteTime + 0.03);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, this.nextNoteTime + 0.42);
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        oscillator.start(this.nextNoteTime);
        oscillator.stop(this.nextNoteTime + 0.45);
        this.nextNoteTime += 0.5;
        this.step += 1;
      }
    }
  };

  const musicButton = document.createElement('button');
  musicButton.id = 'music-toggle';
  musicButton.type = 'button';
  musicButton.className = 'music-toggle';
  musicButton.setAttribute('aria-label', 'Play birthday music');
  document.body.appendChild(musicButton);

  function updateMusicButton() {
    const playing = music.isPlaying;
    musicButton.textContent = playing ? '♫ Pause music' : '♫ Play music';
    musicButton.setAttribute('aria-label', playing ? 'Pause birthday music' : 'Play birthday music');
    musicButton.classList.toggle('is-playing', playing);
  }

  musicButton.addEventListener('click', () => {
    if (music.isPlaying) {
      music.stop();
    } else {
      music.start();
    }
  });

  document.addEventListener('pointerdown', () => {
    if (!music.isPlaying && localStorage.getItem('birthday:music') !== 'off') {
      music.start();
    }
  }, { once: true });

  window.addEventListener('beforeunload', () => music.stop());
  window.music = music;
  updateMusicButton();

  window.sounds = sounds;

  window.triggerConfetti = function (options = {}) {
    if (typeof window.confetti !== 'function') {
      return;
    }

    window.confetti({
      particleCount: 50,
      spread: 70,
      startVelocity: 25,
      origin: { y: 0.6 },
      ...options
    });
  };

  window.triggerGrandConfetti = function () {
    window.triggerConfetti({
      particleCount: 180,
      spread: 100,
      startVelocity: 45,
      scalar: 1.2,
      origin: { y: 0.6 }
    });
  };

  const balloonContainer = document.getElementById('balloon-container');

  if (balloonContainer) {
    const cuteItems = ['💖', '🌸', '✨', '🎈', '🩷', '💗', '🌼', '🍓'];

    for (let i = 0; i < 18; i += 1) {
      const item = document.createElement('span');
      item.className = 'floating-item';
      item.textContent = cuteItems[i % cuteItems.length];
      item.style.left = `${Math.random() * 100}%`;
      item.style.setProperty('--drift', `${Math.random() * 120 - 60}px`);
      item.style.setProperty('--duration', `${(8 + Math.random() * 10).toFixed(2)}s`);
      item.style.animationDelay = `${(Math.random() * 5).toFixed(2)}s`;
      item.style.fontSize = `${16 + Math.random() * 18}px`;
      item.style.opacity = (0.45 + Math.random() * 0.45).toFixed(2);
      balloonContainer.appendChild(item);
    }
  }
})();
