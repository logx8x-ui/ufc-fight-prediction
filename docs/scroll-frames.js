(() => {
  const section = document.querySelector("[data-cinematic-scroll]");
  if (!section) return;

  const frameOne = section.querySelector("[data-frame-one]");
  const frameTwo = section.querySelector("[data-frame-two]");
  const heroCopy = section.querySelector("[data-hero-copy]");
  const panel = section.querySelector("[data-scroll-panel]");
  const panelKicker = section.querySelector("[data-panel-kicker]");
  const panelTitle = section.querySelector("[data-panel-title]");
  const panelBody = section.querySelector("[data-panel-body]");
  const meter = section.querySelector("[data-scroll-meter]");

  const copy = [
    {
      kicker: "Frame 1",
      title: "Fights are messy.",
      body: "Grappling, cage control, pressure, timing, and skill can overpower simple body measurements."
    },
    {
      kicker: "Frame 2",
      title: "Reach can matter.",
      body: "A longer reach can create a striking window, but the model still predicts only slightly above chance."
    }
  ];

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);
  const smoothstep = (edge0, edge1, value) => {
    const x = clamp((value - edge0) / (edge1 - edge0), 0, 1);
    return x * x * (3 - 2 * x);
  };

  let activeCopy = -1;

  function setCopy(index) {
    if (index === activeCopy) return;
    activeCopy = index;
    panelKicker.textContent = copy[index].kicker;
    panelTitle.textContent = copy[index].title;
    panelBody.textContent = copy[index].body;
  }

  function update() {
    if (window.matchMedia("(max-width: 900px)").matches) {
      frameOne.style.opacity = "1";
      frameTwo.style.opacity = "0";
      frameOne.style.transform = "none";
      frameTwo.style.transform = "none";
      frameOne.style.filter = "";
      frameTwo.style.filter = "";
      heroCopy.style.opacity = "1";
      heroCopy.style.transform = "none";
      panel.style.opacity = "1";
      panel.style.transform = "none";
      meter.style.transform = "scaleX(0)";
      setCopy(0);
      return;
    }

    const rect = section.getBoundingClientRect();
    const scrollable = rect.height - window.innerHeight;
    const progress = scrollable <= 0 ? 0 : clamp(-rect.top / scrollable, 0, 1);
    const swap = smoothstep(0.42, 0.62, progress);
    const heroFade = smoothstep(0.12, 0.36, progress);
    const panelIn = smoothstep(0.2, 0.38, progress);
    const deckYaw = -10 + 20 * progress;
    const deckPitch = 4 - 8 * progress;
    const deckLift = -7 * progress;

    frameOne.style.opacity = String(1 - swap);
    frameTwo.style.opacity = String(swap);

    section.querySelector(".frame-deck").style.transform = `translateY(${deckLift}vh) rotateX(${deckPitch}deg) rotateY(${deckYaw}deg)`;

    frameOne.style.transform = `translate(${-18 * progress}vw, ${-6 * progress}vh) rotateX(${5 * progress}deg) rotateY(${-30 * progress}deg) scale(${1.12 - 0.08 * progress})`;
    frameTwo.style.transform = `translate(${22 * (1 - swap)}vw, ${-5 * (1 - swap)}vh) rotateX(${-8 + 8 * swap}deg) rotateY(${34 - 34 * swap}deg) scale(${1.2 - 0.08 * swap})`;
    frameOne.style.filter = "saturate(1.06) contrast(1.08)";
    frameTwo.style.filter = "saturate(1.08) contrast(1.1)";

    heroCopy.style.opacity = String(1 - heroFade);
    heroCopy.style.transform = `translateY(${-26 * heroFade}px) scale(${1 - 0.035 * heroFade})`;

    panel.style.opacity = String(panelIn);
    panel.style.transform = `translateY(${34 * (1 - panelIn)}px)`;

    meter.style.transform = `scaleX(${progress})`;
    setCopy(progress < 0.56 ? 0 : 1);
  }

  update();
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
})();
