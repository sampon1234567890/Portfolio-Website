import { useEffect, useMemo, useRef } from 'react';
import { gsap } from 'gsap';

import './ScrambledText.css';

const ScrambledText = ({
  radius = 100,
  duration = 1.2,
  speed = 0.5,
  scrambleChars = '.:',
  className = '',
  style = {},
  children
}) => {
  const rootRef = useRef(null);
  const charsRef = useRef([]);
  const tweenMapRef = useRef(new WeakMap());

  const text = useMemo(() => {
    if (typeof children === 'string') return children;
    return '';
  }, [children]);

  useEffect(() => {
    charsRef.current.forEach(c => {
      if (c) {
        c.dataset.content = c.textContent || '';
      }
    });

    const scrambleChar = (charEl, localDuration) => {
      const existing = tweenMapRef.current.get(charEl);
      if (existing) existing.kill();

      const state = { p: 0 };
      const chars = scrambleChars || '.:';
      const updateEvery = Math.max(1, Math.round(6 - Math.min(4, speed * 3)));
      let frame = 0;

      const tween = gsap.to(state, {
        p: 1,
        duration: Math.max(0.1, localDuration),
        ease: 'none',
        onUpdate: () => {
          frame += 1;
          const original = charEl.dataset.content || '';
          if (state.p > 0.78) {
            charEl.textContent = original;
            return;
          }
          if (frame % updateEvery === 0) {
            charEl.textContent = chars[Math.floor(Math.random() * chars.length)] || original;
          }
        },
        onComplete: () => {
          charEl.textContent = charEl.dataset.content || '';
          tweenMapRef.current.delete(charEl);
        }
      });

      tweenMapRef.current.set(charEl, tween);
    };

    const handleMove = e => {
      charsRef.current.forEach(c => {
        if (!c) return;
        const { left, top, width, height } = c.getBoundingClientRect();
        const dx = e.clientX - (left + width / 2);
        const dy = e.clientY - (top + height / 2);
        const dist = Math.hypot(dx, dy);

        if (dist < radius) {
          scrambleChar(c, duration * (1 - dist / radius));
        }
      });
    };

    const el = rootRef.current;
    if (!el) return;

    const onLeave = () => {
      charsRef.current.forEach(c => {
        if (c) c.textContent = c.dataset.content || '';
      });
    };

    el.addEventListener('pointermove', handleMove);
    el.addEventListener('pointerleave', onLeave);

    return () => {
      el.removeEventListener('pointermove', handleMove);
      el.removeEventListener('pointerleave', onLeave);
      charsRef.current.forEach(c => {
        const tween = c ? tweenMapRef.current.get(c) : null;
        if (tween) tween.kill();
      });
    };
  }, [radius, duration, speed, scrambleChars, text]);

  return (
    <div ref={rootRef} className={`text-block ${className}`} style={style}>
      <p>
        {Array.from(text).map((ch, index) => (
          <span
            key={`${ch}-${index}`}
            ref={el => {
              charsRef.current[index] = el;
            }}
            className="char"
          >
            {ch === ' ' ? '\u00A0' : ch}
          </span>
        ))}
      </p>
    </div>
  );
};

export default ScrambledText;
