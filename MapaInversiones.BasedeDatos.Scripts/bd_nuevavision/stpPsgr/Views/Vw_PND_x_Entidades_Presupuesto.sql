










CREATE     view [stpPsgr].[Vw_PND_x_Entidades_Presupuesto]
as
select	distinct 
		ob.idPlan
		,ob.codPlan
		,ob.nombrePlan
		,ob.idEje
		,ob.codEje
		,ob.nombreEje
		,ob.idLinea
		,ob.codLinea
		,ob.nombreLinea
		,ob.idObjetivoEstrategico
		,ob.codObjetivoEstrategico
		,ob.nombreObjetivoEstrategico
		,ob.descripcionObjetivoEstrategico
		,ob.idTipoObjetivo
		,ob.codTipoObjetivo
		,ob.nombreTipoObjetivo
		,ob.idObjetivoEspecifico
		,ob.codObjetivoEspecifico
		,ob.nombreObjetivoEspecifico
		,pre.sector
		,pnd.idNivel
		,pnd.codNivel
		,pnd.nombreNivel
		,pnd.idEntidad
		,pnd.codEntidad
		,pnd.nombreEntidad
		,pre.año
		,sum(pre.valorPlanificado) as planificado
		,sum(pre.valorEjecutado) as ejecutado
from	stpPsgr.Vw_ObjetivosPND_STP as ob
		inner join stp.Vw_PND2030_STP as pnd
			on ob.codPlan = pnd.idPlan
			and ob.codEje = pnd.idEjeEstrategico
			and ob.codLinea = pnd.lineaTransversalId
			and ob.codObjetivoEstrategico = pnd.estrategiaId
			and ob.codObjetivoEspecifico = pnd.idObjetivo
		inner join stpPsgr.Vw_Presupuesto_x_Sector_STP as pre
			on pre.codEntidad = pnd.codEntidad
			and pre.nombreEntidad = pnd.nombreEntidad
			and pre.codPrograma = pnd.codPrograma
			and pre.nombrePrograma = pnd.nombrePrograma
group by	ob.idPlan
			,ob.codPlan
			,ob.nombrePlan
			,ob.idEje
			,ob.codEje
			,ob.nombreEje
			,ob.idLinea
			,ob.codLinea
			,ob.nombreLinea
			,ob.idObjetivoEstrategico
			,ob.codObjetivoEstrategico
			,ob.nombreObjetivoEstrategico
			,ob.descripcionObjetivoEstrategico
			,ob.idTipoObjetivo
			,ob.codTipoObjetivo
			,ob.nombreTipoObjetivo
			,ob.idObjetivoEspecifico
			,ob.codObjetivoEspecifico
			,ob.nombreObjetivoEspecifico
			,pre.sector
			,pnd.idNivel
			,pnd.codNivel
			,pnd.nombreNivel
			,pnd.idEntidad
			,pnd.codEntidad
			,pnd.nombreEntidad
			,pre.año
order by	ob.codObjetivoEspecifico offset 0 rows
