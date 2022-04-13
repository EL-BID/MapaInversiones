



CREATE     view [stp].[Vw_EstrategiasPND2030_STP]
as
SELECT	distinct p.[id] as idPlan
		,p.[nombre] as nombrePlan
		,p.[descripcion] as descripcionPlan
		,EE.[id] as idEjeEstrategico
		,EE.[nombre] as ejeEstrategicoNombre
		,EE.[descripcion] as ejeEstrategicoDescripcion 
		,lt.[id] as lineaTransversalId
		,lt.[nombre] as lineaTransversalNombre
		,est.id as estrategiaId
		,est.nombre as estrategiaNombre
		,est.descripcion as estrategiadescripcion
		,obj.id as idObjetivo
		,obj.nombre as objetivoNombre
FROM	[stp].[plan] as p
		INNER JOIN  [stp].[linea_transversal] AS Lt on p.id=lt.plan_id
		INNER JOIN [stp].[eje_estrategico] AS EE ON EE.plan_id=p.id
		inner join [stp].[estrategia] as est on p.id=est.[plan]
			and ee.id=est.eje_estrategico_id
			and lt.id=est.linea_transversal_id
		inner join stp.estrategiaXObjetivo as eo on eo.estrategia_id=est.id
			and eo.estrategia_linea_transversal_id=lt.id
			and eo.estrategia_eje_estrategico_id=EE.id
		inner join stp.objetivo as obj on obj.id=eo.objetivo_id
where	p.id=9
		and eo.objetivo_tipo_objetivo_id = 1
		--and obj.tipo_objetivo_id = 1
