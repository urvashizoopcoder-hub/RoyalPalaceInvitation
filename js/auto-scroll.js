/**
 * Luxury Auto-Scroll Controller
 * Smooth cinematic scrolling with Play/Pause, Speed adjustments,
 * Touch detection, and Progress Bar.
 */

class LuxuryAutoScroll {
  constructor(targetElement = null) {
    this.target = targetElement; // if null, scrolls window
    this.isPlaying = false;
    this.speed = 1.2; // px per frame
    this.speedPreset = "normal"; // slow = 0.6, normal = 1.2, fast = 2.4
    this.animationFrame = null;
    this.userInterrupted = false;
    this.userTouchTimeout = null;

    this.onStateChange = null;
    this.init();
  }

  init() {
    this.bindUserInteractions();
  }

  setTarget(el) {
    this.stop();
    this.target = el;
    this.bindUserInteractions();
  }

  bindUserInteractions() {
    const el = this.target || window;

    const onUserTouch = () => {
      if (this.isPlaying) {
        this.pause();
        this.userInterrupted = true;
        if (this.onStateChange) this.onStateChange({ isPlaying: false, userInterrupted: true });

        clearTimeout(this.userTouchTimeout);
        this.userTouchTimeout = setTimeout(() => {
          this.userInterrupted = false;
        }, 3000);
      }
    };

    el.addEventListener("wheel", onUserTouch, { passive: true });
    el.addEventListener("touchstart", onUserTouch, { passive: true });
  }

  toggle() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  play() {
    if (this.isPlaying) return;
    this.isPlaying = true;
    this.userInterrupted = false;
    if (this.onStateChange) this.onStateChange({ isPlaying: true, speed: this.speedPreset });
    this.step();
  }

  pause() {
    this.isPlaying = false;
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
    if (this.onStateChange) this.onStateChange({ isPlaying: false, speed: this.speedPreset });
  }

  stop() {
    this.pause();
  }

  setSpeed(preset) {
    this.speedPreset = preset;
    if (preset === "slow") this.speed = 0.6;
    else if (preset === "fast") this.speed = 2.5;
    else this.speed = 1.2; // normal

    if (this.onStateChange) this.onStateChange({ isPlaying: this.isPlaying, speed: this.speedPreset });
  }

  scrollToTop() {
    this.pause();
    if (this.target) {
      this.target.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  step() {
    if (!this.isPlaying) return;

    let currentScroll = 0;
    let maxScroll = 0;

    if (this.target) {
      currentScroll = this.target.scrollTop;
      maxScroll = this.target.scrollHeight - this.target.clientHeight;
    } else {
      currentScroll = window.scrollY || window.pageYOffset;
      maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    }

    if (currentScroll >= maxScroll - 2) {
      // Reached bottom
      this.pause();
      if (this.onStateChange) this.onStateChange({ isPlaying: false, reachedEnd: true });
      return;
    }

    const nextScroll = currentScroll + this.speed;

    if (this.target) {
      this.target.scrollTop = nextScroll;
    } else {
      window.scrollTo(0, nextScroll);
    }

    // Update progress
    const progress = Math.min((nextScroll / Math.max(maxScroll, 1)) * 100, 100);
    this.updateProgressBar(progress);

    this.animationFrame = requestAnimationFrame(() => this.step());
  }

  updateProgressBar(percent) {
    const bar = document.getElementById("autoScrollProgressBar");
    if (bar) {
      bar.style.width = `${percent}%`;
    }
  }
}

window.LuxuryAutoScroll = LuxuryAutoScroll;
