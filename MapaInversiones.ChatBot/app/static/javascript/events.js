// --- Helpers específicos para entorno móvil / Firefox RDM ---
(function () {
    // Click universal (evita pérdidas/doble-fire en iOS/Android)
    const CLICK = window.PointerEvent ? 'pointerup'
        : ('ontouchstart' in window ? 'touchend' : 'click');
    window.__UNIVERSAL_CLICK__ = CLICK;

    // Listeners "passive" para no bloquear el scroll
    try {
        window.addEventListener('touchstart', function () { }, { passive: true });
        window.addEventListener('touchmove', function () { }, { passive: true });
        window.addEventListener('wheel', function () { }, { passive: true });
    } catch (e) { /* navegadores viejos */ }

    // Captura de errores en dispositivo real (para depurar mobile)
    window.onerror = function (m, s, l, c, e) {
        console.log('[onerror]', { m, s, l, c, e });
    };
    window.onunhandledrejection = function (ev) {
        console.log('[unhandledrejection]', ev && (ev.reason || ev));
    };
    console.log('UA:', navigator.userAgent, 'size:', window.innerWidth + 'x' + window.innerHeight);

    // Fix teclado iOS: asegurar que el input quede visible
    document.addEventListener('DOMContentLoaded', function () {
        var input = document.getElementById('messageInput');
        if (input) {
            input.addEventListener('focus', function () {
                setTimeout(function () { try { input.scrollIntoView({ block: 'nearest' }); } catch (_) { } }, 50);
            });
        }

        // Duplicar envío con pointer/touch además de click (sin romper lo existente)
        var sendBtn = document.getElementById('sendBtn');
        if (sendBtn) {
            sendBtn.addEventListener(CLICK, function (ev) {
                // Evita doble disparo cuando pointerup también genera click
                if (ev && ev.pointerType && ev.pointerType !== 'mouse') {
                    ev.preventDefault();
                    if (typeof sendBtn.click === 'function') sendBtn.click();
                }
            }, { passive: true });
        }
    });

    // Stub de ads por si algún inyectado espera adsbygoogle (evita excepciones)
    if (!('adsbygoogle' in window)) {
        Object.defineProperty(window, 'adsbygoogle', {
            value: { loaded: true, push: function () { } },
            writable: false
        });
    }

    // Guardas no-op para body lock en modales si no están definidas (evita crash)
    if (typeof window.registerBodyLock !== 'function') {
        window.registerBodyLock = function () { /* no-op seguro */ };
    }
    if (typeof window.releaseBodyLock !== 'function') {
        window.releaseBodyLock = function () { /* no-op seguro */ };
    }
})();


// Variables globales
let sidebarExpanded = true;
let isTyping = false;
let selectedCountry = '';
let amountSeparator = {};
let currencyType = '';
let countryDescription = '';
let projectUrl = '';

let fsQ = '';
let pqQ = '';

const historyCache = new Map();

// Configuración fija para República Dominicana (único país activo)
const DEFAULT_COUNTRY_CONFIG = {
    iso3: 'DOM',
    name: 'República Dominicana',
    flag: `<svg width="24" height="18" viewBox="0 0 24 18" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="24" height="18" fill="#FFFFFF"/>
  <rect width="24" height="6" fill="#002D62"/>
  <rect y="12" width="24" height="6" fill="#CE1126"/>
  <rect x="10" width="4" height="18" fill="#FFFFFF"/>
  <rect width="24" height="2" y="8" fill="#FFFFFF"/>
  <g transform="translate(12,9)"><rect x="-1" y="-1" width="2" height="2" fill="#CE1126"/></g>
</svg>`,
    amountSeparator: { decimal: ',', thousand: '.' },
    currencyType: 'DOP',
    fsQuestion: '¿qué sector tiene el mayor número de proyectos paralizados?',
    pqQuestion: 'cuantos proyectos educativos hay',
    description: 'Puedes consultar datos públicos sobre la República Dominicana en el portal de Mapainversiones. Disponemos de conjuntos de datos como Proyectos Aprobados, Fuentes de Financiamiento y Territorios.',
    tooltip: 'Puedes consultar datos públicos sobre la República Dominicana en el portal de Mapainversiones.',
    projectUrl: 'https://mapainversiones.economia.gob.do'
};

// Mantener referencia para compatibilidad con código existente
let defaultCountryConfig = DEFAULT_COUNTRY_CONFIG;

let typingMessageInterval = null;
let typingTimerInterval = null;
let typingStartTime = null;
let currentTypingMessageIndex = 0;

const typingMessages = {
    // Fase inicial (0-5 segundos)
    initial: [
        'Analizando tu pregunta',
        'Procesando tu solicitud',
        'Razonando'
    ],

    // Fase de búsqueda (5-15 segundos)
    searching: [
        'Casi listo, gracias por tu paciencia',
        'Analizando múltiples fuentes',
        'Revisando información oficial',
        'Un momento más, estoy finalizando',
        'Verificando la precisión de los datos',
        'Buscando la mejor respuesta',
    ],

    // Fase de procesamiento (15-30 segundos)
    processing: [
        'Procesando tu consulta con cuidado',
        'Preparando una respuesta detallada',
        'Consultando datos',
        'Analizando datos complejos para darte la mejor información',
        'Revisando múltiples fuentes oficiales',
        'Organizando la información para ti',
    ],

    // Fase de espera extendida (30+ segundos) - Mensajes tranquilizadores
    waiting: [
        'Estoy trabajando en una respuesta completa',
        'Buscando en bases de datos',
        'Asegurando que la respuesta sea precisa',
        'Profundizando en los datos relevantes',
        'Procesando información detallada',
        'Analizando múltiples fuentes oficiales',
    ]
};

let mobileEnhancementsReady = false;
let currentClarification = null;
let currentAssistance = null;
let isFirstInteraction = true;
// Flag para mostrar/ocultar aviso de cuota de sesión (por defecto apagado)
const SHOW_SESSION_NOTICE = false;
function getTimeBasedGreeting() {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
        return { text: 'Buenos días, ¿en qué puedo ayudarte?', period: 'morning' };
    } else if (hour >= 12 && hour < 19) {
        return { text: 'Buenas tardes, ¿en qué puedo ayudarte?', period: 'afternoon' };
    } else {
        return { text: 'Buenas noches, ¿en qué puedo ayudarte?', period: 'night' };
    }
}

/**
 * Inicializa la pantalla de bienvenida Hero
 */
function initWelcomeHero() {
    const heroContainer = document.getElementById('welcomeHero');
    const heroGreetingText = document.getElementById('heroGreetingText');
    const heroGreetingIcon = document.querySelector('.hero-greeting-icon');
    const heroInput = document.getElementById('heroMessageInput');
    const heroSendBtn = document.getElementById('heroSendBtn');
    const heroVoiceBtn = document.getElementById('heroVoiceBtn');
    const heroChips = document.querySelectorAll('.hero-chip');
    const chatContainer = document.querySelector('.chat-container');

    if (!heroContainer) return;

    // Configurar saludo dinámico
    const greeting = getTimeBasedGreeting();
    if (heroGreetingText) {
        //heroGreetingText.textContent = greeting.text;
        //}

        // Cambiar icono según la hora (sol/luna)
        //if (heroGreetingIcon && greeting.period === 'night') {
        //heroGreetingIcon.classList.add('night');
        //heroGreetingIcon.innerHTML = `
        //<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        //<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        // </svg>
        // `;
    }

    // Activar modo hero
    if (chatContainer) {
        chatContainer.classList.add('hero-active');
    }

    // Auto-resize del textarea hero
    if (heroInput) {
        heroInput.addEventListener('input', function () {
            this.style.height = 'auto';
            this.style.height = Math.min(this.scrollHeight, 120) + 'px';
        });

        // Enter para enviar (sin Shift)
        heroInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendHeroMessage();
            }
        });
    }

    // Botón de enviar
    if (heroSendBtn) {
        heroSendBtn.addEventListener('click', sendHeroMessage);
    }

    // Botón de voz (conecta con el sistema existente)
    if (heroVoiceBtn) {
        heroVoiceBtn.addEventListener('click', function () {
            // Si existe reconocimiento de voz, usarlo
            if (typeof voiceRecognition !== 'undefined' && voiceRecognition) {
                if (isListening) {
                    voiceRecognition.stop();
                } else {
                    // Cambiar el target del reconocimiento al input hero
                    const originalOnResult = voiceRecognition.onresult;
                    voiceRecognition.onresult = function (event) {
                        const transcript = event.results[0][0].transcript;
                        if (heroInput) {
                            heroInput.value = transcript;
                            heroInput.dispatchEvent(new Event('input'));
                            heroInput.focus();
                        }
                        showNotification('Texto reconocido correctamente', 'success');
                    };

                    try {
                        voiceRecognition.start();
                        heroVoiceBtn.classList.add('listening');
                    } catch (error) {
                        console.error('Error al iniciar reconocimiento:', error);
                        showNotification('Error al iniciar el micrófono', 'error');
                    }
                }
            } else {
                showNotification('El reconocimiento de voz no está disponible', 'info');
            }
        });
    }

    // Chips de sugerencias
    heroChips.forEach(chip => {
        chip.addEventListener('click', function () {
            const question = this.dataset.question;
            if (question) {
                transitionFromHero(question);
            }
        });
    });

    // Inicializar feather icons para los nuevos botones
    if (typeof feather !== 'undefined') {
        feather.replace();
    }

    console.log('✅ Pantalla Hero inicializada');
}

/**
 * Envía el mensaje desde el input Hero
 */
function sendHeroMessage() {
    const heroInput = document.getElementById('heroMessageInput');
    if (!heroInput) return;

    const message = heroInput.value.trim();
    if (!message) return;

    transitionFromHero(message);
}

/**
 * Transición desde la pantalla Hero hacia el chat normal
 * @param {string} question - La pregunta del usuario
 */
function transitionFromHero(question) {
    const heroContainer = document.getElementById('welcomeHero');
    const chatContainer = document.querySelector('.chat-container');

    if (!question) return;

    // Marcar que ya no es la primera interacción
    isFirstInteraction = false;

    // Ocultar pantalla Hero con animación
    if (heroContainer) {
        heroContainer.style.opacity = '0';
        heroContainer.style.transform = 'translateY(-20px)';
        heroContainer.style.transition = 'opacity 0.3s ease, transform 0.3s ease';

        setTimeout(() => {
            heroContainer.classList.add('hidden');
            heroContainer.style.display = 'none';
        }, 300);
    }

    // Desactivar modo hero
    if (chatContainer) {
        chatContainer.classList.remove('hero-active');
    }

    // Ocultar el welcome message original también
    if (welcomeMessage) {
        welcomeMessage.style.display = 'none';
    }

    // Activar clase de mensajes
    const chatMessages = document.getElementById('chatMessages');
    if (chatMessages) {
        chatMessages.classList.add('has-messages');
    }

    // Asegurar que el país esté configurado
    if (!ensureCountryConfigured()) {
        // Si no hay config, usar el default
        if (defaultCountryConfig) {
            startCountryFlow(defaultCountryConfig, { addMessages: false });
        }
    }

    // Agregar el mensaje del usuario y enviar la pregunta
    addMessage(question, 'user');
    showTypingIndicator();
    sendQuestion(question, Date.now());


    console.log('✅ Transición desde Hero completada');
}

/**
 * Restaura la pantalla Hero (para nuevo chat)
 */
function showWelcomeHero() {
    const heroContainer = document.getElementById('welcomeHero');
    const chatContainer = document.querySelector('.chat-container');
    const heroInput = document.getElementById('heroMessageInput');

    if (!heroContainer) return;

    isFirstInteraction = true;

    // Resetear estilos
    heroContainer.style.opacity = '';
    heroContainer.style.transform = '';
    heroContainer.style.transition = '';
    heroContainer.style.display = '';
    heroContainer.classList.remove('hidden');

    // Activar modo hero
    if (chatContainer) {
        chatContainer.classList.add('hero-active');
    }

    // FIX: Limpiar estilo inline del chat-input-container para que CSS tome control
    const chatInputContainer = document.querySelector('.chat-input-container');
    if (chatInputContainer) {
        chatInputContainer.style.display = '';
    }

    // Limpiar input hero
    if (heroInput) {
        heroInput.value = '';
        heroInput.style.height = '';
    }

    // Actualizar saludo (por si cambió la hora)
    /*const heroGreetingText = document.getElementById('heroGreetingText');
    const heroGreetingIcon = document.querySelector('.hero-greeting-icon');
    
    if (heroGreetingText) {
        const greeting = getTimeBasedGreeting();
        heroGreetingText.textContent = greeting.text;
        
        if (heroGreetingIcon) {
            if (greeting.period === 'night') {
                heroGreetingIcon.classList.add('night');
                heroGreetingIcon.innerHTML = `
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                    </svg>
                `;
            } else {
                heroGreetingIcon.classList.remove('night');
                heroGreetingIcon.innerHTML = `
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="5"/>
                        <line x1="12" y1="1" x2="12" y2="3"/>
                        <line x1="12" y1="21" x2="12" y2="23"/>
                        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                        <line x1="1" y1="12" x2="3" y2="12"/>
                        <line x1="21" y1="12" x2="23" y2="12"/>
                        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                    </svg>
                `;
            }
        }
    }*/

    // Reinicializar feather icons
    if (typeof feather !== 'undefined') {
        feather.replace();
    }
}
function toTitleCase(str) {
    return str.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
}

function scrollToBottom() {
    const cm = document.getElementById('chatMessages');
    if (!cm) return;
    requestAnimationFrame(() => {
        cm.scrollTop = cm.scrollHeight;
    });
}

function updateChatScrollIndicators() {
    if (!chatMessages) return;
    if (chatMessages.scrollHeight > chatMessages.clientHeight) {
        chatMessages.classList.add('has-messages');
    } else {
        chatMessages.classList.remove('has-messages');
    }
}

function initializeExampleQuestions() {
    const defaultBtn = document.getElementById('startDominicanCountryBtn');
    if (defaultBtn) {
        defaultBtn.addEventListener('click', () => {
            if (defaultCountryConfig) {
                startCountryFlow(defaultCountryConfig, { addMessages: true });
                return;
            }

            const fallback = (defaultBtn.dataset.question || defaultBtn.textContent || '').trim();
            if (!fallback) return;
            hideWelcomeMessage();
            addMessage(fallback, 'user');
            showTypingIndicator();
            sendQuestion(fallback, Date.now());
        });
    }

    document.querySelectorAll('.example-question-card').forEach(btn => {
        if (btn.id === 'startDominicanCountryBtn') return;
        btn.addEventListener('click', () => {
            const question = (btn.dataset.question || btn.textContent || '').trim();
            if (!question) return;
            hideWelcomeMessage();
            addMessage(question, 'user');
            showTypingIndicator();
            sendQuestion(question, Date.now());
        });
    });
}

// Elimina cualquier bloque de sugerencias compacto que esté visible
function removeCompactSuggestions() {
    document.querySelectorAll('.compact-suggestions').forEach(el => el.remove());
}

// Referencias DOM
const sidebar = document.getElementById('sidebar');
const mainContent = document.getElementById('mainContent');
const sidebarToggle = document.getElementById('sidebarToggle');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');
if (sendBtn && !sendBtn.dataset.limitLocked) {
    sendBtn.dataset.limitLocked = 'false';
}

// Soporte de eventos en móviles (pointer/touch)
const UNIVERSAL_CLICK = (window && window.__UNIVERSAL_CLICK__) ? window.__UNIVERSAL_CLICK__ : 'click';

const chatMessages = document.getElementById('chatMessages');
const welcomeMessage = document.getElementById('welcomeMessage');
const newChatBtn = document.getElementById('newChatBtn');
const historyBtn = document.getElementById('historyBtn');


// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    // 1) Feather icons
    feather.replace();

    // 2) UI helpers
    initializeTooltips();
    adjustTextareaHeight();
    handleResponsiveDesign();
    initializeFeedbackModal();
    initializeInfoModals();
    initializePrivacyModal();
    initializeMobileEnhancements();
    optimizeMobilePerformance();

    initializeExampleQuestions();
    initWelcomeHero();
    initializeHistoryHandlers();

    // 3) Inicializar país (hardcoded DOM)
    initializeDefaultCountry();

    updateChatScrollIndicators();

    // Inicializar Response Actions modernizadas
    initMoreActionsMenu();
    initSourceModal();
    console.log('✅ Response Actions modernizadas e inicializadas');
});

// Inicializar tooltips
function initializeTooltips() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

// Toggle sidebar
sidebarToggle.addEventListener('click', function () {
    if (window.innerWidth <= 768) {
        // En móvil, mostrar/ocultar sidebar
        sidebar.classList.toggle('show');
    } else {
        // En desktop, expandir/colapsar
        sidebarExpanded = !sidebarExpanded;

        if (sidebarExpanded) {
            sidebar.classList.remove('sidebar-collapsed');
            sidebar.classList.add('sidebar-expanded');
            mainContent.classList.remove('expanded');
        } else {
            sidebar.classList.remove('sidebar-expanded');
            sidebar.classList.add('sidebar-collapsed');
            mainContent.classList.add('expanded');
        }

        // Ocultar/mostrar texto en sidebar
        const sidebarTexts = document.querySelectorAll('.sidebar-text');
        sidebarTexts.forEach(text => {
            text.style.display = sidebarExpanded ? 'block' : 'none';
        });

        // NUEVO: Actualizar feather icons después del toggle
        feather.replace();
    }
});



// Funcionalidad del botón de historial colapsado
const historyBtnCollapsed = document.getElementById('historyBtnCollapsed');
if (historyBtnCollapsed) {
    historyBtnCollapsed.addEventListener('click', function (e) {
        e.preventDefault();
        // Si el sidebar está colapsado, expandirlo
        if (!sidebarExpanded && window.innerWidth > 768) {
            sidebarToggle.click();
        }
    });
}

// Manejo responsive
function handleResponsiveDesign() {
    window.addEventListener('resize', function () {
        if (window.innerWidth > 768) {
            sidebar.classList.remove('show');
            // Restaurar estado del sidebar en desktop
            const sidebarTexts = document.querySelectorAll('.sidebar-text');
            sidebarTexts.forEach(text => {
                text.style.display = sidebarExpanded ? 'block' : 'none';
            });
        }
    });
}

// Auto-resize textarea
messageInput.addEventListener('input', adjustTextareaHeight);

function adjustTextareaHeight() {
    messageInput.style.height = 'auto';
    messageInput.style.height = Math.min(messageInput.scrollHeight, 120) + 'px';
    messageInput.addEventListener('input', adjustTextareaHeight);
}

// Enviar mensaje
function ensureCountryConfigured() {
    if (selectedCountry) return true;
    if (defaultCountryConfig) {
        startCountryFlow(defaultCountryConfig, { addMessages: false });
        return true;
    }
    return false;
}

function sendMessage() {
    // Detener lectura si está activa
    stopSpeechOnNewMessage();
    const message = messageInput.value.trim();
    // Ya no quitamos sugerencias automáticamente
    if (!message || isTyping) return;

    // IMPORTANTE: Leer el flag ANTES de limpiar el input
    const hasPendingRetry = messageInput && messageInput.dataset.pendingIrrelevantRetry === 'true';

    currentClarification = null;
    currentAssistance = null;
    if (!ensureCountryConfigured()) {
        showToast('Estamos preparando los datos del país. Intenta nuevamente en unos segundos.', 'error');
        return;
    }

    hideWelcomeMessage();
    addMessage(message, 'user');
    messageInput.value = '';
    // Limpiar flag de reintento cuando se limpia el input
    if (messageInput.dataset.pendingIrrelevantRetry) {
        delete messageInput.dataset.pendingIrrelevantRetry;
    }
    adjustTextareaHeight();

    // Mostrar indicador de escritura y enviar pregunta al backend
    showTypingIndicator();
    const uniqueId = Date.now();
    // Pasar el flag como parámetro adicional para que sendQuestion lo use
    sendQuestion(message, uniqueId, hasPendingRetry);
}

// Event listeners para enviar mensaje
sendBtn.addEventListener('click', sendMessage);

// Listener adicional para entornos touch/pointer
try { sendBtn.addEventListener(UNIVERSAL_CLICK, sendMessage, { passive: true }); } catch (_e) { }

messageInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

// Agregar mensaje al chat
// Esta función crea un nuevo mensaje en el chat
// y lo añade al contenedor de mensajes.
// type puede ser 'user' o 'assistant'
function addMessage(content, type, answerId = 0) {

    if (!chatMessages) return;

    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;

    if (answerId) {
        messageDiv.dataset.answerId = answerId;      // guarda ID devuelto por backend
        console.log('[META] addMessage → answerId=', answerId);
    }

    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';

    if (type === 'user') {
        avatar.innerHTML = `
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                    </svg>
                `;
    } else {
        avatar.innerHTML = `
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M3 21h18"/>
                        <path d="M3 7v1a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3V7"/>
                        <path d="M8 21V7a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v14"/>
                    </svg>
                `;
    }

    const wrapper = document.createElement('div');
    wrapper.className = 'message-wrapper';

    // message meta

    // --- contenedor meta: hora + botones ---
    const messageMeta = document.createElement('div');
    messageMeta.className = 'message-meta';




    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    // If assistant message contains HTML, render it
    if (type === 'assistant' && /<\/?[a-z][\s\S]*>/i.test(content)) {
        messageContent.innerHTML = content;
        // Si el backend ya envió un contenedor .message-content propio,
        // evitamos anidarlo duplicado.
        if (
            messageContent.childElementCount === 1 &&
            messageContent.firstElementChild &&
            messageContent.firstElementChild.classList.contains('message-content')
        ) {
            const inner = messageContent.firstElementChild;
            messageContent.innerHTML = inner.innerHTML;
        }
    } else {
        messageContent.textContent = content;
    }

    const messageTime = document.createElement('div');
    messageTime.className = 'message-time';
    const now = new Date();
    messageTime.textContent = now.toLocaleTimeString('es-ES', {
        hour: '2-digit',
        minute: '2-digit'
    });

    wrapper.appendChild(messageContent);
    messageMeta.appendChild(messageTime);   // la hora queda dentro de .message-meta
    wrapper.appendChild(messageMeta);

    messageDiv.appendChild(avatar);
    messageDiv.appendChild(wrapper);

    chatMessages.appendChild(messageDiv);

    // Scroll al final
    scrollToBottom();
    updateChatScrollIndicators();

    // Inicializar ordenamiento de tablas después de agregar el mensaje
    setTimeout(() => {
        initializeTableSorting();
        // Envolver tablas con contenedores de scroll
        wrapTablesWithScrollContainer(messageDiv);
    }, 100);

    return messageDiv;
}

// Función para envolver tablas con contenedores de scroll
function wrapTablesWithScrollContainer(container) {
    const tables = container ?
        container.querySelectorAll('table.tabla-respuesta') :
        document.querySelectorAll('table.tabla-respuesta');

    tables.forEach(table => {
        const parent = table.parentElement;
        // Si ya tiene los contenedores, no hacer nada
        if (parent && (parent.classList.contains('tabla-scroll') ||
            parent.classList.contains('respuesta-tabla') ||
            parent.classList.contains('tabla-outer'))) {
            return;
        }
        // Crear estructura: tabla-outer > tabla-scroll > table
        const outer = document.createElement('div');
        outer.className = 'tabla-outer';
        const scroll = document.createElement('div');
        scroll.className = 'tabla-scroll';
        outer.appendChild(scroll);
        if (parent) {
            parent.insertBefore(outer, table);
            scroll.appendChild(table);
        }
    });
}

// =========================================================
//  Bloque de feedback / response-actions
// =========================================================


/* -------- envío feedback -------- */
function sendFeedback(answerId, isApproved, reason = '') {
    if (!answerId || answerId === '0') {
        console.warn('[META] sendFeedback – sin answerId, omito');
        return;
    }
    console.log('[META] sendFeedback', { answerId, isApproved, reason });
    fetch('/api/approveAnswer', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            'X-API-Key': window.API_KEY
        },
        body: JSON.stringify({
            answerId: Number(answerId),
            isApproved,
            commentDisApproved: reason
        })
    })
        .then(r => r.json())
        .then(ok => console.log('[META] backend responde', ok))
        .catch(err => console.error('[META] error feedback', err));
}




function showResponseActions(messageElement) {
    if (!messageElement) return;

    const answerId = messageElement.dataset.answerId || 0;
    const messageWrapper = messageElement.querySelector('.message-wrapper');
    if (!messageWrapper) return;

    const messageMeta = messageWrapper.querySelector('.message-meta');
    if (!messageMeta || messageMeta.querySelector('.response-actions')) return;

    const actionsHtml = `
    <div class="response-actions" data-answer-id="${answerId}">
        <button class="response-action-btn-modern" data-action="like" aria-label="Me gusta esta respuesta">
            <i data-feather="thumbs-up"></i>
        </button>
        <button class="response-action-btn-modern" data-action="dislike" aria-label="No me gusta esta respuesta">
            <i data-feather="thumbs-down"></i>
        </button>
        <button class="response-action-btn-modern technical-reasoning-btn" data-action="technical-details" aria-label="Ver razonamiento">
            <i data-feather="activity"></i>
        </button>
        <!--<button class="response-action-btn-modern" data-action="share" aria-label="Compartir respuesta">
            <i data-feather="share-2"></i>
        </button>-->
        <button class="response-action-btn-modern" data-action="source" aria-label="Ver fuente">
             <i data-feather="link"></i>
        </button>
        <div class="more-actions-wrapper">
            <button class="response-action-btn-modern more-actions-trigger" aria-label="Más acciones" aria-expanded="false">
                <i data-feather="more-horizontal"></i>
            </button>
            <div class="more-actions-menu" role="menu" aria-hidden="true" hidden>
                <button class="more-action-item" data-action="copy" role="menuitem">
                    <i data-feather="copy"></i>
                    <span>Copiar respuesta</span>
                </button>
                <button class="more-action-item" data-action="read-aloud" role="menuitem">
                    <i data-feather="volume-2"></i>
                    <span>Leer en voz alta</span>
                </button>
            </div>
        </div>
    </div>
`;

    messageMeta.insertAdjacentHTML('afterbegin', actionsHtml);
    feather.replace();

    const actionButtons = messageMeta.querySelectorAll('.response-action-btn-modern:not(.more-actions-trigger)');
    actionButtons.forEach(btn => {
        btn.addEventListener('click', e => {
            e.preventDefault();
            btn.classList.add('clicked');
            setTimeout(() => btn.classList.remove('clicked'), 600);

            const action = btn.getAttribute('data-action');

            // Manejar botón source directamente
            if (action === 'source') {
                const sourceUrl = messageElement.dataset.sourceUrl || '#';
                const sourceName = messageElement.dataset.sourceName || 'Ver fuente';
                showSourceModal(sourceUrl, sourceName);
            } else if (action === 'technical-details') {
                // Manejar Ver razonamiento directamente
                handleTechnicalDetailsAction(messageElement);
            } else {
                // Usar la función existente para otros botones
                handleResponseAction(
                    action,
                    messageWrapper.querySelector('.message-content')?.textContent || '',
                    btn
                );
            }
        });
    });

    if (!window.hasShownActionsHint) {
        window.hasShownActionsHint = true;
        setTimeout(() => {
            const firstActionBtn = messageMeta.querySelector('.response-action-btn-modern');
            if (firstActionBtn) {
                firstActionBtn.style.animation = 'pulse 1.5s ease-in-out 2';
                setTimeout(() => { firstActionBtn.style.animation = ''; }, 3200);
            }
        }, 1500);
    }
}

function renderNonBlockingSuggestions(messageElement, suggestions) {
    if (!messageElement || !suggestions || typeof suggestions !== 'object') return;
    const wrapper = messageElement.querySelector('.message-wrapper');
    const meta = wrapper ? wrapper.querySelector('.message-meta') : null;
    if (!wrapper || !meta) return;

    const type = (suggestions.type || '').toString().toLowerCase();
    if (type && type !== 'non_blocking') return;

    const message = typeof suggestions.message === 'string' ? suggestions.message.trim() : '';
    const issues = Array.isArray(suggestions.issues)
        ? suggestions.issues.filter(item => typeof item === 'string' && item.trim())
        : [];
    const prompts = Array.isArray(suggestions.prompts)
        ? suggestions.prompts.filter(item => typeof item === 'string' && item.trim())
        : [];

    if (!message && !issues.length && !prompts.length) return;

    const existing = wrapper.querySelector('.non-blocking-hints');
    if (existing) existing.remove();

    const block = document.createElement('div');
    block.className = 'non-blocking-hints';

    const title = document.createElement('p');
    title.className = 'non-blocking-hints-title';
    title.textContent = 'Sugerencias para refinar la consulta';
    block.appendChild(title);

    if (message) {
        const msg = document.createElement('p');
        msg.className = 'non-blocking-hints-message';
        msg.textContent = message;
        block.appendChild(msg);
    }

    if (issues.length) {
        const list = document.createElement('ul');
        list.className = 'non-blocking-hints-list';
        issues.slice(0, 4).forEach(text => {
            const li = document.createElement('li');
            li.textContent = text.trim();
            list.appendChild(li);
        });
        block.appendChild(list);
    }

    if (prompts.length) {
        const group = document.createElement('div');
        prompts.slice(0, 4).forEach(text => {
            const chip = document.createElement('span');
            chip.className = 'non-blocking-chip non-clickable';
            chip.textContent = text.trim();
            group.appendChild(chip);
        });
        block.appendChild(group);
    }

    wrapper.insertBefore(block, meta);
}

function renderCitizenActions(messageElement, data, originalQuestion) {
    if (!messageElement || !data) return;

    // No renderizar acciones ciudadanas si hay disambiguación territorial activa
    const assistance = data.user_assistance || {};
    if (assistance.type === 'disambiguate' || assistance.needed) {
        console.log('[CITIZEN_ACTIONS] Skipping - territorial disambiguation active');
        return;
    }

    const actions = Array.isArray(data.citizen_actions) ? data.citizen_actions : [];
    const details = data.citizen_actions_details || {};
    if (!actions.length) return;

    const wrapper = messageElement.querySelector('.message-wrapper');
    const meta = wrapper ? wrapper.querySelector('.message-meta') : null;
    if (!wrapper || !meta) return;

    // compute flags (ensure hasDedupeOptions is defined before usage)
    const hasLimitOptions = actions.includes('offer_increase_limit') &&
        Array.isArray(details.offer_increase_limit) &&
        details.offer_increase_limit.length > 0;

    const hasFilterOptions = actions.includes('show_filter_chips') &&
        Array.isArray(details.show_filter_chips) &&
        details.show_filter_chips.length > 0;

    const hasDedupeOptions = actions.includes('dedupe_unique_results') &&
        Array.isArray(details.dedupe_unique_results) &&
        details.dedupe_unique_results.length > 0;

    const hasSectorSuggestions = actions.includes('suggest_sectors') &&
        details.suggest_sectors &&
        Array.isArray(details.suggest_sectors.sectors) &&
        details.suggest_sectors.sectors.length > 0;

    const hasRephraseOptions = actions.includes('suggest_rephrase') &&
        details.suggest_rephrase &&
        Array.isArray(details.suggest_rephrase.suggestions) &&
        details.suggest_rephrase.suggestions.length > 0;

    const hasClarificationOptions = actions.includes('suggest_clarification') &&
        Array.isArray(details.suggest_clarification) &&
        details.suggest_clarification.length > 0;

    const hasRetryOptions = actions.includes('reintentar_con_filtros_ajustados') &&
        details.reintentar_con_filtros_ajustados &&
        typeof details.reintentar_con_filtros_ajustados === 'object';

    // If no actionable suggestions, bail out gracefully
    // NOTA: hasLimitOptions removido de la condición (deshabilitado)
    if (!hasFilterOptions && !hasDedupeOptions && !hasSectorSuggestions && !hasRephraseOptions && !hasClarificationOptions && !hasRetryOptions) return;

    const existingBlock = wrapper.querySelector('.citizen-action-shell');
    if (existingBlock) existingBlock.remove();

    const block = document.createElement('div');
    block.className = 'citizen-action-shell';


    // Render citizen_feedback summary (if present)
    try {
        const feedback = data.citizen_feedback || {};
        const summaryText = (typeof feedback === 'string') ? feedback : (feedback.summary || feedback.note || feedback.text || null);
        if (summaryText) {
            const fbLead = document.createElement('p');
            fbLead.className = 'citizen-action-lead';
            fbLead.style.fontWeight = '500';
            fbLead.style.fontSize = '0.9rem';
            fbLead.textContent = summaryText;
            block.appendChild(fbLead);
        }
    } catch (e) { /* non‑critical – continue silently */ }

    // DESHABILITADO: No mostrar opción de ampliar resultados
    // if (hasLimitOptions) {
    //     const lead = document.createElement('p');
    //     lead.className = 'citizen-action-lead';
    //     lead.textContent = '¿Deseas ampliar los resultados?';
    //     block.appendChild(lead);
    //
    //     const group = document.createElement('div');
    //     group.className = 'citizen-action-group';
    //     const option = details.offer_increase_limit[0];
    //     const btn = document.createElement('button');
    //     btn.type = 'button';
    //     btn.className = 'citizen-chip';
    //     btn.textContent = option.label || `Ver ${option.limit}`;
    //     btn.dataset.prompt = option.suggested_prompt || '';
    //     btn.dataset.kind = 'limit';
    //     group.appendChild(btn);
    //     block.appendChild(group);
    // }

    if (hasFilterOptions) {
        const lead = document.createElement('p');
        lead.className = 'citizen-action-lead';
        lead.textContent = 'Puedes afinar la búsqueda:';
        block.appendChild(lead);

        const group = document.createElement('div');
        group.className = 'citizen-action-group';
        details.show_filter_chips.slice(0, 2).forEach(option => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'citizen-chip';
            btn.textContent = option.label || 'Refinar';
            btn.dataset.prompt = option.suggested_prompt || '';
            btn.dataset.kind = 'filter';
            group.appendChild(btn);
        });
        block.appendChild(group);
    }

    if (hasDedupeOptions) {
        const lead = document.createElement('p');
        lead.className = 'citizen-action-lead';
        lead.textContent = '¿Deseas ver cada proyecto una sola vez?';
        block.appendChild(lead);

        const group = document.createElement('div');
        group.className = 'citizen-action-group';
        details.dedupe_unique_results.slice(0, 3).forEach(option => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'citizen-chip';
            btn.textContent = option.label || 'Ver proyectos únicos';
            btn.dataset.prompt = option.suggested_prompt || 'Mostrame los proyectos únicos';
            btn.dataset.kind = 'dedupe';
            group.appendChild(btn);
        });
        block.appendChild(group);
    }

    if (hasSectorSuggestions) {
        const sectorInfo = details.suggest_sectors || {};
        const lead = document.createElement('p');
        lead.className = 'citizen-action-lead';
        lead.textContent = sectorInfo.message || 'Sectores relacionados:';
        block.appendChild(lead);

        const group = document.createElement('div');
        group.className = 'citizen-action-group';
        sectorInfo.sectors.slice(0, 5).forEach(name => {
            const label = (typeof name === 'string') ? name.trim() : '';
            if (!label) return;
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'citizen-chip';
            btn.textContent = label;
            btn.dataset.prompt = `en el sector ${label}`;
            btn.dataset.kind = 'sector';
            group.appendChild(btn);
        });
        block.appendChild(group);
    }

    if (hasRephraseOptions) {
        const rephraseInfo = details.suggest_rephrase || {};
        const lead = document.createElement('p');
        lead.className = 'citizen-action-lead';
        const coverage = typeof rephraseInfo.coverage === 'number'
            ? Math.round((rephraseInfo.coverage || 0) * 100)
            : null;
        if (rephraseInfo.reason) {
            lead.textContent = rephraseInfo.reason;
        } else if (coverage !== null) {
            lead.textContent = `Puedes reformular para mejorar la coincidencia (cobertura actual ~${coverage}%).`;
        } else {
            lead.textContent = '¿Deseas intentar con otra redacción?';
        }
        block.appendChild(lead);

        const group = document.createElement('div');
        group.className = 'citizen-action-group';
        rephraseInfo.suggestions.slice(0, 3).forEach(text => {
            const prompt = (typeof text === 'string') ? text.trim() : '';
            if (!prompt) return;
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'citizen-chip';
            btn.textContent = prompt;
            btn.dataset.prompt = prompt;
            btn.dataset.kind = 'rephrase';
            group.appendChild(btn);
        });
        block.appendChild(group);
    }

    if (hasClarificationOptions) {
        const lead = document.createElement('p');
        lead.className = 'citizen-action-lead';
        lead.textContent = 'Puedo aclarar estos puntos antes de seguir:';
        block.appendChild(lead);

        const group = document.createElement('div');
        group.className = 'citizen-action-group';
        details.suggest_clarification.slice(0, 3).forEach(option => {
            const label = option.label || 'Aclarar criterio';
            const prompt = option.suggested_prompt || label;
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'citizen-chip';
            btn.textContent = label;
            btn.dataset.prompt = prompt;
            btn.dataset.kind = 'clarification';
            group.appendChild(btn);
        });
        block.appendChild(group);
    }

    if (hasRetryOptions) {
        const lead = document.createElement('p');
        lead.className = 'citizen-action-lead';
        lead.textContent = '¿Deseas que ajuste los filtros y vuelva a buscar?';
        block.appendChild(lead);

        const group = document.createElement('div');
        group.className = 'citizen-action-group';
        const option = details.reintentar_con_filtros_ajustados;
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'citizen-chip';
        btn.textContent = option.label || 'Reintentar con filtros ajustados';
        btn.dataset.prompt = option.suggested_prompt || 'Reintentar con filtros más específicos';
        btn.dataset.kind = 'reintentar_con_filtros_ajustados';
        group.appendChild(btn);
        block.appendChild(group);
    }

    if (!block.children.length) return;

    wrapper.insertBefore(block, meta);

    const chips = Array.from(block.querySelectorAll('.citizen-chip'));
    chips.forEach(btn => {
        const isLimit = (btn.dataset.kind === 'limit');
        if (isLimit) {
            // Mantener interacción clásica para ampliar resultados
            btn.addEventListener('click', () => handleCitizenChipClick(btn, data, originalQuestion, chips));
            return;
        }
        // Resto de chips: informativos, sin autofill
        btn.classList.add('citizen-chip-static');
        btn.tabIndex = -1;
        btn.setAttribute('aria-disabled', 'true');
        btn.removeAttribute('data-prompt');
    });
}

const CLARIFICATION_TARGET_ALIASES = {
    entity: 'entity',
    entidad: 'entity',
    entidades: 'entity',
    sector: 'sector',
    sectores: 'sector',
    synonym: 'synonym',
    synonyms: 'synonym',
    keyword: 'keywords',
    keywords: 'keywords',
    territorio: 'territory',
    territory: 'territory',
    estado: 'state',
    status: 'state',
    objetivo: 'objective',
    objetivos: 'objective',
    tipo: 'type',
    tipos: 'type',
    proyecto: 'project',
    proyectos: 'project',
    funding: 'funding',
    financiamiento: 'funding',
    fuente: 'funding',
    fuentes: 'funding',
    'year_range': 'year_range',
    anio: 'year_range',
    anios: 'year_range',
    años: 'year_range',
    year: 'year_range'
};

function normalizeClarificationTarget(target) {
    if (!target) return '';
    const key = String(target).trim().toLowerCase();
    return CLARIFICATION_TARGET_ALIASES[key] || key;
}

function titleForClarificationTarget(target) {
    switch (normalizeClarificationTarget(target)) {
        case 'sector':
            return 'Seleccione un sector para continuar:';
        case 'entity':
            return 'Seleccione una entidad ejecutora para continuar:';
        case 'territory':
            return 'Elegí un territorio para continuar:';
        case 'state':
            return 'Elegí un estado del proyecto:';
        case 'objective':
            return 'Elegí un objetivo o temática:';
        case 'type':
            return 'Elegí un tipo de proyecto:';
        case 'funding':
            return 'Elegí una fuente de financiamiento:';
        case 'year_range':
            return 'Seleccione un rango de años:';
        default:
            return 'Elegí una alternativa para continuar:';
    }
}

function buildClarificationEndpointUrl(endpoint, params) {
    const search = new URLSearchParams(params);
    const separator = endpoint.includes('?') ? '&' : '?';
    return `${endpoint}${separator}${search.toString()}`;
}

function extractClarificationValue(target, item) {
    if (!item) return '';
    const normalized = normalizeClarificationTarget(target);
    if (normalized === 'sector') {
        return item.sector_original || item.sector_normalizado || '';
    }
    if (normalized === 'entity') {
        return item.entidad_original || item.entidad_normalizada || '';
    }
    if (normalized === 'territory') {
        return item.territorio || item.territorio_normalizado || item.departamento || '';
    }
    return item.label || item.value || '';
}

function formatClarificationDisplay(target, item, value) {
    const normalized = normalizeClarificationTarget(target);
    if (normalized === 'entity') {
        const count = typeof item.proyectos_count === 'number' ? item.proyectos_count : null;
        if (count && count > 0) {
            return `${value} (${count} proyectos)`;
        }
    }
    return value;
}

function renderClarificationEndpointGroup(container, payload, target, endpoint) {
    if (!endpoint || !container || !payload) return;
    const country = (payload.country_code || selectedCountry || '').trim();
    if (!country) return;

    const { block, row } = createClarificationBlock(titleForClarificationTarget(target));
    const loading = document.createElement('span');
    loading.className = 'clarification-empty';
    loading.textContent = 'Cargando opciones...';
    row.appendChild(loading);
    container.appendChild(block);

    const url = buildClarificationEndpointUrl(endpoint, {
        country_code: country.toLowerCase(),
        limit: 12
    });

    fetch(url, { credentials: 'include' })
        .then(resp => {
            if (!resp.ok) throw new Error(`status_${resp.status}`);
            return resp.json();
        })
        .then(data => {
            const items = Array.isArray(data?.items) ? data.items.slice(0, 12) : [];
            row.innerHTML = '';
            if (!items.length) {
                const empty = document.createElement('span');
                empty.className = 'clarification-empty';
                empty.textContent = 'No se encontraron opciones disponibles.';
                row.appendChild(empty);
                return;
            }
            items.forEach(item => {
                const value = extractClarificationValue(target, item);
                const display = formatClarificationDisplay(target, item, value);
                if (!value || !display) return;
                const chip = document.createElement('button');
                chip.type = 'button';
                chip.className = 'clarification-chip';
                chip.textContent = display;
                chip.addEventListener('click', () => {
                    const parent = chip.closest('.clarification-wrapper');
                    if (parent) parent.remove();
                    applyClarificationSelection(payload, target, value);
                });
                row.appendChild(chip);
            });
        })
        .catch(() => {
            row.innerHTML = '';
            const errorMsg = document.createElement('span');
            errorMsg.className = 'clarification-empty';
            errorMsg.textContent = 'No se pudieron cargar las opciones.';
            row.appendChild(errorMsg);
        });
}

function renderClarificationUI(messageElement, payload, assistance) {
    if (!messageElement || !payload) return;
    if (typeof payload !== 'object') payload = {};
    const assistanceMeta = assistance && typeof assistance === 'object' ? assistance : null;
    const wrapper = messageElement.querySelector('.message-wrapper');
    const meta = wrapper ? wrapper.querySelector('.message-meta') : null;
    if (!wrapper || !meta) return;

    // La pregunta original debería venir en el payload desde el backend
    const originalQuestion = payload.original_question || '';

    console.log('[CLARIFICATION] Rendering UI with payload:', {
        original_question: originalQuestion,
        options_count: Array.isArray(payload.options) ? payload.options.length : 0
    });

    const existing = wrapper.querySelector('.clarification-wrapper');
    if (existing) existing.remove();

    const container = document.createElement('div');
    container.className = 'clarification-wrapper';

    // Guardar la pregunta original como data attribute para usarla en el click
    container.dataset.originalQuestion = originalQuestion;

    const messageText = (payload.message || assistanceMeta?.message || '').trim();
    if (messageText) {
        let duplicateMessage = false;
        const contentEl = wrapper.querySelector('.message-content');
        if (contentEl) {
            const normalizedContent = contentEl.textContent.trim().replace(/\s+/g, ' ');
            const normalizedMessage = messageText.replace(/\s+/g, ' ');
            duplicateMessage = normalizedContent === normalizedMessage;
        }
        if (!duplicateMessage) {
            const lead = document.createElement('p');
            lead.className = 'clarification-title';
            lead.textContent = messageText;
            container.appendChild(lead);
        }
    }

    const turnNumber = Number(payload.clarification_turn ?? assistanceMeta?.turn);
    const limitNumber = Number(payload.clarification_limit ?? assistanceMeta?.max_turns);
    if (!Number.isNaN(turnNumber) && !Number.isNaN(limitNumber) && limitNumber > 0) {
        const boundedTurn = Math.min(Math.max(turnNumber, 1), limitNumber);
        const remaining = Math.max(limitNumber - boundedTurn, 0);
        const note = document.createElement('p');
        note.className = 'clarification-note';
        if (remaining === 0) {
            note.textContent = `Última aclaración para continuar con la búsqueda.`;
        } else if (remaining === 1) {
            note.textContent = `Ayúdanos a encontrar lo que buscas. Podemos hacer 1 aclaración más.`;
        } else {
            note.textContent = `Ayúdanos a encontrar lo que buscas. Podemos aclarar hasta ${remaining} detalles.`;
        }
        container.appendChild(note);
    }

    const rawOptions = Array.isArray(payload.options) && payload.options.length
        ? payload.options
        : (assistanceMeta && Array.isArray(assistanceMeta.options) ? assistanceMeta.options : []);
    if (rawOptions.length) {
        // Título contextualizado si es disambiguación territorial
        const isTerritorial = rawOptions.some(opt =>
            (opt.target === 'territory' || opt.topic === 'territory')
        );
        const title = isTerritorial
            ? 'Seleccione la provincia o municipio correcto:'
            : 'Elegí una alternativa para continuar:';

        const { block, row } = createClarificationBlock(title);
        rawOptions.forEach(option => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'clarification-chip';
            const valueText = option.value_display || option.value || option.label || option.key || 'Opción';
            const rawType = option.tipo || option.type || option.column || option.topic || option.target || '';
            const typeText = mapTerritoryType(rawType);
            btn.textContent = typeText ? `${typeText}: ${valueText}` : valueText;
            btn.title = option.description || '';

            console.log('[CLARIFICATION] Adding click listener to button:', {
                text: btn.textContent,
                option: option,
                target: option.target,
                topic: option.topic
            });

            btn.addEventListener('click', (e) => {
                console.log('[CLARIFICATION] Button clicked!', {
                    text: btn.textContent,
                    option: option,
                    payload: payload
                });
                handleClarificationOptionSelect(payload, option, e);
            });
            row.appendChild(btn);
        });
        container.appendChild(block);
    }

    const synonyms = Array.isArray(payload.synonym_suggestions) && payload.synonym_suggestions.length
        ? payload.synonym_suggestions
        : (assistanceMeta && assistanceMeta.metadata && Array.isArray(assistanceMeta.metadata.synonyms)
            ? assistanceMeta.metadata.synonyms
            : []);
    if (synonyms.length) {
        const { block, row } = createClarificationBlock('Probá con otra palabra clave:');
        synonyms.slice(0, 8).forEach(suggestion => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'clarification-chip';
            btn.textContent = suggestion.label || suggestion.keyword || '';
            btn.addEventListener('click', () => {
                const parent = btn.closest('.clarification-wrapper');
                if (parent) parent.remove();
                applyClarificationSelection(payload, 'synonym', suggestion.label, suggestion.question);
            });
            row.appendChild(btn);
        });
        container.appendChild(block);
    }

    const endpointMap = payload.endpoints && typeof payload.endpoints === 'object' ? payload.endpoints : {};
    const targets = Array.isArray(payload.targets) && payload.targets.length
        ? payload.targets
        : (assistanceMeta && assistanceMeta.metadata && Array.isArray(assistanceMeta.metadata.targets)
            ? assistanceMeta.metadata.targets
            : []);
    const interactiveTargets = Array.from(new Set(targets.filter(target => endpointMap[normalizeClarificationTarget(target)] || endpointMap[target])));
    interactiveTargets.forEach(target => {
        const normalized = normalizeClarificationTarget(target);
        const endpoint = endpointMap[normalized] || endpointMap[target];
        renderClarificationEndpointGroup(container, payload, normalized, endpoint);
    });

    if (!container.childElementCount) {
        const fallback = document.createElement('p');
        fallback.className = 'clarification-title';
        fallback.textContent = 'Necesitamos un dato adicional para continuar. Contanos un filtro o palabra clave extra.';
        container.appendChild(fallback);
    }

    const contentEl = wrapper.querySelector('.message-content');
    if (contentEl) {
        contentEl.appendChild(container);
    } else {
        wrapper.insertBefore(container, meta);
    }
    container.dataset.originalQuestion = payload.original_question || assistanceMeta?.original_question || '';
    currentClarification = payload;
    currentAssistance = assistanceMeta;
}

function createClarificationBlock(title) {
    const block = document.createElement('div');
    block.className = 'clarification-block';
    if (title) {
        const lead = document.createElement('p');
        lead.className = 'clarification-title';
        lead.textContent = title;
        block.appendChild(lead);
    }
    const row = document.createElement('div');
    row.className = 'clarification-chips';
    block.appendChild(row);
    return { block, row };
}

// Utilidad para normalizar etiquetas territoriales
function mapTerritoryType(rawType) {
    const t = (rawType || '').toString().toLowerCase();
    if (t.includes('departamento') || t.includes('provincia')) return 'Provincia';
    if (t.includes('municipio')) return 'Municipio';
    if (t.includes('region') || t.includes('región')) return 'Región';
    if (t.includes('territory') || t === 'territory') return 'Territorio';
    return '';
}

function renderNoDataSuggestions(messageElement, payload, fallbackQuestion) {
    if (!messageElement || !payload) return;
    const wrapper = messageElement.querySelector('.message-wrapper');
    const contentEl = wrapper ? wrapper.querySelector('.message-content') : null;
    if (!contentEl) return;

    const container = document.createElement('div');
    container.className = 'no-data-hints';

    const leadText = (typeof payload.lead === 'string' && payload.lead.trim())
        ? payload.lead.trim()
        : 'No encuentro proyectos con esos criterios.';
    const lead = document.createElement('p');
    lead.className = 'no-data-lead';
    lead.textContent = leadText;
    container.appendChild(lead);

    const hints = Array.isArray(payload.hints) ? payload.hints : [];
    if (hints.length) {
        const list = document.createElement('ul');
        list.className = 'no-data-hints-list';
        hints.slice(0, 4).forEach(hint => {
            if (!hint) return;
            const li = document.createElement('li');
            li.textContent = hint;
            list.appendChild(li);
        });
        container.appendChild(list);
    }

    const baseQuestion = (payload.original_question || fallbackQuestion || '').trim();
    const suggestions = Array.isArray(payload.suggestions) ? payload.suggestions : [];
    suggestions.forEach(group => {
        if (!group || !Array.isArray(group.values) || !group.values.length) return;
        const block = document.createElement('div');
        block.className = 'no-data-chip-group';
        if (group.label) {
            const title = document.createElement('p');
            title.className = 'no-data-chip-title';
            title.textContent = group.label;
            block.appendChild(title);
        }
        const row = document.createElement('div');
        row.className = 'no-data-chip-row';
        group.values.slice(0, 8).forEach(value => {
            if (!value) return;
            const chip = document.createElement('button');
            chip.type = 'button';
            chip.className = 'non-blocking-chip';
            chip.textContent = value;
            chip.addEventListener('click', () => {
                if (!baseQuestion) {
                    messageInput.value = value;
                    adjustTextareaHeight();
                    messageInput.focus();
                    return;
                }
                const nextPayload = {
                    original_question: baseQuestion,
                    country_code: payload.country_code || selectedCountry
                };
                applyClarificationSelection(nextPayload, group.target || '', value);
            });
            row.appendChild(chip);
        });
        block.appendChild(row);
        container.appendChild(block);
    });

    contentEl.appendChild(container);
}

function handleClarificationOptionSelect(payload, option, event) {
    if (!payload || !option) return;
    if (isTyping) return;

    const target = option.target || option.topic || '';
    const normalized = normalizeClarificationTarget(target);

    // Para territorios, usar el texto del botón directamente
    if (normalized === 'territory') {
        // Respuesta breve de clarificación: solo el territorio seleccionado
        const valueText = (option.value_display || option.value || option.label || '').toString().trim();
        const rawType = option.tipo || option.type || option.column || option.topic || option.target || '';
        const typeText = mapTerritoryType(rawType);

        // Formato: "En: Provincia SANTIAGO" o "En: SANTIAGO" si no hay tipo
        const reply = typeText ? `En: ${typeText} ${valueText}` : `En: ${valueText}`;

        currentClarification = null;
        currentAssistance = null;
        closeClarificationModal();
        messageInput.value = reply.trim();
        adjustTextareaHeight();
        messageInput.focus();
        sendMessage(); // Auto-enviar la respuesta de clarificación territorial
        return;
    }

    // Para otros tipos, usar lógica existente
    const override = Array.isArray(option.suggestions) && option.suggestions.length
        ? option.suggestions[0].question
        : option.question;
    const value = option.value || option.label || option.description || '';
    applyClarificationSelection(payload, target, value, override);
}

function applyClarificationSelection(payload, target, value, overrideQuestion) {
    const baseQuestion = (payload.original_question || '').trim();
    if (!baseQuestion) return;

    let newQuestion = '';
    if (overrideQuestion && typeof overrideQuestion === 'string') {
        newQuestion = overrideQuestion.trim();
    } else {
        newQuestion = baseQuestion.replace(/[?？]+$/, '').trim();
        const normalized = normalizeClarificationTarget(target);
        if (normalized === 'sector') {
            newQuestion += ` en el sector ${value}`;
        } else if (normalized === 'entity') {
            newQuestion += ` con la entidad ejecutora ${value}`;
        } else if (normalized === 'synonym' || normalized === 'keywords') {
            newQuestion += ` incluyendo la frase "${value}"`;
        } else if (normalized === 'territory') {
            newQuestion += ` en el territorio ${value}`;
        } else if (normalized === 'state') {
            newQuestion += ` con estado ${value}`;
        } else if (normalized === 'objective') {
            newQuestion += ` con el objetivo ${value}`;
        } else if (normalized === 'type') {
            newQuestion += ` del tipo ${value}`;
        } else if (normalized === 'project') {
            newQuestion += ` sobre el proyecto ${value}`;
        } else if (normalized === 'funding') {
            newQuestion += ` con la fuente de financiamiento ${value}`;
        } else if (normalized === 'year_range') {
            const trimmed = String(value || '').trim();
            if (/^\d{4}\s*-\s*\d{4}$/.test(trimmed)) {
                const [startYear, endYear] = trimmed.split('-').map(part => part.trim());
                newQuestion += ` entre los años ${startYear} y ${endYear}`;
            } else {
                newQuestion += ` en el período ${value}`;
            }
        } else if (value) {
            newQuestion += ` ${value}`;
        }
        newQuestion = newQuestion.trim();
    }

    if (!newQuestion) return;
    newQuestion = newQuestion.replace(/[?？]+$/, '').trim();
    newQuestion = `${newQuestion}?`;

    currentClarification = null;
    currentAssistance = null;
    closeClarificationModal();
    messageInput.value = newQuestion;
    adjustTextareaHeight();
    messageInput.focus();
    sendMessage();
}

function renderGrayZoneDetailsButton(messageElement, details) {
    if (!messageElement || !details) return;
    const wrapper = messageElement.querySelector('.message-wrapper');
    const meta = wrapper ? wrapper.querySelector('.message-meta') : null;
    if (!meta) return;

    const info = buildGrayZoneDetailsInfo(details);
    if (!info.hasExtra) {
        const staleBtn = meta.querySelector('.gray-zone-details-btn');
        if (staleBtn) staleBtn.remove();
        return;
    }

    const existing = meta.querySelector('.gray-zone-details-btn');
    if (existing) {
        existing.dataset.grayZoneHtml = info.html;
        existing.onclick = () => openGrayZoneModal(existing.dataset.grayZoneHtml || info.html);
        return;
    }

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'gray-zone-details-btn';
    btn.textContent = 'Ver contexto';
    btn.dataset.grayZoneHtml = info.html;
    btn.addEventListener('click', () => openGrayZoneModal(btn.dataset.grayZoneHtml || info.html));
    meta.appendChild(btn);
}

function openGrayZoneModal(detailsOrHtml) {
    const modal = document.getElementById('grayZoneModal');
    const body = modal?.querySelector('.grayzone-modal-body');
    if (!modal || !body) return;

    let html;
    if (typeof detailsOrHtml === 'string') {
        html = detailsOrHtml;
    } else {
        const info = buildGrayZoneDetailsInfo(detailsOrHtml);
        html = info.html;
    }

    body.innerHTML = html || '<p>No hay información adicional disponible.</p>';
    showInfoModal(modal);
}

function buildGrayZoneDetailsInfo(details) {
    details = details || {};
    try {
        const fragments = [];
        if (details.reason) {
            fragments.push(`<p><strong>Motivo:</strong> ${sanitizeText(details.reason)}</p>`);
        }

        const decision = details.decision || {};
        if (decision.status) {
            const status = sanitizeText(decision.status);
            const rationale = sanitizeText(decision.rationale || '');
            fragments.push(`<p><strong>Decisión del analizador:</strong> ${status}${rationale ? ` — ${rationale}` : ''}</p>`);
        }

        const uncertainties = Array.isArray(details.uncertainties) ? details.uncertainties : [];
        if (uncertainties.length) {
            const items = uncertainties
                .map(item => sanitizeText(`${item.message || ''} ${item.action || ''}`.trim()))
                .filter(Boolean)
                .map(text => `<li>${text}</li>`)
                .join('');
            if (items) {
                fragments.push(`<div><strong>Dudas detectadas:</strong><ul>${items}</ul></div>`);
            }
        }

        const proxies = Array.isArray(details.non_mappable) ? details.non_mappable : [];
        const proxyItems = proxies
            .map(item => sanitizeText(item.atributo || item.alternativa || ''))
            .filter(Boolean)
            .map(text => `<li>${text}</li>`)
            .join('');
        if (proxyItems) {
            fragments.push(`<div><strong>Alternativas sugeridas:</strong><ul>${proxyItems}</ul></div>`);
        }

        const prompts = Array.isArray(details.suggested_user_prompts) ? details.suggested_user_prompts : [];
        if (prompts.length) {
            const list = prompts
                .map(p => `<li>${sanitizeText(p)}</li>`)
                .join('');
            if (list) {
                fragments.push(`<div><strong>Opciones sugeridas:</strong><ul>${list}</ul></div>`);
            }
        }

        if (details.limitation_note) {
            fragments.push(`<p><strong>Nota adicional:</strong> ${sanitizeText(details.limitation_note)}</p>`);
        }

        const warnings = Array.isArray(details.warnings) ? details.warnings : [];
        if (warnings.length) {
            const warningItems = warnings
                .map(warning => `<li>${sanitizeText(warning)}</li>`)
                .join('');
            fragments.push(`<div><strong>Advertencias:</strong><ul>${warningItems}</ul></div>`);
        }

        const theme = details.theme_strategy && typeof details.theme_strategy === 'object'
            ? details.theme_strategy
            : null;
        if (theme) {
            const keywords = Array.isArray(theme.keywords) ? theme.keywords.filter(Boolean) : [];
            if (keywords.length) {
                const keywordItems = keywords
                    .map(kw => `<li>${sanitizeText(kw)}</li>`)
                    .join('');
                fragments.push(`<div><strong>Palabras clave buscadas:</strong><ul>${keywordItems}</ul></div>`);
            }

            const searchFields = Array.isArray(theme.search_fields) ? theme.search_fields.filter(Boolean) : [];
            if (searchFields.length) {
                const fieldItems = searchFields
                    .map(field => `<li>${sanitizeText(field)}</li>`)
                    .join('');
                fragments.push(`<div><strong>Campos explorados:</strong><ul>${fieldItems}</ul></div>`);
            }

            const territoryFilters = Array.isArray(theme.territory_filters) ? theme.territory_filters.filter(Boolean) : [];
            if (territoryFilters.length) {
                const territoryItems = territoryFilters
                    .map(filter => `<li>${sanitizeText(filter)}</li>`)
                    .join('');
                fragments.push(`<div><strong>Territorios sugeridos:</strong><ul>${territoryItems}</ul></div>`);
            }

            if (theme.year_filters && typeof theme.year_filters === 'object') {
                const start = theme.year_filters.start ? sanitizeText(theme.year_filters.start) : '';
                const end = theme.year_filters.end ? sanitizeText(theme.year_filters.end) : '';
                if (start || end) {
                    const rangeText = start && end
                        ? `${start} - ${end}`
                        : start || end;
                    fragments.push(`<p><strong>Rango de años sugerido:</strong> ${rangeText}</p>`);
                }
            }

            if (theme.notes) {
                fragments.push(`<p><strong>Notas del analizador:</strong> ${sanitizeText(theme.notes)}</p>`);
            }
        }

        const semanticGroups = Array.isArray(details.semantic_or_groups) ? details.semantic_or_groups : [];
        if (semanticGroups.length) {
            const groupItems = semanticGroups
                .map(group => {
                    const literals = Array.isArray(group.literals) ? group.literals.filter(Boolean) : [];
                    if (!literals.length) return '';
                    const literalsText = literals.map(lit => `"${sanitizeText(lit)}"`).join(', ');
                    const scope = group.scope ? ` (${sanitizeText(group.scope)})` : '';
                    return `<li>${literalsText}${scope}</li>`;
                })
                .filter(Boolean)
                .join('');
            if (groupItems) {
                fragments.push(`<div><strong>Grupos OR semánticos:</strong><ul>${groupItems}</ul></div>`);
            }
        }

        const hasExtra = fragments.length > 0;
        const html = hasExtra
            ? fragments.join('')
            : '<p>No hay información adicional disponible.</p>';
        return { html, hasExtra };
    } catch (err) {
        console.warn('No se pudo formatear gray_zone_details:', err);
        return {
            html: `<pre class="grayzone-debug">${sanitizeText(JSON.stringify(details, null, 2))}</pre>`,
            hasExtra: true,
        };
    }
}

function normalizeTechnicalSections(details) {
    if (!details) return [];
    if (typeof details === 'string') {
        const trimmed = details.trim();
        return trimmed ? [{ title: 'Detalles técnicos', body: trimmed }] : [];
    }
    if (Array.isArray(details)) {
        return details
            .map(section => {
                if (typeof section === 'string') {
                    const text = section.trim();
                    return text ? { title: '', body: text } : null;
                }
                if (section && typeof section === 'object') {
                    const title = typeof section.title === 'string' ? section.title : '';
                    const body = typeof section.body === 'string' ? section.body : '';
                    const items = Array.isArray(section.items)
                        ? section.items
                            .map(item => String(item || '').trim())
                            .filter(Boolean)
                        : [];
                    if (!title && !body && !items.length) return null;
                    return { title, body, items };
                }
                return null;
            })
            .filter(Boolean);
    }
    if (details && typeof details === 'object') {
        let sections = [];
        if (Array.isArray(details.sections)) {
            sections = normalizeTechnicalSections(details.sections);
        } else if (typeof details.raw_text === 'string' && details.raw_text.trim()) {
            sections = [{ title: 'Análisis del LLM', body: details.raw_text.trim() }];
        } else if (typeof details.summary === 'string' && details.summary.trim()) {
            sections = [{ title: 'Resumen Técnico', body: details.summary.trim() }];
        }

        // Support for total execution time (injected by backend)
        if (typeof details.total_duration_seconds === 'number') {
            sections.unshift({
                title: 'Tiempo de Respuesta',
                body: `Tiempo de espera total: ${details.total_duration_seconds}s`
            });
        }

        return sections;
    }
    return [];
}

function buildTechnicalDetailsHtml(details) {
    const sections = normalizeTechnicalSections(details);
    if (!sections.length) return '';
    return sections
        .map(section => {
            const parts = ['<section class="technical-details-section">'];
            if (section.title) {
                parts.push(`<h4>${sanitizeText(section.title)}</h4>`);
            }
            if (section.body) {
                parts.push(
                    `<pre class="technical-details-pre">${sanitizeText(section.body)}</pre>`
                );
            }
            if (Array.isArray(section.items) && section.items.length) {
                const itemsHtml = section.items
                    .map(item => `<li>${sanitizeText(item)}</li>`)
                    .join('');
                parts.push(`<ul>${itemsHtml}</ul>`);
            }
            parts.push('</section>');
            return parts.join('');
        })
        .join('');
}

function renderTechnicalDetailsButton(messageElement, details) {
    if (!messageElement) return;

    const sections = normalizeTechnicalSections(details);

    // Si no hay secciones, limpiar dataset y salir
    if (!sections.length) {
        delete messageElement.dataset.technicalDetailsHtml;
        return;
    }

    const html = buildTechnicalDetailsHtml(sections);
    if (!html) {
        return;
    }

    // Guardar HTML en el messageElement para acceso desde el menú de response-actions
    messageElement.dataset.technicalDetailsHtml = html;
}

function openTechnicalDetailsModal(detailsOrHtml, messageElement) {
    // Determinar el HTML de detalles
    let html;
    if (typeof detailsOrHtml === 'string') {
        html = detailsOrHtml;
    } else if (typeof buildTechnicalDetailsHtml === 'function') {
        html = buildTechnicalDetailsHtml(detailsOrHtml);
    } else {
        html = detailsOrHtml;
    }

    // Abrir el sidebar en lugar del modal
    if (typeof openTechnicalSidebar === 'function') {
        openTechnicalSidebar(html, messageElement);
    } else {
        console.error('[SIDEBAR] Función openTechnicalSidebar no disponible');
    }
}

function sanitizeText(text) {
    return String(text || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function stripHtmlTags(value) {
    return String(value || '').replace(/<[^>]*>/g, '');
}

/**
 * Descarga los datos de la tabla y los metadatos técnicos en formato CSV y TXT.
 * 
 * TRANSPARENCIA Y EXPLICABILIDAD (UNESCO):
 * Esta función implementa los principios de transparencia y explicabilidad de la
 * Recomendación de la UNESCO sobre la Ética de la IA (art. 37-41). Permite a los
 * usuarios descargar tanto los datos resultantes como los metadatos técnicos que
 * explican cómo se generó la respuesta, incluyendo la consulta SQL ejecutada,
 * los filtros aplicados y las decisiones del sistema. Esto garantiza el derecho
 * de los usuarios a acceder a información completa sobre las decisiones que les
 * afectan y facilita el escrutinio público y la rendición de cuentas.
 * Referencia: https://www.unesco.org/en/legal-affairs/recommendation-ethics-artificial-intelligence
 */
function downloadTableAndMetadata(messageElement, technicalDetailsHtml) {
    // Obtener tabla del mensaje
    const table = messageElement.querySelector('.tabla-respuesta');
    if (!table) {
        showToast('No se encontró tabla para descargar', 'error');
        return;
    }

    // Generar timestamp para nombres de archivo
    const now = new Date();
    const timestamp = now.toISOString().replace(/[:.]/g, '-').slice(0, -5); // Formato: 2024-01-15T10-30-45
    const dateStr = timestamp.split('T')[0]; // Solo fecha: 2024-01-15
    const formattedDate = now.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });

    // Obtener pregunta completa del mensaje
    const completeQuestion = messageElement.dataset.completeQuestion || 'Pregunta no disponible';

    // 1. Extraer datos de la tabla y convertir a CSV
    const headers = [];
    const headerCells = table.querySelectorAll('thead th');
    headerCells.forEach(th => {
        const text = stripHtmlTags(th.textContent || th.innerText).trim();
        headers.push(text);
    });

    const rows = [];
    const bodyRows = table.querySelectorAll('tbody tr');
    bodyRows.forEach(tr => {
        const cells = tr.querySelectorAll('td');
        const rowData = [];
        cells.forEach(td => {
            const text = stripHtmlTags(td.textContent || td.innerText).trim();
            // Todos los campos entre comillas dobles para evitar problemas con comas
            // Escapar comillas dobles duplicándolas (estándar CSV)
            const escaped = `"${text.replace(/"/g, '""')}"`;
            rowData.push(escaped);
        });
        if (rowData.length === headers.length) {
            rows.push(rowData);
        }
    });

    // Construir CSV con todos los campos entre comillas
    const escapedHeaders = headers.map(h => `"${h.replace(/"/g, '""')}"`);
    const csvContent = [
        escapedHeaders.join(','),
        ...rows.map(row => row.join(','))
    ].join('\n');

    // 2. Extraer contenido de detalles técnicos y convertir a texto plano
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = technicalDetailsHtml || '';

    // Construir metadata con fecha y pregunta completa al inicio
    let metadataText = '';
    metadataText += 'Fecha: ' + formattedDate + '\n';
    metadataText += 'Pregunta completa: ' + completeQuestion + '\n';
    metadataText += '='.repeat(50) + '\n\n';

    // Debug: verificar que se está construyendo correctamente
    console.log('[DOWNLOAD] Metadata header:', {
        fecha: formattedDate,
        pregunta: completeQuestion,
        tienePregunta: !!completeQuestion && completeQuestion !== 'Pregunta no disponible'
    });

    const sections = tempDiv.querySelectorAll('.technical-details-section');
    sections.forEach(section => {
        const title = section.querySelector('h4');
        if (title) {
            metadataText += stripHtmlTags(title.textContent || title.innerText).trim() + '\n';
            metadataText += '='.repeat(50) + '\n\n';
        }

        const pre = section.querySelector('pre');
        if (pre) {
            metadataText += stripHtmlTags(pre.textContent || pre.innerText).trim() + '\n\n';
        }

        const items = section.querySelectorAll('ul li');
        if (items.length > 0) {
            items.forEach(li => {
                metadataText += '• ' + stripHtmlTags(li.textContent || li.innerText).trim() + '\n';
            });
            metadataText += '\n';
        }
    });

    if (!metadataText.trim()) {
        metadataText = 'No hay detalles técnicos disponibles.';
    }

    // 3. Crear y descargar archivos
    const csvBlob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' }); // BOM para Excel
    const txtBlob = new Blob([metadataText], { type: 'text/plain;charset=utf-8;' });

    const csvUrl = URL.createObjectURL(csvBlob);
    const txtUrl = URL.createObjectURL(txtBlob);

    const csvLink = document.createElement('a');
    csvLink.href = csvUrl;
    csvLink.download = `${dateStr}_mapainversioneschat_data.csv`;
    document.body.appendChild(csvLink);
    csvLink.click();
    document.body.removeChild(csvLink);
    URL.revokeObjectURL(csvUrl);

    // Pequeño delay para que el navegador procese la primera descarga
    setTimeout(() => {
        const txtLink = document.createElement('a');
        txtLink.href = txtUrl;
        txtLink.download = `${dateStr}_mapainversioneschat_metadata.txt`;
        document.body.appendChild(txtLink);
        txtLink.click();
        document.body.removeChild(txtLink);
        URL.revokeObjectURL(txtUrl);

        showToast('Datos y metadata descargados', 'success');
    }, 100);
}

const clarificationModal = document.getElementById('clarificationModal');
const clarificationModalBody = document.getElementById('clarificationModalBody');
const clarificationModalClose = document.getElementById('clarificationModalClose');

function describeClarificationTarget(target) {
    switch (normalizeClarificationTarget(target)) {
        case 'sector': return 'Indicá un sector específico';
        case 'entity': return 'Elegí una entidad ejecutora';
        case 'territory': return 'Aclarar la provincia o municipio';
        case 'state': return 'Seleccione el estado del proyecto';
        case 'synonym':
        case 'keywords': return 'Agregá una palabra clave adicional';
        case 'objective': return 'Precisá el objetivo o programa';
        case 'type': return 'Especificá el tipo de proyecto';
        case 'project': return 'Seleccione el nombre del proyecto';
        default: return `Agregá más detalle sobre ${sanitizeText(target)}`;
    }
}

function openClarificationModal(payload = {}, assistanceMeta = null) {
    if (!clarificationModal || !clarificationModalBody) return;

    const baseMessage = (
        (payload && typeof payload.message === 'string' && payload.message.trim()) ||
        (assistanceMeta && typeof assistanceMeta.message === 'string' && assistanceMeta.message.trim()) ||
        'Necesito un dato más para continuar.'
    );
    const targets = Array.isArray(payload?.targets) && payload.targets.length
        ? payload.targets
        : (assistanceMeta?.metadata && Array.isArray(assistanceMeta.metadata.targets)
            ? assistanceMeta.metadata.targets
            : []);
    const hints = Array.isArray(payload?.hints) && payload.hints.length
        ? payload.hints
        : (assistanceMeta?.metadata && Array.isArray(assistanceMeta.metadata.hints)
            ? assistanceMeta.metadata.hints
            : []);

    const normalizedTargets = Array.from(new Set(targets.map(normalizeClarificationTarget).filter(Boolean)));
    const targetList = normalizedTargets.length
        ? `<ul class="clarification-hints-list">${normalizedTargets.map(target => `<li>${sanitizeText(describeClarificationTarget(target))}</li>`).join('')}</ul>`
        : '';

    const hintsList = hints.length
        ? `<p class="clarification-note mb-1">Recomendaciones:</p><ul class="clarification-hints-list">${hints.map(h => `<li>${sanitizeText(h)}</li>`).join('')}</ul>`
        : '';

    clarificationModalBody.innerHTML = `<p>${sanitizeText(baseMessage)}</p>${targetList}${hintsList}`;
    clarificationModal.style.display = 'flex';
    requestAnimationFrame(() => clarificationModal.classList.add('show'));
    registerBodyLock(clarificationModal);
}

function closeClarificationModal() {
    if (!clarificationModal) return;
    clarificationModal.classList.remove('show');
    const finalize = () => {
        clarificationModal.style.display = 'none';
        clarificationModalBody.innerHTML = '';
        releaseBodyLock(clarificationModal);
    };
    setTimeout(finalize, 220);
}

if (clarificationModalClose) {
    clarificationModalClose.addEventListener('click', closeClarificationModal);
}
if (clarificationModal) {
    clarificationModal.addEventListener('click', (event) => {
        if (event.target === clarificationModal) {
            closeClarificationModal();
        }
    });
}
document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && clarificationModal && clarificationModal.classList.contains('show')) {
        closeClarificationModal();
    }
});

function handleCitizenChipClick(button, data, originalQuestion, chipList) {
    if (!button) return;
    if (button.disabled) return;
    if (isTyping) return;

    if (Array.isArray(chipList)) {
        chipList.forEach(chip => chip.classList.remove('loading'));
    }

    const promptSource = (button.dataset.prompt || button.textContent || '').replace(/<[^>]+>/g, '').trim();
    if (!promptSource || !messageInput) return;

    // Para TODOS los chips, concatenar la pregunta original con el prompt
    // Esto mantiene el contexto de la conversación
    let finalPrompt = promptSource;
    if (originalQuestion && originalQuestion.trim()) {
        const baseQ = originalQuestion.trim();
        // Verificación mejorada: busca la pregunta completa o al menos el 70% de sus palabras
        const baseQLower = baseQ.toLowerCase();
        const promptLower = promptSource.toLowerCase();
        const baseQWords = baseQLower.split(/\s+/).filter(w => w.length > 2); // Palabras significativas (>2 chars)
        const wordsInPrompt = baseQWords.filter(w => promptLower.includes(w)).length;
        const overlapRatio = baseQWords.length > 0 ? wordsInPrompt / baseQWords.length : 0;

        // Solo concatenar si menos del 70% de las palabras de la pregunta están en el prompt
        // O si la pregunta es muy corta (menos de 10 caracteres), siempre concatenar
        if (baseQ.length < 10 || overlapRatio < 0.7) {
            finalPrompt = `${baseQ} ${promptSource}`;
        }
    }

    // Para chips de clarificación, agregar ":" al final para indicar que puede completar
    const chipKind = button.dataset.kind || '';
    if (chipKind === 'clarification' && finalPrompt.trim()) {
        const trimmed = finalPrompt.trim();
        const lastChar = trimmed.slice(-1);
        if (lastChar === '?') {
            // Si termina en "?", mantener "?" y agregar " :"
            finalPrompt = trimmed + ' :';
        } else if (lastChar === '.') {
            // Si termina en punto, reemplazarlo por ":"
            finalPrompt = trimmed.slice(0, -1) + ':';
        } else if (lastChar !== ':') {
            // Si no termina en ":", agregar ":"
            finalPrompt = trimmed + ':';
        }
    }

    // Para chips de reintentar_con_filtros_ajustados, setear flag especial
    if (chipKind === 'reintentar_con_filtros_ajustados') {
        // Guardar flag en el input para que sendQuestion lo detecte
        messageInput.dataset.pendingIrrelevantRetry = 'true';
    } else {
        // Limpiar flag si no es reintento
        delete messageInput.dataset.pendingIrrelevantRetry;
    }

    messageInput.value = finalPrompt;
    adjustTextareaHeight?.();
    // Posicionar cursor al final para que pueda empezar a escribir inmediatamente
    requestAnimationFrame(() => {
        const len = finalPrompt.length;
        messageInput.setSelectionRange(len, len);
        messageInput.focus();
        if (typeof messageInput.scrollIntoView === 'function') {
            messageInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    });
    messageInput.classList.remove('input-prefill-highlight');
    void messageInput.offsetWidth;
    messageInput.classList.add('input-prefill-highlight');

    // Mostrar toast informativo para chips de clarificación
    if (chipKind === 'clarification') {
        setTimeout(() => {
            showToast('Completá con lo que necesites', 'success');
        }, 300);
    }
}

function handleResponseAction(action, text, btn) {
    const messageWrapper = btn.closest('.message-wrapper');
    switch (action) {
        case 'like': return handleLike(btn);
        case 'dislike': return handleDislike(btn, messageWrapper);
        case 'copy': return handleCopy(text);
        case 'share': return handleShare(text);
    }
}

function handleLike(btn) {
    const dislike = btn.parentElement.querySelector('[data-action="dislike"]');
    if (dislike) dislike.classList.remove('active');
    btn.classList.toggle('active');

    // mostrar modal de feedback
    showToast(btn.classList.contains('active')
        ? '¡Gracias por tu feedback positivo!' : 'Feedback removido');

    // Fija o libera visibilidad de los botones
    const meta = btn.closest('.message-meta');
    if (meta) {
        if (btn.classList.contains('active')) meta.classList.add('pinned');
        else if (!meta.querySelector('.response-action-btn-modern.active')) {
            meta.classList.remove('pinned');
        }
    }

    // Enviar feedback al backend
    const answerId = btn.closest('.response-actions').dataset.answerId || 0;
    sendFeedback(answerId, btn.classList.contains('active'));

    // Log para depuración
    console.log('[META] feedback enviado', { answerId, isApproved: btn.classList.contains('active') });
}

function handleDislike(btn, messageWrapper) {
    const like = btn.parentElement.querySelector('[data-action="like"]');
    if (like) like.classList.remove('active');

    const meta = btn.closest('.message-meta');
    if (meta) meta.classList.add('pinned');

    toggleFeedbackInline(messageWrapper, btn);

    const answerId = btn.closest('.response-actions').dataset.answerId || 0;
    const modal = document.getElementById('feedbackModal');
    if (modal) {
        modal.dataset.answerId = answerId;
    }
}

function toggleFeedbackInline(messageWrapper, buttonElement) {
    if (!messageWrapper || !buttonElement) return;

    let feedbackContainer = messageWrapper.querySelector('.feedback-inline-container');
    const meta = buttonElement.closest('.message-meta');

    if (feedbackContainer) {
        if (feedbackContainer.classList.contains('show')) {
            hideFeedbackInline(feedbackContainer);
            buttonElement.classList.remove('active');
            if (meta && !meta.querySelector('.response-action-btn-modern.active')) {
                meta.classList.remove('pinned');
            }
        } else {
            buttonElement.classList.add('active');
            showFeedbackInline(feedbackContainer);
        }
        return;
    }

    buttonElement.classList.add('active');
    feedbackContainer = createFeedbackInline(messageWrapper);
    if (feedbackContainer && meta) {
        meta.classList.add('pinned');
    }
    if (feedbackContainer) {
        showFeedbackInline(feedbackContainer);
    }
}

function createFeedbackInline(messageWrapper) {
    if (!messageWrapper) return null;

    const existing = messageWrapper.querySelector('.feedback-inline-container');
    if (existing) existing.remove();

    const feedbackHtml = `
                <div class="feedback-inline-container">
                    <div class="feedback-inline-header">
                        <h4 class="feedback-inline-title">¿Qué podríamos mejorar en esta respuesta?</h4>
                        <button class="feedback-inline-close" aria-label="Cerrar feedback">
                            <i data-feather="x" style="width: 14px; height: 14px;"></i>
                        </button>
                    </div>
                    <div class="feedback-inline-options">
                        <button class="feedback-inline-option" data-feedback="incomplete">
                            <i data-feather="minus-circle" class="feedback-inline-option-icon"></i>
                            <span>La respuesta está incompleta o falta información importante</span>
                        </button>
                        <button class="feedback-inline-option" data-feedback="incorrect">
                            <i data-feather="x-circle" class="feedback-inline-option-icon"></i>
                            <span>Los datos o cifras son incorrectos</span>
                        </button>
                        <button class="feedback-inline-option" data-feedback="outdated">
                            <i data-feather="clock" class="feedback-inline-option-icon"></i>
                            <span>La información está desactualizada</span>
                        </button>
                        <button class="feedback-inline-option" data-feedback="unclear">
                            <i data-feather="help-circle" class="feedback-inline-option-icon"></i>
                            <span>La explicación no es clara o es confusa</span>
                        </button>
                        <button class="feedback-inline-option" data-feedback="irrelevant">
                            <i data-feather="alert-triangle" class="feedback-inline-option-icon"></i>
                            <span>No responde a mi pregunta específica</span>
                        </button>
                        <button class="feedback-inline-option" data-feedback="bias">
                            <i data-feather="eye-off" class="feedback-inline-option-icon"></i>
                            <span>Muestra sesgo político o falta objetividad</span>
                        </button>
                        <button class="feedback-inline-option" data-feedback="sources">
                            <i data-feather="link-2" class="feedback-inline-option-icon"></i>
                            <span>Faltan fuentes oficiales o enlaces de referencia</span>
                        </button>
                        <button class="feedback-inline-option" data-feedback="other">
                            <i data-feather="message-circle" class="feedback-inline-option-icon"></i>
                            <span>Otro motivo</span>
                        </button>
                    </div>
                    <div class="feedback-inline-footer">
                        <p class="feedback-inline-note">Tu feedback nos ayuda a mejorar las respuestas</p>
                    </div>
                </div>
            `;

    const suggestionsBlock = messageWrapper.querySelector('.compact-suggestions');
    if (suggestionsBlock) {
        suggestionsBlock.insertAdjacentHTML('beforebegin', feedbackHtml);
    } else {
        messageWrapper.insertAdjacentHTML('beforeend', feedbackHtml);
    }

    const feedbackContainer = messageWrapper.querySelector('.feedback-inline-container');
    feather.replace();
    initializeFeedbackInlineHandlers(feedbackContainer);
    return feedbackContainer;
}

function showFeedbackInline(container) {
    if (!container) return;
    container.classList.add('show');
    setTimeout(() => {
        container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 150);
}

function hideFeedbackInline(container) {
    if (!container) return;
    container.classList.remove('show');
}

function initializeFeedbackInlineHandlers(container) {
    if (!container) return;

    const messageWrapper = container.closest('.message-wrapper');
    const responseActions = messageWrapper?.querySelector('.response-actions');
    const answerId = responseActions?.dataset.answerId || 0;
    const dislikeBtn = messageWrapper?.querySelector('.response-action-btn-modern[data-action="dislike"]');
    const meta = messageWrapper?.querySelector('.message-meta');

    const closeBtn = container.querySelector('.feedback-inline-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            hideFeedbackInline(container);
            if (dislikeBtn) dislikeBtn.classList.remove('active');
            if (meta && !meta.querySelector('.response-action-btn-modern.active')) {
                meta.classList.remove('pinned');
            }
        });
    }

    const options = container.querySelectorAll('.feedback-inline-option');
    options.forEach(option => {
        option.addEventListener('click', () => {
            if (option.classList.contains('processing')) return;
            option.classList.add('processing');

            options.forEach(opt => {
                if (opt !== option) {
                    opt.style.opacity = '0.5';
                    opt.style.pointerEvents = 'none';
                }
            });

            const feedbackType = option.getAttribute('data-feedback');

            setTimeout(() => {
                sendFeedback(answerId, false, feedbackType);
                showToast(getFeedbackConfirmation(feedbackType), 'success');

                if (dislikeBtn) dislikeBtn.classList.remove('active');
                if (meta && !meta.querySelector('.response-action-btn-modern.active')) {
                    meta.classList.remove('pinned');
                }

                container.remove();
            }, 600);
        });
    });

    // ============================================
    // CÓDIGO JAVASCRIPT PARA FEEDBACK PERSONALIZADO
    // ============================================
    // Agregar este código dentro de la función initializeFeedbackInlineHandlers, 
    // después de la línea 1416 (después del forEach de options)

    // Manejo especial para la opción "Otro motivo"
    const otherOption = container.querySelector('.feedback-inline-option[data-feedback="other"]');
    if (otherOption) {
        otherOption.addEventListener('click', (e) => {
            e.stopPropagation(); // Evitar que se ejecute el listener anterior

            // Cambiar la opción por el formulario de feedback
            const feedbackType = otherOption.getAttribute('data-feedback');

            if (feedbackType === 'other') {
                // Ocultar todas las opciones
                options.forEach(opt => {
                    opt.style.display = 'none';
                });

                // Cambiar el título
                const titleElement = container.querySelector('.feedback-inline-title');
                if (titleElement) {
                    titleElement.innerHTML = '✍️ Enviar Feedback';
                }

                // Crear formulario de feedback personalizado
                const feedbackForm = document.createElement('div');
                feedbackForm.className = 'feedback-custom-form';
                feedbackForm.innerHTML = `
    <div class="feedback-custom-message">
        <p class="feedback-custom-info">
            Si el chatbot no respondió correctamente tu pregunta, escríbenos para ayudarte. 
            Ingresa tu correo para que podamos contactarte.
        </p>
    </div>
    <div class="feedback-custom-field">
        <label for="feedback-email" class="feedback-custom-label">
            Correo electrónico (opcional)
        </label>
        <input 
            type="email" 
            id="feedback-email"
            class="feedback-custom-email" 
            placeholder="tu@correo.com"
            
        />
    </div>
    <div class="feedback-custom-field">
        <label for="feedback-message" class="feedback-custom-label">
            Describe el error <span class="feedback-required">*</span>
        </label>
        <textarea 
    id="feedback-message"
    class="feedback-custom-textarea" 
    placeholder="Describe qué problema encontraste o qué información necesitas..."
    rows="3"
    maxlength="500"
    required
></textarea>
        <span class="feedback-custom-counter">0/500</span>
    </div>
    <div class="feedback-custom-buttons">
        <button type="button" class="feedback-custom-btn feedback-custom-cancel">Cancelar</button>
        <button type="button" class="feedback-custom-btn feedback-custom-submit">Enviar</button>
    </div>
`;


                // Insertar el formulario donde estaban las opciones
                const optionsContainer = container.querySelector('.feedback-inline-options');
                optionsContainer.appendChild(feedbackForm);

                // Referencias a elementos del formulario
                const emailInput = feedbackForm.querySelector('.feedback-custom-email');
                const textarea = feedbackForm.querySelector('.feedback-custom-textarea');
                const counter = feedbackForm.querySelector('.feedback-custom-counter');
                const cancelBtn = feedbackForm.querySelector('.feedback-custom-cancel');
                const submitBtn = feedbackForm.querySelector('.feedback-custom-submit');

                // Validar email en tiempo real
                emailInput.addEventListener('input', () => {
                    const email = emailInput.value.trim();
                    if (email && !isValidEmail(email)) {
                        emailInput.style.borderColor = '#c8102e';
                    } else if (email) {
                        emailInput.style.borderColor = '#28a745';
                    } else {
                        emailInput.style.borderColor = 'rgba(220, 225, 232, 0.8)';
                    }
                });

                // Función auxiliar para validar email
                function isValidEmail(email) {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    return emailRegex.test(email);
                }


                // Actualizar contador de caracteres
                textarea.addEventListener('input', () => {
                    const length = textarea.value.length;
                    counter.textContent = `${length}/500`;

                    // Cambiar color si se acerca al límite
                    if (length > 450) {
                        counter.style.color = '#c8102e';
                    } else {
                        counter.style.color = '#8895a7';
                    }
                });



                // Botón cancelar
                cancelBtn.addEventListener('click', () => {
                    // Restaurar opciones originales
                    options.forEach(opt => {
                        opt.style.display = 'flex';
                    });
                    feedbackForm.remove();

                    // Restaurar título
                    if (titleElement) {
                        titleElement.innerHTML = '💭 ¿Qué podríamos mejorar en esta respuesta?';
                    }
                });

                // Botón enviar
                submitBtn.addEventListener('click', () => {
                    const userEmail = emailInput.value.trim();
                    const feedbackText = textarea.value.trim();

                    // Validar que el texto del feedback no esté vacío (obligatorio)
                    if (!feedbackText) {
                        showToast('Por favor describe el problema encontrado', 'error');
                        textarea.focus();
                        textarea.style.borderColor = '#c8102e';
                        return;
                    }

                    // Validar longitud mínima
                    if (feedbackText.length < 10) {
                        showToast('Por favor escribe al menos 10 caracteres', 'error');
                        textarea.focus();
                        return;
                    }

                    // Si el usuario proporcionó email, validarlo; si no, lo aceptamos como opcional
                    if (userEmail && !isValidEmail(userEmail)) {
                        showToast('Por favor ingresa un correo electrónico válido', 'error');
                        emailInput.focus();
                        emailInput.style.borderColor = '#c8102e';
                        return;
                    }

                    // Deshabilitar botón mientras se envía
                    submitBtn.disabled = true;
                    submitBtn.textContent = 'Enviando...';
                    emailInput.disabled = true;
                    textarea.disabled = true;

                    // Obtener la pregunta del usuario (mensaje anterior)
                    const messageWrapper = container.closest('.message-wrapper');
                    const allMessages = document.querySelectorAll('.message.user');
                    let userQuestion = 'Pregunta no disponible';

                    // Buscar la pregunta del usuario que corresponde a esta respuesta
                    for (let i = allMessages.length - 1; i >= 0; i--) {
                        const userMsg = allMessages[i];
                        const nextMessage = userMsg.nextElementSibling;
                        if (nextMessage && nextMessage.contains(messageWrapper)) {
                            userQuestion = userMsg.querySelector('.message-content')?.textContent || 'Pregunta no disponible';
                            break;
                        }
                    }

                    // Enviar feedback personalizado con el email del usuario
                    sendCustomFeedback(answerId, feedbackText, userQuestion, userEmail)
                        .then((res) => {
                            // If backend reported conflict, show an info toast and replace the inline
                            // form with a small badge. Otherwise show the normal success toast.
                            if (res && res.conflict) {
                                showToast('Ya registramos tu feedback para esta respuesta. ¡Gracias!', 'info');

                                // Remove inline form and show a small badge so user knows it's recorded
                                try {
                                    const messageWrapper = container.closest('.message-wrapper');
                                    if (messageWrapper) {
                                        // remove any inline feedback containers
                                        messageWrapper.querySelectorAll('.feedback-inline-container').forEach(f => f.remove());

                                        // insert badge if not present
                                        if (!messageWrapper.querySelector('.feedback-sent-badge')) {
                                            const badge = document.createElement('div');
                                            badge.className = 'feedback-sent-badge';
                                            badge.textContent = 'Feedback registrado';
                                            badge.style.cssText = 'margin-top:8px;color:#2f6fed;font-weight:600;font-size:0.95rem;';
                                            const metaEl = messageWrapper.querySelector('.message-meta');
                                            if (metaEl && metaEl.parentNode) metaEl.parentNode.insertBefore(badge, metaEl.nextSibling);
                                        }
                                    }
                                } catch (_) { }

                            } else {
                                if (userEmail) {
                                    showToast('¡Gracias! Te contactaremos pronto a tu correo', 'success');
                                } else {
                                    showToast('¡Gracias! Tu feedback fue enviado.', 'success');
                                }

                                // Limpiar y cerrar
                                if (dislikeBtn) dislikeBtn.classList.remove('active');
                                if (meta && !meta.querySelector('.response-action-btn-modern.active')) {
                                    meta.classList.remove('pinned');
                                }
                                container.remove();
                            }
                        })
                        .catch((error) => {
                            console.error('Error al enviar feedback:', error);
                            showToast('Error al enviar. Por favor intenta nuevamente', 'error');
                            submitBtn.disabled = false;
                            submitBtn.textContent = 'Enviar';
                            emailInput.disabled = false;
                            textarea.disabled = false;
                        });
                });




                // Enfocar el textarea
                setTimeout(() => emailInput.focus(), 100);
            }
        }, true); // useCapture = true para ejecutar antes que el listener anterior
    }



}

function getFeedbackConfirmation(type) {
    switch (type) {
        case 'incomplete':
            return 'Trabajaremos en respuestas más completas.';
        case 'incorrect':
            return 'Verificaremos y corregiremos los datos.';
        case 'outdated':
            return 'Actualizaremos la información disponible.';
        case 'unclear':
            return 'Mejoraremos la claridad de las explicaciones.';
        case 'irrelevant':
            return 'Ajustaremos las respuestas para que sean más relevantes.';
        case 'bias':
            return 'Revisaremos el contenido para mantener la objetividad.';
        case 'sources':
            return 'Añadiremos más referencias oficiales.';
        case 'other':
        default:
            return 'Gracias por tu feedback. Nos ayuda a mejorar.';
    }
}



async function handleCopy(text) {
    console.log('[META] handleCopy');
    try { await navigator.clipboard.writeText(text); }
    catch {
        const t = document.createElement('textarea');
        t.value = text; document.body.appendChild(t);
        t.select(); document.execCommand('copy'); document.body.removeChild(t);
    }
    showToast('Respuesta copiada al portapapeles');
}

async function handleShare(text) {
    console.log('[META] handleShare');
    try {
        if (navigator.share) {
            await navigator.share({ title: 'Respuesta', text, url: location.href });
        } else {
            await navigator.clipboard.writeText(`${text}\n\n${location.href}`);
        }
        showToast('Respuesta compartida');
    } catch { showToast('No se pudo compartir', 'error'); }
}

//============================================
// NUEVA FUNCIONALIDAD: Menú Desplegable
// ============================================

function initMoreActionsMenu() {
    document.addEventListener('click', (e) => {
        const trigger = e.target.closest('.more-actions-trigger');

        if (trigger) {
            e.stopPropagation();
            const wrapper = trigger.closest('.more-actions-wrapper');
            const menu = wrapper?.querySelector('.more-actions-menu');

            if (!menu) return;

            const isCurrentlyOpen = menu.getAttribute('aria-hidden') === 'false';

            // Cerrar todos los demás menús
            document.querySelectorAll('.more-actions-menu').forEach(m => {
                if (m !== menu) {
                    m.setAttribute('aria-hidden', 'true');
                    m.setAttribute('hidden', '');
                    const t = m.closest('.more-actions-wrapper')?.querySelector('.more-actions-trigger');
                    if (t) t.setAttribute('aria-expanded', 'false');
                }
            });

            // Toggle este menú
            if (isCurrentlyOpen) {
                menu.setAttribute('aria-hidden', 'true');
                menu.setAttribute('hidden', '');
                trigger.setAttribute('aria-expanded', 'false');
            } else {
                menu.setAttribute('aria-hidden', 'false');
                menu.removeAttribute('hidden');
                trigger.setAttribute('aria-expanded', 'true');
            }

            return;
        }

        // Click en ítem del menú
        const menuItem = e.target.closest('.more-action-item');
        if (menuItem) {
            e.stopPropagation();
            const action = menuItem.getAttribute('data-action');
            const messageElement = menuItem.closest('.message');

            // Para "read-aloud", NO cerrar el menú (mantener visible)
            if (action !== 'read-aloud') {
                // Cerrar menú solo para otras acciones
                const menu = menuItem.closest('.more-actions-menu');
                if (menu) {
                    menu.setAttribute('aria-hidden', 'true');
                    menu.setAttribute('hidden', '');
                    const wrapper = menu.closest('.more-actions-wrapper');
                    const trigger = wrapper?.querySelector('.more-actions-trigger');
                    if (trigger) trigger.setAttribute('aria-expanded', 'false');
                }
            }

            // Ejecutar acción
            if (action === 'technical-details') {
                handleTechnicalDetailsAction(messageElement);
            } else if (action === 'read-aloud') {
                handleReadAloudAction(messageElement);
            } else if (action === 'copy') {
                const messageContent = messageElement.querySelector('.message-content');
                const text = messageContent ? messageContent.textContent : '';
                handleCopy(text);
            }

            return;
        }

        // Click fuera: cerrar todos los menús
        document.querySelectorAll('.more-actions-menu[aria-hidden="false"]').forEach(menu => {
            menu.setAttribute('aria-hidden', 'true');
            menu.setAttribute('hidden', '');
            const wrapper = menu.closest('.more-actions-wrapper');
            const trigger = wrapper?.querySelector('.more-actions-trigger');
            if (trigger) trigger.setAttribute('aria-expanded', 'false');
        });
    });

    // Escape: cerrar menús
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            document.querySelectorAll('.more-actions-menu[aria-hidden="false"]').forEach(menu => {
                menu.setAttribute('aria-hidden', 'true');
                menu.setAttribute('hidden', '');
                const wrapper = menu.closest('.more-actions-wrapper');
                const trigger = wrapper?.querySelector('.more-actions-trigger');
                if (trigger) trigger.setAttribute('aria-expanded', 'false');
            });
        }
    });
}

// ============================================
// NUEVA FUNCIONALIDAD: Ver razonamiento
// ============================================

function handleTechnicalDetailsAction(messageElement) {
    if (!messageElement) {
        showNotification('No se pudo acceder al mensaje', 'error');
        return;
    }

    // Leer los datos guardados en el dataset del messageElement
    const technicalHtml = messageElement.dataset.technicalDetailsHtml;

    if (technicalHtml) {
        openTechnicalDetailsModal(technicalHtml, messageElement);
    } else {
        showNotification('No hay detalles técnicos disponibles para esta respuesta', 'info');
    }
}

// ============================================
// FUNCIONALIDAD: Leer en Voz Alta (VERSIÓN CORREGIDA)
// ============================================

let currentSpeechState = {
    utterance: null,
    text: '',
    messageElement: null,
    isPaused: false,
    isReading: false,
    button: null
};

function handleReadAloudAction(messageElement) {
    if (!messageElement) {
        showNotification('No se pudo acceder al mensaje', 'error');
        return;
    }

    const messageContent = messageElement.querySelector('.message-content');
    const text = messageContent?.textContent?.trim() || '';

    if (!text) {
        showNotification('No hay texto para leer', 'warning');
        return;
    }

    // Verificar soporte del navegador
    if (!('speechSynthesis' in window)) {
        showNotification('Tu navegador no soporta lectura en voz alta', 'error');
        return;
    }

    const btn = messageElement.querySelector('.more-action-item[data-action="read-aloud"]');

    // Si está leyendo este mismo mensaje
    if (currentSpeechState.isReading && currentSpeechState.messageElement === messageElement) {
        if (currentSpeechState.isPaused) {
            resumeReading();
        } else {
            pauseReading();
        }
        return;
    }

    // Si está leyendo otro mensaje, detener y empezar nuevo
    if (currentSpeechState.isReading) {
        forceStopReading();
        // Esperar un momento antes de iniciar nuevo
        setTimeout(() => {
            startReading(text, messageElement, btn);
        }, 100);
    } else {
        startReading(text, messageElement, btn);
    }
}

function startReading(text, messageElement, btn) {
    try {
        // Limpiar completamente cualquier síntesis anterior
        if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
            window.speechSynthesis.cancel();
        }

        // Esperar un poco para que se limpie completamente
        setTimeout(() => {
            const utterance = new SpeechSynthesisUtterance(text);

            // Configurar voz
            const voices = window.speechSynthesis.getVoices();
            const preferredVoice = voices.find(voice =>
                voice.lang === 'es-MX' || voice.lang === 'es-mx'
            ) || voices.find(voice =>
                voice.lang === 'es-US' || voice.lang === 'es-us'
            ) || voices.find(voice =>
                voice.lang.startsWith('es-') && !voice.lang.startsWith('es-ES')
            ) || voices.find(voice =>
                voice.lang.startsWith('es')
            );

            if (preferredVoice) {
                utterance.voice = preferredVoice;
                utterance.lang = preferredVoice.lang;
            } else {
                utterance.lang = 'es-MX';
            }

            utterance.rate = 1.0;
            utterance.pitch = 1.0;
            utterance.volume = 1.0;

            // Eventos
            utterance.onstart = () => {
                console.log('🔊 Lectura iniciada');
                currentSpeechState.isReading = true;
                currentSpeechState.isPaused = false;
                currentSpeechState.messageElement = messageElement;
                currentSpeechState.button = btn;
                currentSpeechState.utterance = utterance;
                currentSpeechState.text = text;
                updateButtonState(btn, 'reading');
                showNotification('Leyendo respuesta...', 'info');
            };

            utterance.onend = () => {
                console.log('✅ Lectura completada');
                stopReading();
                showNotification('Lectura completada', 'success');
            };

            utterance.onerror = (e) => {
                console.error('❌ TTS Error:', e);
                stopReading();
                if (e.error !== 'canceled' && e.error !== 'interrupted') {
                    showNotification('Error al leer el texto', 'error');
                }
            };

            // Guardar referencia
            currentSpeechState.utterance = utterance;
            currentSpeechState.text = text;
            currentSpeechState.messageElement = messageElement;
            currentSpeechState.button = btn;

            // Iniciar síntesis
            window.speechSynthesis.speak(utterance);

            console.log('🎤 speechSynthesis.speak() llamado');

        }, 150); // Delay para asegurar limpieza

    } catch (error) {
        console.error('Error en startReading:', error);
        stopReading();
        showNotification('Error al iniciar la lectura', 'error');
    }
}

function pauseReading() {
    console.log('⏸️ Intentando pausar');

    if (!window.speechSynthesis.speaking) {
        console.warn('No hay nada reproduciéndose');
        return;
    }

    // En algunos navegadores, pause() no funciona bien
    // Solución alternativa: detener y guardar posición
    const currentText = currentSpeechState.text;
    const btn = currentSpeechState.button;

    window.speechSynthesis.cancel();

    currentSpeechState.isPaused = true;
    currentSpeechState.isReading = false;

    updateButtonState(btn, 'paused');
    showNotification('Lectura pausada', 'info');
}

function resumeReading() {
    console.log('▶️ Intentando reanudar');

    if (!currentSpeechState.isPaused) {
        return;
    }

    // Reiniciar desde el principio (limitación de la API)
    const text = currentSpeechState.text;
    const messageElement = currentSpeechState.messageElement;
    const btn = currentSpeechState.button;

    currentSpeechState.isPaused = false;

    startReading(text, messageElement, btn);
    showNotification('Continuando lectura...', 'info');
}

function stopReading() {
    console.log('⏹️ Deteniendo lectura');

    if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
        window.speechSynthesis.cancel();
    }

    // Restaurar botón si existe
    if (currentSpeechState.button) {
        updateButtonState(currentSpeechState.button, 'idle');
    }

    // Cerrar el menú desplegable cuando termine
    if (currentSpeechState.messageElement) {
        const menu = currentSpeechState.messageElement.querySelector('.more-actions-menu');
        if (menu && menu.getAttribute('aria-hidden') === 'false') {
            menu.setAttribute('aria-hidden', 'true');
            menu.setAttribute('hidden', '');
            const wrapper = menu.closest('.more-actions-wrapper');
            const trigger = wrapper?.querySelector('.more-actions-trigger');
            if (trigger) trigger.setAttribute('aria-expanded', 'false');
        }
    }

    // Reset estado
    currentSpeechState = {
        utterance: null,
        text: '',
        messageElement: null,
        isPaused: false,
        isReading: false,
        button: null
    };
}

function forceStopReading() {
    console.log('🛑 Forzando detención');
    stopReading();
}

function updateButtonState(btn, state) {
    if (!btn) return;

    const icon = btn.querySelector('i[data-feather]');
    const span = btn.querySelector('span');

    // Remover clases anteriores
    btn.classList.remove('reading', 'paused');

    switch (state) {
        case 'reading':
            btn.classList.add('reading');
            if (icon) icon.setAttribute('data-feather', 'pause-circle');
            if (span) span.textContent = 'Pausar lectura';
            break;

        case 'paused':
            btn.classList.add('paused');
            if (icon) icon.setAttribute('data-feather', 'play-circle');
            if (span) span.textContent = 'Continuar lectura';
            break;

        case 'idle':
        default:
            if (icon) icon.setAttribute('data-feather', 'volume-2');
            if (span) span.textContent = 'Leer en voz alta';
            break;
    }

    // Actualizar iconos
    feather.replace();
}

// Detener lectura al enviar nuevo mensaje
function stopSpeechOnNewMessage() {
    if (currentSpeechState.isReading || currentSpeechState.isPaused) {
        forceStopReading();
    }
}

// ============================================
// NUEVA FUNCIONALIDAD: Modal de Fuente
// ============================================

function initSourceModal() {
    const modal = document.getElementById('sourceModal');
    const closeBtn = document.getElementById('sourceModalClose');

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            hideInfoModal(modal);
        });
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                hideInfoModal(modal);
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal?.classList.contains('show')) {
            hideInfoModal(modal);
        }
    });
}

function showSourceModal(sourceUrl, sourceName) {
    const modal = document.getElementById('sourceModal');
    const linkElement = document.getElementById('sourceLinkDisplay');

    if (!modal || !linkElement) {
        console.error('[RESPONSE-ACTIONS] Modal de fuente no encontrado');
        return;
    }

    const displayName = sourceName || sourceUrl || 'Fuente no especificada';
    linkElement.href = 'https://mapainversiones.transparenciafiscal.gob.do/';
    linkElement.querySelector('span').textContent = displayName;

    if (typeof feather !== 'undefined') {
        feather.replace();
    }

    showInfoModal(modal);
}

// ============================================
// SISTEMA DE NOTIFICACIONES
// ============================================

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOutToRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ---------- modal y toast creados dinámicamente ----------
function ensureUtilityNodes() {
    if (!document.getElementById('feedbackModal')) {
        const m = document.createElement('div');
        m.id = 'feedbackModal'; m.className = 'feedback-modal';
        m.innerHTML = `
                    <div class="feedback-modal-content">
                        <div class="feedback-modal-header">
                            <h3 class="feedback-modal-title">¿Qué podríamos mejorar en esta respuesta?</h3>
                            <button class="feedback-modal-close" id="feedbackModalClose"><i data-feather="x"></i></button>
                        </div>
                        <div class="feedback-options">
                            ${[
                ['incomplete', 'minus-circle', 'Respuesta incompleta'],
                ['incorrect', 'x-circle', 'Datos incorrectos'],
                ['outdated', 'clock', 'Información desactualizada'],
                ['unclear', 'help-circle', 'Explicación confusa'],
                ['irrelevant', 'alert-triangle', 'No responde a la pregunta'],
                ['bias', 'eye-off', 'Contenido sesgado'],
                ['sources', 'link-2', 'Faltan fuentes'],
                ['other', 'message-circle', 'Otro motivo']
            ].map(([k, i, t]) => `
                                <button class="feedback-option" data-feedback="${k}">
                                    <i data-feather="${i}" class="feedback-option-icon"></i><span>${t}</span>
                                </button>`).join('')}
                        </div>
                        <div class="feedback-modal-footer">
                            <p class="feedback-modal-note">Tu feedback nos ayuda a mejorar las respuestas</p>
                        </div>
                    </div>`;
        document.body.appendChild(m);
    }
    if (!document.getElementById('toast')) {
        const t = document.createElement('div');
        t.id = 'toast'; t.className = 'toast'; document.body.appendChild(t);
    }
}

function initializeFeedbackModal() {
    ensureUtilityNodes();
    const modal = document.getElementById('feedbackModal');
    document.getElementById('feedbackModalClose').onclick = hideFeedbackModal;
    modal.addEventListener('click', e => { if (e.target === modal) hideFeedbackModal(); });
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape' && modal.classList.contains('show')) hideFeedbackModal();
    });
    modal.querySelectorAll('.feedback-option').forEach(o => {

        // Añadir evento click a cada opción de feedback
        o.addEventListener('click', () => {
            const reason = o.getAttribute('data-feedback');
            const answerId = document.getElementById('feedbackModal').dataset.answerId || 0;

            sendFeedback(answerId, false, reason);
            console.log('[META] feedback enviado', { answerId, isApproved: false, reason });

            hideFeedbackModal();
            console.log('[META] feedback modal cerrado');

            showToast('¡Gracias por tu feedback!');
        });

    });
}

function showInfoModal(modal) {
    if (!modal) return;
    if (window.innerWidth <= 768 && sidebar.classList.contains('show') && typeof window.closeMobileSidebar === 'function') {
        window.closeMobileSidebar();
    }
    modal.style.display = 'flex';
    requestAnimationFrame(() => modal.classList.add('show'));
    registerBodyLock(modal);
}

function hideInfoModal(modal, options = {}) {
    if (!modal) return;
    modal.classList.remove('show');

    const finalize = () => {
        modal.style.display = 'none';
        releaseBodyLock(modal);
    };

    if (options.immediate) {
        finalize();
        return;
    }

    setTimeout(finalize, 300);
}

/* ---------- sidebar “Términos” / “Fuente de datos” modals ---------- */
function initializeInfoModals() {
    const whatCanIAskBtn = document.getElementById('whatCanIAskBtn');
    const termsBtn = document.getElementById('termsBtn');
    const aboutBtn = document.getElementById('aboutBtn');
    const whatCanIAskModal = document.getElementById('whatCanIAskModal');
    const termsModal = document.getElementById('termsModal');
    const aboutModal = document.getElementById('aboutModal');
    const helpModal = document.getElementById('helpModal');
    const grayZoneModal = document.getElementById('grayZoneModal');
    const technicalDetailsModal = document.getElementById('technicalDetailsModal');
    const whatCanIAskModalClose = document.getElementById('whatCanIAskModalClose');
    const termsModalClose = document.getElementById('termsModalClose');
    const aboutModalClose = document.getElementById('aboutModalClose');
    const helpModalClose = document.getElementById('helpModalClose');
    const grayZoneModalClose = document.getElementById('grayZoneModalClose');
    const technicalDetailsModalClose = document.getElementById('technicalDetailsModalClose');

    if (whatCanIAskBtn) whatCanIAskBtn.addEventListener('click', () => showInfoModal(whatCanIAskModal));
    if (termsBtn) termsBtn.addEventListener('click', () => showInfoModal(termsModal));
    if (aboutBtn) aboutBtn.addEventListener('click', () => showInfoModal(aboutModal));

    if (whatCanIAskModalClose) whatCanIAskModalClose.addEventListener('click', () => hideInfoModal(whatCanIAskModal));
    if (termsModalClose) termsModalClose.addEventListener('click', () => hideInfoModal(termsModal));
    if (aboutModalClose) aboutModalClose.addEventListener('click', () => hideInfoModal(aboutModal));
    if (helpModalClose) helpModalClose.addEventListener('click', () => hideInfoModal(helpModal));
    if (grayZoneModalClose) grayZoneModalClose.addEventListener('click', () => hideInfoModal(grayZoneModal));
    if (technicalDetailsModalClose) technicalDetailsModalClose.addEventListener('click', () => hideInfoModal(technicalDetailsModal));

    if (whatCanIAskModal) whatCanIAskModal.addEventListener('click', e => { if (e.target === whatCanIAskModal) hideInfoModal(whatCanIAskModal); });
    if (termsModal) termsModal.addEventListener('click', e => { if (e.target === termsModal) hideInfoModal(termsModal); });
    if (aboutModal) aboutModal.addEventListener('click', e => { if (e.target === aboutModal) hideInfoModal(aboutModal); });
    if (helpModal) helpModal.addEventListener('click', e => { if (e.target === helpModal) hideInfoModal(helpModal); });
    if (grayZoneModal) grayZoneModal.addEventListener('click', e => { if (e.target === grayZoneModal) hideInfoModal(grayZoneModal); });
    if (technicalDetailsModal) technicalDetailsModal.addEventListener('click', e => { if (e.target === technicalDetailsModal) hideInfoModal(technicalDetailsModal); });

    // ESC key closes any open info modal
    document.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            if (whatCanIAskModal?.classList.contains('show')) hideInfoModal(whatCanIAskModal);
            if (termsModal?.classList.contains('show')) hideInfoModal(termsModal);
            if (aboutModal?.classList.contains('show')) hideInfoModal(aboutModal);
            if (helpModal?.classList.contains('show')) hideInfoModal(helpModal);
            if (grayZoneModal?.classList.contains('show')) hideInfoModal(grayZoneModal);
            if (technicalDetailsModal?.classList.contains('show')) hideInfoModal(technicalDetailsModal);
        }
    });
}

function showFeedbackModal() {

    // Asegurarse de que los nodos necesarios existen
    ensureUtilityNodes();
    const modal = document.getElementById('feedbackModal');
    if (!modal) return;
    registerBodyLock(modal);
    modal.classList.add('show');

    console.log('[META] showFeedbackModal – answerId=', modal.dataset.answerId);
}
function hideFeedbackModal() {
    const m = document.getElementById('feedbackModal');
    if (m) {
        m.classList.remove('show');
        releaseBodyLock(m);
    }
}

function showToast(msg, type = 'success') {
    ensureUtilityNodes();
    const t = document.getElementById('toast');
    t.textContent = msg;
    t.className = `toast ${type} show`;
    setTimeout(() => t.classList.remove('show'), 3000);
}

/* =========================================================
   Renderizado de estadísticas con D3
   stats = objeto recibido de backend (ver /api/chat?message=ver%20estadisticas)
   container = elemento DOM donde se pintará el dashboard
========================================================= */
/* ──────────────────────────────────────────────────────────────
   Tooltip global reutilizable para TODOS los gráficos con D3
────────────────────────────────────────────────────────────── */
let _d3Tooltip = null;
function getD3Tooltip() {
    if (!_d3Tooltip) {
        _d3Tooltip = d3.select('body')
            .append('div')
            .attr('class', 'd3-tooltip position-fixed px-2 py-1 bg-dark text-white rounded small')
            .style('pointer-events', 'none')
            .style('opacity', 0);
    }
    return _d3Tooltip;
}
function showTip(html, evt) {
    const tt = getD3Tooltip();
    tt.html(html)
        .style('left', (evt.pageX + 12) + 'px')
        .style('top', (evt.pageY + 12) + 'px')
        .transition().duration(150).style('opacity', .95);
}
function hideTip() {
    const tt = getD3Tooltip();
    tt.transition().duration(150).style('opacity', 0);
}
/*****************************************************************
 *  RENDER SECTORS ONLY  – utility for quick‑view buttons
 *****************************************************************/
let _lastStatsData = null;   // se sobre‑escribe cada vez que llega /ver estadísticas

/* ***************************************************
 * Botón «Volver a estadísticas» reutilizable
 *************************************************** */
function addReturnButton(wrap, container) {
    // small header wrapper (keeps the button anchored arriba)
    const header = wrap.append('div')
        .attr('class', 'mb-3');
    header.append('button')
        .attr('class', 'btn btn-outline-secondary btn-sm')
        .text('← Cerrar')
        .on('click', () => {
            // Cierra la vista detallada y vuelve a mostrar solo el tablero general
            container.innerHTML = '';
            scrollToBottom();
        });
}

function renderSectorsCharts(stats, container) {
    if (!stats || !container) return;

    // Limpia el contenedor y crea un wrapper D3
    container.innerHTML = '';
    const wrap = d3.select(container)
        .append('div')
        .attr('class', 'stats-dashboard pt-1');
    addReturnButton(wrap, container);

    /* --- formateadores numéricos coherentes con el dashboard principal --- */
    const localeCfg = {
        decimal: (amountSeparator && amountSeparator.decimal) || '.',
        thousands: (amountSeparator && amountSeparator.thousand) || ',',
        grouping: [3],
        currency: ['', '']
    };
    const locale = d3.formatLocale(localeCfg);
    const fmtInt = locale.format(',');   // entero con miles
    const COLORS = d3.schemePastel1;

    /* --- mini helper para barChart muy acotado --- */
    function barChart(data, title) {
        if (!Array.isArray(data) || !data.length) return;
        const row = wrap.append('div').attr('class', 'chart-row');
        row.append('h6')
            .attr('class', 'mb-1 fw-bold')
            .text(title + (currencyType ? ` (MM ${currencyType})` : ' (MM)'));
        const rowWidth = row.node().getBoundingClientRect().width || 600; // fallback
        const w = Math.max(320, rowWidth - 20);                            // ensure a sensible min width
        const h = 180, m = { t: 20, r: 20, b: 30, l: 200 };
        const svg = row.append('svg')
            .attr('width', w)
            .attr('height', h);
        const x = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.value)]).nice()
            .range([m.l, w - m.r]);
        const y = d3.scaleBand()
            .domain(data.map(d => d.label))
            .range([m.t, h - m.b])
            .padding(0.15);
        svg.append('g')
            .attr('transform', `translate(0,${m.t})`)
            .call(d3.axisTop(x).ticks(5, '~s'))
            .selectAll('text').style('font-size', '10px');
        svg.append('g')
            .attr('transform', `translate(${m.l},0)`)
            .call(d3.axisLeft(y))
            .selectAll('text')
            .style('font-size', '10px')          // slightly smaller font
            .attr('transform', 'rotate(-20)')  // tilt ~20°
            .style('text-anchor', 'end');      // keep alignment when rotated
        svg.selectAll('rect')
            .data(data)
            .enter().append('rect')
            .attr('x', x(0))
            .attr('y', d => y(d.label))
            .attr('width', d => x(d.value) - x(0))
            .attr('height', y.bandwidth())
            .attr('fill', (d, i) => COLORS[i % COLORS.length])
            .on('mousemove', (evt, d) => showTip(`<strong>${d.label}</strong><br>${fmtInt(d.value)}`, evt))
            .on('mouseleave', hideTip);
        svg.selectAll('text.bar-label')
            .data(data)
            .enter().append('text')
            .attr('class', 'bar-label')
            .attr('x', d => x(d.value) - 6)
            .attr('y', d => y(d.label) + y.bandwidth() / 2 + 4)
            .attr('text-anchor', 'end')
            .style('font-size', '10px')
            .text(d => fmtInt(d.value));
    }

    /* --- secciones de sectores --- */
    barChart(stats.top_3_sectores_mayor_inversion, 'Top 3 Sectores – mayor inversión');
    barChart(stats.top_3_sectores_menor_inversion, 'Top 3 Sectores – menor inversión');
}

/* ****************************************************************
 *  RENDER TERRITORIES ONLY
 *****************************************************************/
function renderTerritoriesCharts(stats, container) {
    if (!stats || !container) return;
    container.innerHTML = '';
    const wrap = d3.select(container).append('div').attr('class', 'stats-dashboard pt-1');
    addReturnButton(wrap, container);

    const localeCfg = {
        decimal: (amountSeparator && amountSeparator.decimal) || '.',
        thousands: (amountSeparator && amountSeparator.thousand) || ',',
        grouping: [3],
        currency: ['', '']
    };
    const locale = d3.formatLocale(localeCfg);
    const fmtInt = locale.format(',');
    const COLORS = d3.schemePastel1;

    const barChart = (data, title) => {
        if (!Array.isArray(data) || !data.length) return;
        const row = wrap.append('div').attr('class', 'chart-row');
        row.append('h6')
            .attr('class', 'mb-1 fw-bold')
            .text(title + (currencyType ? ` (MM ${currencyType})` : ' (MM)'));
        const rowWidth = row.node().getBoundingClientRect().width || 600; // fallback
        const w = Math.max(320, rowWidth - 20);                            // ensure a sensible min width
        const h = 180, m = { t: 20, r: 20, b: 30, l: 200 };
        const svg = row.append('svg').attr('width', w).attr('height', h);
        const x = d3.scaleLinear().domain([0, d3.max(data, d => d.value)]).nice().range([m.l, w - m.r]);
        const y = d3.scaleBand().domain(data.map(d => d.label)).range([m.t, h - m.b]).padding(.15);
        svg.append('g').attr('transform', `translate(0,${m.t})`).call(d3.axisTop(x).ticks(5, '~s')).selectAll('text').style('font-size', '10px');
        svg.append('g').attr('transform', `translate(${m.l},0)`).call(d3.axisLeft(y))
            .selectAll('text')
            .style('font-size', '10px')
            .attr('transform', 'rotate(-20)')
            .style('text-anchor', 'end');
        svg.selectAll('rect').data(data).enter().append('rect')
            .attr('x', x(0)).attr('y', d => y(d.label))
            .attr('width', d => x(d.value) - x(0)).attr('height', y.bandwidth())
            .attr('fill', (d, i) => COLORS[i % COLORS.length])
            .on('mousemove', (evt, d) => showTip(`<strong>${d.label}</strong><br>${fmtInt(d.value)}`, evt))
            .on('mouseleave', hideTip);
        svg.selectAll('text.bar-label').data(data).enter().append('text')
            .attr('class', 'bar-label').attr('x', d => x(d.value) - 6)
            .attr('y', d => y(d.label) + y.bandwidth() / 2 + 4)
            .attr('text-anchor', 'end').style('font-size', '10px').text(d => fmtInt(d.value));
    };
    barChart(stats.top_3_territorios_mayor_inversion, 'Top 3 Territorios – mayor inversión');
    barChart(stats.top_3_territorios_menor_inversion, 'Top 3 Territorios – menor inversión');
}

/* ****************************************************************
 *  RENDER ENTIDADES EJECUTORAS ONLY
 *****************************************************************/
function renderEntidadesCharts(stats, container) {
    if (!stats || !container) return;
    container.innerHTML = '';
    const wrap = d3.select(container).append('div').attr('class', 'stats-dashboard pt-1');
    addReturnButton(wrap, container);
    const localeCfg = { decimal: (amountSeparator && amountSeparator.decimal) || '.', thousands: (amountSeparator && amountSeparator.thousand) || ',', grouping: [3], currency: ['', ''] };
    const locale = d3.formatLocale(localeCfg); const fmtInt = locale.format(','); const COLORS = d3.schemePastel1;
    const barChart = (data, title) => {
        if (!Array.isArray(data) || !data.length) return;
        const row = wrap.append('div').attr('class', 'chart-row');
        row.append('h6')
            .attr('class', 'mb-1 fw-bold')
            .text(title + (currencyType ? ` (MM ${currencyType})` : ' (MM)'));
        const rowWidth = row.node().getBoundingClientRect().width || 600; // fallback
        const w = Math.max(320, rowWidth - 20);                            // ensure a sensible min width
        const h = 180, m = { t: 20, r: 20, b: 30, l: 200 };
        const svg = row.append('svg').attr('width', w).attr('height', h);
        const x = d3.scaleLinear().domain([0, d3.max(data, d => d.value)]).nice().range([m.l, w - m.r]);
        const y = d3.scaleBand().domain(data.map(d => d.label)).range([m.t, h - m.b]).padding(.15);
        svg.append('g').attr('transform', `translate(0,${m.t})`).call(d3.axisTop(x).ticks(5, '~s')).selectAll('text').style('font-size', '10px');
        svg.append('g').attr('transform', `translate(${m.l},0)`).call(d3.axisLeft(y))
            .selectAll('text')
            .style('font-size', '10px')
            .attr('transform', 'rotate(-20)')
            .style('text-anchor', 'end');
        svg.selectAll('rect').data(data).enter().append('rect')
            .attr('x', x(0)).attr('y', d => y(d.label))
            .attr('width', d => x(d.value) - x(0)).attr('height', y.bandwidth())
            .attr('fill', (d, i) => COLORS[i % COLORS.length])
            .on('mousemove', (evt, d) => showTip(`<strong>${d.label}</strong><br>${fmtInt(d.value)}`, evt))
            .on('mouseleave', hideTip);
        svg.selectAll('text.bar-label').data(data).enter().append('text')
            .attr('class', 'bar-label').attr('x', d => x(d.value) - 6)
            .attr('y', d => y(d.label) + y.bandwidth() / 2 + 4)
            .attr('text-anchor', 'end').style('font-size', '10px').text(d => fmtInt(d.value));
    };
    barChart(stats.top_3_entidades_ejecutoras_mayor_monto, 'Top 3 Entidades – mayor monto');
    barChart(stats.top_3_entidades_ejecutoras_menor_monto, 'Top 3 Entidades – menor monto');
}

/* ****************************************************************
 *  RENDER ORGANISMOS ONLY
 *****************************************************************/
function renderOrganismosCharts(stats, container) {
    if (!stats || !container) return;
    container.innerHTML = '';
    const wrap = d3.select(container).append('div').attr('class', 'stats-dashboard pt-1');
    addReturnButton(wrap, container);
    const localeCfg = { decimal: (amountSeparator && amountSeparator.decimal) || '.', thousands: (amountSeparator && amountSeparator.thousand) || ',', grouping: [3], currency: ['', ''] };
    const locale = d3.formatLocale(localeCfg); const fmtInt = locale.format(','); const COLORS = d3.schemePastel1;
    const barChart = (data, title) => {
        if (!Array.isArray(data) || !data.length) return;
        const row = wrap.append('div').attr('class', 'chart-row');
        row.append('h6')
            .attr('class', 'mb-1 fw-bold')
            .text(title + (currencyType ? ` (MM ${currencyType})` : ' (MM)'));
        const rowWidth = row.node().getBoundingClientRect().width || 600; // fallback
        const w = Math.max(320, rowWidth - 20);                            // ensure a sensible min width
        const h = 180, m = { t: 20, r: 20, b: 30, l: 200 };
        const svg = row.append('svg').attr('width', w).attr('height', h);
        const x = d3.scaleLinear().domain([0, d3.max(data, d => d.value)]).nice().range([m.l, w - m.r]);
        const y = d3.scaleBand().domain(data.map(d => d.label)).range([m.t, h - m.b]).padding(.15);
        svg.append('g').attr('transform', `translate(0,${m.t})`).call(d3.axisTop(x).ticks(5, '~s')).selectAll('text').style('font-size', '10px');
        svg.append('g').attr('transform', `translate(${m.l},0)`).call(d3.axisLeft(y))
            .selectAll('text')
            .style('font-size', '10px')
            .attr('transform', 'rotate(-20)')
            .style('text-anchor', 'end');
        svg.selectAll('rect').data(data).enter().append('rect')
            .attr('x', x(0)).attr('y', d => y(d.label))
            .attr('width', d => x(d.value) - x(0)).attr('height', y.bandwidth())
            .attr('fill', (d, i) => COLORS[i % COLORS.length])
            .on('mousemove', (evt, d) => showTip(`<strong>${d.label}</strong><br>${fmtInt(d.value)}`, evt))
            .on('mouseleave', hideTip);
        svg.selectAll('text.bar-label').data(data).enter().append('text')
            .attr('class', 'bar-label').attr('x', d => x(d.value) - 6)
            .attr('y', d => y(d.label) + y.bandwidth() / 2 + 4)
            .attr('text-anchor', 'end').style('font-size', '10px').text(d => fmtInt(d.value));
    };
    barChart(stats.top_3_organismos_financiadores_mayor_monto, 'Top 3 Organismos Financiadores – mayor monto');
    barChart(stats.top_3_organismos_financiadores_menor_monto, 'Top 3 Organismos Financiadores – menor monto');
}

/* ****************************************************************
 *  RENDER ESTADOS ONLY (PIE)
 *****************************************************************/
function renderEstadosChart(stats, container) {
    if (!stats || !container) return;
    container.innerHTML = '';
    const wrap = d3.select(container).append('div').attr('class', 'stats-dashboard pt-1');
    addReturnButton(wrap, container);
    const localeCfg = { decimal: (amountSeparator && amountSeparator.decimal) || '.', thousands: (amountSeparator && amountSeparator.thousand) || ',', grouping: [3], currency: ['', ''] };
    const locale = d3.formatLocale(localeCfg); const COLORS = d3.schemePastel1;
    const data = Array.isArray(stats.estado_pct) ? stats.estado_pct : [];
    if (!data.length) return;
    const w = 400, h = 260, r = Math.min(w, h) / 2;
    wrap.append('h6').attr('class', 'mb-1 fw-bold').text('Distribución por estado');
    const color = d3.scaleOrdinal().domain(data.map(d => d.estado)).range(COLORS);
    const pie = d3.pie().value(d => d.pct);
    const arc = d3.arc().innerRadius(r * 0.5).outerRadius(r * 0.9);
    const svg = wrap.append('svg').attr('width', w).attr('height', h)
        .append('g').attr('transform', `translate(${w / 2},${h / 2})`);
    svg.selectAll('path').data(pie(data)).enter().append('path')
        .attr('d', arc)
        .attr('fill', d => color(d.data.estado))
        .on('mousemove', (evt, d) => showTip(`<strong>${d.data.estado}</strong><br>${d.data.pct}%`, evt))
        .on('mouseleave', hideTip);
    const labelArc = d3.arc().innerRadius(r * 0.7).outerRadius(r * 0.7);
    svg.selectAll('text').data(pie(data)).enter().append('text')
        .attr('transform', d => `translate(${labelArc.centroid(d)})`)
        .attr('text-anchor', 'middle').attr('alignment-baseline', 'middle')
        .style('font-size', '10px').attr('font-weight', '600')
        .text(d => `${d.data.pct}%`);
    const legend = wrap.append('div').attr('class', 'd-flex flex-wrap gap-2 small mt-2');
    data.forEach(d => {
        legend.append('div').attr('class', 'd-flex align-items-center gap-1')
            .html(`<span style="width:12px;height:12px;background:${color(d.estado)};display:inline-block;border-radius:2px;"></span>${d.estado}`);
    });
}

function renderStatsDashboard(stats, container) {
    // ─── Validación extra: aseguramos que sea un nodo DOM ───
    if (!container || typeof container.ownerDocument === 'undefined') {
        console.warn('[renderStatsDashboard] Contenedor inválido ➜', container);
        return;                       // Abortamos para evitar crash de D3
    }
    // ▸ Vaciar contenedor y crear wrapper (como selección D3)
    container.innerHTML = '';
    const wrap = d3.select(container)
        .append('div')
        .attr('class', 'stats-dashboard');

    /* ----------  Locale‑aware number formatters ---------- */
    const localeCfg = {
        decimal: (amountSeparator && amountSeparator.decimal) || '.',
        thousands: (amountSeparator && amountSeparator.thousand) || ',',
        grouping: [3],
        currency: ['', '']
    };
    const locale = d3.formatLocale(localeCfg);
    const fmtInt = locale.format(','); // entero sin decimales

    /**
     * fmtNum(v[, maxDec=4])
     * Formatea números respetando la cantidad de decimales que viene desde backend.
     * ❗ Antes: usábamos 'locale.format(",.2f")' que forzaba SIEMPRE dos decimales,
     *    agregando ceros (p.ej. 6.4 → 6.40) o redondeando valores.
     *    Esto generaba discrepancias con lo que devuelve la base.
     * Ahora:
     *   - Detectamos cuántos decimales trae el número stringificado.
     *   - Limitamos a `maxDec` (default 4) por seguridad.
     *   - Si no hay parte decimal → usamos formato entero con miles.
     *   - Si hay parte decimal → construimos dinámicamente la especificación d3 (",.<n>f").
     *   - No agregamos ceros extra más allá de los decimales originales.
     */
    function fmtNum(v, maxDec = 1) {
        if (v === null || v === undefined || isNaN(v)) return '—';
        const s = String(v);
        const decs = s.includes('.') ? Math.min(s.split('.')[1].length, maxDec) : 0;
        const spec = decs === 0 ? ',' : `,.${decs}f`;
        return locale.format(spec)(+v);
    }

    // Intro text
    wrap.append('p')
        .attr('class', 'small mb-3 text-muted fw-semibold')
        .text('Este panel resume las métricas clave de la inversión pública y visualiza los sectores, territorios y el estado de avance de los proyectos con mayor impacto.');

    /* ----------  KPI cards  ---------- */
    // Cada KPI define: etiqueta, valor crudo y formateador.
    //   → Luego se convierte y se descartan los que queden sin dato ('—' o 'NaN').
    const kpis = [
        {
            label: 'Proyectos',
            valueRaw: stats.total_projects,
            formatter: v => fmtInt(v)
        },
        {
            label: `Monto total (MM${currencyType ? ' ' + currencyType : ''})`,
            valueRaw: stats.total_monto_proyectos_mm,
            formatter: v => fmtNum(v)
        },
        {
            label: 'Avance promedio (%)',
            valueRaw: stats.promedio_avance_financiero,
            formatter: v => fmtNum(v)
        },
        {
            label: 'Plazo medio (años)',
            valueRaw: stats.plazo_medio_anios,
            formatter: v => fmtNum(v)
        }
    ]
        .map(k => ({
            label: k.label,
            value: k.formatter(k.valueRaw)
        }))
        .filter(k => k.value !== '—' && k.value !== 'NaN');   // solo mostrar KPIs con dato

    const kpiWrap = wrap.append('div')
        .attr('class', 'stats-kpis d-flex flex-wrap gap-3 mb-4');
    kpiWrap.selectAll('div.kpi')
        .data(kpis)
        .enter()
        .append('div')
        .attr('class', 'kpi border rounded p-3 text-center flex-fill')
        .html(d => `<h4 class="mb-1">${d.value}</h4><small class="text-muted">${d.label}</small>`);

    /* ---------- Helpers & tooltip ---------- */
    const fmt = fmtInt;  // reuse locale integer formatter for charts
    const COLORS = d3.schemePastel1;

    /* ---------- small helpers ---------- */
    const safeArr = d => Array.isArray(d) ? d : [];
    const hasData = d => Array.isArray(d) && d.length > 0;
    function addSectionTitle(parentSel, txt) {
        parentSel
            .append('h5')
            .attr('class', 'fw-bold mt-4 mb-3')
            .text(txt);
    }

    /* ----------  Bar chart (CORREGIDO) ---------- */
    function barChart(mainWrap, data, xKey, yKey, title, desc) {
        if (!data || !data.length) return;
        const row = mainWrap.append('div').attr('class', 'chart-row');
        const rowWidth = row.node().getBoundingClientRect().width || 600; // fallback
        const w = Math.max(320, rowWidth - 20);                            // ensure a sensible min width
        const h = 160, m = { t: 20, r: 20, b: 30, l: 150 };
        row.append('h6')
            .attr('class', 'mb-1 fw-bold')
            .text(title + (currencyType ? ` (MM ${currencyType})` : ' (MM)'));
        row.append('p')
            .attr('class', 'chart-desc small text-muted mb-2')
            .text(desc || '');
        const svg = row.append('svg')
            .attr('width', w)
            .attr('height', h);
        const x = d3.scaleLinear()
            .domain([0, d3.max(data, d => d[yKey])]).nice()
            .range([m.l, w - m.r]);
        const y = d3.scaleBand()
            .domain(data.map(d => d[xKey]))
            .range([m.t, h - m.b])
            .padding(0.15);
        svg.append('g')
            .attr('transform', `translate(0,${m.t})`)
            .call(d3.axisTop(x).ticks(5, '~s'))
            .selectAll('text').style('font-size', '10px');
        svg.append('g')
            .attr('transform', `translate(${m.l},0)`)
            .call(d3.axisLeft(y))
            .selectAll('text').style('font-size', '10px');
        svg.selectAll('rect')
            .data(data)
            .enter().append('rect')
            .attr('x', x(0))
            .attr('y', d => y(d[xKey]))
            .attr('width', d => x(d[yKey]) - x(0))
            .attr('height', y.bandwidth())
            .attr('fill', (d, i) => COLORS[i % COLORS.length])
            .on('mousemove', (evt, d) => showTip(`<strong>${d[xKey]}</strong><br>${fmt(d[yKey])}`, evt))
            .on('mouseleave', hideTip);
        svg.selectAll('text.bar-label')
            .data(data)
            .enter().append('text')
            .attr('class', 'bar-label')
            .attr('x', d => x(d[yKey]) - 6)
            .attr('y', d => y(d[xKey]) + y.bandwidth() / 2 + 4)
            .attr('text-anchor', 'end')
            .style('font-size', '10px')
            .attr('fill', '#000')
            .text(d => fmt(d[yKey]));
    }

    /* ----------  Pie / doughnut chart (CORREGIDO) ---------- */
    function pieChart(mainWrap, data, labelKey, valueKey, title, desc) {
        if (!data || !data.length) return;

        const row = mainWrap.append('div').attr('class', 'chart-row');

        const w = 400, h = 260, r = Math.min(w, h) / 2;

        row.append('h6').attr('class', 'mb-1 fw-bold').text(title);
        row.append('p')
            .attr('class', 'chart-desc small text-muted mb-2')
            .text(desc || '');

        const color = d3.scaleOrdinal()
            .domain(data.map(d => d[labelKey]))
            .range(COLORS);

        const pie = d3.pie().value(d => d[valueKey]);
        const arc = d3.arc().innerRadius(r * 0.5).outerRadius(r * 0.9);

        const svg = row.append('svg')
            .attr('width', w).attr('height', h)
            .append('g')
            .attr('transform', `translate(${w / 2},${h / 2})`);

        svg.selectAll('path')
            .data(pie(data))
            .enter().append('path')
            .attr('d', arc)
            .attr('fill', d => color(d.data[labelKey]))
            .on('mousemove', (evt, d) => showTip(`<strong>${d.data[labelKey]}</strong><br>${fmt(d.data[valueKey])}%`, evt))
            .on('mouseleave', hideTip);

        const labelArc = d3.arc()
            .innerRadius(r * 0.7)
            .outerRadius(r * 0.7);

        svg.selectAll('text.pie-label')
            .data(pie(data))
            .enter().append('text')
            .attr('class', 'pie-label')
            .attr('transform', d => `translate(${labelArc.centroid(d)})`)
            .attr('text-anchor', 'middle')
            .attr('alignment-baseline', 'middle')
            .attr('font-weight', '600')
            .style('font-size', '10px')
            .attr('fill', '#0f172a')
            .text(d => `${d.data[valueKey]}%`);

        const legend = row.append('div')
            .attr('class', 'd-flex flex-wrap gap-2 small mt-2');
        data.forEach(d => {
            legend.append('div')
                .attr('class', 'd-flex align-items-center gap-1')
                .html(`<span style="width:12px;height:12px;background:${color(d[labelKey])};display:inline-block;border-radius:2px;"></span>${d[labelKey]}`);
        });
    }

    /* ----------  Render sections & charts (LLAMADAS CORREGIDAS) ---------- */
    /* ===== BOTONES DE VISTAS PARCIALES ===== */
    // Contenedor reutilizable para las vistas detalladas (se vacía y llena)
    const detailsDiv = wrap.append('div')
        .attr('class', 'stats-details mt-3')
        .node();

    /* ─── Generar botones solo si hay datos ─── */
    const views = [
        {
            txt: 'Sectores',
            fn: renderSectorsCharts,
            has: hasData(stats.top_3_sectores_mayor_inversion) || hasData(stats.top_3_sectores_menor_inversion)
        },
        {
            txt: 'Territorios',
            fn: renderTerritoriesCharts,
            has: hasData(stats.top_3_territorios_mayor_inversion) || hasData(stats.top_3_territorios_menor_inversion)
        },
        {
            txt: 'Entidades',
            fn: renderEntidadesCharts,
            has: hasData(stats.top_3_entidades_ejecutoras_mayor_monto) || hasData(stats.top_3_entidades_ejecutoras_menor_monto)
        },
        {
            txt: 'Organismos Financiadores',
            fn: renderOrganismosCharts,
            has: hasData(stats.top_3_organismos_financiadores_mayor_monto) || hasData(stats.top_3_organismos_financiadores_menor_monto)
        },
        {
            txt: 'Estados',
            fn: renderEstadosChart,
            has: hasData(stats.porcentaje_por_estado)
        }
    ].filter(v => v.has);

    if (views.length) {
        const btnRow = wrap.append('div')
            .attr('class', 'text-center mt-3 d-flex flex-wrap gap-2 justify-content-center');

        views.forEach(v => {
            btnRow.append('button')
                .attr('class', 'btn btn-outline-primary btn-sm')
                .text(`Ver ${v.txt}`)
                .on('click', () => {
                    // Renderiza la vista elegida dentro del contenedor reutilizable
                    detailsDiv.innerHTML = '';
                    v.fn(_lastStatsData, detailsDiv);
                });
        });
    }
}

function showTypingIndicator() {
    if (!chatMessages || isTyping) return;

    isTyping = true;
    typingStartTime = Date.now();

    // Limpiar intervalos previos
    if (typingMessageInterval) {
        clearInterval(typingMessageInterval);
        typingMessageInterval = null;
    }
    if (typingTimerInterval) {
        clearInterval(typingTimerInterval);
        typingTimerInterval = null;
    }

    const typingDiv = document.createElement('div');
    typingDiv.className = 'message assistant';
    typingDiv.id = 'typingIndicator';

    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 21h18"/>
            <path d="M3 7v1a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3V7"/>
            <path d="M8 21V7a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v14"/>
        </svg>
    `;

    const wrapper = document.createElement('div');
    wrapper.className = 'message-wrapper';

    wrapper.innerHTML = `
        <div class="message-content">
            <div class="typing-indicator">
                <div class="typing-content">
                    <span class="typing-message">${typingMessages.initial[0]}</span>
                    <div class="typing-dots">
                        <div class="typing-dot"></div>
                        <div class="typing-dot"></div>
                        <div class="typing-dot"></div>
                    </div>
                </div>
                <span class="typing-timer">0:00</span>
            </div>
        </div>
    `;

    typingDiv.appendChild(avatar);
    typingDiv.appendChild(wrapper);
    chatMessages.appendChild(typingDiv);

    currentTypingMessageIndex = 0;
    const messageSpan = typingDiv.querySelector('.typing-message');
    const timerSpan = typingDiv.querySelector('.typing-timer');

    // Actualizar timer cada segundo
    typingTimerInterval = setInterval(() => {
        const indicator = document.getElementById('typingIndicator');
        if (!indicator || !timerSpan) {
            clearInterval(typingTimerInterval);
            typingTimerInterval = null;
            return;
        }
        const elapsed = Math.floor((Date.now() - typingStartTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        timerSpan.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);

    // Rotar mensajes con lógica inteligente basada en tiempo
    typingMessageInterval = setInterval(() => {
        const indicator = document.getElementById('typingIndicator');
        if (!indicator) {
            clearInterval(typingMessageInterval);
            typingMessageInterval = null;
            return;
        }

        const elapsed = Math.floor((Date.now() - typingStartTime) / 1000);
        let messagePool;

        // Seleccionar pool de mensajes según tiempo transcurrido
        if (elapsed < 5) {
            messagePool = typingMessages.initial;
        } else if (elapsed < 15) {
            messagePool = typingMessages.searching;
        } else if (elapsed < 30) {
            messagePool = typingMessages.processing;
        } else {
            messagePool = typingMessages.waiting;
        }

        // Rotar dentro del pool actual
        currentTypingMessageIndex = (currentTypingMessageIndex + 1) % messagePool.length;
        if (messageSpan) {
            messageSpan.textContent = messagePool[currentTypingMessageIndex];
        }
    }, 2500);

    scrollToBottom();
}

// Ocultar indicador de escritura
function hideTypingIndicator() {
    isTyping = false;
    currentTypingMessageIndex = 0;
    typingStartTime = null;

    if (typingMessageInterval) {
        clearInterval(typingMessageInterval);
        typingMessageInterval = null;
    }
    if (typingTimerInterval) {
        clearInterval(typingTimerInterval);
        typingTimerInterval = null;
    }

    const typingIndicator = document.getElementById('typingIndicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}

function setInputInteractivity(disabled) {
    if (messageInput) {
        messageInput.disabled = disabled;
        messageInput.classList.toggle('input-waiting', disabled);
    }
    const sendBtnEl = document.getElementById('sendBtn');
    if (sendBtnEl) {
        const limitLocked = sendBtnEl.dataset.limitLocked === 'true';
        if (!limitLocked) {
            sendBtnEl.disabled = disabled;
            sendBtnEl.classList.toggle('btn-disabled', disabled);
        }
    }
}

// --- Legacy sendQuestion function ---
function sendQuestion(pregunta, uniqueId_DOM, hasPendingRetry = false) {
    if (!ensureCountryConfigured()) {
        hideTypingIndicator();
        showToast('Estamos preparando los datos del país. Intenta nuevamente en unos segundos.', 'error');
        return;
    }

    setInputInteractivity(true);
    const cleanedQuestion = pregunta.replace(/[?¿]/g, '').trim();

    let separator = amountSeparator || {};
    if (typeof separator === 'string') {
        try {
            separator = JSON.parse(separator);
            amountSeparator = separator;
        } catch {
            separator = {};
        }
    }

    const payload = {
        message: cleanedQuestion,
        country_code: (selectedCountry || DEFAULT_COUNTRY_CONFIG.iso3).toUpperCase()
    };

    // Detectar si viene de un reintento por filas irrelevantes
    // Usar el parámetro pasado o leer del dataset (para compatibilidad con otros llamados)
    const pendingRetry = hasPendingRetry || (messageInput && messageInput.dataset.pendingIrrelevantRetry === 'true');
    if (pendingRetry) {
        payload.pending_irrelevant_retry = true;
        // Limpiar flag después de usarlo (si aún existe)
        if (messageInput && messageInput.dataset.pendingIrrelevantRetry) {
            delete messageInput.dataset.pendingIrrelevantRetry;
        }
    }

    if (currencyType) {
        payload.currency_type = currencyType;
    }
    if (separator && separator.decimal) {
        payload.decimal_separator = separator.decimal;
    }
    if (separator && Object.keys(separator).length) {
        payload.amount_separator = separator;
    }

    console.log("🌐 Enviando al backend:", '/api/chat', payload);

    fetch('/api/chat', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            'X-API-Key': window.API_KEY
        },
        body: JSON.stringify(payload)
    })
        .then(async response => {
            /* ---------- Manejo explícito de errores HTTP ---------- */
            if (!response.ok) {
                let fallbackMessage = 'Ocurrió un problema con el servidor. Intenta nuevamente en unos minutos.';
                let errorDetail;
                try {
                    const errPayload = await response.json();
                    if (errPayload && errPayload.detail !== undefined) {
                        errorDetail = errPayload.detail;
                    }
                } catch (_) {
                    /* payload no‑JSON u otra falla al parsear: usamos mensaje genérico */
                }

                let errorMsg = fallbackMessage;
                let errorCode;
                let errorHints;
                if (typeof errorDetail === 'string') {
                    errorMsg = errorDetail;
                } else if (errorDetail && typeof errorDetail === 'object') {
                    if (typeof errorDetail.message === 'string' && errorDetail.message.trim()) {
                        errorMsg = errorDetail.message.trim();
                    }
                    if (errorDetail.code) errorCode = errorDetail.code;
                    if (Array.isArray(errorDetail.hints) && errorDetail.hints.length) {
                        errorHints = errorDetail.hints;
                    }
                }

                const error = new Error(errorMsg);
                if (errorCode) error.code = errorCode;
                if (errorHints) error.hints = errorHints;
                throw error;
            }
            return response.json();                     // ↩️ continúa flujo normal
        })
        .then(data => {
            hideTypingIndicator();

            /* —— caso estadísticas —— */
            if (data.stats) {
                /* Creamos un mensaje con un contenedor dedicado para los charts,
                   evitando que D3 falle si .message-content aún no existe */
                const msgEl = addMessage('<div class="stats-container"></div>', 'assistant');
                const statsContainer =
                    msgEl.querySelector('.stats-container') ||
                    msgEl.querySelector('.message-content') ||
                    msgEl;   // fallback de seguridad

                renderStatsDashboard(data.stats, statsContainer);
                _lastStatsData = data.stats;   // guarda última respuesta para los botones de vista parcial
                setTimeout(() => showResponseActions(msgEl), 200);
                scrollToBottom();
                setTimeout(() => getHistory("send"), 1000);
                return;                                         // listo
            }

            /* —— resto de respuestas (texto normal) —— */
            const rendering = (data.rendering && typeof data.rendering === 'object') ? data.rendering : {};
            const renderingFrontend = (rendering && typeof rendering.frontend === 'object') ? rendering.frontend : {};
            const renderingCitizen = (rendering && typeof rendering.citizen === 'object') ? rendering.citizen : {};
            const assistance = (data.user_assistance && typeof data.user_assistance === 'object') ? data.user_assistance : null;

            const responseType = (data.response_type || '').toString();
            const isClarification = responseType === 'clarification';
            const clarificationPayload = {
                ...(assistance?.payload || data.clarification || {}),
                options: assistance?.options || (data.clarification && data.clarification.options) || []
            };
            const isGrayZone = responseType.startsWith && responseType.startsWith('gray_zone');
            const isNoData = responseType === 'no_data';
            const noDataPayload = (data.no_data && typeof data.no_data === 'object') ? data.no_data : null;
            const answerId = (!isClarification && !isGrayZone) ? (data.response_id || 0) : 0;

            const summaryMarkdown = (renderingFrontend && typeof renderingFrontend.summary === 'string')
                ? renderingFrontend.summary.trim()
                : '';
            const tableMarkdown = (renderingFrontend && typeof renderingFrontend.table_markdown === 'string')
                ? renderingFrontend.table_markdown.trim()
                : '';
            const legacyResponse = (typeof data.response === 'string') ? data.response.trim() : '';
            const technicalDetailsPayload = (
                renderingFrontend && Object.prototype.hasOwnProperty.call(renderingFrontend, 'technical_details')
            )
                ? renderingFrontend.technical_details
                : (data.technical_details || data.analysis);

            const combinedMarkdown = [summaryMarkdown, tableMarkdown]
                .filter(chunk => typeof chunk === 'string' && chunk.length)
                .join('\n\n')
                .trim();

            const hasLegacyHtml = legacyResponse && legacyResponse.toLowerCase() !== 'none';

            let contentHtml = '';
            if (hasLegacyHtml) {
                const legacyLooksHtml = /<\/?[a-z][\s\S]*>/i.test(legacyResponse);
                contentHtml = legacyLooksHtml
                    ? legacyResponse
                    : convertMarkdownLikeToHtml(legacyResponse);
            } else if (combinedMarkdown) {
                contentHtml = convertMarkdownLikeToHtml(combinedMarkdown);
            }

            if (isGrayZone && contentHtml) {
                contentHtml = `<div class="gray-zone-message">${contentHtml}</div>`;
            }

            const msgEl = addMessage(contentHtml, 'assistant', answerId);

            // Avisos de causa y limite de sesion (badge liviana al inicio del mensaje)
            const noticeTextRaw = (typeof data.response_notice === 'string') ? data.response_notice.trim() : '';
            const allowedQuestionsValue = Number.isFinite(Number(data.allowed_questions)) ? Number(data.allowed_questions) : null;
            const cause = (typeof data.response_cause === 'string') ? data.response_cause.trim() : '';
            if (msgEl && SHOW_SESSION_NOTICE) {
                const target = msgEl.querySelector('.message-content') || msgEl;
                let finalNotice = '';
                // Solo avisos de cuota: si quedan pocas (<=3) o se alcanzó el límite.
                if (allowedQuestionsValue !== null && allowedQuestionsValue <= 3) {
                    finalNotice = allowedQuestionsValue > 0
                        ? `Te quedan ${allowedQuestionsValue} preguntas en esta sesion.`
                        : 'Llegaste al limite de preguntas de esta sesion.';
                } else if (cause === 'session_limit' && noticeTextRaw) {
                    finalNotice = noticeTextRaw;
                }
                if (finalNotice) {
                    const badge = document.createElement('div');
                    badge.className = 'response-notice badge bg-light text-dark border';
                    badge.style.display = 'inline-block';
                    badge.style.marginBottom = '6px';
                    badge.style.padding = '6px 8px';
                    badge.style.fontSize = '12px';
                    badge.innerHTML = sanitizeText(finalNotice);
                    // Inserta al final del contenido para no interrumpir títulos/tablas
                    target.insertAdjacentElement('beforeend', badge);
                }
                if (allowedQuestionsValue !== null && sendBtn) {
                    const reachedLimit = allowedQuestionsValue <= 0;
                    sendBtn.disabled = reachedLimit;
                    sendBtn.dataset.limitLocked = reachedLimit ? 'true' : 'false';
                }
            }

            // Guardar complete_question en el mensaje para uso en descarga de metadata
            if (msgEl) {
                // Intentar obtener complete_question de diferentes fuentes
                let completeQuestionText = null;

                if (data.complete_question) {
                    // Extraer texto plano del HTML de complete_question
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = data.complete_question;
                    completeQuestionText = stripHtmlTags(tempDiv.textContent || tempDiv.innerText).trim();
                } else if (data.completeUserQuestion) {
                    // Fallback: buscar en otra propiedad
                    completeQuestionText = String(data.completeUserQuestion).trim();
                } else if (pregunta) {
                    // Fallback: usar la pregunta original del usuario
                    completeQuestionText = String(pregunta).trim();
                }

                if (completeQuestionText) {
                    msgEl.dataset.completeQuestion = completeQuestionText;
                    console.log('[DOWNLOAD] Guardada pregunta completa:', completeQuestionText);
                } else {
                    console.warn('[DOWNLOAD] No se encontró pregunta completa en la respuesta');
                }
            }

            if (msgEl && data.suggestions) {
                try {
                    renderNonBlockingSuggestions(msgEl, data.suggestions);
                } catch (err) {
                    console.warn('No se pudieron renderizar sugerencias no bloqueantes:', err);
                }
            }

            // Mostrar las preguntas sugeridas (suggested_user_prompts) como texto
            // al final del contenido (antes de los chips de citizen_actions).
            try {
                const prompts = Array.isArray(data.suggested_user_prompts) ? data.suggested_user_prompts : [];
                if (prompts && prompts.length) {
                    const wrapper = msgEl.querySelector('.message-wrapper');
                    const contentEl = wrapper ? wrapper.querySelector('.message-content') : null;
                    if (contentEl) {
                        // Escapar HTML básico para evitar inyección
                        const escape = s => String(s)
                            .replace(/&/g, '&amp;')
                            .replace(/</g, '&lt;')
                            .replace(/>/g, '&gt;')
                            .replace(/"/g, '&quot;')
                            .replace(/'/g, '&#39;');

                        const promptsHtml = `\n<div class="suggested-prompts">\n  <p class="suggested-prompts-lead small text-muted mb-1">Preguntas relacionadas sugeridas:</p>\n  <ul class="suggested-prompts-list small mb-2">${prompts.map(p => `<li>${escape(p)}</li>`).join('')}</ul>\n</div>`;
                        // Insertamos al final del contenido (donde termina la tabla/texto)
                        contentEl.insertAdjacentHTML('beforeend', promptsHtml);
                    }
                }
            } catch (err) {
                console.warn('No se pudieron renderizar suggested_user_prompts:', err);
            }

            renderCitizenActions(msgEl, {
                ...data,
                user_assistance: assistance,
                rendering,
                citizen_feedback: (renderingCitizen && typeof renderingCitizen.feedback === 'object') ? renderingCitizen.feedback : data.citizen_feedback,
                citizen_actions: Array.isArray(renderingCitizen?.actions) ? renderingCitizen.actions : data.citizen_actions,
                citizen_note: typeof renderingCitizen?.note === 'string' ? renderingCitizen.note : data.citizen_note,
                frontend_warning_priority: typeof renderingFrontend?.warning_priority === 'string' ? renderingFrontend.warning_priority : data.frontend_warning_priority,
                citizen_actions_details: (renderingCitizen && typeof renderingCitizen.actions_details === 'object') ? renderingCitizen.actions_details : data.citizen_actions_details,
            }, pregunta);
            renderTechnicalDetailsButton(msgEl, technicalDetailsPayload);

            // Inicializar ordenamiento de tablas después de renderizar todo
            setTimeout(() => {
                initializeTableSorting();
            }, 200);

            if (isNoData && noDataPayload) {
                renderNoDataSuggestions(msgEl, noDataPayload, pregunta);
            }

            if (isClarification && clarificationPayload) {
                // Buscar la pregunta original del usuario en el DOM
                // (el mensaje del usuario anterior, no el actual que puede tener clarificación)
                let originalQuestion = '';

                // Buscar todos los mensajes del usuario
                const userMessages = Array.from(document.querySelectorAll('.message.user'));

                // Buscar el mensaje del usuario MÁS RECIENTE antes de este bot message
                for (let i = userMessages.length - 1; i >= 0; i--) {
                    const userMsgContent = userMessages[i].querySelector('.message-content');
                    if (userMsgContent) {
                        const text = userMsgContent.textContent.trim();
                        // Evitar mensajes que ya tienen formato de clarificación "(Tipo: Valor)"
                        if (!text.match(/\([^)]+:\s*[^)]+\)\s*$/)) {
                            originalQuestion = text;
                            break;
                        }
                    }
                }

                // Fallback al payload si no encontramos en DOM
                originalQuestion = originalQuestion || pregunta || data.user_question || data.complete_user_question || '';

                console.log('[CLARIFICATION] Original question found:', originalQuestion);

                // Enriquecer payload con original_question y country_code
                const enrichedPayload = {
                    ...clarificationPayload,
                    original_question: originalQuestion,
                    country_code: selectedCountry || data.country_code || 'dom'
                };
                renderClarificationUI(msgEl, enrichedPayload, assistance);
            } else if (!isClarification) {
                currentClarification = null;
                currentAssistance = null;
                closeClarificationModal();
            }

            if (msgEl && isGrayZone && data.gray_zone_details) {
                try {
                    msgEl.dataset.grayZoneDetails = JSON.stringify(data.gray_zone_details);
                } catch (err) {
                    console.warn('No se pudo serializar gray_zone_details:', err);
                }
                renderGrayZoneDetailsButton(msgEl, data.gray_zone_details);
            }

            if (!isClarification && !isGrayZone) {
                setTimeout(() => showResponseActions(msgEl), 200);
            }
            scrollToBottom();
            setTimeout(() => getHistory("send"), 1000);
        })
        .catch(error => {
            hideTypingIndicator();
            console.error("❌ Error al enviar la pregunta:", error);
            const fallbackMessage = 'No pude contactar al asistente. Probemos de nuevo en unos minutos.';
            const rawMessage = stripHtmlTags(error?.message);
            const normalizedMessage = rawMessage ? rawMessage.replace(/^⚠️\s*/u, '').trim() : '';
            const knownNetworkFailures = [
                'failed to fetch',
                'networkerror when attempting to fetch resource.',
                'load failed'
            ];
            const shouldUseFallback =
                !normalizedMessage ||
                knownNetworkFailures.some(msg => normalizedMessage.toLowerCase() === msg);
            const messageText = shouldUseFallback ? fallbackMessage : normalizedMessage;
            const messageSafe = sanitizeText(`⚠️ ${messageText}`);
            if (Array.isArray(error.hints) && error.hints.length) {
                const hintsHtml = error.hints
                    .map(h => `<li>${sanitizeText(h)}</li>`)
                    .join('');
                const errorHtml = `<div class="message-error-block"><p>${messageSafe}</p><ul class="clarification-hints-list">${hintsHtml}</ul></div>`;
                addMessage(errorHtml, 'assistant');
            } else {
                addMessage(messageSafe, 'assistant');
            }
        })
        .finally(() => {
            setInputInteractivity(false);
        });
}

// Ocultar mensaje de bienvenida
function hideWelcomeMessage() {
    const heroContainer = document.getElementById('welcomeHero');
    if (heroContainer && chatMessages) {
        heroContainer.style.display = 'none';
        chatMessages.classList.add('has-messages');
    }
}

// Auto-resize del textarea
function autoResizeTextarea(textarea) {
    // Reset height para calcular correctamente
    textarea.style.height = 'auto';

    // Calcular nueva altura
    const newHeight = Math.min(textarea.scrollHeight, 120); // Max 120px
    const minHeight = 52; // Min 52px

    // Aplicar altura
    textarea.style.height = Math.max(newHeight, minHeight) + 'px';

    // Ajustar posición del botón de envío si es necesario
    const sendBtn = document.getElementById('sendBtn');
    if (sendBtn && newHeight > minHeight) {
        sendBtn.style.top = 'auto';
        sendBtn.style.bottom = '8px';
    } else if (sendBtn) {
        sendBtn.style.top = '50%';
        sendBtn.style.bottom = 'auto';
        sendBtn.style.transform = 'translateY(-50%)';
    }
}

// Iniciar nuevo chat
async function resetBackendSession() {
    try {
        const response = await fetch('/api/chat/reset-session', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Backend respondió ${response.status}`);
        }

        const data = await response.json().catch(() => ({}));
        console.log('🔁 Sesión backend reiniciada', data?.session_id || '');
    } catch (error) {
        console.error('No se pudo reiniciar la sesión del backend:', error);
    }
}

async function startNewChat() {
    if (!chatMessages) return;

    await resetBackendSession();

    // Limpiar mensajes
    chatMessages.innerHTML = '';
    chatMessages.classList.remove('has-messages');

    // Restaurar el welcome message original
    const welcomeMessage = document.getElementById('welcomeMessage');
    if (welcomeMessage) {
        welcomeMessage.style.display = 'none';
    }

    // Recrear y mostrar la pantalla Hero
    let heroContainer = document.getElementById('welcomeHero');
    if (!heroContainer) {
        createWelcomeHeroElement();
        heroContainer = document.getElementById('welcomeHero');
    }

    if (heroContainer) {
        chatMessages.insertBefore(heroContainer, chatMessages.firstChild);
        showWelcomeHero();
    }

    // Resetear estados
    currentClarification = null;
    currentAssistance = null;
    isFirstInteraction = true;

    // Reset textarea height
    if (messageInput) {
        messageInput.value = '';
        messageInput.style.height = 'auto';
    }

    scrollToBottom();
    console.log('✅ Nuevo chat iniciado con pantalla Hero');
}

function createWelcomeHeroElement() {
    const heroHTML = `
    <div class="welcome-hero" id="welcomeHero">
        <div class="welcome-hero-content">
            <!-- Título principal -->
            <h1 class="hero-title" id="heroGreetingText">
                ¿Qué quieres saber sobre las inversiones públicas<br>
                de la República Dominicana?
            </h1>
            
            <!-- Tagline -->
            <p class="hero-subtitle">
                Consulta información sobre proyectos de inversión pública registrados en el Sistema Nacional de Inversión Pública (SNIP) de República Dominicana, desde el año 2013 hasta la fecha.
            </p>

            <!-- Input de búsqueda hero -->
            <div class="hero-input-wrapper">
                <div class="hero-input-container">
                    <textarea 
                        class="hero-input" 
                        id="heroMessageInput" 
                        placeholder="Escribe tu pregunta aquí"
                        rows="1"
                        aria-label="Escribe tu pregunta"></textarea>
                    <button class="hero-voice-btn" id="heroVoiceBtn" type="button" aria-label="Dictar pregunta">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                            <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                            <line x1="12" y1="19" x2="12" y2="23"/>
                            <line x1="8" y1="23" x2="16" y2="23"/>
                        </svg>
                    </button>
                    <button class="hero-send-btn" id="heroSendBtn" type="button" aria-label="Enviar pregunta">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="12" y1="19" x2="12" y2="5"/>
                            <polyline points="5 12 12 5 19 12"/>
                        </svg>
                    </button>
                </div>
            </div>

            <!-- Separador -->
            <div class="hero-divider"></div>

            <!-- Chips de sugerencias - Vertical -->
            <div class="hero-suggestions">
                <p class="hero-suggestions-label">O empieza con una de estas preguntas de ejemplo:</p>
                <div class="hero-chips-container">
                    <button class="hero-chip" data-question="¿Cuáles son los sectores que tienen la mayor cantidad de proyectos?">
                        <span class="hero-chip-text">¿Cuáles son los sectores que tienen la mayor cantidad de proyectos?</span>
                    </button>
                    <button class="hero-chip" data-question="¿Cual es el monto total invertido en proyectos del sector educativo en lo últimos 5 años?">
                        <span class="hero-chip-text">¿Cuánto se ha invertido en el sector educativo en los últimos 5 años?</span>
                    </button>
                    <button class="hero-chip" data-question="¿Cuáles son los tres proyectos de mayor inversión en Santo Domingo?">
                        <span class="hero-chip-text">¿Cuáles son los tres proyectos de mayor inversión en Santo Domingo?</span>
                    </button>
                    <button class="hero-chip" data-question="¿Qué porcentaje de la inversión en proyectos se destina al sector salud en 2025?">
                        <span class="hero-chip-text">¿Qué porcentaje de la inversión en proyectos se destina al sector salud en 2025?</span>
                    </button>
                </div>
            </div>
            
            <!-- Disclaimer en Hero -->
            <div class="chat-disclaimer">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                <span>Soy una IA en fase de pruebas, puedo cometer errores.</span>
            </div>
        </div>
    </div>`;

    const template = document.createElement('template');
    template.innerHTML = heroHTML.trim();
    const heroElement = template.content.firstChild;

    const chatMessages = document.getElementById('chatMessages');
    if (chatMessages) {
        chatMessages.insertBefore(heroElement, chatMessages.firstChild);
        initWelcomeHero();
    }
}

// Función para actualizar el selector de país
function updateCountrySelector(countryCode, countryName, flag) {
    selectedCountry = countryCode;
    countryName = toTitleCase(countryName);
    const dropdownBtn = document.getElementById('countryDropdown');
    if (dropdownBtn) {
        dropdownBtn.innerHTML = `
                    <span class="country-flag-icon">${flag}</span>
                    <span class="d-none d-sm-inline">&nbsp;${countryName}&nbsp;</span>
                `;
    }
    // ↳ Al cambiar de país, actualizamos inmediatamente el historial mostrado
    getHistory();
}

// Sugerencias de mensajes
document.querySelectorAll('.suggestion-btn').forEach(btn => {
    btn.addEventListener('click', function () {
        messageInput.value = this.textContent;
        adjustTextareaHeight();
        messageInput.focus();
    });
});

// Nuevo chat
if (newChatBtn) {
    newChatBtn.addEventListener('click', async function () {
        await startNewChat();
        if (defaultCountryConfig) {
            startCountryFlow(defaultCountryConfig, { addMessages: false });
        }
    });
}

const helpBtn = document.getElementById('helpTriggerBtn');
if (helpBtn) {
    helpBtn.addEventListener('click', () => {
        const helpModal = document.getElementById('helpModal');
        if (helpModal) {
            showInfoModal(helpModal);
        }
    });
}

// Botón de ayuda en el sidebar
const sidebarHelpBtn = document.getElementById('sidebarHelpBtn');
if (sidebarHelpBtn) {
    sidebarHelpBtn.addEventListener('click', () => {
        const helpModal = document.getElementById('helpModal');
        if (helpModal) {
            showInfoModal(helpModal);
        }
        // Cerrar sidebar en móvil después de abrir el modal
        if (window.innerWidth <= 768 && typeof window.closeMobileSidebar === 'function') {
            window.closeMobileSidebar();
        }
    });
}

// Cerrar sidebar en móvil al hacer click fuera
document.addEventListener('click', function (e) {
    if (window.innerWidth <= 768) {
        if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
            sidebar.classList.remove('show');
        }
    }
});


// --- Legacy history retrieval and rendering for sidebar ---
/* ——— enlaza clicks en el historial ——— */
function initializeHistoryHandlers() {
    if (historyBtn && !historyBtn.dataset.listener) {
        historyBtn.dataset.listener = 'true';
        historyBtn.addEventListener('click', (e) => {
            historyBtn.style.transform = 'scale(0.95)';
            setTimeout(() => { historyBtn.style.transform = ''; }, 150);

            if (window.innerWidth <= 768 && window.closeMobileSidebar) {
                e.preventDefault();
                window.closeMobileSidebar();
                return;
            }

            if (!sidebarExpanded) {
                e.preventDefault();
                sidebarExpanded = true;
                sidebar.classList.remove('sidebar-collapsed');
                sidebar.classList.add('sidebar-expanded');
                mainContent.classList.remove('expanded');
                document.querySelectorAll('.sidebar-text').forEach(text => {
                    text.style.display = 'block';
                });
            }
        });
    }

    document.querySelectorAll('.conversation-item').forEach(item => {
        if (item.dataset.listener) return;
        item.dataset.listener = 'true';
        item.addEventListener('click', function () {
            if (window.closeMobileSidebar) {
                window.closeMobileSidebar();
            }
            document.querySelectorAll('.conversation-item').forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            const conversationId = item.dataset.conversation;
            const record = conversationId ? historyCache.get(conversationId) : null;
            if (!record) {
                const fallbackQuestion = item.querySelector('.fw-medium')?.textContent?.trim() || '';
                if (fallbackQuestion) {
                    messageInput.value = fallbackQuestion;
                    adjustTextareaHeight();
                    messageInput.focus();
                }
                return;
            }
            const questionText = record.question || record.Question || '';
            const answerHtml = record.trace ?? record.Trace ?? '';
            const answerPlain = record.answer ?? record.Answer ?? '';
            const answerId = record.id || record.ID || 0;
            renderConversationFromHistory(questionText, answerHtml, answerPlain, answerId);
        });
    });
}

function renderConversationFromHistory(questionText, answerHtml, answerPlain, answerId = 0) {
    if (!questionText) return;
    hideTypingIndicator();
    hideWelcomeMessage();

    if (chatMessages) {
        chatMessages.innerHTML = '';
        chatMessages.classList.add('has-messages');
    }

    addMessage(questionText, 'user');

    const normalizedHtml = (answerHtml || '').trim();
    const hasHtml = normalizedHtml && normalizedHtml.toLowerCase() !== 'none';
    const markdownFallback = (answerPlain || '').trim();
    const assistantPayload = hasHtml ? normalizedHtml : markdownFallback;

    if (assistantPayload) {
        const content = hasHtml ? assistantPayload : convertMarkdownLikeToHtml(assistantPayload);
        const assistantMsg = addMessage(content, 'assistant', answerId);
        if (assistantMsg) {
            setTimeout(() => showResponseActions(assistantMsg), 150);
        }
    } else {
        addMessage('No encontramos la respuesta almacenada para esta pregunta. Puedes volver a consultarla.', 'assistant');
    }

    if (messageInput) {
        messageInput.value = '';
        adjustTextareaHeight();
    }
}

function convertMarkdownLikeToHtml(text) {
    if (!text) return '';
    let content = String(text);
    const tableRegex = /((?:^|\n)\s*\|.+)+/g;
    content = content.replace(tableRegex, block => markdownTableToHtml(block));
    content = normalizeMarkdownLists(content);
    content = content.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    content = content.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    content = content.replace(/\[(.+?)\]\((https?:[^)]+)\)/g, "<a target='_BLANK' href='$2'>$1</a>");
    content = content.replace(/\n{2,}/g, '<br><br>');
    return content;
}

function normalizeMarkdownLists(text) {
    const lines = text.split(/\r?\n/);
    const out = [];
    let buffer = [];

    const flushList = () => {
        if (!buffer.length) return;
        out.push("<ul class='respuesta-lista'>");
        buffer.forEach(item => {
            out.push(`<li class='respuesta-lista-elemento'>${item}</li>`);
        });
        out.push("</ul>");
        buffer = [];
    };

    lines.forEach(line => {
        const match = line.match(/^\s*-\s+(.*)$/);
        if (match) {
            buffer.push(match[1].trim());
        } else {
            flushList();
            out.push(line);
        }
    });
    flushList();

    return out.join('\n');
}

function renderInlineMarkdown(text) {
    if (!text) return '';
    return String(text)
        .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*([^*]+)\*/g, '<em>$1</em>')
        .replace(/\[(.+?)\]\((https?:[^)]+)\)/g, "<a target='_BLANK' href='$2'>$1</a>");
}

function markdownTableToHtml(markdown) {
    const lines = markdown.trim().split(/\r?\n/).filter(Boolean);
    if (lines.length < 2) return markdown;

    const headerCells = lines[0].split('|').slice(1, -1).map(cell => cell.trim());
    if (!headerCells.length) return markdown;

    const rows = [];
    for (let i = 2; i < lines.length; i++) {
        const cells = lines[i].split('|').slice(1, -1).map(cell => cell.trim());
        if (cells.length) rows.push(cells);
    }
    if (!rows.length) return markdown;

    let html = "<div class='tabla-outer'><div class='tabla-scroll'><table class='tabla-respuesta'><thead><tr class='tabla-respuesta-fila'>";
    headerCells.forEach((cell, index) => {
        // Agregar clase para hacer los headers clickeables y ordenables
        html += `<th class='sortable-header' data-column-index='${index}' style='cursor: pointer; user-select: none;'>${renderInlineMarkdown(cell)} <span class='sort-indicator'></span></th>`;
    });
    html += "</tr></thead><tbody class='tabla-respuesta-cuerpo'>";
    rows.forEach(row => {
        html += "<tr class='tabla-respuesta-fila'>";
        row.forEach(cell => {
            html += `<td>${renderInlineMarkdown(cell)}</td>`;
        });
        html += '</tr>';
    });
    html += '</tbody></table></div></div>';
    return html;
}

function initializeTableSorting() {
    // Inicializar ordenamiento para todas las tablas nuevas
    document.querySelectorAll('.tabla-respuesta').forEach(table => {
        const headerCells = table.querySelectorAll('thead th');
        headerCells.forEach((th, idx) => {
            if (!th.classList.contains('sortable-header')) {
                th.classList.add('sortable-header');
                th.dataset.columnIndex = idx;
                // Agregar span indicador si no existe
                if (!th.querySelector('.sort-indicator')) {
                    const span = document.createElement('span');
                    span.className = 'sort-indicator';
                    th.appendChild(span);
                }
                th.style.cursor = 'pointer';
                th.style.userSelect = 'none';
            }
        });
    });

    document.querySelectorAll('.tabla-respuesta thead th.sortable-header').forEach(header => {
        // Evitar duplicar listeners
        if (header.dataset.sortInitialized === 'true') return;
        header.dataset.sortInitialized = 'true';

        header.addEventListener('click', function () {
            const table = this.closest('table');
            const tbody = table.querySelector('tbody');
            const rows = Array.from(tbody.querySelectorAll('tr'));
            const columnIndex = parseInt(this.dataset.columnIndex);

            // Determinar orden actual y alternar
            const isAsc = this.classList.contains('sort-asc');
            const isDesc = this.classList.contains('sort-desc');

            // Limpiar indicadores de otras columnas
            table.querySelectorAll('th.sortable-header').forEach(th => {
                th.classList.remove('sort-asc', 'sort-desc');
            });

            // Establecer nuevo orden
            if (!isAsc && !isDesc) {
                // Primera vez: orden ascendente
                this.classList.add('sort-asc');
                sortTableRows(rows, columnIndex, true);
            } else if (isAsc) {
                // Cambiar a descendente
                this.classList.remove('sort-asc');
                this.classList.add('sort-desc');
                sortTableRows(rows, columnIndex, false);
            } else {
                // Cambiar a ascendente (desde descendente)
                this.classList.remove('sort-desc');
                this.classList.add('sort-asc');
                sortTableRows(rows, columnIndex, true);
            }

            // Reordenar filas en el DOM
            rows.forEach(row => tbody.appendChild(row));
        });
    });
}

function sortTableRows(rows, columnIndex, ascending) {
    rows.sort((a, b) => {
        const aCell = a.querySelectorAll('td')[columnIndex];
        const bCell = b.querySelectorAll('td')[columnIndex];

        if (!aCell || !bCell) return 0;

        const aText = aCell.textContent.trim();
        const bText = bCell.textContent.trim();

        // Intentar parsear como número (maneja formato con puntos y comas)
        const aNum = parseNumber(aText);
        const bNum = parseNumber(bText);

        // Si ambos son números, comparar numéricamente
        if (aNum !== null && bNum !== null) {
            return ascending ? aNum - bNum : bNum - aNum;
        }

        // Comparación de texto (case-insensitive, ignorando acentos básicos)
        const aNorm = normalizeText(aText);
        const bNorm = normalizeText(bText);

        if (ascending) {
            return aNorm.localeCompare(bNorm, 'es', { sensitivity: 'base' });
        } else {
            return bNorm.localeCompare(aNorm, 'es', { sensitivity: 'base' });
        }
    });
}

function parseNumber(text) {
    if (!text) return null;
    // Remover puntos (separadores de miles) y reemplazar coma por punto (decimal)
    const cleaned = text.replace(/\./g, '').replace(',', '.');
    const num = parseFloat(cleaned);
    return isNaN(num) ? null : num;
}

function normalizeText(text) {
    if (!text) return '';
    return text.toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, ''); // Remover acentos
}

function formatJSONResponse(response) {
    if (!response) return [];

    if (response.rows && Array.isArray(response.rows)) {
        return response.rows;
    }

    if (Array.isArray(response)) {
        const jsonString = response[0];
        if (typeof jsonString === 'string' && jsonString.length > 0) {
            try {
                return JSON.parse(jsonString);
            } catch (e) {
                console.error('Error parsing history string:', e, jsonString);
                return [];
            }
        }
        return [];
    }

    if (response.history && Array.isArray(response.history)) {
        return response.history;
    }

    if (typeof response === 'string') {
        const trimmed = response.trim();
        if (trimmed.length === 0) return [];
        try {
            return JSON.parse(trimmed);
        } catch (e) {
            console.error('Error parsing history string:', e, trimmed);
            return [];
        }
    }

    console.warn('Formato de historial no reconocido', response);
    return [];
}


async function getHistory() {
    try {
        const resp = await fetch('/history', { credentials: 'include' });
        if (!resp.ok) throw new Error('Network response was not ok');
        const rawData = await resp.json();

        let rows = formatJSONResponse(rawData);
        if (!Array.isArray(rows)) rows = [];

        const moreThanLimit = rawData && typeof rawData === 'object'
            ? Boolean(rawData.more_than_limit)
            : false;
        const totalRows = rawData && typeof rawData === 'object'
            ? Number(rawData.total_rows || rows.length)
            : rows.length;

        // Add a filter here to remove null/undefined items from the payload array
        rows = rows.filter(item => item !== null && item !== undefined);

        // Filtrar solo las preguntas del país actualmente seleccionado
        if (selectedCountry) {
            const code = selectedCountry.toLowerCase();   // ISO-3 en minúsculas

            rows = rows.filter(it => {
                // Ensure 'it' is an object before accessing properties
                if (typeof it !== 'object' || it === null) {
                    return false; // Skip this item if it's not a valid object
                }

                // The backend can return different keys depending on the version;
                // we consider all of them to avoid discarding valid results.
                const cc_raw = (
                    it.pais ||   // current format: "pais": "dom"
                    it.country_code ||   // legacy format
                    it.country_iso3 ||   // possible variant
                    it.iso3 ||   // fallback
                    it.country ||   // ultra fallback
                    ''
                );
                // Ensure explicit string conversion before calling toLowerCase()
                const cc = String(cc_raw).toLowerCase();

                return cc === code;
            });
        }

        // ── Renderizamos en el sidebar ──────────────────────────
        const list = document.getElementById('sidebarHistory');   // unique sidebar container
        if (!list) return;
        list.innerHTML = '';                       // clear

        if (!rows.length) {
            list.innerHTML = `
                        <div class="empty-history text-muted small px-2 py-2">
                            No hay conversaciones recientes.
                        </div>`;
        }

        historyCache.clear();

        rows.forEach(c => {
            // Also ensure 'c' and its properties exist before creating the button
            if (!c || !c.id || !c.question) return;
            historyCache.set(String(c.id), c);
            const btn = document.createElement('button');
            btn.className = 'conversation-item';
            btn.dataset.conversation = c.id;
            btn.innerHTML = `
                        <div class="d-flex align-items-start">
                            <i data-feather="message-circle" class="me-2 mt-1"
                            style="width:14px;height:14px;"></i>
                            <div class="flex-1">
                                <div class="fw-medium">${c.question}</div>
                            </div>
                        </div>`;
            list.appendChild(btn);
        });

        feather.replace();             // refresh icons
        initializeHistoryHandlers();    // re-bind click events
    } catch (err) {
        console.error('Error cargando historial:', err);
    }
}


function renderSidebarHistory(items) {
    const container = document.getElementById('sidebarHistory');
    container.innerHTML = '';
    items.forEach(item => {
        const btn = document.createElement('button');
        btn.className = 'conversation-item';
        btn.setAttribute('data-conversation', item.id);
        btn.innerHTML = `
                    <div class="d-flex align-items-center">
                        <span class="me-2">&bull;</span>
                        <div class="sidebar-text">
                            <div class="fw-medium">${item.question}</div>
                        </div>
                    </div>`;
        btn.addEventListener('click', function () {
            document.querySelectorAll('.conversation-item').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            // Instead of loading conversation, populate input and focus
            const questionText = this.querySelector('.fw-medium').textContent;
            messageInput.value = questionText;
            adjustTextareaHeight();
            messageInput.focus();
            // To auto-send, uncomment the next line:
            // sendMessage();
        });
        container.appendChild(btn);
    });
    // feather.replace(); // re-render icons
}

function buildCountryConfig(country, flagMarkup, displayName) {
    return {
        iso3: (country.country_iso3 || '').toUpperCase(),
        name: displayName || toTitleCase(country.country_name),
        flag: flagMarkup,
        amountSeparator: country.amount_separator ? { ...country.amount_separator } : {},
        currencyType: country.currency_type || '',
        fsQuestion: country.fs_question || '',
        pqQuestion: country.pq_question || '',
        description: country.country_description || '',
        tooltip: country.description || '',
        projectUrl: country.project_url || ''
    };
}

function startCountryFlow(config, options = {}) {
    if (!config) return;

    const {
        addMessages = true
    } = options;

    const countryName = toTitleCase(config.name || '');
    const flagMarkup = config.flag || '';

    amountSeparator = config.amountSeparator || {};
    currencyType = config.currencyType || '';
    fsQ = config.fsQuestion || '';
    pqQ = config.pqQuestion || '';
    countryDescription = config.tooltip || config.description || '';
    projectUrl = config.projectUrl || '';

    const fsBtn = document.getElementById('fsQuestionBtn');
    const fsText = document.getElementById('fsQuestionText');
    const fsSpinner = document.getElementById('fsQuestionSpinner');
    if (fsBtn && fsText) {
        const question = fsQ || '';
        fsBtn.dataset.question = question;
        fsText.textContent = question || 'Consulta principal disponible';
        if (fsSpinner) {
            fsSpinner.classList.toggle('d-none', Boolean(question));
        }
    }

    const pqBtn = document.getElementById('pqQuestionBtn');
    const pqText = document.getElementById('pqQuestionText');
    const pqSpinner = document.getElementById('pqQuestionSpinner');
    if (pqBtn && pqText) {
        const question = pqQ || '';
        pqBtn.dataset.question = question;
        pqText.textContent = question || 'Pregunta relacionada disponible';
        if (pqSpinner) {
            pqSpinner.classList.toggle('d-none', Boolean(question));
        }
    }

    updateCountrySelector(config.iso3, countryName, flagMarkup);

    if (!addMessages) return;

    hideWelcomeMessage();
    addMessage(`Quiero consultar información sobre recursos públicos en ${countryName}`, 'user');

    setTimeout(() => {
        let infoText = `Perfecto, he configurado el sistema para consultas sobre ${countryName}.`;
        if (config.description) {
            infoText += ` ${config.description}`;
        }
        addMessage(infoText, 'assistant');
        showCompactSuggestions(fsQ, pqQ);
    }, 1000);
}

// Inicializa el país por defecto (hardcoded DOM - único país activo)
function initializeDefaultCountry() {
    // Exponer para compatibilidad con código legacy
    window._loadedCountries = [DEFAULT_COUNTRY_CONFIG];
    window._defaultCountryConfig = DEFAULT_COUNTRY_CONFIG;

    // Ocultar selectores de país (solo hay uno)
    const container = document.getElementById('selectorPaises');
    const dropdownMenu = document.getElementById('countryDropdownMenu');
    if (container) container.style.display = 'none';
    if (dropdownMenu) dropdownMenu.style.display = 'none';

    // Iniciar flujo con configuración hardcodeada
    startCountryFlow(DEFAULT_COUNTRY_CONFIG, { addMessages: false });
}


// update sidebar history for this country
function onCountrySelected() {
    // ...existing logic...
    // update sidebar history for this country
    getHistory();
}





function showCompactSuggestions(fsQuestion = '', pqQuestion = '') {


    // Elimina sugerencias previas antes de crear nuevas
    const oldBlock = document.getElementById('compactSuggestions');
    if (oldBlock) oldBlock.remove();

    const suggestions = [];
    if (fsQuestion) suggestions.push({ icon: 'book-open', q: fsQuestion, type: 'card' });
    if (pqQuestion) suggestions.push({ icon: 'heart', q: pqQuestion, type: 'card' });
    // Sugerencia directa para que el usuario sepa qué puede consultar
    suggestions.push({ icon: 'info', q: 'Qué cosas puedo consultar?', type: 'card' });
    suggestions.push({ icon: 'bar-chart-2', q: 'Ver estadísticas', type: 'chip' });
    suggestions.push({ icon: 'help-circle', q: 'Ayuda', type: 'chip' });

    const html = `
            <div class="compact-suggestions" id="compactSuggestions">
                <div class="compact-suggestions-title">
                    <i data-feather="help-circle" style="width:11px;height:11px;"></i>
                    <span>Preguntas relacionadas</span>
                </div>
                <div class="compact-suggestions-list">
                    ${suggestions.map(s => `
                        <button class="compact-suggestion-btn" data-question="${s.q}">
                            <i data-feather="${s.icon}" class="compact-suggestion-icon"></i>
                            <span>${s.q}</span>
                        </button>`).join('')}
                </div>
            </div>`;

    const lastAssistant = document.querySelector('.message.assistant:last-child .message-wrapper');
    if (lastAssistant) lastAssistant.insertAdjacentHTML('beforeend', html);
    feather.replace();

    document.querySelectorAll('.compact-suggestion-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const q = btn.dataset.question;
            hideWelcomeMessage();
            addMessage(q, 'user');
            showTypingIndicator();
            sendQuestion(q, Date.now());
            /* No removemos el bloque; UX pidió que se mantenga visible */
        });
    });
}


/* ---------- PRIVACY / COOKIE CONSENT ---------- */
function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${d.toUTCString()};path=/`;
}
function getCookie(name) {
    const prefix = `${name}=`;
    return document.cookie
        .split(';')
        .map(c => c.trim())
        .find(c => c.indexOf(prefix) === 0)
        ?.substring(prefix.length) || null;
}
function safeStorageGet(key) {
    try {
        return window.localStorage ? localStorage.getItem(key) : null;
    } catch (error) {
        console.warn('[privacy] localStorage.getItem falló:', error);
        return null;
    }
}
function safeStorageSet(key, value) {
    try {
        if (window.localStorage) {
            localStorage.setItem(key, value);
            return true;
        }
    } catch (error) {
        console.warn('[privacy] localStorage.setItem falló:', error);
    }
    return false;
}

const bodyScrollLock = {
    count: 0,
    previous: ''
};

function lockBodyScroll() {
    if (bodyScrollLock.count === 0) {
        bodyScrollLock.previous = document.body.style.overflow || '';
        document.body.style.overflow = 'hidden';
    }
    bodyScrollLock.count += 1;
}

function unlockBodyScroll(force = false) {
    if (force) {
        bodyScrollLock.count = 0;
    } else if (bodyScrollLock.count > 0) {
        bodyScrollLock.count -= 1;
    }

    if (bodyScrollLock.count === 0) {
        document.body.style.overflow = bodyScrollLock.previous || '';
        bodyScrollLock.previous = '';
    }
}

function registerBodyLock(target) {
    if (!target || target.dataset.bodyLock === 'true') return;
    target.dataset.bodyLock = 'true';
    lockBodyScroll();
}

function releaseBodyLock(target, { force = false } = {}) {
    if (!target) return;
    if (force) {
        delete target.dataset.bodyLock;
        unlockBodyScroll(true);
        return;
    }
    if (target.dataset.bodyLock === 'true') {
        delete target.dataset.bodyLock;
        unlockBodyScroll();
    }
}

function initializePrivacyModal() {
    const overlay = document.getElementById('privacyModal');
    const accept = document.getElementById('privacyAcceptBtn');
    if (!overlay || !accept) return;

    const hasCookie = Boolean(getCookie('cookies_accepted'));
    const localStorageAccepted = safeStorageGet('privacyAccepted') === 'true';
    let privacyAccepted = hasCookie || localStorageAccepted;

    if (!privacyAccepted) {
        showPrivacyModal();
        disableMainInteractions();
    } else {
        hidePrivacyModal({ immediate: true });
    }

    const handleAcceptance = () => {
        if (privacyAccepted) return;

        setCookie('cookies_accepted', 'true', 365);

        const acceptedAt = new Date().toISOString();
        safeStorageSet('privacyAccepted', 'true');
        safeStorageSet('privacyAcceptedDate', acceptedAt);

        privacyAccepted = true;
        hidePrivacyModal();
        enableMainInteractions();
        showToast('¡Gracias! Ya puedes chatear con MapaInversiones', 'success');
    };

    accept.addEventListener('click', handleAcceptance);
    accept.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            handleAcceptance();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay.classList.contains('show') && !privacyAccepted) {
            e.preventDefault();
            e.stopPropagation();
        }
    });
}

function showPrivacyModal() {
    const overlay = document.getElementById('privacyModal');
    if (!overlay) return;
    registerBodyLock(overlay);
    overlay.style.display = 'flex';
    setTimeout(() => overlay.classList.add('show'), 50);
}

function hidePrivacyModal(options = {}) {
    const overlay = document.getElementById('privacyModal');
    if (!overlay) return;

    const { immediate = false } = options;

    overlay.classList.remove('show');

    const finalize = () => {
        overlay.style.display = 'none';
        releaseBodyLock(overlay);
    };

    if (immediate) {
        finalize();
        return;
    }

    setTimeout(finalize, 300);
}

function disableMainInteractions() {
    const selectors = [
        '#messageInput',
        '#sendBtn',
        '#newChatBtn',
        '.example-question-card',
        '.conversation-item',
        '#sidebarToggle'
    ];

    selectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
            el.classList.add('privacy-disabled');
            if (['INPUT', 'TEXTAREA', 'BUTTON'].includes(el.tagName)) {
                el.disabled = true;
            }
        });
    });

    if (mainContent) {
        mainContent.classList.add('privacy-disabled');
    }
}

function enableMainInteractions() {
    const selectors = [
        '#messageInput',
        '#sendBtn',
        '#newChatBtn',
        '.example-question-card',
        '.conversation-item',
        '#sidebarToggle'
    ];

    selectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => {
            el.classList.remove('privacy-disabled');
            if (['INPUT', 'TEXTAREA', 'BUTTON'].includes(el.tagName)) {
                el.disabled = false;
            }
        });
    });

    if (mainContent) {
        mainContent.classList.remove('privacy-disabled');
    }
}

function initializeMobileEnhancements() {
    if (mobileEnhancementsReady) return;
    mobileEnhancementsReady = true;
    initializeMobileSidebar();
    initializeMobileModals();
    preventIOSZoom();
    handleOrientationChange();
}

function initializeMobileSidebar() {
    if (!sidebar) return;

    function closeMobileSidebar() {
        if (sidebar.classList.contains('show')) {
            sidebar.classList.remove('show');
        }
        releaseBodyLock(sidebar);

        const backdrop = document.querySelector('.sidebar-backdrop');
        if (backdrop && backdrop.parentNode) {
            backdrop.parentNode.removeChild(backdrop);
        }
    }

    function createSidebarBackdrop() {
        if (window.innerWidth > 768) return;

        const existingBackdrop = document.querySelector('.sidebar-backdrop');
        if (existingBackdrop) existingBackdrop.remove();

        const backdrop = document.createElement('div');
        backdrop.className = 'sidebar-backdrop';
        backdrop.addEventListener('click', closeMobileSidebar);
        document.body.appendChild(backdrop);

        requestAnimationFrame(() => backdrop.classList.add('show'));
    }

    if (sidebarToggle) {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    if (window.innerWidth <= 768) {
                        if (sidebar.classList.contains('show')) {
                            createSidebarBackdrop();
                            registerBodyLock(sidebar);
                        } else {
                            closeMobileSidebar();
                        }
                    }
                }
            });
        });

        observer.observe(sidebar, { attributes: true });
    }

    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            closeMobileSidebar();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeMobileSidebar();
        }
    });

    window.closeMobileSidebar = closeMobileSidebar;
}

function initializeMobileModals() {
    const modals = document.querySelectorAll('.info-modal, .privacy-modal');

    modals.forEach(modal => {
        let startY = 0;
        let isSwiping = false;

        modal.addEventListener('touchstart', (e) => {
            if (window.innerWidth <= 768) {
                startY = e.touches[0].clientY;
                isSwiping = true;
            }
        });

        modal.addEventListener('touchmove', (e) => {
            if (!isSwiping) return;

            const currentY = e.touches[0].clientY;
            const diffY = currentY - startY;

            if (diffY > 100) {
                const overlay = modal.closest('.info-modal-overlay, .privacy-modal-overlay');
                if (overlay?.classList.contains('privacy-modal-overlay')) {
                    hidePrivacyModal();
                } else if (overlay) {
                    hideInfoModal(overlay);
                }
                isSwiping = false;
            }
        });

        modal.addEventListener('touchend', () => {
            isSwiping = false;
        });
    });
}

function preventIOSZoom() {
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('focus', () => {
            const viewport = document.querySelector('meta[name="viewport"]');
            if (!viewport) return;

            const originalContent = viewport.content;
            viewport.dataset.originalContent = originalContent;
            viewport.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no';

            input.addEventListener('blur', () => {
                const stored = viewport.dataset.originalContent;
                viewport.content = stored || originalContent;
            }, { once: true });
        });
    });

    document.addEventListener('gesturestart', (e) => e.preventDefault());

    let lastTouchEnd = 0;
    document.addEventListener('touchend', (e) => {
        const now = Date.now();
        if (now - lastTouchEnd <= 300) {
            e.preventDefault();
        }
        lastTouchEnd = now;
    }, { passive: false });
}

function handleOrientationChange() {
    function adjustForOrientation() {
        if (window.innerWidth <= 768) {
            if (sidebar && sidebar.classList.contains('show')) {
                sidebar.classList.remove('show');
                releaseBodyLock(sidebar);
            }

            document.querySelectorAll('.dropdown-menu.show').forEach(dropdown => {
                const instance = bootstrap.Dropdown.getInstance(dropdown);
                if (instance) {
                    instance.hide();
                }
            });

            document.querySelectorAll('.sidebar-backdrop, .dropdown-backdrop').forEach(backdrop => {
                if (backdrop.parentNode) {
                    backdrop.parentNode.removeChild(backdrop);
                }
            });
        }

        setTimeout(() => {
            if (chatMessages) {
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }
        }, 300);
    }

    window.addEventListener('orientationchange', adjustForOrientation);
    window.addEventListener('resize', adjustForOrientation);
}

function optimizeMobilePerformance() {
    const options = { passive: true };

    if (chatMessages) {
        let ticking = false;

        function onScroll() {
            if (!ticking) {
                requestAnimationFrame(() => {
                    updateChatScrollIndicators();
                    ticking = false;
                });
                ticking = true;
            }
        }

        chatMessages.addEventListener('scroll', onScroll, options);
    }

    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            if (window.innerWidth <= 768) {
                initializeMobileEnhancements();
                updateChatScrollIndicators();
            }
        }, 250);
    });
}

function isTouchDevice() {
    return ('ontouchstart' in window) || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
}

if (isTouchDevice()) {
    document.documentElement.classList.add('touch-device');
} else {
    document.documentElement.classList.add('no-touch');
}

// Detectar scroll en tablas
document.addEventListener('DOMContentLoaded', function () {
    const tableContainers = document.querySelectorAll('.tabla-respuesta-container');

    tableContainers.forEach(container => {
        container.addEventListener('scroll', function () {
            if (this.scrollLeft > 10) {
                this.classList.add('scrolled');
            } else {
                this.classList.remove('scrolled');
            }
        });
    });

    // Wrap legacy tables without the scroll container
    if (typeof wrapTablesWithScrollContainer === 'function') {
        wrapTablesWithScrollContainer();
    }

    // ============================================
    // FUNCIÓN PARA ENVIAR FEEDBACK PERSONALIZADO
    // ============================================

    window.sendCustomFeedback = function sendCustomFeedback(answerId, feedbackText, userQuestion, userEmail) {
        return new Promise((resolve, reject) => {
            // Configuración: por defecto intentamos persistir en backend
            const emailConfig = {
                recipient: 'enriquejinfo@gmail.com',
                subject: 'Feedback de Usuario - MapaInversiones',
                useAPI: true // usar el endpoint para persistir en DB por defecto
            };

            // Preparar el contenido del mensaje (ACTUALIZADO CON EMAIL DEL USUARIO)
            const emailBody = `Feedback del Usuario\n\nEmail del usuario: ${userEmail || 'No proporcionado'}\n\nPregunta original: ${userQuestion}\n\n${feedbackText ? `Comentario adicional:\n${feedbackText}` : 'Sin comentario adicional'}\n\n---\nAnswer ID: ${answerId}\nFecha: ${new Date().toLocaleString('es-DO')}`;

            if (emailConfig.useAPI) {
                // Enviar mediante API backend al endpoint que persiste feedback
                fetch('/api/sendCustomFeedback', {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-API-Key': window.API_KEY
                    },
                    body: JSON.stringify({
                        answerId: Number(answerId),
                        feedbackText: feedbackText,
                        userQuestion: userQuestion,
                        userEmail: userEmail || null
                    })
                })
                    .then(response => {
                        if (response.status === 409) {
                            // Conflict: feedback for this answer/session already exists
                            try { showToast('Ya registramos tu feedback para esta respuesta. ¡Gracias!', 'info'); } catch (_) { }

                            // Remove inline feedback form for this answer and show a small badge
                            try {
                                const actions = document.querySelectorAll(`.response-actions[data-answer-id="${answerId}"]`);
                                actions.forEach(a => {
                                    const messageWrapper = a.closest('.message-wrapper');
                                    if (!messageWrapper) return;
                                    // remove inline containers inside this wrapper
                                    messageWrapper.querySelectorAll('.feedback-inline-container').forEach(f => f.remove());

                                    // add a lightweight badge so the user sees the feedback is recorded
                                    if (!messageWrapper.querySelector('.feedback-sent-badge')) {
                                        const badge = document.createElement('div');
                                        badge.className = 'feedback-sent-badge';
                                        badge.textContent = 'Feedback registrado';
                                        badge.style.cssText = 'margin-top:8px;color:#2f6fed;font-weight:600;font-size:0.95rem;';
                                        const metaEl = messageWrapper.querySelector('.message-meta');
                                        if (metaEl && metaEl.parentNode) metaEl.parentNode.insertBefore(badge, metaEl.nextSibling);
                                    }
                                });
                            } catch (_) { }

                            // Resolve with conflict info so caller can handle it
                            resolve({ success: false, conflict: true });
                            return;
                        }

                        if (!response.ok) throw new Error('Error al persistir feedback');
                        return response.json();
                    })
                    .then(data => {
                        console.log('[FEEDBACK] Persistido exitosamente', data);
                        resolve(data);
                    })
                    .catch(error => {
                        console.error('[FEEDBACK] Error al persistir feedback:', error);
                        // Si falla el backend por red / inesperado, caer a mailto como fallback
                        try {
                            const mailtoLink = `mailto:${emailConfig.recipient}?subject=${encodeURIComponent(emailConfig.subject)}&body=${encodeURIComponent(emailBody)}`;
                            window.location.href = mailtoLink;
                        } catch (_) { }
                        reject(error);
                    });
            } else {
                // Fallback: abrir cliente de correo del usuario
                try {
                    const mailtoLink = `mailto:${emailConfig.recipient}?subject=${encodeURIComponent(emailConfig.subject)}&body=${encodeURIComponent(emailBody)}`;
                    window.location.href = mailtoLink;
                    setTimeout(() => resolve({ success: true, method: 'mailto' }), 500);
                } catch (err) {
                    reject(err);
                }
            }

            // También registrar en el backend el feedback resumido para métricas/analytics
            try { sendFeedback(answerId, false, `custom: ${userEmail || 'no-email'} - ${String(feedbackText || '').substring(0, 80)}`); } catch (_) { }
        });
    }


});

// ============================================
// AUTOCOMPLETADO / SUGERENCIAS
// ============================================

(function initAutocomplete() {
    // Elementos del DOM
    const messageInput = document.getElementById('messageInput');
    const suggestionsContainer = document.getElementById('suggestionsContainer');
    const suggestionsList = document.getElementById('suggestionsList');

    if (!messageInput || !suggestionsContainer || !suggestionsList) {
        console.warn('[AUTOCOMPLETE] Elementos del DOM no encontrados');
        return;
    }

    // ============================================
    // DATOS DE EJEMPLO - Fallback local si el backend no responde
    // ============================================
    const exampleSuggestions = [
        "¿Qué proyectos de salud se ejecutan en Santo Domingo?",
        "¿Cuáles son las inversiones en educación para 2024?",
        "¿Qué obras de infraestructura están en construcción?",
        "¿Cuál es el presupuesto asignado al sector turismo?",
        "¿Qué proyectos de vivienda social existen?",
        "¿Cuáles son las iniciativas de energía renovable?",
        "¿Qué inversiones hay en el sector agropecuario?",
        "¿Cuáles son los proyectos de agua y saneamiento?",
        "¿Qué obras viales están planificadas?",
        "¿Cuál es el estado de las inversiones en tecnología?",
        "¿Qué proyectos de desarrollo comunitario hay?",
        "¿Cuáles son las inversiones en seguridad ciudadana?"
    ];

    // Estado del autocompletado
    let currentSuggestions = [];
    let selectedIndex = -1;
    let isOpen = false;
    let suggestionsRequestId = 0;

    // ============================================
    // CÓDIGO OPTIMIZADO PARA SUGERENCIAS
    // ============================================
    // Reemplazar estas 3 funciones en tu código JavaScript existente

    // ============================================
    // 1. FUNCIÓN PARA OBTENER SUGERENCIAS (modificada)
    // ============================================
    async function fetchSuggestions(query) {
        const trimmed = (query || '').trim();
        if (trimmed.length < 2) {
            return [];
        }

        const iso3 = (selectedCountry || DEFAULT_COUNTRY_CONFIG.iso3 || 'DOM').toLowerCase();
        const url = `/api/suggestions?q=${encodeURIComponent(trimmed)}&country=${encodeURIComponent(iso3)}`;

        try {
            const headers = {};
            if (window.API_KEY) {
                headers['X-API-Key'] = window.API_KEY;
            }

            const response = await fetch(url, {
                headers,
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const data = await response.json();
            const serverSuggestions = Array.isArray(data.suggestions) ? data.suggestions : [];
            if (serverSuggestions.length) {
                return serverSuggestions.slice(0, 5);
            }
        } catch (error) {
            console.error('[AUTOCOMPLETE] Error fetching suggestions:', error);
        }

        const normalizedQuery = trimmed.toLowerCase();
        return exampleSuggestions
            .filter(suggestion => suggestion.toLowerCase().includes(normalizedQuery))
            .slice(0, 5);
    }

    // ============================================
    // 2. FUNCIÓN PARA RESALTAR COINCIDENCIAS (nueva)
    // ============================================
    function highlightMatch(text, query) {
        if (!query || query.length < 2) {
            return `<span class="suggestion-text">${text}</span>`;
        }

        // Escapar caracteres especiales de regex
        const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

        // Crear regex case-insensitive
        const regex = new RegExp(`(${escapedQuery})`, 'gi');

        // Dividir el texto en partes que coinciden y no coinciden
        const parts = text.split(regex);

        // Construir HTML: coincidencias en BOLD, resto normal
        let highlightedHTML = parts.map(part => {
            if (part.toLowerCase() === query.toLowerCase()) {
                // ✅ Coincidencia: texto en BOLD
                return `<strong>${part}</strong>`;
            } else if (part) {
                // No coincidencia: texto normal
                return part;
            }
            return '';
        }).join('');

        return `<span class="suggestion-text">${highlightedHTML}</span>`;
    }

    // ============================================
    // 3. RENDERIZAR SUGERENCIAS (modificada)
    // ============================================
    function renderSuggestions(suggestions) {
        suggestionsList.innerHTML = '';

        if (suggestions.length === 0) {
            suggestionsContainer.style.display = 'none';
            isOpen = false;
            return;
        }

        suggestions.forEach((suggestion, index) => {
            const li = document.createElement('li');
            li.dataset.index = index;

            // ✅ Aplicar resaltado y truncado
            const query = messageInput.value;
            const maxLength = window.innerWidth <= 480 ? 60 : 80; // Límite responsive

            // Truncar si es necesario
            let displayText = suggestion;
            if (suggestion.length > maxLength) {
                displayText = suggestion.substring(0, maxLength) + '…';
            }

            // Aplicar resaltado
            li.innerHTML = highlightMatch(displayText, query);

            // Guardar el texto completo como data attribute para selección
            li.dataset.fullText = suggestion;

            // Evento de clic
            li.addEventListener('click', () => {
                selectSuggestion(li.dataset.fullText); // Usar texto completo
            });

            suggestionsList.appendChild(li);
        });

        suggestionsContainer.style.display = 'block';
        isOpen = true;
        selectedIndex = -1;
    }

    // ============================================
    // 4. SELECCIONAR SUGERENCIA (pequeña modificación)
    // ============================================
    function selectSuggestion(suggestion) {
        messageInput.value = suggestion;
        closeSuggestions();
        messageInput.focus();

        // Ajustar altura del textarea
        if (typeof adjustTextareaHeight === 'function') {
            adjustTextareaHeight();
        } else if (typeof autoResize === 'function') {
            autoResize();
        }

        // ✅ Trigger manual del evento input para actualizar otras funcionalidades
        messageInput.dispatchEvent(new Event('input', { bubbles: true }));
    }

    // ============================================
    // CERRAR SUGERENCIAS
    // ============================================
    function closeSuggestions() {
        suggestionsContainer.style.display = 'none';
        isOpen = false;
        selectedIndex = -1;
        currentSuggestions = [];
    }

    // ============================================
    // ACTUALIZAR SELECCIÓN CON TECLADO
    // ============================================
    function updateSelection() {
        const items = suggestionsList.querySelectorAll('li');

        items.forEach((item, index) => {
            if (index === selectedIndex) {
                item.classList.add('active');
                // Scroll automático para mantener el item visible
                item.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
            } else {
                item.classList.remove('active');
            }
        });
    }

    // ============================================
    // EVENTO: INPUT - Filtrar sugerencias
    // ============================================
    messageInput.addEventListener('input', async (e) => {
        const query = e.target.value;
        const requestId = ++suggestionsRequestId;
        const suggestions = await fetchSuggestions(query);

        if (messageInput.value !== query || requestId !== suggestionsRequestId) {
            return;
        }

        currentSuggestions = suggestions;
        renderSuggestions(currentSuggestions);
    });

    // ============================================
    // EVENTO: KEYDOWN - Navegación con teclado
    // ============================================
    messageInput.addEventListener('keydown', (e) => {
        if (!isOpen) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                selectedIndex = Math.min(selectedIndex + 1, currentSuggestions.length - 1);
                updateSelection();
                break;

            case 'ArrowUp':
                e.preventDefault();
                selectedIndex = Math.max(selectedIndex - 1, -1);
                updateSelection();
                break;

            case 'Enter':
                if (selectedIndex >= 0 && selectedIndex < currentSuggestions.length) {
                    e.preventDefault();
                    selectSuggestion(currentSuggestions[selectedIndex]);
                }
                break;

            case 'Escape':
                e.preventDefault();
                closeSuggestions();
                break;
        }
    });

    // ============================================
    // EVENTO: CLICK FUERA - Cerrar sugerencias
    // ============================================
    document.addEventListener('click', (e) => {
        if (!suggestionsContainer.contains(e.target) && e.target !== messageInput) {
            closeSuggestions();
        }
    });

    // ============================================
    // EVENTO: FOCUS - Mostrar sugerencias si hay texto
    // ============================================
    messageInput.addEventListener('focus', async () => {
        const value = messageInput.value;
        if (value.length >= 2) {
            const requestId = ++suggestionsRequestId;
            const suggestions = await fetchSuggestions(value);
            if (messageInput.value !== value || requestId !== suggestionsRequestId) {
                return;
            }
            currentSuggestions = suggestions;
            renderSuggestions(currentSuggestions);
        }
    });

    console.log('[AUTOCOMPLETE] Inicializado correctamente ✓');
})();


// ============================================
// SIDEBAR DE DETALLES TÉCNICOS
// ============================================

(function initTechnicalSidebar() {
    const sidebar = document.getElementById('technicalDetailsSidebar');
    const overlay = document.getElementById('technicalSidebarOverlay');
    const closeBtn = document.getElementById('closeTechnicalSidebar');
    const downloadBtn = document.getElementById('sidebarDownloadBtn');
    const sidebarContent = document.getElementById('technicalSidebarContent');

    // Variable para almacenar el HTML actual de detalles técnicos
    let currentTechnicalDetailsHtml = '';
    let currentMessageElement = null;

    // ============================================
    // FUNCIÓN: Abrir sidebar
    // ============================================
    window.openTechnicalSidebar = function (detailsHtml, messageElement) {
        if (!sidebar || !overlay) return;

        // Guardar el HTML y el elemento del mensaje
        currentTechnicalDetailsHtml = detailsHtml;
        currentMessageElement = messageElement;

        // Insertar contenido en el sidebar
        sidebarContent.innerHTML = detailsHtml || '<p>No hay detalles técnicos disponibles.</p>';

        // Mostrar sidebar y overlay
        sidebar.classList.add('active');
        sidebar.setAttribute('aria-hidden', 'false');
        overlay.classList.add('active');

        // Prevenir scroll del body
        document.body.style.overflow = 'hidden';

        console.log('[SIDEBAR] Sidebar de detalles técnicos abierto');
    };

    // ============================================
    // FUNCIÓN: Cerrar sidebar
    // ============================================
    function closeTechnicalSidebar() {
        if (!sidebar || !overlay) return;

        sidebar.classList.remove('active');
        sidebar.setAttribute('aria-hidden', 'true');
        overlay.classList.remove('active');

        // Restaurar scroll del body
        document.body.style.overflow = '';

        console.log('[SIDEBAR] Sidebar de detalles técnicos cerrado');
    }

    // ============================================
    // EVENTOS: Cerrar sidebar
    // ============================================

    // Botón de cerrar
    if (closeBtn) {
        closeBtn.addEventListener('click', closeTechnicalSidebar);
    }

    // Click en el overlay
    if (overlay) {
        overlay.addEventListener('click', closeTechnicalSidebar);
    }

    // Tecla ESC
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && sidebar?.classList.contains('active')) {
            closeTechnicalSidebar();
        }
    });

    // ============================================
    // EVENTO: Descargar datos desde el sidebar
    // ============================================
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function () {
            // Llamar a la función de descarga existente si está disponible
            if (typeof downloadTableAndMetadata === 'function' && currentMessageElement) {
                downloadTableAndMetadata(currentMessageElement, currentTechnicalDetailsHtml);
            } else {
                console.warn('[SIDEBAR] Función downloadTableAndMetadata no disponible');
                // Fallback simple: descargar como HTML
                downloadAsHtml(currentTechnicalDetailsHtml);
            }
        });
    }

    // ============================================
    // FUNCIÓN FALLBACK: Descargar como HTML
    // ============================================
    function downloadAsHtml(htmlContent) {
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `detalles-tecnicos-${Date.now()}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    console.log('[SIDEBAR] Sistema de sidebar de detalles técnicos inicializado');
})();

// ============================================
// FUNCIONALIDAD: DICTADO POR VOZ
// ============================================

let voiceRecognition = null;
let isListening = false;

function initVoiceRecognition() {
    const voiceBtn = document.getElementById('voiceBtn');
    if (!voiceBtn) return;

    // Verificar soporte del navegador
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
        voiceBtn.style.display = 'none';
        console.warn('El navegador no soporta reconocimiento de voz');
        return;
    }

    // Configurar reconocimiento
    voiceRecognition = new SpeechRecognition();
    voiceRecognition.lang = 'es-MX'; // Español de México
    voiceRecognition.continuous = false;
    voiceRecognition.interimResults = false;
    voiceRecognition.maxAlternatives = 1;

    // Eventos del reconocimiento
    voiceRecognition.onstart = () => {
        // ⭐ NUEVO: Detener lectura si está activa
        if (currentSpeechState.isReading || currentSpeechState.isPaused) {
            forceStopReading();
        }
        isListening = true;
        voiceBtn.classList.add('listening');
        voiceBtn.querySelector('i').setAttribute('data-feather', 'mic');
        feather.replace();
        showNotification('Escuchando... Habla ahora', 'info');
    };

    voiceRecognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        const confidence = event.results[0][0].confidence;

        console.log('Reconocido:', transcript, 'Confianza:', confidence);

        // Insertar texto en el input
        const messageInput = document.getElementById('messageInput');
        if (messageInput) {
            messageInput.value = transcript;
            adjustTextareaHeight();
            messageInput.focus();
        }

        showNotification('Texto reconocido correctamente', 'success');
    };

    voiceRecognition.onerror = (event) => {
        console.error('Error de reconocimiento:', event.error);

        voiceBtn.classList.remove('listening', 'processing');
        voiceBtn.classList.add('error');

        let errorMsg = 'Error al reconocer voz';

        switch (event.error) {
            case 'no-speech':
                errorMsg = 'No se detectó voz. Intenta de nuevo';
                break;
            case 'audio-capture':
                errorMsg = 'No se puede acceder al micrófono';
                break;
            case 'not-allowed':
                errorMsg = 'Permiso de micrófono denegado';
                break;
            case 'network':
                errorMsg = 'Error de red. Verifica tu conexión';
                break;
        }

        showNotification(errorMsg, 'error');

        setTimeout(() => {
            voiceBtn.classList.remove('error');
            voiceBtn.querySelector('i').setAttribute('data-feather', 'mic');
            feather.replace();
        }, 2000);
    };

    voiceRecognition.onend = () => {
        isListening = false;
        voiceBtn.classList.remove('listening', 'processing');
        voiceBtn.querySelector('i').setAttribute('data-feather', 'mic');
        feather.replace();
    };

    // Click en botón de voz
    voiceBtn.addEventListener('click', () => {
        if (isListening) {
            voiceRecognition.stop();
            showNotification('Grabación detenida', 'info');
        } else {
            try {
                voiceRecognition.start();
            } catch (error) {
                console.error('Error al iniciar reconocimiento:', error);
                showNotification('Error al iniciar el micrófono', 'error');
            }
        }
    });
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    // ... código existente ...

    // Inicializar dictado por voz
    initVoiceRecognition();
    /**
 * Inicializa los botones "¿Qué puedo preguntar?" del header
 * Abre directamente el modal de ayuda
 */
    function initHeaderWhatCanAskButtons() {
        const headerBtn = document.getElementById('headerWhatCanAskBtn');
        const headerBtnMobile = document.getElementById('headerWhatCanAskBtnMobile');
        const whatCanIAskModal = document.getElementById('whatCanIAskModal');

        if (!whatCanIAskModal) {
            console.warn('whatCanIAskModal not found');
            return;
        }

        // Handler que abre el modal "¿Qué puedo preguntar?"
        const openWhatCanAskModal = function (e) {
            e.preventDefault();
            e.stopPropagation();
            showInfoModal(whatCanIAskModal);
        };


        // Asignar eventos al botón desktop
        if (headerBtn) {
            headerBtn.addEventListener('click', openWhatCanAskModal);
        }

        // Asignar eventos al botón mobile
        if (headerBtnMobile) {
            headerBtnMobile.addEventListener('click', openHelpModal);
        }
    }

    // Auto-inicializar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initHeaderWhatCanAskButtons);
    } else {
        initHeaderWhatCanAskButtons();
    }


});
