
// ======= CONFIG =======
const MAP_KEY = "";

// RUTAS SERVICIOS
const FILTERS_URL = `/api/FiltrosTotales/GetFiltros`;
const SEARCH_URL = `/api/serviciosproyectos/busqueda`;
const LIST_URL = `/api/serviciosproyectos/listado`;

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

// ======= HELPERS =======
const $filtersPanel = $('#filtersPanel');
const $filtersContainer = $('#filtersContainer');
const $filtersFab = $('#filtersFab');
const $filtersCloseBtn = $('#filtersCloseBtn');

const $resultsBadge = $('#resultsBadge');
const $resultsList = $('#resultsList');
const $pager = $('#pager');

const money = n => (n == null) ? '-' : Number(n).toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 });

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
    (def.items || []).forEach(it => {
        const text = String(it.name ?? it.label ?? it.value ?? "");
        const val = String(it.value ?? it.code ?? it.name ?? "");
        $sel.append(new Option(text, val));
    });
    $wrap.append($sel);
    return $wrap;
}

function renderFiltersUI(filters) {
    $filtersContainer.empty();
    filters.forEach(def => $filtersContainer.append(renderFilter(def)));
    $filtersContainer.find('select').off('change').on('change', () => {
        listState.page = 1;
        // Primero listado (define total) y luego pines
        loadProjectList(true);
        searchAndRender();
    });
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

// ======= MAPA =======
function initMap() {
    map = new atlas.Map('map', {

        center: [-70.26305393790614, 18.882895871395235], // [lng, lat]
        zoom: 7,
        language: 'es-ES',
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
            position: 'top-right' // puedes usar 'top-left', 'bottom-right', etc.
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

        // Puntos
        dsPoints = new atlas.source.DataSource();
        map.sources.add(dsPoints);

        symbolLayer = new atlas.layer.SymbolLayer(dsPoints, 'projects-layer', {
            iconOptions: { image: 'pin-round-blue', size: 0.9, allowOverlap: true, ignorePlacement: true },
            textOptions: {} // sin texto sobre pines
        });
        map.layers.add(symbolLayer);

        await loadPolygons();

        // primera carga: listado -> mapa
        loadProjectList(true);
        searchAndRender();
    });

    // re-cargar al mover o hacer zoom (debounce)
    ['moveend', 'zoomend'].forEach(evt => {
        map.events.add(evt, () => {
            clearTimeout(mvTimer);
            mvTimer = setTimeout(() => {
                listState.page = 1;
                loadProjectList(true); // primero
                searchAndRender();     // luego
            }, 250);
        });
    });
}

async function loadPolygons() {
    try {
        // Rutas relativas
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
                const bounds = dsPolygons.getBounds();
                if (bounds) map.setCamera({ bounds, padding: 30 });
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
    return Object.fromEntries(Object.entries({
        ...getViewportParams(),
        ...collectFilters()
    }).filter(([, v]) => v != null && String(v).length));
}

// ======= MAP – BÚSQUEDA Y RENDER =======
function mapApiObjectsToFeatures(resp) {
    const feats = [];
    (resp?.objects || []).forEach(o => {
        if (o?.type === 'group') {
            const lat = toNumber(o.latitude);
            const lon = toNumber(o.longitude);
            if (lat !== null && lon !== null) {
                const props = {
                    id: String(o.location ?? o.id ?? `${lat},${lon}`)
                };
                if (isNumLike(o.count)) props.count = Number(o.count);
                if (isNumLike(o.totalValue)) props.totalValue = Number(o.totalValue);
                if (isNumLike(o.approvedTotalMoney)) props.approvedTotalMoney = Number(o.approvedTotalMoney);

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

function searchAndRender() {
    const mySeq = ++searchSeq;
    const url = `${SEARCH_URL}?${new URLSearchParams(buildCommonQuery()).toString()}`;

    try { lastSearchAbort?.abort(); } catch (_) { }
    lastSearchAbort = new AbortController();

    fetch(url, { signal: lastSearchAbort.signal })
        .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
        .then(json => {
            // si llegó una respuesta vieja, se descarta
            if (mySeq !== searchSeq) return;

            const feats = sanitizeFeatures(mapApiObjectsToFeatures(json));

            if (feats.length === 0 && listState.total > 0) {
                return;
            }

            if (feats.length) {
                const shapes = feats.map(f =>
                    new atlas.data.Feature(
                        new atlas.data.Point(f.geometry.coordinates),
                        f.properties || {},
                        (f.properties && f.properties.id) ? String(f.properties.id) : undefined
                    )
                );
                dsPoints.setShapes(shapes);
            } else {
                dsPoints.clear(); // si no hay nada y total==0, limpia
            }
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
    const id = p.location ? `<span class="chip">ID: ${p.location}</span>` : '';

    return `
    <article class="card" data-id="${p.location ?? p.id ?? ''}">
      <a class="card-title" href="${url}" target="_blank" rel="noopener">${title}</a>
      <div class="meta">${estado}${val}${id}</div>
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
        pageNumber: listState.page, // por compatibilidad
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
            if (mySeq !== listSeq) return; // descartar viejo

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

                    const pos = shape.getCoordinates();
                    map.setCamera({ center: pos, zoom: 14, type: 'ease' });

                    const pr = shape.getProperties ? shape.getProperties() : {};
                    const html = `
                    <div class="popup">
                      <strong>${(pr.nombre || pr.name || 'Proyecto')}</strong><br/>
                      ${(pr.sector || pr.state || '')} ${(pr.estado ? '· ' + pr.estado : '')}<br/>
                      ${(pr.municipio || '')}
                    </div>`;
                    (window._popup ||= new atlas.Popup({ pixelOffset: [0, -18] }))
                        .setOptions({ position: pos, content: html })
                        .open(map);
                });
            }

            // Contador del listado
            $resultsBadge.text(`${listState.total} resultado${listState.total === 1 ? '' : 's'}`);

            drawPager();
            wirePager();

            // Si el total es 0 y los pines siguen, limpiamos explícitamente.
            if (listState.total === 0) {
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
            // en error NO limpiamos pines
        })
        .finally(() => { listState.loading = false; });
}

// ======= MOBILE – panel filtros =======
function setupMobileFilters() {
    $filtersFab.on('click', () => {
        $filtersPanel.addClass('open');
        // asegura recomputo de canvas del mapa
        requestAnimationFrame(() => map && map.resize());
    });
    $filtersCloseBtn.on('click', () => {
        $filtersPanel.removeClass('open');
        requestAnimationFrame(() => map && map.resize());
    });

    const onResize = () => {
        if (window.innerWidth > 1024) {
            $filtersPanel.removeClass('open');
            $filtersCloseBtn.hide(); // oculto en desktop
        } else {
            $filtersCloseBtn.toggle($filtersPanel.hasClass('open'));
        }
        // cada cambio de layout fuerza resize del mapa
        requestAnimationFrame(() => map && map.resize());
    };
    new ResizeObserver(onResize).observe(document.body);
    onResize();

    const observer = new MutationObserver(() => {
        if (window.innerWidth <= 1024) {
            $filtersCloseBtn.toggle($filtersPanel.hasClass('open'));
        }
        // al abrir/cerrar panel (clase cambia) → resize
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
    listState.page = 1;
    // primero listado (para total==0) luego pines
    loadProjectList(true);
    searchAndRender();
});

// ======= INICIO =======
(function start() {
    setupMobileFilters();
    initMap();
    loadFilters();
})();
