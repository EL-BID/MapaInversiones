# Glosario SNIP — Fuente para LLM

> Formato diseñado para ingestion por modelos LLM: un bloque por término, con campos consistentes.

---

## Catálogos de Valores de la Base de Datos (República Dominicana)

> Esta sección contiene los valores válidos para los campos de catálogo en la base de datos.
> Usar estos valores exactos al filtrar o interpretar consultas de usuarios.

### Estado del Proyecto (`estado_proyecto`)
Valores válidos para el estado actual de un proyecto:
- **APROBADO**: Proyecto aprobado pero aún no iniciada la ejecución
- **EJECUCIÓN**: Proyecto actualmente en ejecución (sinónimos: "activo", "en curso", "ejecutándose")
- **PARALIZADO**: Proyecto detenido temporalmente
- **FINALIZADO**: Proyecto que completó su ejecución
- **CANCELADO**: Proyecto que se decidió no ejecutar o se detuvo de forma definitiva

Ejemplos de interpretación:
- Si el usuario pregunta "¿Cuántos proyectos están en curso?", eso corresponde a estado **EJECUCIÓN**.
- Si el usuario dice "proyectos terminados" o "proyectos completados", se puede mapear a **FINALIZADO**.

> Nota importante: No confundir "EJECUTADO" (como monto financiero ejecutado) con estado **EJECUCIÓN**.

### ⚠️ DIFERENCIA CRÍTICA: "Ejecutado" vs "Finalizado"
En el contexto de la base de datos y de SNIP:
- **"Monto ejecutado"** se refiere al dinero ya gastado dentro de un proyecto, independiente de si el proyecto sigue en ejecución o no.
- **"Proyecto finalizado"** se refiere a que el proyecto ya terminó todas sus actividades, según su planificación.

Ejemplos:
- Un proyecto puede estar en estado **EJECUCIÓN** pero tener un **monto ejecutado alto** (por ejemplo, 80% del presupuesto gastado).
- Un proyecto en estado **FINALIZADO** usualmente tendrá montos ejecutados cercanos al valor del proyecto, pero puede haber diferencias (ahorros, subejecución, etc.).

> Regla para el modelo: cuando el usuario diga "ejecutado" hay que distinguir:
> - "montos ejecutados" → se refiere a valores financieros (campo `valor_ejecutado`).
> - "proyectos ejecutados" → puede ser ambiguo; preferir clarificar si se refiere a proyectos en **EJECUCIÓN** o proyectos **FINALIZADOS**.

---

### Provincias de República Dominicana (`nombre_departamento`)

Lista de provincias que pueden aparecer en los datos como `nombre_departamento`:

- AZUA
- BAORUCO
- BARAHONA
- DAJABÓN
- DISTRITO NACIONAL
- DUARTE
- ELÍAS PIÑA
- EL SEIBO
- ESPAILLAT
- HATO MAYOR
- HERMANAS MIRABAL
- INDEPENDENCIA
- LA ALTAGRACIA
- LA ROMANA
- LA VEGA
- MARÍA TRINIDAD SÁNCHEZ
- MONSEÑOR NOUEL
- MONTE CRISTI
- MONTE PLATA
- PEDERNALES
- PERAVIA
- PUERTO PLATA
- SÁNCHEZ RAMÍREZ
- SAN CRISTÓBAL
- SAN JOSÉ DE OCOA
- SAN JUAN
- SAN PEDRO DE MACORÍS
- SANTIAGO
- SANTIAGO RODRÍGUEZ
- SANTO DOMINGO
- VALVERDE
- SAMANÁ

> Regla de mapeo: en algunos contextos se puede usar "provincia" para `nombre_departamento`.
> Ejemplo: "proyectos por provincia de Azua" → filtrar por `nombre_departamento = 'AZUA'`.

---

### Regiones de República Dominicana (`nombre_region`)

Valores válidos para `nombre_region`:

- **REGION CIBAO NORTE**: Espaillat, Puerto Plata, Santiago
- **REGION CIBAO SUR**: La Vega, Monseñor Nouel, Sánchez Ramírez
- **REGION CIBAO NOROESTE**: Dajabón, Monte Cristi, Santiago Rodríguez, Valverde
- **REGION CIBAO NORDESTE**: Duarte, Hermanas Mirabal, María Trinidad Sánchez, Samaná
- **REGION VALDESIA**: Peravia, San Cristóbal, San José de Ocoa
- **REGION ENRIQUILLO**: Baoruco, Barahona, Independencia, Pedernales
- **REGION EL VALLE**: Azua, San Juan, Elías Piña
- **REGION HIGUAMO**: Hato Mayor, Monte Plata, San Pedro de Macorís
- **REGION YUMA**: El Seibo, La Altagracia, La Romana
- **REGION OZAMA O METROPOLITANA**: Distrito Nacional, Santo Domingo

> **Regla de negocio**: Cuando el usuario dice "Región Sur", puede estar refiriéndose a provincias de varias regiones oficiales (por ejemplo, REGIÓN EL VALLE, REGIÓN ENRIQUILLO o REGIÓN VALDESIA). Pedir clarificación o usar OR.

---

### Sectores de Proyectos (`nombresector_proyecto`)
Clasificación sectorial de los proyectos:
- ACTIVIDADES DEPORTIVAS, RECREATIVAS, CULTURALES Y RELIGIOSAS
- ADMINISTRACIÓN GENERAL
- AGROPECUARIA, CAZA, PESCA Y SILVICULTURA
- ASUNTOS ECONÓMICOS, COMERCIALES Y LABORALES
- CAMBIO CLIMÁTICO
- CIENCIA Y TECNOLOGÍA
- COMUNICACIONES
- COMUNICACIONES Y TRANSPORTE
- CULTURA Y DEPORTE
- DEFENSA
- DESARROLLO Y ORDENAMIENTO TERRITORIAL
- EDUCACIÓN
- ENERGÍA Y COMBUSTIBLES
- JUSTICIA
- MULTISECTORIAL
- OTROS SECTORES
- POLÍTICA EXTERIOR
- PROTECCIÓN Y ASISTENCIA SOCIAL
- RECREACIÓN, CULTURA Y RELIGIÓN
- SALUD
- SERVICIOS GENERALES
- SERVICIOS PÚBLICOS
- SEGURIDAD CIUDADANA Y ORDEN PÚBLICO
- SEGURIDAD Y DEFENSA
- TRABAJO
- TRANSPORTE
- VIVIENDA Y SERVICIOS COMUNITARIOS

> Regla para el modelo: si el usuario menciona "sector salud", "sector educación", "sector transporte", etc., mapear directamente a este campo `nombresector_proyecto`.

---

### Tipo de Proyecto (`tipo_proyecto`)

Posibles valores de tipo de proyecto:
- **NUEVO**: Proyecto que se incorpora por primera vez al sistema.
- **REHABILITACIÓN / AMPLIACIÓN**: Proyecto que amplía o mejora infraestructura existente.
- **CONTINUIDAD**: Proyecto que ya venía en ejecución en años anteriores.
- **OTRO**: Cualquier otro tipo no clasificado en las categorías anteriores.

> Esta variable puede variar según país/sistema. Verificar siempre contra la tabla fuente.

---

### Organismos Financiadores (`organismo_financiador`)

Lista de organismos que pueden financiar proyectos (ejemplos comunes):
- BANCO INTERAMERICANO DE DESARROLLO (BID)
- BANCO MUNDIAL (BM)
- BANCO CENTROAMERICANO DE INTEGRACIÓN ECONÓMICA (BCIE)
- GOBIERNO CENTRAL
- RECURSOS PROPIOS
- OTROS ORGANISMOS INTERNACIONALES

> El campo `organismo_financiador` puede tener diferencias de escritura (mayúsculas, tildes).
> Regla: normalizar a mayúsculas y comparar por igualdad exacta en mayúsculas.

---

### Regla B1: Identificación de Proyectos (CÓDIGO SNIP vs ID)

En los datos se usan varias claves para identificar proyectos:
- `id_proyecto`: identificador numérico interno del proyecto.
- `codigo_snip`: código oficial SNIP, puede ser alfanumérico.

Reglas:
- Si el usuario menciona "código SNIP" o "código de proyecto", preferir buscar en `codigo_snip`.
- Si menciona "ID del proyecto" o "identificador interno", buscar en `id_proyecto`.

Ejemplos:
- "Proyecto con código SNIP 1234-AB" → `codigo_snip = '1234-AB'`
- "Proyecto con ID 456" → `id_proyecto = 456`

---

### Regla B2: Tipos de Montos/Valores

En la base de datos hay varios campos de montos:

- `valor_proyecto`: monto total aprobado para el proyecto.
- `valor_vigente`: monto vigente después de modificaciones presupuestarias.
- `valor_ejecutado`: monto efectivamente gastado.

Reglas para interpretación:
- Si el usuario pregunta "¿Cuánto cuesta el proyecto?", por defecto usar `valor_proyecto`.
- Si el usuario pregunta "¿Cuánto se ha gastado?", usar `valor_ejecutado`.
- Si pregunta "¿Cuál es el presupuesto vigente?", usar `valor_vigente`.

> Regla de negocio: dejar claro en la respuesta qué tipo de monto se está mostrando.

---

### Regla B3: Terminología Territorial (Provincia vs Departamento)

En algunos países se usa "departamento" donde en el lenguaje común se dice "provincia".

Regla:
- Cuando el usuario hable de "provincias" en República Dominicana, se puede mapear al campo `nombre_departamento`.

Ejemplos:
- "Proyectos por provincia de Azua" → filtro `nombre_departamento = 'AZUA'`
- "Inversión por provincia" → agrupar por `nombre_departamento`.

---

### Regla B4: Rango Temporal de Proyectos

Campos relevantes:
- `fechainicio_proyecto` / `anio_fechainicio_proyecto`
- `fechafin_proyecto` / `anio_fechafin_proyecto`

Reglas:
- Un proyecto pertenece a un año “X” si el año X está entre el año de inicio y el año de fin (inclusive).
- Para preguntas tipo "proyectos en 2025", filtrar proyectos tales que:
  - `anio_fechainicio_proyecto <= 2025`
  - `anio_fechafin_proyecto >= 2025`

---

### Regla B5: Proyectos Multi-Territorio

Un mismo proyecto puede estar asociado a múltiples territorios (municipios, provincias, regiones).

Reglas:
- En tablas de territorios (`stg_mapainv_proyectosterritorios`), un `id_proyecto` puede aparecer varias veces, una por territorio.
- Al contar proyectos por territorio, puede haber doble conteo si se suman múltiples niveles territoriales sin cuidado.

Recomendaciones:
- Para conteo de proyectos: usar `COUNT(DISTINCT id_proyecto)` en lugar de `COUNT(*)`.
- Para sumas de montos (si están desnormalizados a nivel de territorio): revisar si el monto se repite por fila; si es así, agregar con cuidado para no duplicar montos.

---

### Fecha de Corte de datos y actualizacion:

La **fecha de corte** es la fecha hasta la cual los datos han sido actualizados en el sistema fuente.

- Se almacena en una tabla de metadatos y se sincroniza hacia un campo visible para el frontend.
- Usar esta fecha para responder preguntas como:
  - "¿Hasta qué fecha están actualizados los datos?"
  - "¿La información incluye el año 2024?"

Regla:
- Siempre aclarar en las respuestas que las cifras mostradas están actualizadas **hasta la fecha de corte**.

---

### stg_mapainv_proyectosaprobadosinv

Tabla staging principal de proyectos aprobados de inversión.

Campos clave (ejemplos):
- `id_proyecto`: ID interno del proyecto.
- `codigo_snip`: código SNIP oficial.
- `nombre_proyecto`: nombre del proyecto.
- `objetivo_proyecto`: resumen del objetivo general.
- `estado_proyecto`: estado (APROBADO, EJECUCIÓN, PARALIZADO, FINALIZADO, etc.).
- `fechainicio_proyecto` / `anio_fechainicio_proyecto`
- `fechafin_proyecto` / `anio_fechafin_proyecto`
- `duracion_proyecto`: duración estimada del proyecto.
- `valor_proyecto`: monto total del proyecto.
- `nombresector_proyecto`: sector al que pertenece.
- `nombreentidadejecutora_proyecto`: entidad que ejecuta el proyecto.
- `tipo_proyecto`: tipo (nuevo, ampliación, etc.).
- `pais_iso3`, `pais_nombre`
- `url_link_proyecto`: vínculo a ficha pública del proyecto.

---

### stg_mapainv_proyectosterritorios

Tabla staging con la relación proyecto–territorios.

Campos clave:
- `id_proyecto`
- `id_region`, `nombre_region`
- `id_departamento`, `nombre_departamento`
- `id_municipio`, `nombre_municipio`
- `pais_iso3`, `pais_nombre`

Uso:
- Permite filtrar y agrupar proyectos por territorio.
- Un mismo proyecto puede aparecer varias veces, una por cada territorio asociado.

---

### stg_mapainv_proyectosfuentesfinanciamiento

Tabla staging con las fuentes de financiamiento de cada proyecto.

Campos clave:
- `id_proyecto`
- `organismo_financiador`
- `fuente_financiacion`
- `valor_vigente`
- `valor_ejecutado`
- `anio_financiacion`
- `pais_iso3`, `pais_nombre`

---

### Fases del Ciclo SNIP

En el enfoque SNIP típico, el ciclo de vida de un proyecto de inversión pública se descompone en fases:

1. **Preinversión**  
   - Identificación y formulación de proyectos.  
   - Estudios de perfil, prefactibilidad y factibilidad.  
   - Evaluación socioeconómica.  
   - Análisis de alternativas y priorización.

2. **Inversión / Ejecución**  
   - Diseño definitivo.  
   - Licitación y contratación.  
   - Ejecución física y financiera (obras, adquisiciones, servicios).  
   - Supervisión y monitoreo.

3. **Operación / Funcionamiento**  
   - Puesta en marcha del proyecto.  
   - Operación, mantenimiento y sostenibilidad.  
   - Seguimiento de resultados y evaluación ex-post.

> Estas fases deben entenderse como partes de un ciclo continuo.  
> Preguntas tipo "¿En qué fase está el proyecto?" pueden mapearse a:
> - Preinversión
> - Inversión / Ejecución
> - Operación / Funcionamiento

---

### Órgano Rector

En el contexto del SNIP, el **órgano rector** es la institución responsable de:

- Definir las normas, metodologías y lineamientos para la inversión pública.
- Evaluar y declarar la viabilidad de los proyectos.
- Mantener y administrar el Banco de Proyectos.
- Monitorear y evaluar el desempeño del sistema de inversión pública.

En República Dominicana, el órgano rector del SNIP es el Ministerio de Economía, Planificación y Desarrollo (MEPyD) u organismo equivalente según la normativa vigente.

---

## Glosario oficial de términos SNIP (prioritario)

> Estas definiciones provienen del documento oficial de términos SNIP y deben considerarse la referencia principal cuando haya diferencias con otras descripciones en este documento.

### SNIP

**Definición oficial SNIP:** Conjunto de normas, instrucciones y procedimientos que tienen por finalidad asegurar que las inversiones que se realicen con recursos públicos se efectúen en proyectos convenientemente formulados y evaluados, de acuerdo a metodologías y parámetros técnicos que garanticen una adecuada utilización de los recursos escasos, contribuyendo así al desarrollo económico y social de la República Dominicana. (docs.republica-dominicana.justia.com)

**Sinónimos / términos relacionados:** Sistema Nacional de Inversión Pública; “sistema de inversión pública”

**Fuente:** https://mepyd.gob.do/snip/


### Inversión pública

**Definición oficial SNIP:** Uso de recursos públicos o todo gasto público de capital, destinado a crear, ampliar, mejorar o recuperar la capacidad productiva, de provisión de servicios o de conservación del patrimonio, mediante proyectos de inversión pública. Incluye los gastos de preinversión e inversión de las instituciones del sector público

**Sinónimos / términos relacionados:** inversión estatal, inversión del sector público

**Fuente:** https://mepyd.gob.do/snip/


### Proyecto de inversión pública

**Definición oficial SNIP:** Iniciativa concreta que demanda recursos públicos y que, mediante un conjunto de actividades coherentemente articuladas, busca resolver un problema específico o aprovechar una oportunidad de desarrollo en un territorio y población determinada, en un plazo definido, y que ha sido sometida al proceso del SNIP. (sismap.gob.do)

**Sinónimos / términos relacionados:** proyecto público, iniciativa de inversión

**Fuente:** https://mepyd.gob.do/snip/


### Manejo de la inversión pública

**Definición oficial SNIP:** La inversión pública se gestiona a través del SNIP, que define las reglas, procedimientos y responsabilidades para la identificación, formulación, evaluación, priorización, registro, ejecución y seguimiento de los proyectos financiados con recursos públicos.

**Sinónimos / términos relacionados:** gestion, administración

**Fuente:** https://mepyd.gob.do/snip/


### Ciclo de vida del proyecto

**Definición oficial SNIP:** Conjunto de procesos e instancias requeridas para que un proyecto de inversión pública pase desde su identificación hasta su operación y evaluación final. Incluye, al menos, fases de preinversión, inversión/ejecución y operación/funcionamiento.

**Sinónimos / términos relacionados:** ciclo de proyecto, etapas del proyecto, fases

**Fuente:** https://mepyd.gob.do/snip/


### Fase de preinversión

**Definición oficial SNIP:** Conjunto de estudios y análisis que permiten definir si una idea de proyecto es viable técnica, económica, social y ambientalmente. Incluye la identificación, formulación y evaluación de alternativas, así como la recomendación sobre si el proyecto debe ser ejecutado.

**Sinónimos / términos relacionados:** estudios de preinversión, prefactibilidad, factibilidad

**Fuente:** https://mepyd.gob.do/snip/


### Fase de inversión / ejecución

**Definición oficial SNIP:** Etapa del ciclo de proyecto en la cual se materializan las obras, adquisiciones y demás acciones previstas, utilizando los recursos aprobados. Implica la contratación, ejecución física y financiera, supervisión y control del proyecto.

**Sinónimos / términos relacionados:** ejecución del proyecto, fase de obra, implementación

**Fuente:** https://mepyd.gob.do/snip/


### Fase de operación / funcionamiento

**Definición oficial SNIP:** Etapa posterior a la ejecución, en la que el proyecto ya está en uso y presta los servicios o beneficios previstos. Incluye las actividades de operación, mantenimiento y seguimiento de resultados e impactos.

**Sinónimos / términos relacionados:** operación del proyecto, fase operativa, funcionamiento

**Fuente:** https://mepyd.gob.do/snip/


### Órgano rector

**Definición oficial SNIP:** Entidad del sector público responsable de conducir, normar y supervisar el funcionamiento del Sistema Nacional de Inversión Pública. Define metodologías, criterios y lineamientos, evalúa la calidad de los proyectos y vela por el uso eficiente de los recursos de inversión.

**Sinónimos / términos relacionados:** autoridad del SNIP, entidad rectora, ente rector

**Fuente:** https://mepyd.gob.do/snip/


### Normas técnicas del SNIP

**Definición oficial SNIP:** Conjunto de documentos emitidos por el órgano rector del SNIP que establecen los criterios, procesos, formatos y metodologías que deben seguirse para la formulación, evaluación, registro y seguimiento de los proyectos de inversión pública.

**Sinónimos / términos relacionados:** normativa SNIP, lineamientos técnicos, manuales de inversión pública

**Fuente:** https://mepyd.gob.do/snip/


### Banco de proyectos

**Definición oficial SNIP:** Registro oficial y sistemático de los proyectos de inversión pública que han sido formulados y, cuando corresponda, evaluados conforme a las normas del SNIP. Solo los proyectos inscritos en el banco de proyectos pueden ser considerados para financiamiento con recursos públicos de inversión.

**Sinónimos / términos relacionados:** registro de proyectos, cartera de proyectos, portafolio de proyectos

**Fuente:** https://mepyd.gob.do/snip/


### Plan Nacional Plurianual de Inversión del Sector Público (PNPIP)

**Definición oficial SNIP:** Instrumento de planificación que establece, en un horizonte multianual, la programación de los proyectos de inversión pública priorizados de acuerdo con la disponibilidad de recursos y las políticas de desarrollo del país.

**Sinónimos / términos relacionados:** plan plurianual de inversión, programación multianual de inversiones

**Fuente:** https://mepyd.gob.do/snip/


### Prioridad de proyectos

**Definición oficial SNIP:** Criterio o nivel asignado a los proyectos dentro del proceso de programación de la inversión pública, que refleja su importancia relativa en función de objetivos de desarrollo, urgencia, impacto y disponibilidad de recursos.

**Sinónimos / términos relacionados:** jerarquización de proyectos, ranking de proyectos

**Fuente:** https://mepyd.gob.do/snip/


### Viabilidad económica

**Definición oficial SNIP:** Condición que cumple un proyecto cuando, luego de los análisis costo-beneficio o costo-efectividad, se demuestra que los beneficios económicos y sociales esperados justifican el uso de los recursos públicos.

**Sinónimos / términos relacionados:** rentabilidad socioeconómica, conveniencia económica

**Fuente:** https://mepyd.gob.do/snip/


### Factibilidad técnica

**Definición oficial SNIP:** Grado en que un proyecto es técnicamente realizable, considerando aspectos de ingeniería, tecnología disponible, condiciones del terreno, normativas de construcción y otros factores que afectan su ejecución física.

**Sinónimos / términos relacionados:** viabilidad técnica, factibilidad de ingeniería

**Fuente:** https://mepyd.gob.do/snip/


### Beneficiarios

**Definición oficial SNIP:** Personas, grupos o unidades económicas que reciben de manera directa o indirecta los beneficios generados por un proyecto de inversión pública, ya sea en forma de servicios, ingresos, ahorros de costos u otros impactos positivos.

**Sinónimos / términos relacionados:** población objetivo, usuarios, destinatarios

**Fuente:** https://mepyd.gob.do/snip/


### Costo de oportunidad

**Definición oficial SNIP:** Valor de la mejor alternativa sacrificada al elegir destinar recursos públicos a un determinado proyecto y no a otro. En el análisis de inversiones públicas, representa el rendimiento que se deja de obtener por no asignar los recursos a la opción alternativa más conveniente.

**Sinónimos / términos relacionados:** costo alternativo, valor de la alternativa sacrificada

**Fuente:** https://mepyd.gob.do/snip/


### Operación y mantenimiento (O&M)

**Definición oficial SNIP:** Conjunto de actividades y gastos recurrentes necesarios para asegurar que la infraestructura o servicio generado por un proyecto de inversión pública funcione adecuadamente y mantenga su nivel de servicio a lo largo del tiempo.

**Sinónimos / términos relacionados:** gastos de operación, gastos de mantenimiento, costos operativos

**Fuente:** https://mepyd.gob.do/snip/


### Indicadores de resultado / impacto

**Definición oficial SNIP:** Medidas cuantitativas o cualitativas que permiten evaluar los cambios generados por un proyecto de inversión pública en la población o el territorio, en términos de mejoras en el bienestar, productividad, acceso a servicios u otros efectos relevantes.

**Sinónimos / términos relacionados:** indicadores de desempeño, métricas de impacto, indicadores de resultados

**Fuente:** https://mepyd.gob.do/snip/


### Unidad ejecutora

**Definición oficial SNIP:** Entidad o dependencia responsable de la ejecución física y financiera de un proyecto de inversión pública, incluyendo la gestión de contratos, supervisión de obras y administración de los recursos asignados.

**Sinónimos / términos relacionados:** organismo ejecutor, entidad ejecutora, responsable de ejecución

**Fuente:** https://mepyd.gob.do/snip/


### Financiamiento

**Definición oficial SNIP:** Conjunto de recursos económicos que se destinan a la ejecución de un proyecto de inversión pública, provenientes de fuentes internas o externas, reembolsables o no reembolsables.

**Sinónimos / términos relacionados:** recursos financieros, fuentes de recursos, esquema de financiamiento

**Fuente:** https://mepyd.gob.do/snip/


### Presupuesto de inversión

**Definición oficial SNIP:** Asignación anual o plurianual de recursos públicos destinada a la ejecución de proyectos de inversión, registrada en el presupuesto del sector público.

**Sinónimos / términos relacionados:** presupuesto de capital, asignación de inversión, crédito presupuestario de inversión

**Fuente:** https://mepyd.gob.do/snip/


### Ámbito de aplicación

**Definición oficial SNIP:** Alcance institucional y de tipo de proyectos sobre los que se aplica el SNIP, determinado por la normativa vigente. Define qué entidades y qué clases de proyectos deben cumplir con las normas del sistema.

**Sinónimos / términos relacionados:** cobertura del SNIP, alcance del sistema

**Fuente:** https://mepyd.gob.do/snip/


### Clasificación de proyectos

**Definición oficial SNIP:** Ordenamiento de los proyectos de inversión pública en categorías según criterios como sector, tipo de infraestructura, tamaño, zona geográfica, fuente de financiamiento u otros, con el fin de facilitar su análisis y gestión.

**Sinónimos / términos relacionados:** tipología de proyectos, categorización de proyectos

**Fuente:** https://mepyd.gob.do/snip/


### Dictamen técnico

**Definición oficial SNIP:** Documento emitido por el órgano rector u otra instancia autorizada que consigna la evaluación técnica de un proyecto de inversión pública, indicando si cumple o no con los requisitos para ser considerado viable.

**Sinónimos / términos relacionados:** informe técnico, pronunciamiento técnico

**Fuente:** https://mepyd.gob.do/snip/


### Admisibilidad

**Definición oficial SNIP:** Condición que debe cumplir un proyecto para ser aceptado al proceso de evaluación dentro del SNIP, usualmente asociada al cumplimiento de requisitos formales mínimos de información, alineamiento con políticas y otros criterios básicos.

**Sinónimos / términos relacionados:** elegibilidad, aceptación al sistema

**Fuente:** https://mepyd.gob.do/snip/


### Ejecución físico-financiera

**Definición oficial SNIP:** Proceso mediante el cual se lleva a cabo la construcción de obras, adquisición de bienes y servicios, y desembolso de recursos, registrando tanto los avances físicos como los financieros del proyecto de inversión pública.

**Sinónimos / términos relacionados:** avance físico, avance financiero, ejecución del proyecto

**Fuente:** https://mepyd.gob.do/snip/


### Informe de avance

**Definición oficial SNIP:** Documento periódico que presenta el estado de ejecución de un proyecto de inversión pública, incluyendo información sobre avances físicos, financieros, problemas encontrados y acciones correctivas.

**Sinónimos / términos relacionados:** reporte de progreso, informe de ejecución

**Fuente:** https://mepyd.gob.do/snip/


### Operación

**Definición oficial SNIP:** Fase del ciclo del proyecto en la que la infraestructura o servicio generado está en uso y presta los beneficios previstos a la población objetivo, requiriendo actividades de funcionamiento y mantenimiento.

**Sinónimos / términos relacionados:** funcionamiento, puesta en marcha

**Fuente:** https://mepyd.gob.do/snip/


### Evaluación ex-post

**Definición oficial SNIP:** Análisis que se realiza una vez que el proyecto ha estado en operación por un periodo suficiente, con el fin de determinar en qué medida se lograron los resultados e impactos previstos y extraer lecciones para futuras inversiones.

**Sinónimos / términos relacionados:** evaluación posterior, evaluación de resultados finales

**Fuente:** https://mepyd.gob.do/snip/


### Perfil de proyecto

**Definición oficial SNIP:** Documento inicial de formulación de un proyecto de inversión pública que contiene la información básica necesaria para su identificación, análisis preliminar de viabilidad y decisión sobre la conveniencia de continuar con estudios más detallados.

**Sinónimos / términos relacionados:** estudio de perfil, documento de perfil

**Fuente:** https://mepyd.gob.do/snip/


### Prefactibilidad

**Definición oficial SNIP:** Nivel de estudio de un proyecto en el que se profundiza el análisis realizado en el perfil, evaluando alternativas técnicas y económicas con mayor detalle para determinar si es conveniente avanzar a la fase de factibilidad.

**Sinónimos / términos relacionados:** estudio de prefactibilidad, análisis preliminar

**Fuente:** https://mepyd.gob.do/snip/


### Factibilidad

**Definición oficial SNIP:** Estudio de mayor detalle que confirma la conveniencia técnica, económica, social y ambiental de ejecutar un proyecto, definiendo la alternativa recomendada y los parámetros básicos para su diseño y ejecución.

**Sinónimos / términos relacionados:** estudio de factibilidad, análisis definitivo

**Fuente:** https://mepyd.gob.do/snip/


### Indicadores de gestión

**Definición oficial SNIP:** Medidas que permiten evaluar el desempeño de las entidades responsables de la inversión pública en términos de eficiencia, eficacia y oportunidad en la formulación, ejecución y seguimiento de los proyectos.

**Sinónimos / términos relacionados:** indicadores de desempeño institucional, indicadores de gestión pública

**Fuente:** https://mepyd.gob.do/snip/


### Matriz de marco lógico

**Definición oficial SNIP:** Herramienta utilizada en la formulación de proyectos que organiza en forma sistemática los objetivos, resultados, actividades, indicadores, medios de verificación y supuestos, facilitando la planificación y evaluación de la intervención.

**Sinónimos / términos relacionados:** marco lógico, MML, matriz de planificación

**Fuente:** https://mepyd.gob.do/snip/


### Análisis costo-beneficio

**Definición oficial SNIP:** Método de evaluación económica que compara, en términos monetarios, los costos y beneficios de un proyecto a lo largo de su vida útil, utilizando técnicas de actualización como el valor presente neto y la tasa interna de retorno.

**Sinónimos / términos relacionados:** ACB, evaluación costo-beneficio, análisis económico

**Fuente:** https://mepyd.gob.do/snip/


### Análisis costo-efectividad

**Definición oficial SNIP:** Método de evaluación económica que compara el costo de diferentes alternativas de intervención en relación con un mismo indicador de resultado, cuando no es posible o conveniente monetizar los beneficios.

**Sinónimos / términos relacionados:** ACE, evaluación costo-efectividad

**Fuente:** https://mepyd.gob.do/snip/


### Valor presente neto (VPN)

**Definición oficial SNIP:** Medida de rentabilidad que resulta de descontar al momento actual los flujos de costos y beneficios de un proyecto, utilizando una tasa de descuento determinada, y restar la suma de costos de la suma de beneficios.

**Sinónimos / términos relacionados:** Vpn, valor actualizado neto, VAN

**Fuente:** https://mepyd.gob.do/snip/


### Tasa interna de retorno (TIR)

**Definición oficial SNIP:** Tasa de descuento que hace que el valor presente neto de un proyecto sea igual a cero, y que se utiliza como indicador de su rentabilidad relativa frente a una tasa de referencia o costo de oportunidad del capital.

**Sinónimos / términos relacionados:** Tir, tasa interna, tasa de retorno

**Fuente:** https://mepyd.gob.do/snip/


### Horizonte de evaluación

**Definición oficial SNIP:** Periodo de tiempo considerado en los análisis económicos de un proyecto, durante el cual se contabilizan los costos y beneficios para efectos de su evaluación.

**Sinónimos / términos relacionados:** horizonte temporal, periodo de evaluación

**Fuente:** https://mepyd.gob.do/snip/


### Población objetivo

**Definición oficial SNIP:** Grupo de personas al que se dirige directamente la intervención de un proyecto de inversión pública, y que se espera se beneficie de sus resultados.

**Sinónimos / términos relacionados:** población beneficiaria, población meta

**Fuente:** https://mepyd.gob.do/snip/


### Línea de base

**Definición oficial SNIP:** Situación inicial de los indicadores relevantes antes de la ejecución de un proyecto, que sirve como punto de referencia para medir los cambios atribuibles a la intervención.

**Sinónimos / términos relacionados:** baseline, situación base, línea base

**Fuente:** https://mepyd.gob.do/snip/


### Externalidades

**Definición oficial SNIP:** Efectos secundarios de un proyecto que impactan a terceros que no forman parte directa del grupo de beneficiarios o de los responsables del proyecto, y que pueden ser positivos (beneficios) o negativos (costos).

**Sinónimos / términos relacionados:** efectos externos, impactos indirectos

**Fuente:** https://mepyd.gob.do/snip/


### Sostenibilidad

**Definición oficial SNIP:** Probabilidad de que los beneficios de un proyecto se mantengan en el tiempo una vez que ha finalizado la fase de inversión, considerando factores institucionales, financieros, sociales y ambientales.

**Sinónimos / términos relacionados:** sustentabilidad, permanencia de beneficios

**Fuente:** https://mepyd.gob.do/snip/


### Costo hundido

**Definición oficial SNIP:** Gasto ya realizado en el pasado que no puede recuperarse y que, por lo tanto, no debe considerarse en la comparación de alternativas futuras, aunque sí puede ser relevante para describir la historia del proyecto.

**Sinónimos / términos relacionados:** costos irrecuperables, gastos ya efectuados

**Fuente:** https://mepyd.gob.do/snip/


### Riesgo

**Definición oficial SNIP:** Posibilidad de que los resultados de un proyecto difieran de lo esperado debido a factores inciertos, lo cual puede afectar costos, plazos, calidad o beneficios.

**Sinónimos / términos relacionados:** incertidumbre, exposición al riesgo

**Fuente:** https://mepyd.gob.do/snip/


### Sensibilidad

**Definición oficial SNIP:** Grado de variación que experimentan los resultados de la evaluación de un proyecto cuando cambian los valores supuestos de variables clave, como costos, demanda, tasas de interés, entre otros.

**Sinónimos / términos relacionados:** análisis de sensibilidad, sensibilidad de resultados

**Fuente:** https://mepyd.gob.do/snip/


### Escenario

**Definición oficial SNIP:** Conjunto coherente de supuestos sobre la evolución futura de variables relevantes para un proyecto, utilizado para analizar su comportamiento bajo diferentes condiciones posibles (por ejemplo, escenarios pesimista, base, optimista).

**Sinónimos / términos relacionados:** escenarios de análisis, supuestos de escenario

**Fuente:** https://mepyd.gob.do/snip/


### Marco normativo

**Definición oficial SNIP:** Conjunto de leyes, reglamentos, decretos, resoluciones y otros instrumentos jurídicos que regulan el funcionamiento del SNIP y la gestión de la inversión pública en el país.

**Sinónimos / términos relacionados:** legislación de inversión pública, normativa legal del SNIP

**Fuente:** https://mepyd.gob.do/snip/


### Registro de proyectos

**Definición oficial SNIP:** Proceso mediante el cual se inscriben los proyectos de inversión pública en el banco de proyectos, una vez que han cumplido con los requisitos de formulación y evaluación establecidos.

**Sinónimos / términos relacionados:** inscripción de proyectos, alta de proyectos

**Fuente:** https://mepyd.gob.do/snip/


### Programación de la inversión

**Definición oficial SNIP:** Proceso de asignación de recursos de inversión pública a los proyectos registrados y viables, considerando las restricciones presupuestarias y las prioridades de desarrollo.

**Sinónimos / términos relacionados:** programación de proyectos, calendarización de inversiones

**Fuente:** https://mepyd.gob.do/snip/


### Desembolso

**Definición oficial SNIP:** Entrega efectiva de recursos financieros para la ejecución de las actividades de un proyecto, de acuerdo con los cronogramas de ejecución y las condiciones de los contratos.

**Sinónimos / términos relacionados:** pagos, giros, transferencias de recursos

**Fuente:** https://mepyd.gob.do/snip/


### Supervisión

**Definición oficial SNIP:** Actividad de seguimiento técnico y administrativo que se realiza durante la ejecución de un proyecto para verificar el cumplimiento de especificaciones, plazos, costos y calidad.

**Sinónimos / términos relacionados:** monitoreo de obra, inspección de proyectos

**Fuente:** https://mepyd.gob.do/snip/


### Monitoreo

**Definición oficial SNIP:** Proceso continuo de recolección, análisis y uso de información sobre la ejecución y resultados de un proyecto, con el fin de apoyar la toma de decisiones y la mejora de la gestión.

**Sinónimos / términos relacionados:** seguimiento, seguimiento de proyectos

**Fuente:** https://mepyd.gob.do/snip/


### Evaluación

**Definición oficial SNIP:** Análisis sistemático y objetivo del diseño, implementación y resultados de un proyecto, programa o política, con el fin de determinar su pertinencia, eficacia, eficiencia, impacto y sostenibilidad.

**Sinónimos / términos relacionados:** evaluación de proyectos, evaluación de programas

**Fuente:** https://mepyd.gob.do/snip/


### Cofinanciamiento

**Definición oficial SNIP:** Esquema de financiamiento en el cual un proyecto recibe recursos de más de una fuente, por ejemplo, combinación de fondos nacionales y de organismos internacionales, o entre distintos niveles de gobierno.

**Sinónimos / términos relacionados:** financiamiento compartido, múltiples fuentes de financiamiento

**Fuente:** https://mepyd.gob.do/snip/


### Contrapartida

**Definición oficial SNIP:** Aporte de recursos que realiza una entidad nacional (por ejemplo, el gobierno central o una entidad subnacional) como condición para acceder a recursos de financiamiento externo u otras fuentes.

**Sinónimos / términos relacionados:** aporte nacional, aporte local, contribución propia

**Fuente:** https://mepyd.gob.do/snip/


### Cartera de proyectos

**Definición oficial SNIP:** Conjunto de proyectos de inversión pública que una entidad, sector o país tiene planificados, en ejecución o en evaluación, los cuales compiten por recursos de financiamiento.

**Sinónimos / términos relacionados:** portafolio de proyectos, conjunto de proyectos

**Fuente:** https://mepyd.gob.do/snip/


### Proyecto multianual

**Definición oficial SNIP:** Proyecto cuya ejecución y requerimientos de recursos se extienden por más de un ejercicio presupuestario, requiriendo programación plurianual.

**Sinónimos / términos relacionados:** proyecto de varios años, proyecto de largo plazo

**Fuente:** https://mepyd.gob.do/snip/


### Proyecto de arrastre

**Definición oficial SNIP:** Proyecto que ha sido iniciado en años anteriores y que continúa su ejecución en el periodo actual, arrastrando compromisos y saldos de presupuesto.

**Sinónimos / términos relacionados:** proyecto en continuidad, proyecto en curso de años anteriores

**Fuente:** https://mepyd.gob.do/snip/


### Meta

**Definición oficial SNIP:** Valor esperado o comprometido de un indicador de producto o resultado que se pretende alcanzar con la ejecución de un proyecto de inversión pública en un periodo determinado.

**Sinónimos / términos relacionados:** objetivo cuantificado, objetivo medible

**Fuente:** https://mepyd.gob.do/snip/


### Producto

**Definición oficial SNIP:** Bien o servicio final que resulta directamente de las actividades de un proyecto de inversión pública, y que se entrega a la población objetivo.

**Sinónimos / términos relacionados:** output, entregable del proyecto

**Fuente:** https://mepyd.gob.do/snip/


### Resultado

**Definición oficial SNIP:** Cambio inmediato o de corto plazo en la situación de la población o del sistema que se genera a partir del uso de los productos del proyecto.

**Sinónimos / términos relacionados:** outcome, efecto inmediato

**Fuente:** https://mepyd.gob.do/snip/


### Impacto

**Definición oficial SNIP:** Cambios de mediano o largo plazo en el bienestar, la economía o el ambiente, atribuibles en parte al proyecto, y que reflejan los objetivos superiores de desarrollo.

**Sinónimos / términos relacionados:** efectos de largo plazo, efectos de desarrollo

**Fuente:** https://mepyd.gob.do/snip/


### Horizonte de planeación

**Definición oficial SNIP:** Periodo de tiempo que abarca la planificación de la inversión pública, incluyendo la identificación de necesidades, priorización de proyectos y programación de recursos.

**Sinónimos / términos relacionados:** horizonte de planificación, periodo de planeación

**Fuente:** https://mepyd.gob.do/snip/


### Costo total del proyecto

**Definición oficial SNIP:** Suma de todos los costos de inversión requeridos para ejecutar el proyecto hasta su puesta en operación, incluyendo estudios, obras, equipamiento y demás gastos de capital.

**Sinónimos / términos relacionados:** costo de inversión, costo de proyecto

**Fuente:** https://mepyd.gob.do/snip/


### Gasto de capital

**Definición oficial SNIP:** Desembolso destinado a la adquisición, construcción o mejora de activos fijos o infraestructura, que incrementan el patrimonio o la capacidad de producción de bienes y servicios.

**Sinónimos / términos relacionados:** inversión de capital, gasto de inversión

**Fuente:** https://mepyd.gob.do/snip/


### Gasto corriente asociado

**Definición oficial SNIP:** Gastos de operación y mantenimiento recurrentes que son necesarios para que la infraestructura o servicio generado por un proyecto de inversión pública funcione adecuadamente.

**Sinónimos / términos relacionados:** gastos operativos, gastos recurrentes

**Fuente:** https://mepyd.gob.do/snip/


### Umbral de evaluación

**Definición oficial SNIP:** Valor mínimo (por ejemplo, en términos de monto de inversión) a partir del cual los proyectos deben ser sometidos a ciertos tipos de evaluación o estudios más detallados.

**Sinónimos / términos relacionados:** límite de evaluación, criterio de umbral

**Fuente:** https://mepyd.gob.do/snip/


### Compatibilidad con planes

**Definición oficial SNIP:** Grado en que un proyecto se encuentra alineado con los objetivos, estrategias y prioridades establecidas en los planes de desarrollo nacional, sectoriales o territoriales.

**Sinónimos / términos relacionados:** alineamiento con planes, coherencia con la planificación

**Fuente:** https://mepyd.gob.do/snip/


### Registro único de proyectos

**Definición oficial SNIP:** Identificador único asignado a cada proyecto en el banco de proyectos, que permite su trazabilidad en las distintas etapas del ciclo de inversión y en los diferentes sistemas de información.

**Sinónimos / términos relacionados:** código único de proyecto, identificador único

**Fuente:** https://mepyd.gob.do/snip/


### Proyectos estratégicos

**Definición oficial SNIP:** Proyectos de inversión pública que, por su magnitud, impacto o relevancia para el logro de objetivos nacionales de desarrollo, reciben un tratamiento prioritario en la programación y seguimiento.

**Sinónimos / términos relacionados:** proyectos clave, proyectos prioritarios

**Fuente:** https://mepyd.gob.do/snip/


### Cartera priorizada

**Definición oficial SNIP:** Subconjunto de la cartera de proyectos que ha sido seleccionado como prioritario para recibir financiamiento en un periodo determinado, de acuerdo con criterios de política y disponibilidad de recursos.

**Sinónimos / términos relacionados:** cartera seleccionada, lista priorizada de proyectos

**Fuente:** https://mepyd.gob.do/snip/


### Brecha de infraestructura

**Definición oficial SNIP:** Diferencia entre la infraestructura disponible y la requerida para alcanzar ciertos niveles de servicio o cobertura deseados en un territorio o sector.

**Sinónimos / términos relacionados:** déficit de infraestructura, carencia de infraestructura

**Fuente:** https://mepyd.gob.do/snip/


### Enfoque territorial

**Definición oficial SNIP:** Perspectiva de análisis y planificación que considera las particularidades de los territorios (regiones, provincias, municipios) en la identificación, formulación y priorización de proyectos de inversión pública.

**Sinónimos / términos relacionados:** enfoque territorial de la inversión, enfoque de desarrollo territorial

**Fuente:** https://mepyd.gob.do/snip/


### Cierre de brechas

**Definición oficial SNIP:** Objetivo de las intervenciones de inversión pública orientadas a reducir las diferencias en acceso a infraestructura y servicios básicos entre distintos territorios o grupos de población.

**Sinónimos / términos relacionados:** reducción de brechas, disminución de desigualdades de infraestructura

**Fuente:** https://mepyd.gob.do/snip/


### Mesa de inversión

**Definición oficial SNIP:** Espacio de coordinación entre diferentes actores institucionales para la revisión, priorización y seguimiento de los proyectos de inversión pública.

**Sinónimos / términos relacionados:** comité de inversión, instancia de coordinación de inversiones

**Fuente:** https://mepyd.gob.do/snip/


### Seguimiento de compromisos

**Definición oficial SNIP:** Monitoreo de los acuerdos y acciones definidos en las decisiones de programación y priorización de proyectos, para verificar su cumplimiento en la ejecución.

**Sinónimos / términos relacionados:** seguimiento de acuerdos, control de compromisos

**Fuente:** https://mepyd.gob.do/snip/


### Información geoespacial

**Definición oficial SNIP:** Datos que permiten ubicar geográficamente los proyectos de inversión pública y analizar su distribución territorial y su relación con variables socioeconómicas y ambientales.

**Sinónimos / términos relacionados:** datos geográficos, información espacial, datos GIS

**Fuente:** https://mepyd.gob.do/snip/


### Transparencia en la inversión pública

**Definición oficial SNIP:** Principio y práctica de poner a disposición de la ciudadanía información clara, oportuna y accesible sobre los proyectos de inversión pública, su financiamiento, ejecución y resultados.

**Sinónimos / términos relacionados:** rendición de cuentas, acceso a la información de inversión

**Fuente:** https://mepyd.gob.do/snip/


### Participación ciudadana

**Definición oficial SNIP:** Intervención de la ciudadanía o de sus organizaciones en las distintas etapas del ciclo de inversión pública, aportando información, observaciones y propuestas sobre proyectos y prioridades.

**Sinónimos / términos relacionados:** involucramiento ciudadano, participación social en la inversión

**Fuente:** https://mepyd.gob.do/snip/


### Evaluación social

**Definición oficial SNIP:** Análisis que mide los efectos de un proyecto de inversión pública sobre el bienestar de la población, considerando aspectos distributivos, equidad y pobreza, además de la eficiencia económica.

**Sinónimos / términos relacionados:** evaluación socioeconómica, evaluación social de proyectos

**Fuente:** https://mepyd.gob.do/snip/


### Instrumentos de planificación

**Definición oficial SNIP:** Conjunto de planes, programas, políticas y marcos estratégicos que orientan la formulación y priorización de proyectos de inversión pública.

**Sinónimos / términos relacionados:** herramientas de planificación, instrumentos de política

**Fuente:** https://mepyd.gob.do/snip/


### Calidad de la inversión

**Definición oficial SNIP:** Grado en que los proyectos de inversión pública son pertinentes, bien formulados, viables, eficientemente ejecutados y generan los resultados e impactos esperados.

**Sinónimos / términos relacionados:** calidad del gasto de inversión, efectividad de la inversión

**Fuente:** https://mepyd.gob.do/snip/


#### PREGUNTAS FRECUENTES RELACIONADAS CON LA PLATAFORMA

### Veracidad de los datos publicados

**Definición oficial / respuesta:** La información mostrada en MapaInversiones proviene exclusivamente de fuentes oficiales del Gobierno de República Dominicana y se actualiza de manera periódica. Además, se aplican procesos de validación y control de calidad para asegurar que los datos sean precisos y reflejen el estado real de los proyectos de inversión pública.

**Sinónimos / términos relacionados:** confiabilidad de datos, validación de datos, precisión de la información

**Fuente:** Plataforma MapaInversiones República Dominicana

---

### Comparación de proyectos de inversión

**Definición oficial / respuesta:** La plataforma permite comparar distintos proyectos según criterios como ubicación geográfica, monto de inversión, estado de avance y sector. Esta funcionalidad facilita el análisis ciudadano y la toma de decisiones informada.

**Sinónimos / términos relacionados:** comparación de proyectos, análisis comparativo, evaluación de inversiones

**Fuente:** Plataforma MapaInversiones República Dominicana

---

### Notificaciones y suscripciones a proyectos

**Definición oficial / respuesta:** Los usuarios pueden suscribirse a proyectos específicos para recibir alertas sobre avances, cambios presupuestarios o modificaciones en los plazos de ejecución.

**Sinónimos / términos relacionados:** alertas de proyectos, seguimiento de proyectos, suscripción a actualizaciones

**Fuente:** Plataforma MapaInversiones República Dominicana

---

### Información sobre proveedores y contratistas

**Definición oficial / respuesta:** Cada proyecto incluye detalles sobre las empresas o entidades responsables de la ejecución, así como los contratos adjudicados y su estado actual.

**Sinónimos / términos relacionados:** contratistas, proveedores, contratos adjudicados, ejecutores de proyectos

**Fuente:** Plataforma MapaInversiones República Dominicana

---

### Visualización geoespacial de proyectos

**Definición oficial / respuesta:** La plataforma ofrece un mapa interactativo que permite explorar los proyectos por ubicación, identificando inversiones cercanas a comunidades y territorios específicos.

**Sinónimos / términos relacionados:** mapa interactivo, visualización geográfica, georreferenciación de proyectos

**Fuente:** Plataforma MapaInversiones República Dominicana

---

### Acceso a datos históricos de proyectos

**Definición oficial / respuesta:** Además de los proyectos en ejecución, la plataforma conserva registros de proyectos finalizados, lo que habilita el análisis de inversiones pasadas y su impacto.

**Sinónimos / términos relacionados:** historial de proyectos, proyectos finalizados, análisis retrospectivo

**Fuente:** Plataforma MapaInversiones República Dominicana

---

### Uso de los datos por universidades e investigadores

**Definición oficial / respuesta:** Los datos están disponibles en formatos abiertos y descargables, permitiendo investigaciones académicas, estudios de políticas públicas y análisis sobre inversión gubernamental.

**Sinónimos / términos relacionados:** datos abiertos, investigación académica, análisis de políticas públicas

**Fuente:** Plataforma MapaInversiones República Dominicana

---

### Guías y tutoriales para usar la plataforma

**Definición oficial / respuesta:** La plataforma incluye guías paso a paso, tutoriales en video y un chatbot integrado para facilitar el aprendizaje y la navegación.

**Sinónimos / términos relacionados:** tutoriales, guías de uso, ayuda para usuarios, capacitación

**Fuente:** Plataforma MapaInversiones República Dominicana

---

### Financiamiento y administración de la plataforma

**Definición oficial / respuesta:** MapaInversiones es una iniciativa del Gobierno de República Dominicana desarrollada con apoyo del Banco Interamericano de Desarrollo (BID). Su administración está a cargo del Ministerio de Economía, Planificación y Desarrollo, en coordinación con otras entidades gubernamentales.

**Sinónimos / términos relacionados:** gobernanza de la plataforma, financiamiento BID, administración institucional

**Fuente:** MEPyD – BID

---

### Reporte de información incorrecta o desactualizada

**Definición oficial / respuesta:** Si el usuario detecta inconsistencias, puede reportarlas mediante el módulo de participación ciudadana o enviando un correo a la entidad responsable de la actualización de datos.

**Sinónimos / términos relacionados:** reporte de errores, corrección de datos, participación ciudadana

**Fuente:** Plataforma MapaInversiones República Dominicana

