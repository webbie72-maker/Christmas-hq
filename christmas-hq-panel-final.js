(() => {
  const STYLE_ID = "christmas-hq-panel-final-style";

  if (!document.getElementById(STYLE_ID)) {
    const style = document.createElement("style");
    style.id = STYLE_ID;

    style.textContent = `
      /* CHRISTMAS HQ — RESTORED PICTURE PANELS */

      .mast {
        position: relative !important;
        overflow: hidden !important;
        min-height: 250px !important;

        padding:
          calc(env(safe-area-inset-top) + 12px)
          18px
          28px !important;

        border-radius: 0 0 34px 34px !important;

        background-size: cover !important;
        background-position: center !important;
        background-repeat: no-repeat !important;

        color: white !important;

        box-shadow:
          0 12px 30px rgba(16, 59, 49, .24) !important;
      }

      /* Dark fade so the words stay readable */

      .mast::before {
        content: "" !important;
        position: absolute !important;
        inset: 0 !important;

        background:
          linear-gradient(
            180deg,
            rgba(4, 28, 20, .18) 0%,
            rgba(4, 28, 20, .28) 45%,
            rgba(4, 28, 20, .78) 100%
          ) !important;

        pointer-events: none !important;
        z-index: 0 !important;
      }

      /* Snow across the picture */

      .mast::after {
        content: "❄   ·   ❅   ·   ❄   ·   ✦   ·   ❅   ·   ❄" !important;

        position: absolute !important;
        left: -10px !important;
        right: -10px !important;
        top: 88px !important;

        text-align
