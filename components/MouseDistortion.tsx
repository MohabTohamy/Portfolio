'use client';
import dynamic from 'next/dynamic';

const LiquidEther = dynamic(() => import('./LiquidEther'), { ssr: false });

export default function MouseDistortion() {
    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: 9998,
                pointerEvents: 'none',
            }}
        >
            <LiquidEther
                colors={['#3a8fa8', '#3a8fa8', '#3a8fa8']}
                mouseForce={12}
                cursorSize={100}
                isViscous
                viscous={2}
                iterationsViscous={32}
                iterationsPoisson={32}
                resolution={0.5}
                isBounce={false}
                autoDemo
                autoSpeed={10}
                autoIntensity={10}
                takeoverDuration={0.0}
                autoResumeDelay={2000}
                autoRampDuration={0.6}
                style={{ width: '100%', height: '100%' }}
            />
        </div>
    );
}
