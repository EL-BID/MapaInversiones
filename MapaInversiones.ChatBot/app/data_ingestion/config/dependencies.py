# Dependency Graph Definition
# Format: "child_table": ["parent_table1", "parent_table2"]
# This ensures that parent tables are populated before child tables (for inserts)
# and child tables are cleaned before parent tables (for deletes/truncates).

DEPENDENCIES = {
    # Staging Tables
    "stg_mapainv_proyectosterritorios": ["stg_mapainv_proyectosaprobadosinv"],
    "stg_mapainv_proyectosfuentesfinanciamiento": ["stg_mapainv_proyectosaprobadosinv"],
    # Schema Tables (Metadata)
    "sch_countries": [],  # Independent base
    "sch_tables": ["sch_countries"],
    "sch_columns": ["sch_tables"],
    "sch_values": ["sch_columns"],
    "sch_relations": ["sch_tables"],
    # Dimensions
    "dim_sectores": ["stg_mapainv_proyectosaprobadosinv"],
    "dim_territorios": ["stg_mapainv_proyectosterritorios"],
    # ... add others as we migrate
    # Knowledge
    "raw_fewshots": [],
    "sch_fewshots": ["raw_fewshots"],
    # Documents
    "public.documents": ["sch_tables", "sch_columns", "sch_values", "sch_fewshots"],
}


def get_processing_order(tables: list[str], reverse=False) -> list[str]:
    """
    Returns a topological sort of the tables based on dependencies.
    If reverse=True, returns order for Deletion (Children first).
    If reverse=False, returns order for Insertion (Parents first).
    """
    from graphlib import TopologicalSorter

    ts = TopologicalSorter()
    for table in tables:
        # Add dependencies for this table if they are in the list of interest
        deps = DEPENDENCIES.get(table, [])
        # We only care about dependencies that are also in the 'tables' list?
        # Or generally? Usually for a batch load we want full order.
        # But here we just map the graph.
        for dep in deps:
            ts.add(table, dep)
        if not deps:
            ts.add(table)

    # TopologicalSorter gives parents first (dependencies first)
    order = list(ts.static_order())

    # Filter to only return tables present in input if desired,
    # but usually we want the full chain logic.
    # For now, let's assume we pass the full list of tables involved in a stage.

    final_order = [t for t in order if t in tables]

    if reverse:
        return final_order[::-1]
    return final_order
