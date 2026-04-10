# CLAUDE.md — KATANA PROJECT CONTEXT  
  
---  
  
## # Project Overview  
  
**KATANA FLOW** is not a website.  
  
It is a **high-fidelity cinematic system disguised as a scroll experience**, built to simulate the presence of a Japanese katana through motion, light, and spatial coherence.  
  
The experience is not animation-driven. It is **state-driven by scroll**, where each frame represents a precise moment within a continuous, uninterrupted motion field.  
  
The katana must feel as if it exists in a controlled physical environment governed by invisible forces: inertia, resistance, tension, and intention.  
  
The objective is to construct a **luxury-grade visual narrative** that communicates:  
precision, discipline, control, silence, mastery, and inevitability.  
  
Every visual decision must reinforce the perception that nothing is random.  
  
---  
  
## # Stack  
  
* Next.js 14 (App Router, TypeScript) — deterministic rendering, no runtime ambiguity  
* Tailwind CSS — strict utility control, no visual drift  
* HTML5 Canvas API — direct pixel-level authority over rendering  
* No Three.js — avoid abstraction layers that reduce control  
* No GSAP — eliminate timeline-based artificial motion  
* Frame-by-frame animation (video → extracted frames) — absolute control over motion fidelity  
* Deploy target: Vercel — optimized global delivery with minimal latency  
  
---  
  
## # Core Principle  
  
The katana is not an object.  
  
It is the **origin point of a reactive system**.  
  
All elements — camera, light, environment — must behave as dependent variables responding to the katana’s presence and movement.  
  
Nothing leads. The katana defines everything.  
  
---  
  
## # Brand Identity  
  
| Key         | Value                                                                                  |  
| ----------- | -------------------------------------------------------------------------------------- |  
| Name        | Katana Flow                                                                            |  
| Tagline     | Precision in Motion.                                                                   |  
| Sub-tagline | Control without effort.                                                                |  
| Aesthetic   | Apple-grade reductionism + AAA cinematic object staging with surgical visual control   |  
| Feel        | Disciplined, controlled, fluid, silent, spiritual, inevitable, surgically precise      |  
  
---  
  
## # Motion Philosophy (CRITICAL)  
  
The katana must NEVER feel:  
  
* mechanical  
* linear  
* rigid  
* weightless  
  
Instead, all motion must:  
  
* follow continuous curved trajectories with no angular discontinuities  
* express inertia through delayed response and momentum carry  
* use high-quality easing curves (cubic or custom) with zero perceptible snapping  
* feel like a single uninterrupted flow, not a sequence of states  
  
Motion must feel **inevitable**, not triggered.  
  
---  
  
## # Color System  
  
--bg-deep: #050505;        /* absolute void baseline, absorbs attention */  
--bg-soft: #0A0A0A;        /* atmospheric depth layer, prevents flatness */  
--steel-dark: #1C1C1C;     /* compressed shadow regions of the blade */  
--steel-light: #D9D9D9;    /* controlled highlight zones, never blown out */  
--accent-reflection: #F5F5F5; /* sharp specular energy, used sparingly */  
--subtle-glow: rgba(255,255,255,0.06); /* ambient lift without visual noise */  
  
---  
  
## # Typography System  
  
### Fonts  
  
* Headings: Cormorant Garamond — elegance, heritage, controlled expression  
* Body: Inter — clarity, neutrality, zero distraction  
  
---  
  
### Scale  
  
| Role    | Size | Weight | Notes                                             |  
| ------- | ---- | ------ | ------------------------------------------------- |  
| Display | 96px | 300    | Hero presence, must feel cinematic and restrained |  
| H1      | 64px | 300    | Structural anchors, never aggressive              |  
| H2      | 40px | 400    | Secondary hierarchy, supportive only              |  
| Body    | 16px | 300    | Clean, quiet readability                          |  
| Caption | 12px | 400    | Uppercase, precise, informational                 |  
  
---  
  
## # Scroll Animation Architecture  
  
### Source  
  
* Video file: `katana-animation.mp4`  
  
* Extract frames:  
  ffmpeg -i katana-animation.mp4 -vf fps=30 public/frames/frame_%04d.webp  
  
* Output: `.webp` sequence optimized for balance between compression and visual fidelity  
  
---  
  
### Canvas Setup  
  
* Full viewport — no margins, no visual leakage  
* position: sticky — ensures continuous anchoring  
* background: #050505 — absolute visual grounding  
* total scroll height: 500vh — enough range to stretch perception of time  
* animation driven by scroll progress (0 → 1) mapped deterministically to frames  
  
---  
  
### Rendering Logic  
  
* Frame index = scrollProgress * totalFrames  
* Use requestAnimationFrame ONLY — sync with browser paint cycle  
* No setInterval — avoids temporal drift and jitter  
  
---  
  
## # Motion Behavior  
  
### Fundamental Rules  
  
* No linear movement — ever  
* Every transition must be eased and perceptually smooth  
* Acceleration and deceleration must be present but subtle  
* Slight orbital displacement ALWAYS present to avoid static perception  
* Rotation must feel like the result of force, not a programmed value  
  
---  
  
### Light Behavior  
  
* Reflections MUST travel across the blade surface continuously  
* Highlights must never freeze or flicker  
* Light intensity must react to orientation and implied angle  
* Specular movement must communicate curvature, sharpness, and material quality  
  
Light is not decoration. It is **information about form**.  
  
---  
  
### Camera Behavior  
  
* Never static — stillness must still contain micro-life  
* Micro-adjustments only — never noticeable as independent motion  
* Slight parallax always present to reinforce depth  
* Camera must feel magnetically linked to the katana  
  
---  
  
## # 3-Act Scroll Story  
  
| Act | Scroll % | Description                                                                                   |  
| --- | -------- | --------------------------------------------------------------------------------------------- |  
| 1   | 0–30%    | Katana emerges from darkness with controlled reveal, rotation begins with restrained inertia |  
| 2   | 30–70%   | System reaches full activation, orbital motion stabilizes, reflections intensify and flow    |  
| 3   | 70–100%  | Motion decelerates with authority, katana settles into perfect controlled stillness          |  
  
---  
  
## # Interaction Layer  
  
* Scroll controls primary motion — no secondary override  
* Micro parallax between layers — must be barely perceptible but always present  
* Optional cursor tracking — extremely subtle, must never compete with scroll  
  
---  
  
## # Text Overlay Specs  
  
### Section 1 (0–25%)  
  
Position: bottom-left  
  
Headline:  
"Precision in motion."  
  
Subtext:  
"Every movement follows intention."  
  
---  
  
### Section 2 (30–60%)  
  
Position: top-right  
  
Headline:  
"Control without force."  
  
Subtext:  
"Nothing is accidental."  
  
---  
  
### Section 3 (70–90%)  
  
Position: center  
  
Headline:  
"Perfect stillness."  
  
Subtext:  
"Total mastery."  
  
---  
  
## # Navbar  
  
* Fixed — persistent but non-intrusive  
* Transparent initially — must not compete with first impression  
* Fades in after scroll > 100px — smooth opacity transition only  
  
Left: KATANA FLOW  
Right: minimal links — no visual clutter, no distraction  
  
---  
  
## # Loading Screen  
  
* Background: black — absolute  
* Center text: KATANA FLOW — calm, no animation noise  
* Progress bar thin — precise, controlled  
* Fade out after frames load — no abrupt transitions  
  
---  
  
## # Micro Details  
  
### Grain Overlay  
  
* Very subtle noise — must be felt, not seen  
* opacity: 0.03  
* fixed layer — consistent across viewport  
  
---  
  
### Cursor  
  
* Small dot — minimal presence  
* soft outer ring — diffused, elegant  
* slight delay — creates softness and continuity  
  
---  
  
## # Performance Rules  
  
* Preload ALL frames — no runtime loading interruptions  
* requestAnimationFrame only — perfect sync  
* Use webp — optimized compression  
* Cache aggressively — eliminate repeated fetch cost  
* Mobile: reduce frames by 50% — maintain perception, reduce load  
  
---  
  
## # SEO  
  
title: Katana Flow — Precision in Motion  
description: A cinematic scroll experience centered on control, motion, stillness, and mastery.  
  
---  
  
## # File Structure  
  
/public/frames/  
/app/page.tsx  
/components/ScrollCanvas.tsx  
/components/TextOverlay.tsx  
/hooks/useScrollProgress.ts  
/katana-animation.mp4  
  
---  
  
## # Core Rule (NON-NEGOTIABLE)  
  
If the motion ever feels:  
  
* linear  
* robotic  
* abrupt  
  
It is WRONG.  
  
Everything must feel:  
  
controlled, continuous, intentional.