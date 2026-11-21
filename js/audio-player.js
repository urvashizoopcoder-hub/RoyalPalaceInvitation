/**
 * Luxury Audio Engine for Wedding Invitations
 * Features zero-dependency Web Audio API synthesizer for traditional
 * Indian classical melodies (Shehnai, Sitar, Flute) and Romantic strings/piano,
 * plus custom audio file upload support and interactive sound effects.
 */

class LuxuryAudioEngine {
  constructor() {
    this.ctx = null;
    this.isPlaying = false;
    this.isMuted = false;
    this.currentPreset = "romantic-strings";
    this.melodyTimer = null;
    this.customAudio = null;
    this.customAudioUrl = null;
    this.gainNode = null;

    this.onStateChange = null;
  }

  ensureContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.gainNode = this.ctx.createGain();
        this.gainNode.gain.setValueAtTime(0.2, this.ctx.currentTime);
        this.gainNode.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  setPreset(preset) {
    this.currentPreset = preset;
    if (this.isPlaying && !this.customAudioUrl) {
      this.stopBackgroundMusic();
      this.startBackgroundMusic();
    }
  }

  setCustomAudio(fileOrUrl) {
    this.stopBackgroundMusic();
    if (typeof fileOrUrl === "string") {
      this.customAudioUrl = fileOrUrl;
      this.customAudio = new Audio(fileOrUrl);
      this.customAudio.loop = true;
    } else if (fileOrUrl instanceof File) {
      this.customAudioUrl = URL.createObjectURL(fileOrUrl);
      this.customAudio = new Audio(this.customAudioUrl);
      this.customAudio.loop = true;
    }
  }

  toggleMusic() {
    if (this.isPlaying) {
      this.stopBackgroundMusic();
    } else {
      this.startBackgroundMusic();
    }
  }

  startBackgroundMusic() {
    this.ensureContext();
    if (this.isPlaying) return;
    this.isPlaying = true;

    if (this.customAudio) {
      this.customAudio.play().catch(e => console.log("Audio play blocked", e));
    } else {
      this.startSynthesizedMusic(this.currentPreset);
    }

    if (this.onStateChange) this.onStateChange({ isPlaying: true });
    this.updateUIBars(true);
  }

  stopBackgroundMusic() {
    this.isPlaying = false;
    if (this.customAudio) {
      this.customAudio.pause();
    }
    if (this.melodyTimer) {
      clearInterval(this.melodyTimer);
      this.melodyTimer = null;
    }
    if (this.onStateChange) this.onStateChange({ isPlaying: false });
    this.updateUIBars(false);
  }

  startSynthesizedMusic(preset) {
    if (!this.ctx) return;

    // Continuous ambient drone (Tanpura Sa-Pa in Raag Yaman or C-G romantic fifth)
    this.playDroneNote(130.81, 0.05); // C3
    this.playDroneNote(196.00, 0.03); // G3

    // Melodic sequence based on preset
    let scale = [];
    if (preset === "shehnai-royal" || preset === "sitar-darbar") {
      // Indian Yaman scale frequencies
      scale = [261.63, 293.66, 329.63, 369.99, 392.00, 440.00, 493.88, 523.25];
    } else if (preset === "flute-divine") {
      // Krishna Bansuri pentatonic
      scale = [293.66, 329.63, 369.99, 440.00, 493.88, 587.33];
    } else {
      // Romantic Strings & Piano chords (Cmaj9, Am7, Fmaj7, G7)
      scale = [261.63, 329.63, 392.00, 493.88, 523.25, 587.33, 659.25];
    }

    let noteIdx = 0;
    const playNextNote = () => {
      if (!this.isPlaying) return;
      const freq = scale[Math.floor(Math.random() * scale.length)];
      const duration = preset.includes("shehnai") ? 1.4 : 1.8;
      this.playNote(freq, duration, preset);
    };

    playNextNote();
    this.melodyTimer = setInterval(playNextNote, 1200);
  }

  playDroneNote(freq, vol) {
    if (!this.ctx || !this.isPlaying) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      const filter = this.ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(400, this.ctx.currentTime);

      gain.gain.setValueAtTime(vol, this.ctx.currentTime);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.gainNode);

      osc.start();
      setTimeout(() => {
        try {
          gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1);
          osc.stop(this.ctx.currentTime + 1);
        } catch (e) {}
      }, 9000);
    } catch (e) {}
  }

  playNote(freq, duration, preset) {
    if (!this.ctx || !this.isPlaying) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      if (preset === "shehnai-royal") {
        osc.type = "sawtooth"; // Reed sound
        // Shehnai microtonal portamento glide
        osc.frequency.setValueAtTime(freq * 0.98, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(freq, this.ctx.currentTime + 0.15);
      } else if (preset === "flute-divine") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      } else {
        osc.type = "triangle"; // Warm strings / piano
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      }

      const now = this.ctx.currentTime;
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.2);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(this.gainNode);

      osc.start(now);
      osc.stop(now + duration);
    } catch (e) {}
  }

  playChime() {
    this.ensureContext();
    if (!this.ctx) return;
    try {
      const chords = [523.25, 659.25, 783.99, 1046.50]; // C E G C
      chords.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        const now = this.ctx.currentTime + idx * 0.08;
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.6);

        osc.connect(gain);
        gain.connect(this.gainNode);
        osc.start(now);
        osc.stop(now + 1.6);
      });
    } catch (e) {}
  }

  playScratchSound() {
    this.ensureContext();
    if (!this.ctx) return;
    try {
      // Soft gentle white noise burst for paper friction
      const bufferSize = this.ctx.sampleRate * 0.05;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.setValueAtTime(1200, this.ctx.currentTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.05);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(this.gainNode);

      whiteNoise.start();
    } catch (e) {}
  }

  updateUIBars(isActive) {
    const bars = document.querySelectorAll(".eq-bar");
    bars.forEach(bar => {
      if (isActive) {
        bar.classList.add("eq-animating");
      } else {
        bar.classList.remove("eq-animating");
      }
    });
  }
}

window.LuxuryAudioEngine = LuxuryAudioEngine;
