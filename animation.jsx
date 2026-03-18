import React, { useState, useCallback, useRef } from 'react';

export default function App() {
    const [currentEffect, setCurrentEffect] = useState(null);
    const [particles, setParticles] = useState([]);
    const [isAnimating, setIsAnimating] = useState(false);
    const containerRef = useRef(null);

    // 动态生成粒子，保证每次点击的效果都是随机且独特的
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
            // 1. 幻彩流光泡泡 (Bubbles) - 5种姿态队列喷射 + S型微风布朗运动稳定态
            newParticles = Array.from({ length: 80 }).map((_, i) => {
                const startX = (Math.random() - 0.5) * 60;
                const startY = (Math.random() - 0.5) * 80;
                const glowColor = ['rgba(6,182,212,0.6)', 'rgba(236,72,153,0.6)', 'rgba(16,185,129,0.6)', 'rgba(245,158,11,0.6)', 'rgba(139,92,246,0.6)'][Math.floor(Math.random() * 5)];

                const burstType = Math.floor(Math.random() * 5);
                let animName, ease, burstDur, delay, tx, ty;
                const baseDelay = Math.random() * 2.0;

                switch (burstType) {
                    case 0: // A. 强力喷射 (Spray)
                        animName = 'bubble-burst-spray'; ease = 'cubic-bezier(0.1, 0.9, 0.2, 1)';
                        burstDur = 0.8 + Math.random() * 0.5; delay = baseDelay;
                        tx = (Math.random() - 0.5) * 450; ty = (Math.random() - 0.5) * 450 - 50;
                        break;
                    case 1: // B. 轻柔漫溢 (Ooze)
                        animName = 'bubble-burst-ooze'; ease = 'ease-in-out';
                        burstDur = 1.5 + Math.random() * 1.0; delay = baseDelay + 0.3;
                        tx = (Math.random() - 0.5) * 200; ty = -100 - Math.random() * 200;
                        break;
                    case 2: // C. 螺旋涡流 (Spiral)
                        animName = 'bubble-burst-spiral'; ease = 'linear';
                        burstDur = 1.2 + Math.random() * 0.8; delay = baseDelay + 0.1;
                        tx = (Math.random() > 0.5 ? 1 : -1) * (150 + Math.random() * 200); ty = (Math.random() - 0.5) * 350;
                        break;
                    case 3: // D. 群簇炸裂 (Cluster)
                        animName = 'bubble-burst-spray'; ease = 'cubic-bezier(0.1, 0.9, 0.3, 1)';
                        burstDur = 0.6 + Math.random() * 0.4;
                        const clusterGroup = Math.floor(i / 8);
                        delay = clusterGroup * 0.4 + (Math.random() * 0.08);
                        tx = (Math.random() - 0.5) * 300; ty = (Math.random() - 0.5) * 300 - 50;
                        break;
                    case 4: // E. 沉浮兜底 (Swoop)
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

    const triggerEffect = (effectIndex) => {
        if (isAnimating) return;
        setCurrentEffect(effectIndex);
        generateParticles(effectIndex);
        setIsAnimating(true);

        // 8秒后重置状态，允许再次点击
        setTimeout(() => {
            setIsAnimating(false);
            setCurrentEffect(null);
            setParticles([]);
        }, 8000);
    };

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

    return (
        <div className="relative w-full h-screen bg-slate-900 flex flex-col items-center justify-center overflow-hidden font-sans">

            {/* 所有的动画 Keyframes 必须包裹在 style 标签内 */}
            <style>{`
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

        /* 1. 幻彩泡泡 (Bubbles) - 新版5种出场姿态与S型环境游走 */
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

        /* 发光卡片背景动画 */
        @keyframes card-pulse {
          0%, 100% { box-shadow: 0 0 20px rgba(255,255,255,0.1), inset 0 0 20px rgba(255,255,255,0.05); }
          50% { box-shadow: 0 0 40px rgba(255,255,255,0.2), inset 0 0 30px rgba(255,255,255,0.1); }
        }
      `}</style>

            {/* 粒子容器 */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden" ref={containerRef}>
                {renderParticles()}
            </div>

            {/* 抽卡UI展示区 */}
            <div className="relative z-10 flex flex-col items-center">
                {/* 魔法卡片本体 */}
                <div
                    className="w-64 h-96 rounded-2xl border border-white/20 bg-white/5 backdrop-blur-md flex flex-col items-center justify-center p-6 relative overflow-hidden transition-transform duration-300 hover:scale-105"
                    style={{ animation: 'card-pulse 3s infinite ease-in-out' }}
                >
                    {/* 卡片内部装饰纹理 */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none rounded-2xl"></div>

                    <div className="w-24 h-24 rounded-full border border-white/30 mb-6 flex items-center justify-center bg-white/5 shadow-inner">
                        <span className="text-4xl">✨</span>
                    </div>

                    <h2 className="text-xl font-bold text-white mb-2 tracking-widest">魔法奖励</h2>
                    <p className="text-sm text-gray-300 text-center mb-8">点击下方按钮<br />触发不同的卡牌特效</p>
                </div>

                {/* 控制面板 */}
                <div className="mt-8 flex gap-4">
                    <button
                        onClick={() => triggerEffect(0)}
                        disabled={isAnimating}
                        className="px-6 py-2 rounded-full bg-gradient-to-r from-yellow-500 to-amber-600 text-white font-medium shadow-lg hover:shadow-yellow-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        耀金飞羽
                    </button>

                    <button
                        onClick={() => triggerEffect(1)}
                        disabled={isAnimating}
                        className="px-6 py-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium shadow-lg hover:shadow-cyan-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        幻彩泡泡
                    </button>

                    <button
                        onClick={() => triggerEffect(2)}
                        disabled={isAnimating}
                        className="px-6 py-2 rounded-full bg-gradient-to-r from-pink-400 to-rose-500 text-white font-medium shadow-lg hover:shadow-pink-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        樱花风暴
                    </button>
                </div>
            </div>

        </div>
    );
}