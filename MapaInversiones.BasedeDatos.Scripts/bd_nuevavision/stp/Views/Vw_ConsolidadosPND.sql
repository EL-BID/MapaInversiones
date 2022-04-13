

CREATE     view [stp].[Vw_ConsolidadosPND]
as
SELECT	count(distinct est.idPlan) as Planes
		,count(distinct est.idEjeEstrategico) as EjesEstrategicos
		,count(distinct est.lineaTransversalId) as LineasTransversales
		,count(distinct est.estrategiaId) as Estrategias
		,count(distinct est.idObjetivo) as Objetivos
		,count(distinct est.nivel) as Niveles
		,count(distinct est.entidad) as Entidades
		,count(distinct CONCAT(est.nivel, '-', est.entidad, '-', est.tipo_presupuesto, '-', est.programa, '-', est.subprograma, '-', est.proyecto, '-', est.producto)) as productos
FROM	(select	distinct est.*
				,prod.nivel
				,prod.entidad
				,prod.tipo_presupuesto
				,prod.programa
				,prod.subprograma
				,prod.proyecto
				,prod.producto
		from	[NuevaVisionPY].[stp].[Vw_EstrategiasPND2030_STP] AS est
				INNER JOIN [NuevaVisionPY].[stp].[Vw_resultadoInmediatoXobjetivoPND2030_STP] AS obj ON est.idObjetivo = obj.id
				INNER JOIN [NuevaVisionPY].[stp].[Vw_productoXresultadoInmediato_STP] AS prod ON prod.id = obj.objetivo_id) AS est
