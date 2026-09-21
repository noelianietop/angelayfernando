# Ángela & Fernando — Web de boda

Web estática (HTML + CSS + JS vanilla), lista para GitHub Pages.

## Publicar en GitHub Pages
1. Crea un repositorio nuevo en GitHub y sube estos archivos tal cual (manteniendo la estructura de carpetas).
2. Ve a **Settings → Pages**, elige la rama `main` y la carpeta `/ (root)`.
3. En unos minutos tu web estará disponible en `https://tu-usuario.github.io/tu-repo/`.

También puedes probarla en local abriendo directamente `index.html` en el navegador.

## Qué editar
Todo lo editable está centralizado al principio de `script.js`, en el objeto `weddingConfig`:
- Nombres, fecha y hora de la boda (`date`, `dateDisplay`, `dateShortDisplay`).
- Lugar y hora de la ceremonia y la celebración, y sus enlaces de Google Maps (`mapsUrl`).
- Número de cuenta para regalos (opcional).
- Array `gallery`: añade, quita o sustituye fotos cambiando `src`. El campo `size` controla el tamaño en el mosaico (`tall`, `wide`, `square`, `small`, `med`).

## Fotografías
Actualmente se usan imágenes de [Picsum](https://picsum.photos) como placeholder (con un filtro cálido en CSS para que combinen con la paleta). Sustitúyelas por fotos reales:
- Hero: `.hero__image` en `style.css` (`background-image`).
- Historia y cierre: `<img>` en `index.html` y `background-image` en `.closing::before`.
- Galería: array `gallery` en `script.js`.

Para mejor rendimiento, sube las fotos reales a `assets/images/` y usa rutas relativas (`assets/images/tu-foto.jpg`) en lugar de las URLs de Picsum.

## Formulario RSVP
El formulario está preparado pero no conectado a ningún backend:
- **Formspree**: crea un formulario en [formspree.io](https://formspree.io), copia tu endpoint y sustituye `https://formspree.io/f/TU_ID_DE_FORMSPREE` en el atributo `action` del `<form id="rsvpForm">` en `index.html`.
- **Google Forms**: crea el formulario en Google Forms y cambia el `action` por la URL de envío del formulario, ajustando los atributos `name` de cada campo a los `entry.XXXXXXX` correspondientes (puedes verlos inspeccionando el HTML del formulario de Google).

Hasta que conectes un servicio, el botón de envío mostrará un aviso en vez de enviar datos.
