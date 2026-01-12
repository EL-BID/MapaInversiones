/**
 * Barra de Accesibilidad
 * ----------------------------------------------------------
 * Este script genera un botón flotante ("A") en la esquina inferior derecha.
 * Al hacer clic, se despliega un panel con las siguientes opciones:
 *
 * - ☀️ Contraste claro (a11y-contrast-light)
 * - 🌙 Contraste oscuro (a11y-contrast-dark)
 * - 🔳 Contraste fuerte (a11y-contrast-strong, inversión global)
 * - 🎨 Invertir colores manual (a11y-invert)
 * - ✨ Reducir animaciones (a11y-reduce-motion)
 * - 🔎 Aumentar fuente
 * - 🔍 Disminuir fuente
 * - 🔤 Espaciado de letras
 * - 📏 Espaciado de líneas
 * - ♻️ Resetear ajustes
 *
 * Además:
 * - Integra compatibilidad con Azure Maps (ajustando estilos y zoom).
 * - Integra compatibilidad con D3plus (colores y fuentes).
 * - Guarda las preferencias en localStorage para mantenerlas entre sesiones.
 */

let prefs = JSON.parse(localStorage.getItem("a11y-prefs") || "{}");

function savePreferences(p) {
    localStorage.setItem("a11y-prefs", JSON.stringify(p));
}

function applyPreferences(prefs) {
    const html = document.documentElement;

    // Limpiar clases previas
    html.classList.remove(
        "a11y-contrast-dark",
        "a11y-contrast-light",
        "a11y-contrast-strong",
        "a11y-invert",
        "a11y-reduce-motion",
        "a11y-font-scale",
        "a11y-letter-spacing",
        "a11y-line-height"
    );

    // Contrastes
    if (prefs.contrastStrong) {
        html.classList.add("a11y-contrast-strong");
    } else if (prefs.contrastDark) {
        html.classList.add("a11y-contrast-dark");
    } else if (prefs.contrastLight) {
        html.classList.add("a11y-contrast-light");
    }

    // Invertir colores manual
    if (prefs.invert) {
        html.classList.add("a11y-invert");
    }

    // Reducir animaciones
    if (prefs.reduceMotion) {
        html.classList.add("a11y-reduce-motion");
    }

    // Escala de fuente
    if (prefs.fontScale && prefs.fontScale !== 1) {
        html.classList.add("a11y-font-scale");
        html.style.setProperty("--a11y-font-scale", prefs.fontScale);
    } else {
        html.style.removeProperty("--a11y-font-scale");
    }

    // Espaciado de letras
    if (prefs.letterSpacing) {
        html.classList.add("a11y-letter-spacing");
    }

    // Espaciado de líneas
    if (prefs.lineHeight) {
        html.classList.add("a11y-line-height");
    }

    /* ============================= */
    /* Azure Maps */
    /* ============================= */
    if (window.azureMap) {
        if (prefs.contrastDark || prefs.contrastStrong || prefs.invert) {
            window.azureMap.setStyle({ style: "high_contrast_dark" });
        } else if (prefs.contrastLight) {
            window.azureMap.setStyle({ style: "high_contrast_light" });
        } else {
            window.azureMap.setStyle({ style: "road" });
        }

        if (prefs.fontScale && prefs.fontScale !== 1) {
            let zoom = window.azureMap.getCamera().zoom || 10;
            window.azureMap.setCamera({ zoom: zoom + (prefs.fontScale - 1) });
        }
    }

    /* ============================= */
    /* D3plus */
    /* ============================= */
    document.querySelectorAll("svg").forEach(svg => {
        if (svg.querySelector(".d3plus")) {
            svg.classList.add("d3plus-chart");
            svg.classList.remove(
                "a11y-contrast-dark",
                "a11y-contrast-light",
                "a11y-contrast-strong",
                "a11y-font-scale",
                "a11y-letter-spacing",
                "a11y-line-height"
            );

            if (prefs.contrastStrong) svg.classList.add("a11y-contrast-strong");
            else if (prefs.contrastDark) svg.classList.add("a11y-contrast-dark");
            else if (prefs.contrastLight) svg.classList.add("a11y-contrast-light");

            if (prefs.fontScale && prefs.fontScale !== 1) {
                svg.classList.add("a11y-font-scale");
                svg.style.setProperty("--a11y-font-scale", prefs.fontScale);
            } else {
                svg.style.removeProperty("--a11y-font-scale");
            }

            if (prefs.letterSpacing) svg.classList.add("a11y-letter-spacing");
            if (prefs.lineHeight) svg.classList.add("a11y-line-height");
        }
    });
}

/* ============================= */
/* Crear el toolbar flotante (iframe con botón A) */
/* ============================= */
function createIframeUI() {
    if (document.getElementById("a11y-iframe")) return;

    const iframe = document.createElement("iframe");
    iframe.id = "a11y-iframe";
    iframe.setAttribute("title", "Accesibilidad");
    iframe.style.position = "fixed";
    iframe.style.bottom = "15px";
    iframe.style.right = "15px";
    iframe.style.width = "48px";
    iframe.style.height = "48px";
    iframe.style.border = "none";
    iframe.style.zIndex = "2147483647";
    iframe.style.background = "transparent";

    iframe.srcdoc = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <style>
        body { margin: 0; font-family: Arial, sans-serif; }
        #btnA {
          width: 48px; height: 48px;
          border-radius: 50%;
          background: #000; color: #fff;
          font-weight: bold;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
        }
        #panel {
          display: none;
          width: 300px;
          height: 480px;
          background: #f9f9f9;
          border: 1px solid #ccc;
          padding: 10px;
          box-sizing: border-box;
          overflow-y: auto;
        }
        #panel h3 { margin: 0 0 10px 0; font-size: 18px; }
        #panel button {
          display: block;
          width: 100%;
          margin: 5px 0;
          padding: 8px;
          border: none;
          border-radius: 4px;
          background: #007bff;
          color: #fff;
          font-size: 14px;
          cursor: pointer;
          text-align: left;
        }
        #panel button.active { background: #0056b3; }
        #panel button:hover { background: #0069d9; }
        #close {
          float: right;
          cursor: pointer;
          font-size: 18px;
          margin-top: -5px;
        }
      </style>
    </head>
    <body>
      <div id="btnA">A</div>
      <div id="panel">
        <div id="close">✖</div>
        <h3>Accesibilidad</h3>
        <button id="btnLight">☀️ Contraste claro</button>
        <button id="btnDark">🌙 Contraste oscuro</button>
        <button id="btnStrong">🔳 Contraste fuerte</button>
        <button id="btnInvert">🎨 Invertir colores</button>
        <button id="btnReduce">✨ Reducir animaciones</button>
        <button id="btnFontInc">🔎 Aumentar fuente</button>
        <button id="btnFontDec">🔍 Disminuir fuente</button>
        <button id="btnLetter">🔤 Espaciado de letras</button>
        <button id="btnLine">📏 Espaciado de líneas</button>
        <button id="btnReset">♻️ Resetear</button>
      </div>
      <script>
        const btnA = document.getElementById("btnA");
        const panel = document.getElementById("panel");
        const close = document.getElementById("close");

        btnA.onclick = () => {
          panel.style.display = "block";
          parent.postMessage({type:'a11y-ui', action:'panel', open:true, width:320, height:500}, '*');
        };
        close.onclick = () => {
          panel.style.display = "none";
          parent.postMessage({type:'a11y-ui', action:'panel', open:false}, '*');
        };

        // Botones con acciones
        document.getElementById("btnLight").onclick = () => parent.postMessage({type:'a11y-action', action:'contrastLight'}, '*');
        document.getElementById("btnDark").onclick = () => parent.postMessage({type:'a11y-action', action:'contrastDark'}, '*');
        document.getElementById("btnStrong").onclick = () => parent.postMessage({type:'a11y-action', action:'contrastStrong'}, '*');
        document.getElementById("btnInvert").onclick = () => parent.postMessage({type:'a11y-action', action:'invert'}, '*');
        document.getElementById("btnReduce").onclick = () => parent.postMessage({type:'a11y-action', action:'reduceMotion'}, '*');
        document.getElementById("btnFontInc").onclick = () => parent.postMessage({type:'a11y-action', action:'fontInc'}, '*');
        document.getElementById("btnFontDec").onclick = () => parent.postMessage({type:'a11y-action', action:'fontDec'}, '*');
        document.getElementById("btnLetter").onclick = () => parent.postMessage({type:'a11y-action', action:'letterSpacing'}, '*');
        document.getElementById("btnLine").onclick = () => parent.postMessage({type:'a11y-action', action:'lineHeight'}, '*');
        document.getElementById("btnReset").onclick = () => parent.postMessage({type:'a11y-action', action:'reset'}, '*');
      </script>
    </body>
    </html>
  `;

    document.body.appendChild(iframe);
}

/* ============================= */
/* Listener global de mensajes */
/* ============================= */
window.addEventListener("message", (ev) => {
    const d = ev.data || {};

    // Acciones de accesibilidad
    if (d && d.type === "a11y-action" && d.action) {
        handleAction(d.action);
    }

    // Control del panel
    if (d && d.type === "a11y-ui" && d.action === "panel") {
        const iframe = document.getElementById("a11y-iframe");
        if (iframe) {
            if (d.open) {
                iframe.style.width = (d.width || 320) + "px";
                iframe.style.height = (d.height || 500) + "px";
            } else {
                iframe.style.width = "48px";
                iframe.style.height = "48px";
            }
        }
    }
}, false);

/* ============================= */
/* Procesar acciones de botones */
/* ============================= */
function handleAction(action) {
    switch (action) {
        case "contrastLight":
            prefs.contrastLight = !prefs.contrastLight;
            prefs.contrastDark = false;
            prefs.contrastStrong = false;
            break;
        case "contrastDark":
            prefs.contrastDark = !prefs.contrastDark;
            prefs.contrastLight = false;
            prefs.contrastStrong = false;
            break;
        case "contrastStrong":
            prefs.contrastStrong = !prefs.contrastStrong;
            prefs.contrastLight = false;
            prefs.contrastDark = false;
            break;
        case "invert":
            prefs.invert = !prefs.invert;
            break;
        case "reduceMotion":
            prefs.reduceMotion = !prefs.reduceMotion;
            break;
        case "fontInc":
            prefs.fontScale = (prefs.fontScale || 1) + 0.1;
            break;
        case "fontDec":
            prefs.fontScale = Math.max((prefs.fontScale || 1) - 0.1, 0.5);
            break;
        case "letterSpacing":
            prefs.letterSpacing = !prefs.letterSpacing;
            break;
        case "lineHeight":
            prefs.lineHeight = !prefs.lineHeight;
            break;
        case "reset":
            prefs = {};
            break;
    }
    savePreferences(prefs);
    applyPreferences(prefs);
}

/* ============================= */
/* Inicializar */
/* ============================= */
createIframeUI();
applyPreferences(prefs);
