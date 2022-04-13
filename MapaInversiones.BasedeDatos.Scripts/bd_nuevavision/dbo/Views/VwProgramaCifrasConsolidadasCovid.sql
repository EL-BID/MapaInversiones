







CREATE   VIEW [dbo].[VwProgramaCifrasConsolidadasCovid]
as
SELECT cast(isnull(B.codigoprogramaNegocio,0) as int)as CodigoPrograma
		,B.Nivel
      ,B.CodigoEntidad
      ,cast(C.[NombreEntidad] +'-'+REPLACE(REPLACE(NombrePrograma,'EMERGENCIA SANITARIA ANTE PANDEMIA',''),'PARTIDAS NO ASIGNABLES A PROGRAMAS','TRANSFERENCIAS') as varchar(60)) as Entidad
      ,B.ClasePrograma
      ,cast(B.CodigoPrograma as varchar(10))+'. '+B.NombrePrograma as NombrePrograma
	  ,MAX(Fuente) as Fuente
	,max(d.[descripcionFuenteFinanciamiento] )as NombreFuente
	  ,0 as Financiador
	  ,cast(C.[NombreEntidad] as varchar(60)) as NombreFinanciador 
	  ,CASE WHEN A.CodigoDepartamento='99' THEN '0' ELSE A.CodigoDepartamento END AS CodigoDepartamento
,sum(A.Meta) as PresupuestoProgramas
,sum(A.Avance) AS GastoActual
,COUNT(distinct (b.CodigoProyecto)) AS NroProyectosActividadesAsociados 
FROM ProgramaMetasFinancieras AS A
inner join Programa as B
on A.IdPrograma=B.Id
  inner join (SELECT distinct [CodigoNivel]
      ,[CodigoEntidad]
      ,[NombreEntidad]
  FROM [dbo].[EstructuraEntidades] 
  where 
  CodigoNivel in (12,24,27) and CodigoEntidad in (Select distinct [CodigoEntidad] from dbo.Programa)) as C
  on B.CodigoEntidad=C.CodigoEntidad and c.CodigoNivel=b.Nivel
  left join [dbo].[FuenteFinancieraPrograma] as D
on A.Fuente=	D.[codigoFuenteFinanciamiento] 
where A.Meta>0
group by  B.codigoprogramaNegocio,B.CodigoPrograma
		,B.Nivel
      ,B.CodigoEntidad
      ,C.[NombreEntidad]
      ,B.ClasePrograma
      ,B.NombrePrograma
	  --,A.Fuente
	   ,A.CodigoDepartamento
	 -- ,d.[descripcionFuenteFinanciamiento]
--order by codigoprogramaNegocio	
