import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { stadiumScene } from './three-scene.js';
import { audioEngine } from './audio.js';

// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

class PortfolioController {
  constructor() {
    this.lenis = null;
    this.activeSection = 'intro';
  }

  init() {
    // 1. Initialize 3D Scene
    stadiumScene.init('webgl-canvas');

    // 2. Initialize Smooth Scrolling
    this.setupSmoothScroll();

    // 3. Initialize Animations
    this.setupCursor();
    this.setupAudioControls();
    this.setupNavProgress();
    this.setupHeroAnimations();
    this.setupHorizontalTimeline();
    this.setupEducationSpotlight();
    this.setupCricketStats();
    this.setupMindsetText();
    this.setupFutureCards();
    this.setupScrollStateBinder();
    this.setupInteractionListeners();
  }

  setupSmoothScroll() {
    this.lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Apple-like ease out
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.2
    });

    // Synchronize ScrollTrigger with Lenis
    this.lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      this.lenis.raf(time * 1000);
    });
    
    gsap.ticker.lagSmoothing(0);
  }

  setupCursor() {
    const cursor = document.getElementById('custom-cursor');
    const glow = document.getElementById('cursor-glow');

    if (!cursor || !glow) return;

    let mouseX = 0, mouseY = 0;
    let currX = 0, currY = 0;
    let glowX = 0, glowY = 0;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    // Animate custom cursor with lerping
    gsap.ticker.add(() => {
      currX += (mouseX - currX) * 0.25;
      currY += (mouseY - currY) * 0.25;
      
      glowX += (mouseX - glowX) * 0.12;
      glowY += (mouseY - glowY) * 0.12;

      cursor.style.left = `${currX}px`;
      cursor.style.top = `${currY}px`;

      glow.style.left = `${glowX}px`;
      glow.style.top = `${glowY}px`;
    });

    // Cursor hover effects on links/buttons
    const hoverElements = document.querySelectorAll('a, button, .future-glass-card, .glass-timeline-card');
    hoverElements.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        document.body.classList.add('cursor-hovering');
        audioEngine.playHover();
      });
      el.addEventListener('mouseleave', () => {
        document.body.classList.remove('cursor-hovering');
      });
    });
  }

  setupAudioControls() {
    const audioPanel = document.getElementById('audio-panel');
    const audioToggle = document.getElementById('audio-toggle');
    const statusText = document.getElementById('audio-status');
    const volumeSlider = document.getElementById('audio-volume');

    if (!audioToggle || !statusText || !volumeSlider) return;

    // Fade in audio panel after loading
    gsap.fromTo(audioPanel, 
      { opacity: 0, x: 20 },
      { opacity: 1, x: 0, delay: 2.0, duration: 1, ease: 'power3.out' }
    );

    const startAudio = () => {
      audioEngine.start();
      document.getElementById('sound-wave').classList.add('audio-active');
      statusText.textContent = 'Sound On';
    };

    const stopAudio = () => {
      audioEngine.stop();
      document.getElementById('sound-wave').classList.remove('audio-active');
      statusText.textContent = 'Sound Off';
    };

    // User click triggers toggle
    audioToggle.addEventListener('click', () => {
      if (audioEngine.isPlaying) {
        stopAudio();
      } else {
        startAudio();
      }
    });

    // Slider triggers volume changes
    volumeSlider.addEventListener('input', (e) => {
      audioEngine.setVolume(e.target.value);
    });

    // Auto-initialize context upon user's first scroll/drag/click interaction
    const initOnFirstInteraction = () => {
      if (!audioEngine.ctx) {
        audioEngine.init();
      }
      window.removeEventListener('scroll', initOnFirstInteraction);
      window.removeEventListener('click', initOnFirstInteraction);
      window.removeEventListener('touchstart', initOnFirstInteraction);
    };

    window.addEventListener('scroll', initOnFirstInteraction);
    window.addEventListener('click', initOnFirstInteraction);
    window.addEventListener('touchstart', initOnFirstInteraction);
  }

  setupNavProgress() {
    const progressBar = document.getElementById('scroll-progress');
    const sections = ['intro', 'origin', 'school', 'education', 'cricket', 'mindset', 'future'];
    const navItems = document.querySelectorAll('.nav-item');
    const dockItems = document.querySelectorAll('.dock-item');
    const dockWrapper = document.getElementById('floating-dock');

    // Global scroll listener for header progress bar
    window.addEventListener('scroll', () => {
      const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      if (progressBar) {
        progressBar.style.width = `${scrollPercent}%`;
      }
      
      // Floating macOS dock shows up once we scroll past the hero page
      if (window.scrollY > window.innerHeight * 0.4) {
        dockWrapper.classList.add('visible');
      } else {
        dockWrapper.classList.remove('visible');
      }
    });

    // Map desktop & dock active anchors
    sections.forEach((secId) => {
      ScrollTrigger.create({
        trigger: `#${secId}`,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => this.updateActiveNavs(secId, navItems, dockItems),
        onEnterBack: () => this.updateActiveNavs(secId, navItems, dockItems)
      });
    });
  }

  updateActiveNavs(sectionId, navItems, dockItems) {
    this.activeSection = sectionId;

    navItems.forEach((nav) => {
      if (nav.getAttribute('data-sec') === sectionId) {
        nav.classList.add('active');
      } else {
        nav.classList.remove('active');
      }
    });

    dockItems.forEach((dock) => {
      if (dock.getAttribute('data-sec') === sectionId) {
        dock.classList.add('active');
      } else {
        dock.classList.remove('active');
      }
    });
  }

  setupHeroAnimations() {
    const tl = gsap.timeline({ defaults: { ease: 'power4.out', duration: 1.4 } });

    // Apple Keynote slow dramatic sequence
    tl.to('#hero-headline', { opacity: 1, y: 0, delay: 0.5 })
      .to('#hero-subheadline', { opacity: 1, y: 0 }, '-=1.0')
      .to('#hero-desc', { opacity: 1, y: 0 }, '-=1.0')
      .to('#begin-journey-btn', { opacity: 1, y: 0 }, '-=0.8')
      .to('#scroll-prompt-hint', { opacity: 1 }, '-=0.6');
  }

  setupHorizontalTimeline() {
    const track = document.getElementById('school-timeline-track');
    if (!track) return;

    // Horizontal Scroll length = scrollWidth - screenWidth
    const getScrollAmount = () => track.scrollWidth - window.innerWidth;

    gsap.to(track, {
      x: () => -getScrollAmount(),
      ease: 'none',
      scrollTrigger: {
        trigger: '#school',
        pin: true,
        scrub: 1,
        start: 'top top',
        end: () => `+=${getScrollAmount()}`,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          // Fill timeline line progress bar
          const line = document.getElementById('timeline-progress-line');
          if (line) {
            line.style.width = `${self.progress * 100}%`;
          }
        }
      }
    });

    // Reveal individual timeline panels sequentially during scroll
    const panels = gsap.utils.toArray('.timeline-panel');
    panels.forEach((panel) => {
      gsap.from(panel.querySelector('.glass-timeline-card'), {
        opacity: 0,
        y: 60,
        scale: 0.95,
        duration: 0.8,
        scrollTrigger: {
          trigger: panel,
          containerAnimation: gsap.getById('school'), // triggers inside horizontal container
          start: 'left right-=100',
          toggleActions: 'play none none reverse'
        }
      });
    });
  }

  setupEducationSpotlight() {
    const eduSection = document.getElementById('education');
    const spotlight = document.getElementById('edu-spotlight');

    if (!eduSection || !spotlight) return;

    // Spotlight brightness opacity maps to scrolling
    gsap.to(spotlight, {
      opacity: 1,
      scrollTrigger: {
        trigger: '#education',
        start: 'top bottom',
        end: 'top top+=200',
        scrub: true
      }
    });

    // Reveal higher education card
    gsap.from('#edu-card', {
      opacity: 0,
      y: 50,
      scale: 0.98,
      duration: 1,
      scrollTrigger: {
        trigger: '#education',
        start: 'top center+=100',
        toggleActions: 'play none none reverse'
      }
    });
  }

  setupCricketStats() {
    const numbers = document.querySelectorAll('.stat-number');
    
    // Electronic scoreboard dial counting animation
    ScrollTrigger.create({
      trigger: '#cricket',
      start: 'top center',
      onEnter: () => {
        numbers.forEach((num) => {
          const target = parseInt(num.getAttribute('data-target'), 10);
          const obj = { val: 0 };
          gsap.to(obj, {
            val: target,
            duration: 2.5,
            ease: 'power3.out',
            onUpdate: () => {
              num.textContent = Math.floor(obj.val).toLocaleString();
            }
          });
        });
      }
    });
  }

  setupMindsetText() {
    const quote = document.getElementById('mindset-quote-text');
    if (!quote) return;

    // Split words/characters for fade-in effect
    const text = quote.textContent.trim();
    quote.innerHTML = '';
    
    const words = text.split(' ');
    words.forEach((word) => {
      const span = document.createElement('span');
      span.textContent = word + ' ';
      span.style.display = 'inline-block';
      span.style.opacity = '0';
      span.style.filter = 'blur(10px)';
      span.style.transform = 'translateY(15px)';
      quote.appendChild(span);
    });

    // Animates blurred letters on scroll
    gsap.to(quote.children, {
      opacity: 1,
      filter: 'blur(0px)',
      y: 0,
      duration: 1,
      stagger: 0.1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '#mindset',
        start: 'top center+=100',
        toggleActions: 'play none none reverse'
      }
    });

    gsap.from('#mindset-desc', {
      opacity: 0,
      y: 20,
      duration: 1,
      delay: 0.8,
      scrollTrigger: {
        trigger: '#mindset',
        start: 'top center+=100',
        toggleActions: 'play none none reverse'
      }
    });
  }

  setupFutureCards() {
    // Stagger slide-up for futuristic vision panels
    gsap.from('.future-glass-card', {
      opacity: 0,
      y: 40,
      scale: 0.95,
      duration: 1,
      stagger: 0.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: '#future',
        start: 'top center+=150',
        toggleActions: 'play none none reverse'
      }
    });
  }

  /**
   * Tracks section boundaries and feeds progress percentages to the WebGL Camera state engine.
   */
  setupScrollStateBinder() {
    const sections = ['intro', 'origin', 'school', 'education', 'cricket', 'mindset', 'future', 'ending'];

    sections.forEach((secId) => {
      ScrollTrigger.create({
        trigger: `#${secId}`,
        start: 'top top',
        end: 'bottom top',
        onUpdate: (self) => {
          // If this section is active, update the 3D scene camera pathways based on scroll progress
          if (this.activeSection === secId) {
            stadiumScene.updateState(secId, self.progress);
          }
        }
      });
    });
  }

  setupInteractionListeners() {
    // 1. Swing Bat Button (Rotates ball, plays bat pop sound)
    const swingBtn = document.getElementById('swing-bat-btn');
    if (swingBtn) {
      swingBtn.addEventListener('click', () => {
        stadiumScene.triggerBallSpin();
        audioEngine.playBatHit();
        
        // Add subtle punch scale effect
        gsap.to(swingBtn, { scale: 0.92, duration: 0.08, yoyo: true, repeat: 1 });
      });
    }

    // 2. Restart Journey Button
    const restartBtn = document.getElementById('restart-journey-btn');
    if (restartBtn) {
      restartBtn.addEventListener('click', () => {
        this.lenis.scrollTo('#intro', { duration: 2.0 });
        audioEngine.playSwoosh();
      });
    }

    // 3. Begin Journey Button
    const beginBtn = document.getElementById('begin-journey-btn');
    if (beginBtn) {
      beginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.lenis.scrollTo('#origin', { duration: 1.5 });
      });
    }

    // 4. Logo Link (Scroll to top)
    const logoLink = document.getElementById('nav-logo-link');
    if (logoLink) {
      logoLink.addEventListener('click', (e) => {
        e.preventDefault();
        this.lenis.scrollTo('#intro', { duration: 1.5 });
      });
    }

    // 5. Custom magnetic button effect
    const magneticBtns = document.querySelectorAll('.magnetic-btn, .action-btn');
    magneticBtns.forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        // Pull button towards cursor by 25%
        gsap.to(btn, {
          x: x * 0.25,
          y: y * 0.25,
          duration: 0.3,
          ease: 'power2.out'
        });
      });

      btn.addEventListener('mouseleave', () => {
        // Return button back to original position
        gsap.to(btn, {
          x: 0,
          y: 0,
          duration: 0.5,
          ease: 'elastic.out(1, 0.3)'
        });
      });
    });
  }
}

// Instantiate and start portfolio logic
document.addEventListener('DOMContentLoaded', () => {
  const portfolio = new PortfolioController();
  portfolio.init();
});
