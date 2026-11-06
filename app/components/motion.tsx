'use client';

import { motion, useInView, useMotionValue, useScroll, useSpring, useTransform, animate, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState, type ReactNode } from 'react';

const EASE = [0.2, 0.8, 0.2, 1] as const;

/** Fade + rise when scrolled into view. */
export function Reveal({ children, delay = 0, y = 28, className, as = 'div' }: { children: ReactNode; delay?: number; y?: number; className?: string; as?: 'div' | 'li' | 'section' }) {
  const reduce = useReducedMotion();
  const M = motion[as];
  return (
    <M
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-8% 0px' }}
      transition={{ duration: 0.8, delay, ease: EASE }}
    >
      {children}
    </M>
  );
}

/** Kinetic typography: words slide up out of a mask, staggered. Keeps real text for SEO/screen readers. */
export function SplitText({ text, className, delay = 0, stagger = 0.06, as: Tag = 'span', once = true }: { text: string; className?: string; delay?: number; stagger?: number; as?: 'span' | 'h1' | 'h2' | 'h3' | 'p'; once?: boolean }) {
  const reduce = useReducedMotion();
  const words = text.split(' ');
  const T = Tag as 'span';
  // NOTE: the observed element is the clipping wrapper itself (observing the clipped child would never intersect).
  return (
    <T className={className} aria-label={text}>
      {words.map((w, i) => (
        <motion.span
          key={i}
          aria-hidden
          className="inline-block overflow-hidden align-bottom pb-[.12em] -mb-[.12em]"
          initial={reduce ? 'show' : 'hidden'}
          whileInView="show"
          viewport={{ once, margin: '0px 0px -8% 0px' }}
          transition={{ delayChildren: delay + i * stagger }}
        >
          <motion.span
            className="inline-block will-change-transform"
            variants={{ hidden: { y: '110%', rotate: 4 }, show: { y: 0, rotate: 0 } }}
            transition={{ duration: 0.9, ease: EASE, delay: delay + i * stagger }}
          >
            {w}
            {i < words.length - 1 ? ' ' : ''}
          </motion.span>
        </motion.span>
      ))}
    </T>
  );
}

/** Infinite horizontal marquee (CSS driven, pauses on hover). */
export function Marquee({ items, className }: { items: string[]; className?: string }) {
  const row = [...items, ...items];
  return (
    <div className={`group overflow-hidden ${className ?? ''}`} aria-hidden>
      <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused]">
        {row.map((t, i) => (
          <span key={i} className="flex items-center whitespace-nowrap px-6 sm:px-10">
            {t}
            <span className="ml-6 sm:ml-10 inline-block size-2 rounded-full bg-current opacity-40" />
          </span>
        ))}
      </div>
    </div>
  );
}

/** Button/element that gently follows the cursor (desktop only). */
export function Magnetic({ children, strength = 0.25 }: { children: ReactNode; strength?: number }) {
  const x = useMotionValue(0), y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18 }), sy = useSpring(y, { stiffness: 220, damping: 18 });
  const ref = useRef<HTMLDivElement>(null);
  return (
    <motion.div
      ref={ref}
      style={{ x: sx, y: sy, display: 'inline-block' }}
      onPointerMove={(e) => {
        if (e.pointerType !== 'mouse' || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onPointerLeave={() => { x.set(0); y.set(0); }}
    >
      {children}
    </motion.div>
  );
}

/** Thin scroll progress bar pinned to the top. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 28 });
  return <motion.div aria-hidden style={{ scaleX }} className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-gradient-to-r from-leaf via-lime to-saffron" />;
}

/** Element that drifts vertically as the page scrolls. */
export function Parallax({ children, offset = 60, className }: { children: ReactNode; offset?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset]);
  return <motion.div ref={ref} style={{ y }} className={className}>{children}</motion.div>;
}

/** Count-up number when visible. */
export function Counter({ to, suffix = '', className }: { to: number; suffix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, { duration: 1.6, ease: EASE, onUpdate: (v) => setN(Math.round(v)) });
    return () => c.stop();
  }, [inView, to]);
  return <span ref={ref} className={className}>{n.toLocaleString()}{suffix}</span>;
}

export { motion, AnimatePresence } from 'motion/react';
