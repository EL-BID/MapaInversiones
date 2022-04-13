
--select *  from [dbo].[VwContratosPerfilContratista] where COVID19 in (1,2)
--------------------------
--Autor Modificación: Julián Castiblanco
--Fecha:2020-04-22
--Descripcion cambio: modificaicon idPrograma para llave negocio y campo covid
--------------------------
CREATE   VIEW [dbo].[VwContratosPerfilContratista] AS  
SELECT
AnioInicioContrato,
AnioFinContrato,
Id_Programa,
COVID19,
	Contratista,
	[tipodocumento], --RUC
	[numerodocumento],
	SUM(MontoContratadoTotal) AS ValorTotalContratos,
	COUNT(distinct(codigocontrato)) AS NumContratos,
	COUNT(distinct(numerolicitacion)) AS NumProcesos
FROM
( 

SELECT DISTINCT
	ISNULL(YEAR(CEF.FechaInicioContrato),YEAR(c.FechaFirmaContrato)) as AnioInicioContrato,
	ISNULL(YEAR(CEF.FechaFinalizacionContrato),YEAR(c.FechaFirmaContrato)) as AnioFinContrato,
	contratista.Nombre AS Contratista, 
	CASE WHEN substring(contratista.Codigo ,4,3 )<>'RUC' THEN 'NO RUC' ELSE 'RUC' END   as [tipodocumento], --RUC
	contratista.Codigo   as [numerodocumento],
	ValorContrato AS MontoContratadoTotal, --[valorcontratado]
	p.CodigoContrato AS codigocontrato,
	p.IdProceso AS numerolicitacion,
	cast(ISNULL(CEF.CodigoPrograma,9999) as int) as Id_Programa,
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
		,H.ObjetoGasto,H.FuenteFinanciamiento,H.CodigoFinanciador)	
    GROUP BY H.CodigoContrato,(concat(codigoNivel,h.codigoEntidad,tipoPrograma,h.codigoPrograma)),codigoprogramaNegocio
			) as CEF
on c.CodigoContrato=CEF.CodigoContrato
where ValorContrato is not null

) Contratos
GROUP BY 
AnioInicioContrato,
AnioFinContrato,
Id_Programa,
COVID19,
	Contratista,
	[tipodocumento], 
	[numerodocumento]
