










CREATE VIEW [dbo].[VwProyeccionProgramasRecursosLeyEmergenciaOLD] 
as 

Select distinct * from (
SELECT distinct
Case when [codigoprogramaNegocio]='12828' and CodigoProyecto=1
then 1
when  [codigoprogramaNegocio]='12621' and CodigoProyecto=2
then 2
when [codigoprogramaNegocio]='12621'  and CodigoProyecto=3
then 2
when [codigoprogramaNegocio]='121821'  and CodigoProyecto=2
then 2
when  [codigoprogramaNegocio]='27321'  and CodigoProyecto=1
then 3
when [codigoprogramaNegocio]='27721'  and CodigoProyecto=1
then 3
when [codigoprogramaNegocio]='121331' and CodigoProyecto=1
then 4
when  [codigoprogramaNegocio]='12621' and CodigoProyecto=1
then 5
when [codigoprogramaNegocio]='12121' and CodigoProyecto=1
then 5
when [codigoprogramaNegocio]='24121' and CodigoProyecto=1
then 5
else 6
end as IdItem,
Case when [codigoprogramaNegocio]='12828' and CodigoProyecto=1
then 'SALUD'
when [codigoprogramaNegocio]='12621' and CodigoProyecto=2
then 'FUNCIONAMIENTO DEL ESTADO'
when [codigoprogramaNegocio]='12621'  and CodigoProyecto=3
then 'FUNCIONAMIENTO DEL ESTADO'
when [codigoprogramaNegocio]='121821'  and CodigoProyecto=2
then 'FUNCIONAMIENTO DEL ESTADO'
when [codigoprogramaNegocio]='27321'  and CodigoProyecto=1
then 'MIPYMES y Capitalización'
when [codigoprogramaNegocio]='27721'  and CodigoProyecto=1
then 'MIPYMES y Capitalización'
when [codigoprogramaNegocio]='121331' and CodigoProyecto=1
then 'Subsidios a Servicios Públicos'
when [codigoprogramaNegocio]='12621' and CodigoProyecto=1
then 'Protección Social'
when [codigoprogramaNegocio]='12121' and CodigoProyecto=1
then 'Protección Social'
when [codigoprogramaNegocio]='24121' and CodigoProyecto=1
then 'Protección Social'
else 'Otro'
end as Item,
Case when [codigoprogramaNegocio]='12828' and CodigoProyecto=1
then 514
when  [codigoprogramaNegocio]='12621' and CodigoProyecto=2
then 534
when [codigoprogramaNegocio]='12621'  and CodigoProyecto=3
then 534
when [codigoprogramaNegocio]='121821'  and CodigoProyecto=2
then 534
when  [codigoprogramaNegocio]='27321'  and CodigoProyecto=1
then 64
when [codigoprogramaNegocio]='27721'  and CodigoProyecto=1
then 64
when [codigoprogramaNegocio]='121331' and CodigoProyecto=1
then 62
when [codigoprogramaNegocio]='12621' and CodigoProyecto=1 
then 426
when [codigoprogramaNegocio]='12121' and CodigoProyecto=1
then 426
when [codigoprogramaNegocio]='24121' and CodigoProyecto=1
then 426
else 0
end as Planificado
,
Case when [codigoprogramaNegocio]='12828' and CodigoProyecto=1
then 99
when  [codigoprogramaNegocio]='12621' and CodigoProyecto=2
then 56
when [codigoprogramaNegocio]='12621'  and CodigoProyecto=3
then 56
when [codigoprogramaNegocio]='121821'  and CodigoProyecto=2
then 56
when  [codigoprogramaNegocio]='27321'  and CodigoProyecto=1
then 38
when [codigoprogramaNegocio]='27721'  and CodigoProyecto=1
then 38
when [codigoprogramaNegocio]='121331' and CodigoProyecto=1
then 19
when [codigoprogramaNegocio]='12621' and CodigoProyecto=1  
then 426
when [codigoprogramaNegocio]='12121' and CodigoProyecto=1
then 426
when [codigoprogramaNegocio]='24121' and CodigoProyecto=1
then 426
else 0
end as Transferido,
 [codigoprogramaNegocio],
[Nivel]
      ,E.[CodigoEntidad]
	  ,E.Entidad
      ,[ClasePrograma]
      ,[CodigoPrograma]
	  ,NombrePrograma
      ,[CodigoProyecto]
       ,CASE WHEN LEN([NombreActividadProyecto])=0 THEN 'SIN ACTIVIDAD'
	   ELSE 
	   isnull([NombreActividadProyecto],'SIN ACTIVIDAD') END as [NombreActividadProyecto],
	   sum(b.meta)  OVER(PARTITION BY [Nivel],E.[CodigoEntidad],[ClasePrograma],[CodigoProyecto]) as PresupuestoProgramaxActividad ,
sum(b.avance)  OVER(PARTITION BY  [Nivel],E.[CodigoEntidad],[ClasePrograma],[CodigoProyecto]) as AvanceProgramaxActividad,

    
		b.CodigoObjeto,
		  REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(replace(REPLACE(replace(b.[NombreObjeto],',',''),'$',''),'"',''),'”',''),'“',''),'-',''), CHAR(13), ''), CHAR(10), '') as NombreObjeto
		
		,sum(b.meta)  OVER(PARTITION BY [Nivel],E.[CodigoEntidad],[ClasePrograma],[CodigoProyecto],b.CodigoObjeto) as PresupuestoProgramaxObjeto ,
sum(b.avance)  OVER(PARTITION BY  [Nivel],E.[CodigoEntidad],[ClasePrograma],[CodigoProyecto],b.CodigoObjeto) as AvanceProgramaxObjeto

	  FROM [dbo].[Programa] as A
  inner join  (select idPrograma,CodigoProducto,CodigoObjeto,[NombreObjeto]
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
     
  FROM [dbo].[EstructuraEntidades] E)E
  on E.CodigoEntidad=a.CodigoEntidad AND A.Nivel=E.CodigoNivel
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
		,b.CodigoObjeto,b.meta,b.avance,b.NombreObjeto)T
		where [IdItem]!=6

