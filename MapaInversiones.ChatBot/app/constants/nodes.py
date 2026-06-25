IRRELEVANT_QUESTION_MSG = (
    "Lo siento, no tengo datos sobre ese tema.<br>"
    "Pregúnteme algo relacionado con la <strong>inversión pública</strong>.<br>"
    "Ejemplos: “¿Cuánto se invierte en educación?” · “Top 5 entidades con mayor gasto?”.<br>"
    "¿Sobre qué información gubernamental de proyectos de inversión le gustaría conocer?"
)

GREETING_MESSAGE = (
    "¡Hola! 👋 Soy su asistente de <strong>MapaInversiones Republica Dominicana</strong>.<br>"
    "Puede consultarme <em>montos</em>, <em>número de proyectos</em> o <em>top de sectores</em>.<br>"
    "¿Qué dato desea explorar hoy?"
)


SUPPORT_RESPONSE_HND = (
    "¿Tienes que <strong>denunciar</strong> una compra sospechosa, "
    "pedir <strong>información</strong> o contactar a las oficinas de obras públicas "
    "en Honduras? Aquí están los canales oficiales:<br><br>"
    "<strong>Denuncias – ONCAE</strong><br>"
    "Tel.: +504 2221‑6123 ext. 312<br>"
    'Correo: <a target="_blank" href="mailto:info@oncae.gob.hn">info@oncae.gob.hn</a><br>'
    'Sitio: <a target="_blank" href="https://oncae.gob.hn">oncae.gob.hn</a><br><br>'
    "<strong>Línea anticorrupción – Tribunal Superior de Cuentas</strong><br>"
    "Tel.: +504 2228‑0813<br>"
    'Correo: <a target="_blank" href="mailto:denuncias@tsc.gob.hn">denuncias@tsc.gob.hn</a><br>'
    'Formulario: <a target="_blank" href="https://www.tsc.gob.hn/denuncias">tsc.gob.hn/denuncias</a><br><br>'
    "<strong>Secretaría de Infraestructura y Transporte</strong><br>"
    "Tel.: +504 2232‑0054<br>"
    'Correo: <a target="_blank" href="mailto:info@sit.gob.hn">info@sit.gob.hn</a><br>'
    "Dirección: Col. Humuya, Tegucigalpa"
)

SUPPORT_RESPONSE_PAN = (
    "¿Necesitas <strong>reportar</strong> un problema, "
    "hacer una <strong>consulta</strong> o buscar empleo en proyectos públicos de Panamá? "
    "Contacta a las siguientes entidades:<br><br>"
    "<strong>Denuncias – Dirección General de Contrataciones Públicas (DGCP)</strong><br>"
    "Tel.: +507 515‑1580<br>"
    'Correo: <a target="_blank" href="mailto:denuncias@dgcp.gob.pa">denuncias@dgcp.gob.pa</a><br>'
    'Formulario: <a target="_blank" href="https://www.dgcp.gob.pa/denuncias/">dgcp.gob.pa/denuncias</a><br><br>'
    "<strong>Ministerio de Obras Públicas (MOP)</strong><br>"
    "Tel.: +507 276‑0000<br>"
    'Correo: <a target="_blank" href="mailto:atencion@mop.gob.pa">atencion@mop.gob.pa</a><br>'
    "Dirección: Ave. Ascanio Villalaz, Ancón, Ciudad de Panamá"
)

SUPPORT_RESPONSE_PRY = (
    "Para <strong>denunciar irregularidades</strong>, solicitar datos o contactar al área de "
    "obras públicas en Paraguay, usa estos medios oficiales:<br><br>"
    "<strong>Denuncias – Dirección Nacional de Contrataciones Públicas (DNCP)</strong><br>"
    "Tel.: +595 21 419‑8000<br>"
    'Correo: <a target="_blank" href="mailto:denuncias@dncp.gov.py">denuncias@dncp.gov.py</a><br>'
    'Sitio: <a target="_blank" href="https://www.contrataciones.gov.py">contrataciones.gov.py</a><br><br>'
    "<strong>Ministerio de Obras Públicas y Comunicaciones (MOPC)</strong><br>"
    "Tel.: +595 21 414‑9000<br>"
    'Correo: <a target="_blank" href="mailto:info@mopc.gov.py">info@mopc.gov.py</a><br>'
    "Dirección: Oliva esq. Alberdi, Asunción"
)

SUPPORT_RESPONSE_DOM = (
    "Si deseas <strong>denunciar</strong> un proceso, obtener <strong>información</strong> "
    "o contactar a las autoridades del <strong>Ministerio de Hacienda y Economía</strong> "
    "de la República Dominicana, estos son los canales oficiales:<br><br>"
    "<strong>Ministerio de Hacienda y Economía</strong><br>"
    "Tel.: +1 809-687-5131<br>"
    'Correo: <a target="_blank" href="mailto:infomapainversiones@hacienda.gov.do">infomapainversiones@hacienda.gov.do</a><br>'
    'Presentación de queja o denuncia: <a target="_blank" href="https://www.hacienda.gob.do/formulario-accion-denuncia/">hacienda.gob.do/formulario-accion-denuncia</a><br>'
    "Dirección: Avenida México #45, Gascue, Santo Domingo, D.N., República Dominicana"
)

# ─────────────────────────────────────────────
# Mensajes de seguridad y moderación
# ─────────────────────────────────────────────

SAFE_RESPONSE = (
    "Parece que su mensaje incluye información personal o sensible. "
    "Por razones de privacidad, no puedo procesarlo directamente. "
    "Si lo desea, puede reformular su pregunta sin datos personales y con gusto le ayudo."
)

MISSING_DATA_ERROR = (
    "Faltan algunos datos necesarios para generar la consulta SQL. "
    "Por favor, proporcione mayor información para poder procesar correctamente su solicitud."
)

NO_DATA_RESPONSE = "Resultados: no_data\nTotal de Filas: 0"


MIN_WORD_COUNT_FOR_SUMMARY = 10

HELP_TEXT_HND = (
    "👋 <strong>Cómo aprovechar los datos de Honduras</strong><br><br>"
    "• Pide el <em>número</em> o el <em>monto total</em> de proyectos; por ejemplo: “¿Cuánto se invierte en salud?”.<br>"
    "• Filtra por <strong>sector</strong>, <strong>entidad ejecutora</strong> o <strong>año</strong> para acotar resultados.<br>"
    "• Pregunta por un <strong>departamento</strong> concreto para ver inversiones locales.<br>"
    "• Solicita comparaciones, por ejemplo: “Top 3 sectores con mayor inversión”."
)

HELP_TEXT_PAN = (
    "👋 <strong>Ideas para explorar los datos de Panamá</strong><br><br>"
    "• Consulta cuántos proyectos hay en un <strong>sector</strong> y su inversión total.<br>"
    "• Pregunta por proyectos de un <strong>año</strong> específico.<br>"
    "• Pide rankings, por ejemplo: “Top 5 proyectos de mayor monto”.<br>"
    "• Usa filtros como <em>tipo de proyecto</em> o <em>estado</em> para afinar la búsqueda."
)

HELP_TEXT_PRY = (
    "👋 <strong>Tips para descubrir los datos de Paraguay</strong><br><br>"
    "• Pregunta por el <strong>monto total</strong> invertido en un sector (ej.: educación).<br>"
    "• Filtra por <strong>departamento</strong> o <strong>región</strong> para ver proyectos locales.<br>"
    "• Solicita el <em>avance financiero promedio</em> o la <em>duración media</em> de los proyectos.<br>"
    "• Pide comparativas, por ejemplo: “Top 3 territorios con menor inversión”."
)

HELP_TEXT_DOM = (
    "<strong>Guía rápida para la República Dominicana</strong><br><br>"
    "• Consulta el <strong>número</strong> o <strong>monto</strong> de proyectos en un sector dado.<br>"
    "• Pregunta por las <strong>fuentes de financiamiento</strong> o los <strong>organismos</strong> con mayor aporte.<br>"
    "• Filtra por <strong>región</strong> o <strong>estado</strong> del proyecto (aprobado, ejecución, etc.).<br>"
    "• Pide rankings, por ejemplo: “Top 3 sectores con mayor inversión”."
)


# Fallback genérico de ayuda
HELP_TEXT_DEFAULT = (
    "<strong>Guía rápida de MapaInversiones Republica Dominicana</strong><br><br>"
    "• Elija su país y formule la pregunta en lenguaje natural.<br>"
    "• Use filtros como <em>sector</em>, <em>entidad ejecutora</em>, <em>territorio</em> o <em>fuente de financiamiento</em>.<br>"
    "• Ejemplos: “¿Cuántos proyectos de salud hay?”  ·  “Ver estadísticas”.<br>"
    "• Escriba Nuevo chat para empezar de cero."
)
