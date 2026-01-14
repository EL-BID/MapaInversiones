# Codebase Review Summary

## Objective
To thoroughly understand the functionality of the chatbot's core nodes (`prefetch`, `fetch`, `postfetch`), SQL helpers, database utilities, and prompt engineering, enabling seamless resumption of development.

## Files Reviewed

### 1. Node Logic
*   **`nodes_prefetch.py`**:
    *   **Responsibility**: Input processing, intent classification, document retrieval, and initial query analysis.
    *   **Key Functions**:
        *   `generate_complete_question_v2`: Regenerates user questions to be self-contained using history.
        *   `retrieve_documents`: Fetches relevant documentation.
        *   `llm_analyzer`: Analyzes the query to extract tables, filters, and entities.
    *   **Key Insights**: Uses a "Think Ahead" approach in prompts to guide the LLM. Handles territorial disambiguation logic.

*   **`nodes_fetch.py`**:
    *   **Responsibility**: SQL generation, execution, and data retrieval.
    *   **Key Functions**:
        *   `generate_sql_query`: Constructs SQL queries based on analysis.
        *   `regenerate_query`: Retries SQL generation upon failure.
        *   `fetch_data`: Orchestrates the fetch process, including retries and fallback to keyword search (`keyword_search_fallback`).
    *   **Key Insights**: Implements a robust retry mechanism with `backoff`. Uses `sqlfluff` for linting (in `db_utils`). Handles "Zero Rows" scenarios by attempting keyword-based regeneration.

*   **`nodes_postfetch.py`**:
    *   **Responsibility**: Response formatting, relevance evaluation, and gray zone handling.
    *   **Key Functions**:
        *   `process_user_response`: Main entry point for formatting the final answer.
        *   `_validate_semantic_relevance`: Uses LLM to filter irrelevant rows.
        *   `evaluate_citizen_response`: Generates the final user-facing message (Frontend/WhatsApp).
        *   `handle_gray_zone`: Manages ambiguous or unsupported requests.
    *   **Key Insights**: Integrates `FlashRank` for reranking. Features a "Citizen Review" layer for transparency.

### 2. Utilities
*   **`helpers_sql.py`**:
    *   **Responsibility**: SQL manipulation and filter management.
    *   **Key Functions**:
        *   `_find_missing_filters`: Detects if generated SQL missed any mandatory filters.
        *   `apply_semantic_or_from_groups`: Handles complex OR conditions for semantic groups.
    *   **Key Insights**: Contains logic to prevent regeneration loops (e.g., skipping territorial checks if `resolved_territories` is present).

*   **`db_utils.py`**:
    *   **Responsibility**: Database interaction and SQL safety.
    *   **Key Functions**:
        *   `execute_sql_query`: Executes queries with timeout and safety checks.
        *   `lint_and_fix_sql`: Uses `sqlfluff` to fix syntax errors.
        *   `fix_round_function`: Heuristic fix for PostgreSQL `ROUND()` type errors.
    *   **Key Insights**: Centralizes connection management and common SQL fixes.

### 3. Prompts
*   **`prompts_prefetch.py`**:
    *   **Content**: Prompts for question regeneration, moderation, and the main `llm_analyzer`.
    *   **Key Insights**: Detailed business rules for SNIP codes, amount disambiguation, and territorial terminology (Provincia vs Departamento).

*   **`prompts_fetch.py`**:
    *   **Content**: Prompts for SQL generation (`_GENERATE_SQL_QUERY_PROMPT_BASE`) and regeneration.
    *   **Key Insights**: Enforces strict PostgreSQL syntax, join optimization, and specific handling for `ROUND()` casting.

*   **`prompts_postfetch.py`**:
    *   **Content**: Prompts for response formatting (`user_response_frontend_prompt`), gray zone explanations, and citizen review.
    *   **Key Insights**: tailored for different output channels (Frontend vs WhatsApp) and includes specific language style configurations by country.

### 4. Configuration
*   **`config.py`**:
    *   **Content**: Application settings using `pydantic`.
    *   **Key Insights**: Manages feature flags (`feature_citizen_node`, `use_territorial_disambiguation`), uncertainty topics, and database connections.

## Key Findings & Action Items

1.  **Territorial Disambiguation**: The system prefers `resolved_territories` from the analyzer but has a fallback to a triple-OR pattern. Logic in `helpers_sql.py` was recently adjusted to avoid false positives in missing filter detection.
2.  **SQL Safety**: `db_utils.py` includes specific fixes for PostgreSQL `ROUND()` function issues, which is also reinforced in `prompts_fetch.py`.
3.  **Gray Zone**: `nodes_postfetch.py` has dedicated logic (`handle_gray_zone`) to gracefully handle queries that fall outside the supported scope or are ambiguous.
4.  **Prompt Consistency**: Prompts are modular and enforce strict rules (e.g., "NEVER INVENT INFORMATION").

### 5. Recent Fixes & Improvements (Verified)
*   **Template Escaping**: Fixed an issue where `{column}` in prompts was interpreted as a LangChain variable. It is now correctly escaped as `{{column}}`.
*   **Territorial Resolver Path**: Corrected the path to access `resolved_territories`. It now correctly looks in `state["analysis"]["resolved_territories"]` instead of `state["resolved_territories"]`.
*   **Flow Verification**:
    1.  **ANALYZER1** generates `territory_filters`.
    2.  **TERRITORIAL_RESOLVER** resolves to specific columns (e.g., `nombre_departamento`).
    3.  **ANALYZER2** receives `resolved_territories` (via the fixed path) and generates correct few-shots.
    4.  **SQL Generator** uses the single resolved column.
    5.  **FILTER_VALIDATION** skips territorial validation because `resolved_territories` exists.
    6.  **NO REGENERATE**: The query is executed directly without unnecessary loops.

## Ready for Resumption
The codebase review is complete. The understanding of the data flow from user input -> prefetch (analysis) -> fetch (SQL) -> postfetch (response) is established. The specific roles of helper functions and configuration settings are documented.
