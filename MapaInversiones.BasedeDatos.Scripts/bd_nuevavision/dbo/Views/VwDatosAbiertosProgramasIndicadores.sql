














CREATE VIEW [dbo].[VwDatosAbiertosProgramasIndicadores] 
as 

select 
a.Nivel
,a.CodigoEntidad
,e.Entidad
,a.ClasePrograma
,a.CodigoPrograma 
,a.NombrePrograma
,a.CodigoProyecto as CodigoProyectoActividad
,a.NombreActividadProyecto
,b.CodigoIndicador
,b.NombreIndicador
,b.MetaIndicador
,b.AvanceIndicador
,b.DenominadorIndicador
,b.PorcentajeMeta
,b.PorcentajeAvance
,b.TipoIndicador
,b.TamanoIndicador
,b.Tipo2Indicador
,b.FecuenciaIndicador
,b.Anio
,b.FechaUltimaModificacion as FechaCargueArchivo
,'Dirección de Presupuesto - Ministerio de Hacienda - Programas Sustantivos Asociadas COVID19' as FuenteDatos

from Programa as a
inner join Indicadores as b
on a.Id =b.IdPrograma
inner join  (
  SELECT  DISTINCT [CodigoNivel]
      ,cast ([CodigoEntidad] as int) as CodigoEntidad,
      cast([NombreEntidad] as varchar(60)) as Entidad
     
  FROM [dbo].[EstructuraEntidades] E)E
  on E.CodigoEntidad=a.CodigoEntidad AND A.Nivel=E.CodigoNivel
  
 where CodigoIndicador not in (1085,1086,1088,1091,1092)
		


  
 
	

