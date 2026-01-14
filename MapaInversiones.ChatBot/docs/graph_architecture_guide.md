# Guía Exhaustiva de Arquitectura del Grafo (ChatBot v2)

Esta documentación detalla la arquitectura completa del grafo de decisión, estructurada explícitamente en las fases de **PREFETCH** (Entendimiento y Estrategia), **FETCH** (Ejecución de Datos) y **POSTFETCH** (Síntesis y Respuesta).

---

## 1. Visión Global del Flujo

El sistema opera como un pipeline de agentes especializados que se pasan el estado (`AgentState`) de uno a otro. No es un script lineal, es un grafo dirigido donde cada nodo puede tomar decisiones de ruteo.

El flujo general es:
1.  **Inicio**: Recepción de la pregunta.
2.  **Prefetch**: Clasificación, análisis de intención y generación de estrategia SQL.
3.  **Fetch**: Ejecución de la consulta en base de datos y recuperación de resultados.
4.  **Postfetch**: Procesamiento de datos, evaluación de seguridad y generación de respuesta final.

---

## 2. FASE 1: PREFETCH (Entendimiento y Estrategia)

El objetivo de esta fase es entender la intención del usuario, validar si es viable responder y preparar la mejor estrategia SQL. **No se toca la base de datos aún.**

### 2.1. Normalización y Clasificación (`inbox_classifier`)
*   **Entrada**: Pregunta cruda del usuario.
*   **Proceso**:
    1.  **Reescritura (`generate_complete_question_v2`)**: Transforma preguntas dependientes del contexto ("¿y en Azua?") en preguntas completas ("¿Proyectos en Azua?").
    2.  **Clasificación**: Determina si es Social, Soporte, Definición, Irrelevante o Relevante (SQL).
    3.  **Moderación**: Detecta PII (Información Personal) o contenido ofensivo.
    4.  **Cache Check**: Verifica si esta pregunta exacta ya fue respondida hoy.
*   **Salida**: Flags de ruteo (`is_relevant`, `is_social`, etc.).

### 2.2. Análisis Profundo (`llm_analyzer`)
*   **Entrada**: Pregunta completa + Esquema de BD + Catálogos.
*   **Proceso**:
    *   Extrae **Filtros** (Sector, Año, Estado).
    *   Resuelve **Ambigüedad Territorial** (ver sección especial).
    *   Detecta **Intenciones de Zona Gris** (ej. preguntas sobre contratistas que no están en el dataset).
    *   Aplica reglas de negocio (ej. **REGLA B4**: "En qué provincia" es un `GROUP BY`, no un filtro).
*   **Salida**: Objeto de análisis con filtros, tablas sugeridas y flags de clarificación.

### 2.3. Estrategia de Complejidad
*   **`classify_question_complexity`**: Decide si usar la vía rápida (One-Shot) o la vía robusta (Multi-Candidate).
*   **`llm_analyzer_2`**: Si es compleja, este nodo genera *few-shots dinámicos* específicos para el problema detectado (ej. negación, comparación temporal).

### 2.4. Generación de SQL
*   **Vía Simple (`generate_sql_query`)**: Un solo prompt genera la SQL. Rápido y barato.
*   **Vía Compleja (`generate_sql_candidates`)**: Genera 3 variantes de SQL con diferentes enfoques. Luego `select_best_sql_candidate` elige la mejor (o pide ayuda a `choose_sql_with_llm`).

---

## 3. FASE 2: FETCH (Ejecución de Datos)

Aquí es donde el sistema interactúa con la base de datos PostgreSQL. Es la fase crítica de I/O.

### 3.1. Ejecución (`fetch_data`)
*   **Entrada**: Query SQL generada.
*   **Proceso**:
    1.  Ejecuta la SQL en PostgreSQL.
    2.  **Reranking (FlashRank)**: Si hay muchos resultados, usa un modelo local para reordenarlos por relevancia semántica.
    3.  **LLM Filtering**: Una segunda pasada opcional para eliminar falsos positivos del top de resultados.
    4.  **Fallback**: Si la búsqueda estricta falla (0 filas), intenta automáticamente una búsqueda relajada (ej. `ILIKE` en lugar de `=`, quitar acentos).
*   **Salida**: Lista de filas (diccionarios) o error.

### 3.2. Recuperación de Errores (`regenerate_query`)
*   **Entrada**: SQL fallida + Mensaje de error de Postgres.
*   **Proceso**:
    *   Analiza el error (ej. "columna no existe", "sintaxis inválida").
    *   Lee la SQL original y el esquema.
    *   Genera una versión corregida.
*   **Seguridad**: Tiene un contador de reintentos (`MAX_RETRIES`). Si se supera, aborta para evitar bucles infinitos ("Tormenta Perfecta").

---

## 4. FASE 3: POSTFETCH (Síntesis y Respuesta)

Convierte los datos crudos en una respuesta natural y útil para el ciudadano.

### 4.1. Procesamiento (`process_user_response`)
*   **Entrada**: Filas crudas de la BD.
*   **Proceso**: Formatea fechas, números y monedas. Estructura el JSON para que el frontend pueda renderizar tablas o gráficos.

### 4.2. Evaluación (`evaluate_citizen_response`)
*   **Entrada**: Respuesta procesada.
*   **Proceso**: Verifica que la respuesta sea segura, no revele datos sensibles internos y sea útil para la pregunta original.

### 4.3. Composición (`compose_frontend_response`)
*   **Entrada**: Datos validados.
*   **Proceso**: Genera el texto final (el "speech" del bot) que acompaña a los datos. Ej: "Encontré 5 proyectos en Azua, aquí tienes el detalle...".

---

## 5. Mecanismos Especiales y Edge Cases

### A. Resolución Territorial (El Guardián Geográfico)
Ubicado en `llm_analyzer` y `territorial_resolver`.
1.  **Términos Genéricos**: Si el usuario dice "mi provincia" o "donde vivo", el sistema **BLOQUEA** y pide el nombre específico. (Evita buscar `%mi provincia%` que daría 0 resultados).
2.  **Ambigüedad**: Si dice "Santiago", el sistema detecta que puede ser Provincia o Municipio y pide aclarar (si es necesario).
3.  **Selección**: Si dice "En qué provincia...", el sistema entiende que es una pregunta de agrupación y **NO** filtra.

### B. Zona Gris (Gray Zone)
Maneja preguntas que el bot entiende pero no puede responder por limitaciones de datos.
*   Ejemplo: "Dame el teléfono del contratista".
*   Acción: El `llm_analyzer` detecta la intención `contractor_data`, verifica que no tenemos esa info y activa `handle_gray_zone` para explicarle al usuario amablemente por qué no podemos responder.

### C. Loop Protection (Anti-Tormenta)
Mecanismo de seguridad en `regenerate_query`.
*   Evita que el bot se quede "pegado" intentando arreglar una SQL imposible.
*   Si el validador rechaza la SQL 3 veces, el sistema se rinde controladamente y pide al usuario reformular.

### D. Reranking Semántico
Optimización en `fetch_data`.
*   Si una búsqueda de texto trae 50 resultados (ej. "escuelas"), el Reranker ordena primero las que dicen "Escuela Básica" y deja al final "Mantenimiento de Escuelas", basándose en la semántica de la pregunta original.

---
*Documentación generada para el equipo de desarrollo - ChatBot v2*
