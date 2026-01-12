const SSO_CONFIG = { //datos de configuracion servidor GAB AUTH, solicitar a la alcaldia
    client_id: '',
    server_url: '',
    redirect_uri: window.location.origin + '',
    scope: '',
    authorization_endpoint: '',
    response_type: ''
};

// ===============================
// AUTENTICACIÓN GAB (PKCE + jQuery)
// ===============================

// 1. Generar code_verifier y code_challenge
function generateCodeVerifier(length = 64) {
    const array = new Uint8Array(length);
    window.crypto.getRandomValues(array);
    return base64UrlEncode(array);
}

function base64UrlEncode(buffer) {
    let str = btoa(String.fromCharCode.apply(null, buffer));
    return str.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function generateCodeChallenge(verifier) {
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    return window.crypto.subtle.digest('SHA-256', data).then(buffer => base64UrlEncode(new Uint8Array(buffer)));
}

// 2. Iniciar login (redirige al servidor GAB)
function iniciarLogin() {
   // console.log('→ Iniciando login...');

    const codeVerifier = generateCodeVerifier();
    localStorage.setItem('pkce_verifier', codeVerifier);
    localStorage.setItem('origen', window.location.href);
    generateCodeChallenge(codeVerifier)
        .then(codeChallenge => {
            const params = new URLSearchParams({
                response_type: SSO_CONFIG.response_type,
                client_id: SSO_CONFIG.client_id,
                redirect_uri: SSO_CONFIG.redirect_uri,
                scope: SSO_CONFIG.scope,
                code_challenge: codeChallenge,
                code_challenge_method: 'S256'
            });

            const url = `${SSO_CONFIG.server_url}${SSO_CONFIG.authorization_endpoint}?${params}`;
            // console.log('Redirigiendo a:', url);
            window.location.href = url;
        })
        .catch(err => console.error('❌ Error en generateCodeChallenge:', err));
}


function iniciarLoginBody(idboton) {

    const section = $('#' + idboton).closest('section');
    if (section.length) {
        const sectionId = section.attr('id');
        localStorage.setItem('section', sectionId);
    }

    iniciarLogin()
}
// 3. Callback: intercambia el "code" por tokens (via backend)
function procesarCallback() {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const verifier = localStorage.getItem('pkce_verifier');
    const origen = localStorage.getItem('origen');
    const section = localStorage.getItem('section');
    if (!code || !verifier) return;

    const payload = {
        code: code,
        verifier: verifier
    };

    $.ajax({
        url: '/auth/intercambiarcodigo',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(payload),
        success: function (resp) {
            console.log('✅ Tokens procesados correctamente:', resp);
            localStorage.setItem('access_token', resp.access_token);
            localStorage.setItem('id_token', resp.id_token);
            window.location.href = section != null && section != "" ? origen.split('#')[0] +"#"+ section : origen;  
        },
        error: function (xhr) {
            console.error('❌ Error al procesar código:', xhr.responseText);
            document.body.innerHTML = "<h3>Error autenticando usuario:</h3><pre>" + xhr.responseText + "</pre>";
        }
    });
}

//// 4. Consultar información del usuario autenticado
//function obtenerInfoUsuario() {
//    $.ajax({
//        url: '/auth/obtenerusuario',
//        success: function (data) {
//            console.log('Usuario autenticado:', data);
//            $('#nombreUsuario').text(data.name || data.fullName || 'Usuario sin nombre');
//        },
//        error: function () {
//            console.warn('No se pudo obtener la información del usuario');
//        }
//    });
//}

// 5. Logout
function cerrarSesion() {
    localStorage.clear();
    $('#btnLoginGab').show();
    $('#btnLoginGabH').show();
    $('#btnLogoutGab').hide();
    $('#btnUserGab').show();
    $('#btnUserGabH').show();
    $('#nombreUsuario').hide()
    //$.get('/auth/logout', () => window.location.href = window.location.href);

    $.ajax({
        url: '/auth/logout',
        type: 'GET',
        success: function () {
            console.log('✅ Sesión del servidor eliminada');

            // (Opcional) mostrar un mensaje
            console.log('🔒 Sesión cerrada completamente');
        },
        error: function (xhr) {
            console.error('❌ Error cerrando sesión:', xhr.responseText);
        }
    });
}

// 6. Eventos
$(document).ready(function () {
    $('#btnLoginGab').click(function () {
        iniciarLoginBody(this.id);
    });
    $('#btnLoginGabH').click(iniciarLogin);
    $('#btnLogoutGab').click(cerrarSesion);
    $('#btnLogoutGabH').click(cerrarSesion);
    actualizarEstadoSesion();

});


// Función para actualizar visibilidad de botones
function actualizarEstadoSesion() {
    const token = localStorage.getItem('access_token');
    if (isTokenValid(token) && $("#userName").val()!="") {
        $('#btnLoginGab').hide();
        $('#btnLoginGabH').hide();
        $('#btnLogoutGab').show();
        $('#btnUserGab').hide();
        $('#btnUserGabH').hide();
        $('#nombreUsuario').show();
    } else {
        if (token != null && !(isTokenValid(token)) ){
            cerrarSesion()
            alert("Sesión Finalizada por Tiempo");
        }

    }
    
}

function isTokenValid(token) {
    if (!token) return false;
    const payload = JSON.parse(atob(token.split('.')[1]));
    const now = Date.now() / 1000; // en segundos
    return payload.exp > now;
}
