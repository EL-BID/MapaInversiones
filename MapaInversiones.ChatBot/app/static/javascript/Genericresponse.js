/**
 * ============================================
 * MEJORAS PARA RESPUESTA GENÉRICA DEL CHATBOT
 * MapaInversiones República Dominicana
 * ============================================
 * 
 * Este snippet detecta cuando el bot responde con la guía
 * "¿Qué puedo consultar?" y mejora su estructura HTML
 * para una mejor presentación visual.
 * 
 * INSTRUCCIONES DE USO:
 * 1. Incluir este código al final de events.js
 * 2. O crear un archivo separado y cargarlo después de events.js
 */

(function() {
    'use strict';

    /**
     * Lista de íconos para cada tipo de elemento consultable
     */
    const ICONOS_ELEMENTOS = {
        'nombre': { emoji: '🎯', label: 'Nombre y objetivo' },
        'objetivo': { emoji: '🎯', label: 'Nombre y objetivo' },
        'estado': { emoji: '📊', label: 'Estado actual' },
        'activo': { emoji: '📊', label: 'Estado actual' },
        'fecha': { emoji: '📅', label: 'Fechas' },
        'inicio': { emoji: '📅', label: 'Fechas' },
        'finalizacion': { emoji: '📅', label: 'Fechas' },
        'finalización': { emoji: '📅', label: 'Fechas' },
        'duracion': { emoji: '⏱️', label: 'Duración' },
        'duración': { emoji: '⏱️', label: 'Duración' },
        'monto': { emoji: '💰', label: 'Monto' },
        'presupuesto': { emoji: '💰', label: 'Presupuesto' },
        'sector': { emoji: '🏢', label: 'Sector' },
        'educacion': { emoji: '🎓', label: 'Educación' },
        'educación': { emoji: '🎓', label: 'Educación' },
        'salud': { emoji: '🏥', label: 'Salud' },
        'transporte': { emoji: '🚌', label: 'Transporte' },
        'entidad': { emoji: '🏛️', label: 'Entidad' },
        'ministerio': { emoji: '🏛️', label: 'Ministerio' },
        'institucion': { emoji: '🏛️', label: 'Institución' },
        'institución': { emoji: '🏛️', label: 'Institución' }
    };

    /**
     * Detecta si un mensaje es una respuesta de tipo "guía"
     * @param {HTMLElement} messageContent - Elemento .message-content
     * @returns {boolean}
     */
    function esRespuestaGuia(messageContent) {
        if (!messageContent) return false;
        
        const texto = messageContent.textContent.toLowerCase();
        const tieneListaRespuesta = messageContent.querySelector('.respuesta-lista');
        
        // Detectar patrones típicos de respuesta de guía
        const patrones = [
            'qué puedo consultar',
            'que puedo consultar',
            'qué podés consultar',
            'que podes consultar',
            'qué información está disponible',
            'tenés acceso a',
            'tenes acceso a',
            'datos públicos sobre proyectos',
            'proyectos de inversión pública'
        ];
        
        const coincidePatron = patrones.some(p => texto.includes(p));
        
        return coincidePatron && tieneListaRespuesta;
    }

    /**
     * Obtiene el ícono apropiado para un texto de elemento
     * @param {string} texto - Texto del elemento
     * @returns {object} Objeto con emoji y label
     */
    function obtenerIcono(texto) {
        const textoLower = texto.toLowerCase();
        
        for (const [clave, valor] of Object.entries(ICONOS_ELEMENTOS)) {
            if (textoLower.includes(clave)) {
                return valor;
            }
        }
        
        // Icono por defecto
        return { emoji: '✓', label: 'Elemento' };
    }

    /**
     * Mejora la estructura HTML de los elementos de la lista
     * @param {HTMLElement} lista - Elemento ul.respuesta-lista
     */
    function mejorarListaElementos(lista) {
        if (!lista) return;
        
        const elementos = lista.querySelectorAll('.respuesta-lista-elemento');
        
        elementos.forEach((elemento, index) => {
            // Evitar procesar dos veces
            if (elemento.classList.contains('mejorado')) return;
            
            const textoOriginal = elemento.innerHTML;
            const icono = obtenerIcono(textoOriginal);
            
            // Crear estructura mejorada
            const wrapper = document.createElement('div');
            wrapper.className = 'item-wrapper';
            
            // Separar el texto principal de la descripción (si hay paréntesis)
            const matchParentesis = textoOriginal.match(/^(.+?)(\s*\(.*\))$/);
            
            if (matchParentesis) {
                elemento.innerHTML = `
                    <span class="item-emoji">${icono.emoji}</span>
                    <span class="item-texto">
                        <strong>${matchParentesis[1].trim()}</strong>
                        <span class="item-detalle">${matchParentesis[2].trim()}</span>
                    </span>
                `;
            } else {
                elemento.innerHTML = `
                    <span class="item-emoji">${icono.emoji}</span>
                    <span class="item-texto">${textoOriginal}</span>
                `;
            }
            
            elemento.classList.add('mejorado', 'has-emoji');
            
            // Añadir delay de animación
            elemento.style.animationDelay = `${index * 0.05}s`;
        });
    }

    /**
     * Mejora el contenido del mensaje de guía
     * @param {HTMLElement} messageContent - Elemento .message-content
     */
    function mejorarRespuestaGuia(messageContent) {
        if (!messageContent || messageContent.classList.contains('guia-mejorada')) return;
        
        // Marcar como procesado
        messageContent.classList.add('guia-mejorada', 'es-respuesta-guia');
        
        // Mejorar la lista de elementos
        const lista = messageContent.querySelector('.respuesta-lista');
        if (lista) {
            mejorarListaElementos(lista);
        }
        
        // Opcional: Envolver secciones en contenedores
        const h2Elements = messageContent.querySelectorAll('h2');
        h2Elements.forEach((h2, index) => {
            // Añadir clase para identificar
            h2.classList.add(`titulo-seccion-${index + 1}`);
        });
        
        console.log('[GUIA] Respuesta de guía mejorada correctamente');
    }

    /**
     * Observer para detectar nuevos mensajes del asistente
     */
    function iniciarObservador() {
        const chatMessages = document.getElementById('chatMessages');
        if (!chatMessages) {
            console.warn('[GUIA] No se encontró el contenedor de mensajes');
            return;
        }

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // Buscar mensajes del asistente
                        const mensajesAsistente = node.classList?.contains('message') && node.classList?.contains('assistant')
                            ? [node]
                            : node.querySelectorAll?.('.message.assistant') || [];
                        
                        mensajesAsistente.forEach((mensaje) => {
                            const messageContent = mensaje.querySelector('.message-content');
                            if (messageContent && esRespuestaGuia(messageContent)) {
                                // Pequeño delay para asegurar que el contenido esté renderizado
                                setTimeout(() => {
                                    mejorarRespuestaGuia(messageContent);
                                }, 100);
                            }
                        });
                    }
                });
            });
        });

        observer.observe(chatMessages, {
            childList: true,
            subtree: true
        });

        console.log('[GUIA] Observer de respuestas iniciado');
    }

    /**
     * Procesar mensajes existentes al cargar
     */
    function procesarMensajesExistentes() {
        const mensajes = document.querySelectorAll('.message.assistant .message-content');
        mensajes.forEach((messageContent) => {
            if (esRespuestaGuia(messageContent)) {
                mejorarRespuestaGuia(messageContent);
            }
        });
    }

    /**
     * Inicialización
     */
    function init() {
        // Esperar a que el DOM esté listo
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                procesarMensajesExistentes();
                iniciarObservador();
            });
        } else {
            procesarMensajesExistentes();
            iniciarObservador();
        }
    }

    // Iniciar
    init();

    // Exponer funciones para uso externo si es necesario
    window.GuiaMejorada = {
        mejorarRespuestaGuia,
        esRespuestaGuia,
        procesarMensajesExistentes
    };

})();
