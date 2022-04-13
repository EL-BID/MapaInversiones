CREATE VIEW [dbo].[VwProgramaLineaCompleta] 
as 
SELECT concat([Nivel],[CodigoEntidad],[ClasePrograma],[CodigoPrograma]
		,[CodigoProyecto],CodigoObjeto,[Fuente],[Financiador]) as LineaPresupuestal
 
		,[Id]
      ,[Nivel]
      ,[CodigoEntidad]
      ,[ClasePrograma]
      ,[CodigoPrograma]
      ,[NombrePrograma]
      ,[CodigoSubPrograma]
      ,[CodigoProyecto]
      ,[EsProgramaCovid]
      ,[NombreActividadProyecto]
      ,[codigoprogramaNegocio]
	  ,b.CodigoProducto
		,b.CodigoObjeto
		,b.Financiador
		,b.Fuente
		,b.CodigoDepartamento
		,b.avance
		,b.meta
  FROM [PISGR_PY_COVID19].[dbo].[Programa] as A
  inner join  (select idPrograma,CodigoProducto,CodigoObjeto
				,Fuente,Financiador,CodigoDepartamento
			,SUM(avance) as avance, SUM(meta) as meta
			from  [dbo].[ProgramaMetasFinancieras] as b
			group by idPrograma,CodigoProducto,CodigoObjeto
			,Fuente,Financiador,CodigoDepartamento) as b
  on A.Id=b.idPrograma 

  
