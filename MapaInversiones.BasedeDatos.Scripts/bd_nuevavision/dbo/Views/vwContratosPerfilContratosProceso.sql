
CREATE VIEW [dbo].[vwContratosPerfilContratosProceso] AS  

SELECT
ISNULL(YEAR(p.FechaInicioContrato),YEAR(c.FechaFirmaContrato))  AS Anio,
cast(isnull(CEF.CodigoPrograma,9999) as int) as Id_Programa,
	p.IdProceso,
	ISNULL(p.DescripcionOferta,'SIN INFORMACION') AS DescripcionProceso, --CAMBIO 1 DE MAYO 2020
	entidadcontratante.Nombre as UnidadCompra,
	p.EstadoProceso as EstadoProceso,
	c.DuracionContrato as OfertaPeriodoDuracion ,
	CEF.FechaInicioContrato AS FCH_INICIO_PUBLICACION,
	CEF.[FechaFinalizacionContrato] AS FCH_FIN_PUBLICACION,
	p.FechaDeEmisionCodContracto AS FCH_ESTIMADA_ADJUDICACION,
--	p.uriProceso AS [URL],  --SE ELIMINA EL CAMPO
	P.CategoriaContratacion,
	P.MetodoContratacion,
	p.CodigoContrato,
	ISNULL(C.TipoContrato,'SIN INFORMACION') AS DescripcionContrato,
	contratista.Nombre AS [razonsocial],
	CASE WHEN substring(contratista.Codigo ,4,3 )<>'RUC' THEN 'NO RUC' ELSE 'RUC' END   as [tipodocumento],
	contratista.Codigo AS [numerodocumento],
	'https://contrataciones.gov.py/licitaciones/adjudicacion/contrato/'+c.awardID+'.html' as urlContrato
	,isnull(CEF.[CodigoDepartamento],0) as [CodigoDepartamento]
	,c.ValorContrato
	,c.[MonedaContrato]
FROM Procesos as p 
LEFT join  Contratos c
on p.CodigoContrato=c.CodigoContrato
LEFT join EntidadContrato as contratista
on p.CodigoProveedor=contratista.Codigo
left join (SELECT  H.CodigoContrato
			,(concat(codigoNivel,codigoEntidad,tipoPrograma,codigoPrograma))as codigoPrograma
			,max([CodigoDepartamento])[CodigoDepartamento]
			,Max(h.[FechaFinalizacionContrato])[FechaFinalizacionContrato]
			,MIN([FechaInicioContrato])[FechaInicioContrato]
			FROM ContratosEjecucionFinanciera as H 
			where RegistroActivo=1
			and MontoAUtilizar>0
			and cast(FechaModificacion as date) = (select max(cast(fechamodificacion as date)) from ContratosEjecucionFinanciera)
			GROUP BY H.CodigoContrato,(concat(codigoNivel,codigoEntidad,tipoPrograma,codigoPrograma))
			) as CEF
on c.CodigoContrato=CEF.CodigoContrato
LEFT join EntidadContrato as EntidadContratante
on p.CodigoEntidadConvocante=EntidadContratante.Codigo
--LEFT JOIN Programa AS X
--on X.codigoprogramaNegocio=CEF.codigoPrograma
where ValorContrato is not null
--and  c.CodigoContrato='CE-12008-20-187708'
--and p.IdProceso=382025
