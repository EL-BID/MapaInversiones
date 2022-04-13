


CREATE VIEW [dbo].[VwDatosAbiertosEjecucionContable] 
as 
SELECT distinct  [NivelEntidad] as Nivel
      ,[CodEntidad] as CodigoEntidad
      ,[Entidad]
      ,[ClasePrograma]
      ,[CodPrograma] as CodigoPrograma
      ,[NombrePrograma]
      ,[CodProyActividad] as CodigoProyectoActividad
      ,[NombreProyActividad] as NombreActividadProyecto
      ,[PRY_Clasificacion] as ClasificacionActividadProyecto
      ,[Codigo_SNIP]
      ,[CodObjeto] as CodigoObjeto
      ,[NombreObjeto]
     ,Fuente
		,F.NombreFF as NombreFuente
		,Financiador,
      F.[NombreOF] as NombreFinanciador
      ,[Departamento]
      ,[Unidad]
      ,[Asiento]
      ,[DOC_FHCLAB]
      ,[RUC_Proveedor]
      ,[NombreProveedor]
      ,[Comprobante]
      ,[DOC_CONCEPTO]
      ,[CodigoContratacion]
      ,[Monto]
      ,[FechaModificacion] as FechaCargueArchivo
	  ,'Dirección de Presupuesto - Ministerio de Hacienda - Programas Sustantivos Asociadas COVID19' as FuenteDatos
  FROM [dbo].[ProgramaEjecucionContable]
  inner join (SELECT distinct [NombreOG]
      ,[CodigoOrganismoFinanciador]
      ,[NombreOF]
      ,[CodigoFuenteFinanciamiento]
      ,[NombreFF]
	  
  FROM [dbo].[EstructuraEntidades]
  WHERE CodigoNivel in (12,24,27) and CodigoEntidad in (Select distinct [CodigoEntidad] from dbo.Programa) )F
  on F.CodigoFuenteFinanciamiento=Fuente and Financiador=F.CodigoOrganismoFinanciador
  --and Asiento=1415


