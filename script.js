/* =========================================================
   ÁNGELA & FERNANDO — WEDDING WEBSITE
   Configuración editable + lógica del sitio
   ========================================================= */

/* ---------------------------------------------------------
   1) CONFIGURACIÓN — edita aquí todos los datos de la boda
   --------------------------------------------------------- */
const weddingConfig = {
  couple: "Ángela & Fernando",

  // Fecha y hora de la boda en formato ISO (usada por el countdown)
  date: "2027-06-12T17:00:00",
  dateDisplay: "12 de junio de 2027",   // texto mostrado en el hero
  dateShortDisplay: "12 · 06 · 2027",   // texto mostrado en el cierre

  ceremony: {
    time: "17:00h",
    place: "Ermita de Santa María, Toledo",
    // Pega aquí el enlace "Compartir > Copiar enlace" de Google Maps
    mapsUrl: "https://maps.google.com/?q=Ermita+de+Santa+Maria+Toledo"
  },

  celebration: {
    time: "19:30h",
    place: "Finca Los Almendros, Toledo",
    mapsUrl: "https://maps.google.com/?q=Finca+Los+Almendros+Toledo"
  },

  // Número de cuenta opcional para regalos (déjalo vacío para ocultar la sección de texto)
  giftAccount: "ES00 0000 0000 0000 0000 0000",

  // Galería: añade o quita objetos para cambiar las fotos.
  // "size" controla cómo de grande se ve cada foto en el mosaico:
  // "tall" | "wide" | "square" | "small" | "med"
  gallery: [
    { src: "https://picsum.photos/seed/boda-g1/900/1200", alt: "Detalle de la ceremonia", size: "tall" },
    { src: "https://picsum.photos/seed/boda-g2/1200/800", alt: "Mesa de celebración", size: "wide" },
    { src: "https://picsum.photos/seed/boda-g3/900/900", alt: "Ramo de novia", size: "square" },
    { src: "https://picsum.photos/seed/boda-g4/1200/700", alt: "Detalle de papelería", size: "small" },
    { src: "https://picsum.photos/seed/boda-g5/900/1200", alt: "Vestido de novia", size: "tall" },
    { src: "https://picsum.photos/seed/boda-g6/900/900", alt: "Anillos de boda", size: "square" },
    { src: "https://picsum.photos/seed/boda-g7/1200/800", alt: "Arquitectura del enlace", size: "wide" },
    { src: "https://picsum.photos/seed/boda-g8/1200/700", alt: "Velas y flores", size: "small" },
    { src: "https://picsum.photos/seed/boda-g9/900/1200", alt: "Momento espontáneo", size: "med" },
    { src: "https://picsum.photos/seed/boda-g10/900/900", alt: "Flores naturales", size: "square" }
  ]
};

/* ---------------------------------------------------------
   2) INYECCIÓN DE DATOS DE CONFIGURACIÓN EN EL HTML
   --------------------------------------------------------- */
function applyConfig() {
  const heroDate = document.getElementById("heroDate");
  if (heroDate) heroDate.textContent = weddingConfig.dateDisplay;

  const closingDate = document.getElementById("closingDate");
  if (closingDate) closingDate.textContent = weddingConfig.dateShortDisplay;

  const ceremonyTime = document.getElementById("ceremonyTime");
  if (ceremonyTime) ceremonyTime.textContent = weddingConfig.ceremony.time;
  const ceremonyPlace = document.getElementById("ceremonyPlace");
  if (ceremonyPlace) ceremonyPlace.textContent = weddingConfig.ceremony.place;
  const ceremonyMapBtn = document.getElementById("ceremonyMapBtn");
  if (ceremonyMapBtn) ceremonyMapBtn.href = weddingConfig.ceremony.mapsUrl;

  const celebrationTime = document.getElementById("celebrationTime");
  if (celebrationTime) celebrationTime.textContent = weddingConfig.celebration.time;
  const celebrationPlace = document.getElementById("celebrationPlace");
  if (celebrationPlace) celebrationPlace.textContent = weddingConfig.celebration.place;
  const celebrationMapBtn = document.getElementById("celebrationMapBtn");
  if (celebrationMapBtn) celebrationMapBtn.href = weddingConfig.celebration.mapsUrl;

  const giftAccount = document.querySelector('[data-config="giftAccount"]');
  if (giftAccount) giftAccount.textContent = weddingConfig.giftAccount;
}

/* ---------------------------------------------------------
   3) NAVEGACIÓN — header al hacer scroll + menú móvil
   --------------------------------------------------------- */
function initNav() {
  const header = document.getElementById("siteHeader");
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");

  const onScroll = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 60);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  toggle.addEventListener("click", () => {
    const isOpen = links.classList.toggle("is-open");
    toggle.classList.toggle("is-open", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  links.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      links.classList.remove("is-open");
      toggle.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

/* ---------------------------------------------------------
   4) COUNTDOWN
   --------------------------------------------------------- */
function initCountdown() {
  const target = new Date(weddingConfig.date).getTime();
  const els = {
    days: document.getElementById("cdDays"),
    hours: document.getElementById("cdHours"),
    minutes: document.getElementById("cdMinutes"),
    seconds: document.getElementById("cdSeconds")
  };
  if (!els.days) return;

  function pad(n) { return String(n).padStart(2, "0"); }

  function tick() {
    const diff = target - Date.now();
    if (diff <= 0) {
      els.days.textContent = "00";
      els.hours.textContent = "00";
      els.minutes.textContent = "00";
      els.seconds.textContent = "00";
      return;
    }
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);

    els.days.textContent = pad(days);
    els.hours.textContent = pad(hours);
    els.minutes.textContent = pad(minutes);
    els.seconds.textContent = pad(seconds);
  }

  tick();
  setInterval(tick, 1000);
}

/* ---------------------------------------------------------
   5) GALERÍA — renderizada a partir de weddingConfig.gallery
   --------------------------------------------------------- */
function initGallery() {
  const grid = document.getElementById("galleryGrid");
  if (!grid) return;

  const sizeClass = {
    tall: "span-tall",
    wide: "span-wide",
    square: "span-square",
    small: "span-small",
    med: "span-med"
  };

  weddingConfig.gallery.forEach((photo) => {
    const figure = document.createElement("figure");
    figure.className = `gallery__item ${sizeClass[photo.size] || "span-square"}`;

    const img = document.createElement("img");
    img.src = photo.src;
    img.alt = photo.alt || "";
    img.loading = "lazy";

    figure.appendChild(img);
    figure.setAttribute("data-reveal", "");
    grid.appendChild(figure);
  });

  // Los elementos de galería se crean dinámicamente, así que se observan aparte
  observeReveal(grid.querySelectorAll("[data-reveal]"));
}

/* ---------------------------------------------------------
   6) SCROLL REVEAL — fade-in sutil al entrar en viewport
   --------------------------------------------------------- */
let revealObserver;

function observeReveal(nodeList) {
  if (!revealObserver) return;
  nodeList.forEach((el) => revealObserver.observe(el));
}

function initReveal() {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReduced) {
    document.querySelectorAll("[data-reveal]").forEach((el) => el.classList.add("is-visible"));
    return;
  }

  revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          setTimeout(() => el.classList.add("is-visible"), i * 60);
          revealObserver.unobserve(el);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
  );

  observeReveal(document.querySelectorAll("[data-reveal]"));
}

/* ---------------------------------------------------------
   7) RSVP — envío preparado para Formspree / Google Forms
   --------------------------------------------------------- */
function initRsvp() {
  const form = document.getElementById("rsvpForm");
  const status = document.getElementById("rsvpStatus");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    // Si el "action" del formulario sigue siendo el valor de ejemplo,
    // no hay backend conectado todavía: mostramos un aviso en vez de enviar.
    if (form.action.includes("TU_ID_DE_FORMSPREE")) {
      e.preventDefault();
      status.textContent =
        "Formulario listo para conectar: sustituye la URL de Formspree (o Google Forms) en index.html.";
      return;
    }

    e.preventDefault();
    status.textContent = "Enviando...";

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      });

      if (response.ok) {
        status.textContent = "¡Gracias! Hemos recibido vuestra confirmación.";
        form.reset();
      } else {
        status.textContent = "Ha ocurrido un error. Inténtalo de nuevo en unos minutos.";
      }
    } catch (err) {
      status.textContent = "Ha ocurrido un error de conexión. Inténtalo de nuevo.";
    }
  });
}

/* ---------------------------------------------------------
   INIT
   --------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  applyConfig();
  initNav();
  initReveal();
  initCountdown();
  initGallery();
  initRsvp();
});
