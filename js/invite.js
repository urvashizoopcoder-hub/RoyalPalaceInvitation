/**
 * Standalone Luxury Wedding Invitation Page Controller
 * Handles dedicated full-screen invitation experience for all 60 templates
 */

class StandaloneInviteApp {
  constructor() {
    this.data = this.loadWeddingData();
    this.activeTemplate = this.resolveActiveTemplate();

    // Engines
    this.audioEngine = new LuxuryAudioEngine();
    this.boxEngine = new BoxAnimationEngine();
    this.autoScroll = new LuxuryAutoScroll();

    // Scratch instances
    this.dateScratch = null;
    this.photoScratch = null;

    this.init();
  }

  loadWeddingData() {
    try {
      const stored = localStorage.getItem("royal_wedding_data");
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn("Could not read stored wedding data, using defaults", e);
    }

    const groomSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="400" viewBox="0 0 300 400"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="%231e293b"/><stop offset="1" stop-color="%230f172a"/></linearGradient></defs><rect width="300" height="400" fill="url(%23g)"/><circle cx="150" cy="130" r="60" fill="%23d4af37"/><path d="M70,350 C70,220 230,220 230,350 Z" fill="%23b45309"/><polygon points="150,70 170,120 130,120" fill="%23dc2626"/><text x="150" y="380" font-family="serif" font-size="20" fill="%23fde047" text-anchor="middle">THE ROYAL GROOM</text></svg>`;
    const brideSvg = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="400" viewBox="0 0 300 400"><defs><linearGradient id="b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="%234a0410"/><stop offset="1" stop-color="%232b0209"/></linearGradient></defs><rect width="300" height="400" fill="url(%23b)"/><circle cx="150" cy="130" r="60" fill="%23f9a8d4"/><path d="M70,350 C70,210 230,210 230,350 Z" fill="%23991b1b"/><circle cx="150" cy="90" r="10" fill="%23ffd700"/><text x="150" y="380" font-family="serif" font-size="20" fill="%23ffd700" text-anchor="middle">THE ROYAL BRIDE</text></svg>`;

    return {
      templateId: "cartier-red-velvet-box",
      groomName: "Ranveer Singh",
      groomTitle: "Groom",
      groomParents: "Smt. Sunita & Shri Harshvardhan Singh",
      brideName: "Deepika Padukone",
      brideTitle: "Bride",
      brideParents: "Smt. Ujjwala & Shri Prakash Padukone",
      weddingDate: "2026-12-18",
      weddingTime: "07:30 PM",
      muhurat: "Auspicious Godhuli Bela (07:30 PM)",
      weddingCity: "Udaipur, Rajasthan",
      venueName: "The Oberoi Udaivilas Palace",
      venueAddress: "Badi-Gorela-Mulla Talai Rd, Haridas Ji Ki Magri, Udaipur, Rajasthan 313001",
      mapUrl: "https://maps.google.com/?q=The+Oberoi+Udaivilas+Udaipur",
      shloka: "|| मङ्गलम् भगवान विष्णुः, मङ्गलम् गरुडध्वजः ||\n|| मङ्गलम् पुण्डरीकाक्षः, मङ्गलाय तनो हरिः ||",
      welcomingText: "cordially invite you to celebrate the holy union of their beloved children",
      hashtag: "#DeepVeerVivaah",
      rsvpPhone: "+91 98765 43210",
      rsvpEmail: "royal.rsvp@udaivilasweddings.com",
      events: [
        { 
          title: "Ganesh Sthapana & Haldi", 
          date: "Dec 16, 2026", 
          time: "10:30 AM", 
          venue: "Mewar Courtyard, Oberoi Udaivilas", 
          attire: "Royal Saffron & Bright Yellows",
          desc: "Auspicious turmeric blessings, traditional mangal geet, and celebratory dhol beats." 
        },
        { 
          title: "Mehendi & Sangeet Gala", 
          date: "Dec 17, 2026", 
          time: "06:30 PM", 
          venue: "Lakeside Promenade, Oberoi Udaivilas", 
          attire: "Festive Glamour & Designer Lehengas",
          desc: "Intricate henna artistry followed by a starlit night of choreographed royal musical performances and dinner." 
        },
        { 
          title: "Sacred Pheras & Matrimony", 
          date: "Dec 18, 2026", 
          time: "07:00 PM", 
          venue: "The Grand Mandap, Oberoi Udaivilas", 
          attire: "Gold Zardozi, Sherwanis & Pure Silk",
          desc: "Grand royal elephant procession followed by seven sacred Vedic vows around the holy agni." 
        },
        { 
          title: "Royal Governors Reception", 
          date: "Dec 19, 2026", 
          time: "08:00 PM", 
          venue: "Chandra Mahal Grand Ballroom", 
          attire: "Ultra-Formal Black Tie & Royal Velvets",
          desc: "Grand imperial feast and celebratory toasts with the newlyweds." 
        }
      ],
      groomPhoto: groomSvg,
      bridePhoto: brideSvg
    };
  }

  resolveActiveTemplate() {
    const urlParams = new URLSearchParams(window.location.search);
    const paramId = urlParams.get("template");
    const targetId = paramId || this.data.templateId || "cartier-red-velvet-box";
    return getTemplateById(targetId);
  }

  init() {
    this.applyThemeStyles();
    this.renderCardContent();
    this.bindHeaderActions();

    // Setup Auto-scroll to target window scroll
    this.autoScroll.setTarget(window);
    this.autoScroll.onStateChange = (state) => {
      const scrollLabel = document.getElementById("inviteScrollLabel");
      if (scrollLabel) {
        scrollLabel.textContent = state.isRunning ? "Pause Scroll" : "Auto Scroll";
      }
    };

    // Initialize 3D Box Unboxing
    const boxContainer = document.getElementById("boxMountPoint");
    this.boxEngine.init(boxContainer, this.activeTemplate, this.audioEngine);

    // Initialize Scratch Surfaces
    this.initScratchSurfaces();

    // Listen for Card Unboxing to refresh scratch surfaces with accurate dimensions
    window.addEventListener("cardUnboxed", () => {
      setTimeout(() => {
        if (this.dateScratch) this.dateScratch.refresh();
        if (this.photoScratch) this.photoScratch.refresh();
      }, 100);
    });
  }

  applyThemeStyles() {
    const t = this.activeTemplate;
    const root = document.documentElement;

    root.style.setProperty("--tpl-primary", t.primaryColor);
    root.style.setProperty("--tpl-secondary", t.secondaryColor);
    root.style.setProperty("--tpl-accent", t.accentColor);
    root.style.setProperty("--tpl-surface", t.surfaceColor);
    root.style.setProperty("--tpl-text", t.textColor);
    root.style.setProperty("--tpl-box", t.boxColor || t.primaryColor);
    root.style.setProperty("--tpl-ribbon", t.ribbonColor);

    // Dynamic Ceremony Palette per Template
    let ceremonyTitle = t.accentColor || '#D4AF37';
    let ceremonyBadge = '#F59E0B';
    let ceremonyBtnBg = t.accentColor || '#D4AF37';
    let ceremonyBtnText = '#1A0206';
    let ceremonyCardBg = 'rgba(255, 252, 245, 0.96)';
    let ceremonyBorder = t.accentColor || '#D4AF37';
    let ceremonyMeta = t.textColor || '#2A1810';

    if (t.category === 'heritage') {
      ceremonyTitle = t.accentColor || '#D4AF37';
      ceremonyBadge = '#F59E0B';
      ceremonyBtnBg = '#F59E0B';
      ceremonyBtnText = '#1A0206';
      ceremonyCardBg = 'rgba(40, 6, 14, 0.92)';
      ceremonyMeta = '#FDF8F0';
    } else if (t.category === 'velvet-luxury') {
      ceremonyTitle = t.ribbonColor || '#E6C280';
      ceremonyBadge = '#E6C280';
      ceremonyBtnBg = '#E6C280';
      ceremonyBtnText = '#1A0206';
      ceremonyCardBg = 'rgba(48, 5, 14, 0.92)';
      ceremonyMeta = '#FDF8F0';
    } else if (t.category === 'botanical') {
      ceremonyTitle = '#34D399';
      ceremonyBadge = '#F472B6';
      ceremonyBtnBg = '#F472B6';
      ceremonyBtnText = '#062B1B';
      ceremonyCardBg = 'rgba(4, 38, 24, 0.92)';
      ceremonyMeta = '#ECFDF5';
    } else if (t.category === 'celestial') {
      ceremonyTitle = '#FDE047';
      ceremonyBadge = '#38BDF8';
      ceremonyBtnBg = '#FDE047';
      ceremonyBtnText = '#0B0F19';
      ceremonyCardBg = 'rgba(15, 23, 42, 0.94)';
      ceremonyMeta = '#E2E8F0';
    } else if (t.category === 'modern-minimal') {
      ceremonyTitle = '#111827';
      ceremonyBadge = '#D97706';
      ceremonyBtnBg = '#111827';
      ceremonyBtnText = '#FDE047';
      ceremonyCardBg = 'rgba(255, 255, 255, 0.98)';
      ceremonyBorder = 'rgba(212, 175, 55, 0.6)';
      ceremonyMeta = '#1F2937';
    } else if (t.category === 'regional-traditions') {
      ceremonyTitle = '#FB923C';
      ceremonyBadge = '#FBBF24';
      ceremonyBtnBg = '#F59E0B';
      ceremonyBtnText = '#1A0508';
      ceremonyCardBg = 'rgba(38, 16, 5, 0.92)';
      ceremonyMeta = '#FEF3C7';
    }

    // Bespoke highlights
    if (t.id.includes('sacred-mandap') || t.id.includes('bloom')) {
      ceremonyTitle = '#BE123C';
      ceremonyBadge = '#F59E0B';
      ceremonyBtnBg = '#BE123C';
      ceremonyBtnText = '#FFFFFF';
      ceremonyCardBg = 'rgba(255, 253, 247, 0.96)';
      ceremonyBorder = '#D4AF37';
      ceremonyMeta = '#1F040A';
    } else if (t.id.includes('emerald') || t.id.includes('mughal')) {
      ceremonyTitle = '#10B981';
      ceremonyBadge = '#FDE047';
      ceremonyBtnBg = '#FDE047';
      ceremonyBtnText = '#064E3B';
      ceremonyCardBg = 'rgba(3, 48, 30, 0.92)';
      ceremonyMeta = '#D1FAE5';
    } else if (t.id.includes('lake-palace') || t.id.includes('sapphire')) {
      ceremonyTitle = '#38BDF8';
      ceremonyBadge = '#FACC15';
      ceremonyBtnBg = '#FACC15';
      ceremonyBtnText = '#082F49';
      ceremonyCardBg = 'rgba(10, 32, 60, 0.92)';
      ceremonyMeta = '#E0F2FE';
    }

    root.style.setProperty("--tpl-ceremony-title", ceremonyTitle);
    root.style.setProperty("--tpl-ceremony-badge", ceremonyBadge);
    root.style.setProperty("--tpl-ceremony-card-bg", ceremonyCardBg);
    root.style.setProperty("--tpl-ceremony-border", ceremonyBorder);
    root.style.setProperty("--tpl-ceremony-btn-bg", ceremonyBtnBg);
    root.style.setProperty("--tpl-ceremony-btn-text", ceremonyBtnText);
    root.style.setProperty("--tpl-ceremony-meta", ceremonyMeta);

    // Dynamic Calendar & 3D Hearts Palette ("colour matches from rest of the pages")
    let envBg = `linear-gradient(135deg, ${t.secondaryColor || t.primaryColor}F0, ${t.primaryColor}E8)`;
    let envBorder = t.accentColor || '#D4AF37';
    let envText = '#FFFFFF';
    let calCardBg = 'rgba(255, 253, 248, 0.98)';
    let calTitle = t.primaryColor || '#6B0F24';
    let heartFrom = '#FF758C';
    let heartMid = '#E11D48';
    let heartTo = '#881337';
    let heartShadow = 'rgba(136, 19, 55, 0.45)';

    if (t.category === 'heritage') {
      envBg = 'linear-gradient(135deg, #7C2D12 0%, #431407 100%)';
      heartFrom = '#F97316';
      heartMid = '#EA580C';
      heartTo = '#9A3412';
      heartShadow = 'rgba(154, 52, 18, 0.5)';
      calTitle = '#7C2D12';
    } else if (t.category === 'velvet-luxury') {
      envBg = 'linear-gradient(135deg, #6B0F24 0%, #3B0410 100%)';
      heartFrom = '#FF4D6D';
      heartMid = '#E11D48';
      heartTo = '#881337';
      heartShadow = 'rgba(136, 19, 55, 0.55)';
      calTitle = '#6B0F24';
    } else if (t.category === 'botanical') {
      envBg = 'linear-gradient(135deg, #064E3B 0%, #022C22 100%)';
      heartFrom = '#34D399';
      heartMid = '#10B981';
      heartTo = '#064E3B';
      heartShadow = 'rgba(6, 78, 59, 0.5)';
      calTitle = '#064E3B';
    } else if (t.category === 'celestial') {
      envBg = 'linear-gradient(135deg, #0F172A 0%, #020617 100%)';
      heartFrom = '#60A5FA';
      heartMid = '#2563EB';
      heartTo = '#1E3A8A';
      heartShadow = 'rgba(30, 58, 138, 0.5)';
      calTitle = '#1E3A8A';
    } else if (t.category === 'modern-minimal') {
      envBg = 'linear-gradient(135deg, #27272A 0%, #18181B 100%)';
      heartFrom = '#FBBF24';
      heartMid = '#D97706';
      heartTo = '#78350F';
      heartShadow = 'rgba(120, 53, 15, 0.45)';
      calTitle = '#18181B';
    } else if (t.category === 'regional-traditions') {
      envBg = 'linear-gradient(135deg, #7C2D12 0%, #451A03 100%)';
      heartFrom = '#FB923C';
      heartMid = '#EA580C';
      heartTo = '#7C2D12';
      heartShadow = 'rgba(124, 45, 18, 0.5)';
      calTitle = '#7C2D12';
    }

    if (t.id.includes('emerald') || t.id.includes('mughal') || t.id.includes('forest')) {
      envBg = 'linear-gradient(135deg, #064E3B 0%, #022C22 100%)';
      heartFrom = '#34D399';
      heartMid = '#10B981';
      heartTo = '#064E3B';
      heartShadow = 'rgba(6, 78, 59, 0.5)';
      calTitle = '#064E3B';
    } else if (t.id.includes('lake-palace') || t.id.includes('blue') || t.id.includes('sapphire') || t.id.includes('jodhpur')) {
      envBg = 'linear-gradient(135deg, #0C4A6E 0%, #082F49 100%)';
      heartFrom = '#38BDF8';
      heartMid = '#0284C7';
      heartTo = '#075985';
      heartShadow = 'rgba(7, 89, 133, 0.5)';
      calTitle = '#075985';
    } else if (t.id.includes('sacred-mandap') || t.id.includes('bloom') || t.id === 'sacred-mandap-bloom') {
      envBg = 'linear-gradient(135deg, #FCE7F3 0%, #F472B6 100%)';
      envText = '#881337';
      heartFrom = '#F472B6';
      heartMid = '#E11D48';
      heartTo = '#9F1239';
      heartShadow = 'rgba(159, 18, 57, 0.45)';
      calTitle = '#9F1239';
    } else if (t.id.includes('jaipur') || t.id.includes('hawa') || t.id.includes('sunset') || t.id.includes('coral')) {
      envBg = 'linear-gradient(135deg, #BE123C 0%, #881337 100%)';
      heartFrom = '#FB7185';
      heartMid = '#E11D48';
      heartTo = '#881337';
      heartShadow = 'rgba(136, 19, 55, 0.5)';
      calTitle = '#881337';
    } else if (t.id.includes('onyx') || t.id.includes('obsidian') || t.id.includes('vault')) {
      envBg = 'linear-gradient(135deg, #18181B 0%, #09090B 100%)';
      heartFrom = '#FACC15';
      heartMid = '#D97706';
      heartTo = '#78350F';
      heartShadow = 'rgba(120, 53, 15, 0.6)';
      calTitle = '#FACC15';
    }

    root.style.setProperty("--tpl-envelope-bg", envBg);
    root.style.setProperty("--tpl-envelope-border", envBorder);
    root.style.setProperty("--tpl-envelope-text", envText);
    root.style.setProperty("--tpl-cal-card-bg", calCardBg);
    root.style.setProperty("--tpl-cal-title", calTitle);
    root.style.setProperty("--tpl-heart-from", heartFrom);
    root.style.setProperty("--tpl-heart-mid", heartMid);
    root.style.setProperty("--tpl-heart-to", heartTo);
    root.style.setProperty("--tpl-heart-shadow", heartShadow);

    const viewport = document.getElementById("inviteViewport");
    if (viewport) {
      viewport.setAttribute("data-template", t.id);
      viewport.className = `invite-card-viewport phone-screen-viewport tpl-${t.category}`;
    }

    // Set Audio Preset
    this.audioEngine.setPreset(t.musicPreset);

    // Set Artwork
    const heroImg = document.getElementById("invThemeHeroImg");
    if (heroImg) {
      heroImg.src = t.themeImage || `assets/images/themes/${t.id}.svg`;
    }

    document.title = `${this.data.groomName} & ${this.data.brideName} — ${t.name}`;
  }

  renderCardContent() {
    const d = this.data;
    const t = this.activeTemplate;

    const setText = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val;
    };

    setText("invGroomName", d.groomName);
    setText("invBrideName", d.brideName);
    setText("invHashtag", d.hashtag);
    setText("invVenueName", d.venueName);
    setText("invVenueAddress", d.venueAddress);

    const shlokaEl = document.getElementById("invShloka");
    if (shlokaEl) shlokaEl.textContent = d.shloka;

    const welcomingEl = document.getElementById("invWelcoming");
    if (welcomingEl) welcomingEl.innerHTML = `${d.groomParents} and ${d.brideParents}<br><small>${d.welcomingText}</small>`;

    const mapLink = document.getElementById("invMapLink");
    if (mapLink) mapLink.href = d.mapUrl || `https://maps.google.com/?q=${encodeURIComponent(d.venueName + " " + d.venueAddress)}`;

    // Set Groom & Bride Photos
    const groomImg = document.getElementById("invGroomImg");
    const brideImg = document.getElementById("invBrideImg");
    if (groomImg) groomImg.src = d.groomPhoto;
    if (brideImg) brideImg.src = d.bridePhoto;

    // Wedding Date & Monthly Calendar
    this.renderWeddingDate(d.weddingDate, d.muhurat);

    // Timeline Events
    this.renderTimeline(d.events);
  }

  renderWeddingDate(dateStr, muhuratStr) {
    if (!dateStr) return;
    try {
      const dateObj = new Date(dateStr + "T12:00:00");
      const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const monthNames = ["JANUARY", "FEBRUARY", "MARCH", "APRIL", "MAY", "JUNE", "JULY", "AUGUST", "SEPTEMBER", "OCTOBER", "NOVEMBER", "DECEMBER"];

      const dayNum = dateObj.getDate();
      const monthIndex = dateObj.getMonth();
      const monthName = monthNames[monthIndex];
      const yearNum = dateObj.getFullYear();

      // Update Envelope & Calendar Header
      const calDayEl = document.getElementById("calDayNum");
      const calMonthYearEl = document.getElementById("calMonthYear");
      const monogramEl = document.getElementById("envelopeMonogram");
      const muhuratEl = document.getElementById("invMuhuratTime");

      if (calDayEl) calDayEl.textContent = dayNum;
      if (calMonthYearEl) calMonthYearEl.textContent = `${monthName} ${yearNum}`;
      if (muhuratEl) muhuratEl.textContent = muhuratStr || "Auspicious Godhuli Bela (07:30 PM)";

      if (monogramEl) {
        const gInit = this.data.groomName ? this.data.groomName.trim().charAt(0) : "R";
        const bInit = this.data.brideName ? this.data.brideName.trim().charAt(0) : "D";
        monogramEl.textContent = `${gInit} & ${bInit}`;
      }

      // Generate Dynamic Calendar Grid
      this.generateCalendarGrid(yearNum, monthIndex, dayNum);

      // Bind Interactive Pocket Envelope Tap / Click to Open
      const pocketEnv = document.getElementById("luxuryPocketEnvelope");
      if (pocketEnv && !pocketEnv.dataset.bound) {
        pocketEnv.dataset.bound = "true";
        pocketEnv.addEventListener("click", () => {
          this.toggleDateEnvelope();
        });

        // Swipe / Touch gesture
        let touchStartY = 0;
        pocketEnv.addEventListener("touchstart", (e) => {
          touchStartY = e.touches[0].clientY;
        }, { passive: true });
        pocketEnv.addEventListener("touchend", (e) => {
          const touchEndY = e.changedTouches[0].clientY;
          if (Math.abs(touchEndY - touchStartY) > 20) {
            this.openDateEnvelope();
          }
        }, { passive: true });
      }

      // Start Countdown
      this.startCountdown(dateStr);
    } catch (e) {
      console.warn("Date parse error", e);
    }
  }

  generateCalendarGrid(year, monthIndex, targetDay) {
    const gridEl = document.getElementById("calDaysGrid");
    if (!gridEl) return;

    const firstDayIndex = new Date(year, monthIndex, 1).getDay();
    const totalDays = new Date(year, monthIndex + 1, 0).getDate();

    const eventDays = new Set();
    (this.data.events || []).forEach(ev => {
      const m = ev.date.match(/(\d{1,2})/);
      if (m) eventDays.add(parseInt(m[1], 10));
    });

    let cellsHTML = "";

    // Empty cells before day 1
    for (let i = 0; i < firstDayIndex; i++) {
      cellsHTML += `<div class="cal-day-cell cal-empty"></div>`;
    }

    // Days 1 through totalDays
    for (let d = 1; d <= totalDays; d++) {
      if (d === targetDay) {
        cellsHTML += `
          <div class="cal-day-cell cal-wedding-day" title="Auspicious Wedding Day!">
            <div class="cal-heart-badge">
              <svg class="heart-svg" viewBox="0 0 32 32">
                <defs>
                  <radialGradient id="calHeartGrad" cx="35%" cy="35%" r="65%">
                    <stop offset="0%" stop-color="var(--tpl-heart-from, #FF4D6D)"/>
                    <stop offset="60%" stop-color="var(--tpl-heart-mid, #E11D48)"/>
                    <stop offset="100%" stop-color="var(--tpl-heart-to, #9F1239)"/>
                  </radialGradient>
                </defs>
                <path d="M16 28 C16 28 3 19 3 10 C3 5 7 2 11.5 2 C14 2 15.5 3.5 16 4.5 C16.5 3.5 18 2 20.5 2 C25 2 29 5 29 10 C29 19 16 28 16 28 Z" fill="url(#calHeartGrad)"/>
              </svg>
              <span class="cal-day-number">${d}</span>
            </div>
          </div>
        `;
      } else if (eventDays.has(d)) {
        cellsHTML += `
          <div class="cal-day-cell cal-event-day" title="Ceremonial Function Day">
            <span class="cal-day-number">${d}</span>
            <span class="cal-event-dot"></span>
          </div>
        `;
      } else {
        cellsHTML += `
          <div class="cal-day-cell">
            <span class="cal-day-number">${d}</span>
          </div>
        `;
      }
    }

    gridEl.innerHTML = cellsHTML;
  }

  toggleDateEnvelope() {
    const pocketEnv = document.getElementById("luxuryPocketEnvelope");
    const stageEl = document.getElementById("envelopeInteractiveStage");
    const hintEl = document.getElementById("envelopeActionHint");
    if (!pocketEnv) return;

    pocketEnv.classList.toggle("is-opened");
    const isOpened = pocketEnv.classList.contains("is-opened");
    if (stageEl) {
      stageEl.classList.toggle("is-expanded", isOpened);
    }
    if (hintEl) {
      hintEl.textContent = isOpened ? "Mark your calendar ♥" : "Tap the envelope to open it.";
    }
    if (this.audioEngine) {
      this.audioEngine.playChime();
    }
  }

  openDateEnvelope() {
    const pocketEnv = document.getElementById("luxuryPocketEnvelope");
    const stageEl = document.getElementById("envelopeInteractiveStage");
    const hintEl = document.getElementById("envelopeActionHint");
    if (pocketEnv) pocketEnv.classList.add("is-opened");
    if (stageEl) stageEl.classList.add("is-expanded");
    if (hintEl) hintEl.textContent = "Mark your calendar ♥";
    if (this.audioEngine) this.audioEngine.playChime();
  }

  startCountdown(targetDateStr) {
    const target = new Date(targetDateStr + "T19:30:00").getTime();
    const daysEl = document.getElementById("cntDays");
    const hoursEl = document.getElementById("cntHours");
    const minsEl = document.getElementById("cntMins");
    const secsEl = document.getElementById("cntSecs");

    const refresh = () => {
      const now = new Date().getTime();
      const diff = Math.max(target - now, 0);

      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);

      if (daysEl) daysEl.textContent = String(d).padStart(2, "0");
      if (hoursEl) hoursEl.textContent = String(h).padStart(2, "0");
      if (minsEl) minsEl.textContent = String(m).padStart(2, "0");
      if (secsEl) secsEl.textContent = String(s).padStart(2, "0");
    };

    refresh();
    setInterval(refresh, 1000);
  }

  renderTimeline(events) {
    const timelineListEl = document.getElementById("invTimelineList");
    if (!timelineListEl) return;

    if (!events || events.length === 0) {
      events = this.data.events;
    }

    const domeArchitectureSVG = `
      <div class="ceremony-arch-dome">
        <svg class="ceremony-dome-svg" viewBox="0 0 360 90" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M180 8 C180 8 180 18 180 18 C180 18 183 19 183 23 C183 27 180 29 180 29 C195 29 215 42 215 62 L145 62 C145 42 165 29 180 29 Z" stroke="currentColor" stroke-width="2" fill="none"/>
          <path d="M180 2 L180 8 M178 5 L182 5" stroke="currentColor" stroke-width="2"/>
          <circle cx="180" cy="18" r="2.5" fill="currentColor"/>
          <path d="M165 62 L165 48 C165 40 195 40 195 48 L195 62" stroke="currentColor" stroke-width="1.5" fill="none"/>

          <path d="M90 22 C90 22 90 29 90 29 C90 29 92 30 92 33 C92 36 90 38 90 38 C102 38 118 48 118 62 L62 62 C62 48 78 38 90 38 Z" stroke="currentColor" stroke-width="1.8" fill="none"/>
          <path d="M90 16 L90 22 M88 19 L92 19" stroke="currentColor" stroke-width="1.8"/>
          <circle cx="90" cy="29" r="2" fill="currentColor"/>
          <path d="M78 62 L78 50 C78 44 102 44 102 50 L102 62" stroke="currentColor" stroke-width="1.5" fill="none"/>

          <path d="M270 22 C270 22 270 29 270 29 C270 29 272 30 272 33 C272 36 270 38 270 38 C282 38 298 48 298 62 L242 62 C242 48 258 38 270 38 Z" stroke="currentColor" stroke-width="1.8" fill="none"/>
          <path d="M270 16 L270 22 M268 19 L272 19" stroke="currentColor" stroke-width="1.8"/>
          <circle cx="270" cy="29" r="2" fill="currentColor"/>
          <path d="M258 62 L258 50 C258 44 282 44 282 50 L282 62" stroke="currentColor" stroke-width="1.5" fill="none"/>

          <rect x="30" y="62" width="300" height="7" rx="1.5" stroke="currentColor" stroke-width="1.8" fill="none"/>
          <rect x="38" y="69" width="284" height="15" rx="1" stroke="currentColor" stroke-width="1.5" fill="none"/>
          <line x1="42" y1="76" x2="318" y2="76" stroke="currentColor" stroke-width="1.5" stroke-dasharray="4 4"/>
        </svg>
      </div>
    `;

    const floralGarlandOverlay = `
      <div class="ceremony-arch-garland">
        <svg viewBox="0 0 320 180" class="garland-svg" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 180 Q30 30 160 20 Q290 30 310 180" stroke="#059669" stroke-width="5" fill="none"/>
          <g fill="#F43F5E">
            <circle cx="40" cy="90" r="7"/><circle cx="80" cy="45" r="8"/><circle cx="160" cy="22" r="9"/>
            <circle cx="240" cy="45" r="8"/><circle cx="280" cy="90" r="7"/>
          </g>
          <g fill="#FDE047">
            <circle cx="60" cy="65" r="5"/><circle cx="120" cy="30" r="6"/><circle cx="200" cy="30" r="6"/><circle cx="260" cy="65" r="5"/>
          </g>
        </svg>
      </div>
    `;

    const ceremonyArts = [
      "assets/images/themes/haldi-ceremony.svg",
      "assets/images/themes/mehendi-ceremony.svg",
      "assets/images/themes/pheras-ceremony.svg",
      "assets/images/themes/reception-ceremony.svg"
    ];

    timelineListEl.innerHTML = events.map((ev, i) => {
      let artSrc = ceremonyArts[i % ceremonyArts.length];
      const lower = ev.title.toLowerCase();
      if (lower.includes("haldi") || lower.includes("sthapana") || lower.includes("ganesh")) {
        artSrc = "assets/images/themes/haldi-ceremony.svg";
      } else if (lower.includes("mehendi") || lower.includes("sangeet") || lower.includes("gala")) {
        artSrc = "assets/images/themes/mehendi-ceremony.svg";
      } else if (lower.includes("phera") || lower.includes("vivaah") || lower.includes("wedding") || lower.includes("baraat") || lower.includes("matrimony")) {
        artSrc = "assets/images/themes/pheras-ceremony.svg";
      } else if (lower.includes("reception") || lower.includes("dawat") || lower.includes("governors")) {
        artSrc = "assets/images/themes/reception-ceremony.svg";
      }

      let scriptTitle = ev.title;
      if (ev.title.includes("&")) {
        scriptTitle = ev.title.split("&")[0].trim();
      } else if (ev.title.includes("-")) {
        scriptTitle = ev.title.split("-")[0].trim();
      }

      return `
        <div class="ceremony-function-block" data-function="${i + 1}">
          <!-- Top Palace Dome Architecture Outline -->
          ${domeArchitectureSVG}

          <!-- Arch Window Frame with Ceremony Artwork -->
          <div class="ceremony-arch-frame">
            ${floralGarlandOverlay}
            <img src="${artSrc}" alt="${ev.title}" class="ceremony-art-img" loading="lazy">
          </div>

          <!-- Overlapping Translucent Luxury Card -->
          <div class="ceremony-overlay-card">
            <div class="ceremony-badge-number">
              <i class="ph ph-sparkle"></i> FUNCTION ${i + 1}
            </div>
            <h3 class="ceremony-script-title">${scriptTitle}</h3>
            
            <div class="ceremony-ornament-divider">
              <svg width="50" height="10" viewBox="0 0 50 10" fill="currentColor">
                <path d="M25 5 Q20 0 15 5 Q20 10 25 5 Z M25 5 Q30 0 35 5 Q30 10 25 5 Z M25 5 C25 2 27 1 29 1 M25 5 C25 8 27 9 29 9 M25 5 C25 2 23 1 21 1 M25 5 C25 8 23 9 21 9"/>
              </svg>
            </div>

            <div class="ceremony-meta-row">
              <span class="c-icon">📅</span>
              <span class="c-text"><strong>${ev.date}</strong></span>
            </div>
            <div class="ceremony-meta-row">
              <span class="c-icon">🕒</span>
              <span class="c-text">${ev.time}</span>
            </div>
            <div class="ceremony-meta-row">
              <span class="c-icon">📍</span>
              <span class="c-text">${ev.venue}</span>
            </div>

            ${ev.attire ? `
            <div class="ceremony-dress-code">
              Dress code · ${ev.attire}
            </div>` : ''}

            ${ev.desc ? `<p class="ceremony-description">${ev.desc}</p>` : ''}

            <div class="ceremony-action-btns">
              <a href="${ev.mapUrl || this.data.mapUrl || 'https://maps.google.com/?q=' + encodeURIComponent(ev.venue)}" target="_blank" class="btn-directions">
                <i class="ph ph-navigation-arrow"></i> Get Directions
              </a>
              <button class="btn-add-calendar" onclick="window.inviteApp?.addToCalendar(${i})">
                + Add to Calendar
              </button>
            </div>
          </div>
        </div>
      `;
    }).join("");
  }

  addToCalendar(index) {
    const ev = (this.data.events && this.data.events[index]) ? this.data.events[index] : null;
    if (!ev) return;
    const title = encodeURIComponent(`${this.data.groomName} & ${this.data.brideName} - ${ev.title}`);
    const details = encodeURIComponent(`${ev.desc || ''}\nDress Code: ${ev.attire || 'Festive'}`);
    const location = encodeURIComponent(`${ev.venue || this.data.venueName}`);
    const googleCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}`;
    window.open(googleCalUrl, "_blank");
  }

  initScratchSurfaces() {
    this.dateScratch = null;
    const t = this.activeTemplate;

    // Photo Scratch
    const photoContainer = document.getElementById("photoScratchMount");
    if (photoContainer) {
      this.photoScratch = new LuxuryScratchCard({
        container: photoContainer,
        textureType: t.scratchTexture || "gold-leaf",
        primaryColor: t.primaryColor,
        accentColor: t.accentColor,
        titleText: "SCRATCH TO REVEAL COUPLE",
        subText: "Rub here to reveal Bride & Groom",
        onRevealed: () => {
          this.audioEngine.playChime();
          this.showToast("✨ Royal Couple photographs revealed!");
        },
        onScratch: () => this.audioEngine.playScratchSound()
      });
    }
  }

  bindHeaderActions() {
    // Hero Canopy Floating Sound Toggle Button
    const heroSoundBtn = document.getElementById("heroSoundToggleBtn");
    const heroSpeakerIcon = document.getElementById("heroSpeakerIcon");
    if (heroSoundBtn) {
      heroSoundBtn.addEventListener("click", () => {
        this.audioEngine.toggleMusic();
        const isPlaying = this.audioEngine.isPlaying;
        heroSoundBtn.classList.toggle("is-active", isPlaying);
        if (heroSpeakerIcon) {
          heroSpeakerIcon.className = isPlaying ? "ph ph-speaker-high" : "ph ph-speaker-slash";
        }
        this.showToast(isPlaying ? "🎵 Wedding music playing" : "🔇 Wedding music muted");
      });
    }

    // Hero Canopy Close / Share Button
    const heroCloseBtn = document.getElementById("heroCloseActionBtn");
    if (heroCloseBtn) {
      heroCloseBtn.addEventListener("click", () => {
        const shareModal = document.getElementById("shareModal");
        if (shareModal) shareModal.classList.add("active");
      });
    }

    // Music Toggle
    const musicBtn = document.getElementById("inviteMusicToggle");
    const musicLabel = document.getElementById("inviteMusicLabel");
    if (musicBtn) {
      musicBtn.addEventListener("click", () => {
        this.audioEngine.toggleMusic();
        if (musicLabel) {
          musicLabel.textContent = this.audioEngine.isPlaying ? "Music Playing" : "Play Music";
        }
        if (heroSoundBtn) heroSoundBtn.classList.toggle("is-active", this.audioEngine.isPlaying);
      });
    }

    // Auto-Scroll Toggle
    const scrollBtn = document.getElementById("inviteAutoScrollToggle");
    if (scrollBtn) {
      scrollBtn.addEventListener("click", () => {
        this.autoScroll.toggle();
      });
    }

    // Share Modal
    const shareBtn = document.getElementById("inviteShareBtn");
    const shareModal = document.getElementById("shareModal");
    const closeShare = document.getElementById("closeShareModalBtn");
    const whatsappLink = document.getElementById("shareWhatsappLink");
    const copyLinkBtn = document.getElementById("copyInviteLinkBtn");

    if (shareBtn && shareModal) {
      shareBtn.addEventListener("click", () => {
        const shareUrl = window.location.href;
        const shareMsg = `✨ Royal Wedding Invitation ✨\nYou are cordially invited to celebrate the holy union of ${this.data.groomName} & ${this.data.brideName}!\n\nOpen your 3D interactive invitation here:\n${shareUrl}`;

        if (whatsappLink) {
          whatsappLink.href = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareMsg)}`;
        }
        shareModal.classList.add("active");
      });
    }

    if (closeShare && shareModal) {
      closeShare.addEventListener("click", () => shareModal.classList.remove("active"));
    }

    if (copyLinkBtn) {
      copyLinkBtn.addEventListener("click", () => {
        navigator.clipboard.writeText(window.location.href).then(() => {
          this.showToast("📋 Invitation link copied to clipboard!");
        });
      });
    }

    // Invitation End Capsule Buttons (Edit & Share - media_1795279147852_9a21f94f.png)
    const goEditStudio = (e) => {
      if (e) e.preventDefault();
      try {
        localStorage.setItem("royal_wedding_data", JSON.stringify(this.data));
      } catch (err) {}
      window.location.href = `index.html?template=${encodeURIComponent(this.activeTemplate.id)}`;
    };

    const openShareDialog = () => {
      const shareUrl = window.location.href;
      const shareMsg = `✨ Royal Wedding Invitation ✨\nYou are cordially invited to celebrate the holy union of ${this.data.groomName} & ${this.data.brideName}!\n\nOpen your 3D interactive invitation here:\n${shareUrl}`;
      if (whatsappLink) {
        whatsappLink.href = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareMsg)}`;
      }
      if (shareModal) shareModal.classList.add("active");
    };

    const endEditBtn = document.getElementById("inviteEndEditInviteBtn");
    const floatEditBtn = document.getElementById("floatingEndEditInviteBtn");
    if (endEditBtn) endEditBtn.addEventListener("click", goEditStudio);
    if (floatEditBtn) floatEditBtn.addEventListener("click", goEditStudio);

    const endShareBtn = document.getElementById("inviteEndShareInviteBtn");
    const floatShareBtn = document.getElementById("floatingEndShareInviteBtn");
    if (endShareBtn) endShareBtn.addEventListener("click", openShareDialog);
    if (floatShareBtn) floatShareBtn.addEventListener("click", openShareDialog);

    // Floating dock scroll visibility
    const floatDock = document.getElementById("floatingEndActionsDock");
    if (floatDock) {
      window.addEventListener("scroll", () => {
        if (window.scrollY > 380) {
          floatDock.classList.add("is-visible");
        } else {
          floatDock.classList.remove("is-visible");
        }
      }, { passive: true });
    }
  }

  showToast(message) {
    const container = document.getElementById("toastContainer");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = "toast-message";
    toast.innerHTML = `<i class="ph ph-sparkle" style="color: #d4af37;"></i> <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add("hide");
      setTimeout(() => toast.remove(), 400);
    }, 3200);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  window.inviteApp = new StandaloneInviteApp();
});
