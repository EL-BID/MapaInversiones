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
- **REEVALUACION**: Proyecto en proceso de reevaluación

> **Regla de negocio**: Cuando el usuario pregunta por "proyectos activos" o "en ejecución", filtrar por `estado_proyecto ILIKE '%ejecuci%'`. 
> No confundir con "monto ejecutado" (`valor_ejecutado`) que es dinero gastado.

### ⚠️ DIFERENCIA CRÍTICA: "Ejecutado" vs "Finalizado"

**Son conceptos DIFERENTES que NO deben confundirse:**

| Concepto | Significado | Columna a usar |
|----------|-------------|----------------|
| **Proyecto en ejecución** | Estado del proyecto = activo, en curso | `estado_proyecto ILIKE '%ejecuci%'` |
| **Proyecto finalizado** | Estado del proyecto = terminado | `estado_proyecto = 'FINALIZADO'` o `anio_fechafin_proyecto <= año_actual` |
| **Monto ejecutado** | Dinero ya gastado | `valor_ejecutado` (tabla financiamiento) |
| **Monto vigente** | Presupuesto vigente actual | `valor_vigente` (tabla financiamiento) |
| **Monto del proyecto** | Valor total asignado | `valor_proyecto` (tabla proyectos) |

> **Regla de desambiguación**: Si el usuario pregunta "¿cuánto se ha ejecutado?", se refiere a `valor_ejecutado` (dinero gastado).
> Si pregunta "¿cuántos proyectos están en ejecución?", se refiere al `estado_proyecto`.
> Si pregunta "¿cuántos proyectos han finalizado?", se refiere a proyectos cuyo estado es finalizado o cuya fecha fin ya pasó.

### Provincias de República Dominicana (`nombre_departamento`)
> **IMPORTANTE**: En RD se usa "provincia", no "departamento". La columna se llama `nombre_departamento` pero contiene provincias.

Lista completa de las 31 provincias + Distrito Nacional:
- AZUA
- BAORUCO
- BARAHONA
- DAJABÓN
- DISTRITO NACIONAL
- DUARTE
- EL SEIBO
- ELÍAS PIÑA
- ESPAILLAT
- HATO MAYOR
- HERMANAS MIRABAL
- INDEPENDENCIA
- LA ALTAGRACIA
- LA ROMANA
- LA VEGA
- MARÍA TRINIDAD SÁNCHEZ
- MONTE CRISTI
- MONTE PLATA
- MONSEÑOR NOUEL
- PEDERNALES
- PERAVIA
- PUERTO PLATA
- SAMANÁ
- SAN CRISTÓBAL
- SAN JOSÉ DE OCOA
- SAN JUAN
- SAN PEDRO DE MACORÍS
- SÁNCHEZ RAMÍREZ
- SANTIAGO
- SANTIAGO RODRIGUEZ
- SANTO DOMINGO
- VALVERDE

### Regiones de República Dominicana (`nombre_region`)
Agrupación geográfica de provincias:
- **NACIONALES**: Proyectos de alcance nacional
- **REGION CIBAO NORDESTE**: Duarte, María Trinidad Sánchez, Hermanas Mirabal, Samaná
- **REGION CIBAO NOROESTE**: Dajabón, Monte Cristi, Santiago Rodríguez, Valverde
- **REGION CIBAO NORTE**: Espaillat, Puerto Plata, Santiago
- **REGION CIBAO SUR**: La Vega, Monseñor Nouel, Sánchez Ramírez
- **REGION EL VALLE**: Azua, Elías Piña, San Juan
- **REGION ENRIQUILLO**: Baoruco, Barahona, Independencia, Pedernales
- **REGION HIGUAMO**: Hato Mayor, Monte Plata, San Pedro de Macorís
- **REGION OZAMA O METROPOLITANA**: Distrito Nacional, Santo Domingo
- **REGION VALDESIA**: Peravia, San Cristóbal, San José de Ocoa
- **REGION YUMA**: El Seibo, La Altagracia, La Romana

> **Regla de negocio**: Cuando el usuario dice "Región Sur", puede referirse a REGION EL VALLE, REGION ENRIQUILLO o REGION VALDESIA. Pedir clarificación o usar OR.

### Sectores de Proyectos (`nombresector_proyecto`)
Clasificación sectorial de los proyectos:
- ACTIVIDADES DEPORTIVAS, RECREATIVAS, CULTURALES Y RELIGIOSAS
- ADMINISTRACIÓN GENERAL
- AGROPECUARIA, CAZA, PESCA Y SILVICULTURA
- ASUNTOS ECONÓMICOS, COMERCIALES Y LABORALES
- CAMBIO CLIMÁTICO
- COMUNICACIONES
- DEFENSA NACIONAL
- EDUCACIÓN
- ENERGÍA Y COMBUSTIBLE
- JUSTICIA, ORDEN PÚBLICO Y SEGURIDAD
- MINERÍA, MANUFACTURA Y CONSTRUCCIÓN
- OTROS SERVICIOS ECONÓMICOS
- PROTECCIÓN DE LA BIODIVERSIDAD Y ORDENACIÓN DE DESECHOS
- PROTECCIÓN DEL AIRE, AGUA Y SUELO
- PROTECCIÓN SOCIAL
- REDUCCIÓN DEL RIESGO DE DESASTRES CLIMÁTICOS
- RIEGO
- SALUD
- TRANSPORTE
- VIVIENDA Y SERVICIOS COMUNITARIOS

### Tipo de Proyecto (`tipo_proyecto`)
Alcance territorial del proyecto:
- **NACIONAL**: Proyecto de alcance nacional
- **DEPARTAMENTAL O MUNICIPAL**: Proyecto localizado en provincia(s) o municipio(s) específicos

### Organismos Financiadores (`organismo_financiador`)
Principales organismos que financian proyectos:
- **Multilaterales**: Banco Interamericano de desarrollo (BID), Banco Mundial (BM), Banco Internacional de Reconstruccion y Fomento (BIRF), Banco Europeo de Inversiones (BEI), Banco Centroamericano de Integración Económica (BCID), Cooperación Andina de Fomento (CAF), Fondo Internacional de desarrollo Agrícola (FIDA)
- **Bilaterales**: Agencia Española De Cooperación Internacional y Desarrollo (AECID), Agencia Francesa para el Desarrollo, Agencia de Cooperación Internacional del Japón (JICA), Unión Europea, Canadá, Francia, Argentina, República De China (Taiwan)
- **Nacionales**: Tesoro Nacional, Contrapartida, Banco De Reservas de la República Dominicana (BANRESERVAS), Fondos Propios, Apoyo Presupuestario
- **Otros**: Programa de las NN.UU. para el desarrollo (PNUD), Fondo Mundial de Lucha Contra el Sida Tuberculosis y la Malaria

---

## Reglas de Negocio para Consultas

### Regla B1: Identificación de Proyectos (CÓDIGO SNIP vs ID)
- **codigo_snip**: Identificador PÚBLICO que los ciudadanos conocen (ej: "proyecto 14339")
- **id_proyecto**: Identificador INTERNO para JOINs y URLs

> Cuando el usuario menciona un número de proyecto, usar `codigo_snip`, NO `id_proyecto`.

### Regla B2: Tipos de Montos/Valores
Existen múltiples columnas monetarias con significados diferentes:
- **valor_proyecto** (tabla proyectos): Monto TOTAL aprobado para todo el proyecto
- **valor_vigente** (tabla financiamiento): Monto vigente de una fuente específica
- **valor_ejecutado** (tabla financiamiento): Monto ya gastado de una fuente específica

> Si el usuario pregunta por "monto" sin especificar, pedir clarificación.

### Regla B3: Terminología Territorial (Provincia vs Departamento)
En República Dominicana:
- La columna se llama `nombre_departamento` pero contiene **PROVINCIAS**
- Jerarquía territorial: **Región → Provincia → Municipio**
- Usar "provincia" en respuestas al usuario, no "departamento"

### Regla B4: Rango Temporal de Proyectos
Los proyectos tienen dos columnas de año:
- **anio_fechainicio_proyecto**: Año de inicio
- **anio_fechafin_proyecto**: Año de fin previsto

Interpretación de consultas:
- "Proyectos de 2024" = Proyectos ACTIVOS en 2024: `anio_fechainicio <= 2024 AND anio_fechafin >= 2024`
- "Proyectos que iniciaron en 2024" = `anio_fechainicio = 2024`
- "Proyectos que finalizaron en 2024" = `anio_fechafin = 2024`

### Regla B5: Proyectos Multi-Territorio
Un proyecto puede estar en múltiples provincias/municipios. La tabla `stg_mapainv_proyectosterritorios` tiene una fila por cada territorio del proyecto.

> Al contar proyectos por territorio, usar `COUNT(DISTINCT id_proyecto)` para evitar duplicados.

---

## Estructura de datos disponibles

### Fecha de Corte de datos y actualizacion:
Los datos estan actualizado a la siguiente fecha: 27 de Octubre de 2025 (10/27/2025).

### stg_mapainv_proyectosaprobadosinv
- **Descripción:** Proyectos aprobados con detalle de identificación, estado, duración, financiamiento y entidad ejecutora.
- **Filas aproximadas:** 6,100
- **Campos:**
	- `id_proyecto` (bigint) — Identificador interno único del proyecto. Usar solo para JOINs.
	- `codigo_snip` (text) — Código SNIP público del proyecto. Usar cuando el usuario menciona un número de proyecto.
	- `nombre_proyecto` (text) — Nombre oficial del proyecto aprobado.
	- `objetivo_proyecto` (text) — Propósito y alcance del proyecto.
	- `estado_proyecto` (text, catálogo) — Estado actual: APROBADO, EJECUCIÓN, PARALIZADO, REEVALUACION.
	- `valor_proyecto` (double precision) — Monto total aprobado para el proyecto.
	- `nombresector_proyecto` (text, catálogo) — Sector al que se adscribe el proyecto.
	- `nombreentidadejecutora_proyecto` (text) — Entidad responsable de la ejecución.
	- `anio_fechainicio_proyecto` (bigint, catálogo) — Año de inicio del proyecto.
	- `anio_fechafin_proyecto` (bigint, catálogo) — Año estimado de finalización.
	- `fechainicio_proyecto` (date) — Fecha exacta de inicio del proyecto.
	- `fechafin_proyecto` (date) — Fecha estimada de cierre del proyecto.
	- `duracion_proyecto` (double precision, catálogo) — Duración total estimada en años.
	- `porcentajeavancefinanciero_proyecto` (double precision) — Avance financiero acumulado (%).
	- `tipo_proyecto` (text, catálogo) — NACIONAL o DEPARTAMENTAL O MUNICIPAL.
	- `pais_iso3` (user-defined, catálogo) — Código ISO3 del país (dom para RD).
	- `pais_nombre` (text, catálogo) — Nombre del país.
	- `url_link_proyecto` (character varying) — Enlace al perfil detallado del proyecto.

### stg_mapainv_proyectosterritorios
- **Descripción:** Relación de proyectos con su localización territorial. Un proyecto puede tener múltiples filas si está en varios territorios.
- **Filas aproximadas:** 38,663
- **Campos:**
	- `id_proyecto` (bigint) — Identificador del proyecto asociado al territorio.
	- `nombre_region` (text, catálogo) — Región geográfica (11 regiones en RD).
	- `nombre_departamento` (text, catálogo) — Provincia del proyecto (31 provincias + DN).
	- `nombre_municipio` (text) — Municipio correspondiente.
	- `pais_iso3` (user-defined, catálogo) — Código ISO3 del país.
	- `pais_nombre` (text, catálogo) — Nombre del país.
- **Relaciones clave:** `id_proyecto` y `pais_iso3` referencian a `stg_mapainv_proyectosaprobadosinv`.

### stg_mapainv_proyectosfuentesfinanciamiento
- **Descripción:** Información sobre las fuentes de financiamiento asociadas a cada proyecto.
- **Filas aproximadas:** 12,743
- **Campos:**
	- `id_proyecto` (bigint) — Identificador del proyecto financiado.
	- `organismo_financiador` (text, catálogo) — Organismo que aporta los recursos (BID, BM, Tesoro Nacional, etc.).
	- `fuente_financiacion` (text, catálogo) — Descripción de la fuente de financiamiento.
	- `valor_vigente` (double precision) — Monto vigente/presupuestado de esta fuente.
	- `valor_ejecutado` (double precision) — Monto ya ejecutado/gastado de esta fuente.
	- `anio_financiacion` (bigint, catálogo) — Año del aporte de financiamiento.
	- `pais_iso3` (user-defined, catálogo) — Código ISO3 del país vinculado.
	- `pais_nombre` (text, catálogo) — Nombre del país correspondiente.
- **Relaciones clave:** `id_proyecto` y `pais_iso3` referencian a `stg_mapainv_proyectosaprobadosinv`.

---

## Ciclo del Sistema Nacional de Inversión Pública (SNIP)

El **Sistema Nacional de Inversión Pública (SNIP)** en la República Dominicana es el conjunto de principios, métodos, procedimientos y normas que orientan el uso de los recursos públicos destinados a proyectos de inversión. Su objetivo es garantizar que las inversiones públicas sean eficientes, efectivas y estén alineadas con las prioridades de desarrollo del país.

### Fases del Ciclo SNIP

#### 1. Preinversión
- Fase donde se identifica el problema o necesidad.
- Se analizan alternativas de solución.
- Se realizan estudios de prefactibilidad y factibilidad.
- El proyecto se evalúa para determinar su viabilidad técnica, económica, social y ambiental.

#### 2. Inversión (o Ejecución)
- Fase donde se ejecuta el proyecto aprobado.
- Incluye la ejecución física (obras, adquisiciones) y la ejecución financiera (desembolsos).
- Se realiza seguimiento y monitoreo del avance.

#### 3. Postinversión
- Fase posterior a la finalización del proyecto.
- Incluye la operación y mantenimiento del activo generado.
- Se realiza evaluación ex-post para medir resultados e impactos.
- Se documentan lecciones aprendidas.

### Órgano Rector

El órgano rector del SNIP en la República Dominicana es el **Ministerio de Economía, Planificación y Desarrollo (MEPyD)**, que tiene la responsabilidad de:
- Emitir normas y metodologías para la formulación y evaluación de proyectos.
- Otorgar el código SNIP que certifica la viabilidad de los proyectos.
- Supervisar y dar seguimiento a la cartera de proyectos de inversión pública.

---

## Índice

- [Sistema Nacional de Inversión Pública; “sistema de inversión pública”](#sistema-nacional-de-inversion-publica-sistema-de-inversion-publica)
- [inversión estatal, inversión del sector público](#inversion-estatal-inversion-del-sector-publico)
- [proyecto público, iniciativa de inversión](#proyecto-publico-iniciativa-de-inversion)
- [gestion, administración](#gestion-administracion)
- [ciclo de proyecto, etapas del proyecto, fases](#ciclo-de-proyecto-etapas-del-proyecto-fases)
- [etapa de formulación, estudio previo](#etapa-de-formulacion-estudio-previo)
- [etapa de implementación, ejecución del proyecto](#etapa-de-implementacion-ejecucion-del-proyecto)
- [etapa de explotación, operación del proyecto](#etapa-de-explotacion-operacion-del-proyecto)
- [autoridad del SNIP, órgano de inversión pública](#autoridad-del-snip-organo-de-inversion-publica)
- [manuales metodológicos, guía técnica](#manuales-metodologicos-guia-tecnica)
- [base de proyectos, cartera de proyectos](#base-de-proyectos-cartera-de-proyectos)
- [plan plurianual de inversión pública](#plan-plurianual-de-inversion-publica)
- [jerarquización de proyectos, clasificación de prioridades](#jerarquizacion-de-proyectos-clasificacion-de-prioridades)
- [rentabilidad socioeconómica, análisis costo-beneficio](#rentabilidad-socioeconomica-analisis-costo-beneficio)
- [estudio técnico, prefactibilidad técnica](#estudio-tecnico-prefactibilidad-tecnica)
- [destinatarios del proyecto, usuarios finales](#destinatarios-del-proyecto-usuarios-finales)
- [precio social, costo alternativo](#precio-social-costo-alternativo)
- [mantenimiento operativo, administración del resultado](#mantenimiento-operativo-administracion-del-resultado)
- [métricas de impacto, indicadores de desempeño](#metricas-de-impacto-indicadores-de-desempeno)
- [entidad ejecutora, organismo responsable](#entidad-ejecutora-organismo-responsable)
- [fuentes de financiamiento, cofinanciación](#fuentes-de-financiamiento-cofinanciacion)
- [gasto de capital, inversión pública presupuestada](#gasto-de-capital-inversion-publica-presupuestada)
- [cobertura institucional, aplicación normativa](#cobertura-institucional-aplicacion-normativa)
- [tipología de proyectos, clasificación institucional](#tipologia-de-proyectos-clasificacion-institucional)
- [dictamen de admisibilidad, aprobación técnica](#dictamen-de-admisibilidad-aprobacion-tecnica)
- [control de admisión, revisión de requisitos](#control-de-admision-revision-de-requisitos)
- [ejecución financiera, seguimiento de obra](#ejecucion-financiera-seguimiento-de-obra)
- [reporte de ejecución, seguimiento de proyecto](#reporte-de-ejecucion-seguimiento-de-proyecto)
- [puesta en marcha, explotación del proyecto](#puesta-en-marcha-explotacion-del-proyecto)
- [evaluación de término, revisión final](#evaluacion-de-termino-revision-final)
- [evaluación previa, estudio de factibilidad](#evaluacion-previa-estudio-de-factibilidad)
- [costo-beneficio, evaluación económica](#costo-beneficio-evaluacion-economica)
- [retorno interno, IRR (en inglés)](#retorno-interno-irr-en-ingles)
- [valor actual neto, VAN](#valor-actual-neto-van)
- [planificación de inversiones, dirección estratégica](#planificacion-de-inversiones-direccion-estrategica)
- [política de inversión, directriz gubernamental](#politica-de-inversion-directriz-gubernamental)
- [acción estatal, inversión dirigida](#accion-estatal-inversion-dirigida)
- [recursos humanos, formación de capital](#recursos-humanos-formacion-de-capital)
- [infraestructura pública, activos de capital](#infraestructura-publica-activos-de-capital)
- [sostenibilidad institucional, sostenibilidad financiera](#sostenibilidad-institucional-sostenibilidad-financiera)
- [rendición de cuentas, gobierno abierto](#rendicion-de-cuentas-gobierno-abierto)
- [productividad, óptimo uso de recursos](#productividad-optimo-uso-de-recursos)
- [cumplimiento de objetivos, efectividad](#cumplimiento-de-objetivos-efectividad)
- [justicia social, acceso igualitario](#justicia-social-acceso-igualitario)
- [valor social agregado, beneficio social](#valor-social-agregado-beneficio-social)
- [management de proyectos públicos, dirección de proyectos públicos](#management-de-proyectos-publicos-direccion-de-proyectos-publicos)
- [consulta pública, involucramiento ciudadano](#consulta-publica-involucramiento-ciudadano)
- [incertidumbre del proyecto, contingencias](#incertidumbre-del-proyecto-contingencias)
- [innovación estatal, modernización de la inversión pública](#innovacion-estatal-modernizacion-de-la-inversion-publica)
- [integración institucional, sistema integrado de inversión pública](#integracion-institucional-sistema-integrado-de-inversion-publica)
- [regulación de inversión pública, normativa de proyectos](#regulacion-de-inversion-publica-normativa-de-proyectos)
- [auditoría pública, control de inversión](#auditoria-publica-control-de-inversion)
- [KPI de proyecto, métricas de gestión](#kpi-de-proyecto-metricas-de-gestion)
- [life cycle cost, costo total del proyecto](#life-cycle-cost-costo-total-del-proyecto)
- [tasa de oportunidad social, tasa de actualización social](#tasa-de-oportunidad-social-tasa-de-actualizacion-social)
- [análisis de escenarios, análisis de riesgos](#analisis-de-escenarios-analisis-de-riesgos)
- [sub-componente, parte del proyecto](#sub-componente-parte-del-proyecto)
- [indicador de insumo, input](#indicador-de-insumo-input)
- [output del proyecto, resultado inmediato](#output-del-proyecto-resultado-inmediato)
- [resultado final, outcome](#resultado-final-outcome)
- [punto de partida, línea de base](#punto-de-partida-linea-de-base)
- [horizonte temporal, periodo de evaluación](#horizonte-temporal-periodo-de-evaluacion)
- [costo adicional, incremento de gasto](#costo-adicional-incremento-de-gasto)
- [público objetivo, población objetivo](#publico-objetivo-poblacion-objetivo)
- [plan de inversión pública, programa de inversiones](#plan-de-inversion-publica-programa-de-inversiones)
- [programa público, agrupación de proyectos](#programa-publico-agrupacion-de-proyectos)
- [forecast financiero, estimación financiera](#forecast-financiero-estimacion-financiera)
- [efecto ambiental, análisis ambiental](#efecto-ambiental-analisis-ambiental)
- [medidas de mitigación, plan ambiental](#medidas-de-mitigacion-plan-ambiental)
- [análisis social, evaluación social](#analisis-social-evaluacion-social)
- [lógica de programa, cuadro de marco lógico](#logica-de-programa-cuadro-de-marco-logico)
- [evaluación de mitad de período, revisión intermedia](#evaluacion-de-mitad-de-periodo-revision-intermedia)
- [target de proyecto, grupo objetivo](#target-de-proyecto-grupo-objetivo)
- [formación institucional, desarrollo de capacidades](#formacion-institucional-desarrollo-de-capacidades)
- [aprendizaje institucional, lecciones aprendidas](#aprendizaje-institucional-lecciones-aprendidas)
- [seguimiento de proyecto, control de avances](#seguimiento-de-proyecto-control-de-avances)
- [control integrado, seguimiento combinado](#control-integrado-seguimiento-combinado)
- [memoria final, reporte final del proyecto](#memoria-final-reporte-final-del-proyecto)
- [pago, gasto ejecutado](#pago-gasto-ejecutado)
- [presupuesto asignado, acreditación de fondos](#presupuesto-asignado-acreditacion-de-fondos)
- [subsidio, aporte estatal](#subsidio-aporte-estatal)
- [asociación público-privada, acuerdo de concesión](#asociacion-publico-privada-acuerdo-de-concesion)
- [framework de resultados, esquema lógico](#framework-de-resultados-esquema-logico)
- [inversión de capital, gasto de inversión](#inversion-de-capital-gasto-de-inversion)
- [gasto operativo, mantenimiento recurrente](#gasto-operativo-mantenimiento-recurrente)
- [contrato de obra, acuerdo de ejecución](#contrato-de-obra-acuerdo-de-ejecucion)
- [estructura financiera, plan financiero](#estructura-financiera-plan-financiero)
- [desarrollo regional, equidad territorial](#desarrollo-regional-equidad-territorial)
- [sostenibilidad, desarrollo de largo plazo](#sostenibilidad-desarrollo-de-largo-plazo)
- [horizonte plurianual, plan plurianual](#horizonte-plurianual-plan-plurianual)
- [estrategia multisectorial, enfoque integral](#estrategia-multisectorial-enfoque-integral)
- [administración de riesgos, control de contingencias](#administracion-de-riesgos-control-de-contingencias)
- [comparación de proyectos, referencia de desempeño](#comparacion-de-proyectos-referencia-de-desempeno)
- [gobernanza institucional, estructura de gestión](#gobernanza-institucional-estructura-de-gestion)
- [gobierno del proyecto, dirección institucional](#gobierno-del-proyecto-direccion-institucional)
- [cooperación externa, donación internacional](#cooperacion-externa-donacion-internacional)
- [rentabilidad social, análisis socialmente orientado](#rentabilidad-social-analisis-socialmente-orientado)
- [estudio de factibilidad, informe técnico](#estudio-de-factibilidad-informe-tecnico)
- [ámbito geográfico del proyecto, cobertura territorial](#ambito-geografico-del-proyecto-cobertura-territorial)
- [compatibilización financiera, ajuste presupuestario](#compatibilizacion-financiera-ajuste-presupuestario)
- [integración de instituciones, colaboración institucional](#integracion-de-instituciones-colaboracion-institucional)
- [política sectorial, directriz sectorial](#politica-sectorial-directriz-sectorial)
- [registro SNIP, codificación de proyecto](#registro-snip-codificacion-de-proyecto)
- [innovación tecnológica, modernización técnica](#innovacion-tecnologica-modernizacion-tecnica)
- [infraestructura instalada, recursos operativos](#infraestructura-instalada-recursos-operativos)
- [costo por unidad, unidad de costo](#costo-por-unidad-unidad-de-costo)
- [inversión pública de calidad, gasto de inversión inteligente](#inversion-publica-de-calidad-gasto-de-inversion-inteligente)
- [proyecto certificado, proyecto validado](#proyecto-certificado-proyecto-validado)
- [plan de O&M, mantenimiento planificado](#plan-de-o-m-mantenimiento-planificado)
- [estudio de impacto ambiental, evaluación ambiental](#estudio-de-impacto-ambiental-evaluacion-ambiental)
- [inversión inicial, inversión total](#inversion-inicial-inversion-total)
- [resultado proyectado, ganancia esperada](#resultado-proyectado-ganancia-esperada)
- [retorno social, tasa de rentabilidad social](#retorno-social-tasa-de-rentabilidad-social)
- [método de priorización, selección de inversiones](#metodo-de-priorizacion-seleccion-de-inversiones)
- [umbral de viabilidad, criterio mínimo](#umbral-de-viabilidad-criterio-minimo)
- [plan de mitigación, plan de contingencia](#plan-de-mitigacion-plan-de-contingencia)
- [financiamiento orientado a resultados, pago basado en resultados](#financiamiento-orientado-a-resultados-pago-basado-en-resultados)
- [aprobación para ejecución, permiso de inicio](#aprobacion-para-ejecucion-permiso-de-inicio)
- [recuperación de capital, repago de inversión](#recuperacion-de-capital-repago-de-inversion)
- [sistema de M&E, gestión del desempeño](#sistema-de-m-e-gestion-del-desempeno)
- [infraestructura comunitaria, inversión social](#infraestructura-comunitaria-inversion-social)
- [infraestructura productiva, activo de crecimiento](#infraestructura-productiva-activo-de-crecimiento)
- [obra estatal, construcción pública](#obra-estatal-construccion-publica)
- [cronograma del proyecto, tiempo de ejecución](#cronograma-del-proyecto-tiempo-de-ejecucion)
- [sobrecosto, excedente presupuestario](#sobrecosto-excedente-presupuestario)
- [periodo de gestación, tiempo de espera](#periodo-de-gestacion-tiempo-de-espera)
- [reingeniería organizacional, ajuste institucional](#reingenieria-organizacional-ajuste-institucional)
- [sunk cost, costo irrecuperable](#sunk-cost-costo-irrecuperable)
- [referencia global, comparativo internacional](#referencia-global-comparativo-internacional)
- [business model público, estructura de ingresos-gastos públicos](#business-model-publico-estructura-de-ingresos-gastos-publicos)
- [moneda de análisis, divisa de estudio](#moneda-de-analisis-divisa-de-estudio)
- [accountability, rendición de cuentas](#accountability-rendicion-de-cuentas)
- [valor de salvamento, valor de terminación](#valor-de-salvamento-valor-de-terminacion)
- [compromiso financiero, obligaciones futuras](#compromiso-financiero-obligaciones-futuras)

## Sistema Nacional de Inversión Pública; “sistema de inversión pública”
- **slug:** sistema-nacional-de-inversion-publica-sistema-de-inversion-publica
- **definicion:** Conjunto de normas, instrucciones y procedimientos que tienen por objeto, en el contexto de un Estado moderno, ordenar el proceso de la inversión pública, para concretar los proyectos más rentables socio­económica y ambientalmente en la República Dominicana. (docs.republica-dominicana.justia.com)
- **sinonimos:** `Sistema Nacional de Inversión Pública`, `“sistema de inversión pública”`
- **canonico:** Sistema Nacional de Inversión Pública; “sistema de inversión pública”
- **normalizado:** `sistema nacional de inversion publica; sistema de inversion publica`

## inversión estatal, inversión del sector público
- **slug:** inversion-estatal-inversion-del-sector-publico
- **definicion:** Uso de recursos públicos o todo gasto público destinado a construir, ampliar, mejorar o reponer la capacidad productiva del país con el objeto de incrementar la producción de bienes y la prestación de servicios. Incluye las actividades de preinversión e inversión de las instituciones del sector público
- **sinonimos:** `inversión estatal`, `inversión del sector público`
- **canonico:** inversión estatal, inversión del sector público
- **normalizado:** `inversion estatal, inversion del sector publico`

## proyecto público, iniciativa de inversión
- **slug:** proyecto-publico-iniciativa-de-inversion
- **definicion:** Iniciativa concreta que demanda recursos públicos (o afectación presupuestaria) para generar bienes o servicios que respondan a una necesidad de la comunidad, y que ha sido sometida al proceso del SNIP. (sismap.gob.do)
- **sinonimos:** `proyecto público`, `iniciativa de inversión`
- **canonico:** proyecto público, iniciativa de inversión
- **normalizado:** `proyecto publico, iniciativa de inversion`

## gestion, administración
- **slug:** gestion-administracion
- **definicion:** La inversión pública se gestiona a través del Sistema Nacional de Inversión Pública (SNIP), que reúne el conjunto de normas, procedimientos e instructivos mediante los cuales se planifican, evalúan y administran los proyectos de inversión. Este sistema busca garantizar que los recursos públicos se destinen a los proyectos más convenientes desde el punto de vista económico, social y ambiental, en beneficio de la sociedad. El Ministerio de Hacienda y Economía es el órgano rector del Sistema Nacional de Inversión Pública y, como tal, tiene la responsabilidad de emitir el certificado que acredita que un proyecto de inversión cumple con los estándares de calidad establecidos por las normas y procedimientos del SNIP. Este certificado, conocido comúnmente como Código SNIP, permite que el proyecto pueda recibir financiamiento con recursos públicos para su ejecución, garantizando el cumplimiento normativo, la trazabilidad y la transparencia en el uso de los fondos.
- **sinonimos:** `gestion`, `administración`
- **canonico:** gestion, administración
- **normalizado:** `gestion, administracion`

## ciclo de proyecto, etapas del proyecto, fases
- **slug:** ciclo-de-proyecto-etapas-del-proyecto-fases
- **definicion:** Conjunto de procesos e instancias requeridas por la administración pública a fin de planificar, formular, programar, ejecutar y operar los proyectos de inversión hasta el momento en que estos sean incorporados en la normal operación de las entidades y por ende en demandas de recursos que son asumidas por el gasto corriente. Comprende las fases de: Planificación, Formulación, Programación, Ejecución, Evaluación y Cierre.
- **sinonimos:** `ciclo de proyecto`, `etapas del proyecto`, `fases`
- **canonico:** ciclo de proyecto, etapas del proyecto, fases
- **normalizado:** `ciclo de proyecto, etapas del proyecto, fases`

## etapa de formulación, estudio previo
- **slug:** etapa-de-formulacion-estudio-previo
- **definicion:** Etapa inicial del ciclo de vida del proyecto en la que se definen la idea, perfil, prefactibilidad, factibilidad, formulación y evaluación. (MEF)
- **sinonimos:** `etapa de formulación`, `estudio previo`
- **canonico:** etapa de formulación, estudio previo
- **normalizado:** `etapa de formulacion, estudio previo`

## etapa de implementación, ejecución del proyecto
- **slug:** etapa-de-implementacion-ejecucion-del-proyecto
- **definicion:** Etapa en que se concretan las obras o acciones del proyecto que fue aprobado, se gastan los recursos, se ejecuta el plan. (dgcp.gob.do)
- **sinonimos:** `etapa de implementación`, `ejecución del proyecto`
- **canonico:** etapa de implementación, ejecución del proyecto
- **normalizado:** `etapa de implementacion, ejecucion del proyecto`

## etapa de explotación, operación del proyecto
- **slug:** etapa-de-explotacion-operacion-del-proyecto
- **definicion:** Etapa en la que el proyecto ya está instalado y genera los bienes o servicios para los beneficiarios, y se realiza operación y mantenimiento. (sismap.gob.do)
- **sinonimos:** `etapa de explotación`, `operación del proyecto`
- **canonico:** etapa de explotación, operación del proyecto
- **normalizado:** `etapa de explotacion, operacion del proyecto`

## autoridad del SNIP, órgano de inversión pública
- **slug:** autoridad-del-snip-organo-de-inversion-publica
- **definicion:** Entidad del Estado encargada de coordinar, analizar, evaluar, aprobar y supervisar el sistema SNIP y los proyectos del sector público. En RD, corresponde al Ministerio de Economía, Planificación y Desarrollo (Ministerio de Hacienda y Economía) y su unidad técnica. (sismap.gob.do)
- **sinonimos:** `autoridad del SNIP`, `órgano de inversión pública`
- **canonico:** autoridad del SNIP, órgano de inversión pública
- **normalizado:** `autoridad del snip, organo de inversion publica`

## manuales metodológicos, guía técnica
- **slug:** manuales-metodologicos-guia-tecnica
- **definicion:** Conjunto de reglas, lineamientos metodológicos, manuales e instructivos para la formulación, evaluación, gestión y seguimiento de proyectos de inversión pública. (Ministerio de Hacienda y Economía.gob.do)
- **sinonimos:** `manuales metodológicos`, `guía técnica`
- **canonico:** manuales metodológicos, guía técnica
- **normalizado:** `manuales metodologicos, guia tecnica`

## base de proyectos, cartera de proyectos
- **slug:** base-de-proyectos-cartera-de-proyectos
- **definicion:** Sistema de información (registro/ base de datos) que agrupa los proyectos de inversión pública, con información estandarizada, que sirven de cartera al Estado para seleccionar, priorizar y monitorear. (docs.republica-dominicana.justia.com)
- **sinonimos:** `base de proyectos`, `cartera de proyectos`
- **canonico:** base de proyectos, cartera de proyectos
- **normalizado:** `base de proyectos, cartera de proyectos`

## plan plurianual de inversión pública
- **slug:** plan-plurianual-de-inversion-publica
- **definicion:** Instrumento de planificación que recoge los proyectos de inversión pública priorizados para un horizonte plurianual, vinculados al presupuesto. (dgcp.gob.do)
- **sinonimos:** `plan plurianual de inversión pública`
- **canonico:** plan plurianual de inversión pública
- **normalizado:** `plan plurianual de inversion publica`

## jerarquización de proyectos, clasificación de prioridades
- **slug:** jerarquizacion-de-proyectos-clasificacion-de-prioridades
- **definicion:** Criterio mediante el cual se seleccionan o jerarquizan los proyectos en función de su rentabilidad socioeconómica, factibilidad y alineación con políticas públicas. (Ministerio de Hacienda y Economía.gob.do)
- **sinonimos:** `jerarquización de proyectos`, `clasificación de prioridades`
- **canonico:** jerarquización de proyectos, clasificación de prioridades
- **normalizado:** `jerarquizacion de proyectos, clasificacion de prioridades`

## rentabilidad socioeconómica, análisis costo-beneficio
- **slug:** rentabilidad-socioeconomica-analisis-costo-beneficio
- **definicion:** Evaluación de los beneficios versus costos de un proyecto desde una perspectiva financiera y económica, para establecer si es rentable para la sociedad. (MEF)
- **sinonimos:** `rentabilidad socioeconómica`, `análisis costo-beneficio`
- **canonico:** rentabilidad socioeconómica, análisis costo-beneficio
- **normalizado:** `rentabilidad socioeconomica, analisis costo-beneficio`

## estudio técnico, prefactibilidad técnica
- **slug:** estudio-tecnico-prefactibilidad-tecnica
- **definicion:** Estudio que determina si es técnicamente posible ejecutar el proyecto, en términos de tecnología, recursos, localización, plazos, entre otros. (MEF)
- **sinonimos:** `estudio técnico`, `prefactibilidad técnica`
- **canonico:** estudio técnico, prefactibilidad técnica
- **normalizado:** `estudio tecnico, prefactibilidad tecnica`

## destinatarios del proyecto, usuarios finales
- **slug:** destinatarios-del-proyecto-usuarios-finales
- **definicion:** Personas, comunidades o grupos que recibirán directa o indirectamente los bienes o servicios producidos por el proyecto de inversión pública.
- **sinonimos:** `destinatarios del proyecto`, `usuarios finales`
- **canonico:** destinatarios del proyecto, usuarios finales
- **normalizado:** `destinatarios del proyecto, usuarios finales`

## precio social, costo alternativo
- **slug:** precio-social-costo-alternativo
- **definicion:** Valor del mejor uso alternativo de los recursos utilizados en el proyecto — es decir, lo que se deja de ganar al usar estos recursos para otro fin. (docs.republica-dominicana.justia.com)
- **sinonimos:** `precio social`, `costo alternativo`
- **canonico:** precio social, costo alternativo
- **normalizado:** `precio social, costo alternativo`

## mantenimiento operativo, administración del resultado
- **slug:** mantenimiento-operativo-administracion-del-resultado
- **definicion:** Actividades necesarias para que el bien o servicio generado por el proyecto permanezca funcional y produzca los resultados esperados en el tiempo.
- **sinonimos:** `mantenimiento operativo`, `administración del resultado`
- **canonico:** mantenimiento operativo, administración del resultado
- **normalizado:** `mantenimiento operativo, administracion del resultado`

## métricas de impacto, indicadores de desempeño
- **slug:** metricas-de-impacto-indicadores-de-desempeno
- **definicion:** Medidas cuantitativas o cualitativas que permiten evaluar los efectos del proyecto: lo que cambió, qué se produjo, qué beneficio se obtuvo.
- **sinonimos:** `métricas de impacto`, `indicadores de desempeño`
- **canonico:** métricas de impacto, indicadores de desempeño
- **normalizado:** `metricas de impacto, indicadores de desempeno`

## entidad ejecutora, organismo responsable
- **slug:** entidad-ejecutora-organismo-responsable
- **definicion:** Institución pública responsable de ejecutar el proyecto de inversión, conforme a lo aprobado en el SNIP.
- **sinonimos:** `entidad ejecutora`, `organismo responsable`
- **canonico:** entidad ejecutora, organismo responsable
- **normalizado:** `entidad ejecutora, organismo responsable`

## fuentes de financiamiento, cofinanciación
- **slug:** fuentes-de-financiamiento-cofinanciacion
- **definicion:** Recursos (nacionales o externos) destinados a cubrir los costos del proyecto de inversión pública.
- **sinonimos:** `fuentes de financiamiento`, `cofinanciación`
- **canonico:** fuentes de financiamiento, cofinanciación
- **normalizado:** `fuentes de financiamiento, cofinanciacion`

## gasto de capital, inversión pública presupuestada
- **slug:** gasto-de-capital-inversion-publica-presupuestada
- **definicion:** Parte del presupuesto público anual destinada a inversiones públicas, que debe vincularse al plan plurianual y al SNIP. (dgcp.gob.do)
- **sinonimos:** `gasto de capital`, `inversión pública presupuestada`
- **canonico:** gasto de capital, inversión pública presupuestada
- **normalizado:** `gasto de capital, inversion publica presupuestada`

## cobertura institucional, aplicación normativa
- **slug:** cobertura-institucional-aplicacion-normativa
- **definicion:** Conjunto de entidades, niveles de gobierno (nacional, regional, municipal) que están sujetas al SNIP y deben cumplir sus normas. (sismap.gob.do)
- **sinonimos:** `cobertura institucional`, `aplicación normativa`
- **canonico:** cobertura institucional, aplicación normativa
- **normalizado:** `cobertura institucional, aplicacion normativa`

## tipología de proyectos, clasificación institucional
- **slug:** tipologia-de-proyectos-clasificacion-institucional
- **definicion:** Criterios establecidos para agrupar los proyectos según su naturaleza, sector, etapa, financiamiento, tamaño, etc. (sismap.gob.do)
- **sinonimos:** `tipología de proyectos`, `clasificación institucional`
- **canonico:** tipología de proyectos, clasificación institucional
- **normalizado:** `tipologia de proyectos, clasificacion institucional`

## dictamen de admisibilidad, aprobación técnica
- **slug:** dictamen-de-admisibilidad-aprobacion-tecnica
- **definicion:** Opinión o visto bueno del órgano rector (o instancia competente) sobre la viabilidad y cumplimiento del proyecto para ser incluido en la cartera o presupuesto. (dgcp.gob.do)
- **sinonimos:** `dictamen de admisibilidad`, `aprobación técnica`
- **canonico:** dictamen de admisibilidad, aprobación técnica
- **normalizado:** `dictamen de admisibilidad, aprobacion tecnica`

## control de admisión, revisión de requisitos
- **slug:** control-de-admision-revision-de-requisitos
- **definicion:** Verificación inicial de que el proyecto cumple con requisitos mínimos para entrar al proceso de evaluación del SNIP.
- **sinonimos:** `control de admisión`, `revisión de requisitos`
- **canonico:** control de admisión, revisión de requisitos
- **normalizado:** `control de admision, revision de requisitos`

## ejecución financiera, seguimiento de obra
- **slug:** ejecucion-financiera-seguimiento-de-obra
- **definicion:** Seguimiento conjunto del cumplimiento tanto de los avances físicos (obra, equipo) como de los desembolsos financieros del proyecto.
- **sinonimos:** `ejecución financiera`, `seguimiento de obra`
- **canonico:** ejecución financiera, seguimiento de obra
- **normalizado:** `ejecucion financiera, seguimiento de obra`

## reporte de ejecución, seguimiento de proyecto
- **slug:** reporte-de-ejecucion-seguimiento-de-proyecto
- **definicion:** Documento mediante el cual la unidad ejecutora rinde cuenta del estado del proyecto: plazos, costos, hitos alcanzados.
- **sinonimos:** `reporte de ejecución`, `seguimiento de proyecto`
- **canonico:** reporte de ejecución, seguimiento de proyecto
- **normalizado:** `reporte de ejecucion, seguimiento de proyecto`

## puesta en marcha, explotación del proyecto
- **slug:** puesta-en-marcha-explotacion-del-proyecto
- **definicion:** Momento en que el proyecto ya está entregado, funcionando y ofreciendo bienes o servicios al usuario final. Está ligado a O&M. (sismap.gob.do)
- **sinonimos:** `puesta en marcha`, `explotación del proyecto`
- **canonico:** puesta en marcha, explotación del proyecto
- **normalizado:** `puesta en marcha, explotacion del proyecto`

## evaluación de término, revisión final
- **slug:** evaluacion-de-termino-revision-final
- **definicion:** Estudio que verifica los resultados, impactos y sostenibilidad de un proyecto ya concluido, comparando lo logrado con lo planificado.
- **sinonimos:** `evaluación de término`, `revisión final`
- **canonico:** evaluación de término, revisión final
- **normalizado:** `evaluacion de termino, revision final`

## evaluación previa, estudio de factibilidad
- **slug:** evaluacion-previa-estudio-de-factibilidad
- **definicion:** Estudio realizado antes de la ejecución (normalmente en preinversión) que analiza diferentes alternativas, costos, beneficios y selecciona la óptima.
- **sinonimos:** `evaluación previa`, `estudio de factibilidad`
- **canonico:** evaluación previa, estudio de factibilidad
- **normalizado:** `evaluacion previa, estudio de factibilidad`

## costo-beneficio, evaluación económica
- **slug:** costo-beneficio-evaluacion-economica
- **definicion:** Técnica que compara los costos y los beneficios sociales del proyecto expresados en valor presente para determinar su conveniencia.
- **sinonimos:** `costo-beneficio`, `evaluación económica`
- **canonico:** costo-beneficio, evaluación económica
- **normalizado:** `costo-beneficio, evaluacion economica`

## retorno interno, IRR (en inglés)
- **slug:** retorno-interno-irr-en-ingles
- **definicion:** Indicador financiero que mide la rentabilidad interna de un proyecto de inversión, comparando flujos y costos.
- **sinonimos:** `retorno interno`, `IRR (en inglés)`
- **canonico:** retorno interno, IRR (en inglés)
- **normalizado:** `retorno interno, irr (en ingles)`

## valor actual neto, VAN
- **slug:** valor-actual-neto-van
- **definicion:** Indicador económico que calcula la diferencia entre los beneficios y costos de un proyecto, actualizados al presente.
- **sinonimos:** `valor actual neto`, `VAN`
- **canonico:** valor actual neto, VAN
- **normalizado:** `valor actual neto, van`

## planificación de inversiones, dirección estratégica
- **slug:** planificacion-de-inversiones-direccion-estrategica
- **definicion:** Proceso mediante el cual se determinan la dirección, los objetivos, políticas y prioridades de desarrollo que orientan la inversión pública.
- **sinonimos:** `planificación de inversiones`, `dirección estratégica`
- **canonico:** planificación de inversiones, dirección estratégica
- **normalizado:** `planificacion de inversiones, direccion estrategica`

## política de inversión, directriz gubernamental
- **slug:** politica-de-inversion-directriz-gubernamental
- **definicion:** Conjunto de decisiones y acciones del Estado que establecen prioridades, normas y recursos para el desarrollo, las cuales deben orientar la inversión pública.
- **sinonimos:** `política de inversión`, `directriz gubernamental`
- **canonico:** política de inversión, directriz gubernamental
- **normalizado:** `politica de inversion, directriz gubernamental`

## acción estatal, inversión dirigida
- **slug:** accion-estatal-inversion-dirigida
- **definicion:** Acción del Estado en un área determinada mediante la inversión pública o regulación para corregir fallas de mercado o promover desarrollo.
- **sinonimos:** `acción estatal`, `inversión dirigida`
- **canonico:** acción estatal, inversión dirigida
- **normalizado:** `accion estatal, inversion dirigida`

## recursos humanos, formación de capital
- **slug:** recursos-humanos-formacion-de-capital
- **definicion:** Habilidad, conocimientos, salud y competencias de las personas, considerado como parte de la inversión pública cuando se destinan recursos para ello.
- **sinonimos:** `recursos humanos`, `formación de capital`
- **canonico:** recursos humanos, formación de capital
- **normalizado:** `recursos humanos, formacion de capital`

## infraestructura pública, activos de capital
- **slug:** infraestructura-publica-activos-de-capital
- **definicion:** Bienes tangibles (infraestructura, maquinaria, edificios) construidos o adquiridos por medio de inversión pública.
- **sinonimos:** `infraestructura pública`, `activos de capital`
- **canonico:** infraestructura pública, activos de capital
- **normalizado:** `infraestructura publica, activos de capital`

## sostenibilidad institucional, sostenibilidad financiera
- **slug:** sostenibilidad-institucional-sostenibilidad-financiera
- **definicion:** Cualidad de que los resultados del proyecto sean duraderos en el tiempo, sin deterioro, y con mantenimiento adecuado.
- **sinonimos:** `sostenibilidad institucional`, `sostenibilidad financiera`
- **canonico:** sostenibilidad institucional, sostenibilidad financiera
- **normalizado:** `sostenibilidad institucional, sostenibilidad financiera`

## rendición de cuentas, gobierno abierto
- **slug:** rendicion-de-cuentas-gobierno-abierto
- **definicion:** Principio de que los procesos, recursos y resultados de la inversión pública sean visibles, verificables y accesibles para la ciudadanía. (dgcp.gob.do)
- **sinonimos:** `rendición de cuentas`, `gobierno abierto`
- **canonico:** rendición de cuentas, gobierno abierto
- **normalizado:** `rendicion de cuentas, gobierno abierto`

## productividad, óptimo uso de recursos
- **slug:** productividad-optimo-uso-de-recursos
- **definicion:** Uso óptimo de los recursos para alcanzar los resultados deseados con el menor costo posible.
- **sinonimos:** `productividad`, `óptimo uso de recursos`
- **canonico:** productividad, óptimo uso de recursos
- **normalizado:** `productividad, optimo uso de recursos`

## cumplimiento de objetivos, efectividad
- **slug:** cumplimiento-de-objetivos-efectividad
- **definicion:** Grado en que se alcanzan los objetivos o resultados esperados del proyecto.
- **sinonimos:** `cumplimiento de objetivos`, `efectividad`
- **canonico:** cumplimiento de objetivos, efectividad
- **normalizado:** `cumplimiento de objetivos, efectividad`

## justicia social, acceso igualitario
- **slug:** justicia-social-acceso-igualitario
- **definicion:** Distribución justa de los beneficios de la inversión pública entre diferentes grupos sociales y territorios.
- **sinonimos:** `justicia social`, `acceso igualitario`
- **canonico:** justicia social, acceso igualitario
- **normalizado:** `justicia social, acceso igualitario`

## valor social agregado, beneficio social
- **slug:** valor-social-agregado-beneficio-social
- **definicion:** Valor social generado por el proyecto en términos de bienestar, más allá de los beneficios estrictamente económicos.
- **sinonimos:** `valor social agregado`, `beneficio social`
- **canonico:** valor social agregado, beneficio social
- **normalizado:** `valor social agregado, beneficio social`

## management de proyectos públicos, dirección de proyectos públicos
- **slug:** management-de-proyectos-publicos-direccion-de-proyectos-publicos
- **definicion:** Conjunto de prácticas y procesos que aseguran que el proyecto público sea formulado, ejecutado, monitoreado y evaluado conforme a estándares.
- **sinonimos:** `management de proyectos públicos`, `dirección de proyectos públicos`
- **canonico:** management de proyectos públicos, dirección de proyectos públicos
- **normalizado:** `management de proyectos publicos, direccion de proyectos publicos`

## consulta pública, involucramiento ciudadano
- **slug:** consulta-publica-involucramiento-ciudadano
- **definicion:** Inclusión de la sociedad civil en la fase de formulación, seguimiento o evaluación de proyectos de inversión para asegurar legitimidad y transparencia.
- **sinonimos:** `consulta pública`, `involucramiento ciudadano`
- **canonico:** consulta pública, involucramiento ciudadano
- **normalizado:** `consulta publica, involucramiento ciudadano`

## incertidumbre del proyecto, contingencias
- **slug:** incertidumbre-del-proyecto-contingencias
- **definicion:** Probabilidad de que ocurran eventos adversos que afecten los resultados, costos, plazos o impacto del proyecto.
- **sinonimos:** `incertidumbre del proyecto`, `contingencias`
- **canonico:** incertidumbre del proyecto, contingencias
- **normalizado:** `incertidumbre del proyecto, contingencias`

## innovación estatal, modernización de la inversión pública
- **slug:** innovacion-estatal-modernizacion-de-la-inversion-publica
- **definicion:** Introducción de nuevas prácticas, tecnologías o modelos en la inversión pública para mejorar eficiencia, calidad o impacto.
- **sinonimos:** `innovación estatal`, `modernización de la inversión pública`
- **canonico:** innovación estatal, modernización de la inversión pública
- **normalizado:** `innovacion estatal, modernizacion de la inversion publica`

## integración institucional, sistema integrado de inversión pública
- **slug:** integracion-institucional-sistema-integrado-de-inversion-publica
- **definicion:** Capacidad de los sistemas públicos y entidades de coordinarse, intercambiar información y operar de manera conjunta, aplicada al SNIP para seguimiento y control.
- **sinonimos:** `integración institucional`, `sistema integrado de inversión pública`
- **canonico:** integración institucional, sistema integrado de inversión pública
- **normalizado:** `integracion institucional, sistema integrado de inversion publica`

## regulación de inversión pública, normativa de proyectos
- **slug:** regulacion-de-inversion-publica-normativa-de-proyectos
- **definicion:** Conjunto de leyes, reglamentos, normas técnicas e instructivos que regulan el SNIP y la inversión pública. (Ministerio de Hacienda y Economía.gob.do)
- **sinonimos:** `regulación de inversión pública`, `normativa de proyectos`
- **canonico:** regulación de inversión pública, normativa de proyectos
- **normalizado:** `regulacion de inversion publica, normativa de proyectos`

## auditoría pública, control de inversión
- **slug:** auditoria-publica-control-de-inversion
- **definicion:** Control, auditoría o supervisión externa e interna de los proyectos y del uso de los recursos de inversión pública.
- **sinonimos:** `auditoría pública`, `control de inversión`
- **canonico:** auditoría pública, control de inversión
- **normalizado:** `auditoria publica, control de inversion`

## KPI de proyecto, métricas de gestión
- **slug:** kpi-de-proyecto-metricas-de-gestion
- **definicion:** Medida que permite valorar la eficiencia, eficacia o impacto de un proyecto o programa de inversión pública.
- **sinonimos:** `KPI de proyecto`, `métricas de gestión`
- **canonico:** KPI de proyecto, métricas de gestión
- **normalizado:** `kpi de proyecto, metricas de gestion`

## life cycle cost, costo total del proyecto
- **slug:** life-cycle-cost-costo-total-del-proyecto
- **definicion:** Estimación de todos los costos que genera un proyecto desde su inicio hasta su retiro o renovación, incluyendo operación, mantenimiento y eventual sustitución.
- **sinonimos:** `life cycle cost`, `costo total del proyecto`
- **canonico:** life cycle cost, costo total del proyecto
- **normalizado:** `life cycle cost, costo total del proyecto`

## tasa de oportunidad social, tasa de actualización social
- **slug:** tasa-de-oportunidad-social-tasa-de-actualizacion-social
- **definicion:** Tasa utilizada para actualizar los flujos de beneficios y costos futuros al presente, en el análisis costo-beneficio.
- **sinonimos:** `tasa de oportunidad social`, `tasa de actualización social`
- **canonico:** tasa de oportunidad social, tasa de actualización social
- **normalizado:** `tasa de oportunidad social, tasa de actualizacion social`

## análisis de escenarios, análisis de riesgos
- **slug:** analisis-de-escenarios-analisis-de-riesgos
- **definicion:** Evaluación del efecto de cambios en variables clave (costos, beneficios, plazos) sobre la rentabilidad o viabilidad del proyecto.
- **sinonimos:** `análisis de escenarios`, `análisis de riesgos`
- **canonico:** análisis de escenarios, análisis de riesgos
- **normalizado:** `analisis de escenarios, analisis de riesgos`

## sub-componente, parte del proyecto
- **slug:** sub-componente-parte-del-proyecto
- **definicion:** Cada parte funcional o física del proyecto que contribuye al conjunto (por ejemplo: edificaciones, equipamiento, capacitación).
- **sinonimos:** `sub-componente`, `parte del proyecto`
- **canonico:** sub-componente, parte del proyecto
- **normalizado:** `sub-componente, parte del proyecto`

## indicador de insumo, input
- **slug:** indicador-de-insumo-input
- **definicion:** Insumo medible que se utiliza para llevar a cabo el proyecto (por ejemplo recursos humanos, materiales, tiempo).
- **sinonimos:** `indicador de insumo`, `input`
- **canonico:** indicador de insumo, input
- **normalizado:** `indicador de insumo, input`

## output del proyecto, resultado inmediato
- **slug:** output-del-proyecto-resultado-inmediato
- **definicion:** Bien o servicio que resulta directamente del proyecto, medible en cantidad o calidad.
- **sinonimos:** `output del proyecto`, `resultado inmediato`
- **canonico:** output del proyecto, resultado inmediato
- **normalizado:** `output del proyecto, resultado inmediato`

## resultado final, outcome
- **slug:** resultado-final-outcome
- **definicion:** Efecto en el medio o la comunidad que surge como consecuencia del producto del proyecto; más amplio y de largo plazo.
- **sinonimos:** `resultado final`, `outcome`
- **canonico:** resultado final, outcome
- **normalizado:** `resultado final, outcome`

## punto de partida, línea de base
- **slug:** punto-de-partida-linea-de-base
- **definicion:** Línea de referencia inicial que describe la situación antes del inicio del proyecto, contra la cual se medirán los efectos.
- **sinonimos:** `punto de partida`, `línea de base`
- **canonico:** punto de partida, línea de base
- **normalizado:** `punto de partida, linea de base`

## horizonte temporal, periodo de evaluación
- **slug:** horizonte-temporal-periodo-de-evaluacion
- **definicion:** Periodo de tiempo considerado en el análisis técnico-económico del proyecto para evaluar los costos, beneficios y sostenibilidad.
- **sinonimos:** `horizonte temporal`, `periodo de evaluación`
- **canonico:** horizonte temporal, periodo de evaluación
- **normalizado:** `horizonte temporal, periodo de evaluacion`

## costo adicional, incremento de gasto
- **slug:** costo-adicional-incremento-de-gasto
- **definicion:** Costo adicional que debe responder a la ejecución del proyecto, sobre la situación base sin proyecto.
- **sinonimos:** `costo adicional`, `incremento de gasto`
- **canonico:** costo adicional, incremento de gasto
- **normalizado:** `costo adicional, incremento de gasto`

## público objetivo, población objetivo
- **slug:** publico-objetivo-poblacion-objetivo
- **definicion:** Conjunto de beneficiarios o demanda potencial a la que va dirigido el bien o servicio que producirá el proyecto.
- **sinonimos:** `público objetivo`, `población objetivo`
- **canonico:** público objetivo, población objetivo
- **normalizado:** `publico objetivo, poblacion objetivo`

## plan de inversión pública, programa de inversiones
- **slug:** plan-de-inversion-publica-programa-de-inversiones
- **definicion:** Documento que detalla los proyectos planificados con su cronograma y financiamiento para un horizonte definido.
- **sinonimos:** `plan de inversión pública`, `programa de inversiones`
- **canonico:** plan de inversión pública, programa de inversiones
- **normalizado:** `plan de inversion publica, programa de inversiones`

## programa público, agrupación de proyectos
- **slug:** programa-publico-agrupacion-de-proyectos
- **definicion:** Conjunto de proyectos o componentes agrupados que persiguen una meta común dentro del SNIP.
- **sinonimos:** `programa público`, `agrupación de proyectos`
- **canonico:** programa público, agrupación de proyectos
- **normalizado:** `programa publico, agrupacion de proyectos`

## forecast financiero, estimación financiera
- **slug:** forecast-financiero-estimacion-financiera
- **definicion:** Estimación de ingresos, costos y flujos de caja futuros del proyecto, para la evaluación de su viabilidad.
- **sinonimos:** `forecast financiero`, `estimación financiera`
- **canonico:** forecast financiero, estimación financiera
- **normalizado:** `forecast financiero, estimacion financiera`

## efecto ambiental, análisis ambiental
- **slug:** efecto-ambiental-analisis-ambiental
- **definicion:** Cambio en el medio ambiente provocado por el proyecto, que debe ser evaluado, mitigado o compensado.
- **sinonimos:** `efecto ambiental`, `análisis ambiental`
- **canonico:** efecto ambiental, análisis ambiental
- **normalizado:** `efecto ambiental, analisis ambiental`

## medidas de mitigación, plan ambiental
- **slug:** medidas-de-mitigacion-plan-ambiental
- **definicion:** Conjunto de medidas que reducen o corrigen los efectos negativos generados por el proyecto sobre el ambiente o la sociedad.
- **sinonimos:** `medidas de mitigación`, `plan ambiental`
- **canonico:** medidas de mitigación, plan ambiental
- **normalizado:** `medidas de mitigacion, plan ambiental`

## análisis social, evaluación social
- **slug:** analisis-social-evaluacion-social
- **definicion:** Análisis que identifica los efectos sociales (positivos o negativos) de un proyecto, y define medidas de gestión social.
- **sinonimos:** `análisis social`, `evaluación social`
- **canonico:** análisis social, evaluación social
- **normalizado:** `analisis social, evaluacion social`

## lógica de programa, cuadro de marco lógico
- **slug:** logica-de-programa-cuadro-de-marco-logico
- **definicion:** Herramienta de gestión de proyectos que estructura, en forma lógica, los objetivos, resultados, actividades e indicadores del proyecto.
- **sinonimos:** `lógica de programa`, `cuadro de marco lógico`
- **canonico:** lógica de programa, cuadro de marco lógico
- **normalizado:** `logica de programa, cuadro de marco logico`

## evaluación de mitad de período, revisión intermedia
- **slug:** evaluacion-de-mitad-de-periodo-revision-intermedia
- **definicion:** Evaluación que se hace durante la implementación del proyecto para medir avances, identificar ajustes y redireccionamientos.
- **sinonimos:** `evaluación de mitad de período`, `revisión intermedia`
- **canonico:** evaluación de mitad de período, revisión intermedia
- **normalizado:** `evaluacion de mitad de periodo, revision intermedia`

## target de proyecto, grupo objetivo
- **slug:** target-de-proyecto-grupo-objetivo
- **definicion:** Grupo específico de personas que el proyecto busca beneficiar directa o indirectamente.
- **sinonimos:** `target de proyecto`, `grupo objetivo`
- **canonico:** target de proyecto, grupo objetivo
- **normalizado:** `target de proyecto, grupo objetivo`

## formación institucional, desarrollo de capacidades
- **slug:** formacion-institucional-desarrollo-de-capacidades
- **definicion:** Fortalecimiento de capacidades técnicas, administrativas y de gestión de las instituciones que participan en el SNIP.
- **sinonimos:** `formación institucional`, `desarrollo de capacidades`
- **canonico:** formación institucional, desarrollo de capacidades
- **normalizado:** `formacion institucional, desarrollo de capacidades`

## aprendizaje institucional, lecciones aprendidas
- **slug:** aprendizaje-institucional-lecciones-aprendidas
- **definicion:** Procesos de recopilación, sistematización y uso de experiencias y lecciones aprendidas de los proyectos de inversión pública.
- **sinonimos:** `aprendizaje institucional`, `lecciones aprendidas`
- **canonico:** aprendizaje institucional, lecciones aprendidas
- **normalizado:** `aprendizaje institucional, lecciones aprendidas`

## seguimiento de proyecto, control de avances
- **slug:** seguimiento-de-proyecto-control-de-avances
- **definicion:** Seguimiento sistemático del desarrollo del proyecto, de sus indicadores, actividades, plazos y costos.
- **sinonimos:** `seguimiento de proyecto`, `control de avances`
- **canonico:** seguimiento de proyecto, control de avances
- **normalizado:** `seguimiento de proyecto, control de avances`

## control integrado, seguimiento combinado
- **slug:** control-integrado-seguimiento-combinado
- **definicion:** Combinación de monitoreo de los avances físicos y del gasto ejecutado del proyecto.
- **sinonimos:** `control integrado`, `seguimiento combinado`
- **canonico:** control integrado, seguimiento combinado
- **normalizado:** `control integrado, seguimiento combinado`

## memoria final, reporte final del proyecto
- **slug:** memoria-final-reporte-final-del-proyecto
- **definicion:** Documento final que presenta la ejecución, los resultados y lecciones aprendidas al término del proyecto.
- **sinonimos:** `memoria final`, `reporte final del proyecto`
- **canonico:** memoria final, reporte final del proyecto
- **normalizado:** `memoria final, reporte final del proyecto`

## pago, gasto ejecutado
- **slug:** pago-gasto-ejecutado
- **definicion:** Transferencia de fondos o recursos al proyecto por parte de la entidad financiera o pública responsable.
- **sinonimos:** `pago`, `gasto ejecutado`
- **canonico:** pago, gasto ejecutado
- **normalizado:** `pago, gasto ejecutado`

## presupuesto asignado, acreditación de fondos
- **slug:** presupuesto-asignado-acreditacion-de-fondos
- **definicion:** Distribución de recursos públicos a proyectos o programas dentro del presupuesto de inversión.
- **sinonimos:** `presupuesto asignado`, `acreditación de fondos`
- **canonico:** presupuesto asignado, acreditación de fondos
- **normalizado:** `presupuesto asignado, acreditacion de fondos`

## subsidio, aporte estatal
- **slug:** subsidio-aporte-estatal
- **definicion:** Recurso otorgado por el Estado a un proyecto, sin exigencia de retorno financiero (o con retorno irracional), para promover cierto bien público.
- **sinonimos:** `subsidio`, `aporte estatal`
- **canonico:** subsidio, aporte estatal
- **normalizado:** `subsidio, aporte estatal`

## asociación público-privada, acuerdo de concesión
- **slug:** asociacion-publico-privada-acuerdo-de-concesion
- **definicion:** Contrato por el cual el Estado delega a una entidad privada la construcción, operación o mantenimiento de una infraestructura, manteniendo una supervisión pública. (dgcp.gob.do)
- **sinonimos:** `asociación público-privada`, `acuerdo de concesión`
- **canonico:** asociación público-privada, acuerdo de concesión
- **normalizado:** `asociacion publico-privada, acuerdo de concesion`

## framework de resultados, esquema lógico
- **slug:** framework-de-resultados-esquema-logico
- **definicion:** Estructura que vincula los insumos, actividades, productos, resultados e impactos esperados del proyecto.
- **sinonimos:** `framework de resultados`, `esquema lógico`
- **canonico:** framework de resultados, esquema lógico
- **normalizado:** `framework de resultados, esquema logico`

## inversión de capital, gasto de inversión
- **slug:** inversion-de-capital-gasto-de-inversion
- **definicion:** Gasto de capital destinado a la adquisición, construcción o mejora de activos fijos del proyecto.
- **sinonimos:** `inversión de capital`, `gasto de inversión`
- **canonico:** inversión de capital, gasto de inversión
- **normalizado:** `inversion de capital, gasto de inversion`

## gasto operativo, mantenimiento recurrente
- **slug:** gasto-operativo-mantenimiento-recurrente
- **definicion:** Gasto recurrente requerido para que los activos generados por el proyecto funcionen, incluyendo mantenimiento, operación, personal.
- **sinonimos:** `gasto operativo`, `mantenimiento recurrente`
- **canonico:** gasto operativo, mantenimiento recurrente
- **normalizado:** `gasto operativo, mantenimiento recurrente`

## contrato de obra, acuerdo de ejecución
- **slug:** contrato-de-obra-acuerdo-de-ejecucion
- **definicion:** Acuerdo jurídico suscrito para la ejecución de obras, servicios o suministro dentro del proyecto de inversión pública.
- **sinonimos:** `contrato de obra`, `acuerdo de ejecución`
- **canonico:** contrato de obra, acuerdo de ejecución
- **normalizado:** `contrato de obra, acuerdo de ejecucion`

## estructura financiera, plan financiero
- **slug:** estructura-financiera-plan-financiero
- **definicion:** Conjunto de supuestos, fuentes, costos, plazos y estructuras de financiamiento que permiten proyectar la viabilidad y ejecución del proyecto.
- **sinonimos:** `estructura financiera`, `plan financiero`
- **canonico:** estructura financiera, plan financiero
- **normalizado:** `estructura financiera, plan financiero`

## desarrollo regional, equidad territorial
- **slug:** desarrollo-regional-equidad-territorial
- **definicion:** Enfoque que vincula la inversión pública con la distribución de recursos y oportunidades entre regiones o municipios.
- **sinonimos:** `desarrollo regional`, `equidad territorial`
- **canonico:** desarrollo regional, equidad territorial
- **normalizado:** `desarrollo regional, equidad territorial`

## sostenibilidad, desarrollo de largo plazo
- **slug:** sostenibilidad-desarrollo-de-largo-plazo
- **definicion:** Desarrollo que satisface las necesidades del presente sin comprometer la capacidad de las futuras generaciones, y que la inversión pública debe promover. (docs.republica-dominicana.justia.com)
- **sinonimos:** `sostenibilidad`, `desarrollo de largo plazo`
- **canonico:** sostenibilidad, desarrollo de largo plazo
- **normalizado:** `sostenibilidad, desarrollo de largo plazo`

## horizonte plurianual, plan plurianual
- **slug:** horizonte-plurianual-plan-plurianual
- **definicion:** Planificación de la inversión pública para más de un año, que permite continuidad, estabilidad y eficiencia en el uso de recursos.
- **sinonimos:** `horizonte plurianual`, `plan plurianual`
- **canonico:** horizonte plurianual, plan plurianual
- **normalizado:** `horizonte plurianual, plan plurianual`

## estrategia multisectorial, enfoque integral
- **slug:** estrategia-multisectorial-enfoque-integral
- **definicion:** Proyecto o programa de inversión que involucra más de un sector público (salud, educación, infraestructura, etc.) de manera integrada.
- **sinonimos:** `estrategia multisectorial`, `enfoque integral`
- **canonico:** estrategia multisectorial, enfoque integral
- **normalizado:** `estrategia multisectorial, enfoque integral`

## administración de riesgos, control de contingencias
- **slug:** administracion-de-riesgos-control-de-contingencias
- **definicion:** Proceso de identificación, análisis, priorización y mitigación de riesgos que puedan afectar el proyecto.
- **sinonimos:** `administración de riesgos`, `control de contingencias`
- **canonico:** administración de riesgos, control de contingencias
- **normalizado:** `administracion de riesgos, control de contingencias`

## comparación de proyectos, referencia de desempeño
- **slug:** comparacion-de-proyectos-referencia-de-desempeno
- **definicion:** Comparación del desempeño, costos o plazos del proyecto con buenas prácticas o proyectos similares para mejorar su gestión.
- **sinonimos:** `comparación de proyectos`, `referencia de desempeño`
- **canonico:** comparación de proyectos, referencia de desempeño
- **normalizado:** `comparacion de proyectos, referencia de desempeno`

## gobernanza institucional, estructura de gestión
- **slug:** gobernanza-institucional-estructura-de-gestion
- **definicion:** Conjunto de estructuras organizacionales, roles, responsabilidades y relaciones que sustentan el SNIP y la gestión de proyectos. (dgcp.gob.do)
- **sinonimos:** `gobernanza institucional`, `estructura de gestión`
- **canonico:** gobernanza institucional, estructura de gestión
- **normalizado:** `gobernanza institucional, estructura de gestion`

## gobierno del proyecto, dirección institucional
- **slug:** gobierno-del-proyecto-direccion-institucional
- **definicion:** Mecanismos de dirección, control, rendición de cuentas y participación que garantizan la transparencia y eficacia del proyecto.
- **sinonimos:** `gobierno del proyecto`, `dirección institucional`
- **canonico:** gobierno del proyecto, dirección institucional
- **normalizado:** `gobierno del proyecto, direccion institucional`

## cooperación externa, donación internacional
- **slug:** cooperacion-externa-donacion-internacional
- **definicion:** Recursos financieros, técnicos o en especie que provienen de organismos internacionales o bilaterales para financiar o apoyar proyectos de inversión pública.
- **sinonimos:** `cooperación externa`, `donación internacional`
- **canonico:** cooperación externa, donación internacional
- **normalizado:** `cooperacion externa, donacion internacional`

## rentabilidad social, análisis socialmente orientado
- **slug:** rentabilidad-social-analisis-socialmente-orientado
- **definicion:** Relación entre los beneficios sociales y los costos de un proyecto desde una perspectiva amplia de bienestar social.
- **sinonimos:** `rentabilidad social`, `análisis socialmente orientado`
- **canonico:** rentabilidad social, análisis socialmente orientado
- **normalizado:** `rentabilidad social, analisis socialmente orientado`

## estudio de factibilidad, informe técnico
- **slug:** estudio-de-factibilidad-informe-tecnico
- **definicion:** Documento que expone los resultados del estudio de factibilidad, con recomendaciones, alternativa óptima y condiciones para el proyecto.
- **sinonimos:** `estudio de factibilidad`, `informe técnico`
- **canonico:** estudio de factibilidad, informe técnico
- **normalizado:** `estudio de factibilidad, informe tecnico`

## ámbito geográfico del proyecto, cobertura territorial
- **slug:** ambito-geografico-del-proyecto-cobertura-territorial
- **definicion:** Determinación del área geográfica de intervención del proyecto (municipio, provincia, región).
- **sinonimos:** `ámbito geográfico del proyecto`, `cobertura territorial`
- **canonico:** ámbito geográfico del proyecto, cobertura territorial
- **normalizado:** `ambito geografico del proyecto, cobertura territorial`

## compatibilización financiera, ajuste presupuestario
- **slug:** compatibilizacion-financiera-ajuste-presupuestario
- **definicion:** Proceso de ajuste entre los recursos disponibles y los requeridos por los proyectos para que entren al presupuesto anual.
- **sinonimos:** `compatibilización financiera`, `ajuste presupuestario`
- **canonico:** compatibilización financiera, ajuste presupuestario
- **normalizado:** `compatibilizacion financiera, ajuste presupuestario`

## integración de instituciones, colaboración institucional
- **slug:** integracion-de-instituciones-colaboracion-institucional
- **definicion:** Acción de articular diversas entidades públicas para la formulación, ejecución o seguimiento de proyectos integrados.
- **sinonimos:** `integración de instituciones`, `colaboración institucional`
- **canonico:** integración de instituciones, colaboración institucional
- **normalizado:** `integracion de instituciones, colaboracion institucional`

## política sectorial, directriz sectorial
- **slug:** politica-sectorial-directriz-sectorial
- **definicion:** Documento o conjunto de lineamientos en cada sector (educación, salud, transporte, energía) que orientan los proyectos de inversión.
- **sinonimos:** `política sectorial`, `directriz sectorial`
- **canonico:** política sectorial, directriz sectorial
- **normalizado:** `politica sectorial, directriz sectorial`

## registro SNIP, codificación de proyecto
- **slug:** registro-snip-codificacion-de-proyecto
- **definicion:** Inscripción formal del proyecto en el sistema SNIP con código, datos básicos, etapa, estado, etc.
- **sinonimos:** `registro SNIP`, `codificación de proyecto`
- **canonico:** registro SNIP, codificación de proyecto
- **normalizado:** `registro snip, codificacion de proyecto`

## innovación tecnológica, modernización técnica
- **slug:** innovacion-tecnologica-modernizacion-tecnica
- **definicion:** Incorporación al proyecto de conocimientos, procesos o equipamiento que provienen de fuera para mejorar su capacidad técnica.
- **sinonimos:** `innovación tecnológica`, `modernización técnica`
- **canonico:** innovación tecnológica, modernización técnica
- **normalizado:** `innovacion tecnologica, modernizacion tecnica`

## infraestructura instalada, recursos operativos
- **slug:** infraestructura-instalada-recursos-operativos
- **definicion:** Recursos materiales y humanos disponibles para que el proyecto produzca bienes o servicios.
- **sinonimos:** `infraestructura instalada`, `recursos operativos`
- **canonico:** infraestructura instalada, recursos operativos
- **normalizado:** `infraestructura instalada, recursos operativos`

## costo por unidad, unidad de costo
- **slug:** costo-por-unidad-unidad-de-costo
- **definicion:** Valor por unidad de medida (por ejemplo, por beneficiario, por kilómetro) en el proyecto.
- **sinonimos:** `costo por unidad`, `unidad de costo`
- **canonico:** costo por unidad, unidad de costo
- **normalizado:** `costo por unidad, unidad de costo`

## inversión pública de calidad, gasto de inversión inteligente
- **slug:** inversion-publica-de-calidad-gasto-de-inversion-inteligente
- **definicion:** Que la inversión pública produce el máximo resultado posible con los recursos disponibles cumpliendo eficiencia, eficacia y equidad.
- **sinonimos:** `inversión pública de calidad`, `gasto de inversión inteligente`
- **canonico:** inversión pública de calidad, gasto de inversión inteligente
- **normalizado:** `inversion publica de calidad, gasto de inversion inteligente`

## proyecto certificado, proyecto validado
- **slug:** proyecto-certificado-proyecto-validado
- **definicion:** Imagen o sello que identifica a los proyectos que cumplen estándares de formulación, ejecución y evaluación dentro del SNIP.
- **sinonimos:** `proyecto certificado`, `proyecto validado`
- **canonico:** proyecto certificado, proyecto validado
- **normalizado:** `proyecto certificado, proyecto validado`

## plan de O&M, mantenimiento planificado
- **slug:** plan-de-o-m-mantenimiento-planificado
- **definicion:** Plan de actividades, recursos y plazos para asegurar que el activo generado por el proyecto se mantenga operativo y en buen estado.
- **sinonimos:** `plan de O&M`, `mantenimiento planificado`
- **canonico:** plan de O&M, mantenimiento planificado
- **normalizado:** `plan de o&m, mantenimiento planificado`

## estudio de impacto ambiental, evaluación ambiental
- **slug:** estudio-de-impacto-ambiental-evaluacion-ambiental
- **definicion:** Procedimiento técnico obligatorio para determinar los efectos ambientales de un proyecto, e incluir medidas de mitigación o compensación.
- **sinonimos:** `estudio de impacto ambiental`, `evaluación ambiental`
- **canonico:** estudio de impacto ambiental, evaluación ambiental
- **normalizado:** `estudio de impacto ambiental, evaluacion ambiental`

## inversión inicial, inversión total
- **slug:** inversion-inicial-inversion-total
- **definicion:** Total de recursos que se requerirán para poner en marcha el proyecto, incluyendo preinversión, inversión, informe final, etc.
- **sinonimos:** `inversión inicial`, `inversión total`
- **canonico:** inversión inicial, inversión total
- **normalizado:** `inversion inicial, inversion total`

## resultado proyectado, ganancia esperada
- **slug:** resultado-proyectado-ganancia-esperada
- **definicion:** Valor proyectado de los bienes o servicios producidos por el proyecto, y su efecto sobre los beneficiarios.
- **sinonimos:** `resultado proyectado`, `ganancia esperada`
- **canonico:** resultado proyectado, ganancia esperada
- **normalizado:** `resultado proyectado, ganancia esperada`

## retorno social, tasa de rentabilidad social
- **slug:** retorno-social-tasa-de-rentabilidad-social
- **definicion:** Indicador equivalente a la TIR pero aplicada al conjunto de beneficios sociales del proyecto.
- **sinonimos:** `retorno social`, `tasa de rentabilidad social`
- **canonico:** retorno social, tasa de rentabilidad social
- **normalizado:** `retorno social, tasa de rentabilidad social`

## método de priorización, selección de inversiones
- **slug:** metodo-de-priorizacion-seleccion-de-inversiones
- **definicion:** Procedimiento mediante el cual se eligen los proyectos que serán incorporados al plan y presupuesto, utilizando criterios técnicos, sociales y económicos.
- **sinonimos:** `método de priorización`, `selección de inversiones`
- **canonico:** método de priorización, selección de inversiones
- **normalizado:** `metodo de priorizacion, seleccion de inversiones`

## umbral de viabilidad, criterio mínimo
- **slug:** umbral-de-viabilidad-criterio-minimo
- **definicion:** Valor mínimo que debe alcanzar un indicador (por ejemplo TIR, VPN) para que el proyecto sea considerado viable.
- **sinonimos:** `umbral de viabilidad`, `criterio mínimo`
- **canonico:** umbral de viabilidad, criterio mínimo
- **normalizado:** `umbral de viabilidad, criterio minimo`

## plan de mitigación, plan de contingencia
- **slug:** plan-de-mitigacion-plan-de-contingencia
- **definicion:** Conjunto de actividades que buscan reducir los impactos negativos (sociales, ambientales, técnicos) del proyecto.
- **sinonimos:** `plan de mitigación`, `plan de contingencia`
- **canonico:** plan de mitigación, plan de contingencia
- **normalizado:** `plan de mitigacion, plan de contingencia`

## financiamiento orientado a resultados, pago basado en resultados
- **slug:** financiamiento-orientado-a-resultados-pago-basado-en-resultados
- **definicion:** Modalidad en que parte del financiamiento del proyecto está condicionada al logro de metas o indicadores de desempeño.
- **sinonimos:** `financiamiento orientado a resultados`, `pago basado en resultados`
- **canonico:** financiamiento orientado a resultados, pago basado en resultados
- **normalizado:** `financiamiento orientado a resultados, pago basado en resultados`

## aprobación para ejecución, permiso de inicio
- **slug:** aprobacion-para-ejecucion-permiso-de-inicio
- **definicion:** Acto mediante el cual la autoridad competente da luz verde para que el proyecto entre en la etapa de inversión/ejecución tras haber cumplido con los criterios del SNIP.
- **sinonimos:** `aprobación para ejecución`, `permiso de inicio`
- **canonico:** aprobación para ejecución, permiso de inicio
- **normalizado:** `aprobacion para ejecucion, permiso de inicio`

## recuperación de capital, repago de inversión
- **slug:** recuperacion-de-capital-repago-de-inversion
- **definicion:** Procesos de pago de la deuda o de recuperación del capital invertido en un proyecto que genere ingresos reembolsables.
- **sinonimos:** `recuperación de capital`, `repago de inversión`
- **canonico:** recuperación de capital, repago de inversión
- **normalizado:** `recuperacion de capital, repago de inversion`

## sistema de M&E, gestión del desempeño
- **slug:** sistema-de-m-e-gestion-del-desempeno
- **definicion:** Sistema organizado de seguimiento, medición, análisis y reporte de los proyectos para asegurar cumplimiento de metas y aprendizaje institucional.
- **sinonimos:** `sistema de M&E`, `gestión del desempeño`
- **canonico:** sistema de M&E, gestión del desempeño
- **normalizado:** `sistema de m&e, gestion del desempeno`

## infraestructura comunitaria, inversión social
- **slug:** infraestructura-comunitaria-inversion-social
- **definicion:** Bienes y servicios públicos destinados a mejorar la calidad de vida de la población (escuelas, hospitales, centros comunitarios) adquiridos mediante inversión pública.
- **sinonimos:** `infraestructura comunitaria`, `inversión social`
- **canonico:** infraestructura comunitaria, inversión social
- **normalizado:** `infraestructura comunitaria, inversion social`

## infraestructura productiva, activo de crecimiento
- **slug:** infraestructura-productiva-activo-de-crecimiento
- **definicion:** Bienes públicos destinados a generar crecimiento económico (carreteras, puertos, redes eléctricas) con inversión pública.
- **sinonimos:** `infraestructura productiva`, `activo de crecimiento`
- **canonico:** infraestructura productiva, activo de crecimiento
- **normalizado:** `infraestructura productiva, activo de crecimiento`

## obra estatal, construcción pública
- **slug:** obra-estatal-construccion-publica
- **definicion:** Construcción de bienes físicos mediante recursos públicos, parte del ámbito de la inversión pública.
- **sinonimos:** `obra estatal`, `construcción pública`
- **canonico:** obra estatal, construcción pública
- **normalizado:** `obra estatal, construccion publica`

## cronograma del proyecto, tiempo de ejecución
- **slug:** cronograma-del-proyecto-tiempo-de-ejecucion
- **definicion:** Periodo definido para la realización del proyecto desde que inicia la etapa de inversión hasta que entra en operación.
- **sinonimos:** `cronograma del proyecto`, `tiempo de ejecución`
- **canonico:** cronograma del proyecto, tiempo de ejecución
- **normalizado:** `cronograma del proyecto, tiempo de ejecucion`

## sobrecosto, excedente presupuestario
- **slug:** sobrecosto-excedente-presupuestario
- **definicion:** Situación en que los costos reales del proyecto superan los costos inicialmente estimados.
- **sinonimos:** `sobrecosto`, `excedente presupuestario`
- **canonico:** sobrecosto, excedente presupuestario
- **normalizado:** `sobrecosto, excedente presupuestario`

## periodo de gestación, tiempo de espera
- **slug:** periodo-de-gestacion-tiempo-de-espera
- **definicion:** Periodo que transcurre entre la identificación de la idea del proyecto y su puesta en operación.
- **sinonimos:** `periodo de gestación`, `tiempo de espera`
- **canonico:** periodo de gestación, tiempo de espera
- **normalizado:** `periodo de gestacion, tiempo de espera`

## reingeniería organizacional, ajuste institucional
- **slug:** reingenieria-organizacional-ajuste-institucional
- **definicion:** Transformación institucional o administrativa que acompaña un proyecto (ej. modernización, reestructuración) para asegurar su éxito.
- **sinonimos:** `reingeniería organizacional`, `ajuste institucional`
- **canonico:** reingeniería organizacional, ajuste institucional
- **normalizado:** `reingenieria organizacional, ajuste institucional`

## sunk cost, costo irrecuperable
- **slug:** sunk-cost-costo-irrecuperable
- **definicion:** Gastos ya incurridos en un proyecto que no llega a completarse, que deben considerarse dentro del análisis de inversiones.
- **sinonimos:** `sunk cost`, `costo irrecuperable`
- **canonico:** sunk cost, costo irrecuperable
- **normalizado:** `sunk cost, costo irrecuperable`

## referencia global, comparativo internacional
- **slug:** referencia-global-comparativo-internacional
- **definicion:** Estándares o valores internacionales con los cuales se comparan los parámetros de un proyecto para mejorarlo.
- **sinonimos:** `referencia global`, `comparativo internacional`
- **canonico:** referencia global, comparativo internacional
- **normalizado:** `referencia global, comparativo internacional`

## business model público, estructura de ingresos-gastos públicos
- **slug:** business-model-publico-estructura-de-ingresos-gastos-publicos
- **definicion:** Diseño de cómo el proyecto generará valor público, qué actores participan, cómo se sostendrá financieramente.
- **sinonimos:** `business model público`, `estructura de ingresos-gastos públicos`
- **canonico:** business model público, estructura de ingresos-gastos públicos
- **normalizado:** `business model publico, estructura de ingresos-gastos publicos`

## moneda de análisis, divisa de estudio
- **slug:** moneda-de-analisis-divisa-de-estudio
- **definicion:** Divisa en la que se expresan los costos y beneficios del proyecto, relevante cuando hay financiamiento internacional.
- **sinonimos:** `moneda de análisis`, `divisa de estudio`
- **canonico:** moneda de análisis, divisa de estudio
- **normalizado:** `moneda de analisis, divisa de estudio`

## accountability, rendición de cuentas
- **slug:** accountability-rendicion-de-cuentas
- **definicion:** Obligación legal o ética de rendir cuentas por el uso de los recursos públicos del proyecto.
- **sinonimos:** `accountability`, `rendición de cuentas`
- **canonico:** accountability, rendición de cuentas
- **normalizado:** `accountability, rendicion de cuentas`

## valor de salvamento, valor de terminación
- **slug:** valor-de-salvamento-valor-de-terminacion
- **definicion:** Valor que tendrán los activos al final de la vida útil del proyecto o al momento del análisis.
- **sinonimos:** `valor de salvamento`, `valor de terminación`
- **canonico:** valor de salvamento, valor de terminación
- **normalizado:** `valor de salvamento, valor de terminacion`

## compromiso financiero, obligaciones futuras
- **slug:** compromiso-financiero-obligaciones-futuras
- **definicion:** Monto de recursos que el Estado o entidad se ha comprometido a entregar al proyecto en un periodo futuro.
- **sinonimos:** `compromiso financiero`, `obligaciones futuras`
- **canonico:** compromiso financiero, obligaciones futuras
- **normalizado:** `compromiso financiero, obligaciones futuras`
