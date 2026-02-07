const toggle = document.querySelector(".theme-toggle");
const storageKey = "bettaThemeManual";
const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

const getSystemTheme = () => (mediaQuery.matches ? "dark" : "light");
let manualTheme = localStorage.getItem(storageKey);

const setTheme = (mode) => {
  document.documentElement.setAttribute("data-theme", mode);
  if (toggle) {
    const nextMode = mode === "dark" ? "light" : "dark";
    const toggleText = `Switch to ${nextMode} theme`;
    toggle.setAttribute("aria-label", toggleText);
    toggle.setAttribute("title", toggleText);
  }
};

if (manualTheme !== "dark" && manualTheme !== "light") {
  manualTheme = null;
}

const resolveTheme = () => manualTheme || getSystemTheme();
setTheme(resolveTheme());

const handleSystemThemeChange = () => {
  if (!manualTheme) {
    setTheme(getSystemTheme());
  }
};

if (typeof mediaQuery.addEventListener === "function") {
  mediaQuery.addEventListener("change", handleSystemThemeChange);
} else if (typeof mediaQuery.addListener === "function") {
  mediaQuery.addListener(handleSystemThemeChange);
}

if (toggle) {
  toggle.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    manualTheme = next;
    localStorage.setItem(storageKey, next);
    setTheme(next);
  });
}

const screenshotCards = Array.from(document.querySelectorAll(".screenshot-card"));
const previousButton = document.querySelector("[data-shot-prev]");
const nextButton = document.querySelector("[data-shot-next]");
const pageLabel = document.querySelector("[data-shot-page]");
const lightbox = document.querySelector("[data-lightbox]");
const lightboxImage = document.querySelector("[data-lightbox-image]");
const lightboxClose = document.querySelector("[data-lightbox-close]");
const screenshotsPerPage = 5;

if (screenshotCards.length > 0) {
  const totalPages = Math.max(1, Math.ceil(screenshotCards.length / screenshotsPerPage));
  let currentPage = 1;
  let focusedCard = null;

  const openLightbox = (card) => {
    if (!lightbox || !lightboxImage) {
      return;
    }

    const image = card.querySelector("img");
    if (!image) {
      return;
    }

    focusedCard = card;
    lightboxImage.src = image.currentSrc || image.src;
    lightboxImage.alt = image.alt;
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
    lightboxClose?.focus();
  };

  const closeLightbox = () => {
    if (!lightbox || !lightboxImage) {
      return;
    }

    lightbox.hidden = true;
    lightboxImage.src = "";
    lightboxImage.alt = "";
    document.body.style.overflow = "";
    focusedCard?.focus();
  };

  const renderScreenshotPage = () => {
    const start = (currentPage - 1) * screenshotsPerPage;
    const end = start + screenshotsPerPage;

    screenshotCards.forEach((card, index) => {
      card.hidden = index < start || index >= end;
      card.tabIndex = card.hidden ? -1 : 0;
      card.setAttribute("role", "button");
      card.setAttribute("aria-label", `Open preview for ${card.querySelector("img")?.alt || "screenshot"}`);
    });

    if (pageLabel) {
      pageLabel.textContent = `Page ${currentPage} of ${totalPages}`;
    }

    if (previousButton) {
      previousButton.disabled = currentPage === 1;
    }

    if (nextButton) {
      nextButton.disabled = currentPage === totalPages;
    }
  };

  if (previousButton) {
    previousButton.addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage -= 1;
        renderScreenshotPage();
      }
    });
  }

  if (nextButton) {
    nextButton.addEventListener("click", () => {
      if (currentPage < totalPages) {
        currentPage += 1;
        renderScreenshotPage();
      }
    });
  }

  screenshotCards.forEach((card) => {
    card.addEventListener("click", () => {
      if (!card.hidden) {
        openLightbox(card);
      }
    });

    card.addEventListener("keydown", (event) => {
      if (card.hidden) {
        return;
      }

      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openLightbox(card);
      }
    });
  });

  lightboxClose?.addEventListener("click", closeLightbox);
  lightbox?.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && lightbox && !lightbox.hidden) {
      closeLightbox();
    }
  });

  renderScreenshotPage();
}
