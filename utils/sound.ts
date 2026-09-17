
// A simple synthesizer to avoid external asset dependencies
class SoundFX {
    private ctx: AudioContext | null = null;
    private osc: OscillatorNode | null = null;
    private gain: GainNode | null = null;
  
    private getContext() {
      if (!this.ctx) {
        this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      return this.ctx;
    }
  
    public playSpinSound() {
      const ctx = this.getContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
  
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(600, ctx.currentTime + 0.1);
      
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
  
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    }
  
    public playWinSound() {
      const ctx = this.getContext();
      const now = ctx.currentTime;
      
      // Fanfare
      [440, 554, 659, 880].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(0.1, now + i * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.5);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + i * 0.1);
        osc.stop(now + i * 0.1 + 0.5);
      });
    }
  
    public playCorrectSound() {
        const ctx = this.getContext();
        const now = ctx.currentTime;
        
        // Play a quick major arpeggio (Happy sound)
        // C5, E5, G5, C6
        const notes = [523.25, 659.25, 783.99, 1046.50];
        
        notes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            
            osc.type = 'triangle'; // Triangle is brighter/happier than sine
            osc.frequency.setValueAtTime(freq, now + (i * 0.1));
            
            gain.gain.setValueAtTime(0.1, now + (i * 0.1));
            gain.gain.exponentialRampToValueAtTime(0.01, now + (i * 0.1) + 0.3);
            
            osc.connect(gain);
            gain.connect(ctx.destination);
            
            osc.start(now + (i * 0.1));
            osc.stop(now + (i * 0.1) + 0.3);
        });
    }

    public playWrongSound() {
        const ctx = this.getContext();
        const now = ctx.currentTime;
        
        // Sad "Wah-wah-wah" descending effect
        const duration = 0.4;
        const notes = [400, 370, 340]; // Descending semitones approx

        notes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const startTime = now + (i * duration);
            
            osc.type = 'sawtooth'; // Sawtooth sounds a bit "buzzy" or "wrong"
            
            // Slide pitch down slightly for each note
            osc.frequency.setValueAtTime(freq, startTime);
            osc.frequency.linearRampToValueAtTime(freq - 20, startTime + duration);
            
            // Volume swell/fade
            gain.gain.setValueAtTime(0.05, startTime);
            gain.gain.linearRampToValueAtTime(0.1, startTime + (duration/2));
            gain.gain.linearRampToValueAtTime(0, startTime + duration);
            
            osc.connect(gain);
            gain.connect(ctx.destination);
            
            osc.start(startTime);
            osc.stop(startTime + duration);
        });

        // Final long slide down
        const lastOsc = ctx.createOscillator();
        const lastGain = ctx.createGain();
        const lastStart = now + (notes.length * duration);
        
        lastOsc.type = 'triangle';
        lastOsc.frequency.setValueAtTime(320, lastStart);
        lastOsc.frequency.linearRampToValueAtTime(150, lastStart + 1.0); // Long drop
        
        lastGain.gain.setValueAtTime(0.1, lastStart);
        lastGain.gain.linearRampToValueAtTime(0, lastStart + 1.0);
        
        lastOsc.connect(lastGain);
        lastGain.connect(ctx.destination);
        lastOsc.start(lastStart);
        lastOsc.stop(lastStart + 1.0);
    }
  }
  
  export const soundFX = new SoundFX();
