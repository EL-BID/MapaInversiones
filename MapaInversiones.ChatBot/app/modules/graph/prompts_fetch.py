"""
Prompts utilizados durante la etapa de fetch del grafo:
- Generación y regeneración de SQL.
- Selección de la mejor candidata SQL.
"""

from __future__ import annotations


MODULAR_TERRITORIAL_GUIDELINES = """
### **5. Territorial Filtering Rule (Critical):**

#### **5.1 PRIORITY: Use resolved_territories from Analysis (when available)**
If the Analysis JSON contains `resolved_territories` with a specific `column`, you **MUST** use ONLY that column and value.
**Ignore** any other territorial heuristics or "triple-OR" patterns.

Example:
```json
"resolved_territories": [
  {{"input": "santo domingo", "column": "nombre_departamento", "value": "SANTO DOMINGO", "confidence": 0.95}}
]
```
→ **REQUIRED SQL**:
`process_text(t.nombre_departamento) ILIKE '%' || process_text('SANTO DOMINGO') || '%'`

**Rules for resolved territories:**
1. **Target the specific column** (e.g., `nombre_departamento`) defined in the JSON.
2. **Use the `value` field** from the JSON as the filter literal.
3. **DO NOT** add `OR` conditions for other territorial levels (e.g., do NOT check `nombre_municipio` if `nombre_departamento` is resolved). This specific match overrides generic searches.
4. **Use ILIKE + process_text** for robustness: `process_text(t.<column>) ILIKE '%' || process_text('<value>') || '%'`.

#### **5.2 FALLBACK: Legacy Triple-OR pattern (backward compatibility)**
When `resolved_territories` is empty or has `"column": null`:
- **If territorial disambiguation is ENABLED**: DO NOT apply territorial filter (system will request clarification from user)
- **If territorial disambiguation is DISABLED (legacy mode)**: Apply triple-OR pattern to `process_text(nombre_region)`, `process_text(nombre_departamento)` **and** `process_text(nombre_municipio)` joined with `OR`:
    ```sql
    (process_text(t.nombre_region) ILIKE '%' || process_text('value') || '%'
     OR process_text(t.nombre_departamento) ILIKE '%' || process_text('value') || '%'
     OR process_text(t.nombre_municipio) ILIKE '%' || process_text('value') || '%')
    ```

**CRITICAL**: Prefer single-column filters when `resolved_territories` provides specific column. Never mix territorial levels unless in legacy fallback mode.
- Normalize expressions first: drop prefixes such as "provincia de", "departamento de", "municipio de", "región de", "province of". For example, "provincia de Samaná" must be filtered as "Samaná".
- When joining, alias the territorial table (e.g. `LEFT JOIN stg_mapainv_proyectosterritorios t ON t.id_proyecto = p.id_proyecto`). Use `SELECT DISTINCT` if the territorial join multiplies rows.

### **6. Join Optimization Rule (Critical for Performance):**
**When combining filters from base table (`p.*`) and joined tables (`t.*`, `f.*`):**

**MANDATORY PATTERN (when join_optimization_enabled=True):**
```sql
FROM stg_mapainv_proyectosaprobadosinv p
LEFT JOIN stg_mapainv_proyectosterritorios t 
    ON t.id_proyecto = p.id_proyecto
    AND (<territorial_filters_here>)     -- ← Filters on t.* columns go in ON clause
LEFT JOIN stg_mapainv_proyectosfuentesfinanciamiento f
    ON f.id_proyecto = p.id_proyecto
    AND (<funding_filters_here>)         -- ← Filters on f.* columns go in ON clause
WHERE 
    <base_filters_here>                  -- ← Filters on p.* columns go in WHERE clause
    AND t.id_proyecto IS NOT NULL        -- ← Only if territorial filter is mandatory
    AND f.id_proyecto IS NOT NULL        -- ← Only if funding filter is mandatory
```

**RATIONALE:** PostgreSQL can apply base table filters first (potentially using indexes on `p.*`), then perform smaller joins with pre-filtered results. This reduces the number of rows involved in the join operation.

**EXCEPTION:** If the query has OR semantics crossing tables (e.g., "proyectos educativos OR en Santo Domingo"), keep all filters in WHERE clause (traditional pattern). The analyzer will set `join_optimization_enabled=False` in this case.

**Example (optimized with resolved territory):**
```sql
-- Query: "Proyectos educativos en Santo Domingo con inversión > 5M"
-- resolved_territories: [{{"input": "santo domingo", "column": "nombre_departamento", ...}}]
SELECT DISTINCT p.id_proyecto, p.nombre_proyecto
FROM stg_mapainv_proyectosaprobadosinv p
LEFT JOIN stg_mapainv_proyectosterritorios t 
    ON t.id_proyecto = p.id_proyecto
    AND process_text(t.nombre_departamento) ILIKE '%' || process_text('Santo Domingo') || '%'
WHERE 
    p.pais_iso3 = 'dom'
    AND p.nombresector_proyecto = 'EDUCACIÓN'
    AND p.valor_proyecto > 5000000
    AND t.id_proyecto IS NOT NULL;
```
```

**Example (traditional - OR semantic):**
```sql
-- Query: "Proyectos educativos O en Santo Domingo"
SELECT DISTINCT p.id_proyecto, p.nombre_proyecto
FROM stg_mapainv_proyectosaprobadosinv p
LEFT JOIN stg_mapainv_proyectosterritorios t 
    ON t.id_proyecto = p.id_proyecto
WHERE 
    p.pais_iso3 = 'dom'
    AND (
        p.nombresector_proyecto = 'EDUCACIÓN'
        OR process_text(t.nombre_departamento) ILIKE '%' || process_text('santo domingo') || '%'
    );
-- Note: No IS NOT NULL check because we want projects that match EITHER condition
```
""".strip()


def _inject_prompt_modules(
    base: str,
    territorial_block: str,
    funding_block: str,
    territorial_placeholder: str,
    funding_placeholder: str,
) -> str:
    prompt = base.replace(territorial_placeholder, territorial_block or "")
    prompt = prompt.replace(funding_placeholder, funding_block or "")
    return prompt


def build_generate_sql_query_prompt(
    include_territorial: bool = True,
    include_funding: bool = True,
) -> str:
    return _inject_prompt_modules(
        _GENERATE_SQL_QUERY_PROMPT_BASE,
        MODULAR_TERRITORIAL_GUIDELINES if include_territorial else "",
        MODULAR_FUNDING_GUIDELINES if include_funding else "",
        "<<TERRITORIAL_GUIDELINES>>",
        "<<FUNDING_GUIDELINES>>",
    )


def build_regenerate_query_prompt(
    include_territorial: bool = True,
    include_funding: bool = True,
) -> str:
    return _inject_prompt_modules(
        _REGENERATE_QUERY_PROMPT_BASE,
        MODULAR_TERRITORIAL_GUIDELINES_REGEN if include_territorial else "",
        MODULAR_FUNDING_GUIDELINES_REGEN if include_funding else "",
        "<<TERRITORIAL_GUIDELINES_REGEN>>",
        "<<FUNDING_GUIDELINES_REGEN>>",
    )


_KEYWORD_REGENERATE_PROMPT = """
You will receive an existing SQL query that returned zero rows because some
textual filters were too literal. Your task is to KEEP the overall structure
identical (CTEs, SELECT list, JOINs, GROUP/HAVING, ORDER, LIMIT) and only
rewrite the WHERE predicates explicitly listed below so they use partial matching
with the provided tokens.

Original SQL:
```sql
{original_sql}
```

Replacements (JSON list):
{replacements_json}

For each replacement entry:
- Locate every predicate that compares `process_text(<column_expression>)`
  with the `original_value` shown in the JSON (either using `=` or `ILIKE`, even with wildcards).
- Replace that predicate with ILIKE blocks that check each token:

  ```
  process_text(<column_expression>) ILIKE '%' || process_text('<token>') || '%'
  ```

- If multiple tokens are provided, combine the individual ILIKE blocks with `OR`,
  wrapping the result in parentheses.
- Preserve the surrounding boolean logic exactly as it was (respect parentheses and AND/OR placement).
- Do not remove or alter any other filters.
- Immediately after each rewritten block, append a marker so validators know the original filter was satisfied:
  `/* satisfies_filter: column=<column_expression> literal=<token1|token2> */`
  Use lowercase tokens without `%` and separate multiples with `|`.

Examples (illustrative only; do **not** reuse their column names or tokens unless present in `replacements_json`):

Example 1
```
Original predicate:
process_text(p.objetivo_proyecto) = process_text('lineas de metro')

Tokens: ["metro"]

Rewritten predicate:
(
  process_text(p.objetivo_proyecto) ILIKE '%' || process_text('metro') || '%'
)
```

Example 2
```
Original predicate:
process_text(t.nombre_territorio) ILIKE process_text('ciudad de la vega')

Tokens: ["ciudad", "vega"]

Rewritten predicate:
(
  process_text(t.nombre_territorio) ILIKE '%' || process_text('ciudad') || '%'
  OR
  process_text(t.nombre_territorio) ILIKE '%' || process_text('vega') || '%'
)
```

Return ONLY the modified SQL query, without extra commentary.
""".strip()


def build_keyword_regenerate_prompt() -> str:
    return _KEYWORD_REGENERATE_PROMPT


_TRIGRAM_REGENERATE_PROMPT = """
You will receive an existing SQL query that returned 0 rows because exact word matching failed. 
Your task is to REWRITE text filters to use FUZZY matching (Trigrams).

Original SQL:
```sql
{original_sql}
```

INSTRUCTIONS for Trigram Strategy:
1. Locate text filters on `nombre_proyecto`, `objetivo_proyecto`, `nombresector_proyecto` or `nombreentidadejecutora_proyecto`.
2. CHANGE the operator from `process_text(col) ILIKE ...` to `col ILIKE '%term%'` (Raw Match) OR `process_text(col) % process_text('term')` (Trigram Similarity) if requested.
   - **Recommended Fallback**: Use `col ILIKE '%term%'` without `process_text` wrapper on the column if the original used it, to bypass functional index restrictions if needed, OR keep `process_text` but ensure wildcards are broad.
   - **Best Approach**: Remove `process_text()` and use `col ILIKE '%term%'` to catch substrings that `process_text` might have tortured.
3. **DO NOT change** `id_proyecto`, `codigo_snip` or `pais_iso3` filters (Keep them strict `=` as per rules).
4. Preserve all other logic (joins, groupings).

Return ONLY the modified SQL.
""".strip()


def build_trigram_regenerate_prompt() -> str:
    return _TRIGRAM_REGENERATE_PROMPT


MODULAR_TERRITORIAL_GUIDELINES_REGEN = """
5. **Territorial Filtering Rule (Critical)**  
   - **PRIORITY**: If `resolved_territories` is present in Analysis with a specific `column` (e.g., `"column": "nombre_departamento"`), use ONLY that column:
     `process_text(t.nombre_departamento) ILIKE '%' || process_text('Santo Domingo') || '%'`
   - **FALLBACK**: If `resolved_territories` is empty or has `"column": null`:
     - Check if territorial disambiguation is enabled
     - If YES: Skip territorial filter (will request clarification)
     - If NO: Use legacy triple-OR pattern (backward compatibility)
   - Alias the territorial table (e.g. `t`) and add `DISTINCT` when needed to avoid duplicates.  
   - Trim prefixes such as "provincia de" before filtering.

6. **Join Optimization Rule (Performance)**  
   - If the original query had filters on both base table (`p.*`) and territorial table (`t.*`), and there's no OR semantic crossing tables:
     - Move territorial filters (`t.*`) to the ON clause of the LEFT JOIN
     - Keep base table filters (`p.*`) in the WHERE clause
     - Add `AND t.id_proyecto IS NOT NULL` in WHERE if territorial match is mandatory
   - If the query has OR semantic crossing tables (e.g., "educativos OR en Santo Domingo"), keep traditional WHERE pattern.
""".strip()


MODULAR_FUNDING_GUIDELINES = """
### **Funding Sources Module:**

#### **7.1 When to JOIN stg_mapainv_proyectosfuentesfinanciamiento:**
1. **Explicit request**: User explicitly mentions financers, funding sources, loans, grants, or similar concepts.
2. **Keyword matching**: The analyzer detected theme keywords that match funding sources (e.g., "emprendimiento" matching "apoyo a emprendimientos" in `fuente_financiacion`).
   - Check if `theme_strategy.notes` contains "funding_join_required" or if `search_fields` includes `f.fuente_financiacion` or `f.organismo_financiador`.

#### **7.2 JOIN Pattern:**
When joining `stg_mapainv_proyectosfuentesfinanciamiento` (alias `f`) on `f.id_proyecto = p.id_proyecto`:
- Apply the same country filter: `f.pais_iso3 = '{country_code}'`
- Use columns: `organismo_financiador`, `fuente_financiacion`, and relevant year fields if needed.

#### **7.3 Keyword Search in Funding Columns:**
If the analyzer includes `f.fuente_financiacion` or `f.organismo_financiador` in the search_fields for keyword matching:
```sql
-- Search keywords in funding sources with OR logic
WHERE (
  process_text(p.nombre_proyecto) ILIKE '%' || process_text('keyword') || '%'
  OR 
  process_text(p.objetivo_proyecto) ILIKE '%' || process_text('keyword') || '%'
  OR 
  process_text(f.fuente_financiacion) ILIKE '%' || process_text('keyword') || '%'
  OR 
  process_text(f.organismo_financiador) ILIKE '%' || process_text('keyword') || '%'
)
```

#### **7.4 Amount Reporting:**
- Never aggregate or report financing-table amounts unless the user explicitly requests them.
- Otherwise stay with `valor_proyecto` from the main project table.
- Do not use `process_text()` inside the SELECT list.
""".strip()


MODULAR_FUNDING_GUIDELINES_REGEN = """
- Only keep this join if the user explicitly asks about financers or funding sources.
- If funding is indeed requested, ensure `stg_mapainv_proyectosfuentesfinanciamiento` (alias `f`) remains joined on `f.id_proyecto = p.id_proyecto`.
- Report key columns (`organismo_financiador`, `fuente_financiacion`) and keep the country filter on `f.pais_iso3`.
- Do not aggregate amounts from this table unless the user asked for funding-specific totals.
""".strip()


_GENERATE_SQL_QUERY_PROMPT_BASE = """ 
You are tasked with generating a POSTGRESQL query based on the provided context. Construct a precise and efficient SQL statement compatible with POSTGRESQL syntax.

---

### **Guidelines for POSTGRESQL Query Construction:**

#### **1. Context Analysis**
   - Carefully analyze the user's question and the provided context.
   - Identify relevant **tables**, **columns**, and their relationships.
   - Extract key filters such as country codes, years, categories, or keywords.
   - If looking for places, territory, sectors, or entity names, consider adding a filter `process_text(<alias>.<column>) ILIKE '%' || process_text(?) || '%'` for partial matches on the attributes `nombre_proyecto` or `nombresector_proyecto`.
   - If you use `nombre_proyecto`, **always retrieve `id_proyecto`** to properly identify the project.

#### **2. Query Construction Rules**
   - Use proper **POSTGRESQL syntax**.
   - It is **strictly forbidden** to emit DDL/DML statements: `DROP`, `ALTER`, `INSERT`, `UPDATE`, `DELETE`, `TRUNCATE`.
   - If you use `ORDER BY` together with `SELECT DISTINCT`, **every column** used in `ORDER BY` **must appear in the SELECT list** (or apply the ordering in a wrapping subquery).
   - If you use `LIMIT`, you **must** include an `ORDER BY` immediately before it; **never** emit `LIMIT` without `ORDER BY`.   
  - **String filtering for all WHERE filters is mandatory.** Always wrap the column side with `process_text(<alias>.<column>)` and the value side with `process_text(...)`, e.g.  
    `process_text(p.estado_proyecto) ILIKE '%' || process_text('ejecución') || '%'`.  
    **Place `%` outside `process_text()` on the value side.** Always write:
    `process_text(p.nombre_proyecto) ILIKE '%' || process_text('pyme') || '%'`
    (never inside `process_text`).
    Never emit comparisons missing `process_text` on either side.
  - **EXCEPTION FOR IDs/CODES**: For columns `codigo_snip`, `id_proyecto` and `pais_iso3`, **ALWAYS use strict equality (`=`) or `IN (...)`**.
  - **NEVER use `process_text` or `ILIKE` on `codigo_snip`, `id_proyecto` or `pais_iso3`.**
  - Correct: `p.codigo_snip = '123456'`
  - Correct: `p.pais_iso3 = 'dom'`
  - Incorrect: `process_text(p.pais_iso3) ...` (Forbidden for these columns)
  - For all OTHER text columns (names, objectives, descriptions), use `process_text(column)` on BOTH sides.
  - **If you satisfy an analyzer-mandated text filter, append a marker right after that block:**  
    `/* satisfies_filter: column=<alias>.<column> literal=<token1|token2> */`  
    Use lowercase tokens without `%` and separate multiples with `|`. This tag is required so validators recognize the filter as fulfilled.
   - **Territorial filters**: 
     - **PREFERRED**: Use single column from `resolved_territories` if available
     - **LEGACY**: If disambiguation disabled, use triple-OR pattern for backward compatibility
     - Always check `resolved_territories` first before applying territorial filters
  - **When you join tables that have multiple rows per project (e.g., territorios, fuentes de financiamiento), keep the output deduplicated a nivel proyecto.** Use `SELECT DISTINCT` o `GROUP BY p.id_proyecto` (junto con las columnas agregadas necesarias) salvo que la pregunta pida explícitamente ver cada detalle del lado "muchos".
  - **⚠️ CRITICAL: Do NOT use `DISTINCT ON (p.id_proyecto)` when you need ORDER BY for ranking/TOP N queries** (e.g., "top 3 by investment", "mayor inversión"). PostgreSQL requires `DISTINCT ON` columns to appear FIRST in ORDER BY, which breaks value-based sorting. Use `GROUP BY` instead:
    ```sql
    -- ✅ CORRECT for "top 3 by investment":
    SELECT p.id_proyecto, p.nombre_proyecto, p.valor_proyecto
    FROM stg_mapainv_proyectosaprobadosinv p
    INNER JOIN stg_mapainv_proyectosterritorios t ON p.id_proyecto = t.id_proyecto
    WHERE ...
    GROUP BY p.id_proyecto, p.nombre_proyecto, p.valor_proyecto
    ORDER BY p.valor_proyecto DESC
    LIMIT 3
    ```
  - When filtering by project name or description using keywords, **prefer general or root terms** (e.g., `"metro"` instead of `"línea de metro"`) to reduce false negatives.
   - When applying keyword filters, **prioritize `p.nombre_proyecto` and `p.objetivo_proyecto` only**. Do *not* apply keyword filters to financing columns (such as `fuente_financiacion`, `organismo_financiador`) unless the user explicitly asks for financers or funding sources.
   - When computing totals or monetary aggregates, **use only the columns from `stg_mapainv_proyectosaprobadosinv`** (e.g., `valor_proyecto`, `valor_ejecutado_proyecto`). Do **not** sum or report amounts from `stg_mapainv_proyectosfuentesfinanciamiento` unless the user explicitly requests funding-source amounts.
   - If the user does **not** mention financers/funding or territorial locations, ignore the funding/territorial guidelines and work exclusively with the main project table.
   - Use `YYYY-MM-DD` format for date filters.
   - Apply aggregations (`SUM`, `AVG`,`MAX`,`MIN`) with **proper `GROUP BY` clauses**.
   - When catalog guidance (sector/entity/state) provides an exact value, **apply it with `UPPER(TRIM(<alias>.<column>)) = UPPER(TRIM('<value>'))`**. Do not wrap these equalities in `process_text`, and only fall back to textual keywords if that equality returns zero rows.
   - Always filter by country using a direct equality (`<alias>.pais_iso3 = '{country_code}'`).
   - When available, include `url_link_proyecto` for external project links.
   - If you need both `ORDER BY` and `LIMIT`, **place the `ORDER BY` clause before `LIMIT`**.
   - Avoid using process_text() inside the SELECT, because this will change the output format of string columns.

#### **2.1 CRITICAL: PostgreSQL ROUND() Type Casting Rule**

> [!WARNING]
> **PostgreSQL does NOT support `ROUND(double precision, integer)`**. You MUST cast to `NUMERIC` when rounding calculated values.

**MANDATORY patterns when using `ROUND(..., N)` with calculations:**

**❌ WRONG - Will cause runtime error:**
```sql
-- Error: SUM() returns double precision by default
ROUND(SUM(valor_proyecto) / 100.0, 2)

-- Error: Division of numeric by double precision yields double precision  
ROUND((suma_salud::numeric / suma_total) * 100, 2)

-- Error: Even with NULLIF, if operands are mixed types
ROUND(SUM(val) / NULLIF(total, 0) * 100, 2)
```

**✅ CORRECT - Cast calculation to NUMERIC:**
```sql
-- Option 1: Cast the entire expression (RECOMMENDED for complex expressions)
ROUND(CAST((SUM(valor_proyecto) / 100.0) AS NUMERIC), 2)

-- Option 2: Cast aggregates at the source (RECOMMENDED for CTEs)
WITH totals AS (
    SELECT SUM(valor_proyecto)::numeric AS suma_total
    FROM ...
)

-- Option 3: Cast both division operands
ROUND((suma_salud::numeric / NULLIF(suma_total::numeric, 0)) * 100, 2)

-- Option 4: Protect division and cast result
ROUND(CAST((suma_salud::numeric / NULLIF(suma_total, 0)) AS NUMERIC), 2)
```

**BEST PRACTICE:** When creating CTEs with aggregations that will be used in calculations:
- Cast aggregates immediately: `SUM(valor_proyecto)::numeric AS total`
- Always use `NULLIF(..., 0)` when dividing to prevent division by zero
- Wrap complex expressions in `CAST((...) AS NUMERIC)` before ROUND

   - **Totales y porcentajes**: Para evitar `GroupingError` con CTE + CROSS JOIN de totales, usa `MAX(cte.total)` en el SELECT o una ventana `SUM(...) OVER ()` como divisor (más limpio) en lugar de referenciar la columna del CTE sin agregarla.

#### **3. Specific Optimization Rules**
   - **If the query retrieves `objetivo_proyecto`, ensure it is truncated to 150 characters:**
     ```sql
     LEFT(objetivo_proyecto, 150) AS objetivo_proyecto
     ```
   - **Never use `SELECT *` unless explicitly requested**.
   - If output is listing projects, **always include `id_proyecto`** for correct identification.
   - Limit the output to {sql_rows_limit} rows unless otherwise requested**.
   - Organize filters properly to avoid ambiguity.
   - Avoid using generic terms like *proyecto*, *programa*, *project* or *program* in text filters; they add no value and hurt recall.
   - When filtering by sector consider also `nombreentidadejecutora_proyecto` as a complementary OR-condition; projects are sometimes registered only under the executing entity.


#### **4. Query Optimization**
   - Ensure **efficient joins** between tables using aliases when necessary to avoid ambiguity.
   - When using `OR` conditions, separate **years and string searches into DISTINCT groups**.
   - **Ensure that all selected attributes exist** in the tables provided.
   - Use the attribute: `nombresector_proyecto` for filtering by sector or category filters, as it is a catalog attribute.
   - Avoid using IN (...) for sector filtering to ensure flexibility with partial and fuzzy matches.
   - the attribute tipo_proyecto is used for active or inactive projects, and it is not a catalog attribute.

<<TERRITORIAL_GUIDELINES>>
<<FUNDING_GUIDELINES>>

### **6. Date Filtering (Year Range)**
- When filtering by years, use `anio_fechainicio_proyecto` and `anio_fechafin_proyecto`.
- If both a start and end year are implied (e.g., "desde 2020 hasta 2023"), apply:
  ```sql 
  anio_fechainicio_proyecto <= 2023 AND anio_fechafin_proyecto >= 2020
  ```

- If only a **start year** is implied (e.g., "desde 2020"), apply:
  ```sql
  anio_fechafin_proyecto >= 2020
  ```

- If only an **end year** is implied (e.g., "hasta 2023"), apply:
  ```sql
  anio_fechainicio_proyecto <= 2023
  ```

- Avoid using strict equality (e.g., `anio_fechainicio_proyecto = 2020`) unless the user explicitly asks for projects that **started** in that year.
- The year values above are just examples. Always extract the actual years from the user question - do not hardcode values.
- This ensures the project was **active** at any point within the range.

---
### **Dimension Hints (Analyzer + Catalog)**
- Summary (if "None", no qualifying dimension filter was detected): {dimension_hints_summary}
- Relevant dimension catalog subset (JSON): {dimension_hints}
- Normalized vocabulary derived from the catalog (JSON): {dimension_vocabulary}
- When present, align your filters with these catalog values so the SQL honors the analyzer's high-confidence dimensions.

---
### **Context && Few-Shots**
The provided context includes relevant results that have been reranked based on relevance. 
Use this context as the primary foundation for constructing the SQL query. 
Prioritize the listed attributes in the query structure, ensuring they are accurately reflected in the design:

Use the following context to guide your query generation:
```xml
<context>
{context}
{context_fewshots}
</context>
```

---
### **DDL's AVAILABLE TABLES**
```json
{schema_json}
```

---
### **LLM Analyzer Findings (Authoritative)**
The following JSON was generated by a prior LLM pass that parsed the
question and the schema.  **Use it as ground-truth** for:

* Which fields must be selected (`select_fields`).
* Which tables and join paths (`tables_and_joins`) are required.
* Which filters are mandatory (`filters`) with their confidences.

```json
{analysis}
```

•	Do NOT ignore these hints unless you detect an impossible column or table (e.g., not present in the DDL); in that case, choose the closest valid alternative and note it in the WHERE comment (comment will be stripped later).
•	Prefer the same table aliases suggested in tables_and_joins.
    
---
### **Double Check Before Submitting**
- Are all text filters using the functions strategy  process_text(column_name) = process_text('?') or process_text(column_name) ILIKE '%' || process_text(?) || '%' 
- Is `pais_iso3` filtered correctly using direct equality with `{country_code}` (no `process_text`, no `ILIKE`)?
- Are project listings including `id_proyecto`, `nombre_proyecto`, and `url_link_proyecto`?
- Are all joins safe with `DISTINCT` when joining with `stg_mapainv_proyectosterritorios`?
- Are all selected attributes existing in the tables provided?
- Avoid this kind of SQL Error [42702]: ERROR: column reference "pais_iso3" is ambiguous
- Sure the query will not response in any psycopg.errors?
- Check this posible error and avoid it: "psycopg.errors.InvalidColumnReference) for SELECT DISTINCT, ORDER BY expressions must appear in select list"
- Avoid using process_text() inside the SELECT, because this will change the output format of string columns?
- Are you using aliases to avoid the "AmbigiousColumn" error?
- Are you using the correct table names and column names?
- Check and avoid any psycopg.errors
- All fields/tables present in the query are consistent with select_fields and tables_and_joins from the Analysis JSON.
- ORDER BY must precede LIMIT; never emit LIMIT before ORDER BY.

---
### **Question**
```sql
{question}
```

---
### ** One-liner SQL Query**
**Provide only the SQL query** Do **not** include SQL comments, explanations or extra text - only the structured fields, must be runnable.
Answer:
""".strip()


_REGENERATE_QUERY_PROMPT_BASE = """

You are a Postgres SQL expert tasked with fixing a query that previously failed. The query is intended to answer a user's question.

Input:
- Failure Details (includes the error and the previously executed query): {failure_message}
- User's Original Question: {question}
- Table Definitions: {context}
- Few Shots: {context_fewshots}
- Country Code: {country_code}
- Errors Block (history of previous SQL attempts and errors, may be empty; if longer than 1500 chars, focus on the last 3): {errors_block}
- Structured SQL Error Info (JSON, may be empty): {sql_error_info}
- Previous SQL Query with errors: {prev_sql}
**Note:** *{prev_sql}* may be an empty string when no query was produced. If it is empty, start a brand-new query from scratch using the remaining inputs.
- LLM Analyzer Findings (authoritative hints extracted from the question): {analysis}

- Always honor explicit filters stated in the user's original question (years, territories, entities, keywords, etc.). These user-provided constraints override conflicting hints from {analysis}, {context}, or {context_fewshots} unless the user explicitly asks to broaden the scope.
- When catalog guidance points to an exact value (sector/entity/state), reapply it using `UPPER(TRIM(<alias>.<column>)) = UPPER(TRIM('<value>'))`. Do not wrap these equalities with `process_text`, and only relax them to keyword searches if the strict equality returned zero rows previously.

## Using the Analyzer
- Prefer the tables, joins, and filters suggested in the Analysis JSON.
- If an item from `analysis` is impossible (column not in DDL), pick the closest valid alternative.

Instructions:

1. Analyze the Failure:
- Understand the Error Message: Carefully review the provided error message (errors block) **and the structured `sql_error_info` (if present)** to identify the root cause of failure.  
- Review the Failed Query: Identify syntax errors, invalid columns, missing filters, or incorrect aggregations.
- Review the Errors Block: If not empty, detect repeated error patterns or missing columns mentioned there.
- Understand the User's Intent: Reconstruct the purpose of the query based on the original user question and context.

2. Regenerate the SQL Query:
- Use valid column names that exist in the provided table definitions.
- If the error is due to an invalid column, do not reuse it. Find an alternative or restructure the logic.
- Apply the correct table and column names based on the DDL definitions.
- Fix syntax or logic issues, including GROUP BY, incorrect JOINs, or aggregation errors.
- Ensure the query respects PostgreSQL syntax and formatting best practices.
- Check and ensure strategies to Avoid AmbigiousColumn errors.
- Each additional `process_text()` increases execution time. If you were matching several synonyms of the same idea on the same column, collapse them into a single, more general predicate (keep only the most representative term) unless you truly need separate conditions for different concepts or columns.
- **EXCEPTION FOR IDs/CODES**: For `codigo_snip`, `id_proyecto` and `pais_iso3`, **ALWAYS use strict equality (`=`)**. Do NOT use `process_text` or `ILIKE` for these specific columns. Treat them as exact identifiers.
- When joins involve tables con múltiples filas por proyecto (territorios, fuentes de financiamiento, etc.), asegúrate de que la salida quede deduplicada a nivel proyecto. Usa `SELECT DISTINCT` o `GROUP BY p.id_proyecto` con los agregados necesarios, salvo que el usuario pida ver cada fila del lado "muchos".
- **⚠️ CRÍTICO: No uses `DISTINCT ON (p.id_proyecto)` cuando necesites ORDER BY para ranking/TOP N** (ej: "top 3 por inversión", "mayor inversión"). PostgreSQL requiere que las columnas de DISTINCT ON aparezcan PRIMERO en ORDER BY, lo cual rompe el ordenamiento por valor. Usa `GROUP BY` en su lugar.
- When the user asks for counts/totals (phrases like "¿Cuántos…?", "¿Cuál es el total…?", "¿Cuánta…?"), respond with an aggregate query (`COUNT(*)`, `COUNT(DISTINCT ...)`, or `SUM(...)` según corresponda) en lugar de devolver listados extensos.

3. Filtering and Constraints:
- Always filter by country using a direct equality on the relevant alias (e.g. `p.pais_iso3 = '{country_code}'`). Do not wrap the country value with `process_text` or `ILIKE`.
- When territories are involved:
  - Check `resolved_territories` for specific column
  - If present, use ONLY that column
  - If absent and disambiguation enabled, skip territorial filter
  - If absent and disambiguation disabled, use triple-OR (legacy)
- Do **not** join tables of financing sources or apply filters on `fuente_financiacion` / `organismo_financiador` unless the user explicitly mentioned financers, funding sources, loans, grants, etc. If funding is not mentioned, stay within the main project table.
- When computing totals or monetary aggregates, use only `stg_mapainv_proyectosaprobadosinv` monetary columns (`valor_proyecto`, `valor_ejecutado_proyecto`, etc.). Do **not** sum values from `stg_mapainv_proyectosfuentesfinanciamiento` unless the user explicitly asked for funding-source amounts.
- If the structured intent includes a year filter (`year_filter_range`), apply:
    - If both start and end exist: anio_fechainicio_proyecto <= end AND anio_fechafin_proyecto >= start
    - If only start: anio_fechafin_proyecto >= start
    - If only end: anio_fechainicio_proyecto <= end
- Values for start/end are integers (YYYY), not full dates.
- **Ensure that all selected attributes exist** in the tables provided.
- Use the attribute: `nombresector_proyecto` for filtering by sector or category filters, as it is a catalog attribute.
- Avoid using IN (...) for sector filtering to ensure flexibility with partial and fuzzy matches.
- When you apply analyzer-mandated textual filters, append `/* satisfies_filter: column=<alias>.<column> literal=<token1|token2> */` immediately after that block. Use lowercase tokens stripped of `%` and separate multiples with `|`. This marker is mandatory so validators accept the filter as satisfied.
- The attribute tipo_proyecto is used for active or inactive projects, and it is not a catalog attribute.
- If `{analysis}` or any context snippet suggests filters that contradict the user's explicit constraints, ignore the conflicting hint. When `{analysis}` and the context disagree, prefer `{analysis}` because it already reflects the interpreted intent. Document the reason only when an inline SQL comment is already present in that section.
- If you apply `ORDER BY`, ensure the ordering columns are present in the SELECT projection (or use a subquery) to avoid select-distinct / order mismatches.

#### **CRITICAL: PostgreSQL ROUND() Type Casting (Fix Required)**

> [!WARNING]  
> **PostgreSQL does NOT support `ROUND(double precision, integer)`**. Always cast to `NUMERIC` when rounding calculations.

**If the error mentions `function round(double precision, integer) does not exist`, apply this fix:**

```sql
-- ❌ WRONG (causes the error you're fixing):
ROUND(SUM(valor_proyecto) / total, 2)
ROUND((numeric_value / double_precision_value) * 100, 2)

-- ✅ CORRECT (cast entire expression):
ROUND(CAST((SUM(valor_proyecto) / NULLIF(total, 0)) AS NUMERIC), 2)

-- ✅ ALSO CORRECT (cast aggregates at source in CTEs):
WITH totals AS (
    SELECT SUM(valor_proyecto)::numeric AS suma_total
)

-- ✅ ALSO CORRECT (cast both operands):
ROUND((value1::numeric / NULLIF(value2::numeric, 0)) * 100, 2)
```

**Key points:**
- Cast the **entire calculation** to `NUMERIC` before `ROUND`
- OR cast aggregates (`SUM`, `AVG`) to `::numeric` in CTEs
- Always use `NULLIF(..., 0)` to prevent division by zero

- **Totals & percentages**: To avoid GroupingError with a single-row CTE + CROSS JOIN in a GROUP BY query, use `MAX(cte.total)` in the SELECT or a window `SUM(...) OVER ()` as divisor instead of referencing the CTE column without aggregating it.

4. Project Details and Joins:
- If the query joins with stg_mapainv_proyectosterritorios, use DISTINCT to avoid duplicates due to 1:N relationship.
- Always use JOIN aliases (e.g., p, t) to improve readability and avoid ambiguity.

5. Verification:
- Do not include any column that is not present in the DDL.
- Ensure the regenerated SQL query is valid, efficient, readable, and correctly answers the user's question.
- The query should return only what is relevant based on the user's intent - do not include explanatory text, formatting artifacts, or unrelated columns. If requires_project_details is true, include the appropriate descriptive fields defined in the schema.
- Output must be a single, valid PostgreSQL query (no markdown or explanations).
- If the query is too complex, simplify the logic while maintaining the original intent.

** Protips for double checking the query:**

- Are column names and table names correctly spelled?
- If using aggregation (e.g., SUM, COUNT) and GROUP BY, ensure that:
    - All non-aggregated columns in the SELECT clause are also listed in the GROUP BY clause.
    - This includes expressions like e.g., `LEFT(p.objetivo_proyecto, 150)` - they must be **either grouped as-is** or moved out of aggregation contexts.
    - If that is not possible or makes the query too complex, consider removing the aggregation or simplifying the result.
- Pay special attention to common POSTGRESQL Errors and fix them accordingly.
- Try using blacklist words to remove words from strings and splitting them so filter into separate words with OR conditions.
- Avoid this kind of SQL Error [42702]: ERROR: column reference "pais_iso3" is ambiguous
- Is this possible error fixed? avoid generating query that may have this error: "Always be careful with psycopg.errors.AmbiguousColum"?
- Check this posible error and avoid it: "psycopg.errors.InvalidColumnReference) for SELECT DISTINCT, ORDER BY expressions must appear in select list"
- Ensure `ORDER BY` appears before any `LIMIT` clause (ORDER BY ... LIMIT n).
- Sure the new query will not response in any psycopg.errors?
- ORDER BY must precede LIMIT; never emit LIMIT before ORDER BY.
- Do not order by columns that are missing from SELECT; include them or wrap with a subquery before applying ORDER BY.
- Review the WHERE clause and collapse redundant `process_text` conditions; keep only the most representative term per column unless distinct concepts are required.
- Para preguntas de conteo, valida que realmente estés usando `COUNT`/`SUM` y que la salida final refleje ese total.
-	If the previous query returned 0 rows and there are multiple textual filters over p.nombre_proyecto / p.objetivo_proyecto in separate blocks joined by AND, rewrite them into a single block: AND ( … OR … ), keeping all other filters intact (country, status, territory, years).
-	If the analyzer suggests that two keywords belong to the same theme (see THEME_MATCH_STRATEGY.notes / keywords or semantic_or_groups), join those keywords with OR in the same textual block (do not use AND).
    
### **DDL's AVAILABLE TABLES**
```json
{schema_json}
```


**Output:**
Return only the corrected fixed PostgreSQL query. Do not include any explanation, markdown formatting, or commentary.
"""


choose_sql_prompt = """################################################################################
# INSTRUCTIONS
################################################################################
You are an expert PostgreSQL SQL reviewer.

################################################################################
# INPUTS
################################################################################
USER QUESTION:
{question}

CANDIDATE QUERIES (0-based):
{sql_block}

EXECUTION PREVIEW (JSON rows ≤ {rows_preview}):
{rows_block}

ERRORS (from EXPLAIN or runtime failures):
{errors_block}

################################################################################
# SCHEMA (enriched, truncated)
################################################################################
```json
{schema_json}
```

################################################################################
# LLM ANALYSIS (LLM-generated drafting of the SQL plan)
```json
{analysis}
```

################################################################################
# TASK
################################################################################
Pick the one query that:
0. Ensure ALL INPUTS, SCHEMA AND LLM ANALYSIS is used as ground-truth for:
   - Which fields must be selected (`select_fields`).
   - Which tables and join paths (`tables_and_joins`) are required.
   - Which filters are mandatory (`filters`) with their confidences.
1. Successfully ran under PostgreSQL (no syntax or schema errors).  
2. Returns the most relevant and sufficient rows to answer the user question.
3. Is simplest in structure (minimal joins, clear filters).
4. When the analyzer indicated same-theme synonyms, prefer the candidate that uses a single block AND (… OR …) over p.nombre_proyecto / p.objetivo_proyecto instead of multiple AND blocks for those keywords.

################################################################################
# OUTPUT
################################################################################
Return **only** a JSON object (no extra text):
```json
{{
  "best_idx": <0 ... n>,
  "rationale": "<up to 50 words>"
}}
```
""".strip()


generate_sql_query_prompt = build_generate_sql_query_prompt(True, True)
regenerate_query_prompt = build_regenerate_query_prompt(True, True)


__all__ = [
    "MODULAR_TERRITORIAL_GUIDELINES",
    "MODULAR_FUNDING_GUIDELINES",
    "MODULAR_TERRITORIAL_GUIDELINES_REGEN",
    "MODULAR_FUNDING_GUIDELINES_REGEN",
    "build_generate_sql_query_prompt",
    "build_regenerate_query_prompt",
    "build_keyword_regenerate_prompt",
    "build_trigram_regenerate_prompt",
    "choose_sql_prompt",
    "generate_sql_query_prompt",
    "regenerate_query_prompt",
]
