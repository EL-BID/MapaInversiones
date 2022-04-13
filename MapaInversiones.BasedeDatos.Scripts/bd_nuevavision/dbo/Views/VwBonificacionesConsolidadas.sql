
CREATE VIEW [dbo].[VwBonificacionesConsolidadas]
as
SELECT  ISNULL(CAST(ROW_NUMBER() OVER(ORDER BY Anio,MES,GrupoOcupacional ASC) AS INT),0) AS RowId,
		[Anio]
      ,[Mes]
      ,ltrim(rtrim([GrupoOcupacional])) as GrupoOcupacional
      ,sum([MontoRemitido]) as MontoRemitido
	  ,COUNT(DISTINCT [CI]) AS NumeroGratificados
FROM 
[dbo].[GratificacionCovid] GC
inner join (Select distinct [CodigoObjetoGasto],[NombreOG] from [dbo].[EstructuraEntidades]) ee
on GC.[IdObjetoGasto]=ee.CodigoObjetoGasto
group by [Anio]
      ,[Mes]
      ,[GrupoOcupacional]
