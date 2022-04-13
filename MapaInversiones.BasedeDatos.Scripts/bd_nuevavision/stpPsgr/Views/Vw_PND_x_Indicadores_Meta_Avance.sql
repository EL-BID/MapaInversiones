

CREATE     view [stpPsgr].[Vw_PND_x_Indicadores_Meta_Avance]
as
select	distinct p.idEje
		,p.codEje
		,p.nombreEje
		,p.idObjetivoEstrategico
		,p.codObjetivoEstrategico
		,p.nombreObjetivoEstrategico
		,p.idObjetivoEspecifico
		,p.codObjetivoEspecifico
		,p.nombreObjetivoEspecifico
		,indicador.idIndicador
		,indicador.codIndicador
		,indicador.nombre
		,indicador.metodoDeCalculo
		,met.cantidad as meta
		,met.vencimiento as vencimientoMeta
		,av.cantidad as avance
		,av.vencimiento as vencimientoAvance
from	stpPsgr.Vw_ObjetivosPND_STP as p
		inner join stp.indicador as ind
			on ind.objetivo_id = p.codObjetivoEspecifico
		inner join stpPsgr.INDICADOR as indicador
			on indicador.codIndicador = ind.id
			and indicador.nombre = ind.nombre
		inner join [PISGRSTG_PY_COVID19].stpPsgr.Meta as met
			on met.indicador_id = indicador.codIndicador
		inner join (select	met.indicador_id
							,max(met.vencimiento) as vencimientoMax
					from	[PISGRSTG_PY_COVID19].stpPsgr.Meta as met
					where	met.indicador_id < 62
					group by	met.indicador_id) as fechasMeta
			on fechasMeta.indicador_id = met.indicador_id
			and fechasMeta.vencimientoMax = met.vencimiento
		inner join [PISGRSTG_PY_COVID19].stpPsgr.avance_indicador as av
			on av.indicador_id = indicador.codIndicador
		inner join (select	av.indicador_id
							,max(av.vencimiento) as vencimientoMax
					from	[PISGRSTG_PY_COVID19].stpPsgr.avance_indicador as av
					where	av.indicador_id < 62
					group by	av.indicador_id) as fechasAvance
			on fechasAvance.indicador_id = av.indicador_id
			and fechasAvance.vencimientoMax = av.vencimiento
where	indicador.idTipoIndicador = 1
		--and indicador.codIndicador = 220
		--and met.vencimiento like max(met.vencimiento)
group by	p.idEje
		,p.codEje
		,p.nombreEje
		,p.idObjetivoEstrategico
		,p.codObjetivoEstrategico
		,p.nombreObjetivoEstrategico
		,p.idObjetivoEspecifico
		,p.codObjetivoEspecifico
		,p.nombreObjetivoEspecifico
		,indicador.idIndicador
		,indicador.codIndicador
		,indicador.nombre
		,indicador.metodoDeCalculo
		,met.cantidad
		,met.vencimiento
		,av.cantidad
		,av.vencimiento
order by	p.codObjetivoEspecifico
			,indicador.codIndicador offset 0 rows
