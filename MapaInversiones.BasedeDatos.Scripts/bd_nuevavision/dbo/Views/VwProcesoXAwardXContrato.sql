-------------------------------------
--Autor: JCastiblanco
--Fecha: 2020-05-09
--Descripcion: Tabla que cruza contratos,procesos y contratistas
-- Para filtrar el dataset utilice FechaPublicacionProceso
----------------------------------------

CREATE   VIEW [dbo].[VwProcesoXAwardXContrato]
as
SELECT a.[OCID]
      ,a.[AwardId]
      ,[Estado]
      ,[Valor]
      ,[MonedaValor]
      ,[Proveedor]
      ,a.[CodigoProveedor]
      ,[FechaModificacion]
       ,b.CodigoContrato
	  ,c.IdProceso
	  ,c.Es_Covid
	  ,c.FechaPublicacion as FechaProcesoPublicacion
  FROM [PISGR_PY_COVID19].[dbo].[ContratistaContrato] as a
  left join Contratos as b
  on a.[AwardId]=b.[AwardId]
  left join Procesos as c
  on a.OCID=c.ocid
  and a.CodigoProveedor=c.CodigoProveedor
 -- where IdProceso=382306
--  ocid					date_cr
--	ocds-03ad3f-382306-1	2020-04-01T17:02:46-04:00

