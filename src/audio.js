/**
 * Jaivigenesh Portfolio — Sound Design Engine
 * Synthesizes all audio in real-time using the Web Audio API.
 * No external file downloads, zero latency, 100% self-contained.
 */

class StadiumAudioEngine {
  constructor() {
    this.ctx = null;
    this.masterGain = null;
    this.ambienceGain = null;
    this.musicGain = null;
    
    this.isPlaying = false;
    
    // Ambient Music Synth nodes
    this.oscillators = [];
    this.chordInterval = null;
    this.currentChordIndex = 0;

    // Cinematic chords (frequency arrays)
    // Progression: Ab maj7 -> Fm9 -> Cm7 -> Bb6 (Cinematic, deep, and reflective)
    this.chords = [
      [103.83, 207.65, 261.63, 311.13, 392.00], // Ab2, Ab3, C4, Eb4, G4
      [87.31, 174.61, 246.94, 311.13, 349.23],  // F2, F3, Bb3, Eb4, F4
      [65.41, 130.81, 196.00, 233.08, 293.66],  // C2, C3, G3, Bb3, D4
      [116.54, 233.08, 293.66, 349.23, 440.00]  // Bb2, Bb3, D4, F4, A4
    ];
  }

  /**
   * Initializes the Web Audio Context and audio nodes.
   * Safe to call repeatedly; only runs once.
   */
  init() {
    if (this.ctx) return;

    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    this.ctx = new AudioContextClass();

    // Master Volume
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.5, this.ctx.currentTime);
    this.masterGain.connect(this.ctx.destination);

    // Ambience Bus
    this.ambienceGain = this.ctx.createGain();
    this.ambienceGain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    this.ambienceGain.connect(this.masterGain);

    // Music Bus
    this.musicGain = this.ctx.createGain();
    this.musicGain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    this.musicGain.connect(this.masterGain);

    // Start Synthesizers
    this.setupStadiumAmbience();
  }

  /**
   * Generates a deep, low-frequency stadium noise and wind rumble.
   */
  setupStadiumAmbience() {
    const bufferSize = 2 * this.ctx.sampleRate;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    
    // Generate pink noise
    let b0, b1, b2, b3, b4, b5, b6;
    b0 = b1 = b2 = b3 = b4 = b5 = b6 = 0.0;
    
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      output[i] *= 0.11; // normalise
      b6 = white * 0.115926;
    }

    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    // Filter to make it a deep rumble (120Hz cutoff)
    const lowPass = this.ctx.createBiquadFilter();
    lowPass.type = 'lowpass';
    lowPass.frequency.setValueAtTime(120, this.ctx.currentTime);
    lowPass.Q.setValueAtTime(1.0, this.ctx.currentTime);

    // Wind sweep effect using LFO
    const lfo = this.ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.setValueAtTime(0.08, this.ctx.currentTime); // very slow sweep

    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(30, this.ctx.currentTime); // sweep range

    lfo.connect(lfoGain);
    lfoGain.connect(lowPass.frequency);
    
    noiseSource.connect(lowPass);
    lowPass.connect(this.ambienceGain);

    lfo.start();
    noiseSource.start();
  }

  /**
   * Triggers a cinematic ambient chord that fades in and out.
   */
  playNextChord() {
    if (!this.isPlaying) return;
    const now = this.ctx.currentTime;
    const chordFrequencies = this.chords[this.currentChordIndex];
    
    // Clear previous oscillators if any
    this.oscillators.forEach(osc => {
      try {
        osc.stop(now);
      } catch (e) {}
    });
    this.oscillators = [];

    // Play chord tones
    chordFrequencies.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      
      // Warm triangles for pad feel, sine for the lowest root note
      osc.type = idx === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, now);

      // Add a slight detuning for chorus/warmth
      osc.detune.setValueAtTime(Math.random() * 8 - 4, now);

      // Volume envelope (Slow attack, long release)
      oscGain.gain.setValueAtTime(0, now);
      oscGain.gain.linearRampToValueAtTime(0.12, now + 3); // 3 seconds attack
      oscGain.gain.setValueAtTime(0.12, now + 6);
      oscGain.gain.exponentialRampToValueAtTime(0.0001, now + 10); // long release

      // Dynamic lowpass filter to emulate woodwinds/glassmorphism
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(300, now);
      filter.frequency.exponentialRampToValueAtTime(800, now + 4);
      filter.frequency.exponentialRampToValueAtTime(200, now + 9);

      osc.connect(filter);
      filter.connect(oscGain);
      oscGain.connect(this.musicGain);

      osc.start(now);
      osc.stop(now + 10);
      this.oscillators.push(osc);
    });

    // Move to next chord
    this.currentChordIndex = (this.currentChordIndex + 1) % this.chords.length;
  }

  /**
   * Starts the audio engine.
   */
  start() {
    this.init();
    
    if (this.isPlaying) return;
    
    this.isPlaying = true;
    this.ctx.resume();

    // Fade in master volume
    this.masterGain.gain.setValueAtTime(0, this.ctx.currentTime);
    this.masterGain.gain.linearRampToValueAtTime(0.6, this.ctx.currentTime + 1.5);

    // Start chord cycle
    this.playNextChord();
    this.chordInterval = setInterval(() => this.playNextChord(), 9000);
  }

  /**
   * Stops/mutes the audio engine.
   */
  stop() {
    if (!this.isPlaying) return;
    
    this.isPlaying = false;
    clearInterval(this.chordInterval);
    
    const now = this.ctx.currentTime;
    
    // Fade out master volume
    this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
    this.masterGain.gain.linearRampToValueAtTime(0, now + 1.0);
    
    setTimeout(() => {
      if (!this.isPlaying && this.ctx) {
        this.ctx.suspend();
      }
    }, 1100);
  }

  /**
   * Sets master volume level (0 to 1).
   */
  setVolume(value) {
    if (!this.ctx) return;
    const volume = Math.max(0, Math.min(1, parseFloat(value)));
    this.masterGain.gain.setValueAtTime(volume, this.ctx.currentTime);
  }

  /**
   * Play wood/bat hit sound effect programmatically.
   */
  playBatHit() {
    if (!this.isPlaying || !this.ctx) return;
    const now = this.ctx.currentTime;

    // 1. High frequency click/swoosh of air
    const clickOsc = this.ctx.createOscillator();
    const clickGain = this.ctx.createGain();
    clickOsc.type = 'triangle';
    clickOsc.frequency.setValueAtTime(800, now);
    clickOsc.frequency.exponentialRampToValueAtTime(100, now + 0.05);

    clickGain.gain.setValueAtTime(0.6, now);
    clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    clickOsc.connect(clickGain);
    clickGain.connect(this.masterGain);
    clickOsc.start(now);
    clickOsc.stop(now + 0.06);

    // 2. Willow wood resonance (Sine glide with high Q bandpass)
    const woodOsc = this.ctx.createOscillator();
    const woodGain = this.ctx.createGain();
    
    woodOsc.type = 'sine';
    // Deep pop sound characteristic of hitting the sweet spot of the bat (approx 200-300Hz)
    woodOsc.frequency.setValueAtTime(260, now);
    woodOsc.frequency.exponentialRampToValueAtTime(90, now + 0.12);

    woodGain.gain.setValueAtTime(0.8, now);
    woodGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    // Lowpass filter for warm wooden acoustic feel
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, now);

    // Short reverb-like effect (simulated delay line)
    const delay = this.ctx.createDelay();
    delay.delayTime.setValueAtTime(0.02, now);
    const delayGain = this.ctx.createGain();
    delayGain.gain.setValueAtTime(0.15, now);

    woodOsc.connect(filter);
    filter.connect(woodGain);
    woodGain.connect(this.masterGain);

    // Feedback loop for echo
    woodGain.connect(delay);
    delay.connect(delayGain);
    delayGain.connect(this.masterGain);

    woodOsc.start(now);
    woodOsc.stop(now + 0.2);
  }

  /**
   * Synthesizes a transition swoosh sound.
   */
  playSwoosh() {
    if (!this.isPlaying || !this.ctx) return;
    const now = this.ctx.currentTime;

    const bufferSize = this.ctx.sampleRate * 0.4; // 0.4 seconds
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    // Frequency sweeps from low to high then back down
    filter.frequency.setValueAtTime(150, now);
    filter.frequency.exponentialRampToValueAtTime(1200, now + 0.15);
    filter.frequency.exponentialRampToValueAtTime(180, now + 0.4);
    filter.Q.setValueAtTime(3.0, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.15, now + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    noise.start(now);
    noise.stop(now + 0.4);
  }

  /**
   * Synthesizes a subtle tick sound for menu hovers.
   */
  playHover() {
    if (!this.isPlaying || !this.ctx) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, now);
    osc.frequency.exponentialRampToValueAtTime(2000, now + 0.02);

    gain.gain.setValueAtTime(0.015, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.02);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.02);
  }
}

export const audioEngine = new StadiumAudioEngine();
export default audioEngine;
