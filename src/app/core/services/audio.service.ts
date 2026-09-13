import { Injectable, signal } from '@angular/core';

export type SoundType = 'move' | 'capture' | 'check' | 'gameover' | 'illegal';

@Injectable({
  providedIn: 'root',
})
export class AudioService {
  public isMuted = signal<boolean>(false);
  private audioCtx: AudioContext | null = null;

  constructor() {
    // AudioContext will be initialized on first user interaction to comply with browser autoplay policies
  }

  private initAudioContext() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  public toggleMute(): boolean {
    this.isMuted.update((muted) => !muted);
    return this.isMuted();
  }

  public playSound(type: SoundType): void {
    if (this.isMuted()) return;

    try {
      this.initAudioContext();
      if (!this.audioCtx) return;

      const now = this.audioCtx.currentTime;

      switch (type) {
        case 'move':
          this.playMoveSound(now);
          break;
        case 'capture':
          this.playCaptureSound(now);
          break;
        case 'check':
          this.playCheckSound(now);
          break;
        case 'gameover':
          this.playGameOverSound(now);
          break;
        case 'illegal':
          this.playIllegalSound(now);
          break;
      }
    } catch {
      // Audio playback silently gracefully fails if blocked
    }
  }

  private playMoveSound(time: number) {
    if (!this.audioCtx) return;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(320, time);
    osc.frequency.exponentialRampToValueAtTime(140, time + 0.08);

    gain.gain.setValueAtTime(0.4, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.08);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start(time);
    osc.stop(time + 0.08);
  }

  private playCaptureSound(time: number) {
    if (!this.audioCtx) return;
    const osc = this.audioCtx.createOscillator();
    const noise = this.createNoiseBuffer();
    const gain = this.audioCtx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(280, time);
    osc.frequency.exponentialRampToValueAtTime(80, time + 0.12);

    gain.gain.setValueAtTime(0.5, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.12);

    osc.connect(gain);
    if (noise) {
      const noiseNode = this.audioCtx.createBufferSource();
      noiseNode.buffer = noise;
      const noiseGain = this.audioCtx.createGain();
      noiseGain.gain.setValueAtTime(0.2, time);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, time + 0.06);
      noiseNode.connect(noiseGain);
      noiseGain.connect(this.audioCtx.destination);
      noiseNode.start(time);
    }

    gain.connect(this.audioCtx.destination);
    osc.start(time);
    osc.stop(time + 0.12);
  }

  private playCheckSound(time: number) {
    if (!this.audioCtx) return;
    const notes = [440, 660];
    notes.forEach((freq, idx) => {
      if (!this.audioCtx) return;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      const startTime = time + idx * 0.08;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.35, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.2);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.2);
    });
  }

  private playGameOverSound(time: number) {
    if (!this.audioCtx) return;
    const chord = [330, 440, 554.37, 659.25]; // A major chord
    chord.forEach((freq, idx) => {
      if (!this.audioCtx) return;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      const startTime = time + idx * 0.06;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.25, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.6);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.6);
    });
  }

  private playIllegalSound(time: number) {
    if (!this.audioCtx) return;
    const osc = this.audioCtx.createOscillator();
    const gain = this.audioCtx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(130, time);
    osc.frequency.exponentialRampToValueAtTime(90, time + 0.1);

    gain.gain.setValueAtTime(0.25, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.1);

    osc.connect(gain);
    gain.connect(this.audioCtx.destination);

    osc.start(time);
    osc.stop(time + 0.1);
  }

  private createNoiseBuffer(): AudioBuffer | null {
    if (!this.audioCtx) return null;
    const bufferSize = this.audioCtx.sampleRate * 0.05;
    const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }
}
