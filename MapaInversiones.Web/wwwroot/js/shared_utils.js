// /js/shared_utils.js
// /09-julio-2025
(function (global) {
    'use strict';
    //console.log('[shared_utils] cargado');

    /**
    * Formatea un número usando separador de miles y de decimales custom.
    *
    * @param {number} n                     Valor a formatear.
    * @param {number} c                     Cantidad de decimales (por defecto 1).
    * @param {string} [d=","]               Separador de decimales (por defecto coma).
    * @param {string} [t="."]               Separador de miles (por defecto punto).
    * @returns {string}                     Cadena formateada.
    *
    * @example
    * formatoDecimales(4545454, 2);     // "4.545.454,00"
    * @example
    * // override: decimales punto, miles coma => "4,545,454.00"
    * formatoDecimales(4545454, 2, ".", ",");
    */
    function formatoDecimales(n, c, d, t) {
        c = isNaN(c = Math.abs(c)) ? 1 : c;     // 1 decimal por defecto
        d = d === undefined ? "," : d;          // decimal = coma por defecto
        t = t === undefined ? "." : t;          // miles = punto por defecto
        const s = n < 0 ? "-" : "";
        const i = parseInt(n = Math.abs(+n || 0).toFixed(c), 10) + "";
        const j = (i.length > 3) ? i.length % 3 : 0;
        const cabeza = j ? i.slice(0, j) + t : "";
        const resto = i.slice(j).replace(/(\d{3})(?=\d)/g, "$1" + t);
        const decim = c ? d + Math.abs(n - i).toFixed(c).slice(2) : "";
        return s + cabeza + resto + decim;
    }

    // Sufijos desde millón en adelante
    const SINGULAR = ['millón', 'billón', 'trillón', 'cuatrillón', 'quintillón', 'sextillón'];
    const PLURAL = ['millones', 'billones', 'trillones', 'cuatrillones', 'quintillones', 'sextillones'];
    const SHORT = ['M', 'B', 'T', 'Ct', 'Qt', 'Sx'];
    const SALTO = 1_000_000;

    /**
     * Formatea un valor monetario a escala (millones, billones, trillones, …).
     *
     * @param {number} value       Valor bruto.
     * @param {number} decimales   Cantidad de decimales (por defecto 1).
     * @param {number} [nivel=0]   0 = auto-detecta (unidades → millones → …),
     *                             1 = viene ya en millones,
     *                             2 = viene ya en billones, etc.
     * @param {string} [tipoSufijo='long']
     *                             'long' para texto largo ("millones", "billones"),
     *                             otro valor para abreviatura ("M", "B").
     * @returns {string}           Texto formateado, p. ej. "2,30 millones" o "5,00 B".
     *
     * @example
     * shared.formatoMoneda(2300000);                       // "2,3 millones"
     * shared.formatoMoneda(2300000,    2);                 // "2,30 millones"
     * shared.formatoMoneda(5e12,       1);                 // "5,0 billones"
     * shared.formatoMoneda(250,        2, 1);              // "250,00 millones"
     * shared.formatoMoneda(250,        2, 1, 'short');     // "250,00 M"
     */
    function formatoMoneda(value, decimales = 1, nivel = 0, tipoSufijo = 'long', sinSufijo = false) {
        let escala = nivel;
        let val = value;

        while (escala < SINGULAR.length && val >= SALTO) {
            val /= SALTO;
            escala++;
        }

        if (nivel === 0 && escala === 0) {
            return formatoDecimales(val, decimales);
        }

        // Si sinSufijo es true, solo retornar el número
        if (sinSufijo) {
            return formatoDecimales(val, decimales);
        }

        const idx = escala - 1;
        const sufijo = (tipoSufijo === 'long')
            ? (val === 1 ? SINGULAR[idx] : PLURAL[idx])
            : SHORT[idx];

        return formatoDecimales(val, decimales) + ' ' + sufijo;
    }

    // Usar en el gráfico:
    label: d => shared.formatoMoneda(d.rawValue, 1, 0, 'long', true) // true = sin sufijo

    // Exposición métodos en `shared`
    global.shared = global.shared || {};
    global.shared.formatoDecimales = formatoDecimales;
    global.shared.formatoMoneda = formatoMoneda;

})(window);

// ------------------------------------------
// Ejemplos de uso: en cualquier js auxiliar
// ----------------
// shared.formatoMoneda(3500000);                       // "3,5 millones"
// shared.formatoMoneda(3500000, 2);                    // "3,50 millones"
// shared.formatoMoneda(3500000, 2, 0, 'short');        // "3,50 M"
// shared.formatoDecimales(1234567.891);                // "1.234.567,9"
// shared.formatoDecimales(1234567.891, 2);             // "1.234.567,89"
// shared.formatoDecimales(1234567.891, 2, ".", ",");   // "1,234,567.89"

