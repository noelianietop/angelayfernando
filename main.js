/* ==========================================================
   Boda Ángela & Fernando — comportamiento de la página
   Los datos (fecha, lugares, mesas, formulario) están en config.js
   ========================================================== */
(() => {
  "use strict";

  const C = window.BODA || {};
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  /* ---------- 1. Datos de config.js -> texto de la página ---------- */
  const fecha = new Date(C.fecha);
  const fechaValida = !Number.isNaN(fecha.getTime());
  const fmt = (opts) => new Intl.DateTimeFormat("es-ES", opts).format(fecha);

  const textos = {
    fechaLarga: fechaValida ? fmt({ weekday: "long", day: "numeric", month: "long", year: "numeric" }) : "Próximamente",
    hora: fechaValida ? fmt({ hour: "2-digit", minute: "2-digit" }) : "",
    fechaLimite: C.fechaLimite || "",
    hashtag: C.hashtag || "",
    ceremoniaNombre: C.ceremonia && C.ceremonia.nombre,
    ceremoniaDireccion: C.ceremonia && C.ceremonia.direccion,
    celebracionNombre: C.celebracion && C.celebracion.nombre,
    celebracionDireccion: C.celebracion && C.celebracion.direccion
  };

  $$("[data-bind]").forEach((el) => {
    const valor = textos[el.dataset.bind];
    if (valor) el.textContent = valor;
    else if (el.dataset.bind === "hashtag") el.hidden = true;
  });

  // Botones "Cómo llegar" -> Google Maps con la dirección
  $$("[data-mapa]").forEach((a) => {
    const lugar = C[a.dataset.mapa];
    if (lugar && lugar.direccion) {
      const consulta = [lugar.nombre, lugar.direccion].filter(Boolean).join(", ");
      a.href = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(consulta);
    } else {
      a.hidden = true;
    }
  });

  /* ---------- 2. Cabecera: fondo al hacer scroll + menú móvil + sección activa ---------- */
  const cabecera = $("#cabecera");
  const alScroll = () => cabecera.classList.toggle("header--solido", window.scrollY > 40);
  alScroll();
  window.addEventListener("scroll", alScroll, { passive: true });

  const toggle = $(".nav__toggle");
  const menu = $("#menu");
  const cerrarMenu = () => {
    menu.classList.remove("nav--abierto");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Abrir menú");
  };
  toggle.addEventListener("click", () => {
    const abierto = menu.classList.toggle("nav--abierto");
    toggle.setAttribute("aria-expanded", String(abierto));
    toggle.setAttribute("aria-label", abierto ? "Cerrar menú" : "Abrir menú");
  });
  $$("a", menu).forEach((a) => a.addEventListener("click", cerrarMenu));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") cerrarMenu(); });

  // Ocultar "Tu mesa" si está desactivada en config.js
  if (C.mostrarMesas === false) {
    const seccion = $("#mesas");
    if (seccion) seccion.remove();
    const enlace = $('.nav a[href="#mesas"]');
    if (enlace) enlace.parentElement.remove();
  }

  if ("IntersectionObserver" in window) {
    const enlaces = $$(".nav a");
    const espia = new IntersectionObserver((entradas) => {
      entradas.forEach((e) => {
        if (!e.isIntersecting) return;
        enlaces.forEach((a) => a.setAttribute("aria-current", String(a.getAttribute("href") === "#" + e.target.id)));
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    enlaces.map((a) => $(a.getAttribute("href"))).filter(Boolean).forEach((s) => espia.observe(s));
  }

  /* ---------- 3. Fotos: se aplican solo si el archivo existe en /img ---------- */
  $$("[data-foto]").forEach((el) => {
    const src = el.dataset.foto;
    const img = new Image();
    img.onload = () => {
      el.style.backgroundImage = 'url("' + src + '")';
      el.classList.add("tiene-foto");
    };
    img.src = src;
  });

  /* ---------- 4. Cuenta atrás ---------- */
  const cuenta = $("[data-countdown]");
  if (cuenta) {
    if (!fechaValida) {
      cuenta.hidden = true;
    } else {
      let temporizador;
      const poner = (clave, valor) => {
        const el = $('[data-cd="' + clave + '"]', cuenta);
        if (el) el.textContent = String(valor).padStart(2, "0");
      };
      const tic = () => {
        const resto = fecha - new Date();
        if (resto <= 0) {
          cuenta.innerHTML = '<p class="countdown__fin">' +
            (resto > -86400000 ? "¡Hoy es el gran día!" : "Gracias por celebrarlo con nosotros") + "</p>";
          clearInterval(temporizador);
          return;
        }
        poner("dias", Math.floor(resto / 86400000));
        poner("horas", Math.floor(resto / 3600000) % 24);
        poner("minutos", Math.floor(resto / 60000) % 60);
        poner("segundos", Math.floor(resto / 1000) % 60);
      };
      tic();
      temporizador = setInterval(tic, 1000);
    }
  }

  /* ---------- 5. Añadir al calendario (.ics) ---------- */
  const botonCalendario = $("[data-calendario]");
  if (botonCalendario) {
    if (!fechaValida) botonCalendario.hidden = true;
    botonCalendario.addEventListener("click", () => {
      const aICS = (d) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
      const esc = (s) => String(s || "").replace(/([,;\\])/g, "\\$1").replace(/\n/g, "\\n");
      const fin = new Date(fecha.getTime() + (C.duracionHoras || 8) * 3600000);
      const lugar = C.ceremonia ? [C.ceremonia.nombre, C.ceremonia.direccion].filter(Boolean).join(", ") : "";
      const ics = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//Boda Angela y Fernando//ES",
        "BEGIN:VEVENT",
        "UID:boda-" + fecha.getTime() + "@boda",
        "DTSTAMP:" + aICS(new Date()),
        "DTSTART:" + aICS(fecha),
        "DTEND:" + aICS(fin),
        "SUMMARY:" + esc("Boda de " + (C.novios || "Ángela y Fernando")),
        "LOCATION:" + esc(lugar),
        "END:VEVENT",
        "END:VCALENDAR"
      ].join("\r\n");
      const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar;charset=utf-8" }));
      const a = document.createElement("a");
      a.href = url;
      a.download = "boda-angela-y-fernando.ics";
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    });
  }

  /* ---------- 6. Encuentra tu mesa ---------- */
  const buscador = $("#buscar-mesa");
  const lista = $("#resultados-mesa");
  if (buscador && lista) {
    const normalizar = (s) => String(s).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
    const mesas = Array.isArray(C.mesas) ? C.mesas : [];

    const pintar = (q) => {
      lista.textContent = "";
      const consulta = normalizar(q);
      if (consulta.length < 2) return;

      const encontrados = [];
      mesas.forEach((mesa) => {
        (mesa.invitados || []).forEach((nombre) => {
          if (normalizar(nombre).includes(consulta)) encontrados.push({ nombre, mesa });
        });
      });

      if (!encontrados.length) {
        const li = document.createElement("li");
        li.className = "vacio";
        li.textContent = "No encontramos ese nombre. Prueba con otro apellido o escríbenos y lo revisamos.";
        lista.appendChild(li);
        return;
      }

      encontrados.slice(0, 12).forEach(({ nombre, mesa }) => {
        const li = document.createElement("li");
        const fuerte = document.createElement("strong");
        fuerte.textContent = "Mesa " + mesa.numero + (mesa.nombre ? ", " + mesa.nombre : "");
        li.appendChild(fuerte);
        li.appendChild(document.createElement("br"));
        li.appendChild(document.createTextNode(nombre));
        lista.appendChild(li);
      });
    };
    buscador.addEventListener("input", (e) => pintar(e.target.value));
  }

  /* ---------- 7. Formulario de confirmación ---------- */
  const form = $("#form-rsvp");
  if (form) {
    const estado = $("#estado-rsvp");
    const soloSi = $$("[data-solo-si]", form);

    const actualizarCampos = () => {
      const marcado = form.querySelector('input[name="asistencia"]:checked');
      const viene = !marcado || marcado.value === "si";
      soloSi.forEach((el) => { el.hidden = !viene; });
    };
    $$('input[name="asistencia"]', form).forEach((r) => r.addEventListener("change", actualizarCampos));
    actualizarCampos();

    const mostrar = (texto, tipo) => {
      estado.textContent = texto;
      estado.className = "estado" + (tipo ? " estado--" + tipo : "");
    };

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      mostrar("");

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      const datos = Object.fromEntries(new FormData(form));
      if (datos._gotcha) return; // spam

      const boton = $('button[type="submit"]', form);

      if (C.formEndpoint) {
        boton.disabled = true;
        mostrar("Enviando…");
        try {
          const r = await fetch(C.formEndpoint, {
            method: "POST",
            headers: { "Accept": "application/json", "Content-Type": "application/json" },
            body: JSON.stringify(datos)
          });
          if (!r.ok) throw new Error("HTTP " + r.status);
          form.reset();
          actualizarCampos();
          mostrar("Recibido. ¡Gracias por confirmar, nos vemos pronto!", "ok");
        } catch (err) {
          mostrar("No hemos podido enviar la confirmación. Inténtalo de nuevo en unos minutos.", "error");
        } finally {
          boton.disabled = false;
        }
      } else if (C.emailContacto) {
        const cuerpo = [
          "Nombre: " + datos.nombre,
          "Email: " + datos.email,
          "Asistencia: " + (datos.asistencia === "si" ? "Sí" : "No"),
          datos.asistencia === "si" ? "Acompañantes: " + (datos.acompanantes || 0) : "",
          datos.alergias ? "Alergias o menú especial: " + datos.alergias : "",
          datos.cancion ? "Canción: " + datos.cancion : "",
          datos.mensaje ? "Mensaje: " + datos.mensaje : ""
        ].filter(Boolean).join("\n");
        window.location.href = "mailto:" + C.emailContacto +
          "?subject=" + encodeURIComponent("Confirmación de asistencia: " + datos.nombre) +
          "&body=" + encodeURIComponent(cuerpo);
        mostrar("Se abrirá tu correo con la respuesta lista. Solo tienes que enviarlo.", "ok");
      } else {
        mostrar("El formulario aún no está conectado. Configura formEndpoint o emailContacto en js/config.js.", "error");
      }
    });
  }
})();
