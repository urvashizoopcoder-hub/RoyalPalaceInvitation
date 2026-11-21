/**
 * 3D Box & Card Opening Animation Engine
 * Features 10 Structurally & Mechanically Distinct 3D Unboxing Designs:
 * 1. Cartier Velvet Jewelry Box (with silk ribbon bow & rose petals)
 * 2. Royal Palace Haveli Arch Gates (with brass studs, ring latch & marigolds)
 * 3. Sacred Temple Sanctorum (with hanging temple bells & Gopuram arch)
 * 4. Royal Antique Scroll (with gold finials & vertical unroll)
 * 5. Vintage Wax-Sealed Folio Envelope (with cracking wax seal & slide-out)
 * 6. Modern Frosted Acrylic Case (with neon edge glow & sliding glass lid)
 * 7. Kyoto Shoji Screen (with Japanese lattice sliding screens)
 * 8. Antique Domed Treasure Chest (with curved lid opening on X-axis & light rays)
 * 9. Royal Palanquin / Doli (with draped silk curtains & golden tassels)
 * 10. Leather Grimoire / Book of Vows (with 3D page-turn front cover)
 */

class BoxAnimationEngine {
  constructor() {
    this.isOpen = false;
    this.particleInterval = null;
    this.audioEngine = null;
    this.activeTemplate = null;
    this.container = null;
  }

  init(containerEl, template, audioEngine) {
    this.container = containerEl;
    this.activeTemplate = template;
    this.audioEngine = audioEngine;
    this.isOpen = false;
    this.renderBoxUI();
  }

  setTemplate(template) {
    this.activeTemplate = template;
    if (!this.isOpen) {
      this.renderBoxUI();
    }
  }

  renderBoxUI() {
    if (!this.container) return;
    const t = this.activeTemplate;
    const boxType = t.boxType || "velvet-ribbon-box";
    let boxMarkup = "";

    // 1. CARTIER VELVET JEWELRY BOX
    if (boxType === "velvet-ribbon-box") {
      boxMarkup = `
        <div class="box-3d-wrapper" id="box3DWrapper">
          <div class="box-3d-container box-type-velvet" id="box3DContainer">
            <div class="box-ambient-shadow"></div>
            
            <!-- Left Velvet Flap -->
            <div class="box-door box-door-left velvet-flap" id="boxDoorLeft" style="background-color: ${t.boxColor || t.primaryColor};">
              <div class="velvet-pile-overlay"></div>
              <div class="door-inner-rim" style="border-color: ${t.accentColor};"></div>
              <div class="velvet-horizontal-ribbon" style="background: linear-gradient(90deg, ${t.ribbonColor}, #fff6, ${t.ribbonColor});"></div>
            </div>

            <!-- Right Velvet Flap -->
            <div class="box-door box-door-right velvet-flap" id="boxDoorRight" style="background-color: ${t.boxColor || t.primaryColor};">
              <div class="velvet-pile-overlay"></div>
              <div class="door-inner-rim" style="border-color: ${t.accentColor};"></div>
              <div class="velvet-horizontal-ribbon" style="background: linear-gradient(90deg, ${t.ribbonColor}, #fff6, ${t.ribbonColor});"></div>
            </div>

            <!-- Vertical Silk Ribbon -->
            <div class="ribbon-vertical-wrap" id="ribbonVerticalWrap">
              <div class="ribbon-vertical" style="background: linear-gradient(180deg, ${t.ribbonColor}, #ffffff66, ${t.ribbonColor});"></div>
            </div>

            <!-- 3D Tied Silk Bow Knot & Monogram Seal -->
            <div class="box-center-knot" id="boxCenterKnot">
              <div class="cartier-silk-bow" style="background: ${t.ribbonColor};">
                <div class="bow-wing bow-wing-left" style="background: radial-gradient(circle at 30% 30%, #fff7, ${t.ribbonColor});"></div>
                <div class="bow-wing bow-wing-right" style="background: radial-gradient(circle at 70% 30%, #fff7, ${t.ribbonColor});"></div>
                <div class="bow-ribbon-tail bow-tail-l" style="background: linear-gradient(to bottom, ${t.ribbonColor}, #0004);"></div>
                <div class="bow-ribbon-tail bow-tail-r" style="background: linear-gradient(to bottom, ${t.ribbonColor}, #0004);"></div>
              </div>
              <div class="cartier-gold-seal" style="border-color: ${t.accentColor}; background: radial-gradient(circle, ${t.primaryColor}, #0a0104); color: ${t.accentColor};">
                <span class="seal-icon">${this.getSealSvg(t.sealIcon)}</span>
                <span class="seal-text">${t.sealText || 'CARTIER'}</span>
              </div>
            </div>

            <div class="box-open-hint" id="boxOpenHint">
              <span class="hint-pulse"></span>
              <span class="hint-label"><i class="ph ph-hand-tap"></i> Untie the ribbon & open box</span>
            </div>
          </div>
        </div>
      `;
    }
    // 2. ROYAL PALACE HAVELI ARCH GATES (Pointed Jharokha arch with brass studs & ring latch)
    else if (boxType === "palace-haveli-gate") {
      boxMarkup = `
        <div class="box-3d-wrapper" id="box3DWrapper">
          <div class="box-3d-container box-type-haveli" id="box3DContainer">
            <div class="box-ambient-shadow"></div>
            
            <!-- Carved Haveli Arch Outer Frame -->
            <div class="haveli-arch-frame" style="border-color: ${t.accentColor};">
              <div class="haveli-dome-crest" style="border-color: ${t.accentColor}; background: ${t.primaryColor};">
                <i class="ph ph-crown-simple" style="color: ${t.accentColor};"></i>
              </div>
            </div>

            <!-- Left Arched Gate Door -->
            <div class="box-door box-door-left haveli-door" id="boxDoorLeft" style="background: linear-gradient(135deg, ${t.boxColor || t.primaryColor}, #180306); border-color: ${t.accentColor};">
              <div class="haveli-jali-mesh"></div>
              <div class="brass-studs-grid">
                <span></span><span></span><span></span><span></span>
              </div>
            </div>

            <!-- Right Arched Gate Door -->
            <div class="box-door box-door-right haveli-door" id="boxDoorRight" style="background: linear-gradient(135deg, #180306, ${t.boxColor || t.primaryColor}); border-color: ${t.accentColor};">
              <div class="haveli-jali-mesh"></div>
              <div class="brass-studs-grid">
                <span></span><span></span><span></span><span></span>
              </div>
            </div>

            <!-- Antique Brass Door Latch Ring -->
            <div class="haveli-latch-wrap" id="boxCenterKnot">
              <div class="brass-ring-handle" style="border-color: ${t.accentColor}; color: ${t.accentColor};">
                <i class="ph ph-door-open"></i>
                <small>${t.sealText || 'प्रवेश'}</small>
              </div>
            </div>

            <div class="box-open-hint" id="boxOpenHint">
              <span class="hint-pulse"></span>
              <span class="hint-label"><i class="ph ph-sparkle"></i> Push open royal haveli gates</span>
            </div>
          </div>
        </div>
      `;
    }
    // 3. SACRED TEMPLE SANCTORUM (Gopuram pillars & ringing brass bells)
    else if (boxType === "temple-sanctorum") {
      boxMarkup = `
        <div class="box-3d-wrapper" id="box3DWrapper">
          <div class="box-3d-container box-type-temple" id="box3DContainer">
            <div class="box-ambient-shadow"></div>

            <div class="temple-gopuram-crest" style="background: ${t.accentColor}; color: ${t.primaryColor};">
              <span>ॐ शुभ विवाह ॐ</span>
            </div>

            <!-- Hanging Temple Bells -->
            <div class="temple-bells-row">
              <div class="temple-bell bell-1" style="color: ${t.accentColor};"><i class="ph ph-bell"></i></div>
              <div class="temple-bell bell-2" style="color: ${t.accentColor};"><i class="ph ph-bell"></i></div>
              <div class="temple-bell bell-3" style="color: ${t.accentColor};"><i class="ph ph-bell"></i></div>
            </div>

            <div class="box-door box-door-left temple-door" id="boxDoorLeft" style="background: linear-gradient(135deg, ${t.primaryColor}, #3b050d); border-color: ${t.accentColor};">
              <div class="temple-carving-panel"></div>
            </div>

            <div class="box-door box-door-right temple-door" id="boxDoorRight" style="background: linear-gradient(135deg, #3b050d, ${t.primaryColor}); border-color: ${t.accentColor};">
              <div class="temple-carving-panel"></div>
            </div>

            <div class="temple-center-kumbha" id="boxCenterKnot" style="background: radial-gradient(circle, ${t.accentColor}, #b45309); color: #fff;">
              <i class="ph ph-flower-lotus"></i>
            </div>

            <div class="box-open-hint" id="boxOpenHint">
              <span class="hint-pulse"></span>
              <span class="hint-label"><i class="ph ph-bell-simple-ringing"></i> Ring bells to enter sanctorum</span>
            </div>
          </div>
        </div>
      `;
    }
    // 4. ROYAL ANTIQUE PARCHMENT SCROLL (Unrolls vertically in 3D)
    else if (boxType === "royal-scroll") {
      boxMarkup = `
        <div class="box-3d-wrapper" id="box3DWrapper">
          <div class="box-3d-container box-type-scroll" id="box3DContainer">
            <div class="box-ambient-shadow"></div>

            <!-- Top Gold Finial Rod -->
            <div class="scroll-rod rod-top" style="background: linear-gradient(90deg, #b45309, ${t.accentColor}, #b45309);">
              <span class="rod-finial-l"></span>
              <span class="rod-finial-r"></span>
            </div>

            <!-- Rolled Scroll Cylinder -->
            <div class="scroll-cylinder-body" id="boxDoorLeft" style="background: linear-gradient(180deg, #fef3c7, #fde68a, #d97706); border-color: ${t.accentColor};">
              <div class="scroll-gold-embroidery">
                <span>📜 शाही फ़रमान 📜</span>
              </div>
            </div>

            <!-- Bottom Gold Finial Rod -->
            <div class="scroll-rod rod-bottom" id="boxDoorRight" style="background: linear-gradient(90deg, #b45309, ${t.accentColor}, #b45309);">
              <span class="rod-finial-l"></span>
              <span class="rod-finial-r"></span>
              <div class="scroll-tassel" style="background: ${t.primaryColor};"></div>
            </div>

            <div class="scroll-center-seal" id="boxCenterKnot" style="background: ${t.primaryColor}; border-color: ${t.accentColor}; color: ${t.accentColor};">
              <i class="ph ph-feather"></i>
            </div>

            <div class="box-open-hint" id="boxOpenHint">
              <span class="hint-pulse"></span>
              <span class="hint-label"><i class="ph ph-scroll"></i> Untie tassel to unroll scroll</span>
            </div>
          </div>
        </div>
      `;
    }
    // 5. DOMED ANTIQUE TREASURE CHEST (Opens upwards on 3D X-axis)
    else if (boxType === "treasure-chest") {
      boxMarkup = `
        <div class="box-3d-wrapper" id="box3DWrapper">
          <div class="box-3d-container box-type-chest" id="box3DContainer">
            <div class="box-ambient-shadow"></div>

            <!-- 3D Curved Domed Chest Lid -->
            <div class="chest-domed-lid" id="boxDoorLeft" style="background: linear-gradient(180deg, ${t.accentColor}, ${t.boxColor || t.primaryColor}); border-color: ${t.accentColor};">
              <div class="chest-strap-iron iron-1"></div>
              <div class="chest-strap-iron iron-2"></div>
              <div class="chest-strap-iron iron-3"></div>
            </div>

            <!-- Chest Sturdy Base -->
            <div class="chest-sturdy-base" style="background: ${t.boxColor || t.primaryColor}; border-color: ${t.accentColor};">
              <div class="chest-interior-glow" id="chestGlow"></div>
            </div>

            <!-- Antique Brass Padlock Clasp -->
            <div class="chest-lock-hasp" id="boxCenterKnot" style="background: radial-gradient(circle, ${t.accentColor}, #78350f); color: #fff;">
              <i class="ph ph-lock-key-open"></i>
            </div>

            <div class="box-open-hint" id="boxOpenHint">
              <span class="hint-pulse"></span>
              <span class="hint-label"><i class="ph ph-key"></i> Unlock royal treasure chest</span>
            </div>
          </div>
        </div>
      `;
    }
    // 6. KYOTO SHOJI SCREEN SLIDING DOORS (Slides left & right)
    else if (boxType === "shoji-screen-box") {
      boxMarkup = `
        <div class="box-3d-wrapper" id="box3DWrapper">
          <div class="box-3d-container box-type-shoji" id="box3DContainer">
            <div class="box-ambient-shadow"></div>

            <div class="shoji-timber-frame" style="border-color: #522512;">
              <!-- Left Shoji Sliding Door -->
              <div class="box-door box-door-left shoji-door" id="boxDoorLeft" style="background: #fffbf0;">
                <div class="shoji-grid-lines"></div>
                <div class="shoji-cherry-branch">🌸</div>
              </div>

              <!-- Right Shoji Sliding Door -->
              <div class="box-door box-door-right shoji-door" id="boxDoorRight" style="background: #fffbf0;">
                <div class="shoji-grid-lines"></div>
                <div class="shoji-cherry-branch">🌸</div>
              </div>
            </div>

            <div class="shoji-center-pull" id="boxCenterKnot" style="background: #8b2500; color: #fde68a;">
              <span>寿</span>
            </div>

            <div class="box-open-hint" id="boxOpenHint">
              <span class="hint-pulse"></span>
              <span class="hint-label"><i class="ph ph-arrows-out-line-horizontal"></i> Slide open shoji screens</span>
            </div>
          </div>
        </div>
      `;
    }
    // 7. FROSTED GLASS & ACRYLIC CASE
    else if (boxType === "frosted-acrylic-case") {
      boxMarkup = `
        <div class="box-3d-wrapper" id="box3DWrapper">
          <div class="box-3d-container box-type-acrylic" id="box3DContainer">
            <div class="box-ambient-shadow"></div>

            <div class="acrylic-glass-slab" id="boxDoorLeft" style="border-color: ${t.accentColor}; box-shadow: 0 0 35px ${t.accentColor}44;">
              <div class="acrylic-refraction-shine"></div>
              <div class="acrylic-monogram-etch" style="color: ${t.accentColor};">
                <i class="ph ph-diamond"></i>
                <span>${t.sealText || 'ROYAL'}</span>
              </div>
            </div>

            <div class="acrylic-neon-edge" style="background: linear-gradient(90deg, transparent, ${t.accentColor}, transparent);"></div>

            <div class="acrylic-magnetic-clasp" id="boxCenterKnot" style="background: ${t.accentColor}; color: #000;">
              <i class="ph ph-fingerprint"></i>
            </div>

            <div class="box-open-hint" id="boxOpenHint">
              <span class="hint-pulse"></span>
              <span class="hint-label"><i class="ph ph-hand-tap"></i> Tap to lift crystal cover</span>
            </div>
          </div>
        </div>
      `;
    }
    // 8. VINTAGE WAX-SEALED ENVELOPE (Triangular flap swings open)
    else {
      boxMarkup = `
        <div class="box-3d-wrapper" id="box3DWrapper">
          <div class="box-3d-container box-type-envelope" id="box3DContainer">
            <div class="box-ambient-shadow"></div>

            <div class="envelope-back" style="background-color: ${t.boxColor || t.primaryColor};"></div>
            
            <!-- Triangular Top Flap -->
            <div class="envelope-flap-triangular" id="boxDoorLeft" style="border-top-color: ${t.boxColor || t.primaryColor};"></div>
            
            <div class="envelope-bottom-pocket" style="background-color: ${t.primaryColor}; border-top-color: ${t.accentColor};"></div>

            <!-- Authentic 3D Wax Seal Monogram -->
            <div class="wax-seal-center-stamp" id="boxCenterKnot" style="background: radial-gradient(circle at 35% 35%, #ff4d6d, ${t.boxColor || '#850014'}, #330005);">
              <div class="wax-crest-rim"></div>
              <span class="wax-seal-icon">${this.getSealSvg(t.sealIcon)}</span>
              <small class="wax-seal-monogram">${t.sealText || 'M & V'}</small>
            </div>

            <div class="box-open-hint" id="boxOpenHint">
              <span class="hint-pulse"></span>
              <span class="hint-label"><i class="ph ph-envelope-open"></i> Break wax seal to open invite</span>
            </div>
          </div>
        </div>
      `;
    }

    this.container.innerHTML = boxMarkup;
    this.bindEvents();
  }

  bindEvents() {
    const boxContainer = document.getElementById("box3DContainer");
    const knot = document.getElementById("boxCenterKnot");
    const hint = document.getElementById("boxOpenHint");

    const triggerOpen = (e) => {
      e.stopPropagation();
      this.openBox();
    };

    if (boxContainer) {
      boxContainer.addEventListener("click", triggerOpen);
      boxContainer.addEventListener("touchstart", triggerOpen, { passive: true });
    }
    if (knot) knot.addEventListener("click", triggerOpen);
    if (hint) hint.addEventListener("click", triggerOpen);
  }

  openBox() {
    if (this.isOpen) return;
    this.isOpen = true;

    const t = this.activeTemplate;
    const boxType = t.boxType || "velvet-ribbon-box";
    const wrapper = document.getElementById("box3DWrapper");
    const boxContainer = document.getElementById("box3DContainer");
    const knot = document.getElementById("boxCenterKnot");
    const ribbonV = document.getElementById("ribbonVerticalWrap");
    const hint = document.getElementById("boxOpenHint");
    const doorL = document.getElementById("boxDoorLeft");
    const doorR = document.getElementById("boxDoorRight");
    const cardContent = document.getElementById("invitationCardMain");

    // 1. Play chime / bell sound & background music
    if (this.audioEngine) {
      this.audioEngine.playChime();
      this.audioEngine.startBackgroundMusic();
    }

    // 2. Animate central seal/knot/clasp
    if (knot) knot.classList.add("knot-untied");
    if (ribbonV) ribbonV.classList.add("ribbon-dispersed");
    if (hint) {
      hint.style.opacity = "0";
      hint.style.pointerEvents = "none";
    }

    // 3. Trigger 3D Mechanics based on Box Type
    setTimeout(() => {
      if (boxType === "treasure-chest") {
        if (doorL) doorL.classList.add("chest-lid-open");
      } else if (boxType === "royal-scroll") {
        if (doorL) doorL.classList.add("scroll-unrolled");
        if (doorR) doorR.classList.add("scroll-rod-dropped");
      } else if (boxType === "shoji-screen-box") {
        if (doorL) doorL.classList.add("shoji-slide-left");
        if (doorR) doorR.classList.add("shoji-slide-right");
      } else if (boxType === "frosted-acrylic-case") {
        if (doorL) doorL.classList.add("acrylic-lid-slid");
      } else if (boxType === "vintage-wax-envelope") {
        if (doorL) doorL.classList.add("envelope-flap-flipped");
      } else {
        // Double door gates & velvet box
        if (doorL) doorL.classList.add("door-opened-left");
        if (doorR) doorR.classList.add("door-opened-right");
      }

      if (boxContainer) boxContainer.classList.add("box-opened");

      // 4. Trigger atmospheric particles (rose petals, marigolds, stardust)
      this.startParticles(t.particles || "rose-petals");

      // 5. Reveal main invitation card smoothly
      if (cardContent) {
        cardContent.classList.remove("card-concealed");
        cardContent.classList.add("card-revealed");
      }

      // Smoothly hide 3D box layer after animation completes
      setTimeout(() => {
        if (wrapper) wrapper.classList.add("box-faded-away");
        window.dispatchEvent(new CustomEvent("cardUnboxed", { detail: { template: t } }));
      }, 1250);
    }, 400);
  }

  resetBox() {
    this.isOpen = false;
    this.stopParticles();
    const cardContent = document.getElementById("invitationCardMain");
    if (cardContent) {
      cardContent.classList.add("card-concealed");
      cardContent.classList.remove("card-revealed");
    }
    this.renderBoxUI();
  }

  startParticles(type = "rose-petals") {
    this.stopParticles();
    const particleStage = document.getElementById("particleStage");
    if (!particleStage) return;

    for (let i = 0; i < 24; i++) {
      this.spawnSingleParticle(particleStage, type);
    }

    this.particleInterval = setInterval(() => {
      this.spawnSingleParticle(particleStage, type);
    }, 280);
  }

  stopParticles() {
    if (this.particleInterval) {
      clearInterval(this.particleInterval);
      this.particleInterval = null;
    }
    const particleStage = document.getElementById("particleStage");
    if (particleStage) {
      particleStage.innerHTML = "";
    }
  }

  spawnSingleParticle(stage, type) {
    if (!stage) return;
    const p = document.createElement("div");
    p.className = `particle-item particle-${type}`;

    const startX = Math.random() * 100;
    const duration = 4 + Math.random() * 3.5;
    const size = 18 + Math.random() * 18;
    const sway = (Math.random() - 0.5) * 80;

    p.style.left = `${startX}%`;
    p.style.width = `${size}px`;
    p.style.height = `${size}px`;
    p.style.animationDuration = `${duration}s`;
    p.style.setProperty("--sway-x", `${sway}px`);

    if (type === "rose-petals") {
      p.innerHTML = `<svg viewBox="0 0 40 40" width="100%" height="100%">
        <path d="M20 3 C28 3, 37 12, 35 23 C33 32, 23 37, 20 37 C17 37, 7 32, 5 23 C3 12, 12 3, 20 3 Z" fill="url(#rosePetalGrad)" />
        <defs>
          <radialGradient id="rosePetalGrad" cx="35%" cy="30%" r="70%">
            <stop offset="0%" stop-color="#ff3366" />
            <stop offset="60%" stop-color="#b80c2e" />
            <stop offset="100%" stop-color="#4d0010" />
          </radialGradient>
        </defs>
      </svg>`;
    } else if (type === "marigold-flowers") {
      p.innerHTML = `<svg viewBox="0 0 32 32" width="100%" height="100%">
        <circle cx="16" cy="16" r="14" fill="#F59E0B" />
        <circle cx="16" cy="16" r="10" fill="#EA580C" />
        <circle cx="16" cy="16" r="5" fill="#FBBF24" />
      </svg>`;
    } else if (type === "sakura-petals") {
      p.innerHTML = `<svg viewBox="0 0 32 32" width="100%" height="100%">
        <path d="M16 2 C22 2, 28 8, 27 18 C26 26, 18 30, 16 30 C14 30, 6 26, 5 18 C4 8, 10 2, 16 2 Z" fill="#FBCFE8" stroke="#F472B6" stroke-width="0.5"/>
      </svg>`;
    } else {
      p.innerHTML = `<svg viewBox="0 0 24 24" width="100%" height="100%">
        <polygon points="12,0 15,9 24,12 15,15 12,24 9,15 0,12 9,9" fill="${this.activeTemplate.accentColor || '#FFD700'}" />
      </svg>`;
    }

    stage.appendChild(p);
    setTimeout(() => p.remove(), duration * 1000);
  }

  getSealSvg(iconName) {
    switch (iconName) {
      case "mandap":
        return `<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L3 8V10H21V8L12 2M5 11V20H8V11H5M10 11V20H14V11H10M16 11V20H19V11H16M3 21V23H21V21H3Z"/></svg>`;
      case "crown":
        return `<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M5 16L3 5L8.5 10L12 4L15.5 10L21 5L19 16H5M19 19C19 19.6 18.6 20 18 20H6C5.4 20 5 19.6 5 19V17H19V19Z"/></svg>`;
      case "ring":
        return `<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="7" r="5" stroke="currentColor" stroke-width="2" fill="none"/><path d="M12 2L14 5L10 5Z"/><circle cx="12" cy="16" r="6" stroke="currentColor" stroke-width="2" fill="none"/></svg>`;
      case "rose":
      case "flower":
        return `<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="2" fill="none"/><circle cx="12" cy="12" r="4"/></svg>`;
      default:
        return `<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><polygon points="12,2 15,9 23,12 15,15 12,22 9,15 1,12 9,9"/></svg>`;
    }
  }
}

window.BoxAnimationEngine = BoxAnimationEngine;
