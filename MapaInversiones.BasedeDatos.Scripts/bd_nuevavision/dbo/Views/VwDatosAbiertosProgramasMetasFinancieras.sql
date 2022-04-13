












CREATE VIEW [dbo].[VwDatosAbiertosProgramasMetasFinancieras] 
as 

Select distinct * from (
SELECT distinct
 [Nivel]
      ,E.[CodigoEntidad]
	  ,E.Entidad
      ,[ClasePrograma]
      ,[CodigoPrograma]
	  ,NombrePrograma
      ,[CodigoProyecto] as CodigoProyectoActividad
       ,[NombreActividadProyecto],
		b.CodigoObjeto,
		  REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(replace(REPLACE(replace(b.[NombreObjeto],',',''),'$',''),'"',''),'”',''),'“',''),'-',''), CHAR(13), ''), CHAR(10), '') as NombreObjeto
		,Fuente
		,F.NombreFF as NombreFuente
		,Financiador,
      F.[NombreOF] as NombreFinanciador
	  ,Meta
	  ,Avance
	  ,FechaMeta
	  ,FechaUltimaModificacion as FechaCargueArchivo
	  ,'Dirección de Presupuesto - Ministerio de Hacienda - Programas Sustantivos Asociadas COVID19' as FuenteDatos

	FROM [dbo].[Programa] as A
  inner join  (select idPrograma,CodigoProducto,CodigoObjeto,[NombreObjeto]
				,Fuente,Financiador,CodigoDepartamento
			,SUM(avance) as avance, SUM(meta) as meta,FechaMeta,FechaUltimaModificacion
			from  [dbo].[ProgramaMetasFinancieras] as b
			group by idPrograma,CodigoProducto,CodigoObjeto,[NombreObjeto]
			,Fuente,Financiador,CodigoDepartamento,FechaMeta,FechaUltimaModificacion
			) as b
  on A.Id=b.idPrograma 
  inner join  (
  SELECT  DISTINCT [CodigoNivel]
      ,cast ([CodigoEntidad] as int) as CodigoEntidad,
      cast([NombreEntidad] as varchar(60)) as Entidad
     
  FROM [dbo].[EstructuraEntidades] E)E
  on E.CodigoEntidad=a.CodigoEntidad AND A.Nivel=E.CodigoNivel
  
  inner join (SELECT distinct [NombreOG]
      ,[CodigoOrganismoFinanciador]
      ,[NombreOF]
      ,[CodigoFuenteFinanciamiento]
      ,[NombreFF]
	  
  FROM [dbo].[EstructuraEntidades]
  WHERE CodigoNivel in (12,24,27) and CodigoEntidad in (1,8,6,18,1,3,7) and [CodigoClasePograma] in (2))F
  on F.CodigoFuenteFinanciamiento=Fuente and Financiador=F.CodigoOrganismoFinanciador

  group by 
  [Nivel]
      ,E.[CodigoEntidad]
	  ,E.Entidad
      ,[ClasePrograma]
      ,[CodigoPrograma]
      ,[NombrePrograma]
      ,[CodigoProyecto]
       ,[NombreActividadProyecto]
      ,[codigoprogramaNegocio]
	  ,b.CodigoProducto
		,b.CodigoObjeto,b.meta,b.avance,b.NombreObjeto
		,Fuente
		,F.NombreFF
		,Financiador,
      F.[NombreOF] 
	  ,FechaMeta,FechaUltimaModificacion
		)T
		WHERE -- MONTH(FechaMeta)>2 and  MONTH(FechaMeta)<=MONTH(GETDATE())
		 avance>0 or META>0


