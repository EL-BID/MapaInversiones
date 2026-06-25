// ================================================
// CONFIGURACIÓN CENTRALIZADA - DISCLAIMER IA
// ================================================


const DISCLAIMER_CONFIG = {
    // Mensaje corto para el Welcome Hero
    heroMessage: "Soy una herramienta de IA en mejora continua. A veces puedo cometer errores.",
    
    // Mensaje largo para el área de chat (incluye recomendación de verificación)
    chatMessage: "Soy una herramienta de IA en mejora continua. A veces puedo cometer errores.",
    
    // Icono SVG compartido (tamaño configurable vía CSS)
    icon: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="16" x2="12" y2="12"></line>
        <line x1="12" y1="8" x2="12.01" y2="8"></line>
    </svg>`
};

/**
 * Inicializa los disclaimers dinámicamente.
 * Busca elementos con los IDs específicos y actualiza su contenido.
 */
function initDisclaimers() {
    // Actualizar disclaimer del Hero
    const heroDisclaimerText = document.getElementById('heroDisclaimerText');
    if (heroDisclaimerText) {
        heroDisclaimerText.textContent = DISCLAIMER_CONFIG.heroMessage;
    }
    
    // Actualizar disclaimer del Chat Input
    const chatDisclaimerText = document.getElementById('chatDisclaimerText');
    if (chatDisclaimerText) {
        chatDisclaimerText.textContent = DISCLAIMER_CONFIG.chatMessage;
    }
}

/**
 * Genera el HTML completo del disclaimer para el Welcome Hero.
 * Usado cuando se recrea el hero dinámicamente.
 * @returns {string} HTML del disclaimer
 */
function getHeroDisclaimerHTML() {
    return `
        <div class="chat-disclaimer">
            ${DISCLAIMER_CONFIG.icon}
            <span id="heroDisclaimerText">${DISCLAIMER_CONFIG.heroMessage}</span>
        </div>`;
}

/**
 * Genera el HTML completo del disclaimer para el Chat Input.
 * @returns {string} HTML del disclaimer
 */
function getChatDisclaimerHTML() {
    return `
        <div class="chat-disclaimer">
            ${DISCLAIMER_CONFIG.icon}
            <span id="chatDisclaimerText">${DISCLAIMER_CONFIG.chatMessage}</span>
        </div>`;
}

// Auto-inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDisclaimers);
} else {
    initDisclaimers();
}
