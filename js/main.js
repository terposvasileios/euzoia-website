(() => {
  "use strict";

  const section = document.querySelector("[data-film]");
  const video = section?.querySelector(".film-video");
  const motionMessage = section?.querySelector(".motion-message");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const mobileLayout = window.matchMedia("(max-width: 767px), (orientation: portrait)");
  let isNearViewport = false;
  let selectedSource = "";

  const unloadVideo = () => {
    if (!video) return;
    video.pause();
    video.removeAttribute("src");
    video.load();
    video.classList.remove("is-ready");
    selectedSource = "";
  };

  const loadVideo = () => {
    if (!video || !isNearViewport || reducedMotion.matches) return;

    const nextSource = mobileLayout.matches ? video.dataset.mobile : video.dataset.desktop;
    if (!nextSource || selectedSource === nextSource) return;

    selectedSource = nextSource;
    video.classList.remove("is-ready");
    video.src = nextSource;
    video.load();
    video.play().catch(() => {});
  };

  const applyMotionPreference = () => {
    if (reducedMotion.matches) {
      unloadVideo();
      motionMessage?.removeAttribute("hidden");
      return;
    }

    motionMessage?.setAttribute("hidden", "");
    loadVideo();
  };

  video?.addEventListener("loadeddata", () => {
    video.classList.add("is-ready");
  });

  if ("IntersectionObserver" in window && section) {
    const observer = new IntersectionObserver(
      ([entry]) => {
        isNearViewport = entry.isIntersecting;
        if (isNearViewport) loadVideo();
      },
      { rootMargin: "50% 0px", threshold: 0 }
    );
    observer.observe(section);
  } else {
    isNearViewport = true;
    loadVideo();
  }

  mobileLayout.addEventListener("change", () => {
    selectedSource = "";
    loadVideo();
  });
  reducedMotion.addEventListener("change", applyMotionPreference);
  applyMotionPreference();
})();
