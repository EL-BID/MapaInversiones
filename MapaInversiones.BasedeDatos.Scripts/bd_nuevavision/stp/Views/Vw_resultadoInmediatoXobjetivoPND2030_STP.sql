



CREATE     view [stp].[Vw_resultadoInmediatoXobjetivoPND2030_STP]
as
---resultados inmediatos vinculado al objetivo del plan nacional de desarrollo.
select	distinct oho.*
		,o.id
		,o.nombre
from	[NuevaVisionPY].[stp].[objetivo_has_objetivo] AS oho
		inner join [NuevaVisionPY].[stp].[objetivo] AS o
			on oho.objetivo_rel_id = o.id
where	oho.borrado = 0
		AND o.borrado = 0
		AND o.tipo_objetivo_id = 1
		AND oho.objetivo_tipo_objetivo_id=2
		AND oho.objetivo_rel_tipo_objetivo_id=1
