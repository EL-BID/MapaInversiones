

CREATE VIEW [dbo].[VwDatosAbiertosBonificaciones]
as
SELECT 
		[Anio]
      ,[Mes],[IdObjetoGasto],[CI],[Nombres],[Apellidos]
      ,ltrim(rtrim([GrupoOcupacional])) as GrupoOcupacional
      ,[MontoRemitido] as MontoRemitido
	   ,'2020-11-15' as FechaCargueArchivo
	  ,'Ministerio de Salud Pública y Bienestar Social - Bonificaciones' as  FuenteDatos
FROM 
[dbo].[GratificacionCovid] GC

