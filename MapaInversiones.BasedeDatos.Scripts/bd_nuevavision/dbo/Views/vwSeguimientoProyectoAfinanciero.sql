CREATE VIEW [dbo].[vwSeguimientoProyectoAfinanciero]
AS
/****** Script for SelectTopNRows command from SSMS  ******/
SELECT [IdSeguimientoProyecto]
      ,p.[codigoBPIN]
	  ,pr.NombreProyecto
      ,[AvanceFinanciero]
	  ,T.[Fecha] FechaInicio
	  ,T1.[Fecha] FechaFin
	  ,DATEDIFF(DAY, t.Fecha, t1.Fecha) DiasTotales
	  ,DATEDIFF(DAY, t.Fecha, GETDATE()) DiasTranscurridos
	  ,E.NombreEstado
	  ,S.IdSector
	  ,S.NombreSector
FROM [PISGR_DWH_PY].[dbo].[SeguimientoProyecto] AS P 
INNER JOIN [PISGR_DWH_PY].[dbo].Proyecto pr
ON p.IdProyecto = pr.IdProyecto
INNER JOIN [PISGR_DWH_PY].[dbo].Estado AS E
ON E.IdEstado = P.IdEstado
INNER JOIN [PISGR_DWH_PY].[dbo].Sector AS S
ON S.IdSector = P.IdSector
INNER JOIN [PISGR_DWH_PY].[dbo].Tiempo AS T
ON P.IdFechaInicio = T.IdFecha
INNER JOIN [PISGR_DWH_PY].[dbo].Tiempo AS T1
ON P.IdFechaFin = T1.IdFecha