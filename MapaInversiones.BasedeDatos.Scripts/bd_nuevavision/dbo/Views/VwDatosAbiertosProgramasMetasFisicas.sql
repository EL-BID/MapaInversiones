
















CREATE VIEW [dbo].[VwDatosAbiertosProgramasMetasFisicas] 
as 

SELECT distinct
 [Nivel]
      ,E.[CodigoEntidad]
	  ,E.Entidad
      ,[ClasePrograma]
      ,[CodigoPrograma]
	  ,NombrePrograma
      ,[CodigoProyecto] as CodigoProyectoActividad
       ,[NombreActividadProyecto],
	   [Objetivo]
	,[ResultadoIntermedio]
      ,[ResultadoInmediato]
      ,[Unidad]
      ,[MetaTotal]
      ,[Meta]
      ,[Avance]
	  ,[FechaMeta]
	  ,[FechaModificacion] as FechaCargueArchivo
	  ,FuenteDatos
	  FROM [dbo].[Programa] as A
  inner join  (SELECT [IdPrograma]
      ,[FechaMeta]
	  ,[Objetivo]
       ,[ResultadoIntermedio]
      ,[ResultadoInmediato]
      ,[Unidad]
      ,[MetaTotal]
      ,[Meta]
      ,[Avance]
      ,[FechaModificacion]
	  ,'Dirección de Presupuesto - Ministerio de Hacienda - Programas Sustantivos Asociadas COVID19' as FuenteDatos

  FROM [dbo].[ProgramaMetasFisicas] as b
				) as b
  on A.Id=b.idPrograma 
   inner join (
  SELECT  DISTINCT [CodigoNivel]
      ,cast ([CodigoEntidad] as int) as CodigoEntidad,
      cast([NombreEntidad] as varchar(60)) as Entidad
     
  FROM [dbo].[EstructuraEntidades] E)E
  on E.CodigoEntidad=a.CodigoEntidad AND A.Nivel=E.CodigoNivel
  
  
 
		WHERE -- MONTH(FechaMeta)>2 and  MONTH(FechaMeta)<=MONTH(GETDATE())
		[MetaTotal] >0 or Meta>0 or Avance>0
  


