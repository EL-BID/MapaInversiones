







CREATE     view [stpPsgr].[Vw_ObjetivosPND_STP]
as
select	planes.idPlan
		,planes.codigoEstructura as codPlan
		,planes.nombre as nombrePlan
		,ejeEstrategico.idPlan as idEje
		,ejeEstrategico.codigoEstructura as codEje
		,ejeEstrategico.nombre as nombreEje
		,lineaTransversal.idPlan as idLinea
		,lineaTransversal.codigoEstructura as codLinea
		,lineaTransversal.nombre as nombreLinea
		,estrategias.idPlan as idObjetivoEstrategico
		,estrategias.codigoEstructura as codObjetivoEstrategico
		,estrategias.nombre as nombreObjetivoEstrategico
		,estrategias.descripcion as descripcionObjetivoEstrategico
		,tipoObjetivos.idPlan as idTipoObjetivo
		,tipoObjetivos.codigoEstructura as codTipoObjetivo
		,tipoObjetivos.nombre as nombreTipoObjetivo
		,objetivos.idPlan as idObjetivoEspecifico
		,objetivos.codigoEstructura as codObjetivoEspecifico
		,objetivos.nombre as nombreObjetivoEspecifico
from	[stpPsgr].PLANES as ejeEstrategico
		inner join [stpPsgr].PLANES as lineaTransversal
			on ejeEstrategico.idPadre = lineaTransversal.idPadre
			and ejeEstrategico.alturaNivel = 2
			and lineaTransversal.alturaNivel = 3
		inner join [stpPsgr].PLANES as planes
			on ejeEstrategico.idPadre = planes.idPlan
			and lineaTransversal.idPadre = planes.idPlan
			and planes.alturaNivel = 1
		inner join [stpPsgr].PLANES as estrategias
			on estrategias.idPadre = ejeEstrategico.idPlan
			and estrategias.idPadre2 = lineaTransversal.idPlan
			and estrategias.alturaNivel = 4
		inner join [stpPsgr].PLANES as objetivos
			on objetivos.idPadre = estrategias.idPlan
			and objetivos.alturaNivel = 6
		inner join [stpPsgr].PLANES as tipoObjetivos
			on objetivos.idPadre2 = tipoObjetivos.idPlan
			and tipoObjetivos.alturaNivel = 5
where	planes.codigoEstructura = 9
order by	codPlan
			,codEje
			,codLinea
			,codObjetivoEstrategico
			,codObjetivoEspecifico offset 0 rows
