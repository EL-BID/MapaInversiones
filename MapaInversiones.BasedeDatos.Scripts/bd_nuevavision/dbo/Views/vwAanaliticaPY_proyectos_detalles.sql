
create view vwAanaliticaPY_proyectos_detalles as

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


	-- da detalles y ABRE REGTISTROS
	,vwff.OrganismoFinanciador
	,vwff.FuenteFinanciacion


	,vwff.aniovigencia
	,vwff.presupuestovigente
	,vwff.presupuestoobligado
	,vwff.presupuestopagado


	-- da detalles y ABRE REGISTROS
	,sefp.[IdTipoRecurso]
	,(select top 1 NombreFF from EstructuraEntidades where CodigoFuenteFinanciamiento = sefp.[IdTipoRecurso]) as TipoRecursoNombreFuenteFinanciamiento
	
	,sefp.[IdEntidad]
	,(select top 1 NombreOF from EstructuraEntidades where nombreof <> 'SIN INFORMACION' AND CodigoOrganismoFinanciador = sefp.[IdEntidad]) as EntidadOrganismoFinanciador

	,sefp.[IdTipoEntidad] --[NombreEntidad] en  [PISGR_PY_COVID19].[dbo].[Fuente] on [IdTipoEntidad] 
	--se puede unir estructura entidades con fuentes para tener catalogo completo

	


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



--test 1 proyecto
--where p.IdProyecto = 2

-- fin vista 2
