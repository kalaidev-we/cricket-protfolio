"use client";

class AudioEngineClass {
  private ctx: AudioContext | null = null;
  private crowdGain: GainNode | null = null;
  private crowdSource: AudioBufferSourceNode | null = null;
  private heartbeatTimer: NodeJS.Timeout | null = null;
  private isMuted: boolean = false;

  constructor() {
    // Audio context is initialized lazily on the first user interaction to comply with browser autoplay policies
  }

  private initContext() {
    if (this.ctx) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioContextClass();
    } catch (e) {
      console.warn("Web Audio API not supported in this browser:", e);
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopCrowdAmbience();
      this.stopHeartbeat();
    } else {
      // If we un-mute and context exists, we can resume audio context
      if (this.ctx && this.ctx.state === "suspended") {
        this.ctx.resume();
      }
    }
    return this.isMuted;
  }

  public getMuteState(): boolean {
    return this.isMuted;
  }

  // Synthesize white noise buffer
  private createNoiseBuffer(): AudioBuffer {
    this.initContext();
    if (!this.ctx) throw new Error("AudioContext not initialized");
    
    const bufferSize = 2 * this.ctx.sampleRate; // 2 seconds
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    return noiseBuffer;
  }

  // STADIUM CROWD AMBIENCE
  public startCrowdAmbience() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }

    if (this.crowdSource) {
      return; // Already playing
    }

    try {
      const noiseBuffer = this.createNoiseBuffer();
      this.crowdSource = this.ctx.createBufferSource();
      this.crowdSource.buffer = noiseBuffer;
      this.crowdSource.loop = true;

      // Filter to shape white noise into a distant rumble
      const lowpass = this.ctx.createBiquadFilter();
      lowpass.type = "lowpass";
      lowpass.frequency.setValueAtTime(350, this.ctx.currentTime);

      // Peaking filter to simulate crowd presence / murmur peaks
      const peak = this.ctx.createBiquadFilter();
      peak.type = "peaking";
      peak.frequency.setValueAtTime(800, this.ctx.currentTime);
      peak.Q.setValueAtTime(1.0, this.ctx.currentTime);
      peak.gain.setValueAtTime(4, this.ctx.currentTime);

      this.crowdGain = this.ctx.createGain();
      this.crowdGain.gain.setValueAtTime(0.0, this.ctx.currentTime);
      // Fade in slowly
      this.crowdGain.gain.linearRampToValueAtTime(0.15, this.ctx.currentTime + 3.0);

      this.crowdSource.connect(lowpass);
      lowpass.connect(peak);
      peak.connect(this.crowdGain);
      this.crowdGain.connect(this.ctx.destination);

      this.crowdSource.start(0);

      // Gentle LFO-like volume changes to make it sound organic
      this.modulateCrowd();
    } catch (e) {
      console.error("Failed to play crowd ambience:", e);
    }
  }

  private modulateCrowd() {
    if (!this.ctx || !this.crowdGain || this.isMuted || !this.crowdSource) return;
    const nextInterval = 2000 + Math.random() * 3000;
    const targetVolume = 0.08 + Math.random() * 0.12;
    this.crowdGain.gain.linearRampToValueAtTime(targetVolume, this.ctx.currentTime + nextInterval / 1000);
    setTimeout(() => this.modulateCrowd(), nextInterval);
  }

  public stopCrowdAmbience() {
    if (this.crowdGain && this.ctx) {
      try {
        this.crowdGain.gain.cancelScheduledValues(this.ctx.currentTime);
        this.crowdGain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.5);
      } catch (e) {}
    }
    setTimeout(() => {
      if (this.crowdSource) {
        try {
          this.crowdSource.stop();
        } catch (e) {}
        this.crowdSource.disconnect();
        this.crowdSource = null;
      }
      this.crowdGain = null;
    }, 550);
  }

  // BAT HIT (WOODY CRICKET BALL THWACK)
  public playBatHit() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }

    try {
      const now = this.ctx.currentTime;

      // 1. Synthesize Wood Thump (Sine Sweep)
      const osc = this.ctx.createOscillator();
      const oscGain = this.ctx.createGain();
      osc.type = "sine";
      // Willow wood response sweep
      osc.frequency.setValueAtTime(1000, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.06);

      oscGain.gain.setValueAtTime(0.7, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(oscGain);
      oscGain.connect(this.ctx.destination);

      // 2. Synthesize High frequency Leather Click (Noise burst)
      const noiseBuffer = this.createNoiseBuffer();
      const clickSource = this.ctx.createBufferSource();
      clickSource.buffer = noiseBuffer;

      const clickFilter = this.ctx.createBiquadFilter();
      clickFilter.type = "bandpass";
      clickFilter.frequency.setValueAtTime(900, now);
      clickFilter.Q.setValueAtTime(3.0, now);

      const clickGain = this.ctx.createGain();
      clickGain.gain.setValueAtTime(0.25, now);
      clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);

      clickSource.connect(clickFilter);
      clickFilter.connect(clickGain);
      clickGain.connect(this.ctx.destination);

      // Start both
      osc.start(now);
      clickSource.start(now);

      osc.stop(now + 0.1);
      clickSource.stop(now + 0.1);
    } catch (e) {
      console.error("Failed to play bat hit sound:", e);
    }
  }

  // HEARTBEAT (PRESSURE MODE)
  public startHeartbeat() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }

    if (this.heartbeatTimer) return;

    const playHeartbeatPulse = () => {
      if (!this.ctx || this.isMuted) return;
      try {
        const now = this.ctx.currentTime;
        
        // Lub-Dub: Pulse 1 (Lub)
        const osc1 = this.ctx.createOscillator();
        const gain1 = this.ctx.createGain();
        osc1.type = "sine";
        osc1.frequency.setValueAtTime(55, now);
        osc1.frequency.exponentialRampToValueAtTime(35, now + 0.08);
        
        gain1.gain.setValueAtTime(0.6, now);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        
        osc1.connect(gain1);
        gain1.connect(this.ctx.destination);
        osc1.start(now);
        osc1.stop(now + 0.12);

        // Pulse 2 (Dub) - 150ms later
        const delay = 0.16;
        const osc2 = this.ctx.createOscillator();
        const gain2 = this.ctx.createGain();
        osc2.type = "sine";
        osc2.frequency.setValueAtTime(50, now + delay);
        osc2.frequency.exponentialRampToValueAtTime(30, now + delay + 0.08);
        
        gain2.gain.setValueAtTime(0.45, now + delay);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.12);
        
        osc2.connect(gain2);
        gain2.connect(this.ctx.destination);
        osc2.start(now + delay);
        osc2.stop(now + delay + 0.15);
      } catch (e) {}
    };

    // Trigger pulse loop every 800ms (tense heartbeat)
    playHeartbeatPulse();
    this.heartbeatTimer = setInterval(playHeartbeatPulse, 850);
  }

  public stopHeartbeat() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  // TRANSITION SWOOSH
  public playSwoosh() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }

    try {
      const now = this.ctx.currentTime;
      const duration = 0.4;

      const noiseBuffer = this.createNoiseBuffer();
      const source = this.ctx.createBufferSource();
      source.buffer = noiseBuffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.Q.setValueAtTime(2.0, now);
      filter.frequency.setValueAtTime(150, now);
      filter.frequency.exponentialRampToValueAtTime(2200, now + duration * 0.5);
      filter.frequency.exponentialRampToValueAtTime(100, now + duration);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.4, now + duration * 0.4);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      source.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      source.start(now);
      source.stop(now + duration);
    } catch (e) {
      console.error("Failed to play swoosh sound:", e);
    }
  }
}

// Export singleton instance
export const AudioEngine = new AudioEngineClass();
export default AudioEngine;
