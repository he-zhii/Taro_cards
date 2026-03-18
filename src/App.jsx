import React, { useState, useEffect, useCallback, useRef } from 'react';
import { CheckCircle2, Circle, Star, Settings, Wand2, Sparkles, Plus, Trash2, Gift, Scroll, PartyPopper } from 'lucide-react';
import { playSound } from './audio.js';

export default function MagicRewardApp() {
  // --- 本地缓存数据读取与初始化 ---
  const [view, setView] = useState(() => localStorage.getItem('magic_view') || 'setup'); 
  const [activeTab, setActiveTab] = useState(() => localStorage.getItem('magic_activeTab') || 'tasks');

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('magic_tasks');
    return saved ? JSON.parse(saved) : [
      { id: 1, text: '完成数学作业', completed: false },
      { id: 2, text: '背诵古诗一首', completed: false },
      { id: 3, text: '阅读课外书20分钟', completed: false },
      { id: 4, text: '自己收拾书包', completed: false },
      { id: 5, text: '练琴30分钟', completed: false },
      { id: 6, text: '整理自己的房间', completed: false },
      { id: 7, text: '跳绳100下', completed: false },
      { id: 8, text: '帮妈妈做一件家务', completed: false },
      { id: 9, text: '晚上9点前准时洗漱', completed: false },
    ];
  });

  const [rewards, setRewards] = useState(() => {
    const saved = localStorage.getItem('magic_rewards');
    return saved ? JSON.parse(saved) : [
      '看动画片30分钟', '冰淇淋 1 个', '神秘小贴纸', 
      '免做家务券 1 张', '去游乐园玩一次', '买一本新漫画',
      '周末吃肯德基', '挑选一个小玩具', '爸妈陪玩游戏1小时'
    ];
  });

  const [cards, setCards] = useState(() => {
    const saved = localStorage.getItem('magic_cards');
    return saved ? JSON.parse(saved) : [];
  });

  // --- 家长锁状态 ---
  const [showParentLock, setShowParentLock] = useState(false);
  const [mathQuestion, setMathQuestion] = useState({ a: 0, b: 0, answer: '' });

  // --- 存入缓存 ---
  useEffect(() => { localStorage.setItem('magic_view', view); }, [view]);
  useEffect(() => { localStorage.setItem('magic_activeTab', activeTab); }, [activeTab]);
  useEffect(() => { localStorage.setItem('magic_tasks', JSON.stringify(tasks)); }, [tasks]);
  useEffect(() => { localStorage.setItem('magic_rewards', JSON.stringify(rewards)); }, [rewards]);
  useEffect(() => { localStorage.setItem('magic_cards', JSON.stringify(cards)); }, [cards]);

  const [newTask, setNewTask] = useState('');
  const [newReward, setNewReward] = useState('');

  // --- 翻牌特写动画状态 ---
  const [activeRevealCard, setActiveRevealCard] = useState(null);
  const [revealStep, setRevealStep] = useState(0); // 0: enter, 1: flipping/particles, 2: revealed

  // --- 粒子特效状态 ---
  const [currentEffect, setCurrentEffect] = useState(null);
  const [particles, setParticles] = useState([]);

  // 动态生成粒子
  const generateParticles = useCallback((type) => {
    let newParticles = [];

    if (type === 0) {
        // 0. 神圣耀金飞羽 (Feathers)
        newParticles = Array.from({ length: 45 }).map(() => ({
            id: Math.random().toString(36).substr(2, 9),
            startX: (Math.random() - 0.5) * 40,
            startY: (Math.random() - 0.5) * 40,
            tx: (Math.random() - 0.5) * 500,
            ty: (Math.random() - 0.5) * 500 - 50,
            rot: Math.random() * 360,
            scale: 0.3 + Math.random() * 0.8,
            delay: Math.random() * 0.5,
            dur: 1.2 + Math.random() * 1.2,
            ax: (Math.random() - 0.5) * 80,
            ay: -40 - Math.random() * 60,
            arot: (Math.random() - 0.5) * 90,
            color: ['#fef08a', '#ffffff', '#fed7aa', '#e9d5ff'][Math.floor(Math.random() * 4)]
        }));
    } else if (type === 1) {
        // 1. 幻彩流光泡泡 (Bubbles)
        newParticles = Array.from({ length: 80 }).map((_, i) => {
            const startX = (Math.random() - 0.5) * 60;
            const startY = (Math.random() - 0.5) * 80;
            const glowColor = ['rgba(6,182,212,0.6)', 'rgba(236,72,153,0.6)', 'rgba(16,185,129,0.6)', 'rgba(245,158,11,0.6)', 'rgba(139,92,246,0.6)'][Math.floor(Math.random() * 5)];

            const burstType = Math.floor(Math.random() * 5);
            let animName, ease, burstDur, delay, tx, ty;
            const baseDelay = Math.random() * 2.0;

            switch (burstType) {
                case 0: // A. 强力喷射
                    animName = 'bubble-burst-spray'; ease = 'cubic-bezier(0.1, 0.9, 0.2, 1)';
                    burstDur = 0.8 + Math.random() * 0.5; delay = baseDelay;
                    tx = (Math.random() - 0.5) * 450; ty = (Math.random() - 0.5) * 450 - 50;
                    break;
                case 1: // B. 轻柔漫溢
                    animName = 'bubble-burst-ooze'; ease = 'ease-in-out';
                    burstDur = 1.5 + Math.random() * 1.0; delay = baseDelay + 0.3;
                    tx = (Math.random() - 0.5) * 200; ty = -100 - Math.random() * 200;
                    break;
                case 2: // C. 螺旋涡流
                    animName = 'bubble-burst-spiral'; ease = 'linear';
                    burstDur = 1.2 + Math.random() * 0.8; delay = baseDelay + 0.1;
                    tx = (Math.random() > 0.5 ? 1 : -1) * (150 + Math.random() * 200); ty = (Math.random() - 0.5) * 350;
                    break;
                case 3: // D. 群簇炸裂
                    animName = 'bubble-burst-spray'; ease = 'cubic-bezier(0.1, 0.9, 0.3, 1)';
                    burstDur = 0.6 + Math.random() * 0.4;
                    const clusterGroup = Math.floor(i / 8);
                    delay = clusterGroup * 0.4 + (Math.random() * 0.08);
                    tx = (Math.random() - 0.5) * 300; ty = (Math.random() - 0.5) * 300 - 50;
                    break;
                case 4: // E. 沉浮兜底
                    animName = 'bubble-burst-swoop'; ease = 'ease-in-out';
                    burstDur = 1.2 + Math.random() * 0.6; delay = baseDelay;
                    tx = (Math.random() > 0.5 ? 1 : -1) * (150 + Math.random() * 150); ty = -50 - Math.random() * 100;
                    break;
                default:
                    animName = 'bubble-burst-spray'; ease = 'ease-out'; burstDur = 1; delay = 0; tx = 0; ty = 0;
            }

            return {
                id: Math.random().toString(36).substr(2, 9),
                startX, startY, tx, ty, animName, ease, burstDur, delay,
                ax: (Math.random() - 0.5) * 80,
                ay: (Math.random() - 0.5) * 60 - 30,
                adur: 3 + Math.random() * 4,
                scale: 0.3 + Math.random() * 1.3,
                glowColor,
                zIndex: Math.floor(Math.random() * 10)
            };
        });
    } else if (type === 2) {
        // 2. 魔法樱花风暴 (Sakura)
        newParticles = Array.from({ length: 60 }).map(() => ({
            id: Math.random().toString(36).substr(2, 9),
            startX: (Math.random() - 0.5) * 40,
            startY: (Math.random() - 0.5) * 40,
            tx: (Math.random() - 0.5) * 600,
            ty: (Math.random() - 0.5) * 600,
            rot: Math.random() * 720,
            scale: 0.4 + Math.random() * 0.6,
            delay: Math.random() * 0.8,
            burstDur: 1.5 + Math.random(),
            ax: (Math.random() > 0.5 ? 1 : -1) * (100 + Math.random() * 200),
            ay: (Math.random() - 0.5) * 100,
            arot: Math.random() * 360,
            adur: 3 + Math.random() * 2,
            color: ['#fbcfe8', '#fce7f3', '#f472b6', '#fdf2f8'][Math.floor(Math.random() * 4)],
            zIndex: Math.floor(Math.random() * 10)
        }));
    }

    setParticles(newParticles);
  }, []);

  const renderParticles = () => {
    if (currentEffect === 0) {
        return particles.map((feather) => (
            <div key={feather.id} className="absolute top-1/2 left-1/2 pointer-events-none" style={{
                '--startX': `${feather.startX}px`, '--startY': `${feather.startY}px`,
                '--tx': `${feather.tx}px`, '--ty': `${feather.ty}px`,
                '--rot': `${feather.rot}deg`, '--scale': feather.scale,
                animation: `feather-burst ${feather.dur}s ease-out forwards`,
                animationDelay: `${feather.delay}s`,
                marginTop: '-10px', marginLeft: '-4px'
            }}>
                <div style={{
                    '--ax': `${feather.ax}px`, '--ay': `${feather.ay}px`, '--arot': `${feather.arot}deg`,
                    animation: `feather-ambient 4s ease-in-out infinite alternate`,
                    animationDelay: `${feather.delay + feather.dur}s`,
                    width: '8px', height: '20px', backgroundColor: feather.color,
                    borderRadius: '50% 50% 0 0', clipPath: 'polygon(50% 0%, 100% 20%, 80% 100%, 50% 80%, 20% 100%, 0% 20%)'
                }} />
            </div>
        ));
    } else if (currentEffect === 1) {
        return particles.map((bubble) => (
            <div key={bubble.id} className="absolute top-1/2 left-1/2 pointer-events-none" style={{
                '--startX': `${bubble.startX}px`, '--startY': `${bubble.startY}px`,
                '--tx': `${bubble.tx}px`, '--ty': `${bubble.ty}px`,
                '--scale': bubble.scale,
                animation: `${bubble.animName} ${bubble.burstDur}s ${bubble.ease} forwards`,
                animationDelay: `${bubble.delay}s`,
                marginTop: '-12px', marginLeft: '-12px', zIndex: bubble.zIndex
            }}>
                <div className="rounded-full border border-white/80 bg-white/10 backdrop-blur-sm" style={{
                    width: '24px', height: '24px',
                    boxShadow: `inset 0 0 10px #fff, inset 5px 0 15px ${bubble.glowColor}, 0 0 15px ${bubble.glowColor}`,
                    '--ax': `${bubble.ax}px`, '--ay': `${bubble.ay}px`,
                    animation: `bubble-ambient ${bubble.adur}s ease-in-out infinite alternate`,
                    animationDelay: `${bubble.delay + bubble.burstDur}s`
                }} />
            </div>
        ));
    } else if (currentEffect === 2) {
        return particles.map((petal) => (
            <div key={petal.id} className="absolute top-1/2 left-1/2 pointer-events-none" style={{
                '--startX': `${petal.startX}px`, '--startY': `${petal.startY}px`,
                '--tx': `${petal.tx}px`, '--ty': `${petal.ty}px`,
                '--rot': `${petal.rot}deg`, '--scale': petal.scale,
                animation: `sakura-burst ${petal.burstDur}s cubic-bezier(0.2, 0.8, 0.2, 1) forwards`,
                animationDelay: `${petal.delay}s`,
                marginTop: '-6px', marginLeft: '-6px', zIndex: petal.zIndex
            }}>
                <div className="sakura-petal" style={{
                    width: '12px', height: '12px', backgroundColor: petal.color,
                    '--ax': `${petal.ax}px`, '--ay': `${petal.ay}px`, '--arot': `${petal.arot}deg`,
                    animation: `sakura-ambient ${petal.adur}s ease-in-out forwards`,
                    animationDelay: `${petal.delay + petal.burstDur}s`,
                    boxShadow: `0 0 6px ${petal.color}`
                }} />
            </div>
        ));
    }
    return null;
  };

  const completedTasksCount = tasks.filter(t => t.completed).length;
  const flippedCardsCount = cards.filter(c => c.isFlipped).length;
  const magicEnergy = Math.max(0, completedTasksCount - flippedCardsCount);

  // 开始游戏
  const startGame = () => {
    let shuffledRewards = [...rewards];
    for (let i = shuffledRewards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledRewards[i], shuffledRewards[j]] = [shuffledRewards[j], shuffledRewards[i]];
    }
    const newCards = shuffledRewards.map((reward, index) => ({
      id: index,
      rewardText: reward,
      isFlipped: false
    }));
    const resetTasks = tasks.map(t => ({ ...t, completed: false }));

    setCards(newCards);
    setTasks(resetTasks);
    setView('play');
    setActiveTab('tasks');
  };

  // 触发翻牌特写 (聚光灯效应 + 新粒子特效爆发)
  const triggerReveal = (card) => {
    if (magicEnergy <= 0) {
      alert('魔法能量不足啦！快去完成任务获取能量吧~');
      return;
    }
    setActiveRevealCard(card);
    setRevealStep(0);
    
    // 随机选择一种新动画效果 (0:耀金飞羽, 1:幻彩泡泡, 2:樱花风暴)
    const newEffect = Math.floor(Math.random() * 3);
    setCurrentEffect(newEffect);
    
    // 延迟触发翻转，产生蓄力爆开的感觉
    setTimeout(() => {
      setRevealStep(1);
      generateParticles(newEffect); // 触发满屏特效
      playSound.magicReveal(); // 播放魔法音效
    }, 150);

    // 翻转完成后显示奖励和按钮
    setTimeout(() => {
      setRevealStep(2);
    }, 800);
  };

  // 确认收下奖励，更新主网格状态
  const confirmReward = () => {
    playSound.tada(); // 播放获得奖励音效
    setCards(cards.map(c => c.id === activeRevealCard.id ? { ...c, isFlipped: true } : c));
    setActiveRevealCard(null);
    setCurrentEffect(null);
    setParticles([]);
  };

  // 切换任务
  const toggleTask = (taskId) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        if (!task.completed) playSound.ding(); // 完成任务音效
        return { ...task, completed: !task.completed };
      }
      return task;
    }));
  };

  // --- 家长锁验证逻辑 ---
  const requestSetupAccess = () => {
    setMathQuestion({ a: Math.floor(Math.random() * 8) + 2, b: Math.floor(Math.random() * 8) + 2, answer: '' });
    setShowParentLock(true);
  };

  const verifySetupAccess = () => {
    if (parseInt(mathQuestion.answer) === mathQuestion.a * mathQuestion.b) {
      setShowParentLock(false);
      setView('setup');
    } else {
      alert('回答错误，只有家长才能进入设置哦！');
      setShowParentLock(false);
    }
  };

  // 家长设置操作
  const handleAddTask = () => { if (newTask.trim()) { setTasks([...tasks, { id: Date.now(), text: newTask.trim(), completed: false }]); setNewTask(''); } };
  const removeTask = (id) => setTasks(tasks.filter(t => t.id !== id));
  const handleAddReward = () => { if (newReward.trim()) { setRewards([...rewards, newReward.trim()]); setNewReward(''); } };
  const removeReward = (index) => setRewards(rewards.filter((_, i) => i !== index));

  // --- 注入混合 CSS 动画 ---
  const customStyles = `
    @keyframes float-card {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-6px); }
    }
    @keyframes spin-slow {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
    .group:active .magic-glow-border {
      animation: spin-slow 0.3s linear infinite !important;
      background: conic-gradient(from 90deg at 50% 50%, transparent 10%, #fde047 80%, #ffffff 100%) !important;
    }
    .holo-shine {
      background: linear-gradient(115deg, 
        transparent 20%, 
        rgba(255, 255, 255, 0.4) 30%, 
        rgba(255, 105, 180, 0.3) 45%, 
        rgba(100, 200, 255, 0.4) 55%, 
        transparent 70%);
      background-size: 200% 100%;
      animation: holographic 2.5s ease-in-out infinite alternate;
    }
    @keyframes holographic {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
        
    /* 0. 耀金飞羽 (Feathers) */
    @keyframes feather-burst {
      0% { transform: translate(var(--startX), var(--startY)) rotate(0deg) scale(0); opacity: 0; filter: brightness(2); }
      20% { opacity: 1; transform: translate(calc(var(--startX) + (var(--tx) - var(--startX))*0.5), calc(var(--startY) + (var(--ty) - var(--startY))*0.5)) rotate(180deg) scale(var(--scale)); }
      100% { transform: translate(var(--tx), var(--ty)) rotate(var(--rot)) scale(var(--scale)); opacity: 0; }
    }
    @keyframes feather-ambient {
      0% { transform: translate(0, 0) rotate(0deg); }
      100% { transform: translate(var(--ax), var(--ay)) rotate(var(--arot)); opacity: 0.95; filter: drop-shadow(0 0 8px rgba(250,204,21,0.6)); }
    }

    /* 1. 幻彩泡泡 (Bubbles) - 5种出场姿态与S型环境游走 */
    @keyframes bubble-burst-spray {
      0% { transform: translate(var(--startX), var(--startY)) scale(0); opacity: 0; }
      15% { opacity: 1; transform: translate(calc(var(--startX) + (var(--tx) - var(--startX))*0.3), calc(var(--startY) + (var(--ty) - var(--startY))*0.3)) scale(calc(var(--scale)*1.1)); }
      100% { transform: translate(var(--tx), var(--ty)) scale(var(--scale)); opacity: 0.9; }
    }
    @keyframes bubble-burst-ooze {
      0% { transform: translate(var(--startX), var(--startY)) scale(0); opacity: 0; }
      30% { opacity: 1; transform: translate(calc(var(--startX) + (var(--tx) - var(--startX))*0.1), calc(var(--startY) + (var(--ty) - var(--startY))*0.1)) scale(calc(var(--scale)*0.8)); }
      100% { transform: translate(var(--tx), var(--ty)) scale(var(--scale)); opacity: 0.9; }
    }
    @keyframes bubble-burst-spiral {
      0% { transform: translate(var(--startX), var(--startY)) scale(0); opacity: 0; }
      30% { opacity: 1; transform: translate(calc(var(--startX) + var(--tx)*0.6), calc(var(--startY) - 80px)) scale(var(--scale)); }
      70% { transform: translate(calc(var(--startX) + var(--tx)*1.2), calc(var(--ty) - 40px)) scale(calc(var(--scale)*1.1)); }
      100% { transform: translate(var(--tx), var(--ty)) scale(var(--scale)); opacity: 0.9; }
    }
    @keyframes bubble-burst-swoop {
      0% { transform: translate(var(--startX), var(--startY)) scale(0); opacity: 0; }
      40% { opacity: 1; transform: translate(calc(var(--startX) + (var(--tx) - var(--startX))*0.4), calc(var(--startY) + 120px)) scale(calc(var(--scale)*0.9)); }
      100% { transform: translate(var(--tx), var(--ty)) scale(var(--scale)); opacity: 0.9; }
    }
    
    @keyframes bubble-ambient {
      0% { transform: translate(0, 0) scale(1, 1); opacity: 0.9; }
      33% { transform: translate(calc(var(--ax)*0.8), calc(var(--ay)*0.3)) scale(1.04, 0.96); opacity: 1; }
      66% { transform: translate(calc(var(--ax)*0.2), calc(var(--ay)*0.7)) scale(0.96, 1.04); opacity: 0.95; }
      100% { transform: translate(var(--ax), var(--ay)) scale(1.02, 0.98); opacity: 0.9; }
    }

    /* 2. 樱花风暴 (Sakura) */
    .sakura-petal { border-radius: 15px 0 15px 15px; }
    @keyframes sakura-burst {
      0% { transform: translate(var(--startX), var(--startY)) rotate(0deg) scale(0); opacity: 0; }
      20% { opacity: 1; transform: translate(calc(var(--tx)*0.3), calc(var(--ty)*0.3)) rotate(180deg) scale(var(--scale)); }
      100% { transform: translate(var(--tx), var(--ty)) rotate(var(--rot)) scale(var(--scale)); opacity: 0.8; }
    }
    @keyframes sakura-ambient {
      0% { transform: translate(0, 0) rotate(0deg); }
      100% { transform: translate(var(--ax), var(--ay)) rotate(var(--arot)); opacity: 0; }
    }
  `;

  // --- 家长设置界面 ---
  if (view === 'setup') {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 p-4 max-w-md mx-auto font-sans pb-10">
        <div className="flex items-center justify-center mb-6 pt-4 text-purple-700">
          <Settings className="w-6 h-6 mr-2" />
          <h1 className="text-xl font-bold">家长设置中心</h1>
        </div>
        {/* 任务设置 */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-6 border border-slate-100">
          <h2 className="text-lg font-bold mb-3 flex items-center text-slate-700">
            <Scroll className="w-5 h-5 mr-2 text-blue-500" />
            设置任务单 ({tasks.length})
          </h2>
          <div className="flex mb-3">
            <input type="text" value={newTask} onChange={(e) => setNewTask(e.target.value)} placeholder="输入新任务..." className="flex-1 bg-slate-100 rounded-l-xl px-3 py-2 outline-none text-sm" />
            <button onClick={handleAddTask} className="bg-blue-500 text-white px-4 rounded-r-xl"><Plus className="w-5 h-5" /></button>
          </div>
          <ul className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {tasks.map((task) => (
              <li key={task.id} className="flex justify-between items-center bg-slate-50 p-2 rounded-lg text-sm">
                <span>{task.text}</span>
                <button onClick={() => removeTask(task.id)} className="text-red-400 p-1"><Trash2 className="w-4 h-4" /></button>
              </li>
            ))}
          </ul>
        </div>
        {/* 奖项设置 */}
        <div className="bg-white rounded-2xl shadow-sm p-4 mb-8 border border-slate-100">
          <h2 className="text-lg font-bold mb-3 flex items-center text-slate-700">
            <Gift className="w-5 h-5 mr-2 text-pink-500" />
            设置奖项池 ({rewards.length})
          </h2>
          <div className="flex mb-3">
            <input type="text" value={newReward} onChange={(e) => setNewReward(e.target.value)} placeholder="输入新奖项..." className="flex-1 bg-slate-100 rounded-l-xl px-3 py-2 outline-none text-sm" />
            <button onClick={handleAddReward} className="bg-pink-500 text-white px-4 rounded-r-xl"><Plus className="w-5 h-5" /></button>
          </div>
          <ul className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {rewards.map((reward, index) => (
              <li key={index} className="flex justify-between items-center bg-slate-50 p-2 rounded-lg text-sm">
                <span>{reward}</span>
                <button onClick={() => removeReward(index)} className="text-red-400 p-1"><Trash2 className="w-4 h-4" /></button>
              </li>
            ))}
          </ul>
        </div>
        <button onClick={startGame} disabled={tasks.length === 0 || rewards.length === 0} className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-4 rounded-2xl shadow-lg flex justify-center items-center disabled:opacity-50 active:scale-95 transition-transform">
          <Wand2 className="w-6 h-6 mr-2" />
          注入魔法，生成命运卡牌！
        </button>
      </div>
    );
  }

  // --- 小朋友游玩界面 ---
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 via-indigo-950 to-slate-900 text-white flex flex-col max-w-md mx-auto relative overflow-hidden font-sans select-none">
      <style>{customStyles}</style>

      {/* --- 家长验证锁弹窗 --- */}
      {showParentLock && (
        <div className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-black/80 backdrop-blur-md animate-in fade-in duration-300 px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm text-center shadow-2xl">
            <Settings className="w-12 h-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-800 mb-2">家长身份确认</h3>
            <p className="text-slate-500 text-sm mb-6">请输入这道题的答案以验证家长身份</p>
            <div className="text-4xl font-black text-purple-900 mb-6 drop-shadow-sm">
              {mathQuestion.a} × {mathQuestion.b} = <span className="text-orange-500">?</span>
            </div>
            <input 
              type="number" 
              autoFocus
              className="w-full bg-slate-100 rounded-xl px-4 py-4 text-center text-2xl font-bold mb-6 text-slate-800 outline-none focus:ring-4 focus:ring-purple-200 transition-shadow"
              value={mathQuestion.answer}
              onChange={(e) => setMathQuestion({...mathQuestion, answer: e.target.value})}
              onKeyDown={(e) => e.key === 'Enter' && verifySetupAccess()}
            />
            <div className="flex gap-3">
              <button 
                onClick={() => setShowParentLock(false)}
                className="flex-1 px-4 py-3 rounded-xl bg-slate-200 text-slate-700 font-bold active:scale-95 transition-transform"
              >
                取消
              </button>
              <button 
                onClick={verifySetupAccess}
                className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold active:scale-95 transition-transform shadow-lg shadow-purple-500/30"
              >
                验证
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- 全屏特写动画弹窗 (聚光灯效应) --- */}
      {activeRevealCard && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          
          {/* 光效粒子容器 */}
          {revealStep >= 1 && (
             <div className="absolute inset-0 pointer-events-none overflow-visible z-0">
                {renderParticles()}
             </div>
          )}

          <div className="relative w-64 aspect-[2/3] perspective-1000 z-10">
            <div 
              className="w-full h-full relative duration-700 ease-[cubic-bezier(0.175,0.885,0.32,1.275)]"
              style={{ 
                transformStyle: 'preserve-3d',
                transform: revealStep >= 1 ? 'rotateY(180deg) scale(1.1)' : 'rotateY(0deg) scale(0.9)'
              }}
            >
              {/* 卡牌背面 */}
              <div 
                className="absolute inset-0 w-full h-full rounded-2xl border-2 border-yellow-400 shadow-[0_0_30px_rgba(250,204,21,0.6)] bg-gradient-to-br from-indigo-600 to-purple-800 flex flex-col items-center justify-center"
                style={{ backfaceVisibility: 'hidden' }}
              >
                <Star className="w-16 h-16 text-yellow-300 mb-4 animate-pulse" />
                <div className="text-yellow-300 text-lg font-bold tracking-widest">命运开启</div>
              </div>

              {/* 卡牌正面 */}
              <div 
                className="absolute inset-0 w-full h-full rounded-2xl shadow-[0_0_50px_rgba(232,121,249,0.8)] flex flex-col items-center justify-center p-4 text-center overflow-hidden"
                style={{ 
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                  background: 'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)'
                }}
              >
                <div className="absolute inset-0 holo-shine pointer-events-none mix-blend-overlay opacity-80" />
                
                <div className="relative z-10 flex flex-col items-center bg-white/50 backdrop-blur-sm p-4 rounded-xl border border-white/40 w-full h-full justify-center shadow-inner">
                  <PartyPopper className="text-fuchsia-500 w-12 h-12 mb-4 drop-shadow-md" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-br from-purple-800 to-fuchsia-600 font-black text-2xl leading-tight drop-shadow-sm">
                    {activeRevealCard.rewardText}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 收下奖励按钮 */}
          <div className={`mt-16 transition-all duration-500 ${revealStep === 2 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
             <button 
               onClick={confirmReward}
               className="bg-gradient-to-r from-yellow-400 to-orange-500 text-orange-950 font-black px-8 py-3 rounded-full shadow-[0_0_20px_rgba(250,204,21,0.5)] active:scale-90 flex items-center"
             >
               <Sparkles className="w-5 h-5 mr-2" />
               哇！收下奖励！
             </button>
          </div>
        </div>
      )}

      {/* 装饰背景元素 */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
      <div className="absolute top-40 right-10 w-32 h-32 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>

      {/* 顶部能量条 */}
      <div className="p-5 pt-8 z-10">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 flex items-center justify-between shadow-xl">
          <div className="flex items-center">
            <div className="bg-yellow-400 p-2 rounded-full mr-3 shadow-[0_0_15px_rgba(250,204,21,0.5)]">
              <Star className="w-6 h-6 text-purple-900" />
            </div>
            <div>
              <p className="text-xs text-purple-200 uppercase tracking-wider font-bold">魔法能量</p>
              <p className="text-2xl font-black text-yellow-400">{magicEnergy} <span className="text-sm font-normal text-white/70">次抽取机会</span></p>
            </div>
          </div>
          <button onClick={requestSetupAccess} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center active:bg-white/20">
            <Settings className="w-5 h-5 text-white/70" />
          </button>
        </div>
      </div>

      {/* 内容区域 */}
      <div className="flex-1 overflow-y-auto px-5 pb-24 z-10 scrollbar-hide">
        
        {/* 任务界面 */}
        {activeTab === 'tasks' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            <h2 className="text-xl font-bold mb-4 flex items-center text-purple-100">
              <Scroll className="w-6 h-6 mr-2 text-purple-300" />今日修行卷轴
            </h2>
            <div className="space-y-3">
              {tasks.map(task => (
                <div 
                  key={task.id} onClick={() => toggleTask(task.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center active:scale-95 ${task.completed ? 'bg-purple-800/40 border-purple-500/30' : 'bg-white/10 border-white/20 hover:bg-white/15'}`}
                >
                  <div className="mr-4">
                    {task.completed ? <CheckCircle2 className="w-7 h-7 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]" /> : <Circle className="w-7 h-7 text-purple-300" />}
                  </div>
                  <span className={`flex-1 text-base ${task.completed ? 'text-purple-300 line-through decoration-purple-500/50' : 'text-white'}`}>{task.text}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 卡牌界面 */}
        {activeTab === 'cards' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
             <h2 className="text-xl font-bold mb-6 flex items-center justify-center text-purple-100">
              <Wand2 className="w-6 h-6 mr-2 text-pink-300" />命运塔罗牌阵
            </h2>
            
            <div className="grid grid-cols-3 gap-3">
              {cards.map((card, index) => {
                const isReadyToDraw = magicEnergy > 0 && !card.isFlipped;
                return (
                  <div 
                    key={card.id}
                    onTouchStart={() => {}}
                    onClick={() => !card.isFlipped && triggerReveal(card)}
                    className={`relative w-full aspect-[2/3] cursor-pointer group perspective-1000 
                      ${isReadyToDraw ? 'animate-[float-card_3s_ease-in-out_infinite]' : ''}`}
                    style={{ animationDelay: `${index * 0.15}s` }}
                  >
                    <div className={`w-full h-full relative transition-transform duration-300 
                      ${!card.isFlipped && magicEnergy > 0 ? 'group-active:scale-90' : ''}`}
                      style={{ transformStyle: 'preserve-3d' }}
                    >
                      {/* --- 卡牌背面 --- */}
                      {!card.isFlipped && (
                        <div className="absolute inset-0 w-full h-full rounded-xl overflow-hidden shadow-lg" style={{ backfaceVisibility: 'hidden' }}>
                          {isReadyToDraw ? (
                             <>
                               <div className="absolute inset-[-100%] magic-glow-border animate-[spin-slow_2s_linear_infinite]" 
                                    style={{ background: 'conic-gradient(from 90deg at 50% 50%, transparent 50%, #fbbf24 100%)' }} />
                               <div className="absolute inset-[2px] rounded-lg bg-gradient-to-br from-indigo-800 to-purple-900 flex flex-col items-center justify-center">
                                 <Star className="w-8 h-8 mb-1 text-yellow-300" />
                                 <div className="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center">
                                    <span className="text-white/60 text-[10px] font-bold">{index + 1}</span>
                                 </div>
                               </div>
                             </>
                          ) : (
                             <div className="absolute inset-0 rounded-xl border-2 border-purple-500/30 bg-gradient-to-br from-indigo-800 to-purple-900 flex flex-col items-center justify-center">
                                <Star className="w-8 h-8 mb-1 text-purple-400/50" />
                             </div>
                          )}
                        </div>
                      )}

                      {/* --- 卡牌正面 --- */}
                      {card.isFlipped && (
                        <div className="absolute inset-0 w-full h-full rounded-xl border border-fuchsia-300/50 shadow-inner bg-gradient-to-br from-pink-100 to-purple-100 flex flex-col items-center justify-center p-2 text-center opacity-80 filter saturate-50">
                          <Gift className="text-fuchsia-400 w-5 h-5 mb-1" />
                          <span className="text-purple-950 font-bold text-xs leading-tight line-clamp-3">
                            {card.rewardText}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            
            {flippedCardsCount === cards.length && cards.length > 0 && (
              <div className="mt-8 text-center bg-gradient-to-r from-yellow-400 to-orange-400 text-orange-950 rounded-xl p-4 font-black animate-bounce shadow-lg">
                🎉 太棒啦！所有魔法卡牌都已解开！
              </div>
            )}
          </div>
        )}

      </div>

      {/* 底部导航栏 */}
      <div className="absolute bottom-0 left-0 w-full bg-indigo-950/90 backdrop-blur-lg border-t border-white/10 pb-safe z-20">
        <div className="flex justify-around p-3">
          <button onClick={() => setActiveTab('tasks')} className={`flex flex-col items-center p-2 px-6 rounded-2xl transition-colors ${activeTab === 'tasks' ? 'bg-white/10 text-white' : 'text-purple-400 hover:text-purple-200'}`}>
            <Scroll className="w-6 h-6 mb-1" />
            <span className="text-xs font-bold">修行卷轴</span>
          </button>
          
          <button onClick={() => setActiveTab('cards')} className={`flex flex-col items-center p-2 px-6 rounded-2xl transition-colors relative ${activeTab === 'cards' ? 'bg-white/10 text-white' : 'text-purple-400 hover:text-purple-200'}`}>
            <Wand2 className="w-6 h-6 mb-1" />
            <span className="text-xs font-bold">命运卡牌</span>
            {magicEnergy > 0 && activeTab !== 'cards' && (
              <span className="absolute top-1 right-5 w-3 h-3 bg-red-500 border-2 border-indigo-950 rounded-full animate-ping"></span>
            )}
          </button>
        </div>
      </div>

    </div>
  );
}
