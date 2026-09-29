/* =========================================================
   ÁNGELA & FERNANDO — WEDDING WEBSITE
   Configuración editable + lógica del sitio
   ========================================================= */

/* ---------------------------------------------------------
   1) CONFIGURACIÓN — edita aquí todos los datos de la boda
   --------------------------------------------------------- */
const weddingConfig = {
  couple: "Ángela & Fernando",

  // Fecha y hora de la ceremonia (usada por el countdown). +02:00 = horario de verano en España
  date: "2027-06-26T12:30:00+02:00",
  dateDisplay: "26 de junio de 2027",   // texto mostrado en el hero y en "El gran día"
  dateShortDisplay: "26.06.2027",       // texto mostrado en el cierre

  ceremony: {
    time: "12:30 h",
    place: "Catedral de Santa María la Redonda<br>Logroño",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Concatedral+de+Santa+Mar%C3%ADa+la+Redonda+Logro%C3%B1o"
  },

  celebration: {
    time: "Tras la ceremonia",
    place: "Restaurante La Merced<br>Logroño",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Restaurante+La+Merced+Logro%C3%B1o"
  },

  // Número de cuenta para regalos. Mientras esté vacío se muestra un aviso
  // ("Muy pronto compartiremos aquí los datos"). Cuando Fernando cree la cuenta, pégala aquí.
  giftAccount: ""
};

/* ---------------------------------------------------------
   2) INYECCIÓN DE DATOS DE CONFIGURACIÓN EN EL HTML
   --------------------------------------------------------- */
function applyConfig() {
  const heroDate = document.getElementById("heroDate");
  if (heroDate) heroDate.textContent = weddingConfig.dateDisplay;

  const weddingDate = document.getElementById("weddingDate");
  if (weddingDate) weddingDate.textContent = weddingConfig.dateDisplay;

  const closingDate = document.getElementById("closingDate");
  if (closingDate) closingDate.textContent = weddingConfig.dateShortDisplay;

  const ceremonyTime = document.getElementById("ceremonyTime");
  if (ceremonyTime) ceremonyTime.textContent = weddingConfig.ceremony.time;
  const ceremonyPlace = document.getElementById("ceremonyPlace");
  if (ceremonyPlace) ceremonyPlace.innerHTML = weddingConfig.ceremony.place;
  const ceremonyMapBtn = document.getElementById("ceremonyMapBtn");
  if (ceremonyMapBtn) ceremonyMapBtn.href = weddingConfig.ceremony.mapsUrl;

  const celebrationTime = document.getElementById("celebrationTime");
  if (celebrationTime) celebrationTime.textContent = weddingConfig.celebration.time;
  const celebrationPlace = document.getElementById("celebrationPlace");
  if (celebrationPlace) celebrationPlace.innerHTML = weddingConfig.celebration.place;
  const celebrationMapBtn = document.getElementById("celebrationMapBtn");
  if (celebrationMapBtn) celebrationMapBtn.href = weddingConfig.celebration.mapsUrl;

  const giftAccount = document.querySelector('[data-config="giftAccount"]');
  if (giftAccount) {
    if (weddingConfig.giftAccount) {
      giftAccount.textContent = weddingConfig.giftAccount;
    } else {
      giftAccount.textContent = "Muy pronto compartiremos aquí los datos.";
      giftAccount.classList.add("is-pending");
    }
  }
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
   5) CARRUSEL DE NUESTRA HISTORIA
   --------------------------------------------------------- */
function initCarousel() {
  const root = document.getElementById("storyCarousel");
  if (!root) return;
  const track = root.querySelector(".carousel__track");
  const slides = Array.from(track.children);
  const prev = document.getElementById("storyPrev");
  const next = document.getElementById("storyNext");
  const dotsBox = document.getElementById("storyDots");
  let index = 0;

  const dots = slides.map((_, i) => {
    const d = document.createElement("button");
    d.type = "button";
    d.className = "carousel__dot";
    d.setAttribute("aria-label", "Ir al capítulo " + (i + 1));
    d.addEventListener("click", () => go(i));
    dotsBox.appendChild(d);
    return d;
  });

  function go(i) {
    index = Math.max(0, Math.min(slides.length - 1, i));
    track.style.transform = "translateX(" + (-index * 100) + "%)";
    dots.forEach((d, k) => d.classList.toggle("is-active", k === index));
    slides.forEach((s, k) => s.setAttribute("aria-hidden", String(k !== index)));
    prev.disabled = index === 0;
    next.disabled = index === slides.length - 1;
  }

  prev.addEventListener("click", () => go(index - 1));
  next.addEventListener("click", () => go(index + 1));
  root.setAttribute("tabindex", "0");
  root.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") go(index - 1);
    if (e.key === "ArrowRight") go(index + 1);
  });

  // Deslizar con el dedo en móvil
  let startX = null;
  root.addEventListener("touchstart", (e) => { startX = e.touches[0].clientX; }, { passive: true });
  root.addEventListener("touchend", (e) => {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) go(index + (dx < 0 ? 1 : -1));
    startX = null;
  });

  go(0);
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
   7) RSVP — las confirmaciones llegan por email a
      angela.ruizdepalacios@gmail.com mediante FormSubmit (formsubmit.co)

      ACTIVACIÓN (solo la primera vez):
      1. Publica la web en un hosting (no funciona abriendo el archivo en local).
      2. Envía un formulario de prueba desde la web.
      3. FormSubmit mandará un email de activación a Ángela: hay que pulsar el enlace de confirmación.
      4. A partir de ahí, cada confirmación llegará a su bandeja de entrada.
   --------------------------------------------------------- */
function initRsvp() {
  const form = document.getElementById("rsvpForm");
  const status = document.getElementById("rsvpStatus");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    status.textContent = "Enviando...";

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" }
      });

      if (response.ok) {
        status.textContent = "¡Gracias! Hemos recibido tu confirmación.";
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
  initCarousel();
  initCountdown();
  initRsvp();
});
