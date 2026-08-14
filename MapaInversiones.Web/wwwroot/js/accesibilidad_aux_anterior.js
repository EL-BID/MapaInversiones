
/**
 * ============================================
 * Accesibilidad: Toolbar flotante (iframe)
 * ============================================
 *
 * Este módulo agrega un botón flotante ("A") que abre un panel de accesibilidad
 * para usuarios con baja visión u otras necesidades. Todas las preferencias se
 * guardan en localStorage y se aplican dinámicamente al DOM y a mapas de Azure Maps.
 *
 * === BOTONES DEL PANEL ===
 *
 *  A- Reducir tamaño de letra:
 *      - Disminuye progresivamente la variable CSS "--a11y-font-scale"
 *      - Reduce el tamaño de todas las fuentes en la página
 *      - También reduce el zoom de Azure Maps para mantener proporción
 *
 *  A+ Aumentar tamaño de letra:
 *      - Aumenta progresivamente "--a11y-font-scale"
 *      - Agranda todas las fuentes en la página
 *      - También aumenta el zoom de Azure Maps para simular “más cerca”
 *
 *  🌙 Contraste oscuro:
 *      - Activa la clase "a11y-contrast-dark"
 *      - Pone fondo oscuro con texto claro
 *      - En Azure Maps, cambia al estilo "high_contrast_dark"
 *
 *  ☀️ Contraste claro:
 *      - Activa la clase "a11y-contrast-light"
 *      - Fondo blanco con texto negro reforzado
 *      - En Azure Maps, cambia al estilo "high_contrast_light"
 *
 *  🔤 Fuente legible:
 *      - Activa "a11y-legible"
 *      - Fuerza tipografía sans-serif clara (Arial, Roboto, etc.)
 *
 *  ↔️ Espaciado letras:
 *      - Activa "a11y-letter-spacing"
 *      - Aumenta ligeramente el tracking (espacio entre caracteres)
 *
 *  ↕️ Espaciado líneas:
 *      - Activa "a11y-line-height"
 *      - Aumenta la altura de línea para mejorar lectura
 *
 *  🔲 Resaltar foco:
 *      - Activa "a11y-focus-ring"
 *      - Añade un contorno visible a los elementos enfocados (teclado/tab)
 *
 *  ⏹️ Reducir animaciones:
 *      - Activa "a11y-reduce-motion"
 *      - Añade "prefers-reduced-motion" forzado por CSS
 *      - Si el sitio no usa animaciones/transiciones, puede no verse ningún efecto
 *
 *  🎨 Invertir colores:
 *      - Activa "a11y-invert"
 *      - Invierte colores de toda la página (útil para algunas condiciones visuales)
 *      - El iframe del toolbar NO se invierte para mantenerse visible
 *      - En Azure Maps, aplica estilo "high_contrast_dark"
 *
 *  ♻️ Restablecer:
 *      - Elimina todas las preferencias
 *      - Quita clases de accesibilidad
 *      - Restaura fuentes y zoom de mapas a sus valores iniciales
 *
 * ============================================
 */

// accesibilidad_aux.js (iframe + zoom estable + botones activos)
(function () {
    const STORAGE_KEY = "a11y-preferences";
    const IFRAME_ID = "a11y-iframe";

    const OPTIONS = {
        contrastDark: "a11y-contrast-dark",
        contrastLight: "a11y-contrast-light",
        legible: "a11y-legible",
        letterSpacing: "a11y-letter-spacing",
        lineHeight: "a11y-line-height",
        focusRing: "a11y-focus-ring",
        reduceMotion: "a11y-reduce-motion",
        invert: "a11y-invert"
    };

    // ==== helpers persistencia ====
    const loadPreferences = () => {
        try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
        catch { return {}; }
    };
    const savePreferences = (prefs) => {
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs)); } catch { }
    };

    // ==== aplicar preferencias (html + mapas + sync iframe) ====
    let iframeEl = null;
    const applyPreferences = (prefs) => {
        const html = document.documentElement;

        // limpiar clases previas
        Object.values(OPTIONS).forEach(cls => html.classList.remove(cls));

        // escala de fuente
        if (prefs.fontScale && prefs.fontScale !== 1) {
            html.style.setProperty("--a11y-font-scale", prefs.fontScale);
            html.classList.add("a11y-font-scale");
        } else {
            html.style.removeProperty("--a11y-font-scale");
            html.classList.remove("a11y-font-scale");
        }

        // toggles
        Object.entries(prefs).forEach(([key, enabled]) => {
            if (enabled && OPTIONS[key]) html.classList.add(OPTIONS[key]);
        });

        // Azure Maps (multi-mapas con zoom estable)
        if (Array.isArray(window.azureMaps)) {
            window.azureMaps.forEach(map => {
                try {
                    const cam = map.getCamera && map.getCamera();
                    const currentZoom = (cam && typeof cam.zoom === "number")
                        ? cam.zoom : 10;

                    // guardar zoom base la primera vez
                    if (typeof map.__a11yBaseZoom === "undefined") {
                        map.__a11yBaseZoom = currentZoom;
                    }

                    // aplicar estilo
                    if (prefs.contrastDark || prefs.invert) {
                        map.setStyle({ style: "high_contrast_dark" });
                    } else if (prefs.contrastLight) {
                        map.setStyle({ style: "high_contrast_light" });
                    } else {
                        map.setStyle({ style: "road" });
                    }

                    // zoom relativo a base
                    if (prefs.fontScale) {
                        const delta = (prefs.fontScale - 1) * 5; // calibración
                        map.setCamera({ zoom: map.__a11yBaseZoom + delta });
                    } else {
                        map.setCamera({ zoom: map.__a11yBaseZoom });
                    }
                } catch (e) {
                    console.warn("a11y: no se pudo ajustar un mapa Azure:", e);
                }
            });
        }


        // D3plus
        ajustarGraficosD3plus(prefs);

        // sync al iframe
        try {
            if (iframeEl && iframeEl.contentWindow) {
                iframeEl.contentWindow.postMessage({ type: "a11y-update", prefs }, "*");
            }
        } catch { }
    };

    // ==== manejar acción del iframe ====
    const handleIframeAction = (action) => {
        let prefs = loadPreferences();
        if (action === "fontScaleUp") {
            prefs.fontScale = Math.min((prefs.fontScale || 1) + 0.1, 2);
        } else if (action === "fontScaleDown") {
            prefs.fontScale = Math.max((prefs.fontScale || 1) - 0.1, 0.7);
        } else if (action === "reset") {
            prefs = {};
            // resetear zoom base de mapas
            if (Array.isArray(window.azureMaps)) {
                window.azureMaps.forEach(m => { delete m.__a11yBaseZoom; });
            }
        } else {
            prefs[action] = !prefs[action];
        }
        savePreferences(prefs);
        applyPreferences(prefs);
    };

    // ==== crear iframe UI ====
    const createIframeUI = () => {
        if (document.getElementById(IFRAME_ID)) {
            iframeEl = document.getElementById(IFRAME_ID);
            return iframeEl;
        }

        iframeEl = document.createElement("iframe");
        iframeEl.id = IFRAME_ID;
        Object.assign(iframeEl.style, {
            position: "fixed",
            bottom: "15px",
            right: "15px",
            width: "48px",
            height: "48px",
            border: "0",
            margin: "0",
            padding: "0",
            zIndex: "2147483647",
            background: "transparent"
        });

        const srcdoc = `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<style>
  :root{font-family: system-ui, -apple-system, 'Segoe UI', Roboto, Arial;}
  html,body{margin:0;padding:0;background:transparent;}
  #trigger {
    position:absolute;bottom:0;right:0;
    width:48px;height:48px;border-radius:50%;
    background:#3366cc;color:#fff;border:none;font-weight:bold;font-size:18px;
    cursor:pointer;box-shadow:0 2px 6px rgba(0,0,0,.3);
  }
    #trigger:hover {background:#236cff;}
  #panel {
    position:absolute;bottom:60px;right:0;
    width:260px;max-width:calc(100vw - 20px);
    background:#fff;color:#000;border-radius:8px;padding:8px;
    box-shadow:0 8px 24px rgba(0,0,0,.25);display:none;
    font-size:14px;max-height:70vh;overflow:auto;
  }
  .opt{display:inline-block;width:45%;margin:5px 0;padding:8px;
    border-radius:6px;border:1px solid #ddd;
    background:#f6f6f6;text-align:left;cursor:pointer;}
  .opt.active{background:#004080;color:#fff;}
  hr{border:none;border-top:1px solid #eee;margin:8px 0;}
</style>
</head>
<body>
<button id="trigger" aria-label="Accesibilidad"><img src="../img/ic-accessibility.svg" alt="icono de accesibilidad" class="img-fluid" /></button>
<div id="panel" role="dialog" aria-label="Herramientas de accesibilidad">
  <h4 style="margin:0 0 8px 0;font-size:15px;">Accesibilidad</h4>
  <button class="opt" data-action="fontScaleDown">A- Reducir</button>
  <button class="opt" data-action="fontScaleUp">A+ Aumentar</button>
  <button class="opt" data-action="contrastDark">🌙 Contraste oscuro</button>
  <button class="opt" data-action="contrastLight">☀️ Contraste claro</button>
  <button class="opt" data-action="legible">🔤 Fuente legible</button>
  <button class="opt" data-action="letterSpacing">↔️ Espaciado letras</button>
  <button class="opt" data-action="lineHeight">↕️ Espaciado líneas</button>
  <button class="opt" data-action="focusRing">🔲 Resaltar foco</button>
  <button class="opt" data-action="reduceMotion">⏹️ Reducir animaciones</button>
  <button class="opt" data-action="invert">🎨 Invertir colores</button>
  <hr>
  <button class="opt" data-action="reset">♻️ Restablecer</button>
</div>
<script>
(function(){
  const parentWindow = parent;
  const trigger = document.getElementById("trigger");
  const panel = document.getElementById("panel");
  const opts = document.querySelectorAll(".opt");

  const send = (msg) => parentWindow.postMessage(msg, "*");

  const openPanel = () => {
    panel.style.display="block";
    send({ type:"a11y-ui", action:"panel", open:true, width:280, height:panel.scrollHeight+60 });
  };
  const closePanel = () => {
    panel.style.display="none";
    send({ type:"a11y-ui", action:"panel", open:false, width:48, height:48 });
  };

  trigger.addEventListener("click", ()=>{
    if(panel.style.display==="block"){ closePanel(); } else { openPanel(); }
  });

  opts.forEach(btn=>{
    btn.addEventListener("click", ()=>{
      send({ type:"a11y-action", action: btn.dataset.action });
    });
  });

  // recibir prefs desde parent para marcar botones activos
  window.addEventListener("message",(ev)=>{
    if(ev.data && ev.data.type==="a11y-update"){
      const prefs = ev.data.prefs || {};
      opts.forEach(btn=>{
        const act = btn.dataset.action;
        if(prefs[act]) {
          btn.classList.add("active");
          btn.setAttribute("aria-pressed","true");
        } else {
          btn.classList.remove("active");
          btn.setAttribute("aria-pressed","false");
        }
      });
    }
  });
})();
</script>
</body>
</html>`;

        iframeEl.srcdoc = srcdoc;
        document.documentElement.appendChild(iframeEl);

        // listener mensajes
        window.addEventListener("message", (ev) => {
            if (!ev.data || typeof ev.data !== "object") return;
            const d = ev.data;
            if (d.type === "a11y-action" && d.action) {
                handleIframeAction(d.action);
            }
            if (d.type === "a11y-ui" && d.action === "panel") {
                if (d.open) {
                    iframeEl.style.width = (d.width || 280) + "px";
                    iframeEl.style.height = (d.height || 400) + "px";
                } else {
                    iframeEl.style.width = "48px";
                    iframeEl.style.height = "48px";
                }
            }
        }, false);

        return iframeEl;
    };

    // ==== init ====
    const prefs = loadPreferences();
    applyPreferences(prefs);
    window.addEventListener("DOMContentLoaded", () => {
        createIframeUI();
        setTimeout(() => {
            if (iframeEl && iframeEl.contentWindow) {
                iframeEl.contentWindow.postMessage({ type: "a11y-update", prefs }, "*");
            }
        }, 300);
    });
})();


function ajustarGraficosD3plus(prefs) {
    document.querySelectorAll("svg").forEach(svg => {
        if (svg.querySelector(".d3plus")) { // detecta si el SVG contiene nodos de D3plus
            svg.classList.add("d3plus-chart");

            svg.classList.remove(
                "a11y-contrast-dark",
                "a11y-contrast-light",
                "a11y-invert",
                "a11y-font-scale"
            );

            if (prefs.contrastDark || prefs.invert) {
                svg.classList.add("a11y-contrast-dark");
            } else if (prefs.contrastLight) {
                svg.classList.add("a11y-contrast-light");
            }

            if (prefs.fontScale && prefs.fontScale !== 1) {
                svg.classList.add("a11y-font-scale");
                svg.style.setProperty("--a11y-font-scale", prefs.fontScale);
            } else {
                svg.style.removeProperty("--a11y-font-scale");
            }
        }
    });
}
