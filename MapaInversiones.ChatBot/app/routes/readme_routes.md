### README: Documentación de Rutas del Chatbot

Este archivo documenta las rutas definidas para el chatbot implementado con FastAPI, describiendo sus funcionalidades y objetivos.

---

#### **routes/chat.py**
Este archivo contiene rutas relacionadas con el procesamiento de mensajes del chatbot, manejo de sesiones, historial, y la interacción con un grafo lógico basado en **LangChain**. También incluye la integración con WhatsApp mediante webhooks.

##### **Rutas**

1. **`GET /api/chat`**
   - **Descripción**: Procesa mensajes enviados por los usuarios desde el frontend del chatbot, invocando un grafo lógico para generar respuestas.
   - **Parámetros**:
     - `message` (str): Mensaje del usuario.
     - `country_code` (str): Código de país del usuario.
   - **Funcionamiento**:
     - Maneja el historial de mensajes en la sesión (`request.session`).
     - Controla el contador de preguntas y verifica límites de sesión definidos en `settings`:
       - `session_max_question` (máximo número de preguntas por sesión).
       - `session_max_history_length` (máximo número de mensajes almacenados en el historial).
     - Invoca el grafo definido en `modules.graph.graph` mediante:
       ```python
       response_state = graph.invoke(inputs, {"recursion_limit": 10})
       ```
       El grafo utiliza LangChain para reconstruir preguntas, procesar consultas y generar respuestas.
   - **Respuesta**: Devuelve un JSON con los siguientes campos:
     - **`user_question`**: La pregunta original del usuario, en HTML.
     - **`complete_question`**: Pregunta reconstruida completa, si aplica.
     - **`response`**: Respuesta generada, renderizada en HTML.
     - **`session_count`**: Número de preguntas en la sesión actual.
     - **`sql_query`**: Consulta SQL generada (si aplica).
     - **`session_id`**: Identificador único de la sesión.
     - **`response_id`**: Identificador único de la respuesta en la base de datos (si se almacenó).
     - **`is_relevant`**: Indica si la pregunta fue considerada relevante por el grafo.
     - **`is_social_interaction`**: Indica si la interacción es de tipo social.

2. **`GET /test-session`**
   - **Descripción**: Endpoint de prueba para verificar el manejo de sesiones, incluyendo el contador de preguntas y límites de tiempo.
   - **Salida**: Información sobre el estado de la sesión:
     - Contador de preguntas.
     - Tiempo transcurrido.
     - Mensajes de error si se exceden los límites.

3. **`POST /api/whatsapp-webhook/`**
   - **Descripción**: Recibe datos de webhooks enviados por WhatsApp y los procesa en segundo plano.
   - **Notas**:
     - Verifica que los datos incluyan contactos y mensajes antes de procesarlos.
     - Utiliza `process_whatsapp_message` para manejar mensajes y enviarlos al grafo lógico.

4. **`GET /api/whatsapp-webhook/`**
   - **Descripción**: Endpoint para verificar el webhook con Facebook.
   - **Parámetros**:
     - `hub.mode`, `hub.challenge`, `hub.verify_token` (query params).
   - **Salida**: Devuelve el desafío (`hub.challenge`) si el token de verificación es válido.

5. **`GET /validate-max-questions`**
   - **Descripción**: Verifica si se ha alcanzado el límite de preguntas en una sesión o si el tiempo de sesión ha expirado.
   - **Salida**: Información sobre el estado de la sesión y posibilidad de continuar:
     - `continue`: Si es posible continuar la sesión.
     - `count`: Número de preguntas realizadas.
     - `elapsed_time`: Tiempo transcurrido desde el inicio de la sesión.
     - `qa_history`: Historial de preguntas y respuestas.

---

#### **routes/history.py**
Define rutas para recuperar el historial de preguntas y respuestas asociadas a una sesión específica.

1. **`GET /history`**
   - **Descripción**: Obtiene el historial de preguntas y respuestas asociadas a la sesión actual.
   - **Salida**: Historial en formato JSON.
   - **Notas**:
     - Convierte fechas en el historial a cadenas legibles.
     - Llama a `get_question_history_by_sessionId` para obtener datos desde la base de datos.

---

#### **routes/home.py**
Contiene rutas para la página principal y otras páginas estáticas relacionadas con el chatbot.

1. **`GET /`**
   - **Descripción**: Página de inicio del servidor del chatbot.
   - **Salida**: Renderiza `index.html` con la fecha de creación del servidor.
   - **Notas**:
     - Gestiona una sesión única por usuario utilizando `get_session_id`.

2. **`GET /acerca-de-mapabot`**
   - **Descripción**: Página estática que describe el propósito y características de MapaBot.
   - **Salida**: Renderiza `acerca-de-mapabot.html` con la fecha de creación del servidor.

---

#### **Detalles Técnicos**

- **Grafo basado en LangChain**: 
  - Importado como `graph` desde `modules.graph.graph`.
  - Procesa inputs complejos como mensajes históricos, preguntas del usuario y consultas SQL.
  - Configuración de recursión limitada: `{"recursion_limit": 10}`.

- **Historial de Mensajes**:
  - Gestionado en `request.session["history"]`.
  - Limitado a `settings.session_max_history_length`.

- **Límites de Sesión**:
  - Configurado mediante `settings.session_max_question` (máximo número de preguntas).
  - Configuración adicional en `session_manager` para manejar expiración por tiempo (`session_max_time`).

- **Transformación de Markdown**:
  - Se utilizan las librerías `markdown` y `markdown2` para convertir respuestas de texto a HTML.
  - Respuestas renderizadas con clases CSS específicas para la interfaz (`respuesta-pregunta` y `respuesta-sugerencias`).

---

### Estructura de Archivos
- **`routes/chat.py`**: Rutas relacionadas con el manejo del chatbot y su integración con WhatsApp.
- **`routes/history.py`**: Rutas para consultar el historial de preguntas y respuestas.
- **`routes/home.py`**: Rutas para páginas estáticas del servidor.

Para mayor información, consulta el código fuente y los comentarios detallados en cada archivo.