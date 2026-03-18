export const playSound = {
  // 叮~ (完成任务)
  ding: () => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const audioCtx = new AudioContext();
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
    osc.frequency.exponentialRampToValueAtTime(1760, audioCtx.currentTime + 0.1); // -> A6
    
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, audioCtx.currentTime + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
    
    osc.start();
    osc.stop(audioCtx.currentTime + 0.5);
  },
  
  // 魔法抽卡 (蓄力+爆发)
  magicReveal: () => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const audioCtx = new AudioContext();
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(300, audioCtx.currentTime);
    osc.frequency.linearRampToValueAtTime(800, audioCtx.currentTime + 0.2); // 蓄力
    osc.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.5); // 爆发
    
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.2, audioCtx.currentTime + 0.1); // fade in
    gainNode.gain.linearRampToValueAtTime(0.4, audioCtx.currentTime + 0.3); // burst
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1.0); // fade out
    
    osc.start();
    osc.stop(audioCtx.currentTime + 1.0);
  },
  
  // 收下奖励 (欢乐/和弦)
  tada: () => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const audioCtx = new AudioContext();
    [523.25, 659.25, 783.99].forEach((freq, i) => { // C Major Chord: C5, E5, G5
      const osc = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      osc.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      osc.type = 'sine';
      osc.frequency.value = freq;
      
      const startTime = audioCtx.currentTime + (i * 0.1);
      gainNode.gain.setValueAtTime(0, startTime);
      gainNode.gain.linearRampToValueAtTime(0.2, startTime + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.8);
      
      osc.start(startTime);
      osc.stop(startTime + 0.8);
    });
  }
};
