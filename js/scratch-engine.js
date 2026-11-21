/**
 * Luxury HTML5 Canvas Scratch-to-Reveal Engine
 * High-performance, touch & mouse friendly with realistic textures
 * Supports both Date Reveal and Bride & Groom Photo Reveal
 * Includes automatic container tracking, mobile scaling, and precise touch mapping
 */

class LuxuryScratchCard {
  constructor(options) {
    this.container = options.container;
    this.textureType = options.textureType || "gold-leaf";
    this.primaryColor = options.primaryColor || "#660012";
    this.accentColor = options.accentColor || "#D4AF37";
    this.titleText = options.titleText || "Scratch to Reveal";
    this.subText = options.subText || "Use your finger or mouse";
    this.brushSize = options.brushSize || 28;
    this.threshold = options.threshold || 42; // Auto reveal at 42% scratched
    this.onRevealed = options.onRevealed || null;
    this.onScratch = options.onScratch || null;

    this.canvas = null;
    this.ctx = null;
    this.isDrawing = false;
    this.isRevealed = false;
    this.hasScratchedAtLeastOnce = false;
    this.lastPoint = null;
    this.width = 0;
    this.height = 0;
    this.resizeObserver = null;

    this.init();
  }

  init() {
    if (!this.container) return;

    // Remove any previous canvas
    let existingCanvas = this.container.querySelector(".scratch-canvas");
    if (existingCanvas) {
      existingCanvas.remove();
    }

    this.canvas = document.createElement("canvas");
    this.canvas.className = "scratch-canvas";
    this.canvas.style.position = "absolute";
    this.canvas.style.top = "0";
    this.canvas.style.left = "0";
    this.canvas.style.width = "100%";
    this.canvas.style.height = "100%";
    this.canvas.style.zIndex = "10";
    this.canvas.style.touchAction = "none";
    this.canvas.style.borderRadius = "16px";
    this.canvas.style.cursor = "grab";

    this.ctx = this.canvas.getContext("2d", { willReadFrequently: true });

    this.container.style.position = "relative";
    this.container.appendChild(this.canvas);

    this.resizeCanvas();
    this.drawCoverSurface();
    this.bindEvents();
    this.setupResizeObserver();
  }

  setupResizeObserver() {
    if (window.ResizeObserver && this.container) {
      this.resizeObserver = new ResizeObserver((entries) => {
        for (let entry of entries) {
          const cr = entry.contentRect;
          if (cr.width > 0 && cr.height > 0) {
            // If dimensions changed and user hasn't scratched much yet, refresh
            if (!this.isRevealed && !this.hasScratchedAtLeastOnce) {
              if (Math.abs(this.width - cr.width) > 3 || Math.abs(this.height - cr.height) > 3) {
                this.refresh();
              }
            }
          }
        }
      });
      this.resizeObserver.observe(this.container);
    }
  }

  resizeCanvas() {
    const rect = this.container.getBoundingClientRect();
    const clientW = this.container.clientWidth;
    const clientH = this.container.clientHeight;

    this.width = Math.max(clientW || rect.width, 240);
    this.height = Math.max(clientH || rect.height, 160);

    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = Math.round(this.width * dpr);
    this.canvas.height = Math.round(this.height * dpr);

    this.canvas.style.width = `${this.width}px`;
    this.canvas.style.height = `${this.height}px`;

    // Reset transform matrix and apply clean DPR scaling
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.scale(dpr, dpr);
  }

  refresh() {
    if (this.isRevealed) return;
    this.resizeCanvas();
    this.drawCoverSurface();
  }

  drawCoverSurface() {
    const w = this.width;
    const h = this.height;
    const ctx = this.ctx;
    if (!ctx || w <= 0 || h <= 0) return;

    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    const dpr = window.devicePixelRatio || 1;
    ctx.scale(dpr, dpr);
    ctx.globalCompositeOperation = "source-over";
    ctx.clearRect(0, 0, w, h);

    if (this.textureType === "red-velvet") {
      // Luxurious Cartier Red Velvet Flocked Texture
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, "#7A0A1D");
      grad.addColorStop(0.3, "#4F0411");
      grad.addColorStop(0.7, "#6A0818");
      grad.addColorStop(1, "#8A0D22");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Fine Velvet micro-pile texture
      ctx.fillStyle = "rgba(255, 120, 150, 0.09)";
      for (let i = 0; i < 700; i++) {
        ctx.fillRect(Math.random() * w, Math.random() * h, 1.5, 1.5);
      }
    } else if (this.textureType === "silver-foil") {
      // Shimmering Sterling Silver
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, "#D1D5DB");
      grad.addColorStop(0.2, "#FFFFFF");
      grad.addColorStop(0.5, "#9CA3AF");
      grad.addColorStop(0.8, "#F3F4F6");
      grad.addColorStop(1, "#E5E7EB");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
    } else if (this.textureType === "rose-gold") {
      // Rose Gold Metallic
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, "#E0A899");
      grad.addColorStop(0.3, "#FCE7E4");
      grad.addColorStop(0.6, "#B76E79");
      grad.addColorStop(0.85, "#F7D6D0");
      grad.addColorStop(1, "#D48B96");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
    } else if (this.textureType === "emerald-sparkle") {
      // Royal Emerald Diamond Glitter
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, "#044E3B");
      grad.addColorStop(0.4, "#065F46");
      grad.addColorStop(0.7, "#022C22");
      grad.addColorStop(1, "#034332");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      ctx.fillStyle = "rgba(52, 211, 153, 0.25)";
      for (let i = 0; i < 450; i++) {
        ctx.fillRect(Math.random() * w, Math.random() * h, 2, 2);
      }
    } else {
      // 24K Royal Gold Leaf Foil (Default)
      const grad = ctx.createLinearGradient(0, 0, w, h);
      grad.addColorStop(0, "#BF953F");
      grad.addColorStop(0.2, "#FCF6BA");
      grad.addColorStop(0.45, "#B38728");
      grad.addColorStop(0.7, "#FBF5B7");
      grad.addColorStop(0.9, "#AA771C");
      grad.addColorStop(1, "#8A5A14");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Gold shimmer sparkles
      ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
      for (let i = 0; i < 500; i++) {
        ctx.fillRect(Math.random() * w, Math.random() * h, 2, 2);
      }
    }

    // Outer Gilded Border Frame
    ctx.strokeStyle = this.accentColor;
    ctx.lineWidth = 3;
    ctx.strokeRect(6, 6, w - 12, h - 12);

    ctx.strokeStyle = "rgba(255, 255, 255, 0.45)";
    ctx.lineWidth = 1;
    ctx.strokeRect(10, 10, w - 20, h - 20);

    // Corner Ornaments
    this.drawCornerOrnament(ctx, 12, 12);
    this.drawCornerOrnament(ctx, w - 12, 12, true);
    this.drawCornerOrnament(ctx, 12, h - 12, false, true);
    this.drawCornerOrnament(ctx, w - 12, h - 12, true, true);

    // Center Golden Badge Pill
    const badgeW = Math.min(w * 0.82, 260);
    const badgeH = 56;
    const badgeX = (w - badgeW) / 2;
    const badgeY = (h - badgeH) / 2;

    ctx.fillStyle = "rgba(10, 12, 18, 0.75)";
    ctx.beginPath();
    ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 28);
    ctx.fill();

    ctx.strokeStyle = this.accentColor;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 28);
    ctx.stroke();

    // Text instructions
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.font = "bold 13px 'Cinzel', serif, sans-serif";
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText(`✨ ${this.titleText} ✨`, w / 2, badgeY + 20);

    ctx.font = "11px 'Montserrat', sans-serif";
    ctx.fillStyle = this.accentColor;
    ctx.fillText(this.subText, w / 2, badgeY + 39);

    ctx.restore();
  }

  drawCornerOrnament(ctx, x, y, flipX = false, flipY = false) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(flipX ? -1 : 1, flipY ? -1 : 1);
    ctx.strokeStyle = this.accentColor;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(0, 14);
    ctx.lineTo(0, 0);
    ctx.lineTo(14, 0);
    ctx.stroke();
    ctx.restore();
  }

  bindEvents() {
    const c = this.canvas;

    const getPos = (e) => {
      const rect = c.getBoundingClientRect();
      let clientX = e.clientX;
      let clientY = e.clientY;

      if (e.touches && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else if (e.changedTouches && e.changedTouches.length > 0) {
        clientX = e.changedTouches[0].clientX;
        clientY = e.changedTouches[0].clientY;
      }

      const rectW = rect.width || this.width || 1;
      const rectH = rect.height || this.height || 1;

      // Scale coordinates accurately between CSS layout and internal canvas width
      return {
        x: (clientX - rect.left) * (this.width / rectW),
        y: (clientY - rect.top) * (this.height / rectH)
      };
    };

    const startDraw = (e) => {
      if (this.isRevealed) return;
      this.isDrawing = true;
      this.hasScratchedAtLeastOnce = true;
      this.lastPoint = getPos(e);
      this.scratchAt(this.lastPoint.x, this.lastPoint.y);

      if (this.onScratch) this.onScratch();

      if (e.pointerId && c.setPointerCapture) {
        try { c.setPointerCapture(e.pointerId); } catch (err) {}
      }

      if (e.cancelable) {
        e.preventDefault();
      }
    };

    const moveDraw = (e) => {
      if (!this.isDrawing || this.isRevealed) return;
      const currentPoint = getPos(e);
      this.scratchBetween(this.lastPoint, currentPoint);
      this.lastPoint = currentPoint;

      if (this.onScratch) this.onScratch();

      if (e.cancelable) {
        e.preventDefault();
      }
    };

    const endDraw = (e) => {
      if (!this.isDrawing) return;
      this.isDrawing = false;
      this.lastPoint = null;
      this.checkRevealedPercentage();

      if (e && e.pointerId && c.releasePointerCapture) {
        try { c.releasePointerCapture(e.pointerId); } catch (err) {}
      }
    };

    // Modern Pointer Events (Unifies Mobile Touch + Desktop Mouse seamlessly)
    if (window.PointerEvent) {
      c.addEventListener("pointerdown", startDraw);
      window.addEventListener("pointermove", moveDraw);
      window.addEventListener("pointerup", endDraw);
      window.addEventListener("pointercancel", endDraw);
    } else {
      // Fallback Touch & Mouse
      c.addEventListener("mousedown", startDraw);
      window.addEventListener("mousemove", moveDraw);
      window.addEventListener("mouseup", endDraw);

      c.addEventListener("touchstart", startDraw, { passive: false });
      window.addEventListener("touchmove", moveDraw, { passive: false });
      window.addEventListener("touchend", endDraw);
      window.addEventListener("touchcancel", endDraw);
    }
  }

  scratchAt(x, y) {
    const ctx = this.ctx;
    if (!ctx) return;

    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    const dpr = window.devicePixelRatio || 1;
    ctx.scale(dpr, dpr);
    ctx.globalCompositeOperation = "destination-out";

    const rad = this.brushSize;
    const grad = ctx.createRadialGradient(x, y, 0, x, y, rad);
    grad.addColorStop(0, "rgba(0,0,0,1)");
    grad.addColorStop(0.7, "rgba(0,0,0,0.85)");
    grad.addColorStop(1, "rgba(0,0,0,0)");

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, rad, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  scratchBetween(p1, p2) {
    if (!p1 || !p2) return;
    const dist = Math.hypot(p2.x - p1.x, p2.y - p1.y);
    const steps = Math.max(Math.ceil(dist / 5), 1);
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const x = p1.x + (p2.x - p1.x) * t;
      const y = p1.y + (p2.y - p1.y) * t;
      this.scratchAt(x, y);
    }
  }

  checkRevealedPercentage() {
    if (this.isRevealed || !this.hasScratchedAtLeastOnce) return;

    const w = this.canvas.width;
    const h = this.canvas.height;
    if (w <= 0 || h <= 0) return;

    const step = 16;
    let transparentCount = 0;
    let totalSamples = 0;

    try {
      const imgData = this.ctx.getImageData(0, 0, w, h).data;
      for (let y = 0; y < h; y += step) {
        for (let x = 0; x < w; x += step) {
          const index = (y * w + x) * 4 + 3; // Alpha channel
          if (imgData[index] < 128) {
            transparentCount++;
          }
          totalSamples++;
        }
      }

      if (totalSamples > 30) {
        const percent = (transparentCount / totalSamples) * 100;
        if (percent >= this.threshold) {
          this.revealCompletely();
        }
      }
    } catch (err) {
      console.warn("Scratch percentage check warning", err);
    }
  }

  revealCompletely() {
    if (this.isRevealed) return;
    this.isRevealed = true;

    // Smooth celebratory fade out of canvas
    this.canvas.style.transition = "opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1), transform 0.7s ease";
    this.canvas.style.opacity = "0";
    this.canvas.style.transform = "scale(1.04)";

    setTimeout(() => {
      if (this.canvas) {
        this.canvas.style.display = "none";
      }
      if (this.onRevealed) {
        this.onRevealed();
      }
    }, 700);

    // Sparkle fireworks effect around revealed surface
    this.spawnRevealSparkles();
  }

  spawnRevealSparkles() {
    const rect = this.container.getBoundingClientRect();
    for (let i = 0; i < 20; i++) {
      const spark = document.createElement("div");
      spark.className = "reveal-sparkle";
      spark.style.position = "absolute";
      spark.style.left = `${50 + (Math.random() - 0.5) * 60}%`;
      spark.style.top = `${50 + (Math.random() - 0.5) * 60}%`;
      spark.style.width = "8px";
      spark.style.height = "8px";
      spark.style.borderRadius = "50%";
      spark.style.backgroundColor = this.accentColor;
      spark.style.boxShadow = `0 0 10px ${this.accentColor}`;
      spark.style.pointerEvents = "none";
      spark.style.animation = "sparklePop 0.8s forwards";
      this.container.appendChild(spark);
      setTimeout(() => spark.remove(), 800);
    }
  }

  reset() {
    this.isRevealed = false;
    this.isDrawing = false;
    this.hasScratchedAtLeastOnce = false;
    if (this.canvas) {
      this.canvas.style.display = "block";
      this.canvas.style.opacity = "1";
      this.canvas.style.transform = "scale(1)";
      this.refresh();
    }
  }
}

window.LuxuryScratchCard = LuxuryScratchCard;
