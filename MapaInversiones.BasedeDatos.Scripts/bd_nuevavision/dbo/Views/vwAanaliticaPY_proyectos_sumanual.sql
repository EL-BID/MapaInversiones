
create view vwAanaliticaPY_proyectos_sumanual as 
-------------
with t1 as (

select distinct

	 p.idproyecto
	,p.NombreProyecto
	,convert(date, p.FechaInicioProyecto) as FechaInicioProyecto
	,convert(date, p.FechaFinProyecto) as FechaFinProyecto
	,p.VlrTotalProyectoTodasLasFuentes
	,p.ObjetivoGeneral
	,( select top 1 [NombreSector] from [Sector] s where p.IdSector = s.IdSector ) as sector
	,p.TipoDeProyecto
	,p.PorcentajeAvanceFisico
	,p.PorcentajeAvanceFinanciero

	/*
	-- da detalles y ABRE REGTISTROS
	-- para este nivel de detalles se puede usar otro select/vista.
	,vwff.OrganismoFinanciador
	,vwff.FuenteFinanciacion
	*/

	,vwff.aniovigencia
	,vwff.presupuestovigente
	,vwff.presupuestoobligado
	,vwff.presupuestopagado

	/*
	-- da detalles y ABRE REGISTROS
	,sefp.[IdTipoRecurso],
	,sefp.[IdTipoEntidad],
	,sefp.[IdEntidad]
	*/



from

proyecto p



left join 
	(
	select 
		idproyecto,
		OrganismoFinanciador,
		FuenteFinanciacion,
		vigencia as aniovigencia,
		presupuestovigente,
		presupuestoobligado,
		presupuestopagado
	from vwfuentefinanciacion 
	) vwff on p.IdProyecto = vwff.IdProyecto



left join 
	(
	SELECT 
		 [idSeguimientoEsquemaFinanciacion]
		,[ValorReportado]
		,[PresupuestoVigente]
		,[PresupuestoObligado]
		,[PresupuestoPagado]
		,[Anio]
		,[FechaInicioReporte]
		,[FechaFinalReporte]
		,[IdTipoRecurso]
		,[IdTipoEntidad]
		,[IdEntidad]
		,[idProyecto]
		,[FechaUltimaModificacion]
		,[ConsecutivoCarga]
		,[ModificadoPor]
	FROM [PISGR_PY_COVID19].[dbo].[SeguimientoEsquemaFinanciacionProyecto]
	) sefp on p.IdProyecto = sefp.idProyecto

left join [ProyectoXEntidadTerritorial] as etp on etp.IdProyecto=p.IdProyecto

left join vwMunicipioDepartamentoGeo as mun on etp.IdMunicipio=mun.IdMunicipio

)


select 
IdProyecto
,NombreProyecto
,FechaInicioProyecto
,FechaFinProyecto
,VlrTotalProyectoTodasLasFuentes
,ObjetivoGeneral
,sector
,TipoDeProyecto
,PorcentajeAvanceFisico --revisar porque se muestra la ultima foto y deberia ser updates anuales
,PorcentajeAvanceFinanciero --revisar porque se muestra la ultima foto y deberia ser updates anuales
,aniovigencia
,sum(presupuestovigente) as presupuestoVigenteAnio
,sum(PresupuestoObligado) as presupuestoObligadoAnio
,sum(PresupuestoPagado) as PresupuestoPagadoAnio

from t1

group by
IdProyecto
,NombreProyecto
,FechaInicioProyecto
,FechaFinProyecto
,VlrTotalProyectoTodasLasFuentes
,ObjetivoGeneral
,sector
,TipoDeProyecto
,PorcentajeAvanceFisico
,PorcentajeAvanceFinanciero
,aniovigencia
