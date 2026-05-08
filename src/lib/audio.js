// Web Audio motif playback + waveform visualiser.
import { motifs } from '../data/index.js';

let audioCtx = null;
let analyser = null;

function ensure() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioCtx.createAnalyser();
    analyser.fftSize = 512;
    analyser.connect(audioCtx.destination);
  }
}

export function playMotif(country) {
  ensure();
  if (audioCtx.state === 'suspended') audioCtx.resume();
  const m = motifs[country];
  if (!m) return;
  const nd = 60 / m.tempo;
  const t0 = audioCtx.currentTime + 0.02;
  m.notes.forEach((freq, i) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = m.wave;
    osc.frequency.value = freq;
    const t = t0 + i * nd;
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.14, t + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0008, t + nd * 0.92);
    osc.connect(gain).connect(analyser);
    osc.start(t);
    osc.stop(t + nd);
  });
}

let waveAnim = false;
export function startWave(canvas) {
  if (waveAnim) return;
  waveAnim = true;
  const c = canvas.getContext('2d');
  const buf = new Uint8Array(analyser ? analyser.fftSize : 512);
  (function frame() {
    if (!document.body.contains(canvas)) { waveAnim = false; return; }
    const w = canvas.width, h = canvas.height;
    c.clearRect(0, 0, w, h);
    if (analyser && audioCtx && audioCtx.state === 'running') {
      analyser.getByteTimeDomainData(buf);
      c.strokeStyle = '#FAC775';
      c.lineWidth = 1.5;
      c.beginPath();
      buf.forEach((v, i) => {
        const x = (i / buf.length) * w, y = (v / 255) * h;
        i ? c.lineTo(x, y) : c.moveTo(x, y);
      });
      c.stroke();
    } else {
      const t = Date.now() / 700;
      c.strokeStyle = 'rgba(250,199,117,0.32)';
      c.lineWidth = 1.2;
      c.beginPath();
      for (let i = 0; i <= w; i++) {
        const y = h / 2 + Math.sin(i * 0.05 + t) * 4 + Math.sin(i * 0.13 - t * 0.7) * 3;
        i ? c.lineTo(i, y) : c.moveTo(i, y);
      }
      c.stroke();
    }
    requestAnimationFrame(frame);
  })();
}

export function resetWave() { waveAnim = false; }
