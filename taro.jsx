import React, { useState, useEffect } from 'react';
import { CheckCircle2, Circle, Star, Settings, Wand2, Sparkles, Plus, Trash2, Gift, Scroll, PartyPopper } from 'lucide-react';

// --- 魔法烟花粒子数据 (在组件外部生成，保证每次性能和动画一致性) ---
const FIREWORK_STARS = Array.from({ length: 24 }).map((_, i) => {
  const angle = (i * 15) + (Math.random() * 15 - 7.5); // 360度全方位散射
  const radius = 120 + Math.random() * 150; // 扩散半径
  const tx = Math.cos(angle * Math.PI / 180) * radius;
  const ty = Math.sin(angle * Math.PI / 180) * radius;
  // 随机魔法配色
  const color = ['#fde047', '#e879f9', '#c084fc', '#ffffff', '#f472b6'][Math.floor(Math.random() * 5)];
  const size = 12 + Math.random() * 16;
  const rot = Math.random() * 360;
  return { tx, ty, color, size, rot, delay: Math.random() * 0.15 }; // 微小的延迟产生错落感
});

const FIREWORK_RAYS = Array.from({ length: 16 }).map((_, i) => {
  const angle = (i * 22.5) + (Math.random() * 5); // 锐利光束的角度
  return { angle, delay: Math.random() * 0.1 };
});

export default function MagicRewardApp() {
  const [view, setView] = useState('setup'); 
  const [activeTab, setActiveTab] = useState('tasks');

  // --- 核心数据状态 ---
  const [tasks, setTasks] = useState([
    { id: 1, text: '完成数学作业', completed: false },
    { id: 2, text: '背诵古诗一首', completed: false },
    { id: 3, text: '阅读课外书20分钟', completed: false },
    { id: 4, text: '自己收拾书包', completed: false },
    { id: 5, text: '练琴30分钟', completed: false },
    { id: 6, text: '整理自己的房间', completed: false },
    { id: 7, text: '跳绳100下', completed: false },
    { id: 8, text: '帮妈妈做一件家务', completed: false },
    { id: 9, text: '晚上9点前准时洗漱', completed: false },
  ]);

  const [rewards, setRewards] = useState([
    '看动画片30分钟', '冰淇淋 1 个', '神秘小贴纸', 
    '免做家务券 1 张', '去游乐园玩一次', '买一本新漫画',
    '周末吃肯德基', '挑选一个小玩具', '爸妈陪玩游戏1小时'
  ]);

  const [cards, setCards] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [newReward, setNewReward] = useState('');

  // --- 翻牌特写动画状态 ---
  const [activeRevealCard, setActiveRevealCard] = useState(null);
  const [revealStep, setRevealStep] = useState(0); // 0: enter, 1: flipping, 2: revealed

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

  // 触发翻牌特写 (聚光灯效应)
  const triggerReveal = (card) => {
    if (magicEnergy <= 0) {
      alert('魔法能量不足啦！快去完成任务获取能量吧~');
      return;
    }
    setActiveRevealCard(card);
    setRevealStep(0);
    
    // 延迟触发翻转，产生蓄力爆开的感觉
    setTimeout(() => {
      setRevealStep(1);
    }, 150);

    // 翻转完成后显示奖励和按钮
    setTimeout(() => {
      setRevealStep(2);
    }, 800);
  };

  // 确认收下奖励，更新主网格状态
  const confirmReward = () => {
    setCards(cards.map(c => c.id === activeRevealCard.id ? { ...c, isFlipped: true } : c));
    setActiveRevealCard(null);
  };

  // 切换任务
  const toggleTask = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  // 家长设置操作
  const handleAddTask = () => { if (newTask.trim()) { setTasks([...tasks, { id: Date.now(), text: newTask.trim(), completed: false }]); setNewTask(''); } };
  const removeTask = (id) => setTasks(tasks.filter(t => t.id !== id));
  const handleAddReward = () => { if (newReward.trim()) { setRewards([...rewards, newReward.trim()]); setNewReward(''); } };
  const removeReward = (index) => setRewards(rewards.filter((_, i) => i !== index));

  // --- 注入自定义炫酷 CSS 动画 ---
  // 这部分实现了流光、呼吸、全息反光和爆点特效
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
    @keyframes firework-star {
      /* 0%: 中心点缩小待命 */
      0% { transform: translate(0, 0) scale(0) rotate(0deg); opacity: 1; }
      /* 30%: 瞬间炸开到目标点 */
      30% { transform: translate(var(--tx), var(--ty)) scale(1) rotate(var(--rot)); opacity: 1; }
      /* 100%: 缓缓坠落并消散(重力模拟) */
      100% { transform: translate(calc(var(--tx) * 1.2), calc(var(--ty) + 180px)) scale(0.3) rotate(calc(var(--rot) + 180deg)); opacity: 0; }
    }
    @keyframes firework-ray {
      0% { transform: rotate(var(--angle)) translateY(0) scaleY(0.2); opacity: 1; filter: brightness(2); }
      100% { transform: rotate(var(--angle)) translateY(-250px) scaleY(1.5); opacity: 0; }
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

      {/* --- 全屏特写动画弹窗 (聚光灯效应) --- */}
      {activeRevealCard && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
          
          {/* 光效爆点 (卡牌翻转到一半时爆发: 魔法星辰礼花) */}
          {revealStep >= 1 && (
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-0">
                {/* 1. 光芒射线 (瞬间放射) */}
                {FIREWORK_RAYS.map((ray, i) => (
                  <div key={`ray-${i}`} className="absolute top-1/2 left-1/2 w-1.5 h-32 origin-bottom rounded-full mix-blend-screen"
                       style={{
                         background: 'linear-gradient(to top, transparent, rgba(253, 224, 71, 0.8), #fff)',
                         '--angle': `${ray.angle}deg`,
                         animation: `firework-ray 0.6s ease-out forwards`,
                         animationDelay: `${ray.delay}s`,
                         marginTop: '-8rem', // 从中心点向上生长
                         marginLeft: '-0.1875rem' 
                       }} />
                ))}
                {/* 2. 魔法星辰 (抛出并受重力下落) */}
                {FIREWORK_STARS.map((star, i) => (
                  <div key={`star-${i}`} className="absolute top-1/2 left-1/2 drop-shadow-[0_0_8px_currentColor]"
                       style={{
                         '--tx': `${star.tx}px`,
                         '--ty': `${star.ty}px`,
                         '--rot': `${star.rot}deg`,
                         animation: `firework-star 1.2s cubic-bezier(0.15, 1, 0.3, 1) forwards`,
                         animationDelay: `${star.delay}s`,
                         color: star.color,
                         marginTop: `-${star.size / 2}px`,
                         marginLeft: `-${star.size / 2}px`
                       }}>
                     <Star className="fill-current" style={{ width: star.size, height: star.size }} />
                  </div>
                ))}
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
              {/* 卡牌背面 (大尺寸) */}
              <div 
                className="absolute inset-0 w-full h-full rounded-2xl border-2 border-yellow-400 shadow-[0_0_30px_rgba(250,204,21,0.6)] bg-gradient-to-br from-indigo-600 to-purple-800 flex flex-col items-center justify-center"
                style={{ backfaceVisibility: 'hidden' }}
              >
                <Star className="w-16 h-16 text-yellow-300 mb-4 animate-pulse" />
                <div className="text-yellow-300 text-lg font-bold tracking-widest">命运开启</div>
              </div>

              {/* 卡牌正面 (全息闪卡质感) */}
              <div 
                className="absolute inset-0 w-full h-full rounded-2xl shadow-[0_0_50px_rgba(232,121,249,0.8)] flex flex-col items-center justify-center p-4 text-center overflow-hidden"
                style={{ 
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(180deg)',
                  // 基础金属渐变底色
                  background: 'linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%)'
                }}
              >
                {/* 动态全息反光层 */}
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
          <button onClick={() => setView('setup')} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center active:bg-white/20">
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
                  // 待机呼吸感 (float-card) & 交互微缩蓄力 (active:scale-90)
                  <div 
                    key={card.id}
                    onTouchStart={() => {}} // 修复移动端 active 伪类生效的问题
                    onClick={() => !card.isFlipped && triggerReveal(card)}
                    className={`relative w-full aspect-[2/3] cursor-pointer group perspective-1000 
                      ${isReadyToDraw ? 'animate-[float-card_3s_ease-in-out_infinite]' : ''}`}
                    style={{ animationDelay: `${index * 0.15}s` }} // 让呼吸感错落有致
                  >
                    <div className={`w-full h-full relative transition-transform duration-300 
                      ${!card.isFlipped && magicEnergy > 0 ? 'group-active:scale-90' : ''}`}
                      style={{ transformStyle: 'preserve-3d' }}
                    >
                      {/* --- 卡牌背面 (在网格中未翻开) --- */}
                      {!card.isFlipped && (
                        <div className="absolute inset-0 w-full h-full rounded-xl overflow-hidden shadow-lg" style={{ backfaceVisibility: 'hidden' }}>
                          {/* 边缘流光动画层 */}
                          {isReadyToDraw ? (
                             <>
                               {/* 旋转的渐变背景 (光芒汇聚: 按下时通过 group-active 改变动画和颜色) */}
                               <div className="absolute inset-[-100%] magic-glow-border animate-[spin-slow_2s_linear_infinite]" 
                                    style={{ background: 'conic-gradient(from 90deg at 50% 50%, transparent 50%, #fbbf24 100%)' }} />
                               {/* 遮罩内层，露出 2px 的边缘作为流光 */}
                               <div className="absolute inset-[2px] rounded-lg bg-gradient-to-br from-indigo-800 to-purple-900 flex flex-col items-center justify-center">
                                 <Star className="w-8 h-8 mb-1 text-yellow-300" />
                                 <div className="w-6 h-6 rounded-full border border-white/20 flex items-center justify-center">
                                    <span className="text-white/60 text-[10px] font-bold">{index + 1}</span>
                                 </div>
                               </div>
                             </>
                          ) : (
                             // 能量不足时的普通态
                             <div className="absolute inset-0 rounded-xl border-2 border-purple-500/30 bg-gradient-to-br from-indigo-800 to-purple-900 flex flex-col items-center justify-center">
                                <Star className="w-8 h-8 mb-1 text-purple-400/50" />
                             </div>
                          )}
                        </div>
                      )}

                      {/* --- 卡牌正面 (在网格中已翻开的静态展示) --- */}
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
