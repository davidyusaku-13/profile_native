# DRY/KISS/YAGNI Refactoring Implementation Plan

> **For Droid:** REQUIRED SUB-SKILL: Use `executing-plans` skill to implement this plan task-by-task. Use `test-driven-development` for each CSS/HTML refactoring verification.

**Goal:** Refactor index.html to remove code duplication (DRY), eliminate unused features (YAGNI), and simplify complex systems (KISS), reducing total lines by ~350 while maintaining identical visual and functional output.

**Architecture:** Single-file refactoring with no structural changes. All modifications are CSS consolidation, JavaScript removal, and HTML simplification. No new dependencies or build steps required.

**Tech Stack:** HTML5, CSS3 (custom properties, animations), vanilla JavaScript (minimal, no framework changes)

---

## Task 1: Remove Custom Cursor System

**Files:**
- Modify: `index.html:426-451` (delete HTML/CSS)
- Modify: `index.html:926-993` (delete JavaScript)
- Test: Manual browser verification

**Why:** Custom cursor adds 150 lines with zero functional benefit. Users expect standard cursors.

#### Step 1: Verify current behavior

Open `index.html` in browser. Move mouse around portfolio—you should see a custom purple cursor dot/ring effect.

Expected: Magnetic cursor animation visible on desktop.

#### Step 2: Delete HTML custom cursor element

In `index.html`, find and delete lines 426-451:

```html
<!-- DELETE THIS ENTIRE SECTION -->
<!-- Custom Cursor -->
<div class="custom-cursor" id="cursor" style="display: none;">
  <div class="cursor-dot" id="cursor-dot"></div>
  <div class="cursor-ring" id="cursor-ring"></div>
</div>
<!-- END DELETE -->
```

#### Step 3: Delete cursor CSS rules

In the `<style>` section, find and delete these CSS rules (approximately lines 353-403):

```css
/* DELETE: Custom Cursor Effects */
body.custom-cursor-active,
body.custom-cursor-active * {
  cursor: none !important;
}

.custom-cursor {
  position: fixed;
  pointer-events: none;
  z-index: 9999;
  mix-blend-mode: difference;
}

.cursor-dot {
  width: 8px;
  height: 8px;
  background: #8b5cf6;
  border-radius: 50%;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  transition: width 200ms var(--easing-bounce),
              height 200ms var(--easing-bounce);
}

.cursor-ring {
  width: 32px;
  height: 32px;
  border: 2px solid #8b5cf6;
  border-radius: 50%;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  transition: width 300ms var(--easing-elegant),
              height 300ms var(--easing-elegant),
              border-radius 300ms var(--easing-elegant);
  filter: blur(0.5px);
  opacity: 0.6;
}

.cursor-dot.hover {
  width: 12px;
  height: 12px;
}

.cursor-ring.hover {
  width: 48px;
  height: 48px;
  opacity: 0.8;
}

.cursor-dot.click {
  width: 6px;
  height: 6px;
}

.cursor-ring.click {
  width: 24px;
  height: 24px;
}
/* END DELETE */
```

#### Step 4: Delete cursor JavaScript handler

In the `<script>` section, find and delete lines 926-993:

```javascript
// DELETE: ===== FEATURE 2: Enhanced Cursor Effects =====
const cursor = document.getElementById('cursor');
const cursorDot = document.getElementById('cursor-dot');
const cursorRing = document.getElementById('cursor-ring');

// Check if device has fine pointer (mouse)
const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (hasFinePointer && !prefersReducedMotion) {
  cursor.style.display = 'block';
  document.body.classList.add('custom-cursor-active');

  let mouseX = 0, mouseY = 0;
  let dotX = 0, dotY = 0;
  let ringX = 0, ringY = 0;

  // Track mouse position
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Smooth cursor animation with lerp
  function animateCursor() {
    // Dot follows immediately
    dotX = mouseX;
    dotY = mouseY;

    // Ring lags behind for magnetic effect
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;

    // Position the parent container at cursor position
    cursor.style.left = dotX + 'px';
    cursor.style.top = dotY + 'px';

    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Hover effects on interactive elements
  const interactiveElements = 'a, button, .tab-btn, .social-icon, .expand-toggle';

  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(interactiveElements)) {
      cursorDot.classList.add('hover');
      cursorRing.classList.add('hover');
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(interactiveElements)) {
      cursorDot.classList.remove('hover');
      cursorRing.classList.remove('hover');
    }
  });

  // Click effect
  document.addEventListener('mousedown', () => {
    cursorDot.classList.add('click');
    cursorRing.classList.add('click');
  });

  document.addEventListener('mouseup', () => {
    cursorDot.classList.remove('click');
    cursorRing.classList.remove('click');
  });
}
// END DELETE
```

#### Step 5: Verify removal in browser

Open `index.html` in browser. Move mouse around—cursor should now be standard browser cursor. Hover over buttons/links—no dot/ring effect.

Expected: Standard cursor behavior, no custom effects.

#### Step 6: Commit

```bash
git add index.html
git commit -m "refactor: remove custom cursor system (YAGNI)"
```

Expected: Commit succeeds with message about cursor removal.

---

## Task 2: Remove Swipe Gestures System

**Files:**
- Modify: `index.html:995-1076` (delete JavaScript)
- Modify: `index.html` style section (delete CSS keyframes and classes)
- Test: Manual touch/browser verification

**Why:** Swipe gestures add 150 lines. Mobile users expect tap buttons, not swipes. Tab buttons already provide clear navigation.

#### Step 1: Verify current swipe behavior (optional)

If on mobile or using Chrome DevTools device emulation, swipe left/right on the content area—tabs should change with slide animation.

#### Step 2: Delete swipe JavaScript handler

In the `<script>` section, find and delete lines 995-1076:

```javascript
// DELETE: ===== FEATURE 3: Swipe Gestures for Mobile =====
const contentSections = document.querySelectorAll('.content-section');
let touchStartX = 0;
let touchStartY = 0;
let touchStartTime = 0;
let touchEndX = 0;
let touchEndY = 0;
let isSwiping = false;
let swipeDirection = null;

const swipeThreshold = 50;
const velocityThreshold = 0.5;

contentSections.forEach(section => {
  section.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
    touchStartTime = Date.now();
  }, { passive: true });

  section.addEventListener('touchmove', (e) => {
    if (!isSwiping) {
      const deltaX = Math.abs(e.changedTouches[0].screenX - touchStartX);
      const deltaY = Math.abs(e.changedTouches[0].screenY - touchStartY);

      // Determine if horizontal or vertical swipe
      if (deltaX > 10 || deltaY > 10) {
        if (deltaX > deltaY) {
          isSwiping = true;
          section.classList.add('swiping');
        }
      }
    }

    if (isSwiping) {
      const delta = e.changedTouches[0].screenX - touchStartX;
      const maxDistance = window.innerWidth;
      const resistance = 1 - Math.abs(delta) / maxDistance;
      const translate = delta * Math.max(resistance, 0.2);

      section.style.transform = `translateX(${translate}px)`;
      section.style.opacity = 1 - Math.abs(delta) / maxDistance * 0.3;
    }
  }, { passive: true });

  section.addEventListener('touchend', (e) => {
    if (!isSwiping) return;

    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    const touchEndTime = Date.now();

    const deltaX = touchEndX - touchStartX;
    const deltaTime = touchEndTime - touchStartTime;
    const velocity = Math.abs(deltaX) / deltaTime;

    section.classList.remove('swiping');

    // Determine if swipe threshold met
    if (Math.abs(deltaX) > swipeThreshold || velocity > velocityThreshold) {
      if (deltaX > 0) {
        // Swipe right - previous tab
        swipeDirection = 'right';
        const prevIndex = (currentTabIndex - 1 + tabs.length) % tabs.length;
        performSwipe(section, tabs[prevIndex], 'right');
      } else {
        // Swipe left - next tab
        swipeDirection = 'left';
        const nextIndex = (currentTabIndex + 1) % tabs.length;
        performSwipe(section, tabs[nextIndex], 'left');
      }
    } else {
      // Cancel swipe - spring back
      section.style.transform = '';
      section.style.opacity = '';
    }

    isSwiping = false;
  }, { passive: true });
});

function performSwipe(currentSection, targetTabId, direction) {
  // Animate current section out
  currentSection.classList.add(`swipe-${direction}`);

  setTimeout(() => {
    currentSection.classList.remove(`swipe-${direction}`);
    currentSection.style.transform = '';
    currentSection.style.opacity = '';

    // Switch to new tab
    switchTab(targetTabId);

    // Animate new section in
    const newSection = document.getElementById(`content-${targetTabId}`);
    const slideDirection = direction === 'left' ? 'right' : 'left';
    newSection.classList.add(`slide-in-${slideDirection}`);

    setTimeout(() => {
      newSection.classList.remove(`slide-in-${slideDirection}`);
    }, 400);
  }, 400);
}
// END DELETE
```

#### Step 3: Delete swipe-related CSS classes

In the `<style>` section, find and delete approximately lines 405-460 (all swipe and slide-in animations):

```css
/* DELETE: Swipe Gestures and slide-in animations */
.content-section {
  position: relative;
  touch-action: pan-y;
  transition: transform var(--timing-medium) var(--easing-elegant),
              opacity var(--timing-medium) var(--easing-smooth);
}

.content-section.swiping {
  transition: none;
}

.content-section.swipe-left {
  animation: slideOutLeft var(--timing-medium) var(--easing-elegant) forwards;
}

.content-section.swipe-right {
  animation: slideOutRight var(--timing-medium) var(--easing-elegant) forwards;
}

@keyframes slideOutLeft {
  to {
    transform: translateX(-100%);
    opacity: 0;
  }
}

@keyframes slideOutRight {
  to {
    transform: translateX(100%);
    opacity: 0;
  }
}

.content-section.slide-in-left {
  animation: slideInLeft var(--timing-medium) var(--easing-elegant) forwards;
}

.content-section.slide-in-right {
  animation: slideInRight var(--timing-medium) var(--easing-elegant) forwards;
}

@keyframes slideInLeft {
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
/* END DELETE */
```

**Note:** Keep the base `.content-section` rule but REMOVE the swipe-specific and slide-in classes/keyframes. The base `.content-section` needs to remain because it's referenced by tab switching and fade-in animations.

Actually, let me clarify: The `.content-section` base rule should become simpler. After deleting swipe-related code, update it to:

```css
.content-section {
  position: relative;
}
```

This removes the touch-action and transition that were only for swipe behavior.

#### Step 4: Verify tab switching still works

Open `index.html` in browser. Click the About/Edu & Exp/Resume buttons. Tabs should still switch instantly with fade animation.

Expected: Tab switching works via button clicks. No swipe functionality.

#### Step 5: Commit

```bash
git add index.html
git commit -m "refactor: remove swipe gestures system (YAGNI)"
```

Expected: Commit succeeds.

---

## Task 3: Remove Scroll Progress Indicator

**Files:**
- Modify: `index.html:908-925` (delete JavaScript)
- Modify: `index.html` Resume section (delete HTML)
- Modify: `index.html` Edu & Exp section (delete HTML)
- Modify: `index.html` style section (delete CSS)

**Why:** Scroll progress adds complexity for negligible benefit. Content rarely scrolls on standard widths.

#### Step 1: Verify current scroll progress

Open `index.html` in browser. Go to Resume tab. Scroll down—you should see a small purple progress bar on the right side of the content panel.

Expected: Scroll progress indicator visible on scrollable content.

#### Step 2: Delete scroll progress JavaScript handler

In the `<script>` section, find and delete lines 908-925:

```javascript
// DELETE: ===== FEATURE 1: Scroll Progress Indicators =====
function updateScrollProgress() {
  const scrollableSections = document.querySelectorAll('.md\\:overflow-y-auto');

  scrollableSections.forEach(section => {
    const progressContainer = section.querySelector('.scroll-progress-container');
    const progressBar = section.querySelector('.scroll-progress-bar');

    if (!progressContainer || !progressBar) return;

    const isScrollable = section.scrollHeight > section.clientHeight;

    if (isScrollable) {
      progressContainer.classList.add('visible');

      const scrollPercentage = (section.scrollTop / (section.scrollHeight - section.clientHeight));
      progressBar.style.transform = `scaleY(${scrollPercentage})`;
    } else {
      progressContainer.classList.remove('visible');
    }
  });
}

// Debounce scroll events
let scrollTimeout;
document.querySelectorAll('.md\\:overflow-y-auto').forEach(section => {
  section.addEventListener('scroll', () => {
    if (scrollTimeout) clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(updateScrollProgress, 16);
  });
});

// Initial check
setTimeout(updateScrollProgress, 300);
// END DELETE
```

#### Step 3: Delete scroll progress CSS

In the `<style>` section, find and delete approximately lines 335-352 (scroll progress indicator CSS):

```css
/* DELETE: Scroll Progress Indicators */
.scroll-progress-container {
  position: absolute;
  right: 8px;
  top: 16px;
  bottom: 16px;
  width: 2px;
  background: rgba(139, 92, 246, 0.1);
  border-radius: 999px;
  opacity: 0;
  transition: opacity var(--timing-medium) var(--easing-smooth);
}

.scroll-progress-container.visible {
  opacity: 1;
}

.scroll-progress-bar {
  width: 100%;
  background: linear-gradient(180deg, #8b5cf6, #a78bfa);
  border-radius: 999px;
  transform-origin: top;
  transition: transform 150ms cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 0 8px rgba(139, 92, 246, 0.4);
}
/* END DELETE */
```

#### Step 4: Delete scroll progress HTML from Resume section

Find the Resume section in HTML (search for `id="content-resume"`). Inside this section, find and delete:

```html
<!-- DELETE: Scroll Progress Indicator -->
<div class="scroll-progress-container">
  <div class="scroll-progress-bar" style="transform: scaleY(0);"></div>
</div>
<!-- END DELETE -->
```

There should be one progress container in the Resume section.

#### Step 5: Delete scroll progress HTML from Edu & Exp section

Find the Edu & Exp (Portfolio) section in HTML (search for `id="content-portfolio"`). Inside this section, find and delete:

```html
<!-- DELETE: Scroll Progress Indicator -->
<div class="scroll-progress-container">
  <div class="scroll-progress-bar" style="transform: scaleY(0);"></div>
</div>
<!-- END DELETE -->
```

There should be one progress container in the Portfolio section.

#### Step 6: Verify tab scrolling still works

Open `index.html` in browser. Go to Resume tab. Scroll down—content should still be scrollable. No progress indicator should appear.

Expected: Content scrolls normally. No progress bar visible.

#### Step 7: Commit

```bash
git add index.html
git commit -m "refactor: remove scroll progress indicator (YAGNI)"
```

Expected: Commit succeeds.

---

## Task 4: Consolidate Glass Panel Styling (DRY)

**Files:**
- Modify: `index.html` style section (lines 63-84)

**Why:** Dark/light glass panels duplicate 90% of code. Consolidate common properties.

#### Step 1: Review current glass panel CSS

Find the current glass panel CSS around lines 63-84:

```css
/* Dark mode glass panel */
.dark .glass-panel {
  background: rgba(30, 41, 59, 0.7);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: border-color var(--timing-medium) var(--easing-smooth),
              box-shadow var(--timing-medium) var(--easing-smooth);
}

.dark .glass-panel:hover {
  border-color: rgba(139, 92, 246, 0.3);
  box-shadow: 0 0 20px rgba(139, 92, 246, 0.1);
}

/* Light mode glass panel */
.glass-panel {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  transition: border-color var(--timing-medium) var(--easing-smooth),
              box-shadow var(--timing-medium) var(--easing-smooth);
}

.glass-panel:hover {
  border-color: rgba(139, 92, 246, 0.3);
  box-shadow: 0 8px 40px rgba(139, 92, 246, 0.15);
}
```

#### Step 2: Replace with consolidated version

Replace the entire glass panel CSS section with:

```css
/* Glass panel - common properties */
.glass-panel {
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  transition: border-color var(--timing-medium) var(--easing-smooth),
              box-shadow var(--timing-medium) var(--easing-smooth);
}

.glass-panel:hover {
  border-color: rgba(139, 92, 246, 0.3);
  box-shadow: 0 8px 40px rgba(139, 92, 246, 0.15);
}

/* Glass panel - dark mode overrides */
.dark .glass-panel {
  background: rgba(30, 41, 59, 0.7);
  border-color: rgba(255, 255, 255, 0.1);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
}

.dark .glass-panel:hover {
  border-color: rgba(139, 92, 246, 0.3);
  box-shadow: 0 0 20px rgba(139, 92, 246, 0.1);
}
```

**Explanation:** The base `.glass-panel` now contains all common properties. Dark mode only overrides the color-specific properties (background, border-color, box-shadow). This reduces duplication from ~50 lines to ~30 lines.

#### Step 3: Verify styling in browser

Open `index.html` in browser. Check both light and dark modes (system preference or manually toggle). Glass panels should look identical to before.

- Profile card background should be glassmorphic
- Content panel background should be glassmorphic
- Nav tabs background should be glassmorphic
- Hover effects should work on all glass panels
- Colors should be correct in both light and dark modes

Expected: No visual changes. Same glass effect, same colors, same hover behavior.

#### Step 4: Commit

```bash
git add index.html
git commit -m "refactor: consolidate glass panel styling (DRY)"
```

Expected: Commit succeeds.

---

## Task 5: Consolidate Tech Tag Animation Delays (DRY)

**Files:**
- Modify: `index.html` style section (lines 214-226)
- Modify: `index.html` About section tech tags (lines 569-593)

**Why:** 8 `.tech-tag:nth-child(N)` rules repeat with only delay changing. Use CSS variables instead.

#### Step 1: Review current tech tag CSS

Find the current tech tag animation CSS around lines 214-226:

```css
/* Staggered fade-in for tech stack */
.tech-tag {
  opacity: 0;
  animation: fadeInUp var(--timing-medium) var(--easing-elegant) forwards;
}

.tech-tag:nth-child(1) { animation-delay: 0ms; }
.tech-tag:nth-child(2) { animation-delay: 50ms; }
.tech-tag:nth-child(3) { animation-delay: 100ms; }
.tech-tag:nth-child(4) { animation-delay: 150ms; }
.tech-tag:nth-child(5) { animation-delay: 200ms; }
.tech-tag:nth-child(6) { animation-delay: 250ms; }
.tech-tag:nth-child(7) { animation-delay: 300ms; }
.tech-tag:nth-child(8) { animation-delay: 350ms; }
```

#### Step 2: Replace with CSS variable version

Replace the entire tech tag animation CSS with:

```css
/* Staggered fade-in for tech stack */
.tech-tag {
  opacity: 0;
  animation: fadeInUp var(--timing-medium) var(--easing-elegant) forwards;
  animation-delay: var(--delay, 0ms);
}
```

This removes all 8 nth-child rules and uses a `--delay` CSS variable instead.

#### Step 3: Add delay values to tech tag HTML

Find the tech tag markup in the About section (around lines 569-593). For each tech tag, add the `style` attribute with the delay:

```html
<!-- BEFORE -->
<span class="tech-tag px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-sm">React</span>
<span class="tech-tag px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 text-sm">JavaScript</span>
<!-- ... etc -->

<!-- AFTER -->
<span class="tech-tag px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-sm" style="--delay: 0ms;">React</span>
<span class="tech-tag px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 text-sm" style="--delay: 50ms;">JavaScript</span>
<span class="tech-tag px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-sm" style="--delay: 100ms;">TypeScript</span>
<span class="tech-tag px-3 py-1 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 text-sm" style="--delay: 150ms;">Tailwind CSS</span>
<span class="tech-tag px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20 text-sm" style="--delay: 200ms;">Bun</span>
<span class="tech-tag px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-sm" style="--delay: 250ms;">PHP</span>
<span class="tech-tag px-3 py-1 rounded-full bg-blue-600/10 text-blue-500 border border-blue-600/20 text-sm" style="--delay: 300ms;">Python</span>
<span class="tech-tag px-3 py-1 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20 text-sm" style="--delay: 350ms;">Qt (PySide)</span>
```

Delays: 0ms, 50ms, 100ms, 150ms, 200ms, 250ms, 300ms, 350ms (in order).

#### Step 4: Verify animation in browser

Open `index.html` in browser. Go to About tab. Tech tags should fade in with staggered timing (bottom to top or as designed).

Expected: Tags appear one by one with 50ms delays between each. Same animation as before, but CSS is cleaner.

#### Step 5: Commit

```bash
git add index.html
git commit -m "refactor: consolidate tech tag animation delays using CSS variables (DRY)"
```

Expected: Commit succeeds.

---

## Task 6: Reduce CSS Custom Property Sprawl (KISS)

**Files:**
- Modify: `index.html` style section (lines 34-40)
- Modify: `index.html` style section (inline various transition/easing rules)

**Why:** 6 timing/easing variables are defined but used sparsely. Keep only 2 essential ones.

#### Step 1: Review current CSS variables

Find the CSS variables at the top of the `<style>` section (around lines 34-40):

```css
:root {
  --timing-fast: 200ms;
  --timing-medium: 400ms;
  --timing-slow: 600ms;
  --easing-smooth: cubic-bezier(0.4, 0, 0.2, 1);
  --easing-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
  --easing-elegant: cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
```

#### Step 2: Replace with simplified variables

Replace the :root CSS variables with:

```css
:root {
  --timing-medium: 400ms;
  --easing-elegant: cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
```

Remove the 4 less-used variables. These two are the most commonly used and should be the standard.

#### Step 3: Replace fast timing with inline 200ms

Find all uses of `var(--timing-fast)` and replace with inline `200ms`.

Search for: `var(--timing-fast)`
Replace with: `200ms`

Common locations:
- Line ~143: `transition: transform 200ms ...` (button effects)
- Line ~215: `.tech-tag` animation
- Various hover effect transitions

#### Step 4: Replace slow timing with inline 600ms

Find all uses of `var(--timing-slow)` and replace with inline `600ms`.

Search for: `var(--timing-slow)`
Replace with: `600ms`

Common locations:
- Line ~163: Social icon shine effect
- Line ~297: Tab button transitions
- Various animation definitions

#### Step 5: Replace easing-smooth with inline cubic-bezier

Find all uses of `var(--easing-smooth)` and replace with inline `cubic-bezier(0.4, 0, 0.2, 1)`.

Search for: `var(--easing-smooth)`
Replace with: `cubic-bezier(0.4, 0, 0.2, 1)`

Or optionally keep one more variable for smooth easing if it's used frequently (5+ times).

#### Step 6: Replace easing-bounce with inline cubic-bezier

Find all uses of `var(--easing-bounce)` and replace with inline `cubic-bezier(0.68, -0.55, 0.265, 1.55)`.

Search for: `var(--easing-bounce)`
Replace with: `cubic-bezier(0.68, -0.55, 0.265, 1.55)`

#### Step 7: Verify animations still work

Open `index.html` in browser. Check:
- Button hover effects still animate smoothly
- Tech tags still fade in with stagger
- Name gradient still animates on hover
- Section headers animate on hover
- All transitions still feel natural

Expected: All animations work identically. No visual changes, just cleaner code.

#### Step 8: Commit

```bash
git add index.html
git commit -m "refactor: reduce CSS custom property sprawl to essential variables (KISS)"
```

Expected: Commit succeeds.

---

## Task 7: Audit and Remove Premature will-change Optimization (KISS)

**Files:**
- Modify: `index.html` style section (lines 424-432)

**Why:** `will-change` should only optimize continuous animations, not hover/transition effects.

#### Step 1: Review current will-change usage

Find the will-change rules around lines 424-432:

```css
/* Performance optimizations */
.profile-ring,
.blob-1,
.blob-2,
.blob-3 {
  will-change: transform;
}

.timeline-item,
.tech-tag,
.glass-panel {
  will-change: transform, opacity;
}

/* Remove will-change after animation completes */
.timeline-item.visible {
  will-change: auto;
}
```

#### Step 2: Keep will-change only on continuous animations

These elements have continuous, performance-critical animations and should keep `will-change`:
- `.profile-ring` - continuous 360° rotation
- `.blob-1`, `.blob-2`, `.blob-3` - continuous floating animations

These elements only have single transitions (not continuous) and should NOT have `will-change`:
- `.timeline-item` - fade-in on scroll (single transition)
- `.tech-tag` - fade-in with stagger (single transition)
- `.glass-panel` - hover effect (single transition)

#### Step 3: Replace will-change CSS

Replace the will-change section with:

```css
/* Performance optimization for continuous animations */
.profile-ring,
.blob-1,
.blob-2,
.blob-3 {
  will-change: transform;
}
```

Delete the `.timeline-item`, `.tech-tag`, `.glass-panel` will-change rules entirely.
Delete the `.timeline-item.visible { will-change: auto; }` rule entirely.

#### Step 4: Verify performance

Open `index.html` in browser. Check:
- Profile ring still rotates smoothly
- Floating blobs still animate smoothly
- Timeline items still fade in smoothly
- Tech tags still fade in smoothly
- No visual stutter or jank

Expected: All animations smooth. No performance degradation.

#### Step 5: Commit

```bash
git add index.html
git commit -m "refactor: remove premature will-change optimization from non-continuous animations (KISS)"
```

Expected: Commit succeeds.

---

## Task 8: Final Verification and Summary

**Files:**
- `index.html` (verify overall)

**Why:** Ensure all refactoring is complete and working correctly.

#### Step 1: Full browser verification

Open `index.html` in browser and test:

**Visual verification:**
- [ ] Profile card displays correctly with name, photo, social links, contact button
- [ ] Glass panels look correct in light mode
- [ ] Glass panels look correct in dark mode (toggle system theme)
- [ ] All animations are smooth (no jank)
- [ ] Tech tags fade in with stagger animation

**Functional verification:**
- [ ] About tab shows and animates correctly
- [ ] Edu & Exp tab shows and scrolls correctly (if needed)
- [ ] Resume tab shows and scrolls correctly (if needed)
- [ ] Tab buttons click and switch tabs instantly
- [ ] Social media links work
- [ ] Contact button opens WhatsApp

**Removed features verification:**
- [ ] No custom cursor (standard browser cursor visible)
- [ ] No swipe gestures (swipe doesn't change tabs)
- [ ] No scroll progress indicator (no progress bar on scrollable content)

**Expected:** All features work. All removed features are gone. No visual changes from original.

#### Step 2: Check git log

Run:
```bash
git log --oneline -10
```

Expected: 8 new commits in order:
1. "refactor: remove custom cursor system (YAGNI)"
2. "refactor: remove swipe gestures system (YAGNI)"
3. "refactor: remove scroll progress indicator (YAGNI)"
4. "refactor: consolidate glass panel styling (DRY)"
5. "refactor: consolidate tech tag animation delays using CSS variables (DRY)"
6. "refactor: reduce CSS custom property sprawl to essential variables (KISS)"
7. "refactor: remove premature will-change optimization from non-continuous animations (KISS)"
8. (This verification step - optional commit)

#### Step 3: Compare file sizes

Check the reduced code volume:

Before: ~950 lines in index.html
After: ~600 lines in index.html (estimated 350 lines removed)

#### Step 4: Final commit (optional)

If you made any small fixes during verification:

```bash
git add index.html
git commit -m "refactor: final verification and cleanup"
```

Or if no changes were made during verification, no commit needed.

---

## Testing Summary

All refactoring tasks use **manual browser verification** instead of automated tests, as this is a frontend UI file without test infrastructure. The verification focuses on:

1. **Visual integrity:** All styles render correctly in light/dark modes
2. **Animation smoothness:** All remaining animations run smoothly
3. **Functionality:** All interactive features work (tab switching, links, etc.)
4. **Removed features:** Custom cursor, swipes, scroll progress are completely removed

## Summary of Changes

**Total lines removed:** ~350
**Files modified:** 1 (index.html)
**Commits:** 7-8 (one per task)

**DRY improvements:**
- Consolidated glass panel styling (-20 lines)
- Consolidated tech tag delays (-8 lines)

**YAGNI removals:**
- Custom cursor system (-150 lines)
- Swipe gestures (-150 lines)
- Scroll progress indicator (-50 lines)

**KISS simplifications:**
- CSS variable reduction (-4 lines)
- will-change cleanup (-8 lines)

**Result:** Cleaner, more maintainable codebase with identical visual and functional output.
