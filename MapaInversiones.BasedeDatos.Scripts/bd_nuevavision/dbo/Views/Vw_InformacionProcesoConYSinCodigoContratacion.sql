---------------------------------
-- Autor: JCastiblanco
-- Fecha: 2020-05-10
-- Descripciòn: Se modifica vista para incluir el awardID
-----------------------------------
---------------------------------
-- Autor: JCastiblanco
-- Fecha: 2021-02-21
-- Descripciòn: se hace modificación para soportar contratos con más de un contratista
-----------------------------------

CREATE   VIEW [dbo].[Vw_InformacionProcesoConYSinCodigoContratacion]
as
Select distinct  
			     year(isnull(w.fechafirmacontrato,w.[FechaPublicacion])) as Anio
				,cpcp.UnidadCompra
				,w.[EstadoProceso]
				,w.[CodigoContrato]
				,cast(w.[IdProceso] as varchar(30)) as [CodigoProceso]
				,w.[tipodocumento]
				,w.[numerodocumento]
				,w.[Contratista]
				,w.[uriProceso] as DocURL
				,w.UrlResumenAdjudicacion
				,w.UrlInvitados
				,w.[FechaPublicacion] 
				,cpcp.[OfertaPeriodoDuracion]
				,w.[FechaFirmaContrato] 
				,w.[FechaInicioContrato]
				,w.[FechaFinContrato]
				,w.ValorContrato
				,cpcp.MetodoContratacion
				,cpcp.CategoriaContratacion
				,cpcp.[FCH_INICIO_PUBLICACION]
				,cpcp.[FCH_FIN_PUBLICACION]
				,cpcp.[FCH_ESTIMADA_ADJUDICACION]
				,REPLACE(cpcp.[DescripcionContrato],'´´','') as [DescripcionContrato]
				,REPLACE(cpcp.[DescripcionProceso],'´´','') as [DescripcionProceso]
				, w.COVID19
				,w.IdProyecto
				,w.Id_Programa
				,cc.awardID
FROM vwContratosPerfilContratistaInformacionContratacion w
left join vwContratosPerfilContratosProceso cpcp
on w.IdProceso=cpcp.IdProceso 
and w.codigocontrato=cpcp.codigocontrato 
and w.numerodocumento=cpcp.numerodocumento
left join  [PISGR_PY_COVID19].[dbo].Contratos as cc
on w.CodigoContrato=cc.CodigoContrato
--where w.codigoContrato='CE-12008-20-187903'

--select *
--from vwContratosPerfilContratistaInformacionContratacion
--where codigoContrato='CE-12008-20-187903'

union all 

select year(isnull(c.FechaPublicacion,getdate())) as Anio
,d.Nombre as UnidadCompra
,c.EstadoProceso
,c.CodigoContrato
,cast(c.IdProceso as varchar(30)) as [CodigoProceso]
,CASE WHEN substring(contratista.Codigo ,4,3 )<>'RUC' THEN 'NO RUC' ELSE 'RUC' END   as [tipodocumento],
	contratista.Codigo as numerodocumento,
	contratista.Nombre AS Contratista, 
	c.uriProceso as DocUrl,
	c.urlResumenAdjudicacion,
	C.UrlInvitados,
	C.FechaPublicacion,
	null as ofertaPeriodoDuracion,
	cast(null as datetime2) as fechafirmaContrato,
	null as fechaInicioContrato,
	null as fechaFinContrato,
	A.Valor as ValorContrato,
	c.MetodoContratacion as MetodoContratacion,
	c.CategoriaContratacion as CategoriaContratacion,
	null as FCH_INICIO_PUBLICACION,
	NULL AS FCH_FIN_PUBLICACION,
	NULL AS FCH_ESTIMADA_ADJUDICACION,
	NULL AS DESCRIPCIONCONTRATO,
	c.DescripcionOferta as DescripcionProceso,
	2 as COVID19,
	c.codigo_BPIN as IdProyecto,
	'9999' as id_Programa,
	a.AwardId
  FROM [PISGR_PY_COVID19].[dbo].[ContratistaContrato] as a
  left join Contratos as b
  on a.[AwardId]=b.[AwardId]
  left join Procesos as c
  on a.AwardId=c.AwardId
  --and a.CodigoProveedor=c.CodigoProveedor
  and a.AwardId=c.AwardId
  left join entidadContrato as d
  on c.codigocomprador=d.codigo
  LEFT join EntidadContrato as contratista
on c.CodigoProveedor=contratista.Codigo
where c.CodigoContrato=''
--and c.AwardId='382259-carlos-gabriel-sanchez-sartorio-1'
 
