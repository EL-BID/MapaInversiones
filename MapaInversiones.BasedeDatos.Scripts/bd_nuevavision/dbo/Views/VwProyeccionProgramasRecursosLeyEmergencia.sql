


-------------------------
----descripcion cambio: se quita del presupuesto de salud el de la entidad universidad nacional de asuncion con el 
----fecha: 2020-11-18
----autor: julian castiblanco
---- se vuelve a incluir universidad nacional 20210318
-------------------------
----descripcion cambio: se agrupa parttion by item.  debido a que el mismo ministerio apoartaba para elmismo programa en dos items diferentes y programas
----fecha: 2021-04-06
----autor: julian castiblanco

CREATE VIEW [dbo].[VwProyeccionProgramasRecursosLeyEmergencia] 
as 

Select distinct * from (
SELECT distinct
p.IdItem,
p.Item,
p.PlanificadoValorUSD as Planificado,
p.TransferidoValorUSD as Transferido,
 a.[codigoprogramaNegocio],
[Nivel]
      ,E.[CodigoEntidad]
	  ,E.Entidad
      ,[ClasePrograma]
      ,[CodigoPrograma]
	  ,NombrePrograma
      ,[CodigoProyecto]
       ,[NombreActividadProyecto]
	   ,sum(b.meta)  OVER(PARTITION BY [Nivel],E.[CodigoEntidad],[ClasePrograma],[CodigoProyecto],p.IdItem ,[CodigoPrograma]) as PresupuestoProgramaxActividad ,
sum(b.avance)  OVER(PARTITION BY  [Nivel],E.[CodigoEntidad],[ClasePrograma],[CodigoProyecto],p.IdItem ,[CodigoPrograma]) as AvanceProgramaxActividad,

    
		b.CodigoObjeto,
		  REPLACE(REPLACE(REPLACE(REPLACE(REPLACE(replace(REPLACE(replace(b.[NombreObjeto],',',''),'$',''),'"',''),'”',''),'“',''),'-',''), CHAR(13), ''), CHAR(10), '') as NombreObjeto
		
		,sum(b.meta)  OVER(PARTITION BY [Nivel],E.[CodigoEntidad],[ClasePrograma],[CodigoProyecto],b.CodigoObjeto,p.IdItem ,[CodigoPrograma]) as PresupuestoProgramaxObjeto ,
sum(b.avance)  OVER(PARTITION BY  [Nivel],E.[CodigoEntidad],[ClasePrograma],[CodigoProyecto],b.CodigoObjeto,p.IdItem ,[CodigoPrograma]) as AvanceProgramaxObjeto


--select *
	  FROM [dbo].[Programa] as A
  inner join  (select distinct idPrograma,CodigoProducto,CodigoObjeto,[NombreObjeto]
				,Fuente,Financiador,CodigoDepartamento
			,SUM(avance) as avance, SUM(meta) as meta
			from  [dbo].[ProgramaMetasFinancieras] as b
			--where   idPrograma=69
			group by idPrograma,CodigoProducto,CodigoObjeto,[NombreObjeto]
			,Fuente,Financiador,CodigoDepartamento) as b
  on A.Id=b.idPrograma 
  inner join (
  SELECT  DISTINCT [CodigoNivel]
      ,cast ([CodigoEntidad] as int) as CodigoEntidad,
      cast([NombreEntidad] as varchar(60)) as Entidad
  FROM [dbo].[EstructuraEntidades] E)E
  on E.CodigoEntidad=a.CodigoEntidad AND A.Nivel=E.CodigoNivel
inner join [dbo].[ProyeccionRecursosITEMS] p

 on p.codigoprogramaNegocio=a.codigoprogramaNegocio
 and p.codigoProyectoActividad=a.CodigoProyecto
 and p.FuenteFinanciacion=b.Fuente and p.OrganismoFinanciador=b.Financiador

 WHERE   a.codigoprogramaNegocio not in ('') --('121311','121321') 
 and a.CodigoProyecto not in (20,29,25,26,40,43,61,62,63,64,65,66,68,69,70,71,73) --a.codigoprogramaNegocio not in (28121) --cambio 2020-11-18 peticon elvira
 --and [NombreActividadProyecto]='Proyectos del MOPC'
 --and NombreObjeto='CONSTRUCCIONES'
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
	   ,p.IdItem,
p.Item,
p.PlanificadoValorUSD,
p.TransferidoValorUSD)T
--where IdItem=4
	--	where [IdItem]!=6

