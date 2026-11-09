
// ======= CONFIG =======
// La key se inyecta desde AzureMapView.cshtml leyendo appsettings.json AzureMaps:SubscriptionKey
const MAP_KEY = (typeof window !== 'undefined' && window.MAP_KEY) ? window.MAP_KEY : '';

// RUTAS SERVICIOS
const FILTERS_URL = `/api/FiltrosTotales/GetFiltros`;
const SEARCH_URL = `/api/serviciosproyectos/busqueda`;
const LIST_URL = `/api/serviciosproyectos/listado`;

// Zoom a partir del cual se muestran pines individuales de proyecto en vez de comunas/corregimientos
// 2026-11-06: 13 (valor de PY, pensado para un país) → 14. La vista urbana de Bucaramanga cae en zoom 12,8–13,6
// según la pantalla y con 13 a veces abría con pines sueltos; al elegir una comuna el mapa llega a 14,7–16,4.
const ZOOM_PROJECT_LEVEL = 14;

// DECISIÓN PROVISORIA (2026-11-06, con el usuario): NO se muestran pines por proyecto a ningún zoom.
// Motivo: en Georreferenciacion los 718 puntos caen en solo 17 coordenadas (una por comuna), así que todos los
// proyectos de una comuna saldrían apilados en el mismo lugar. El mapa muestra solo el acumulado por
// comuna/corregimiento (y su popup con el resumen). Para reactivarlos: cargar la ubicación real de cada proyecto
// y poner esto en true (se usa ZOOM_PROJECT_LEVEL).
const MOSTRAR_PINES_PROYECTO = false;

// Encuadres [minLon, minLat, maxLon, maxLat] (cartografía 2026-11-06).
// URBAN_BOUNDS = las 17 comunas: vista al abrir el mapa, con "Limpiar" y al volver a "(Todos)" (pedido del usuario).
// BGA_BOUNDS = todo el municipio (comunas + corregimientos), de referencia.
const URBAN_BOUNDS = [-73.1722, 7.0706, -73.0923, 7.1802];
const BGA_BOUNDS = [-73.1722, 7.0706, -73.0423, 7.2588];

// La búsqueda del mapa Azure pide formato=pines: un pin por proyecto (como PlataformaTransparenciaPY).
// Sin ese parámetro la API responde en el formato del mapa clásico /MapView.
const SEARCH_FORMAT = { formato: 'pines' };

// Bucaramanga es un municipio único (Comuna urbana + Corregimiento rural son hermanas, no jerárquicas).
// No aplica la rama "capital dept incluye proyectos nacionales" del fork PY. Este stub retorna false
// para conservar el flujo de código pero desactivar cualquier agrupación especial por capital.
function _esAsuncion(_label) {
    return false;
}

// ======= ESTADO =======
let map, dsPoints, symbolLayer;
let dsPolygons, polyFillLayer, polyLineLayer;

let mvTimer = null;
let lastSearchAbort = null;
let lastListAbort = null;

// antirace
let searchSeq = 0;     // id que incrementa en cada búsqueda
let listSeq = 0;

// listado
const listState = {
    page: 1,
    pageSize: 10,
    totalPages: 0,
    total: 0,
    loading: false
};

// cache de municipios para filtrado por departamento
let allMunicipioItems = [];

// highlight de polígono seleccionado
let dsHighlight = null;
let highlightFillLayer, highlightLineLayer;

// highlight temporal al hacer hover sobre un polígono
let dsHover = null;
let hoverFillLayer, hoverLineLayer;
let _lastHoveredShapeId = null;

// Flag para evitar que el click en un pin dispare también el evento del polígono debajo
let _pinClicked = false;

// pin rojo en centroide del municipio seleccionado
let dsSelectedMuniPin = null;
let symbolLayerSelectedMuni = null;

// etiqueta del departamento activo (se mantiene cuando se filtra por municipio)
let activeDeptId = '';
let activeDeptLabel = '';
// etiqueta del municipio activo (para popup del pin rojo)
let activeFilterLabel = '';

// últimos objetos devueltos por la API de búsqueda (incluye proyectos sin geo)
let lastSearchObjects = [];

// cache de datos de popup por departamento: clave = JSON({departamento, ...otrosFiltros})
const deptPopupCache = {};

// Cache de resultados de searchAndRender por estado de filtros (sin viewport).
// El backend ignora topLeft/bottomRight/zoom/center, así que la misma combinación
// de filtros siempre devuelve los mismos objetos → podemos cachearlos en sesión.
const _searchCache = {};


// ======= CACHES DE POLÍGONOS (A: pre-computados tras loadPolygons) =======
const deptCentroidCache = {};  // deptId → [lon, lat]  (polylabel)
const deptBboxCache     = {};  // deptId → [minLon, minLat, maxLon, maxLat]
const deptRingsCache    = {};  // deptId → [[lon,lat],...] todos los anillos exteriores (punto-en-polígono)
const deptNameCache     = {};  // deptId → name
const deptShapeCache    = {};  // deptId → shape  (para highlight)
const muniCentroidCache = {};  // muniId → [lon, lat]  (centro bbox)
const muniBboxCache     = {};  // muniId → [minLon, minLat, maxLon, maxLat]
const muniNameCache     = {};  // muniId → name
const muniShapeCache    = {};  // muniId → shape  (para highlight)

// C: flag que indica movimiento de cámara iniciado por código (reduce debounce a 0)
let _programmaticMove = false;

// ======= HELPERS =======
const $filtersPanel = $('#filtersPanel');
const $filtersContainer = $('#filtersContainer');
const $filtersFab = $('#filtersFab');
const $filtersCloseBtn = $('#filtersCloseBtn');

const $resultsBadge = $('#resultsBadge');
const $resultsList = $('#resultsList');
const $pager = $('#pager');

const money = n => (n == null) ? '-' : '$ ' + (Number(n) / 1000000).toLocaleString('es-CO', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + ' Millones';

function toNumber(n) {
    const v = (typeof n === 'string') ? parseFloat(n) : n;
    return (typeof v === 'number' && Number.isFinite(v)) ? v : null;
}
function isNumLike(n) { return toNumber(n) !== null; }
function idFor(p) { return `f_${p}`; }
function getSelected($sel, multiple) {
    if (multiple) return ($sel.val() || []).map(String);
    const v = $sel.val();
    return v ? [String(v)] : [];
}

function toFeatures(data) {
    try {
        if (!data) return [];
        if (typeof data === 'string') { try { data = JSON.parse(data); } catch { return []; } }
        if (Array.isArray(data)) return data.filter(f => f && typeof f === 'object' && (f.type === 'Feature' || f.geometry));
        if (data.type === 'FeatureCollection' && Array.isArray(data.features)) return data.features;
        if (data.type === 'Feature' && data.geometry) return [data];
        if (Array.isArray(data.features)) return data.features;
        if (Array.isArray(data.objects)) return data.objects;
        if (data.geojson) return toFeatures(data.geojson);
        if (data.data) return toFeatures(data.data);
    } catch (_) { }
    return [];
}
function sanitizeFeatures(arr) {
    const ok = [];
    arr.forEach(f => {
        if (!f || !f.geometry) return;
        const g = f.geometry;
        if (g.type === 'Point') {
            const c = g.coordinates || [];
            const x = toNumber(c[0]);
            const y = toNumber(c[1]);
            if (x !== null && y !== null) {
                f.geometry.coordinates = [x, y];
                ok.push(f);
            }
            return;
        }
        if (Array.isArray(g.coordinates) && g.coordinates.length) ok.push(f);
    });
    return ok;
}

// ======= UI – FILTROS =======
function renderFilter(def) {
    const id = idFor(def.parameter);
    const multiple = !!def.esMultiple;

    const $wrap = $('<div class="control"></div>');
    $wrap.append(`<label for="${id}">${def.name || def.parameter}</label>`);

    const $sel = $(`<select id="${id}" ${multiple ? 'multiple size="6"' : ''}></select>`);
    if (!multiple) $sel.append('<option value="">(Todos)</option>');
    appendOptions($sel, def.items || []);
    $wrap.append($sel);
    return $wrap;
}

// Agrega las opciones al combo. Si los items traen 'grupo' (filtros geográficos: Comunas/Corregimientos,
// Barrios/Veredas) se agrupan en <optgroup> en el orden en que llegan del servidor.
function appendOptions($sel, items) {
    let $grupo = null;
    let grupoActual = null;
    items.forEach(it => {
        const text = String(it.name ?? it.label ?? it.value ?? "");
        const val = String(it.value ?? it.code ?? it.name ?? "");
        if (it.grupo) {
            if (it.grupo !== grupoActual) {
                grupoActual = it.grupo;
                $grupo = $('<optgroup></optgroup>').attr('label', it.grupo);
                $sel.append($grupo);
            }
            $grupo.append(new Option(text, val));
        } else {
            $sel.append(new Option(text, val));
        }
    });
}

function renderFiltersUI(filters) {
    $filtersContainer.empty();
    if (!$('#activeFilterBadge').length) {
        $filtersContainer.after('<div id="activeFilterBadge" class="active-filter-badge" style="display:none"></div>');
    }
    filters.forEach(def => {
        // Región se oculta del UI (se mantiene en backend para otros países)
        if (def.parameter === 'region') return;
        if (def.parameter === 'municipio') {
            allMunicipioItems = (def.items || []).slice();
        }
        $filtersContainer.append(renderFilter(def));
    });

    $filtersContainer.find('select').off('change').on('change', function () {
        listState.page = 1;
        const id = this.id;
        const val = $(this).val();

        // Limpiar caché de búsqueda al cambiar cualquier filtro
        // (los filtros geo cambian la clave automáticamente; los secundarios invalidan el anterior)
        Object.keys(_searchCache).forEach(k => delete _searchCache[k]);

        if (id === 'f_departamento') {
            $('#f_municipio').val('');
            updateSelectedMuniPin(null);
            applyMunicipioFilter(val);
            updateHighlight('departamento', val);
            activeDeptId = val || '';
            activeDeptLabel = val ? $(`#f_departamento option[value="${val}"]`).text() : '';
            activeFilterLabel = '';

            // Limpiar siempre: searchAndRender pondrá el pin correcto con datos reales
            dsPoints.clear();
        }

        if (id === 'f_municipio') {
            if (val) {
                updateHighlight('municipio', val);
                updateSelectedMuniPin(val);
                activeFilterLabel = $(`#f_municipio option[value="${val}"]`).text();
            } else {
                const dv = $('#f_departamento').val();
                updateHighlight(dv ? 'departamento' : null, dv || null);
                updateSelectedMuniPin(null);
                activeFilterLabel = '';
            }
        }

        updateActiveFilterBadge();
        closeMapInfo();

        let cameraMoved = false;
        const depVal = $('#f_departamento').val();
        const muniVal = $('#f_municipio').val();

        if (id === 'f_municipio' && val) {
            cameraMoved = focusOnFeature('municipio', val);
        } else if (id === 'f_municipio' && !val) {
            if (depVal) cameraMoved = focusOnFeature('departamento', depVal);
            else cameraMoved = resetCountryView();
        } else if (id === 'f_departamento') {
            if (val) {
                cameraMoved = focusOnFeature('departamento', val);
            } else if (!muniVal) {
                cameraMoved = resetCountryView();
            }
        }

        if (!cameraMoved) {
            loadProjectList(true);
            searchAndRender();
        }
    });
}

function applyMunicipioFilter(idDepto) {
    const $muni = $('#f_municipio');
    if (!$muni.length) return;
    $muni.empty().append('<option value="">(Todos)</option>');

    if (idDepto) {
        const items = allMunicipioItems.filter(it =>
            (it.dependsOn || []).some(d => String(d.id) === String(idDepto))
        );
        appendOptions($muni, items.map(it => ({ ...it, name: String(it.name ?? '').split(', ')[0] })));
    } else {
        appendOptions($muni, allMunicipioItems);
    }
}

// A: usa bbox cache en vez de iterar shapes
function focusOnFeature(tipo, idValue) {
    if (!idValue) return false;
    const idStr = String(idValue);
    const target = String(tipo).toLowerCase();

    const bbox = target === 'departamento' ? deptBboxCache[idStr] : muniBboxCache[idStr];
    if (bbox) {
        _programmaticMove = true; // C
        map.setCamera({ bounds: bbox, padding: 30, type: 'ease' });
        return true;
    }
    return false;
}

// C: marca el movimiento como programático
function resetCountryView(instant = false) {
    const type = instant ? 'jump' : 'ease';
    _programmaticMove = true; // C
    // Vista general = zona urbana (17 comunas). Antes caía al encuadre de Paraguay (fork PY) porque
    // DataSource (Azure Maps v3) no tiene getBounds().
    map.setCamera({ bounds: URBAN_BOUNDS, padding: 30, type });
    return true;
}

// A: usa shape cache en vez de iterar shapes
function updateHighlight(tipo, idValue) {
    if (!dsHighlight) return;
    dsHighlight.clear();
    if (!tipo || !idValue) return;
    const target = String(tipo).toLowerCase();
    const idStr = String(idValue);
    const sh = target === 'departamento' ? deptShapeCache[idStr] : muniShapeCache[idStr];
    if (sh) {
        try { dsHighlight.add(sh.toJson()); } catch (_) {}
    }
}


function updateActiveFilterBadge() {
    const $badge = $('#activeFilterBadge');
    if (!$badge.length) return;
    const depVal = $('#f_departamento').val();
    const muniVal = $('#f_municipio').val();
    if (!depVal && !muniVal) { $badge.hide().text(''); return; }
    const label = muniVal
        ? $('#f_municipio option:selected').text()
        : $('#f_departamento option:selected').text();
    $badge.text(label).show();
}

// Limpia el pin rojo de municipio. La creación del feature (con count/value reales)
// ocurre en searchAndRender para evitar mostrar count:0 mientras carga la API.
function updateSelectedMuniPin(idValue) {
    if (!dsSelectedMuniPin) return;
    dsSelectedMuniPin.clear();
}

function getFilterTitle() {
    return activeFilterLabel;
}

function buildGroupedPopupHtml(shapes, title) {
    const byTipo = {};
    (shapes || []).forEach(s => {
        const p = s.getProperties ? s.getProperties() : {};
        const tipo = p.tipoProyecto || '';
        if (!byTipo[tipo]) byTipo[tipo] = { count: 0, value: 0 };
        byTipo[tipo].count++;
        if (isNumLike(p.value)) byTipo[tipo].value += Number(p.value);
    });
    const entries = Object.entries(byTipo);
    if (!entries.length) return '<div class="map-popup"><span class="muted">Sin datos</span></div>';
    const titleHtml = title ? `<strong class="popup-title">${title}</strong>` : '';
    const rows = entries.map(([tipo, agg]) => {
        const valStr = agg.value > 0 ? ` · ${money(agg.value)}` : '';
        return `<div class="popup-row">
            ${tipo ? `<span class="popup-tag popup-tag--alcance">${tipo}</span>` : ''}
            <span>${agg.count} proyecto${agg.count !== 1 ? 's' : ''}${valStr}</span>
        </div>`;
    }).join('');
    return `<div class="map-popup">${titleHtml}${rows}</div>`;
}

// Devuelve el HTML del botón "Quitar filtro" según el filtro activo
function clearFilterBtn() {
    if (activeFilterLabel) {
        return `<a href="#" class="popup-link popup-link-danger"
            onclick="event.preventDefault();$('#f_municipio').val('').trigger('change')">
            Quitar barrio o vereda ×</a>`;
    }
    if (activeDeptId) {
        return `<a href="#" class="popup-link popup-link-danger"
            onclick="event.preventDefault();$('#f_departamento').val('').trigger('change')">
            Quitar comuna o corregimiento ×</a>`;
    }
    return '';
}

function buildGroupedPopupHtmlFromObjects(objects, title, extraBtns = '') {
    const nacionales = (objects || []).filter(o => o && o.isNacional);
    const regulares  = (objects || []).filter(o => o && !o.isNacional);

    function buildRows(objs) {
        const byTipo = {};
        objs.forEach(o => {
            const tipo = o.tipoProyecto || '';
            if (!byTipo[tipo]) byTipo[tipo] = { count: 0, value: 0 };
            byTipo[tipo].count++;
            if (isNumLike(o.value)) byTipo[tipo].value += Number(o.value);
        });
        return Object.entries(byTipo).map(([tipo, agg]) => {
            const valStr = agg.value > 0 ? ` · ${money(agg.value)}` : '';
            return `<div class="popup-row">
                ${tipo ? `<span class="popup-tag popup-tag--alcance">${tipo}</span>` : ''}
                <span>${agg.count} proyecto${agg.count !== 1 ? 's' : ''}${valStr}</span>
            </div>`;
        }).join('');
    }

    const sections = [];
    if (nacionales.length > 0) {
        sections.push(`<div class="popup-section-label">Nacionales</div>`);
        sections.push(buildRows(nacionales));
    }
    if (regulares.length > 0) {
        if (nacionales.length > 0) sections.push(`<div class="popup-section-label">${title || 'Locales'}</div>`);
        sections.push(buildRows(regulares));
    }

    const titleHtml = title ? `<strong class="popup-title">${title}</strong>` : '';
    if (!sections.length) {
        // Hoy los proyectos están asignados solo a nivel comuna: un barrio/vereda siempre llega vacío.
        const msg = activeFilterLabel ? 'Sin proyectos asignados a este barrio o vereda.' : 'Sin proyectos.';
        const btns = extraBtns ? `<div class="popup-btn-row">${extraBtns}</div>` : '';
        return `<div class="map-popup">${titleHtml}<span class="muted">${msg}</span>${btns}</div>`;
    }
    const listBtn = `<a href="#" class="popup-link" style="display:inline-block;margin-top:.5rem;"
        onclick="event.preventDefault();document.querySelector('section.results').scrollIntoView({behavior:'smooth'})">Ver listado ↓</a>`;
    const btnRow = `<div class="popup-btn-row">${listBtn}${extraBtns}</div>`;
    return `<div class="map-popup">${titleHtml}${sections.join('')}${btnRow}</div>`;
}

function fetchDeptPopupData(deptId, deptName) {
    const filters = collectFilters();
    delete filters.municipio;
    filters.departamento = String(deptId);
    const cacheKey = JSON.stringify(filters);   // clave sin incluyeNacionales → fallback puede encontrar Asunción
    if (_esAsuncion(deptName)) filters.incluyeNacionales = '1';

    if (deptPopupCache[cacheKey]) {
        return Promise.resolve({ objs: deptPopupCache[cacheKey], deptName });
    }

    return fetch(`${SEARCH_URL}?${new URLSearchParams({...filters, ...SEARCH_FORMAT, zoom: 12}).toString()}`)
        .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
        .then(json => {
            const objs = Array.isArray(json?.objects) ? json.objects : [];
            deptPopupCache[cacheKey] = objs;
            return { objs, deptName };
        });
}

function polyCentroid(sh) {
    try {
        const json = sh.toJson();
        let ring = null;
        if (json.geometry.type === 'Polygon') {
            ring = json.geometry.coordinates[0];
        } else if (json.geometry.type === 'MultiPolygon') {
            let bestArea = -1;
            for (const poly of json.geometry.coordinates) {
                let a = 0;
                const r = poly[0];
                for (let i = 0, j = r.length - 1; i < r.length; j = i++)
                    a += (r[i][0] - r[j][0]) * (r[i][1] + r[j][1]);
                if (Math.abs(a) > bestArea) { bestArea = Math.abs(a); ring = r; }
            }
        }
        if (!ring || ring.length < 3) return null;
        return _polylabel(ring, 1e-3);
    } catch (_) { return null; }
}

// Ray casting puro: solo verdadero/falso, sin calcular distancia (más rápido que _ptRingDist)
function _pointInRing(x, y, ring) {
    let inside = false;
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
        const ay = ring[i][1], by = ring[j][1];
        if ((ay > y) !== (by > y) &&
            x < (ring[j][0] - ring[i][0]) * (y - ay) / (by - ay) + ring[i][0])
            inside = !inside;
    }
    return inside;
}

function _ptRingDist(x, y, ring) {
    let inside = false, minD2 = Infinity;
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
        const ax = ring[i][0], ay = ring[i][1], bx = ring[j][0], by = ring[j][1];
        if ((ay > y) !== (by > y) && x < (bx - ax) * (y - ay) / (by - ay) + ax)
            inside = !inside;
        const dx = bx - ax, dy = by - ay, len2 = dx * dx + dy * dy;
        const t = len2 ? Math.max(0, Math.min(1, ((x - ax) * dx + (y - ay) * dy) / len2)) : 0;
        const qx = ax + t * dx - x, qy = ay + t * dy - y;
        const d2 = qx * qx + qy * qy;
        if (d2 < minD2) minD2 = d2;
    }
    return (inside ? 1 : -1) * Math.sqrt(minD2);
}

function _polylabel(ring, precision) {
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (const [x, y] of ring) {
        if (x < minX) minX = x; if (y < minY) minY = y;
        if (x > maxX) maxX = x; if (y > maxY) maxY = y;
    }
    const w = maxX - minX, h = maxY - minY, sz = Math.min(w, h);
    if (sz < 1e-10) return [(minX + maxX) / 2, (minY + maxY) / 2];

    const queue = [];
    const push = c => { queue.push(c); queue.sort((a, b) => a.max - b.max); };
    const pop  = () => queue.pop();
    const cell = (cx, cy, hs) => { const d = _ptRingDist(cx, cy, ring); return { x: cx, y: cy, h: hs, d, max: d + hs * 1.41422 }; };

    let hs = sz / 2;
    for (let x = minX; x < maxX; x += sz)
        for (let y = minY; y < maxY; y += sz)
            push(cell(x + hs, y + hs, hs));

    let best = cell((minX + maxX) / 2, (minY + maxY) / 2, 0);

    while (queue.length) {
        const c = pop();
        if (c.d > best.d) best = c;
        if (c.max - best.d <= precision) continue;
        hs = c.h / 2;
        push(cell(c.x - hs, c.y - hs, hs));
        push(cell(c.x + hs, c.y - hs, hs));
        push(cell(c.x - hs, c.y + hs, hs));
        push(cell(c.x + hs, c.y + hs, hs));
    }
    return [best.x, best.y];
}

// A: recorre shapes UNA sola vez y rellena todos los caches
function buildCaches() {
    const shapes = dsPolygons ? dsPolygons.getShapes() || [] : [];
    for (const sh of shapes) {
        const props = sh.getProperties ? sh.getProperties() : {};
        const tipo = String(props.Type || '').toLowerCase();
        const id = String(props.id ?? '');
        if (!id) continue;

        if (tipo === 'departamento') {
            deptShapeCache[id] = sh;
            deptNameCache[id]  = props.name || '';
            try {
                const geojson = sh.toJson();
                const bbox = atlas.data.BoundingBox.fromData(geojson);
                if (bbox) {
                    deptBboxCache[id] = bbox;
                    // Todos los anillos exteriores para punto-en-polígono exacto
                    const rings = [];
                    if (geojson.geometry?.type === 'Polygon') {
                        rings.push(geojson.geometry.coordinates[0]);
                    } else if (geojson.geometry?.type === 'MultiPolygon') {
                        for (const poly of geojson.geometry.coordinates) rings.push(poly[0]);
                    }
                    if (rings.length) deptRingsCache[id] = rings;
                    const center = polyCentroid(sh);
                    deptCentroidCache[id] = center || [(bbox[0] + bbox[2]) / 2, (bbox[1] + bbox[3]) / 2];
                }
            } catch (_) {}
        } else if (tipo === 'municipio') {
            muniShapeCache[id] = sh;
            muniNameCache[id]  = props.name || '';
            try {
                const bbox = atlas.data.BoundingBox.fromData(sh.toJson());
                if (bbox) {
                    muniBboxCache[id]     = bbox;
                    muniCentroidCache[id] = [(bbox[0] + bbox[2]) / 2, (bbox[1] + bbox[3]) / 2];
                }
            } catch (_) {}
        }
    }
    console.log(`[Cache] deptos:${Object.keys(deptCentroidCache).length} munis:${Object.keys(muniCentroidCache).length}`);
}

// A: lookup directo en cache en vez de iterar shapes
function buildDeptCentroidPinForActiveMuni() {
    let deptId = activeDeptId;
    let deptName = activeDeptLabel;

    if (!deptId) {
        const muniVal = $('#f_municipio').val();
        const item = allMunicipioItems.find(it => String(it.value) === String(muniVal));
        if (!item || !item.dependsOn || !item.dependsOn.length) return null;
        deptId = String(item.dependsOn[0].id || '');
        deptName = deptNameCache[deptId] || '';
    }

    if (!deptId || !deptCentroidCache[deptId]) return null;
    return {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: deptCentroidCache[deptId] },
        properties: { type: 'dept-centroid', deptId, deptName, id: `dept-${deptId}` }
    };
}

// Bbox pre-filtro + punto-en-polígono para identificar deptos con proyectos geolocalizados.
// El conteo inicial es solo geo; se actualiza con fetchDeptPopupData en segundo plano.
function buildDeptCentroidPins(feats) {
    if (!Object.keys(deptBboxCache).length) return [];

    const deptData = {};
    for (const f of feats) {
        const [lon, lat] = f.geometry.coordinates;
        for (const [deptId, bbox] of Object.entries(deptBboxCache)) {
            const [minLon, minLat, maxLon, maxLat] = bbox;
            if (lon < minLon || lon > maxLon || lat < minLat || lat > maxLat) continue;
            const rings = deptRingsCache[deptId];
            if (rings && !rings.some(r => _pointInRing(lon, lat, r))) continue;
            if (!deptData[deptId]) deptData[deptId] = { count: 0, value: 0 };
            deptData[deptId].count++;
            const v = toNumber(f.properties?.value);
            if (v !== null) deptData[deptId].value += v;
            break;
        }
    }

    return Object.entries(deptData)
        .filter(([deptId]) => deptCentroidCache[deptId])
        .map(([deptId, { count, value }]) => ({
            type: 'Feature',
            geometry: { type: 'Point', coordinates: deptCentroidCache[deptId] },
            properties: { type: 'dept-centroid', deptId, deptName: deptNameCache[deptId] || '', id: `dept-${deptId}`, count, value }
        }));
}

function collectFilters() {
    const obj = {};
    $filtersContainer.find('select').each(function () {
        const k = this.id.replace(/^f_/, '');
        const multiple = this.hasAttribute('multiple');
        const vals = getSelected($(this), multiple);
        if (!vals.length) return;
        obj[k] = multiple ? vals.join(',') : vals[0];
    });
    return obj;
}

// ======= POPUP / BOTTOM SHEET (P2) =======
function isMobile() { return window.innerWidth <= 768; }

function setupBottomSheet() {
    if ($('#mapBottomSheet').length) return;
    $('body').append(`<div id="mapBottomSheet">
        <div class="map-bs-handle"></div>
        <button class="map-bs-close" id="mapBsClose" aria-label="Cerrar">✕</button>
        <div id="mapBsContent"></div>
    </div>`);
    $('#mapBsClose').on('click', closeMapInfo);
}

function showMapInfo(pos, html) {
    if (isMobile()) {
        $('#mapBsContent').html(html);
        $('#mapBottomSheet').addClass('open');
    } else {
        if (!window._popup) window._popup = new atlas.Popup({ pixelOffset: [0, -18] });
        window._popup.setOptions({ position: pos, content: html });
        window._popup.open(map);
    }
}

function updateMapInfo(html) {
    if (isMobile()) {
        $('#mapBsContent').html(html);
    } else {
        if (window._popup) window._popup.setOptions({ content: html });
    }
}

function closeMapInfo() {
    $('#mapBottomSheet').removeClass('open');
    if (window._popup) window._popup.close();
}

// ======= ICONOS Y LEYENDA (P3) =======
// Colores de los pines por inversión, de menor a mayor.
// Los cortes NO son fijos (decidido con el usuario 2026-11-06): se calculan al cargar el mapa con los totales de
// las comunas/corregimientos (quintiles, ver calcularCortesInversion). Antes eran cortes fijos en guaraníes del
// fork PY (2e12…6e13, rótulos "M ₲"). Con los datos actuales (totales casi iguales, ~$ 6,3–7,0 billones por comuna)
// unos cortes fijos dejarían todo del mismo color.
const VOLUME_COLORS = ['#c6dbef', '#6baed6', '#2171b5', '#084594', '#08306b'];
let volumeBreaks = [];   // en pesos, ascendentes; el tramo i es "valor < volumeBreaks[i]"

// Índice de color del tramo i cuando hay k cortes (k+1 tramos): reparte los tramos en toda la escala de colores.
function colorTramo(i, k) {
    if (k === 0) return 2;
    return Math.round(i * (VOLUME_COLORS.length - 1) / k);
}

// Redondea a 4 cifras significativas en millones (p. ej. 6.606.093 M → 6.606.000 M) para que la leyenda sea legible.
function redondearCorte(valor) {
    const millones = valor / 1000000;
    if (millones <= 0) return 0;
    const paso = Math.pow(10, Math.max(0, Math.floor(Math.log10(millones)) - 3));
    return Math.round(millones / paso) * paso * 1000000;
}

function calcularCortesInversion(totales) {
    const vals = (totales || []).filter(v => v > 0).sort((a, b) => a - b);
    const cortes = [];
    if (vals.length >= 2) {
        [0.2, 0.4, 0.6, 0.8].forEach(q => {
            const corte = redondearCorte(vals[Math.min(vals.length - 1, Math.floor(q * vals.length))]);
            if (corte > vals[0] && cortes.indexOf(corte) === -1) cortes.push(corte);
        });
    }
    volumeBreaks = cortes.sort((a, b) => a - b);
}

// Tramos para la leyenda, con montos en $ Millones y separadores es-CO.
function rangosInversion() {
    const fmt = v => '$ ' + (v / 1000000).toLocaleString('es-CO', { maximumFractionDigits: 0 });
    const k = volumeBreaks.length;
    if (k === 0) return [{ color: VOLUME_COLORS[colorTramo(0, 0)], label: 'Con inversión' }];
    const rangos = [{ color: VOLUME_COLORS[colorTramo(0, k)], label: `Menos de ${fmt(volumeBreaks[0])}` }];
    for (let i = 1; i < k; i++) {
        rangos.push({ color: VOLUME_COLORS[colorTramo(i, k)], label: `${fmt(volumeBreaks[i - 1])} – ${fmt(volumeBreaks[i])}` });
    }
    rangos.push({ color: VOLUME_COLORS[colorTramo(k, k)], label: `${fmt(volumeBreaks[k - 1])} o más` });
    return rangos;
}

// Registra iconos SVG circulares en el sprite del mapa (dept = borde blanco, muni = borde rojo)
async function setupMapIcons() {
    const makeSvg = (color, stroke) =>
        `data:image/svg+xml;charset=utf-8,` + encodeURIComponent(
            `<svg xmlns="http://www.w3.org/2000/svg" width="44" height="44">` +
            `<circle cx="22" cy="22" r="19" fill="${color}" stroke="${stroke}" stroke-width="3"/>` +
            `</svg>`
        );
    await Promise.all([
        ...VOLUME_COLORS.map((color, i) => Promise.all([
            map.imageSprite.add(`dept-c${i}`, makeSvg(color, 'rgba(255,255,255,0.9)')),
            map.imageSprite.add(`muni-c${i}`, makeSvg(color, '#e53e3e'))
        ])),
        // Ícono ámbar para proyectos sin ubicación exacta (centroide de municipio)
        map.imageSprite.add('approx-pin', makeSvg('#f59e0b', 'rgba(255,255,255,0.9)'))
    ]);
}

// Expresión de icono data-driven:
//   project        → pin-round-blue pequeño (ubicación exacta)
//   project-approx → approx-pin ámbar (centroide de municipio)
//   dept/muni      → círculo coloreado por volumen de inversión
function iconExpr(prefix) {
    const k = volumeBreaks.length;
    const expr = [
        'case',
        ['==', ['get', 'type'], 'project'],        'pin-round-blue',
        ['==', ['get', 'type'], 'project-approx'], 'approx-pin'
    ];
    volumeBreaks.forEach((corte, i) => {
        expr.push(['all', ['has', 'value'], ['<', ['get', 'value'], corte]], `${prefix}-c${colorTramo(i, k)}`);
    });
    expr.push(['has', 'value'], `${prefix}-c${colorTramo(k, k)}`, 'pin-round-blue');
    return expr;
}

// Texto:
//   project        → vacío (solo ícono)
//   project-approx → count (cuántos proyectos agrupados)
//   dept/muni      → count del pin numerado
const countTextExpr = [
    'case',
    ['==', ['get', 'type'], 'project'], '',
    ['has', 'count'], ['to-string', ['get', 'count']],
    ''
];

// Tamaño por tipo
const sizeExpr = [
    'case',
    ['==', ['get', 'type'], 'project'],        0.7,
    ['==', ['get', 'type'], 'project-approx'],
        ['interpolate', ['linear'], ['get', 'count'], 1, 0.8, 20, 1.1],
    ['has', 'count'],
        ['interpolate', ['linear'], ['get', 'count'], 1, 0.65, 100, 1.45],
    0.9
];

function setupColorLegend() {
    if ($('#deptMarkerLegend').length) return;
    $('.map-viewport').append(
        `<div id="deptMarkerLegend" class="dept-legend" style="display:none">
            <div class="legend-title">Inversión ($ Millones)</div>
            <div class="legend-items"></div>
        </div>`
    );
    actualizarLeyendaInversion();
}

// Redibuja los tramos de la leyenda (se llama de nuevo cuando se calculan los cortes).
function actualizarLeyendaInversion() {
    const items = rangosInversion().map(r =>
        `<div class="legend-item">
            <span class="legend-swatch" style="background:${r.color}"></span>
            <span>${r.label}</span>
        </div>`
    ).join('');
    $('#deptMarkerLegend .legend-items').html(items);
}

// ======= URL COMPARTIBLE (P5) =======
let _urlParams = null;

function parseUrlParams() {
    _urlParams = new URLSearchParams(window.location.search);
}

function applyUrlFilters() {
    if (!_urlParams || !_urlParams.toString()) return;
    ['estado', 'sector', 'periods', 'entidadejecutora'].forEach(k => {
        const v = _urlParams.get(k);
        if (v) $(`#f_${k}`).val(v);
    });
    const dept = _urlParams.get('departamento');
    const muni = _urlParams.get('municipio');
    if (dept) {
        $('#f_departamento').val(dept);
        activeDeptId    = dept;
        activeDeptLabel = $(`#f_departamento option[value="${dept}"]`).text();
        applyMunicipioFilter(dept);
        updateHighlight('departamento', dept);
    }
    if (muni) {
        $('#f_municipio').val(muni);
        activeFilterLabel = $(`#f_municipio option[value="${muni}"]`).text();
        updateHighlight('municipio', muni);
    }
    updateActiveFilterBadge();
}

function applyUrlCamera() {
    if (!_urlParams) return;
    const lat  = parseFloat(_urlParams.get('lat'));
    const lng  = parseFloat(_urlParams.get('lng'));
    const zoom = parseInt(_urlParams.get('zoom'));
    if (!isNaN(lat) && !isNaN(lng) && map) {
        _programmaticMove = true;
        map.setCamera({ center: [lng, lat], zoom: isNaN(zoom) ? 8 : zoom, type: 'jump' });
    }
}

function updateUrl() {
    const params = new URLSearchParams();
    Object.entries(collectFilters()).forEach(([k, v]) => { if (v) params.set(k, v); });
    if (map) {
        const cam = map.getCamera();
        if (cam?.center) {
            params.set('lat',  cam.center[1].toFixed(5));
            params.set('lng',  cam.center[0].toFixed(5));
            params.set('zoom', Math.round(cam.zoom || 6));
        }
    }
    const qs = params.toString();
    window.history.replaceState(null, '', qs ? '?' + qs : window.location.pathname);
}

// ======= RESUMEN DINÁMICO (P5) =======
function updateInvestmentSummary(objects) {
    const total = (objects || []).reduce((s, o) => s + (toNumber(o.value) || 0), 0);
    const $el = $('#investmentSummary');
    if (total > 0) {
        $el.html(`Inversión: <strong>${money(total)}</strong>`).show();
    } else {
        $el.hide();
    }
}

// Pre-carga los datos de todos los departamentos en paralelo una sola vez al iniciar.
// Llena deptPopupCache para que searchAndRender y los clicks sean instantáneos.
async function prefetchDeptData() {
    const entries = Object.keys(deptCentroidCache);
    if (!entries.length) return;
    // Además de llenar la caché, devuelve el total de inversión de cada comuna/corregimiento para los cortes de la leyenda.
    const totales = await Promise.all(entries.map(deptId =>
        fetchDeptPopupData(deptId, deptNameCache[deptId] || '')
            .then(({ objs }) => objs.reduce((s, o) => s + (toNumber(o.value) || 0), 0))
            .catch(() => 0)
    ));
    calcularCortesInversion(totales);
    actualizarLeyendaInversion();
    console.log(`[Prefetch] ${entries.length} deptos en caché · cortes de inversión (M):`,
        volumeBreaks.map(v => (v / 1000000).toLocaleString('es-CO', { maximumFractionDigits: 0 })).join(' | '));
}

// ======= MAPA =======
function initMap() {
    map = new atlas.Map('map', {

        center: [-73.1198, 7.1254], // [lng, lat] - Bucaramanga
        zoom: 12,
        language: 'es-CO',
        style: 'road',
        authOptions: { authType: 'subscriptionKey', subscriptionKey: MAP_KEY }
    });

    map.events.add('ready', async () => {

        // Desactivar zoom con scroll
        map.setUserInteraction({
            scrollZoomInteraction: false
        });

        //Agregar controles de zoom (+ / -) en la esquina superior derecha
        map.controls.add(new atlas.control.ZoomControl(), {
            position: 'top-right'
        });

        // Polígonos
        dsPolygons = new atlas.source.DataSource();
        map.sources.add(dsPolygons);

        polyFillLayer = new atlas.layer.PolygonLayer(dsPolygons, null, {
            fillOpacity: 0.18,
            fillColor: '#FFEBD8'
        });
        polyLineLayer = new atlas.layer.LineLayer(dsPolygons, null, {
            strokeColor: '#795548',
            strokeWidth: 1.6
        });
        map.layers.add([polyFillLayer, polyLineLayer], 'labels');

        // Capa de hover (entre polígonos y el highlight de selección)
        dsHover = new atlas.source.DataSource();
        map.sources.add(dsHover);
        hoverFillLayer = new atlas.layer.PolygonLayer(dsHover, null, {
            fillOpacity: 0.22,
            fillColor: '#4a90e2'
        });
        hoverLineLayer = new atlas.layer.LineLayer(dsHover, null, {
            strokeColor: '#4a90e2',
            strokeWidth: 2
        });
        map.layers.add([hoverFillLayer, hoverLineLayer], 'labels');

        // Hover: solo activo cuando hay departamento seleccionado (muestra municipios)
        map.events.add('mousemove', polyFillLayer, e => {
            if (!activeDeptId) {
                dsHover.clear();
                _lastHoveredShapeId = null;
                return;
            }
            const sh = (e.shapes || []).find(s =>
                String(s.getProperties?.()?.Type || '').toLowerCase() === 'municipio'
            );
            if (!sh) {
                map.getCanvasContainer().style.cursor = '';
                dsHover.clear();
                _lastHoveredShapeId = null;
                return;
            }
            const shapeId = sh.getProperties?.()?.id;
            map.getCanvasContainer().style.cursor = 'pointer';
            if (shapeId === _lastHoveredShapeId) return;
            _lastHoveredShapeId = shapeId;
            dsHover.clear();
            try { dsHover.add(sh.toJson()); } catch (_) {}
        });
        map.events.add('mouseleave', polyFillLayer, () => {
            map.getCanvasContainer().style.cursor = '';
            dsHover.clear();
            _lastHoveredShapeId = null;
        });

        // Capa de resaltado para depto/municipio seleccionado (encima de polígonos, debajo de pines)
        dsHighlight = new atlas.source.DataSource();
        map.sources.add(dsHighlight);
        highlightFillLayer = new atlas.layer.PolygonLayer(dsHighlight, null, {
            fillOpacity: 0.35,
            fillColor: '#0B3E68'
        });
        highlightLineLayer = new atlas.layer.LineLayer(dsHighlight, null, {
            strokeColor: '#0B3E68',
            strokeWidth: 3.5
        });
        map.layers.add([highlightFillLayer, highlightLineLayer], 'labels');

        // Puntos
        dsPoints = new atlas.source.DataSource();
        map.sources.add(dsPoints);

        symbolLayer = new atlas.layer.SymbolLayer(dsPoints, 'projects-layer', {
            iconOptions: { image: 'pin-round-blue', size: 0.9, allowOverlap: true, ignorePlacement: true },
            textOptions: {}
        });
        map.layers.add(symbolLayer);

        // Cursor interactivo y popup al hacer click en un pin
        map.events.add('mouseenter', symbolLayer, () => {
            map.getCanvasContainer().style.cursor = 'pointer';
        });
        map.events.add('mouseleave', symbolLayer, () => {
            map.getCanvasContainer().style.cursor = '';
        });
        map.events.add('click', symbolLayer, e => {
            if (!e.shapes || !e.shapes.length) return;
            _pinClicked = true;
            const sh = e.shapes[0];
            const pos = sh.getCoordinates ? sh.getCoordinates() : e.position;
            const pr = sh.getProperties ? sh.getProperties() : {};

            // Pin de proyectos sin ubicación exacta (agrupados en centroide de municipio)
            if (pr.type === 'project-approx') {
                const cnt = pr.count || 0;
                const valStr = isNumLike(pr.value) && pr.value > 0 ? ` · ${money(pr.value)}` : '';
                showMapInfo(pos, `<div class="map-popup">
                    <strong class="popup-title">Ubicación aproximada</strong>
                    <div class="popup-row">
                        <span>${cnt} proyecto${cnt !== 1 ? 's' : ''} sin coordenada exacta${valStr}</span>
                    </div>
                    <p style="font-size:.78rem;color:#6b7280;margin:.4rem 0 0;">
                        La posición corresponde al centroide de la comuna o corregimiento.
                        Los proyectos aparecen en el listado inferior.
                    </p>
                    <a href="#" class="popup-link" style="display:block;margin-top:.5rem;text-align:right;"
                        onclick="event.preventDefault();document.querySelector('section.results').scrollIntoView({behavior:'smooth'})">
                        Ver en listado ↓
                    </a>
                </div>`);
                return;
            }

            // Pin individual de proyecto (zoom alto)
            if (pr.type === 'project') {
                const tipoTag   = pr.tipoProyecto ? `<span class="popup-tag popup-tag--alcance">${pr.tipoProyecto}</span>` : '';
                const estadoTag = pr.state        ? `<span class="popup-tag">${pr.state}</span>` : '';
                const valStr    = isNumLike(pr.value) ? `<div class="popup-row"><span>${money(pr.value)}</span></div>` : '';
                const link      = pr.url && pr.url !== '#'
                    ? `<a href="${pr.url}" class="popup-link" target="_blank" rel="noopener">Ver proyecto →</a>` : '';
                showMapInfo(pos, `<div class="map-popup">
                    <strong class="popup-title">${pr.name || 'Proyecto'}</strong>
                    <div class="popup-tags">${tipoTag}${estadoTag}</div>
                    ${valStr}${link}
                </div>`);
                // Marcar tarjeta activa en el listado y hacer scroll hasta ella
                $('#resultsList [data-id]').removeClass('active');
                const $card = $(`#resultsList [data-id="${pr.id}"]`).addClass('active');
                if ($card.length) $card[0].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                return;
            }

            if (activeDeptLabel) {
                const clearBtn = clearFilterBtn();
                if (activeFilterLabel && activeDeptId) {
                    // Muni también activa: obtener datos del departamento completo (sin filtro muni)
                    showMapInfo(pos, `<div class="map-popup"><span class="muted">Cargando...</span></div>`);
                    fetchDeptPopupData(activeDeptId, activeDeptLabel)
                        .then(({ objs, deptName }) => {
                            updateMapInfo(buildGroupedPopupHtmlFromObjects(objs, deptName, clearBtn));
                        })
                        .catch(() => {
                            updateMapInfo(buildGroupedPopupHtmlFromObjects(lastSearchObjects, activeDeptLabel, clearBtn));
                        });
                } else {
                    // Solo filtro de departamento: lastSearchObjects ya es del departamento
                    showMapInfo(pos, buildGroupedPopupHtmlFromObjects(lastSearchObjects, activeDeptLabel, clearBtn));
                }
                return;
            }

            // Sin filtro geográfico: click en pin de dept → selecciona el combo (igual que elegir del filtro)
            const deptId = pr.deptId || '';
            if (deptId) {
                $('#f_departamento').val(deptId).trigger('change');
            }
        });

        // Pin rojo en centroide del municipio seleccionado
        dsSelectedMuniPin = new atlas.source.DataSource();
        map.sources.add(dsSelectedMuniPin);
        symbolLayerSelectedMuni = new atlas.layer.SymbolLayer(dsSelectedMuniPin, 'muni-centroid-layer', {
            iconOptions: { image: 'pin-round-red', size: 1.1, allowOverlap: true, ignorePlacement: true },
            textOptions: {}
        });
        map.layers.add(symbolLayerSelectedMuni);
        map.events.add('mouseenter', symbolLayerSelectedMuni, () => {
            map.getCanvasContainer().style.cursor = 'pointer';
        });
        map.events.add('mouseleave', symbolLayerSelectedMuni, () => {
            map.getCanvasContainer().style.cursor = '';
        });
        map.events.add('click', symbolLayerSelectedMuni, e => {
            if (!e.shapes || !e.shapes.length) return;
            _pinClicked = true;
            const sh = e.shapes[0];
            const pr = sh.getProperties ? sh.getProperties() : {};
            const pos = sh.getCoordinates ? sh.getCoordinates() : e.position;
            showMapInfo(pos, buildGroupedPopupHtmlFromObjects(
                lastSearchObjects,
                activeFilterLabel || pr.muniName || '',
                clearFilterBtn()
            ));
        });

        // Click global del mapa: maneja selección de polígonos.
        // Dispara DESPUÉS de los clicks de capas específicas (symbolLayer, symbolLayerSelectedMuni),
        // por lo que _pinClicked ya refleja si se hizo click en un pin.
        map.events.add('click', () => {
            if (_pinClicked) {
                _pinClicked = false;
                return;
            }
            // Usar el shape en hover (actualizado por mousemove, siempre disponible en desktop)
            const hoveredShapes = dsHover ? dsHover.getShapes() : [];
            if (!hoveredShapes.length) return;
            const sh   = hoveredShapes[0];
            const pr   = sh.getProperties ? sh.getProperties() : {};
            const tipo = String(pr.Type || '').toLowerCase();
            const id   = String(pr.id ?? '');
            if (!id) return;

            if (tipo === 'municipio') {
                if (!$(`#f_municipio option[value="${id}"]`).length) {
                    $('#f_departamento').val('');
                    activeDeptId   = '';
                    activeDeptLabel = '';
                    applyMunicipioFilter('');
                }
                if ($(`#f_municipio option[value="${id}"]`).length) {
                    $('#f_municipio').val(id).trigger('change');
                }
            } else if (tipo === 'departamento' && id !== activeDeptId) {
                $('#f_departamento').val(id).trigger('change');
            }
        });

        await loadPolygons();
        buildCaches();
        await setupMapIcons();
        await prefetchDeptData();
        applyUrlCamera();          // restaurar cámara desde URL si existe

        // Configurar symbolLayer con iconos data-driven (color por volumen, texto = count)
        symbolLayer.setOptions({
            iconOptions: {
                image: iconExpr('dept'), size: sizeExpr,
                anchor: 'center',          // centra el icono sobre la posición geográfica
                allowOverlap: true, ignorePlacement: true
            },
            textOptions: {
                textField: countTextExpr, color: '#fff', size: 13,
                anchor: 'center', offset: [0, 0],  // texto centrado sobre el icono
                allowOverlap: true, ignorePlacement: true, font: ['StandardFont-Bold']
            }
        });

        // Configurar symbolLayerSelectedMuni igual pero con iconos de borde rojo
        symbolLayerSelectedMuni.setOptions({
            iconOptions: {
                image: iconExpr('muni'),
                size: ['case', ['has', 'count'],
                    ['interpolate', ['linear'], ['get', 'count'], 1, 0.8, 100, 1.6], 1.1],
                anchor: 'center',
                allowOverlap: true, ignorePlacement: true
            },
            textOptions: {
                textField: countTextExpr, color: '#fff', size: 13,
                anchor: 'center', offset: [0, 0],
                allowOverlap: true, ignorePlacement: true, font: ['StandardFont-Bold']
            }
        });

        loadProjectList(true);
        searchAndRender();
    });

    // mousedown siempre dispara ANTES que click → lo usamos para resetear el flag de pin
    // al inicio de cada nueva interacción del usuario, garantizando que el polígono
    // no se bloquee indefinidamente si el click anterior fue sobre un pin.
    map.events.add('mousedown', () => { _pinClicked = false; });

    // C: debounce 0 para movimientos programáticos, 250ms para movimientos del usuario
    ['moveend', 'zoomend'].forEach(evt => {
        map.events.add(evt, () => {
            const wasProgrammatic = _programmaticMove;
            _programmaticMove = false;
            closeMapInfo();   // el popup es de un estado anterior; cerrarlo evita info desactualizada
            clearTimeout(mvTimer);
            mvTimer = setTimeout(() => {
                listState.page = 1;
                loadProjectList(true);
                searchAndRender();
            }, wasProgrammatic ? 0 : 250);
        });
    });
}

async function loadPolygons() {
    try {
        const muniUrl = `/api/poligonos/municipio`;
        const deptUrl = `/api/poligonos/departamento`;

        const [mRes, dRes] = await Promise.all([fetch(muniUrl), fetch(deptUrl)]);
        const [mJson, dJson] = await Promise.all([mRes.json(), dRes.json()]);

        const feats = [
            ...toFeatures(mJson),
            ...toFeatures(dJson)
        ];
        const cleaned = sanitizeFeatures(feats);

        dsPolygons.clear();
        if (cleaned.length) {
            dsPolygons.add({ type: 'FeatureCollection', features: cleaned });
            try {
                // Al abrir: zona urbana (17 comunas), igual que "Limpiar".
                _programmaticMove = true; map.setCamera({ bounds: URBAN_BOUNDS, padding: 30 });
            } catch (_) { }
            console.log(`[Polygons] cargados:${cleaned.length}`);
        } else {
            console.warn('[Polygons] respuesta sin features válidas');
        }
    } catch (err) {
        console.error('[Polygons] error:', err);
    }
}

// ======= VIEWPORT + QUERY =======
function getViewportParams() {
    if (!map || !map.getCamera) return {};
    const cam = map.getCamera();
    const center = `${cam.center[1]},${cam.center[0]}`; // lat,lng

    let topLeft, bottomRight;
    const b = cam.bounds;
    if (b) {
        if (Array.isArray(b) && b.length === 4) {
            const [minLon, minLat, maxLon, maxLat] = b;
            topLeft = `${maxLat},${minLon}`;
            bottomRight = `${minLat},${maxLon}`;
        } else {
            topLeft = `${b.north},${b.west}`;
            bottomRight = `${b.south},${b.east}`;
        }
    }
    return { zoom: cam.zoom, center, topLeft, bottomRight };
}

function buildCommonQuery() {
    const q = Object.fromEntries(Object.entries({
        ...getViewportParams(),
        ...collectFilters()
    }).filter(([, v]) => v != null && String(v).length));
    if (_esAsuncion(activeDeptLabel) || _esAsuncion(activeFilterLabel)) {
        q.incluyeNacionales = '1';
    }
    return q;
}

// ======= MAP – BÚSQUEDA Y RENDER =======
function mapApiObjectsToFeatures(resp) {
    const feats = [];
    (resp?.objects || []).forEach(o => {
        if (o?.type === 'group' || o?.type === 'project') {
            const lat = toNumber(o.latitude);
            const lon = toNumber(o.longitude);
            if (lat !== null && lon !== null && !(Math.abs(lat) < 0.001 && Math.abs(lon) < 0.001)) {
                const props = {
                    id: String(o.location ?? o.id ?? `${lat},${lon}`)
                };
                if (isNumLike(o.count)) props.count = Number(o.count);
                if (isNumLike(o.totalValue)) props.totalValue = Number(o.totalValue);
                if (isNumLike(o.approvedTotalMoney)) props.approvedTotalMoney = Number(o.approvedTotalMoney);
                if (o.name) props.name = String(o.name);
                if (o.state) props.state = String(o.state);
                if (o.url) props.url = String(o.url);
                if (o.tipoProyecto) props.tipoProyecto = String(o.tipoProyecto);
                if (isNumLike(o.value)) props.value = Number(o.value);
                if (o.isApproximate) props.isApproximate = true;
                if (o.isNacional) props.isNacional = true;
                if (o.bpin) props.bpin = String(o.bpin);
                if (o.ejecutor) props.ejecutor = String(o.ejecutor);

                feats.push({
                    type: 'Feature',
                    geometry: { type: 'Point', coordinates: [lon, lat] },
                    properties: props
                });
            }
        }
    });
    return feats;
}

// Procesa la respuesta de /busqueda (o datos del caché) y actualiza el mapa.
// Separado de searchAndRender para poder llamarlo tanto desde el fetch como desde caché.
async function _processSearchResult(mySeq, json) {
            if (mySeq !== searchSeq) return;

            lastSearchObjects = Array.isArray(json?.objects) ? json.objects : [];
            const feats = sanitizeFeatures(mapApiObjectsToFeatures(json));

            if (activeFilterLabel) {
                // ── Filtro de municipio activo ──────────────────────────────────────
                // lastSearchObjects ya viene filtrado por dept+muni → conteo exacto
                const muniCount = lastSearchObjects.length;
                const muniValue = lastSearchObjects.reduce((s, o) => s + (toNumber(o.value) || 0), 0);

                // Crear el pin rojo del municipio aquí (con count/value reales, no en updateSelectedMuniPin)
                const muniVal = $('#f_municipio').val();
                if (muniVal && dsSelectedMuniPin) {
                    const idStr = String(muniVal);
                    const center = muniCentroidCache[idStr];
                    if (center) {
                        dsSelectedMuniPin.clear();
                        dsSelectedMuniPin.add(new atlas.data.Feature(
                            new atlas.data.Point(center),
                            { muniId: idStr, muniName: muniNameCache[idStr] || '', count: muniCount, value: muniValue }
                        ));
                    }
                }

                // Con municipio activo no se muestra pin de departamento.
                // El contexto del depto queda dado por el polígono resaltado y el badge del filtro.
                dsPoints.clear();

            } else if (activeDeptId) {
                // ── Filtro de departamento activo (sin municipio) ───────────────────
                const totalCount = lastSearchObjects.length;
                const totalValue = lastSearchObjects.reduce((s, o) => s + (toNumber(o.value) || 0), 0);
                const zoom       = map.getCamera()?.zoom ?? 0;
                const center     = deptCentroidCache[activeDeptId];

                if (MOSTRAR_PINES_PROYECTO && zoom >= ZOOM_PROJECT_LEVEL && feats.length > 0) {
                    // Zoom alto → exactos individuales + aproximados agrupados por muni
                    const exactFeats  = feats.filter(f => !f.properties.isApproximate);
                    const approxFeats = feats.filter(f =>  f.properties.isApproximate);
                    const exactShapes = exactFeats.map(f => new atlas.data.Feature(
                        new atlas.data.Point(f.geometry.coordinates),
                        { ...f.properties, type: 'project' },
                        f.properties.id
                    ));
                    const approxGroups = {};
                    approxFeats.forEach(f => {
                        const [lon, lat] = f.geometry.coordinates;
                        const key = `${lon.toFixed(4)},${lat.toFixed(4)}`;
                        if (!approxGroups[key]) approxGroups[key] = { coords: [lon, lat], count: 0, value: 0 };
                        approxGroups[key].count++;
                        approxGroups[key].value += toNumber(f.properties.value) || 0;
                    });
                    const approxShapes = Object.entries(approxGroups).map(([key, g]) =>
                        new atlas.data.Feature(
                            new atlas.data.Point(g.coords),
                            { type: 'project-approx', count: g.count, value: g.value },
                            `approx-${key}`
                        )
                    );
                    dsPoints.setShapes([...exactShapes, ...approxShapes]);
                } else if (center) {
                    // Zoom bajo → pin único del depto con count/value
                    dsPoints.setShapes([new atlas.data.Feature(
                        new atlas.data.Point(center),
                        { type: 'dept-centroid', deptId: activeDeptId, deptName: activeDeptLabel,
                          id: `dept-${activeDeptId}`, count: totalCount, value: totalValue },
                        `dept-${activeDeptId}`
                    )]);
                } else {
                    dsPoints.clear();
                }

            } else {
                // ── Sin filtro geográfico ───────────────────────────────────────────
                const zoom = map.getCamera()?.zoom ?? 0;

                if (MOSTRAR_PINES_PROYECTO && zoom >= ZOOM_PROJECT_LEVEL && feats.length > 0) {
                    // Zoom alto → pines individuales (exactos) + pines ámbar agrupados (aproximados)
                    const exactFeats  = feats.filter(f => !f.properties.isApproximate);
                    const approxFeats = feats.filter(f =>  f.properties.isApproximate);

                    // Un pin por proyecto con coordenada exacta
                    const exactShapes = exactFeats.map(f => new atlas.data.Feature(
                        new atlas.data.Point(f.geometry.coordinates),
                        { ...f.properties, type: 'project' },
                        f.properties.id
                    ));

                    // Agrupar aproximados por posición (comparten centroide de muni)
                    const approxGroups = {};
                    approxFeats.forEach(f => {
                        const [lon, lat] = f.geometry.coordinates;
                        const key = `${lon.toFixed(4)},${lat.toFixed(4)}`;
                        if (!approxGroups[key]) approxGroups[key] = { coords: [lon, lat], count: 0, value: 0 };
                        approxGroups[key].count++;
                        approxGroups[key].value += toNumber(f.properties.value) || 0;
                    });
                    const approxShapes = Object.entries(approxGroups).map(([key, g]) =>
                        new atlas.data.Feature(
                            new atlas.data.Point(g.coords),
                            { type: 'project-approx', count: g.count, value: g.value },
                            `approx-${key}`
                        )
                    );

                    dsPoints.setShapes([...exactShapes, ...approxShapes]);
                } else {
                    // Un pin por comuna/corregimiento con el acumulado de los proyectos ASIGNADOS a cada uno
                    // (fetchDeptPopupData: filtro departamento=<id>, usa la caché de la precarga y de los filtros).
                    // 2026-11-06: antes, sin filtros, se ubicaba cada punto por geometría (buildDeptCentroidPins):
                    // como los puntos de las comunas 05 y 17 caen en el Escarpe Occidental, esas comunas quedaban
                    // sin pin y salía uno en el corregimiento 104 con 0.
                    const allDeptIds = Object.keys(deptCentroidCache);
                    const enriched = await Promise.all(allDeptIds.map(deptId =>
                        fetchDeptPopupData(deptId, deptNameCache[deptId] || '')
                            .then(({ objs }) => ({ deptId, count: objs.length, value: objs.reduce((s, o) => s + (toNumber(o.value) || 0), 0) }))
                            .catch(() => ({ deptId, count: 0, value: 0 }))
                    ));
                    const shapes = enriched
                        .filter(e => e.count > 0 && deptCentroidCache[e.deptId])
                        .map(e => new atlas.data.Feature(
                            new atlas.data.Point(deptCentroidCache[e.deptId]),
                            { type: 'dept-centroid', deptId: e.deptId, deptName: deptNameCache[e.deptId] || '',
                              id: `dept-${e.deptId}`, count: e.count, value: e.value },
                            `dept-${e.deptId}`
                        ));
                    if (mySeq !== searchSeq) return;
                    dsPoints.setShapes(shapes);
                }
            }

            // Leyenda: visible cuando hay pines de dept/muni; oculta con project pins
            const showLegend = dsPoints.getShapes().some(s => s.getProperties()?.type !== 'project') ||
                               (dsSelectedMuniPin && dsSelectedMuniPin.getShapes().length > 0);
            $('#deptMarkerLegend').toggle(showLegend);

            // Resumen de inversión y URL compartible
            updateInvestmentSummary(lastSearchObjects);
            updateUrl();
}

function searchAndRender() {
    const mySeq = ++searchSeq;

    // Clave de caché: solo filtros activos (el backend ignora el viewport)
    const cacheKey = JSON.stringify(collectFilters());

    // 1. Buscar en _searchCache (resultado previo de /busqueda con estos filtros)
    // 2. Si hay filtro de depto sin muni, deptPopupCache ya tiene los datos del prefetch
    const cachedObjs = _searchCache[cacheKey] ??
        (activeDeptId && !activeFilterLabel ? deptPopupCache[cacheKey] : null);

    if (cachedObjs) {
        _processSearchResult(mySeq, { objects: cachedObjs });
        return;
    }

    // Sin caché → llamada al API
    const url = `${SEARCH_URL}?${new URLSearchParams({ ...buildCommonQuery(), ...SEARCH_FORMAT }).toString()}`;
    try { lastSearchAbort?.abort(); } catch (_) { }
    lastSearchAbort = new AbortController();

    fetch(url, { signal: lastSearchAbort.signal })
        .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
        .then(json => {
            // Guardar en caché para próximas llamadas con los mismos filtros
            _searchCache[cacheKey] = Array.isArray(json?.objects) ? json.objects : [];
            return _processSearchResult(mySeq, json);
        })
        .catch(err => {
            if (err.name === 'AbortError') return;
            console.error('[busqueda] error:', err);
        });
}

// ======= LISTADO + PAGINADOR =======
function cardHtml(p) {
    const title = String(p.name || 'Proyecto');
    const url = p.url || '#';
    const estado = p.state ? `<span class="chip">${p.state}</span>` : '';
    const val = isNumLike(p.value) ? `<span class="chip val">${money(p.value)}</span>` : '';
    const tipo = p.tipoProyecto ? `<span class="chip chip--tipo">${p.tipoProyecto}</span>` : '';
    const snip = p.bpin ? `<span class="chip">SNIP: ${p.bpin}</span>` : '';
    const ejecutor = p.ejecutor ? `<span class="chip chip--ent">${p.ejecutor}</span>` : '';

    return `
    <article class="card" data-id="${p.location ?? p.id ?? ''}">
      <a class="card-title" href="${url}" target="_blank" rel="noopener">${title}</a>
      <div class="meta">${estado}${val}${tipo}${snip}${ejecutor}</div>
    </article>`;
}

function renderPagerNumbers(totalPages, current, maxButtons = 7) {
    if (totalPages <= 1) return '';
    const btn = (n, active = false) => `<button class="pg-btn ${active ? 'active' : ''}" data-page="${n}">${n}</button>`;
    const parts = [];

    const half = Math.floor(maxButtons / 2);
    let start = Math.max(1, current - half);
    let end = Math.min(totalPages, start + maxButtons - 1);
    start = Math.max(1, end - maxButtons + 1);

    if (start > 1) {
        parts.push(btn(1, current === 1));
        if (start > 2) parts.push('<span class="pg-ellipsis">…</span>');
    }
    for (let i = start; i <= end; i++) parts.push(btn(i, i === current));
    if (end < totalPages) {
        if (end < totalPages - 1) parts.push('<span class="pg-ellipsis">…</span>');
        parts.push(btn(totalPages, current === totalPages));
    }
    return parts.join('');
}

function wirePager() {
    $pager.off('click').on('click', 'button', (ev) => {
        const $b = $(ev.currentTarget);
        if ($b.is('[disabled]')) return;

        if ($b.data('role') === 'prev') {
            if (listState.page > 1) { listState.page--; loadProjectList(); }
            return;
        }
        if ($b.data('role') === 'next') {
            if (listState.page < listState.totalPages) { listState.page++; loadProjectList(); }
            return;
        }
        const n = Number($b.data('page'));
        if (n && n !== listState.page) {
            listState.page = n;
            loadProjectList();
        }
    });
}

function drawPager() {
    const prevDisabled = listState.page <= 1;
    const nextDisabled = listState.page >= listState.totalPages || listState.totalPages === 0;

    const numbers = renderPagerNumbers(listState.totalPages, listState.page);
    $pager.html(`
    <button class="pg-btn" data-role="prev" ${prevDisabled ? 'disabled' : ''}>Anterior</button>
    ${numbers}
    <button class="pg-btn" data-role="next" ${nextDisabled ? 'disabled' : ''}>Siguiente</button>
  `);
}

function loadProjectList(resetPage = false) {
    const mySeq = ++listSeq;
    if (resetPage) listState.page = 1;

    const q = {
        ...buildCommonQuery(),
        listMode: true,
        pageNumber: listState.page,
        page: listState.page,
        pageSize: listState.pageSize
    };
    const url = `${LIST_URL}?${new URLSearchParams(q).toString()}`;

    try { lastListAbort?.abort(); } catch (_) { }
    lastListAbort = new AbortController();
    listState.loading = true;

    fetch(url, { signal: lastListAbort.signal })
        .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
        .then(json => {
            if (mySeq !== listSeq) return;

            const arr = Array.isArray(json?.objects) ? json.objects : [];
            listState.total = Number(json?.totalProjectsNumber ?? json?.totalNumber ?? arr.length) || 0;
            listState.totalPages = Number(json?.totalPages) || Math.max(1, Math.ceil(listState.total / listState.pageSize));

            if (!arr.length) {
                $resultsList.html(`<div class="muted" style="padding:12px">No hay resultados.</div>`);
            } else {
                $resultsList.html(arr.map(cardHtml).join(''));

                $resultsList.find('[data-id]').on('click', function (ev) {
                    if (ev.target.closest('a')) return;
                    const id = this.getAttribute('data-id');
                    if (!id) return;
                    const shape = dsPoints.getShapeById(String(id));
                    if (!shape) return;

                    // Marcar tarjeta activa
                    $resultsList.find('[data-id]').removeClass('active');
                    $(this).addClass('active');

                    const pos = shape.getCoordinates();
                    map.setCamera({ center: pos, zoom: 14, type: 'ease' });

                    const pr = shape.getProperties ? shape.getProperties() : {};
                    const tipoTag = pr.tipoProyecto ? `<span class="popup-tag popup-tag--alcance">${pr.tipoProyecto}</span>` : '';
                    const estadoTag = pr.state ? `<span class="popup-tag">${pr.state}</span>` : '';
                    const cardLink = pr.url && pr.url !== '#'
                        ? `<a href="${pr.url}" class="popup-link" target="_blank" rel="noopener">Ver proyecto &rarr;</a>` : '';
                    const html = `<div class="map-popup">
                        <strong>${pr.name || 'Proyecto'}</strong>
                        <div class="popup-tags">${tipoTag}${estadoTag}</div>
                        ${cardLink}
                    </div>`;
                    showMapInfo(pos, html);
                });
            }

            $resultsBadge.text(`${listState.total} resultado${listState.total === 1 ? '' : 's'}`);

            drawPager();
            wirePager();

            if (listState.total === 0 && !activeDeptId && !activeFilterLabel) {
                dsPoints && dsPoints.clear();
            }
        })
        .catch(err => {
            if (err.name === 'AbortError') return;
            console.error('[listado] error:', err);
            $resultsList.html(`<div class="muted" style="padding:12px">No fue posible cargar el listado.</div>`);
            listState.total = 0; listState.totalPages = 0; listState.page = 1;
            $resultsBadge.text(`0 proyectos`);
            drawPager();
        })
        .finally(() => { listState.loading = false; });
}

// ======= MOBILE – panel filtros =======
function setupMobileFilters() {
    $filtersFab.on('click', () => {
        $filtersPanel.addClass('open');
        requestAnimationFrame(() => map && map.resize());
    });
    $filtersCloseBtn.on('click', () => {
        $filtersPanel.removeClass('open');
        requestAnimationFrame(() => map && map.resize());
    });

    const onResize = () => {
        if (window.innerWidth > 1024) {
            $filtersPanel.removeClass('open');
            $filtersCloseBtn.hide();
        } else {
            $filtersCloseBtn.toggle($filtersPanel.hasClass('open'));
        }
        requestAnimationFrame(() => map && map.resize());
    };
    new ResizeObserver(onResize).observe(document.body);
    onResize();

    const observer = new MutationObserver(() => {
        if (window.innerWidth <= 1024) {
            $filtersCloseBtn.toggle($filtersPanel.hasClass('open'));
        }
        requestAnimationFrame(() => map && map.resize());
    });
    observer.observe($filtersPanel[0], { attributes: true, attributeFilter: ['class'] });
}

// ======= CARGA DE FILTROS =======
function loadFilters() {
    return fetch(FILTERS_URL)
        .then(r => r.json())
        .then(json => {
            if (!json || !json.filters) throw new Error('Respuesta inválida');
            renderFiltersUI(json.filters);
            applyUrlFilters();   // restaurar filtros desde URL
        })
        .catch(err => {
            console.error('[filtros] error:', err);
            $filtersContainer.html('<div class="control muted">No fue posible cargar los filtros. Revisa CORS/HTTPS.</div>');
        });
}

// ======= LIMPIAR =======
$('#clearBtn').on('click', () => {
    $filtersContainer.find('select').each(function () {
        if (this.hasAttribute('multiple')) $(this).val([]);
        else $(this).val('');
    });
    applyMunicipioFilter('');
    updateHighlight(null, null);
    updateSelectedMuniPin(null);
    dsPoints.clear();
    updateActiveFilterBadge();
    closeMapInfo();
    activeDeptId = '';
    activeDeptLabel = '';
    activeFilterLabel = '';
    listState.page = 1;
    resetCountryView(true);
    loadProjectList(true);
    searchAndRender();
});

// ======= INICIO =======
(function start() {
    parseUrlParams();        // leer params de URL antes de inicializar
    setupMobileFilters();
    setupBottomSheet();
    setupColorLegend();
    initMap();
    loadFilters();
})();
