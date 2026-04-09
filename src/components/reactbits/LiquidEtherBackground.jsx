import { useEffect, useRef } from "react";

export default function LiquidEtherBackground({
  colors = ["#2563eb", "#0ea5e9", "#1d4ed8"],
  mouseForce = 20,
  cursorSize = 100,
  autoDemo = true,
  autoSpeed = 0.5,
  autoIntensity = 2.2,
  takeoverDuration = 0.25,
  autoResumeDelay = 3000,
  autoRampDuration = 0.6
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rafId;
    let width = 0;
    let height = 0;
    const maxDpr = 2;

    const pointer = {
      x: 0,
      y: 0,
      active: false,
      userInteractedAt: performance.now(),
      takeoverStart: 0,
      takeoverFromX: 0,
      takeoverFromY: 0,
      takeoverToX: 0,
      takeoverToY: 0,
      takeoverActive: false
    };

    const blobs = [
      { x: 0, y: 0, vx: 0, vy: 0, r: 220, color: colors[0] },
      { x: 0, y: 0, vx: 0, vy: 0, r: 170, color: colors[1] || colors[0] },
      { x: 0, y: 0, vx: 0, vy: 0, r: 150, color: colors[2] || colors[1] || colors[0] }
    ];
    const motionHistory = [];
    const historySize = 18;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
      width = rect.width;
      height = rect.height;

      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      blobs[0].x = width * 0.35;
      blobs[0].y = height * 0.5;
      blobs[1].x = width * 0.62;
      blobs[1].y = height * 0.38;
      blobs[2].x = width * 0.58;
      blobs[2].y = height * 0.66;
    };

    const drawBackground = () => {
      const bgGradient = ctx.createLinearGradient(0, 0, width, height);
      bgGradient.addColorStop(0, "#040814");
      bgGradient.addColorStop(0.5, "#07122a");
      bgGradient.addColorStop(1, "#061537");
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, width, height);
    };

    const drawBlob = (blob) => {
      const gradient = ctx.createRadialGradient(blob.x, blob.y, 0, blob.x, blob.y, blob.r);
      gradient.addColorStop(0, `${blob.color}d9`);
      gradient.addColorStop(0.45, `${blob.color}8c`);
      gradient.addColorStop(1, `${blob.color}00`);

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(blob.x, blob.y, blob.r, 0, Math.PI * 2);
      ctx.fill();
    };

    const smoothstep = (t) => t * t * (3 - 2 * t);

    const animate = (time) => {
      const t = time * 0.001;
      const now = performance.now();

      drawBackground();

      const allowAuto = autoDemo && now - pointer.userInteractedAt >= autoResumeDelay;

      let autoRamp = 1;
      if (allowAuto && autoRampDuration > 0) {
        const elapsed = (now - (pointer.userInteractedAt + autoResumeDelay)) / (autoRampDuration * 1000);
        autoRamp = smoothstep(Math.min(1, Math.max(0, elapsed)));
      }

      let tx = width * 0.52;
      let ty = height * 0.5;

      if (pointer.takeoverActive) {
        const tt = (now - pointer.takeoverStart) / (takeoverDuration * 1000);
        if (tt >= 1) {
          pointer.takeoverActive = false;
          tx = pointer.takeoverToX;
          ty = pointer.takeoverToY;
        } else {
          const k = smoothstep(tt);
          tx = pointer.takeoverFromX + (pointer.takeoverToX - pointer.takeoverFromX) * k;
          ty = pointer.takeoverFromY + (pointer.takeoverToY - pointer.takeoverFromY) * k;
        }
      } else if (pointer.active) {
        tx = pointer.x;
        ty = pointer.y;
      } else if (allowAuto) {
        tx = width * (0.52 + Math.sin(t * (0.45 * autoSpeed + 0.01)) * 0.18);
        ty = height * (0.5 + Math.cos(t * (0.35 * autoSpeed + 0.01)) * 0.16);
      }

      const lead = blobs[0];
      const followStrength = pointer.active || pointer.takeoverActive ? (0.005 * mouseForce) / 20 : 0.005 * autoIntensity * autoRamp;
      lead.vx += (tx - lead.x) * followStrength;
      lead.vy += (ty - lead.y) * followStrength;
      lead.vx *= 0.88;
      lead.vy *= 0.88;
      lead.x += lead.vx;
      lead.y += lead.vy;

      motionHistory.push({ x: lead.x, y: lead.y, r: blobs[0].r, t: now });
      if (motionHistory.length > historySize) {
        motionHistory.shift();
      }

      blobs[1].x = lead.x + Math.cos(t * 1.2) * 130;
      blobs[1].y = lead.y + Math.sin(t * 1.35) * 92;
      blobs[2].x = lead.x + Math.cos(-t * 0.9) * 160;
      blobs[2].y = lead.y + Math.sin(-t * 1.05) * 106;

      const targetR = Math.max(80, cursorSize * 1.8);
      blobs[0].r += (targetR - blobs[0].r) * 0.06;
      blobs[1].r += (targetR * 0.8 - blobs[1].r) * 0.06;
      blobs[2].r += (targetR * 0.7 - blobs[2].r) * 0.06;

      ctx.globalCompositeOperation = "screen";
      ctx.filter = "blur(38px) saturate(130%)";
      drawBlob(blobs[0]);
      drawBlob(blobs[1]);
      drawBlob(blobs[2]);

      for (let i = 0; i < motionHistory.length; i += 1) {
        const entry = motionHistory[i];
        const k = (i + 1) / motionHistory.length;
        const ghost = {
          x: entry.x,
          y: entry.y,
          r: entry.r * (0.5 + k * 0.45),
          color: colors[i % colors.length] || colors[0]
        };
        ctx.globalAlpha = k * 0.22;
        drawBlob(ghost);
      }
      ctx.globalAlpha = 1;

      ctx.filter = "none";
      ctx.globalCompositeOperation = "source-over";

      const grainOpacity = 0.035;
      ctx.fillStyle = `rgba(255,255,255,${grainOpacity})`;
      for (let i = 0; i < 80; i += 1) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        ctx.fillRect(x, y, 1, 1);
      }

      rafId = window.requestAnimationFrame(animate);
    };

    const onPointerMove = (event) => {
      const rect = canvas.getBoundingClientRect();
      const inside =
        event.clientX >= rect.left &&
        event.clientX <= rect.right &&
        event.clientY >= rect.top &&
        event.clientY <= rect.bottom;

      if (!inside) {
        pointer.active = false;
        return;
      }

      const nextX = event.clientX - rect.left;
      const nextY = event.clientY - rect.top;

      if (!pointer.active) {
        pointer.takeoverFromX = blobs[0].x;
        pointer.takeoverFromY = blobs[0].y;
        pointer.takeoverToX = nextX;
        pointer.takeoverToY = nextY;
        pointer.takeoverStart = performance.now();
        pointer.takeoverActive = true;
      }

      pointer.x = nextX;
      pointer.y = nextY;
      pointer.active = true;
      pointer.userInteractedAt = performance.now();
    };

    const onPointerLeaveViewport = () => {
      pointer.active = false;
    };

    resize();

    if (reducedMotion) {
      drawBackground();
      ctx.globalCompositeOperation = "screen";
      ctx.filter = "blur(38px)";
      blobs.forEach(drawBlob);
      ctx.filter = "none";
      ctx.globalCompositeOperation = "source-over";
      return () => {};
    }

    rafId = window.requestAnimationFrame(animate);

    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("mouseleave", onPointerLeaveViewport);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("mouseleave", onPointerLeaveViewport);
    };
  }, [
    autoDemo,
    autoIntensity,
    autoRampDuration,
    autoResumeDelay,
    autoSpeed,
    colors,
    cursorSize,
    mouseForce,
    takeoverDuration
  ]);

  return <canvas ref={canvasRef} className="liquid-ether-canvas" aria-hidden="true" />;
}
