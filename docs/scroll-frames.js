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
  const reactor = section.querySelector("[data-reactor]");
  const sequence = section.querySelector("[data-sequence]");
  const quoteCard = section.querySelector("[data-quote-card]");
  const deck = section.querySelector(".frame-deck");

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
      deck.style.transform = "none";
      frameOne.style.filter = "";
      frameTwo.style.filter = "";
      heroCopy.style.opacity = "1";
      heroCopy.style.transform = "none";
      panel.style.opacity = "1";
      panel.style.transform = "none";
      quoteCard.style.opacity = "0";
      quoteCard.style.transform = "none";
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
    const quoteOut = smoothstep(0.12, 0.32, progress);
    const deckLift = -3.5 * progress;

    frameOne.style.opacity = String(1 - swap);
    frameTwo.style.opacity = String(swap);

    deck.style.transform = `translate3d(0, ${deckLift}vh, 0)`;

    frameOne.style.transform = `translate3d(${-7 * progress}vw, ${-2.4 * progress}vh, 0) scale(${1.04 - 0.015 * progress})`;
    frameTwo.style.transform = `translate3d(${7 * (1 - swap)}vw, ${-2 * (1 - swap)}vh, 0) scale(${1.04 - 0.015 * swap})`;
    frameOne.style.filter = "saturate(1.02) contrast(1.04)";
    frameTwo.style.filter = "saturate(1.02) contrast(1.04)";

    heroCopy.style.opacity = String(1 - heroFade);
    heroCopy.style.transform = `translateY(${-26 * heroFade}px) scale(${1 - 0.035 * heroFade})`;

    panel.style.opacity = String(panelIn);
    panel.style.transform = `translateY(${34 * (1 - panelIn)}px)`;

    quoteCard.style.opacity = String(1 - quoteOut);
    quoteCard.style.transform = `translate3d(${28 * quoteOut}px, ${-16 * progress}px, 0) scale(${1 - 0.05 * quoteOut})`;

    meter.style.transform = `scaleX(${progress})`;
    if (reactor) reactor.textContent = `${(52.7 - progress * 4.8).toFixed(1)}%`;
    if (sequence) sequence.textContent = `SEQ ${String(progress < 0.56 ? 1 : 2).padStart(3, "0")} / 002`;
    setCopy(progress < 0.56 ? 0 : 1);
  }

  update();
  window.addEventListener("scroll", update, { passive: true });
  window.addEventListener("resize", update);
})();
