import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Adapted from the open-source React Bits FadeContent pattern for simple reveal-on-scroll behavior.
export default function FadeContent({
  children,
  className = "",
  blur = false,
  duration = 0.9,
  delay = 0,
  threshold = 0.2
}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const animation = gsap.fromTo(
      el,
      {
        autoAlpha: 0,
        y: 24,
        filter: blur ? "blur(8px)" : "blur(0px)"
      },
      {
        autoAlpha: 1,
        y: 0,
        filter: "blur(0px)",
        duration,
        delay,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: `top ${100 - threshold * 100}%`,
          once: true
        }
      }
    );

    return () => {
      animation.scrollTrigger?.kill();
      animation.kill();
    };
  }, [blur, delay, duration, threshold]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
