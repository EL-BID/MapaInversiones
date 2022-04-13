CREATE VIEW [dbo].[VwDatosAbiertosEjecucionPresupuestaria] 
as 
SELECT  distinct
[Nivel],
[CodigoEntidad],
[Entidad],
[ClasePrograma],
[CodigoPrograma],
[NombreProgrma],
[CodigoProyecto] as CodigoProyectoActividad,
[NombreProyectoActividad],
[Clasificacion] as ClasificacionActividadProyecto,
[CodigoSnip] AS Codigo_SNIP,
cast([ObjetoGasto] as int) AS CodigoObjeto,
cast([NombreObjeto] as varchar(255)) as NombreObjeto,
  [FuenteFinanciamiento] AS Fuente
  ,[NombreFF] as NombreFuente,
      [EntidadFinanciamiento] as Financiador,
	 [NombreOF] as NombreFinanciador,
      [Pagado]
      ,[Planificado]
      ,[Ejecutado]
	   ,[Vigente]
      ,[Modificacion]
	  ,[FechaPresupuesto]
	  , [Anio]
	  ,[Pais]
      ,[Depto]
      ,[fechaModificacion] as FechaCargueArchivo
  	  ,'Dirección de Presupuesto - Ministerio de Hacienda - Programas Sustantivos Asociadas COVID19' as FuenteDatos

  FROM [dbo].[ProgramaEjecucionPresupuestaria]
  inner join (SELECT distinct 
 			[NombreOG]
      ,[CodigoOrganismoFinanciador]
      ,[NombreOF]
      ,[CodigoFuenteFinanciamiento]
      ,[NombreFF]
	  
  FROM [dbo].[EstructuraEntidades]
  WHERE CodigoNivel in (12,24,27) and CodigoEntidad in (Select distinct [CodigoEntidad] from dbo.Programa) )F
  on F.CodigoFuenteFinanciamiento=[FuenteFinanciamiento] and [EntidadFinanciamiento]=F.CodigoOrganismoFinanciador
  inner join (SELECT distinct [CodigoObjeto]
      ,[NombreObjeto]

  FROM [dbo].[ProgramaMetasFinancieras])o
  on o.CodigoObjeto=[ObjetoGasto]
--    where Nivel=12 and CodigoEntidad=18 AND ClasePrograma=2 and CodigoPrograma=1 and CodigoProyecto=2

