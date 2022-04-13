

-------------------------------------
--Autor Mod: JCastiblanco
--Fecha: 2020-05-03
--Modificación:  Se agrega campo FechaFirmaContrato
--select * from [dbo].[vwContratosPerfilContratistaInformacionContratacion]
--Fecha: 2020-05-09
--Modificación:  Se actualiza fecha Publicacion Proceso desde el mapeo del json
--Fecha: 2021-02-21
--Modificación:  se actualiza script para dejar solo la ejecucion financiera Registro Activo a fin de eliminar duplicidad de registros
--------------------------------------
CREATE VIEW [dbo].[vwContratosPerfilContratistaInformacionContratacion] AS 
SELECT DISTINCT
	isnull(p.codigo_BPIN,0) as  IdProyecto, 
	cast(isnull(CEF.CodigoPrograma,9999) as int) as Id_Programa,
	P.CodigoContrato,
	p.EstadoProceso, 
	p.IdProceso , 
	CASE WHEN substring(contratista.Codigo ,4,3 )<>'RUC' THEN 'NO RUC' ELSE 'RUC' END   as [tipodocumento],
	contratista.Codigo as numerodocumento,
	contratista.Nombre AS Contratista, 
	isnull(p.FechaPublicacion,GETDATE()) as FechaPublicacion 
	,p.uriProceso --https://www.contrataciones.gov.py/licitaciones/adjudicacion/contrato/228085-consorcio-sgp-18.html--
	,p.UrlResumenAdjudicacion
	,p.UrlProveedoresAdjudicados
	,p.UrlProveedoresOferentes
	,p.UrlDocumentosAdjudicacion
	,p.UrlPreciosReferencia
	,p.UrlInvitados
	,P.DescripcionOferta,
	P.FechaInicioContrato AS FechaInicioContrato,
	p.FechaFinContrato AS FechaFinContrato,
	P.DuracionContrato,
	c.FechaFirmaContrato,
	C.ValorContrato,
	case when cef.codigoprogramaNegocio IS not null then 1
	when p.Es_Covid =1 then 2 else 0 end as COVID19
FROM Procesos as p 
LEFT join  Contratos c
on p.CodigoContrato=c.CodigoContrato
LEFT join EntidadContrato as contratista
on p.CodigoProveedor=contratista.Codigo
left join (SELECT  H.CodigoContrato
			,(concat(codigoNivel,h.codigoEntidad,tipoPrograma,h.codigoPrograma))as codigoPrograma
			,codigoprogramaNegocio
			,max(h.CodigoDepartamento)[CodigoDepartamento]
			,Max(h.[FechaFinalizacionContrato])[FechaFinalizacionContrato]
			,MIN([FechaInicioContrato])[FechaInicioContrato]
			FROM ContratosEjecucionFinanciera as H 
			left join VwProgramaLineaCompleta  as x
			on x.LineaPresupuestal
		=concat(h.codigoNivel,h.codigoEntidad,h.tipoPrograma,h.codigoPrograma,H.CodigoProyecto
		,H.ObjetoGasto,H.FuenteFinanciamiento,H.CodigoFinanciador
		
		)	
		where RegistroActivo=1
		and MontoAUtilizar>0
			and cast(FechaModificacion as date) = (select max(cast(fechamodificacion as date)) from ContratosEjecucionFinanciera)
    GROUP BY H.CodigoContrato,(concat(codigoNivel,h.codigoEntidad,tipoPrograma,h.codigoPrograma))
	,codigoprogramaNegocio) as CEF
on c.CodigoContrato=CEF.CodigoContrato
WHERE C.ValorContrato IS NOT NULL
--and c.CodigoContrato='CE-12008-20-191288'
