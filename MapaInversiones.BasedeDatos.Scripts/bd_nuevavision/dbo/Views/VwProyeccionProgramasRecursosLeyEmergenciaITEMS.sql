
CREATE   VIEW [dbo].[VwProyeccionProgramasRecursosLeyEmergenciaITEMS] 
as 

Select distinct * from (
SELECT distinct
p.IdItem,
p.Item,
p.IdArticulo,
p.Articulo,
p.DescripcionArticulo,
p.PlanificadoValorUSD,
p.TransferidoValorUSD,
 a.[codigoprogramaNegocio],
[Nivel]
      ,E.[CodigoEntidad]
	  ,E.Entidad
      ,[ClasePrograma]
      ,[CodigoPrograma]
	  ,NombrePrograma
      ,[CodigoProyecto]
       ,[NombreActividadProyecto],
	   CAST (1 AS INT) Financiador
	   ,CAST('FINANCIADOR' AS VARCHAR(255)) AS [NombreOF]
	   ,CAST (1 AS INT) Fuente
	   ,CAST('FUENTE' AS VARCHAR(255)) [NombreFF]
	   ,sum(b.meta)  OVER(PARTITION BY [Nivel],E.[CodigoEntidad],[ClasePrograma],[CodigoProyecto]) as PresupuestoProgramaxActividad ,
sum(b.avance)  OVER(PARTITION BY  [Nivel],E.[CodigoEntidad],[ClasePrograma],[CodigoProyecto]) as AvanceProgramaxActividad,

    
		b.CodigoObjeto,
		  REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(replace(REPLACE(replace(b.[NombreObjeto],',',''),'$',''),'"',''),'”',''),'“',''),'-',''), CHAR(13), ''), CHAR(10), '') as NombreObjeto
		
		,sum(b.meta)  OVER(PARTITION BY [Nivel],E.[CodigoEntidad],[ClasePrograma],[CodigoProyecto],b.CodigoObjeto) as PresupuestoProgramaxObjeto ,
sum(b.avance)  OVER(PARTITION BY  [Nivel],E.[CodigoEntidad],[ClasePrograma],[CodigoProyecto],b.CodigoObjeto) as AvanceProgramaxObjeto

	  FROM [dbo].[Programa] as A
  inner join  (select DISTINCT idPrograma,CodigoProducto,CodigoObjeto,[NombreObjeto]
				,Fuente,Financiador,CodigoDepartamento
			,SUM(avance) as avance, SUM(meta) as meta
			from  [dbo].[ProgramaMetasFinancieras] as b
			group by idPrograma,CodigoProducto,CodigoObjeto,[NombreObjeto]
			,Fuente,Financiador,CodigoDepartamento) as b
  on A.Id=b.idPrograma 
  inner join (
  SELECT  DISTINCT [CodigoNivel]
      ,cast ([CodigoEntidad] as int) as CodigoEntidad,
      cast([NombreEntidad] as varchar(60)) as Entidad
  --   ,E.[CodigoFuenteFinanciamiento]
--	 ,E.[NombreFF]
	-- ,E.[CodigoOrganismoFinanciador]
	-- ,E.[NombreOF]
  FROM [dbo].[EstructuraEntidades] E)E
  on E.CodigoEntidad=a.CodigoEntidad AND A.Nivel=E.CodigoNivel
 -- AND E.[CodigoFuenteFinanciamiento]=b.Fuente
--  and E.[CodigoOrganismoFinanciador]=b.Financiador
 inner join [dbo].[ProyeccionRecursosITEMS] p

 on p.codigoprogramaNegocio=a.codigoprogramaNegocio
 and p.codigoProyectoActividad=a.CodigoProyecto
 and p.FuenteFinanciacion=b.Fuente and p.OrganismoFinanciador=b.Financiador
  group by 
  [Nivel]
      ,E.[CodigoEntidad]
	  ,E.Entidad
      ,[ClasePrograma]
      ,[CodigoPrograma]
      ,[NombrePrograma]
      ,[CodigoProyecto]
       ,[NombreActividadProyecto]
      ,a.[codigoprogramaNegocio]
	  ,b.CodigoProducto
		,b.CodigoObjeto,b.meta,b.avance,b.NombreObjeto
		,   Financiador
	  -- ,[NombreOF]
	   ,Fuente
	  -- ,[NombreFF]
	   ,p.IdItem,
p.Item,
p.IdArticulo,
p.Articulo,
p.DescripcionArticulo,
p.PlanificadoValorUSD,
p.TransferidoValorUSD)T
	--	where [IdItem]!=6


