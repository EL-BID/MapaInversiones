




CREATE     view [stp].[Vw_productoXresultadoInmediato_STP]
as
---actividad/producto vinculados a los resultados inmediatos.
select	oho.*
		,o.id
		,o.nombre
		,o.descripcion
		,o.tipo_objetivo_id
from	[NuevaVisionPY].[stp].[objetivo_has_objetivo] AS oho
		INNER JOIN [NuevaVisionPY].[stp].[objetivo] AS o ON o.id = oho.objetivo_rel_id
where	oho.borrado = 0
		AND o.borrado = 0
		--AND o.tipo_objetivo_id = 2
		AND oho.objetivo_tipo_objetivo_id = 3
		AND oho.objetivo_rel_tipo_objetivo_id = 2
